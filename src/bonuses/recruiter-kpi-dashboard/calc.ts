// Pure maths shared by the browser (live dashboard) and the server (emailed report), so both always agree.
// Every figure is computed from the numbers the visitor enters. The reference rates below are PLANNING
// ASSUMPTIONS used only when there is no team to compare against. They are not published statistics.
export type Rec = { roles: number; sub: number; int: number; off: number; acc: number; join: number; days: number };
export type RecKey = keyof Rec;

export const MAX_LIST = 10;
export const MIN_SUB = 10; // below this many submissions a closing rate is too noisy to judge (assumption)
export const MIN_DEN = 5; // a stage rate is compared only when at least this many people entered it (assumption)
export const GAP = 0.05; // a stage must trail the comparison rate by 5+ points to count as a leak (assumption)

export const FIELDS: { key: RecKey; label: string; short: string; cap: number; help: string }[] = [
  { key: "roles", label: "Roles worked", short: "Roles", cap: 999, help: "Open roles this recruiter actively worked in the period." },
  { key: "sub", label: "Candidates submitted", short: "Submitted", cap: 9999, help: "Candidates sent to the client or hiring manager." },
  { key: "int", label: "Candidates interviewed", short: "Interviewed", cap: 9999, help: "Submitted candidates who had an interview." },
  { key: "off", label: "Offers made", short: "Offers", cap: 9999, help: "Candidates who received an offer." },
  { key: "acc", label: "Offers accepted", short: "Accepted", cap: 9999, help: "Offers the candidate accepted." },
  { key: "join", label: "Candidates joined", short: "Joined", cap: 9999, help: "Accepted candidates who actually started." },
  { key: "days", label: "Average days to fill", short: "Days to fill", cap: 365, help: "Average calendar days from role opening to acceptance for roles filled. Leave 0 if unknown." },
];
export const ZERO: Rec = { roles: 0, sub: 0, int: 0, off: 0, acc: 0, join: 0, days: 0 };

// Funnel stages. Each rate is people who reached the next stage divided by people who entered this one.
export type StageKey = "si" | "io" | "oa" | "aj";
export const STAGES: { key: StageKey; label: string; from: RecKey; to: RecKey; ref: number }[] = [
  { key: "si", label: "Submitted to interviewed", from: "sub", to: "int", ref: 0.25 },
  { key: "io", label: "Interviewed to offer", from: "int", to: "off", ref: 0.33 },
  { key: "oa", label: "Offer to accepted", from: "off", to: "acc", ref: 0.8 },
  { key: "aj", label: "Accepted to joined", from: "acc", to: "join", ref: 0.9 },
];

export const EXAMPLE: { label: string; r: Rec }[] = [
  { label: "Recruiter A", r: { roles: 6, sub: 48, int: 20, off: 7, acc: 6, join: 5, days: 31 } },
  { label: "Recruiter B", r: { roles: 8, sub: 90, int: 24, off: 5, acc: 3, join: 2, days: 47 } },
  { label: "Recruiter C", r: { roles: 5, sub: 30, int: 14, off: 6, acc: 5, join: 5, days: 28 } },
];

export const STATUS = ["Not enough data", "Team of one", "Below team", "In line with team", "Above team"] as const;

export const ACTIONS: Record<StageKey, { what: string; ask: string[]; do: string[] }> = {
  si: {
    what: "Clients are not choosing this recruiter's submissions for interview. Usually the brief was not fully understood, or the profiles sent do not match it.",
    ask: ["Which three submitted candidates were passed over, and what reason did the client give?", "What did you confirm with the client about must-haves before you started sourcing?"],
    do: ["Re-run the intake call: agree 3 must-haves, 3 nice-to-haves and one example of a good profile.", "Send 3 strong profiles with a two-line reason for each rather than a long list.", "Ask for written feedback on every pass and log the reason."],
  },
  io: {
    what: "Candidates reach interview but do not get offers. Either the match is weaker than the CV suggested, or candidates are not prepared.",
    ask: ["What did interviewers say about the candidates who did not get an offer?", "How did you brief the candidate before the interview?"],
    do: ["Run a 10-minute screening call against the client's must-haves before submitting.", "Brief every candidate on the role, the team, the interview format and what the client values.", "Collect interview feedback within 24 hours and share it with the next candidate's prep."],
  },
  oa: {
    what: "Offers are being declined. Common causes are pay that was not agreed early, a long wait for the offer, or a counter-offer from the current employer.",
    ask: ["Was pay confirmed before the first interview?", "How many days passed between the last interview and the offer?"],
    do: ["Confirm the pay range and the candidate's expectation before interviews start.", "Pre-close: ask what would stop them accepting, before the offer is made.", "Agree an offer deadline and call the candidate the day the offer goes out."],
  },
  aj: {
    what: "Candidates accept but do not join. Long notice periods and counter-offers leave room for a change of mind.",
    ask: ["How often did you speak to the candidate between acceptance and day one?", "Did the candidate know the first-day plan and the team?"],
    do: ["Agree a joining date in writing and check in every week until day one.", "Share first-day details and introduce the team before the start date.", "Keep a backup candidate warm until the person has actually joined."],
  },
};

export type Rate = number | null; // 0..1, or null when the stage has no one entering it
export const pct = (x: Rate) => (x == null ? "–" : `${Math.round(x * 1000) / 10}%`);
const rate = (num: number, den: number): Rate => (den > 0 ? Math.min(1, num / den) : null);

export type Analysis = {
  rates: Record<StageKey, Rate>;
  closing: Rate; // joined / submitted
  perRole: number | null; // joined per role worked
  issues: string[]; // data problems the visitor should check
  leak: { stage: StageKey; rate: number; base: number; lost: number } | null;
  status: 0 | 1 | 2 | 3 | 4;
};

export function sumRecs(rs: Rec[]): Rec {
  const t = { ...ZERO };
  let dn = 0, dsum = 0;
  for (const r of rs) {
    (["roles", "sub", "int", "off", "acc", "join"] as RecKey[]).forEach((k) => { t[k] += r[k]; });
    if (r.days > 0 && r.join > 0) { dn += r.join; dsum += r.days * r.join; }
  }
  t.days = dn > 0 ? Math.round(dsum / dn) : 0; // weighted by candidates joined
  return t;
}

export const hasData = (r: Rec) => r.sub > 0 || r.int > 0 || r.off > 0 || r.acc > 0 || r.join > 0;

export function analyse(r: Rec, team: Rec | null): Analysis {
  const rates = Object.fromEntries(STAGES.map((s) => [s.key, rate(r[s.to], r[s.from])])) as Record<StageKey, Rate>;
  const issues: string[] = [];
  for (const s of STAGES) if (r[s.to] > r[s.from]) issues.push(`${FIELDS.find((f) => f.key === s.to)!.label} is higher than ${FIELDS.find((f) => f.key === s.from)!.label.toLowerCase()}. Check dates and counts; the rate is capped at 100%.`);
  const closing = rate(r.join, r.sub);
  const perRole = r.roles > 0 ? Math.round((r.join / r.roles) * 100) / 100 : null;

  let best: Analysis["leak"] = null, worstGap = -GAP;
  for (const s of STAGES) {
    const x = rates[s.key];
    if (x == null || r[s.from] < MIN_DEN) continue;
    const base = team ? rate(team[s.to], team[s.from]) ?? s.ref : s.ref;
    const gap = x - base;
    if (gap < worstGap) { worstGap = gap; best = { stage: s.key, rate: x, base, lost: Math.max(0, r[s.from] - r[s.to]) }; }
  }

  let status: Analysis["status"] = 0;
  if (r.sub >= MIN_SUB && closing != null) {
    const tc = team ? rate(team.join, team.sub) : null;
    if (!team || tc == null) status = 1;
    else if (closing < tc * 0.8) status = 2;
    else if (closing > tc * 1.2) status = 4;
    else status = 3;
  }
  return { rates, closing, perRole, issues, leak: best, status };
}

export type Row = { label: string; r: Rec };
export function analyseAll<T extends Row>(rows: T[]) {
  const live = rows.filter((x) => hasData(x.r));
  const team = live.length >= 2 ? sumRecs(live.map((x) => x.r)) : null;
  const total = sumRecs(live.map((x) => x.r));
  const ranked = live
    .map((x) => ({ ...x, a: analyse(x.r, team) }))
    .sort((p, q) => {
      const pa = p.a.status === 0 ? 1 : 0, qa = q.a.status === 0 ? 1 : 0;
      if (pa !== qa) return pa - qa;
      return (q.a.closing ?? -1) - (p.a.closing ?? -1) || q.r.join - p.r.join;
    });
  return { team, total, ranked, teamAnalysis: analyse(total, null) };
}

// Server side: the browser payload is untrusted, so rebuild clean records from it.
export function parseRecs(raw: unknown): Rec[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: Rec[] = [];
  for (const o of raw.slice(0, MAX_LIST)) {
    if (!o || typeof o !== "object") return null;
    const x = o as Record<string, unknown>;
    const r = { ...ZERO };
    for (const f of FIELDS) { const v = Math.floor(Number(x[f.key])); r[f.key] = Number.isFinite(v) ? Math.min(Math.max(v, 0), f.cap) : 0; }
    out.push(r);
  }
  return out.some(hasData) ? out : null;
}

export function reportCsv(rows: Row[]): string {
  // Cells starting with = + - @ can run as formulas in Excel, so prefix them.
  const q = (v: string | number) => { let s = String(v); if (/^[=+\-@]/.test(s)) s = `'${s}`; return `"${s.replace(/"/g, '""')}"`; };
  const num = (x: Rate) => (x == null ? "" : Math.round(x * 1000) / 10);
  const head = ["Recruiter", ...FIELDS.map((f) => f.label), ...STAGES.map((s) => `${s.label} (%)`), "Closing rate: joined / submitted (%)", "Joined per role", "Status", "Biggest leak"];
  const { ranked } = analyseAll(rows);
  const body = ranked.map(({ label, r, a }) => [label, ...FIELDS.map((f) => r[f.key]), ...STAGES.map((s) => num(a.rates[s.key])), num(a.closing), a.perRole ?? "", STATUS[a.status], a.leak ? STAGES.find((s) => s.key === a.leak!.stage)!.label : ""]);
  return [head, ...body].map((row) => row.map(q).join(",")).join("\n");
}
