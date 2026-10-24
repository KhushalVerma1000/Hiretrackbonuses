// Pure scoring shared by the browser (live score) and the server (emailed report), so both always agree.
// The weights below are PLANNING ASSUMPTIONS informed by published reasons candidates give for ghosting
// (see meta.ts benchmarks). They are not a statistical model. The Toolkit page prints this same table.
export type SelKey = "cp" | "py" | "rm" | "ns" | "en";
export type NumKey = "sd" | "rh" | "dp" | "nt";
export type Key = SelKey | NumKey;
export type Cand = { st: number; cp: number; sd: number; rh: number; py: number; rm: number; ns: number; en: number; dp: number; nt: number };

export const MAX_LIST = 10;
export const STAGES = ["Applied or sourced", "Screening call done", "Interviewed", "Offer made", "Offer accepted, waiting to join"];
export const DEFAULT: Cand = { st: 1, cp: 0, sd: 0, rh: 6, py: 0, rm: 0, ns: 0, en: 0, dp: 10, nt: 30 };

export const SELECTS: { key: SelKey; label: string; q: string; opts: string[]; pts: number[] }[] = [
  { key: "cp", label: "Competing opportunities", q: "Does the candidate have other options?", opts: ["None that you know of", "Interviewing elsewhere", "Has another offer"], pts: [0, 12, 22] },
  { key: "py", label: "Pay alignment", q: "Pay compared with what they expect", opts: ["At or above what they expect", "Slightly below (up to about 10%)", "Well below (more than about 10%)", "Not discussed yet"], pts: [0, 6, 12, 4] },
  { key: "rm", label: "Role match", q: "Does the role match how it was advertised?", opts: ["Matches", "Some differences", "Differs a lot or not explained"], pts: [0, 4, 8] },
  { key: "ns", label: "Next step clarity", q: "Is the next step agreed?", opts: ["Step and date agreed", "Step agreed, no date", "No next step shared"], pts: [0, 4, 8] },
  { key: "en", label: "Candidate engagement", q: "How does the candidate reply?", opts: ["Quickly, and asks questions", "Replies, but short or slow", "Only after reminders"], pts: [0, 4, 8] },
];
// bands: [upTo, points]; the last band has no upper limit.
export const BANDED: { key: NumKey; label: string; q: string; unit: string; cap: number; bands: [number, number][]; note?: string }[] = [
  { key: "sd", label: "Silence from the candidate", q: "Days since the candidate last replied", unit: "days", cap: 60, bands: [[1, 0], [3, 5], [6, 10], [13, 15], [Infinity, 20]] },
  { key: "rh", label: "Your reply speed", q: "Hours you usually take to reply to them", unit: "hours", cap: 240, bands: [[4, 0], [24, 3], [48, 7], [Infinity, 12]] },
  { key: "dp", label: "Time in process", q: "Days since first contact", unit: "days", cap: 180, bands: [[14, 0], [30, 2], [45, 3], [Infinity, 5]] },
  { key: "nt", label: "Notice period", q: "Candidate's notice period (days)", unit: "days", cap: 180, bands: [[30, 0], [60, 2], [90, 4], [Infinity, 5]], note: "Counted only once an offer is made." },
];

export const BAND_INFO = [
  { name: "Low", range: "0 to 24", play: "Keep the rhythm: confirm the next step in writing after every contact and keep replies fast." },
  { name: "Moderate", range: "25 to 49", play: "Add a touchpoint in the next 24 hours and settle the one or two open risks below." },
  { name: "High", range: "50 to 74", play: "Call rather than message within a few hours, ask openly about their situation, and agree the next step and date." },
  { name: "Critical", range: "75 to 100", play: "Treat as likely to vanish soon: speak live today, ask what would stop them going ahead, and keep a backup candidate warm." },
];
export const bandOf = (score: number) => (score >= 75 ? 3 : score >= 50 ? 2 : score >= 25 ? 1 : 0);

// What to do about each factor. Advice and message drafts, not statistics. Replace [brackets] before sending.
export const ACTIONS: Record<Key, { what: string; do: string[]; msg: string }> = {
  cp: { what: "The candidate has, or may soon have, another option. Accepting another job is the most common reason candidates give for ghosting.", do: ["Ask kindly where they are in their search and by when they need to decide.", "Share your decision timeline and keep to it, so you are not the slowest option.", "Find the one thing that matters most to them (pay, growth, location) and address it."], msg: "Hi, I'd like to move at a pace that works for you. Where are you in your search, and is there a date by which you need to decide? If you have other options, I'd like to know so we can plan around them." },
  sd: { what: "The candidate has gone quiet. Silence usually means something changed, not that they are being rude.", do: ["Call once, then send the same message on their preferred channel.", "Make replying easy by asking a yes or no question.", "Set a last-follow-up date and tell them what happens after it."], msg: "Hi, I haven't heard back and I don't want to take your time if things have changed. Are you still interested in the role? A quick yes or no is fine. If yes, what is the best time to talk?" },
  rh: { what: "Slow replies from your side signal low priority and give other employers a head start.", do: ["Reply within 4 hours on working days, even if only to say when you will have the answer.", "Block fixed times in the day for candidate replies.", "Keep saved replies for common questions."], msg: "Sorry for the delay on my side. Here is where things stand: [update]. The next step is [step] on [date]." },
  py: { what: "Pay is not aligned or has not been discussed. Uncompetitive pay is a commonly cited reason for candidates dropping out.", do: ["Confirm the pay range and the candidate's expectation now, before more interviews.", "If there is a gap, tell the hiring manager early and ask whether it can close.", "Present the full package, not only the base pay."], msg: "Before we go further I want to be sure the pay works for you. The range for this role is [range]. How does that compare with what you are looking for?" },
  rm: { what: "A role that differs from the advert makes candidates lose trust and disengage.", do: ["Walk through the real day-to-day work, team and reporting line.", "Correct anything in the advert that is out of date.", "Ask what they expect and note any gap."], msg: "I want to make sure the role matches what you expect. The main responsibilities are [list], and a typical week looks like [summary]. Does anything here surprise you?" },
  ns: { what: "With no agreed next step, candidates guess, and guessing turns into drifting away.", do: ["End every contact with a named next step and a date.", "Confirm it in writing the same day.", "If you are waiting on someone, say who and by when."], msg: "To confirm: next is [step] on [date]. I will update you by [day] either way. Does that work for you?" },
  en: { what: "The candidate replies slowly or only after reminders, an early sign of fading interest.", do: ["Ask which channel and time suit them best (call, messaging app or email).", "Ask an open question about what they are weighing up.", "Keep each message to one question."], msg: "What is the easiest way to reach you, and what time of day works best? Also, what is the one thing that would make this role a clear yes for you?" },
  dp: { what: "The longer a process runs, the more chances for another offer or lost momentum.", do: ["Set dates for each remaining step and compress where you can.", "Combine or run interview rounds back to back.", "Share the full timeline up front."], msg: "I know this has taken a while, thank you for your patience. The remaining steps are [steps], and I expect a decision by [date]." },
  nt: { what: "A long notice period leaves time for a counter-offer or a change of mind between offer and joining.", do: ["Agree a joining date in writing and ask whether an earlier release is possible.", "Keep in touch every week until day one. A short note is enough.", "Send first-day details and introduce the team before they join."], msg: "Congratulations again. To make joining smooth, can we agree a short check-in each week until your start date on [date]? Please tell me early if anything changes." },
};

export type Part = { key: Key; label: string; pts: number; max: number };
const bandPts = (bands: [number, number][], v: number) => (bands.find(([up]) => v <= up) ?? bands[bands.length - 1])[1];

export function analyse(c: Cand) {
  const parts: Part[] = [
    ...SELECTS.map((s) => ({ key: s.key, label: s.label, pts: s.pts[c[s.key]] ?? 0, max: Math.max(...s.pts) })),
    ...BANDED.map((b) => ({ key: b.key, label: b.label, pts: b.key === "nt" && c.st < 3 ? 0 : bandPts(b.bands, c[b.key]), max: b.bands[b.bands.length - 1][1] })),
  ];
  const score = Math.min(100, parts.reduce((a, p) => a + p.pts, 0));
  const top = parts.filter((p) => p.pts > 0).sort((a, b) => b.pts - a.pts).slice(0, 3);
  return { score, band: bandOf(score), parts, top };
}

export type Row = { label: string; c: Cand };
export const rankRows = <T extends Row>(rows: T[]) => rows.map((r) => ({ ...r, a: analyse(r.c) })).sort((x, y) => y.a.score - x.a.score);

// Server side: the browser payload is untrusted, so rebuild clean candidates from it.
export function parseCands(raw: unknown): Cand[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: Cand[] = [];
  for (const o of raw.slice(0, MAX_LIST)) {
    if (!o || typeof o !== "object") return null;
    const r = o as Record<string, unknown>;
    const n = (k: keyof Cand, max: number) => { const v = Math.floor(Number(r[k])); return Number.isFinite(v) ? Math.min(Math.max(v, 0), max) : DEFAULT[k]; };
    out.push({
      st: n("st", STAGES.length - 1), cp: n("cp", SELECTS[0].opts.length - 1), py: n("py", SELECTS[1].opts.length - 1), rm: n("rm", SELECTS[2].opts.length - 1),
      ns: n("ns", SELECTS[3].opts.length - 1), en: n("en", SELECTS[4].opts.length - 1),
      sd: n("sd", BANDED[0].cap), rh: n("rh", BANDED[1].cap), dp: n("dp", BANDED[2].cap), nt: n("nt", BANDED[3].cap),
    });
  }
  return out;
}

export function bandRows(b: (typeof BANDED)[number]): [string, number][] {
  let prev = -1;
  return b.bands.map(([up, p]) => {
    const t = up === Infinity ? `more than ${prev} ${b.unit}` : prev < 0 ? `0 to ${up} ${b.unit}` : `${prev + 1} to ${up} ${b.unit}`;
    prev = up;
    return [t, p];
  });
}

export function reportCsv(rows: Row[]): string {
  // Cells starting with = + - @ can run as formulas in Excel, so prefix them.
  const q = (v: string | number) => { let s = String(v); if (/^[=+\-@]/.test(s)) s = `'${s}`; return `"${s.replace(/"/g, '""')}"`; };
  const head = ["Candidate", "Risk score (0-100)", "Risk band", "Stage", "Top driver 1", "Top driver 2", "Top driver 3", "Days since last reply", "Your reply time (hours)", "Days in process", "Notice period (days)"];
  const body = rankRows(rows).map((r) => [r.label, r.a.score, BAND_INFO[r.a.band].name, STAGES[r.c.st], r.a.top[0]?.label ?? "", r.a.top[1]?.label ?? "", r.a.top[2]?.label ?? "", r.c.sd, r.c.rh, r.c.dp, r.c.st >= 3 ? r.c.nt : ""]);
  return [head, ...body].map((row) => row.map(q).join(",")).join("\n");
}
