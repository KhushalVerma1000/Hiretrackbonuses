"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CONSENT_TEXT } from "@/lib/consent";
import { ACTIONS, HYGIENE, OWNER_LABEL, STAGE_DEFS, VERDICT, ZERO, audit, clampStage, hasAny, label, pctStr, reportCsv, topOwner, type StageIn } from "./calc";

const EXAMPLE: StageIn[] = [
  { n: 12, avg: 3, old: 8, tgt: 2 }, { n: 7, avg: 2, old: 4, tgt: 2 }, { n: 9, avg: 8, old: 19, tgt: 3 },
  { n: 5, avg: 6, old: 12, tgt: 5 }, { n: 3, avg: 4, old: 9, tgt: 3 }, { n: 4, avg: 21, old: 33, tgt: 30 },
];
const EXAMPLE_HYG = [false, true, false, true, true, false];
const blank = (): StageIn[] => STAGE_DEFS.map((d) => ({ ...ZERO, tgt: d.tgt }));
const COLS: { k: keyof StageIn; t: string; help: string }[] = [
  { k: "n", t: "Waiting", help: "Candidates currently at this stage." },
  { k: "avg", t: "Avg days", help: "Average days they have waited at this stage." },
  { k: "old", t: "Longest", help: "Longest wait at this stage, in days." },
  { k: "tgt", t: "Target days", help: "How long a candidate should wait at most. Edit to match your clients and country." },
];

export default function PipelineAudit() {
  const [rows, setRows] = useState<StageIn[]>(EXAMPLE);
  const [hyg, setHyg] = useState<boolean[]>(EXAMPLE_HYG);
  const [example, setExample] = useState(true);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [cp, setCp] = useState(false);
  const [cm, setCm] = useState(false);
  const [st, setSt] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [mailed, setMailed] = useState<"sent" | "recent" | "off" | "failed" | "">("");

  const a = useMemo(() => audit(rows), [rows]);
  const owner = topOwner(a);
  const b = a.bottleneck;
  const misses = HYGIENE.filter((_, i) => !hyg[i]);
  const maxDebt = Math.max(1, ...a.stages.map((s) => s.debt));
  const ready = hasAny(rows);

  const setCell = (i: number, k: keyof StageIn, v: string) => { setRows((r) => r.map((x, j) => (j === i ? clampStage({ ...x, [k]: v }) : x))); setExample(false); };
  const setH = (i: number, v: boolean) => { setHyg((h) => h.map((x, j) => (j === i ? v : x))); setExample(false); };
  const clear = () => { setRows(blank()); setHyg(HYGIENE.map(() => false)); setExample(false); };

  function download() {
    const f = document.createElement("a");
    f.href = URL.createObjectURL(new Blob([reportCsv(rows, hyg)], { type: "text/csv;charset=utf-8" }));
    f.download = "pipeline-audit.csv"; f.click(); URL.revokeObjectURL(f.href);
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setSt("sending");
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, bonus: "pipeline-audit", website: hp, consentProcessing: cp, consentMarketing: cm, path: window.location.pathname, payload: { stages: rows, hyg } }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok) { setMailed(["sent", "recent", "off", "failed"].includes(j.email) ? j.email : ""); setSt("done"); } else { setMsg(j.error === "consent required" ? "Please tick the required consent box." : "Something went wrong. Please try again."); setSt("error"); }
    } catch { setMsg("Something went wrong. Please try again."); setSt("error"); }
  }

  const headline = a.debtTotal === 0 ? "No stage is over its target" : `${VERDICT[a.verdict]}: ${pctStr(a.share)} of waiting time is over target`;
  const issues = a.stages.map((s) => s.issue).filter(Boolean) as string[];

  return (
    <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
      <section className="card" aria-label="Pipeline numbers">
        <h2>1. Where are your candidates waiting right now?</h2>
        <p className="hint">Count the candidates in your pipeline today. Leave a stage at 0 if nobody is waiting there. Counts only, no names, any country.</p>
        {example && <p className="bad" role="status">Example data is shown. Replace it with your own numbers, or <button type="button" className="btn alt" onClick={clear}>clear the example</button></p>}
        <div className="scroll kpi">
          <table>
            <thead><tr><th>Stage</th>{COLS.map((c) => <th key={c.k} title={c.help}>{c.t}</th>)}</tr></thead>
            <tbody>
              {STAGE_DEFS.map((d, i) => (
                <tr key={d.key}>
                  <td><b>{d.label}</b><br /><span className="hint">{d.help} Next step: {OWNER_LABEL[d.owner]}.</span></td>
                  {COLS.map((c) => <td key={c.k}><input aria-label={`${c.t} for ${d.label}`} type="number" inputMode="numeric" min={0} value={rows[i][c.k]} onChange={(e) => setCell(i, c.k, e.target.value)} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hint">Target days start as planning assumptions. Change them to what you have agreed with clients, and set the joining target to your usual notice period.</p>

        <h3>Process habits</h3>
        {HYGIENE.map((h, i) => <label className="check" key={h.q}><input type="checkbox" checked={hyg[i]} onChange={(e) => setH(i, e.target.checked)} /><span>{h.q}</span></label>)}
      </section>

      <section className="card" aria-live="polite" aria-label="Audit result">
        <h2>2. Your pipeline audit</h2>
        {!ready ? <p className="hint">Enter how many candidates are waiting at each stage to see the audit.</p> : (
          <>
            <div className="big">{headline}</div>
            <p className="hint">{owner ? `Most of the delay sits with ${OWNER_LABEL[owner]}.` : "Keep checking every week; stalls build quietly."} Share of waiting time over target: Flowing under 10%, Slowing 10% to 30%, Stalled 30% or more.</p>

            <h3>Candidate-days over target, by stage</h3>
            {a.stages.map((s, i) => (
              <div key={s.key}>
                <p className="hint" style={{ margin: "8px 0 0" }}>{STAGE_DEFS[i].label}: <b>{s.debt}</b>{s.in.n > 0 && ` (${s.in.n} waiting, avg ${s.in.avg}d vs target ${s.in.tgt}d)`}{b?.key === s.key && " · bottleneck"}{s.oldRisk && " · oldest at risk"}</p>
                <div className="meter" role="img" aria-label={`${STAGE_DEFS[i].label}: ${s.debt} candidate-days over target`}><i style={{ width: `${(s.debt / maxDebt) * 100}%`, background: b?.key === s.key ? "var(--warn, #c2571a)" : "var(--acc)" }} /></div>
              </div>
            ))}
            {issues.length > 0 && <div className="bad" role="alert"><b>Check your data</b><ul>{issues.map((x) => <li key={x}>{x}</li>)}</ul></div>}
            <p className="hint">Candidate-days over target = candidates waiting × days beyond the target. A planning aid built on your numbers, not a verdict.</p>
          </>
        )}

        <h2 style={{ marginTop: 16 }}>3. Get your fix plan</h2>
        {st !== "done" && <p className="hint">Free: your bottleneck, who the pipeline is waiting on, the candidates to contact first, three fixes to try and the process habits to put in place, plus a CSV and a printable report.</p>}
        {st === "done" ? (
          <div className="report" id="report">
            <h2>Your pipeline fix plan</h2>
            {mailed && <p className="hint" role="status">{mailed === "sent" ? `We also emailed this report to ${email}. Check your spam folder if it does not arrive.` : mailed === "recent" ? `We emailed this report to ${email} a moment ago. Check your inbox or spam folder.` : "We could not email this report just now, but it is all on this page. You can still download or print it."}</p>}
            <h3>{headline}</h3>
            {b ? <p><b>Biggest bottleneck: {label(b.key)}.</b> {b.in.n} candidates have waited {b.in.avg} days on average against a target of {b.in.tgt}. {ACTIONS[b.key].what}</p> : <p>Nothing is over target. Review again next week.</p>}
            {owner && <p>Most of the delay sits with <b>{OWNER_LABEL[owner]}</b>.</p>}
            {a.atRisk.length > 0 && <><h3>Contact these candidates first</h3><ul className="tips">{a.atRisk.map((s) => <li key={s.key}>{label(s.key)}: the oldest candidate has waited {s.in.old} days against a target of {s.in.tgt}.</li>)}</ul></>}
            {b && <><h3>Fix the bottleneck</h3><ol className="tips">{ACTIONS[b.key].do.map((d) => <li key={d}>{d}</li>)}</ol></>}
            <h3>Process habits ({HYGIENE.length - misses.length} of {HYGIENE.length} in place)</h3>
            {misses.length ? <ul className="tips">{misses.map((m) => <li key={m.q}>{m.fix}</li>)}</ul> : <p>All six are in place. Keep reviewing weekly.</p>}
            <p className="hint">Based only on the numbers you entered. Made with the free HireTrack pipeline audit.</p>
            <div className="row2"><button type="button" className="btn alt" onClick={download}>Download CSV</button><button type="button" className="btn alt" onClick={() => window.print()}>Print or save as PDF</button></div>
          </div>
        ) : (
          <form onSubmit={unlock}>
            <input type="email" required placeholder="you@company.com" aria-label="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={hp} onChange={(e) => setHp(e.target.value)} />
            <label className="check"><input type="checkbox" required checked={cp} onChange={(e) => setCp(e.target.checked)} /><span>{CONSENT_TEXT.DATA_PROCESSING} <Link href="/privacy" target="_blank">Privacy Policy</Link> (required)</span></label>
            <label className="check"><input type="checkbox" checked={cm} onChange={(e) => setCm(e.target.checked)} /><span>{CONSENT_TEXT.MARKETING_EMAILS} (optional)</span></label>
            <button className="btn" disabled={st === "sending" || example || !ready}>{st === "sending" ? "Unlocking..." : "Unlock my fix plan"}</button>
            {(example || !ready) && <p className="hint">Replace the example with your own numbers to unlock your plan.</p>}
            <p className="hint">Only your numbers and yes/no answers are used to build the email.</p>
            {st === "error" && <p className="hint" role="alert">{msg}</p>}
          </form>
        )}
      </section>
    </div>
  );
}
