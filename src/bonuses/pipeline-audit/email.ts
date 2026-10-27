import type { BonusEmailBuilder } from "@/lib/email/types";
import { h2, list, p, table } from "@/lib/email/layout";
import { ACTIONS, HYGIENE, OWNER_LABEL, STAGE_DEFS, VERDICT, audit, label, parsePayload, pctStr, reportCsv, shortLabel, topOwner } from "./calc";

// The browser sends only numbers and yes/no answers. We re-validate and recompute everything here.
export const buildEmail: BonusEmailBuilder = (payload) => {
  const parsed = parsePayload(payload);
  if (!parsed) return null;
  const { stages, hyg } = parsed;
  const a = audit(stages);
  const owner = topOwner(a);
  const b = a.bottleneck;
  const misses = HYGIENE.filter((_, i) => !hyg[i]);

  const headline = a.debtTotal === 0 ? "No stage is over its target" : `Your pipeline is ${VERDICT[a.verdict].toLowerCase()}: ${pctStr(a.share)} of waiting time is over target`;
  const html = [
    p("Here is your pipeline audit, based only on the numbers you entered."),
    h2(headline),
    b ? p(`Biggest bottleneck: ${label(b.key)}. ${b.in.n} candidates have waited ${b.in.avg} days on average against a target of ${b.in.tgt}, about ${b.debt} candidate-days over target. ${ACTIONS[b.key].what}`) : p("Keep checking every week; stalls build quietly."),
    owner ? p(`Most of the delay sits with ${OWNER_LABEL[owner]}.`) : "",
    table(a.stages.map((s, i) => [STAGE_DEFS[i].label, s.in.n ? `${s.in.n} waiting, avg ${s.in.avg}d (target ${s.in.tgt}d)${s.oldRisk ? ", oldest at risk" : ""}` : "none"] as [string, string])),
    ...(a.atRisk.length ? [h2("Contact these candidates first"), list(a.atRisk.map((s) => `${label(s.key)}: the oldest candidate has waited ${s.in.old} days against a target of ${s.in.tgt}.`))] : []),
    ...(b ? [h2(`Fix the bottleneck: ${label(b.key)}`), list(ACTIONS[b.key].do)] : []),
    ...(misses.length ? [h2(`Process habits to put in place (${HYGIENE.length - misses.length} of ${HYGIENE.length} today)`), list(misses.map((m) => m.fix))] : [p("You have all six process habits in place. Keep reviewing weekly.")]),
    p("This is a planning aid built on your numbers, not a verdict. Targets and thresholds are assumptions you can change. A CSV is attached.", true),
  ].join("");

  const text = [
    "Here is your pipeline audit, based only on the numbers you entered.", "", headline,
    b ? `Biggest bottleneck: ${label(b.key)}. ${b.in.n} candidates waiting ${b.in.avg} days on average against a target of ${b.in.tgt}. ${ACTIONS[b.key].what}` : "",
    owner ? `Most of the delay sits with ${OWNER_LABEL[owner]}.` : "", "",
    ...a.stages.map((s, i) => `${STAGE_DEFS[i].label}: ${s.in.n ? `${s.in.n} waiting, avg ${s.in.avg}d (target ${s.in.tgt}d)${s.oldRisk ? ", oldest at risk" : ""}` : "none"}`), "",
    ...(a.atRisk.length ? ["Contact first:", ...a.atRisk.map((s) => `- ${label(s.key)}: oldest waited ${s.in.old} days (target ${s.in.tgt})`), ""] : []),
    ...(b ? ["Fix the bottleneck:", ...ACTIONS[b.key].do.map((d, i) => `${i + 1}. ${d}`), ""] : []),
    ...(misses.length ? ["Process habits to put in place:", ...misses.map((m) => `- ${m.fix}`), ""] : []),
    "This is a planning aid built on your numbers, not a verdict. A CSV is attached.",
  ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "").join("\n");

  return {
    subject: b ? `Your pipeline audit: ${shortLabel(b.key).toLowerCase()} is the bottleneck` : "Your pipeline audit: no stage over target",
    preheader: owner ? `Most of the delay sits with ${OWNER_LABEL[owner]}. Here is what to fix first.` : "Here is where your pipeline stands.",
    html, text,
    attachments: [{ filename: "pipeline-audit.csv", content: reportCsv(stages, hyg), contentType: "text/csv" }],
  };
};
