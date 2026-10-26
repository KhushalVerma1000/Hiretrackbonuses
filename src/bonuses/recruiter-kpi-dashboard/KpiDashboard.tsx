"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CONSENT_TEXT } from "@/lib/consent";
import { ACTIONS, EXAMPLE, FIELDS, MAX_LIST, MIN_SUB, STAGES, STATUS, ZERO, analyseAll, hasData, pct, reportCsv, type Rec, type RecKey } from "./calc";

type Item = { id: number; label: string; r: Rec };
const seed = (): Item[] => EXAMPLE.map((e, i) => ({ id: i + 1, label: e.label, r: { ...e.r } }));
const COL = ["#8a97ab", "#1553c7", "#c2571a", "#0f8b7d", "#0f8b7d"]; // by status index

export default function KpiDashboard() {
  const [rows, setRows] = useState<Item[]>(seed);
  const [example, setExample] = useState(true);
  const [nextId, setNextId] = useState(EXAMPLE.length + 1);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [cp, setCp] = useState(false);
  const [cm, setCm] = useState(false);
  const [st, setSt] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [mailed, setMailed] = useState<"sent" | "recent" | "off" | "failed" | "">("");

  const res = useMemo(() => analyseAll(rows), [rows]);
  const touch = (fn: (r: Item[]) => Item[]) => { setRows(fn); setExample(false); };
  const setLabel = (id: number, v: string) => touch((r) => r.map((x) => (x.id === id ? { ...x, label: v.slice(0, 40) } : x)));
  const setNum = (id: number, k: RecKey, cap: number, v: string) => touch((r) => r.map((x) => (x.id === id ? { ...x, r: { ...x.r, [k]: Math.min(cap, Math.max(0, Math.floor(Number(v) || 0))) } } : x)));
  const add = () => { if (rows.length >= MAX_LIST) return; touch((r) => [...r, { id: nextId, label: `Recruiter ${r.length + 1}`, r: { ...ZERO } }]); setNextId(nextId + 1); };
  const clear = () => { setRows([{ id: nextId, label: "Recruiter 1", r: { ...ZERO } }]); setNextId(nextId + 1); setExample(false); };
  const live = rows.filter((x) => hasData(x.r));
  const t = res.total;

  function download() {
    const f = document.createElement("a");
    f.href = URL.createObjectURL(new Blob([reportCsv(rows)], { type: "text/csv;charset=utf-8" }));
    f.download = "recruiter-kpi-report.csv"; f.click(); URL.revokeObjectURL(f.href);
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setSt("sending");
    try {
      // Only the numeric counts are sent. Recruiter names stay in this browser.
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, bonus: "recruiter-kpi-dashboard", website: hp, consentProcessing: cp, consentMarketing: cm, path: window.location.pathname, payload: { recs: live.map((x) => x.r) } }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok) { setMailed(["sent", "recent", "off", "failed"].includes(j.email) ? j.email : ""); setSt("done"); } else { setMsg(j.error === "consent required" ? "Please tick the required consent box." : "Something went wrong. Please try again."); setSt("error"); }
    } catch { setMsg("Something went wrong. Please try again."); setSt("error"); }
  }

  const funnel: [string, number][] = [["Submitted", t.sub], ["Interviewed", t.int], ["Offers", t.off], ["Accepted", t.acc], ["Joined", t.join]];
  const top = Math.max(1, ...funnel.map((f) => f[1]));
  const issues = live.flatMap((x) => analyseAll([x]).ranked[0].a.issues.map((i) => `${x.label || "Recruiter"}: ${i}`));
  const leakName = (k: string) => STAGES.find((s) => s.key === k)!.label;

  return (
    <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
      <section className="card" aria-label="Recruiter numbers">
        <h2>1. Enter one period of numbers per recruiter</h2>
        <p className="hint">Use the same period for everyone (for example last month). Names stay in your browser. Counts only, no currency, any country.</p>
        {example && <p className="bad" role="status">Example data is shown. Replace it with your own numbers, or <button type="button" className="btn alt" onClick={clear}>clear the example</button></p>}
        <div className="scroll kpi">
          <table>
            <thead><tr><th>Recruiter</th>{FIELDS.map((f) => <th key={f.key} title={f.help}>{f.short}</th>)}<th /></tr></thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td><input aria-label="Recruiter label" maxLength={40} value={x.label} onChange={(e) => setLabel(x.id, e.target.value)} /></td>
                  {FIELDS.map((f) => <td key={f.key}><input aria-label={`${f.label} for ${x.label || "recruiter"}`} type="number" inputMode="numeric" min={0} max={f.cap} value={x.r[f.key]} onChange={(e) => setNum(x.id, f.key, f.cap, e.target.value)} /></td>)}
                  <td><button type="button" className="btn alt" onClick={() => touch((r) => r.filter((y) => y.id !== x.id))} aria-label={`Remove ${x.label}`}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn alt" onClick={add} disabled={rows.length >= MAX_LIST}>{rows.length >= MAX_LIST ? `Team full (${MAX_LIST})` : "Add a recruiter"}</button>
        <p className="hint">Hover a column heading for its definition. Full definitions are in the toolkit below.</p>
      </section>

      <section className="card" aria-live="polite" aria-label="Dashboard">
        <h2>2. Your dashboard</h2>
        {live.length === 0 ? <p className="hint">Enter at least one recruiter's counts to see the dashboard.</p> : (
          <>
            <div className="two">
              <div><p className="hint">Team closing rate (joined / submitted)</p><div className="big">{pct(res.teamAnalysis.closing)}</div></div>
              <div><p className="hint">Candidates joined</p><div className="big">{t.join}</div></div>
              <div><p className="hint">Average days to fill</p><div className="big">{t.days > 0 ? t.days : "–"}</div></div>
              <div><p className="hint">Joined per role worked</p><div className="big">{res.teamAnalysis.perRole ?? "–"}</div></div>
            </div>

            <h3>Team funnel</h3>
            {funnel.map(([n, v], i) => (
              <div key={n}>
                <p className="hint" style={{ margin: "8px 0 0" }}>{n}: <b>{v}</b>{i > 0 && ` (${pct(res.teamAnalysis.rates[STAGES[i - 1].key])} of ${funnel[i - 1][0].toLowerCase()})`}</p>
                <div className="meter" role="img" aria-label={`${n}: ${v}`}><i style={{ width: `${(v / top) * 100}%`, background: "var(--acc)" }} /></div>
              </div>
            ))}

            <h3>Who is closing, and where each recruiter loses candidates</h3>
            <div className="scroll">
              <table>
                <thead><tr><th>Recruiter</th><th>Closing rate</th><th>Joined</th><th>Status</th><th>Biggest leak</th></tr></thead>
                <tbody>
                  {res.ranked.map((x, i) => (
                    <tr key={x.id}>
                      <td>{i + 1}. {x.label || "Recruiter"}</td>
                      <td><b>{x.a.status === 0 ? "–" : pct(x.a.closing)}</b></td>
                      <td>{x.r.join}</td>
                      <td><span className="dot" style={{ background: COL[x.a.status] }} />{STATUS[x.a.status]}</td>
                      <td>{x.a.leak ? <>{leakName(x.a.leak.stage)}: {pct(x.a.leak.rate)} vs {pct(x.a.leak.base)}</> : <span className="hint">None found</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hint">Closing rate is shown from {MIN_SUB} submissions. Status compares each recruiter with the team's combined closing rate (below 80% or above 120% of it). {res.team ? "Leaks compare each stage with the team's combined stage rate." : "With one recruiter, leaks compare against planning reference rates in the toolkit; replace them with your own history."}</p>
            {issues.length > 0 && <div className="bad" role="alert"><b>Check your data</b><ul>{issues.map((i) => <li key={i}>{i}</li>)}</ul></div>}
            <p className="hint">A planning aid built on your counts, not a verdict on people. Roles differ in difficulty, so compare like with like and look across several months.</p>
          </>
        )}

        <h2 style={{ marginTop: 16 }}>3. Get your coaching plan</h2>
        {st !== "done" && <p className="hint">Free: for each recruiter, the stage to coach first, the questions to ask in the one-to-one, three actions to try, plus a CSV for Excel or Google Sheets and a printable plan.</p>}
        {st === "done" ? (
          <div className="report" id="report">
            <h2>Your recruiter coaching plan</h2>
            {mailed && <p className="hint" role="status">{mailed === "sent" ? `We also emailed this plan to ${email}. Check your spam folder if it does not arrive.` : mailed === "recent" ? `We emailed this plan to ${email} a moment ago. Check your inbox or spam folder.` : "We could not email this plan just now, but it is all on this page. You can still download or print it."}</p>}
            {res.ranked.map((x) => (
              <div key={x.id}>
                <h3>{x.label || "Recruiter"}: {x.a.status === 0 ? "not enough data yet" : `${pct(x.a.closing)} closing (${STATUS[x.a.status].toLowerCase()})`}</h3>
                {x.a.leak ? (
                  <>
                    <p><b>Coach first: {leakName(x.a.leak.stage)}.</b> {pct(x.a.leak.rate)} against {pct(x.a.leak.base)}, so about {x.a.leak.lost} candidates were lost at this stage. {ACTIONS[x.a.leak.stage].what}</p>
                    <p><b>Ask in the one-to-one</b></p><ul className="tips">{ACTIONS[x.a.leak.stage].ask.map((q) => <li key={q}>{q}</li>)}</ul>
                    <p><b>Try this month</b></p><ol className="tips">{ACTIONS[x.a.leak.stage].do.map((d) => <li key={d}>{d}</li>)}</ol>
                  </>
                ) : <p>{x.a.status === 0 ? `Collect at least ${MIN_SUB} submissions before drawing conclusions.` : "No stage trails the comparison by 5 points or more. Keep the rhythm and review again next period."}</p>}
              </div>
            ))}
            <p className="hint">Based only on the numbers you entered. Made with the free HireTrack recruiter KPI dashboard.</p>
            <div className="row2"><button type="button" className="btn alt" onClick={download}>Download CSV</button><button type="button" className="btn alt" onClick={() => window.print()}>Print or save as PDF</button></div>
          </div>
        ) : (
          <form onSubmit={unlock}>
            <input type="email" required placeholder="you@company.com" aria-label="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={hp} onChange={(e) => setHp(e.target.value)} />
            <label className="check"><input type="checkbox" required checked={cp} onChange={(e) => setCp(e.target.checked)} /><span>{CONSENT_TEXT.DATA_PROCESSING} <Link href="/privacy" target="_blank">Privacy Policy</Link> (required)</span></label>
            <label className="check"><input type="checkbox" checked={cm} onChange={(e) => setCm(e.target.checked)} /><span>{CONSENT_TEXT.MARKETING_EMAILS} (optional)</span></label>
            <button className="btn" disabled={st === "sending" || example || live.length === 0}>{st === "sending" ? "Unlocking..." : "Unlock my coaching plan"}</button>
            {(example || live.length === 0) && <p className="hint">Replace the example with your own numbers to unlock your plan.</p>}
            <p className="hint">Recruiter names never leave your browser. Only your numeric counts are used to build the email.</p>
            {st === "error" && <p className="hint" role="alert">{msg}</p>}
          </form>
        )}
      </section>
    </div>
  );
}
