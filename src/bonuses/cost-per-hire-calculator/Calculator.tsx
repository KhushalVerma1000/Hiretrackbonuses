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
    return { f, total, bad, parts, direct };
  }, [s]);

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
        <h2 style={{ marginTop: 16 }}>3. Get the full breakdown</h2>
        {st === "done" ? (
          <ol className="tips">
            <li><b>Track every candidate stage in one place.</b> Stalled roles are where vacancy cost grows fastest.</li>
            <li><b>Set a goal per role and recruiter.</b> A visible days-to-fill target keeps roles moving.</li>
            <li><b>Follow up inside 24 hours.</b> Silence is how good candidates drift away.</li>
            <li><b>Standardise scorecards.</b> Fewer interview rounds, fewer mis-hires.</li>
            <li><b>Review monthly.</b> Re-run this calculator with real data from your tracker.</li>
          </ol>
        ) : (
          <form onSubmit={unlock}>
            <input type="email" required placeholder="you@company.com" aria-label="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={hp} onChange={(e) => setHp(e.target.value)} />
            <label className="check"><input type="checkbox" required checked={cp} onChange={(e) => setCp(e.target.checked)} /><span>{CONSENT_TEXT.DATA_PROCESSING} <Link href="/privacy" target="_blank">Privacy Policy</Link> (required)</span></label>
            <label className="check"><input type="checkbox" checked={cm} onChange={(e) => setCm(e.target.checked)} /><span>{CONSENT_TEXT.MARKETING_EMAILS} (optional)</span></label>
            <button className="btn" disabled={st === "sending"}>{st === "sending" ? "Unlocking..." : "Unlock 5 ways to cut this cost"}</button>
            {st === "error" && <p className="hint" role="alert">{msg}</p>}
          </form>
        )}
      </section>
    </div>
  );
}
