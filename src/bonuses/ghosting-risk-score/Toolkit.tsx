import { ACTIONS, BANDED, BAND_INFO, SELECTS, bandRows, type Key } from "./calc";

const RESCUE = [
  "Call first, then send the same content as a message on their preferred channel.",
  "Ask one open question about their situation, such as what they are weighing up.",
  "Give them your decision timeline and keep to it.",
  "Settle the biggest driver in the score (pay, role, timeline or next step).",
  "Confirm the next step and its date in writing the same day.",
  "Log the contact and set a follow-up for the next working day.",
  "Keep a backup candidate warm until the candidate has confirmed.",
];
const PREVENT = [
  "Share the pay range and the full process timeline in the first call.",
  "Send an accurate job description and a short description of a typical week.",
  "End every contact with a named next step and a date, confirmed in writing.",
  "Reply to candidates within 4 hours on working days (a planning target, adjust to your team).",
  "Ask early about other processes and the date they need an answer by.",
  "After an offer, check in weekly until day one and share first-day details.",
  "Close the loop with candidates you will not move forward, in two lines.",
];
const GLOSSARY: [string, string][] = [
  ["Ghosting", "A person stops replying without explanation. It can be the candidate or the employer."],
  ["No-show", "A candidate misses a scheduled interview or first day without notice."],
  ["Offer dropout", "A candidate declines or disappears after an offer is made."],
  ["Joining dropout", "A candidate accepts an offer but does not join. Common where notice periods are long."],
  ["Silence window", "The number of days since the candidate last replied."],
  ["Reply time", "How long your team takes to answer a candidate message."],
  ["Notice period", "The time an employee must work after resigning, set by their contract or local rules."],
  ["Counter-offer", "A better package offered by a current employer to stop someone leaving."],
  ["Backup candidate", "A second-choice candidate you keep engaged until the first has confirmed."],
];
const WEEKLY = ["Candidates silent for 3 or more days", "Candidates who have waited more than 24 hours for your reply", "Offers made and offers accepted but not yet joined", "Candidates without an agreed next step and date", "Who ghosted, at which stage, and what the score said", "Roles where pay was not confirmed before interviews"];

export default function Toolkit() {
  const order = Object.keys(ACTIONS) as Key[];
  return (
    <section className="card" style={{ marginTop: 24 }} aria-label="Ghosting toolkit">
      <h2>Ghosting toolkit: everything in one place</h2>

      <h3>1. How the score is calculated</h3>
      <p className="hint">Each answer adds points and the total is capped at 100. These weights are planning assumptions informed by the reasons candidates give for ghosting, not statistics. Change your own thresholds once you have outcome data.</p>
      <div className="scroll"><table><thead><tr><th>Factor</th><th>Answer</th><th>Points</th></tr></thead><tbody>
        {SELECTS.flatMap((s) => s.opts.map((o, i) => <tr key={s.key + i}><td>{i === 0 ? <b>{s.label}</b> : ""}</td><td>{o}</td><td>{s.pts[i]}</td></tr>))}
        {BANDED.flatMap((b) => bandRows(b).map(([t, p], i) => <tr key={b.key + i}><td>{i === 0 ? <b>{b.label}</b> : ""}</td><td>{t}{i === 0 && b.note ? ` (${b.note})` : ""}</td><td>{p}</td></tr>))}
      </tbody></table></div>

      <h3>2. Score bands and what to do</h3>
      <div className="scroll"><table><thead><tr><th>Band</th><th>Score</th><th>What to do</th></tr></thead>
        <tbody>{BAND_INFO.map((b) => <tr key={b.name}><td><b>{b.name}</b></td><td>{b.range}</td><td>{b.play}</td></tr>)}</tbody></table></div>

      <h3>3. The 24-hour rescue play</h3>
      <ol>{RESCUE.map((x) => <li key={x}>{x}</li>)}</ol>

      <h3>4. Messages to adapt, by situation</h3>
      <p className="hint">Replace anything in [brackets]. Keep the tone warm and the question easy to answer.</p>
      <dl>{order.map((k) => <div key={k}><dt><b>{k === "nt" ? "Notice period" : [...SELECTS, ...BANDED].find((f) => f.key === k)!.label}</b></dt><dd>{ACTIONS[k].msg}</dd></div>)}</dl>

      <h3>5. Prevention checklist</h3>
      <ul>{PREVENT.map((x) => <li key={x}>☐ {x}</li>)}</ul>

      <h3>6. Fair use</h3>
      <ul>
        <li>Use only process signals (timing, communication, pay, clarity). Never add personal traits such as age, gender, nationality or religion.</li>
        <li>Use the score to decide who to call first, not to reject anyone.</li>
        <li>Rules on storing candidate data and contacting people by phone or messaging apps differ by country. Confirm with local counsel.</li>
      </ul>

      <h3>7. Glossary</h3>
      <dl>{GLOSSARY.map(([a, b]) => <div key={a}><dt><b>{a}</b></dt><dd>{b}</dd></div>)}</dl>

      <h3>8. Weekly ghosting-metrics checklist</h3>
      <ul>{WEEKLY.map((x) => <li key={x}>☐ {x}</li>)}</ul>
    </section>
  );
}
