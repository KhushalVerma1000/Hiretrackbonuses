// Pure maths shared by the browser (live audit) and the server (emailed report), so both always agree.
// Everything is computed from the numbers the visitor enters. Target days default to PLANNING ASSUMPTIONS
// that the visitor is expected to edit; the verdict thresholds are assumptions too, not published statistics.
export type Owner = "us" | "client" | "candidate";
export type StageIn = { n: number; avg: number; old: number; tgt: number };
export type StageKey = "screen" | "ready" | "fb" | "int" | "offer" | "join";

export const GOOD = 0.1; // below 10% of waiting time over target = flowing (assumption)
export const BAD = 0.3; // 30% or more = stalled (assumption)
export const OLD_X = 2; // oldest candidate waiting 2x the target is flagged at risk (assumption)

export const STAGE_DEFS: { key: StageKey; label: string; short: string; owner: Owner; tgt: number; help: string }[] = [
  { key: "screen", label: "Waiting to be screened", short: "To screen", owner: "us", tgt: 2, help: "Sourced or applied, no screening call yet." },
  { key: "ready", label: "Screened, waiting to be submitted", short: "To submit", owner: "us", tgt: 2, help: "Passed screening but not yet sent to the client." },
  { key: "fb", label: "Submitted, waiting for client feedback", short: "Client feedback", owner: "client", tgt: 3, help: "Sent to the client, no answer yet." },
  { key: "int", label: "Interviewed, waiting for a decision", short: "Decision", owner: "client", tgt: 5, help: "Interview done, decision not given." },
  { key: "offer", label: "Offer made, waiting for an answer", short: "Offer pending", owner: "candidate", tgt: 3, help: "Offer out, candidate has not answered." },
  { key: "join", label: "Accepted, waiting to join", short: "To join", owner: "candidate", tgt: 30, help: "Accepted but not yet started. Set the target to the agreed notice period." },
];
export const OWNER_LABEL: Record<Owner, string> = { us: "your team", client: "the client", candidate: "candidates" };
export const ZERO: StageIn = { n: 0, avg: 0, old: 0, tgt: 0 };

export const HYGIENE: { q: string; fix: string }[] = [
  { q: "A feedback deadline is agreed with the client for every role", fix: "Agree a feedback deadline (for example 2 working days after each submission or interview) at the intake call, and put it in writing." },
  { q: "Every active candidate has a named next step and a date", fix: "Add a 'next step and date' to every candidate. Review any candidate without one in your weekly meeting." },
  { q: "A lead reviews each recruiter's pipeline at least weekly", fix: "Hold a 20-minute weekly pipeline review per recruiter, starting with the oldest waiting candidates." },
  { q: "Candidates hear a status update within 2 working days of any change", fix: "Send a short status message within 2 working days of every stage change, even when the news is 'still waiting'." },
  { q: "Pay and expectations are confirmed before a candidate is submitted", fix: "Confirm pay range, notice period and location with the candidate before submitting, to avoid late surprises." },
  { q: "A backup candidate is kept warm for every role at offer stage", fix: "Keep one backup candidate informed and interested for each role until the chosen candidate has joined." },
];

export const ACTIONS: Record<StageKey, { what: string; do: string[] }> = {
  screen: { what: "Candidates wait too long for a first conversation. The best ones accept other conversations in the meantime.", do: ["Screen new candidates within one working day, using a short fixed script.", "Block a daily 45-minute screening slot.", "Send a quick holding message the same day an application arrives."] },
  ready: { what: "Screened candidates are not reaching the client fast enough. Your own team is the delay.", do: ["Submit within one working day of a good screen.", "Use a one-page candidate summary template.", "Check at day end that no screened candidate is waiting to be sent."] },
  fb: { what: "The client is slow to react to submissions, and candidates cool off while they wait.", do: ["Chase on a fixed schedule: day 1 by message, day 2 by call.", "Agree a feedback deadline at the next intake and refer to it.", "Send 3 strong profiles at a time rather than a long list, to make deciding easier."] },
  int: { what: "Interviews happen but decisions drift. Candidates read silence as rejection.", do: ["Book the debrief call before the interview takes place.", "Ask the client what decision they will make by when, and write it down.", "Tell the candidate the expected decision date and keep to it."] },
  offer: { what: "Offers sit unanswered, which is when counter-offers and rival offers arrive.", do: ["Call the candidate the day the offer goes out and agree an answer date.", "Ask what could stop them accepting before the offer is made.", "Keep a backup candidate warm."] },
  join: { what: "Accepted candidates are waiting to start, and this is the stretch where candidates change their mind.", do: ["Agree the joining date in writing and check in weekly until day one.", "Share first-day details and introduce the team beforehand.", "Keep a backup candidate in touch until the person has joined."] },
};

export const VERDICT = ["Flowing", "Slowing", "Stalled"] as const;

export type StageResult = { key: StageKey; in: StageIn; over: number; debt: number; ratio: number | null; oldRisk: boolean; issue: string | null };
export type Audit = {
  stages: StageResult[]; total: number; debtTotal: number; share: number; verdict: 0 | 1 | 2;
  bottleneck: StageResult | null; byOwner: Record<Owner, number>; atRisk: StageResult[];
};

export const clampStage = (s: Partial<StageIn>): StageIn => ({
  n: Math.min(9999, Math.max(0, Math.floor(Number(s.n) || 0))),
  avg: Math.min(365, Math.max(0, Math.floor(Number(s.avg) || 0))),
  old: Math.min(365, Math.max(0, Math.floor(Number(s.old) || 0))),
  tgt: Math.min(365, Math.max(0, Math.floor(Number(s.tgt) || 0))),
});

export function audit(inputs: StageIn[]): Audit {
  const stages: StageResult[] = STAGE_DEFS.map((d, i) => {
    const x = inputs[i] ?? ZERO;
    const live = x.n > 0;
    const over = live && x.tgt > 0 ? Math.max(0, x.avg - x.tgt) : 0;
    return {
      key: d.key, in: x, over, debt: live ? x.n * over : 0,
      ratio: live && x.tgt > 0 ? Math.round((x.avg / x.tgt) * 10) / 10 : null,
      oldRisk: live && x.tgt > 0 && x.old > x.tgt * OLD_X,
      issue: live && x.old > 0 && x.old < x.avg ? `${d.label}: the oldest wait is shorter than the average. Check the numbers.` : null,
    };
  });
  const total = stages.reduce((t, s) => t + s.in.n * s.in.avg, 0);
  const debtTotal = stages.reduce((t, s) => t + s.debt, 0);
  const share = total > 0 ? Math.min(1, debtTotal / total) : 0;
  const verdict: Audit["verdict"] = share >= BAD ? 2 : share >= GOOD ? 1 : 0;
  const bottleneck = stages.filter((s) => s.debt > 0).sort((a, b) => b.debt - a.debt)[0] ?? null;
  const byOwner: Record<Owner, number> = { us: 0, client: 0, candidate: 0 };
  stages.forEach((s, i) => { byOwner[STAGE_DEFS[i].owner] += s.debt; });
  return { stages, total, debtTotal, share, verdict, bottleneck, byOwner, atRisk: stages.filter((s) => s.oldRisk) };
}

export const hasAny = (inputs: StageIn[]) => inputs.some((s) => s.n > 0);
export const topOwner = (a: Audit): Owner | null => {
  const e = (Object.entries(a.byOwner) as [Owner, number][]).sort((p, q) => q[1] - p[1])[0];
  return e && e[1] > 0 ? e[0] : null;
};
export const pctStr = (x: number) => `${Math.round(x * 100)}%`;
export const label = (k: StageKey) => STAGE_DEFS.find((d) => d.key === k)!.label;
export const shortLabel = (k: StageKey) => STAGE_DEFS.find((d) => d.key === k)!.short;

// Server side: the browser payload is untrusted, so rebuild clean records from it.
export function parsePayload(raw: unknown): { stages: StageIn[]; hyg: boolean[] } | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as { stages?: unknown; hyg?: unknown };
  if (!Array.isArray(o.stages) || o.stages.length !== STAGE_DEFS.length) return null;
  const stages = o.stages.map((s) => clampStage(s && typeof s === "object" ? (s as Partial<StageIn>) : {}));
  if (!hasAny(stages)) return null;
  const h = Array.isArray(o.hyg) ? o.hyg : [];
  return { stages, hyg: HYGIENE.map((_, i) => h[i] === true) };
}

export function reportCsv(inputs: StageIn[], hyg: boolean[]): string {
  const q = (v: string | number) => { let s = String(v); if (/^[=+\-@]/.test(s)) s = `'${s}`; return `"${s.replace(/"/g, '""')}"`; };
  const a = audit(inputs);
  const head = ["Stage", "Who owns the next step", "Candidates waiting", "Average days waiting", "Oldest wait (days)", "Target days", "Candidate-days over target", "Share of waiting time over target (%)", "Oldest candidate at risk"];
  const body = a.stages.map((s, i) => [STAGE_DEFS[i].label, OWNER_LABEL[STAGE_DEFS[i].owner], s.in.n, s.in.avg, s.in.old, s.in.tgt, s.debt, s.in.n * s.in.avg > 0 ? Math.round((s.debt / (s.in.n * s.in.avg)) * 1000) / 10 : "", s.oldRisk ? "Yes" : "No"]);
  const lines = [head, ...body, [], ["Process habit", "In place?"], ...HYGIENE.map((h, i) => [h.q, hyg[i] ? "Yes" : "No"])];
  return lines.map((r) => r.map(q).join(",")).join("\n");
}
