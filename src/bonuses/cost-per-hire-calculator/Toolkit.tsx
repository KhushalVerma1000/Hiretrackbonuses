import { ROLES } from "./toolkit-data";

const FORMULAS: [string, string][] = [
  ["Cost per hire", "(internal recruiting costs + external recruiting costs) ÷ number of hires. This is the standard method used in SHRM/ANSI-style benchmarking."],
  ["Agency fee", "annual salary × fee %"],
  ["Vacancy cost (this calculator)", "annual salary ÷ 260 working days × value factor × days the role stays open"],
  ["Value factor", "annual value the role produces ÷ annual salary (1 = the role is worth about its salary)"],
  ["Cost of a bad hire (this calculator)", "direct hiring cost + vacancy cost + monthly salary × months employed × % of time unproductive"],
  ["Annual hiring budget", "expected hires × your own cost per hire"],
  ["Time to fill", "date the offer is accepted − date the requisition opened"],
  ["Offer acceptance rate", "offers accepted ÷ offers made"],
];
const INTERNAL = ["Recruiter and HR salaries (the share spent on hiring)", "Interviewer and hiring-manager time", "Employee referral bonuses", "Onboarding and training"];
const EXTERNAL = ["Job ads and job-board fees", "Agency fees", "ATS and assessment tools", "Background and reference checks", "Travel, relocation and hiring events"];
const GLOSSARY: [string, string][] = [
  ["Requisition", "An approved request to fill a role."],
  ["Time to fill", "Days from opening the requisition to an accepted offer."],
  ["Time to hire", "Days from a candidate first entering your pipeline to an accepted offer. Definitions vary, so write yours down."],
  ["Vacancy cost", "The value lost while a role sits empty."],
  ["Loaded cost", "Salary plus the employer's extra costs such as taxes, benefits and equipment."],
  ["Quality of hire", "How well new hires perform and stay, measured by your own yardstick (for example, performance rating after 6 months)."],
  ["Source of hire", "The channel a hire came from, such as referral, job board, agency or career site."],
  ["Contingency fee", "An agency is paid only when a placement is made."],
  ["Retained search", "An agency is paid in stages, starting before the placement. Common for senior roles."],
  ["Replacement guarantee", "The agency re-fills or refunds if the hire leaves within an agreed period."],
];
const METRICS = ["Open roles and days each has been open", "Candidates at each stage and drop-off between stages", "Offer acceptance rate", "Source of hire", "Cost per hire (your own number)", "Hires who left in the first 90 days", "Requisitions per recruiter", "Candidates waiting more than 24 hours for a reply"];

export default function Toolkit() {
  return (
    <section className="card" style={{ marginTop: 24 }} aria-label="Hiring toolkit">
      <h2>Hiring toolkit: everything in one place</h2>
      <h3>1. Starting points by role type</h3>
      <p className="hint">Pick a role type in the calculator to load the value factor, days open and internal hours. These are planning assumptions, not statistics. Replace them with your own data. Agency fee ranges come from published fee guides and are always negotiable.</p>
      <div className="scroll"><table><thead><tr><th>Role type</th><th>Value factor</th><th>Days open</th><th>Typical agency fee</th><th>Why</th></tr></thead>
        <tbody>{ROLES.map((r) => <tr key={r.id}><td>{r.label}</td><td>{r.vm}</td><td>{r.days}</td><td>{r.fee}</td><td>{r.why}</td></tr>)}</tbody></table></div>
      <p className="hint"><b>How to set your own value factor:</b> divide the annual value the role produces (for sales, the revenue or margin it brings in; for support roles, use 1) by its annual salary.</p>

      <h3>2. Rules of thumb</h3>
      <ul>
        <li>Contingency agency fees are typically 15% to 25% of first-year salary; retained searches typically run higher, around 25% to 35% and sometimes up to 40% for hard-to-fill leadership roles. (<a href="https://hyring.com/free-hr-toolkit/hr-glossary/contingency-recruiting" target="_blank" rel="noopener noreferrer">Hyring HR toolkit</a>, <a href="https://taggd.in/hr-glossary/recruitment-fees/" target="_blank" rel="noopener noreferrer">Taggd</a>)</li>
        <li>The full first-year cost of an employee is often put at roughly 1.25 to 1.4 times base salary once taxes, benefits and equipment are included. This is a rule of thumb that varies by country. (<a href="https://hyring.com/blog/recruitment-agency-fees-usa/" target="_blank" rel="noopener noreferrer">Hyring</a>)</li>
        <li>Contingency placements commonly come with a replacement guarantee. Check the length in your contract.</li>
        <li>Laws and payroll costs differ by country. Confirm with local counsel or your payroll provider.</li>
      </ul>

      <h3>3. What to include in cost per hire</h3>
      <div className="two"><div><b>Internal</b><ul>{INTERNAL.map((x) => <li key={x}>{x}</li>)}</ul></div><div><b>External</b><ul>{EXTERNAL.map((x) => <li key={x}>{x}</li>)}</ul></div></div>

      <h3>4. Formulas</h3>
      <div className="scroll"><table><tbody>{FORMULAS.map(([a, b]) => <tr key={a}><td><b>{a}</b></td><td style={{ textAlign: "left", fontWeight: 400 }}>{b}</td></tr>)}</tbody></table></div>

      <h3>5. Glossary</h3>
      <dl>{GLOSSARY.map(([a, b]) => <div key={a}><dt><b>{a}</b></dt><dd>{b}</dd></div>)}</dl>

      <h3>6. Monthly hiring metrics checklist</h3>
      <ul>{METRICS.map((x) => <li key={x}>☐ {x}</li>)}</ul>
    </section>
  );
}
