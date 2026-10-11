"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CONSENT_TEXT } from "@/lib/consent";
import { ROLES } from "./toolkit-data";

const CUR: [string, string, string][] = [
  ["INR", "en-IN", "INR (₹)"], ["USD", "en-US", "USD ($)"], ["EUR", "de-DE", "EUR (€)"], ["GBP", "en-GB", "GBP (£)"],
  ["AED", "en-AE", "AED"], ["SGD", "en-SG", "SGD"], ["AUD", "en-AU", "AUD"], ["CAD", "en-CA", "CAD"],
];
const FIELDS: [string, string, string?][] = [
  ["sal", "Annual salary of the role"], ["days", "Days the role stays open"],
  ["hrs", "Internal hours spent per hire"], ["rate", "Cost per internal hour"],
  ["ads", "Job ads and tools per hire"], ["fee", "Agency fee (% of salary, 0 if none)"],
  ["onb", "Onboarding and training cost"], ["vm", "Value of role vs salary (1 = same)"],
];

// What to do about each cost driver. Advice, not statistics. "track" is the HireTrack action for that driver.
const DRIVER: Record<string, { what: string; a: string; b: string; track: string }> = {
  "Agency fee": { what: "Agency fees are the largest share of your cost per hire.", a: "Negotiate the fee for repeat or high-volume roles, and compare it with sourcing in-house for roles you fill often.", b: "Check how long the replacement guarantee lasts, so a quick exit does not mean paying twice.", track: "Log which roles and sources came through agencies, so you can compare cost per hire by source." },
  "Internal time": { what: "Your own team's time is the largest share of your cost per hire.", a: "Agree a scorecard before the first interview to cut interview rounds.", b: "Batch screening calls and reply to candidates within 24 hours so you do not redo work with drifting candidates.", track: "Track hours and drop-off per stage for each role to see where time is spent without result." },
  "Ads and tools": { what: "Job ads and tools are the largest share of your cost per hire.", a: "Compare spend on each job board with the number of hires it produced.", b: "Drop channels that bring volume but no hires.", track: "Record the source of hire for every candidate." },
  "Onboarding": { what: "Onboarding is the largest share of your cost per hire.", a: "Standardise a first-week checklist so each hire needs less manager time.", b: "Prepare equipment and access before day one.", track: "Track onboarding completion and exits in the first 90 days for each hire." },
  "Vacant seat": { what: "The empty seat is the largest share of your cost per hire, so speed matters most.", a: "Set a days-to-fill target for each role and review stalled roles weekly.", b: "Follow up with candidates within 24 hours. Silence is how good candidates drift away.", track: "Track every candidate stage in one place and set a goal for each role and recruiter." },
};

export default function Calculator() {
  const [s, setS] = useState({ cur: "INR", sal: 600000, days: 45, hrs: 40, rate: 500, ads: 8000, fee: 0, onb: 15000, vm: 1, mo: 4, un: 50 });
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [st, setSt] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [role, setRole] = useState("custom");
  const applyRole = (id: string) => { setRole(id); const r = ROLES.find((x) => x.id === id); if (r) setS((p) => ({ ...p, vm: r.vm, days: r.days, hrs: r.hrs })); };
  const [cp, setCp] = useState(false);
  const [cm, setCm] = useState(false);
  const [msg, setMsg] = useState("");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setS({ ...s, [k]: k === "cur" ? e.target.value : Math.max(0, Number(e.target.value) || 0) });

  const r = useMemo(() => {
    const loc = CUR.find((c) => c[0] === s.cur)![1];
    const f = (n: number) => new Intl.NumberFormat(loc, { style: "currency", currency: s.cur, maximumFractionDigits: 0 }).format(n);
    const agency = (s.sal * Math.min(s.fee, 100)) / 100, internal = s.hrs * s.rate;
    const vac = (s.sal / 260) * s.vm * s.days, direct = agency + internal + s.ads;
    const total = direct + s.onb + vac;
    const bad = direct + vac + ((s.sal / 12) * s.mo * Math.min(s.un, 100)) / 100;
    const parts: [string, number, string][] = [["Agency fee", agency, "#f27d72"], ["Internal time", internal, "#f3b45a"], ["Ads and tools", s.ads, "#6fb7e9"], ["Onboarding", s.onb, "#7fcf8e"], ["Vacant seat", vac, "#b58de0"]];
    const top = parts.reduce((a, b) => (b[1] > a[1] ? b : a));
    return { f, total, bad, parts, direct, top, pct: total ? Math.round((top[1] / total) * 100) : 0 };
  }, [s]);

  function download() {
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
    const csv = rows.map((row) => row.map(q).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "cost-per-hire-report.csv"; a.click(); URL.revokeObjectURL(a.href);
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setSt("sending");
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, bonus: "cost-per-hire-calculator", website: hp, consentProcessing: cp, consentMarketing: cm, path: window.location.pathname }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok) setSt("done"); else { setMsg(j.error === "consent required" ? "Please tick the required consent box." : "Something went wrong. Please try again."); setSt("error"); }
    } catch { setSt("error"); }
  }

  return (
    <div className="grid2">
      <section className="card" aria-label="Your inputs">
        <h2>1. Your numbers</h2>
        <label htmlFor="cur">Currency</label>
        <select id="cur" value={s.cur} onChange={set("cur")}>{CUR.map((c) => <option key={c[0]} value={c[0]}>{c[2]}</option>)}</select>
        <label htmlFor="role">Role type (loads a starting point)</label>
        <select id="role" value={role} onChange={(e) => applyRole(e.target.value)}><option value="custom">Custom (my own numbers)</option>{ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
        <p className="hint">Starting points are planning assumptions, not statistics. Change any value.</p>
        <div className="row">
          {FIELDS.map(([k, label]) => (
            <div key={k}><label htmlFor={k}>{label}</label><input id={k} type="number" min={0} step={k === "vm" ? 0.1 : 1} value={(s as any)[k]} onChange={set(k)} /></div>
          ))}
        </div>
        <p className="hint">The value factor sets what an empty seat costs per day. Use 1 if unsure, higher for revenue-driving roles.</p>
        <h2 style={{ marginTop: 16 }}>If the hire doesn&apos;t work out</h2>
        <div className="row">
          <div><label htmlFor="mo">Months before they leave</label><input id="mo" type="number" min={0} value={s.mo} onChange={set("mo")} /></div>
          <div><label htmlFor="un">% of that time unproductive</label><input id="un" type="number" min={0} max={100} value={s.un} onChange={set("un")} /></div>
        </div>
      </section>
      <section className="card" aria-live="polite">
        <h2>2. Your result</h2>
        <p className="hint">Total cost to fill one role</p>
        <div className="big">{r.f(r.total)}</div>
        <div className="stack">{r.parts.map((p) => <i key={p[0]} style={{ width: `${r.total ? (p[1] / r.total) * 100 : 0}%`, background: p[2] }} />)}</div>
        <table><tbody>{r.parts.map((p) => <tr key={p[0]}><td><span className="dot" style={{ background: p[2] }} />{p[0]}</td><td>{r.f(p[1])}</td></tr>)}</tbody></table>
        {s.cur === "USD"
          ? <p className="hint">Your direct cost per hire (agency fee + internal time + ads) is {r.f(r.direct)}. SHRM&apos;s 2026 US medians are $1,300 for non-executive and $15,000 for executive roles. Definitions differ, so treat this as a rough guide.</p>
          : <p className="hint">Published benchmarks below are in US dollars. Convert your direct cost per hire ({r.f(r.direct)}) at today&apos;s rate to compare.</p>}
        <div className="bad"><b>If this hire leaves early, one bad hire costs about</b><div className="big small">{r.f(r.bad)}</div>
          <p className="hint">Includes hiring again plus the salary paid for unproductive months.</p></div>
        <h2 style={{ marginTop: 16 }}>3. Get your personal report</h2>
        {st !== "done" && <p className="hint">Free: a one-page report of your numbers with your biggest cost driver and what to do about it. Print it or save it as a CSV.</p>}
        {st === "done" ? (
          <div className="report" id="report">
            <h2>Your cost-per-hire report ({s.cur})</h2>
            <p><b>Total to fill one role: {r.f(r.total)}</b>. One bad hire could cost about {r.f(r.bad)}.</p>
            <table><tbody>{r.parts.map((p) => <tr key={p[0]}><td>{p[0]}</td><td>{r.f(p[1])}</td></tr>)}</tbody></table>
            <h3>Your biggest cost driver: {r.top[0]} ({r.pct}% of the total)</h3>
            <p>{DRIVER[r.top[0]].what}</p>
            <ol className="tips"><li>{DRIVER[r.top[0]].a}</li><li>{DRIVER[r.top[0]].b}</li></ol>
            <p><b>What to track next:</b> {DRIVER[r.top[0]].track}</p>
            {s.cur === "USD" && <p className="hint">Your direct cost per hire is {r.f(r.direct)}. SHRM&apos;s 2026 US medians are $1,300 (non-executive) and $15,000 (executive). Definitions differ, so treat this as a rough guide.</p>}
            <p className="hint">Based only on the numbers you entered. Made with the free HireTrack cost-per-hire calculator.</p>
            <div className="row2"><button type="button" className="btn alt" onClick={download}>Download CSV</button><button type="button" className="btn alt" onClick={() => window.print()}>Print or save as PDF</button></div>
          </div>
        ) : (
          <form onSubmit={unlock}>
            <input type="email" required placeholder="you@company.com" aria-label="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={hp} onChange={(e) => setHp(e.target.value)} />
            <label className="check"><input type="checkbox" required checked={cp} onChange={(e) => setCp(e.target.checked)} /><span>{CONSENT_TEXT.DATA_PROCESSING} <Link href="/privacy" target="_blank">Privacy Policy</Link> (required)</span></label>
            <label className="check"><input type="checkbox" checked={cm} onChange={(e) => setCm(e.target.checked)} /><span>{CONSENT_TEXT.MARKETING_EMAILS} (optional)</span></label>
            <button className="btn" disabled={st === "sending"}>{st === "sending" ? "Unlocking..." : "Unlock my report"}</button>
            {st === "error" && <p className="hint" role="alert">{msg}</p>}
          </form>
        )}
      </section>
    </div>
  );
}
