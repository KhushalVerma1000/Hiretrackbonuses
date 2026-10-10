// Planning starting points. "vm", "days" and "hrs" are assumptions to adjust, NOT industry statistics.
// Agency fee ranges come from published fee guides (see Toolkit.tsx sources).
export type Role = { id: string; label: string; vm: number; days: number; hrs: number; fee: string; why: string };
export const ROLES: Role[] = [
  { id: "entry", label: "Entry-level or support", vm: 1.0, days: 30, hrs: 25, fee: "Flat fee, or about 15% to 20%", why: "Output is close to salary; roles are easier to backfill." },
  { id: "mid", label: "Mid-level specialist", vm: 1.2, days: 45, hrs: 40, fee: "About 15% to 25%", why: "Skills are scarcer and the team leans on them." },
  { id: "sales", label: "Sales or revenue role", vm: 2.0, days: 45, hrs: 40, fee: "About 15% to 25%", why: "An empty seat can mean lost revenue, so set this from your own numbers." },
  { id: "senior", label: "Senior manager", vm: 1.5, days: 60, hrs: 60, fee: "About 20% to 25%, sometimes retained", why: "More interview rounds, and a team waits on the decision." },
  { id: "exec", label: "Executive", vm: 2.0, days: 90, hrs: 80, fee: "Usually retained, about 25% to 35%", why: "Longer searches, heavier internal time, bigger impact." },
];
