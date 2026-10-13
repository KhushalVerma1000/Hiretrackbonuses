import type { BonusEmailBuilder } from "@/lib/email/types";
import { big, h2, list, p, table } from "@/lib/email/layout";
import { DRIVER, compute, parseInputs, reportCsv } from "./calc";

// The browser sends only the calculator inputs. We re-validate them and recompute everything here,
// so nobody can make us send an email containing numbers or text they invented.
export const buildEmail: BonusEmailBuilder = (payload) => {
  const s = parseInputs(payload);
  if (!s) return null;
  const r = compute(s);
  const d = DRIVER[r.top[0]];
  const usd = s.cur === "USD" ? `Your direct cost per hire is ${r.f(r.direct)}. SHRM's 2026 US medians are $1,300 for non-executive and $15,000 for executive roles. Definitions differ, so treat this as a rough guide.` : "";

  const html = [
    p("Here is your personal cost-per-hire report, based only on the numbers you entered."),
    p("Total cost to fill one role", true), big(r.f(r.total)),
    table(r.parts.map((x) => [x[0], r.f(x[1])] as [string, string])),
    p(`If this hire leaves early, one bad hire could cost about ${r.f(r.bad)}.`),
    h2(`Your biggest cost driver: ${r.top[0]} (${r.pct}% of the total)`),
    p(d.what), list([d.a, d.b]),
    p(`What to track next: ${d.track}`),
    usd ? p(usd, true) : "",
    p("The numbers are also attached as a CSV you can open in Excel or Google Sheets.", true),
  ].join("");

  const text = [
    "Here is your personal cost-per-hire report, based only on the numbers you entered.", "",
    `Total cost to fill one role: ${r.f(r.total)}`,
    ...r.parts.map((x) => `- ${x[0]}: ${r.f(x[1])}`),
    `One bad hire could cost about ${r.f(r.bad)}.`, "",
    `Your biggest cost driver: ${r.top[0]} (${r.pct}% of the total)`, d.what, `1. ${d.a}`, `2. ${d.b}`, "",
    `What to track next: ${d.track}`, usd, "",
    "The numbers are also attached as a CSV.",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");

  return {
    subject: `Your cost-per-hire report: ${r.f(r.total)} to fill one role`,
    preheader: `Your biggest cost driver is ${r.top[0].toLowerCase()} (${r.pct}%). Here is what to do about it.`,
    html, text,
    attachments: [{ filename: "cost-per-hire-report.csv", content: reportCsv(s, r), contentType: "text/csv" }],
  };
};
