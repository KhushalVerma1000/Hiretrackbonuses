import { ACTIONS, FIELDS, GAP, MIN_DEN, MIN_SUB, STAGES, STATUS } from "./calc";

const FORMULAS: [string, string, string][] = [
  ["Submitted to interviewed", "Interviewed ÷ Submitted", "Are the profiles you send what the client wants?"],
  ["Interviewed to offer", "Offers ÷ Interviewed", "Do candidates convince the client once they meet?"],
  ["Offer to accepted", "Accepted ÷ Offers", "Is pay, speed and the close handled well?"],
  ["Accepted to joined", "Joined ÷ Accepted", "Do candidates stay committed through the notice period?"],
  ["Closing rate", "Joined ÷ Submitted", "Overall yield of the recruiter's submissions."],
  ["Joined per role", "Joined ÷ Roles worked", "Output relative to workload."],
  ["Average days to fill", "Sum of days across filled roles ÷ roles filled", "Speed. The team figure is weighted by candidates joined."],
];
const DEFINE = [
  "Pick one date for each stage and keep it: submission = date sent to the client; interview = date held; offer = date the offer was made; accepted = date the candidate said yes; joined = date of day one.",
  "Count each candidate once per role. Count a candidate again if they are submitted for a different role.",
  "Use the same period and the same cut-off day for every recruiter. Count a candidate in the period when the stage happened.",
  "Count joined only when the person actually started, not when the offer letter was signed.",
  "Record who owned the candidate. If two recruiters shared a placement, agree a split rule in advance (for example half each) and apply it to everyone.",
  "Keep roles in separate groups when they differ a lot (volume roles versus senior roles). Do not compare across them.",
];
const REVIEW = [
  "Minutes 0-5: team closing rate and days to fill versus last period.",
  "Minutes 5-15: the funnel. Which stage lost the most candidates, and is it the same stage for several recruiters? Then it is a process problem, not a person problem.",
  "Minutes 15-25: one recruiter at a time. Ask the leak questions, then agree one action and one date.",
  "Minutes 25-30: confirm next period's targets and what data needs fixing.",
];
const PREVENT = [
  "Write the stage definitions above on one page and share them with the team.",
  "Update the numbers on the same day every month.",
  "Check that no stage count is higher than the stage before it.",
  "Review at least three months before drawing conclusions about a person.",
  "Note role difficulty, client and market next to the numbers.",
  "Agree one coaching action per recruiter and review it next period.",
  "Tell recruiters how the numbers are used before you start.",
];
const GLOSSARY: [string, string][] = [
  ["Submission", "A candidate sent to the client or hiring manager for a role."],
  ["Closing rate", "Candidates joined divided by candidates submitted. A measure of yield."],
  ["Conversion", "The share of people who move from one stage to the next."],
  ["Leak", "The stage where a recruiter or team loses clearly more candidates than the comparison."],
  ["Time to fill", "Calendar days from role opening to the candidate accepting."],
  ["Placement", "A candidate who joined the client, usually the event that earns a fee."],
  ["Requisition", "An approved open role."],
  ["Pass-through rate", "Another name for conversion from one funnel stage to the next."],
];
const WEEKLY = ["Roles with no submission in the last 7 days", "Candidates waiting more than 3 days for client feedback", "Interviews held but no feedback logged", "Offers pending longer than 3 days", "Accepted candidates not yet joined, with joining dates", "Counts that do not add up (a stage higher than the one before it)"];

export default function Toolkit() {
  return (
    <section className="card" style={{ marginTop: 24 }} aria-label="Recruiter KPI toolkit">
      <h2>Recruiter KPI toolkit: everything in one place</h2>

      <h3>1. The seven inputs</h3>
      <div className="scroll"><table><thead><tr><th>Input</th><th>What to count</th></tr></thead><tbody>{FIELDS.map((f) => <tr key={f.key}><td><b>{f.label}</b></td><td>{f.help}</td></tr>)}</tbody></table></div>

      <h3>2. KPI formulas</h3>
      <div className="scroll"><table><thead><tr><th>KPI</th><th>Formula</th><th>What it tells you</th></tr></thead><tbody>{FORMULAS.map(([a, b, c]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>)}</tbody></table></div>

      <h3>3. How status and leaks are decided</h3>
      <p className="hint">These thresholds and reference rates are planning assumptions, not published statistics. Replace the reference rates with your own history once you have three or more months of data.</p>
      <ul>
        <li>Closing rate is shown from {MIN_SUB} submissions. Below that, status is “{STATUS[0]}”.</li>
        <li>Status compares a recruiter's closing rate with the team's combined closing rate: below 80% of it is “{STATUS[2]}”, 80% to 120% is “{STATUS[3]}” and above 120% is “{STATUS[4]}”. With one recruiter the status is “{STATUS[1]}”.</li>
        <li>A stage is checked when at least {MIN_DEN} people entered it. It is a leak when it trails the comparison by {GAP * 100} points or more; the widest gap wins.</li>
        <li>With two or more recruiters, the comparison is the team's combined stage rate. With one, it is the reference rate below.</li>
      </ul>
      <div className="scroll"><table><thead><tr><th>Stage</th><th>Reference rate (assumption)</th></tr></thead><tbody>{STAGES.map((s) => <tr key={s.key}><td>{s.label}</td><td>{Math.round(s.ref * 100)}%</td></tr>)}</tbody></table></div>

      <h3>4. What to coach, by stage</h3>
      <dl>{STAGES.map((s) => <div key={s.key}><dt><b>{s.label}</b></dt><dd>{ACTIONS[s.key].what}</dd><dd>Questions: {ACTIONS[s.key].ask.join(" ")}</dd><dd>Actions: {ACTIONS[s.key].do.join(" ")}</dd></div>)}</dl>

      <h3>5. Count the same way every time</h3>
      <ul>{DEFINE.map((x) => <li key={x}>{x}</li>)}</ul>

      <h3>6. The 30-minute monthly review</h3>
      <ol>{REVIEW.map((x) => <li key={x}>{x}</li>)}</ol>

      <h3>7. Data hygiene checklist</h3>
      <ul>{PREVENT.map((x) => <li key={x}>☐ {x}</li>)}</ul>

      <h3>8. Fair use</h3>
      <ul>
        <li>Use the numbers to start coaching conversations, not as the only basis for pay, promotion or dismissal.</li>
        <li>Never add personal traits such as age, gender, nationality or religion to any recruiter comparison.</li>
        <li>Rules on monitoring employee performance and storing employee data differ by country. Confirm with local counsel.</li>
      </ul>

      <h3>9. Glossary</h3>
      <dl>{GLOSSARY.map(([a, b]) => <div key={a}><dt><b>{a}</b></dt><dd>{b}</dd></div>)}</dl>

      <h3>10. Weekly pipeline-hygiene checklist</h3>
      <ul>{WEEKLY.map((x) => <li key={x}>☐ {x}</li>)}</ul>
    </section>
  );
}
