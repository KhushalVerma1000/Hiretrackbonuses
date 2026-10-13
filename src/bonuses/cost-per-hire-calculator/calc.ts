// Pure calculation shared by the browser (live result) and the server (emailed report), so both always agree.
export type Inputs = { cur: string; sal: number; days: number; hrs: number; rate: number; ads: number; fee: number; onb: number; vm: number; mo: number; un: number };
export const DEFAULTS: Inputs = { cur: "INR", sal: 600000, days: 45, hrs: 40, rate: 500, ads: 8000, fee: 0, onb: 15000, vm: 1, mo: 4, un: 50 };

export const CUR: [string, string, string][] = [
  ["INR", "en-IN", "INR (₹)"], ["USD", "en-US", "USD ($)"], ["EUR", "de-DE", "EUR (€)"], ["GBP", "en-GB", "GBP (£)"],
  ["AED", "en-AE", "AED"], ["SGD", "en-SG", "SGD"], ["AUD", "en-AU", "AUD"], ["CAD", "en-CA", "CAD"],
];
// What to do about each cost driver. Advice, not statistics. "track" is the HireTrack action for that driver.
export const DRIVER: Record<string, { what: string; a: string; b: string; track: string }> = {
  "Agency fee": { what: "Agency fees are the largest share of your cost per hire.", a: "Negotiate the fee for repeat or high-volume roles, and compare it with sourcing in-house for roles you fill often.", b: "Check how long the replacement guarantee lasts, so a quick exit does not mean paying twice.", track: "Log which roles and sources came through agencies, so you can compare cost per hire by source." },
  "Internal time": { what: "Your own team's time is the largest share of your cost per hire.", a: "Agree a scorecard before the first interview to cut interview rounds.", b: "Batch screening calls and reply to candidates within 24 hours so you do not redo work with drifting candidates.", track: "Track hours and drop-off per stage for each role to see where time is spent without result." },
  "Ads and tools": { what: "Job ads and tools are the largest share of your cost per hire.", a: "Compare spend on each job board with the number of hires it produced.", b: "Drop channels that bring volume but no hires.", track: "Record the source of hire for every candidate." },
  "Onboarding": { what: "Onboarding is the largest share of your cost per hire.", a: "Standardise a first-week checklist so each hire needs less manager time.", b: "Prepare equipment and access before day one.", track: "Track onboarding completion and exits in the first 90 days for each hire." },
  "Vacant seat": { what: "The empty seat is the largest share of your cost per hire, so speed matters most.", a: "Set a days-to-fill target for each role and review stalled roles weekly.", b: "Follow up with candidates within 24 hours. Silence is how good candidates drift away.", track: "Track every candidate stage in one place and set a goal for each role and recruiter." },
};


// Server side: the browser payload is untrusted, so rebuild a clean Inputs object from it.
export function parseInputs(raw: unknown): Inputs | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const cur = typeof o.cur === "string" && CUR.some((c) => c[0] === o.cur) ? o.cur : null;
  if (!cur) return null;
  const n = (k: keyof Inputs, max: number) => { const v = Number(o[k]); return Number.isFinite(v) ? Math.min(Math.max(v, 0), max) : DEFAULTS[k] as number; };
  return { cur, sal: n("sal", 1e10), days: n("days", 3650), hrs: n("hrs", 100000), rate: n("rate", 1e7), ads: n("ads", 1e10), fee: n("fee", 100), onb: n("onb", 1e10), vm: n("vm", 100), mo: n("mo", 600), un: n("un", 100) };
}

export function compute(s: Inputs) {
  const loc = CUR.find((c) => c[0] === s.cur)![1];
  const f = (n: number) => new Intl.NumberFormat(loc, { style: "currency", currency: s.cur, maximumFractionDigits: 0 }).format(n);
  const agency = (s.sal * Math.min(s.fee, 100)) / 100, internal = s.hrs * s.rate;
  const vac = (s.sal / 260) * s.vm * s.days, direct = agency + internal + s.ads;
  const total = direct + s.onb + vac;
  const bad = direct + vac + ((s.sal / 12) * s.mo * Math.min(s.un, 100)) / 100;
  const parts: [string, number, string][] = [["Agency fee", agency, "#f27d72"], ["Internal time", internal, "#f3b45a"], ["Ads and tools", s.ads, "#6fb7e9"], ["Onboarding", s.onb, "#7fcf8e"], ["Vacant seat", vac, "#b58de0"]];
  const top = parts.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { f, total, bad, parts, direct, top, pct: total ? Math.round((top[1] / total) * 100) : 0 };
}

export function reportCsv(s: Inputs, r: ReturnType<typeof compute>): string {
  const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows: (string | number)[][] = [
    ["HireTrack cost-per-hire report"], ["Currency", s.cur], [],
    ["Inputs"], ["Annual salary", s.sal], ["Days the role stays open", s.days], ["Internal hours per hire", s.hrs], ["Cost per internal hour", s.rate],
    ["Job ads and tools per hire", s.ads], ["Agency fee (% of salary)", s.fee], ["Onboarding and training cost", s.onb], ["Value factor", s.vm],
    ["Months before a bad hire leaves", s.mo], ["% of that time unproductive", s.un], [],
    ["Result"], ...r.parts.map((p) => [p[0], Math.round(p[1])]),
    ["Total cost to fill one role", Math.round(r.total)], ["Direct cost per hire (agency + internal time + ads)", Math.round(r.direct)],
    ["Estimated cost of one bad hire", Math.round(r.bad)], ["Biggest cost driver", `${r.top[0]} (${r.pct}%)`],
  ];
  return rows.map((row) => row.map(q).join(",")).join("\n");
}
