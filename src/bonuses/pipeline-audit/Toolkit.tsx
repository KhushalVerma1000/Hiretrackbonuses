import { ACTIONS, BAD, GOOD, HYGIENE, OLD_X, OWNER_LABEL, STAGE_DEFS } from "./calc";

const READ = [
  "Candidate-days over target: candidates waiting × days beyond the target. It counts both a few very late candidates and many slightly late ones.",
  "Share over target: candidate-days over target ÷ all waiting candidate-days. This is the number behind Flowing, Slowing or Stalled.",
  "Who owns the next step: your team (screening, submitting), the client (feedback, decisions) or candidates (offer answer, joining). The fix is different for each.",
  "Oldest at risk: the longest-waiting candidate in a stage has waited more than twice the target.",
];
const WEEK = [
  "Day 1: contact every at-risk candidate by phone, not message. Confirm they are still interested.",
  "Day 2: fix your own stages first (screen and submit within one working day).",
  "Day 3: call each client who owes feedback and agree a dated decision.",
  "Day 4: call every candidate with an open offer and agree an answer date.",
  "Day 5: add a next step and date to every candidate; fill any gaps in the process habits.",
  "Next week: run the audit again and compare candidate-days over target.",
];
const CHASE = [
  ["Day 1 after submitting", "Message the client: 'Sent 3 profiles for the role. Could we have your view by Thursday?'"],
  ["Day 2", "Call the client. Ask which profile they liked and what is stopping a decision."],
  ["Day 4", "Ask whether the role is still a priority and offer to send alternatives."],
  ["Day 6", "Escalate politely to the budget holder or your account lead."],
];
const GLOSSARY: [string, string][] = [
  ["Bottleneck", "The stage that holds up the most candidate-days over target."],
  ["Candidate-days", "Candidates multiplied by days. Ten candidates waiting three extra days is 30 candidate-days."],
  ["Target days", "The longest a candidate should wait at a stage, set by you."],
  ["Stage owner", "Who has to act next: your team, the client or the candidate."],
  ["Time to fill", "Calendar days from role opening to the candidate accepting."],
  ["Counter-offer", "A better offer from a candidate's current employer to stop them leaving."],
  ["Notice period", "The time between accepting an offer and starting."],
];

export default function Toolkit() {
  return (
    <section className="card" style={{ marginTop: 24 }} aria-label="Pipeline audit toolkit">
      <h2>Pipeline audit toolkit: everything in one place</h2>

      <h3>1. The six stages and who owns them</h3>
      <div className="scroll"><table><thead><tr><th>Stage</th><th>Next step belongs to</th><th>Starting target (assumption)</th></tr></thead><tbody>{STAGE_DEFS.map((d) => <tr key={d.key}><td><b>{d.label}</b><br />{d.help}</td><td>{OWNER_LABEL[d.owner]}</td><td>{d.tgt} days</td></tr>)}</tbody></table></div>
      <p className="hint">Targets are planning assumptions, not statistics. Replace them with what you agree with clients and what your market allows.</p>

      <h3>2. How to read the result</h3>
      <ul>{READ.map((x) => <li key={x}>{x}</li>)}</ul>
      <p className="hint">Verdict thresholds are assumptions: Flowing under {GOOD * 100}% of waiting time over target, Slowing up to {BAD * 100}%, Stalled at {BAD * 100}% or more. The oldest-at-risk flag uses {OLD_X} times the target.</p>

      <h3>3. What to do at each stage</h3>
      <dl>{STAGE_DEFS.map((d) => <div key={d.key}><dt><b>{d.label}</b></dt><dd>{ACTIONS[d.key].what}</dd><dd>{ACTIONS[d.key].do.join(" ")}</dd></div>)}</dl>

      <h3>4. A five-day fix week</h3>
      <ol>{WEEK.map((x) => <li key={x}>{x}</li>)}</ol>

      <h3>5. Client feedback chase script</h3>
      <div className="scroll"><table><thead><tr><th>When</th><th>What to do</th></tr></thead><tbody>{CHASE.map(([a, b]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td></tr>)}</tbody></table></div>

      <h3>6. Six process habits</h3>
      <ul>{HYGIENE.map((h) => <li key={h.q}>☐ {h.q}. {h.fix}</li>)}</ul>

      <h3>7. Weekly pipeline review (20 minutes)</h3>
      <ol>
        <li>List every candidate waiting beyond target, oldest first.</li>
        <li>Name the next step, the owner and the date for each.</li>
        <li>Pick the one stage to fix this week.</li>
        <li>Check that no candidate went more than two working days without an update.</li>
      </ol>

      <h3>8. Glossary</h3>
      <dl>{GLOSSARY.map(([a, b]) => <div key={a}><dt><b>{a}</b></dt><dd>{b}</dd></div>)}</dl>
    </section>
  );
}
