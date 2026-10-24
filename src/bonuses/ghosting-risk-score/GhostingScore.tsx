"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CONSENT_TEXT } from "@/lib/consent";
import { ACTIONS, BANDED, BAND_INFO, DEFAULT, MAX_LIST, SELECTS, STAGES, analyse, rankRows, reportCsv, type Cand, type Key } from "./calc";

type Item = { id: number; label: string; c: Cand };
const COL = ["#0f8b7d", "#d98e04", "#c2571a", "#a8321c"]; // low, moderate, high, critical

export default function GhostingScore() {
  const [c, setC] = useState<Cand>(DEFAULT);
  const [label, setLabel] = useState("");
  const [list, setList] = useState<Item[]>([]);
  const [nextId, setNextId] = useState(1);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [cp, setCp] = useState(false);
  const [cm, setCm] = useState(false);
  const [st, setSt] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [mailed, setMailed] = useState<"sent" | "recent" | "">("");

  const a = useMemo(() => analyse(c), [c]);
  const setSel = (k: Key | "st") => (e: React.ChangeEvent<HTMLSelectElement>) => setC({ ...c, [k]: Number(e.target.value) });
  const setNum = (k: Key, cap: number) => (e: React.ChangeEvent<HTMLInputElement>) => setC({ ...c, [k]: Math.min(cap, Math.max(0, Math.floor(Number(e.target.value) || 0))) });

  const add = () => {
    if (list.length >= MAX_LIST) return;
    setList([...list, { id: nextId, label: label.trim().slice(0, 40) || `Candidate ${list.length + 1}`, c }]);
    setNextId(nextId + 1); setLabel(""); setC(DEFAULT);
  };
  const edit = (it: Item) => { setC(it.c); setLabel(it.label); setList(list.filter((x) => x.id !== it.id)); };
  const rows = list.length ? list : [{ id: 0, label: "This candidate", c }];
  const ranked = useMemo(() => rankRows(rows), [list, c]); // eslint-disable-line react-hooks/exhaustive-deps

  function download() {
    const f = document.createElement("a");
    f.href = URL.createObjectURL(new Blob([reportCsv(rows)], { type: "text/csv;charset=utf-8" }));
    f.download = "ghosting-risk-report.csv"; f.click(); URL.revokeObjectURL(f.href);
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setSt("sending");
    try {
      // Only the numeric answers are sent. Candidate labels stay in this browser.
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, bonus: "ghosting-risk-score", website: hp, consentProcessing: cp, consentMarketing: cm, path: window.location.pathname, payload: { cands: rows.map((r) => r.c) } }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok) { setMailed(j.email === "sent" || j.email === "recent" ? j.email : ""); setSt("done"); } else { setMsg(j.error === "consent required" ? "Please tick the required consent box." : "Something went wrong. Please try again."); setSt("error"); }
    } catch { setMsg("Something went wrong. Please try again."); setSt("error"); }
  }

  return (
    <div className="grid2">
      <section className="card" aria-label="Candidate details">
        <h2>1. Describe one candidate</h2>
        <label htmlFor="lbl">Label (optional, stays in your browser)</label>
        <input id="lbl" maxLength={40} placeholder="e.g. Candidate A" value={label} onChange={(e) => setLabel(e.target.value)} />
        <label htmlFor="st">Where are they in your process?</label>
        <select id="st" value={c.st} onChange={setSel("st")}>{STAGES.map((s, i) => <option key={s} value={i}>{s}</option>)}</select>
        {SELECTS.map((s) => (
          <div key={s.key}><label htmlFor={s.key}>{s.q}</label>
            <select id={s.key} value={c[s.key]} onChange={setSel(s.key)}>{s.opts.map((o, i) => <option key={o} value={i}>{o}</option>)}</select></div>
        ))}
        <div className="row">
          {BANDED.filter((b) => b.key !== "nt" || c.st >= 3).map((b) => (
            <div key={b.key}><label htmlFor={b.key}>{b.q}</label><input id={b.key} type="number" min={0} max={b.cap} value={c[b.key]} onChange={setNum(b.key, b.cap)} /></div>
          ))}
        </div>
        <p className="hint">Use only what you know about the process. Do not factor in personal traits such as age, gender or nationality.</p>
      </section>

      <section className="card" aria-live="polite">
        <h2>2. Risk score</h2>
        <div className="big">{a.score}<span className="hint"> / 100</span></div>
        <div className="meter" role="img" aria-label={`Risk ${a.score} out of 100, ${BAND_INFO[a.band].name}`}><i style={{ width: `${a.score}%`, background: COL[a.band] }} /></div>
        <p><span className="dot" style={{ background: COL[a.band] }} /><b>{BAND_INFO[a.band].name} risk</b> ({BAND_INFO[a.band].range})</p>
        {a.top.length > 0 ? (
          <>
            <p className="hint">Biggest reasons behind this score</p>
            <table className="amt"><tbody>{a.top.map((p) => <tr key={p.key}><td>{p.label}</td><td>{p.pts} of {p.max} pts</td></tr>)}</tbody></table>
          </>
        ) : <p className="hint">No risk signals found with these answers.</p>}
        <p className="hint">A planning aid built on assumed weights, not a statistical prediction. Use it to decide who to follow up first.</p>
        <button type="button" className="btn alt" onClick={add} disabled={list.length >= MAX_LIST}>{list.length >= MAX_LIST ? `Shortlist full (${MAX_LIST})` : "Add to my shortlist"}</button>

        {list.length > 0 && (
          <div className="scroll"><table><thead><tr><th>Shortlist, highest risk first</th><th>Score</th><th /></tr></thead>
            <tbody>{ranked.map((r) => { const it = r as Item; return (
              <tr key={it.id}><td>{r.label}<br /><span className="hint">{BAND_INFO[r.a.band].name}</span></td><td><b>{r.a.score}</b></td>
                <td><button type="button" className="btn alt" onClick={() => edit(it)}>Edit</button><button type="button" className="btn alt" onClick={() => setList(list.filter((x) => x.id !== it.id))} aria-label={`Remove ${r.label}`}>Remove</button></td></tr>); })}</tbody></table></div>
        )}

        <h2 style={{ marginTop: 16 }}>3. Get your rescue plan</h2>
        {st !== "done" && <p className="hint">Free: for {list.length > 1 ? "every candidate on your shortlist" : "your candidate"}, what to do about each risk, message drafts you can send today, a ranked CSV and a printable report.</p>}
        {st === "done" ? (
          <div className="report" id="report">
            <h2>Your ghosting risk report</h2>
            {mailed && <p className="hint" role="status">{mailed === "sent" ? `We also emailed this report to ${email}. Check your spam folder if it does not arrive.` : `We emailed this report to ${email} a moment ago. Check your inbox or spam folder.`}</p>}
            {ranked.map((r) => (
              <div key={r.id}>
                <h3>{r.label}: {r.a.score}/100 ({BAND_INFO[r.a.band].name})</h3>
                <p>{BAND_INFO[r.a.band].play}</p>
                {r.a.top.map((p) => (
                  <div key={p.key}>
                    <p><b>{p.label}</b> ({p.pts} of {p.max} pts). {ACTIONS[p.key].what}</p>
                    <ol className="tips">{ACTIONS[p.key].do.map((d) => <li key={d}>{d}</li>)}</ol>
                    <p><b>Message to adapt:</b> {ACTIONS[p.key].msg}</p>
                  </div>
                ))}
              </div>
            ))}
            <p className="hint">Based only on the answers you entered. Made with the free HireTrack ghosting risk score.</p>
            <div className="row2"><button type="button" className="btn alt" onClick={download}>Download CSV</button><button type="button" className="btn alt" onClick={() => window.print()}>Print or save as PDF</button></div>
          </div>
        ) : (
          <form onSubmit={unlock}>
            <input type="email" required placeholder="you@company.com" aria-label="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={hp} onChange={(e) => setHp(e.target.value)} />
            <label className="check"><input type="checkbox" required checked={cp} onChange={(e) => setCp(e.target.checked)} /><span>{CONSENT_TEXT.DATA_PROCESSING} <Link href="/privacy" target="_blank">Privacy Policy</Link> (required)</span></label>
            <label className="check"><input type="checkbox" checked={cm} onChange={(e) => setCm(e.target.checked)} /><span>{CONSENT_TEXT.MARKETING_EMAILS} (optional)</span></label>
            <button className="btn" disabled={st === "sending"}>{st === "sending" ? "Unlocking..." : "Unlock my rescue plan"}</button>
            <p className="hint">Candidate labels never leave your browser. Only your numeric answers are used to build the email.</p>
            {st === "error" && <p className="hint" role="alert">{msg}</p>}
          </form>
        )}
      </section>
    </div>
  );
}
