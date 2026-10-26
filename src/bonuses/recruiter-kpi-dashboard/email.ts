import type { BonusEmailBuilder } from "@/lib/email/types";
import { h2, list, p, table } from "@/lib/email/layout";
import { ACTIONS, MIN_SUB, STAGES, STATUS, analyseAll, parseRecs, pct, reportCsv } from "./calc";

// The browser sends only numeric counts (no recruiter names). We re-validate and recompute everything here.
export const buildEmail: BonusEmailBuilder = (payload) => {
  const recs = parseRecs(payload && typeof payload === "object" ? (payload as { recs?: unknown }).recs : null);
  if (!recs) return null;
  const rows = recs.map((r, i) => ({ label: `Recruiter ${i + 1}`, r }));
  const { ranked, total, teamAnalysis } = analyseAll(rows);
  if (!ranked.length) return null;
  const leakName = (k: string) => STAGES.find((s) => s.key === k)!.label;
  const n = ranked.length;

  const html = [
    p("Here is your recruiter coaching plan, based only on the counts you entered."),
    h2(`Team: ${pct(teamAnalysis.closing)} closing, ${total.join} joined`),
    table([["Submitted", String(total.sub)], ["Interviewed", String(total.int)], ["Offers", String(total.off)], ["Accepted", String(total.acc)], ["Joined", String(total.join)]]),
    n > 1 ? table(ranked.map((x) => [x.label, x.a.status === 0 ? "Not enough data" : `${pct(x.a.closing)} (${STATUS[x.a.status]})`] as [string, string])) : "",
    ...ranked.flatMap((x) => [
      h2(x.label),
      x.a.leak
        ? p(`Coach first: ${leakName(x.a.leak.stage)}. ${pct(x.a.leak.rate)} against ${pct(x.a.leak.base)}, about ${x.a.leak.lost} candidates lost. ${ACTIONS[x.a.leak.stage].what}`)
        : p(x.a.status === 0 ? `Collect at least ${MIN_SUB} submissions before drawing conclusions.` : "No stage trails the comparison by 5 points or more. Keep the rhythm and review again next period."),
      ...(x.a.leak ? [p("Ask in the one-to-one", true), list(ACTIONS[x.a.leak.stage].ask), p("Try this month", true), list(ACTIONS[x.a.leak.stage].do)] : []),
    ]),
    p("This is a planning aid built on your counts, not a verdict on people. Compare like with like and look across several months. A CSV with every recruiter is attached.", true),
  ].join("");

  const text = [
    "Here is your recruiter coaching plan, based only on the counts you entered.", "",
    `Team: ${pct(teamAnalysis.closing)} closing, ${total.join} joined (submitted ${total.sub}, interviewed ${total.int}, offers ${total.off}, accepted ${total.acc})`, "",
    ...ranked.flatMap((x) => [
      `${x.label}: ${x.a.status === 0 ? "not enough data" : `${pct(x.a.closing)} closing (${STATUS[x.a.status].toLowerCase()})`}`,
      ...(x.a.leak ? [`Coach first: ${leakName(x.a.leak.stage)}. ${pct(x.a.leak.rate)} against ${pct(x.a.leak.base)}. ${ACTIONS[x.a.leak.stage].what}`, ...ACTIONS[x.a.leak.stage].ask.map((q) => `Ask: ${q}`), ...ACTIONS[x.a.leak.stage].do.map((d, i) => `${i + 1}. ${d}`)] : []),
      "",
    ]),
    "This is a planning aid built on your counts, not a verdict on people. A CSV with every recruiter is attached.",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");

  return {
    subject: `Your recruiter KPI report: ${n} recruiter${n > 1 ? "s" : ""}, team closing ${pct(teamAnalysis.closing)}`,
    preheader: ranked.find((x) => x.a.leak) ? `Biggest leak: ${leakName(ranked.find((x) => x.a.leak)!.a.leak!.stage).toLowerCase()}. Here is what to coach.` : "Here is who is closing and what to coach next.",
    html, text,
    attachments: [{ filename: "recruiter-kpi-report.csv", content: reportCsv(rows), contentType: "text/csv" }],
  };
};
