import type { BonusEmailBuilder } from "@/lib/email/types";
import { h2, list, p, table } from "@/lib/email/layout";
import { ACTIONS, BAND_INFO, parseCands, rankRows, reportCsv } from "./calc";

// The browser sends only numeric answers (no candidate names). We re-validate and recompute everything here.
export const buildEmail: BonusEmailBuilder = (payload) => {
  const cands = parseCands(payload && typeof payload === "object" ? (payload as { cands?: unknown }).cands : null);
  if (!cands) return null;
  const rows = rankRows(cands.map((c, i) => ({ label: `Candidate ${i + 1}`, c })));
  const first = rows[0], b = BAND_INFO[first.a.band], n = rows.length;

  const html = [
    p("Here is your personal ghosting risk report, based only on the answers you entered."),
    n > 1 ? table(rows.map((r) => [r.label, `${r.a.score}/100 (${BAND_INFO[r.a.band].name})`] as [string, string])) : "",
    h2(n > 1 ? `Act first: ${first.label}, ${first.a.score}/100 (${b.name})` : `Risk score: ${first.a.score}/100 (${b.name})`),
    p(b.play),
    ...first.a.top.flatMap((x) => [p(`${x.label} (${x.pts} of ${x.max} points)`, true), p(ACTIONS[x.key].what), list(ACTIONS[x.key].do), p(`Message to adapt: ${ACTIONS[x.key].msg}`, true)]),
    p("The score is a planning aid built on assumed weights, not a statistical prediction. Use it to decide who to follow up first, never to reject someone. A CSV with every candidate is attached.", true),
  ].join("");

  const text = [
    "Here is your personal ghosting risk report, based only on the answers you entered.", "",
    ...(n > 1 ? rows.map((r) => `- ${r.label}: ${r.a.score}/100 (${BAND_INFO[r.a.band].name})`).concat("") : []),
    n > 1 ? `Act first: ${first.label}, ${first.a.score}/100 (${b.name})` : `Risk score: ${first.a.score}/100 (${b.name})`, b.play, "",
    ...first.a.top.flatMap((x) => [`${x.label} (${x.pts} of ${x.max} points). ${ACTIONS[x.key].what}`, ...ACTIONS[x.key].do.map((d, i) => `${i + 1}. ${d}`), `Message to adapt: ${ACTIONS[x.key].msg}`, ""]),
    "The score is a planning aid built on assumed weights, not a statistical prediction. A CSV with every candidate is attached.",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");

  return {
    subject: n > 1 ? `Your ghosting risk report: ${n} candidates, highest ${first.a.score}/100` : `Your ghosting risk score: ${first.a.score}/100 (${b.name})`,
    preheader: `${first.a.top[0] ? `Biggest driver: ${first.a.top[0].label.toLowerCase()}. ` : ""}Here is what to do before they stop replying.`,
    html, text,
    attachments: [{ filename: "ghosting-risk-report.csv", content: reportCsv(rows), contentType: "text/csv" }],
  };
};
