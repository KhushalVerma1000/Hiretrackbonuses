import type { BonusMeta } from "@/lib/types";
const SHRM = "https://www.shrm.org/topics-tools/research/recruiting-benchmarking";
const IJ = "https://www.irishjobs.ie/recruiters/recruiters-news/whats-slowing-down-your-hiring-new-survey-reveals-the-top-blockers-and-breakthroughs/";
export const meta: BonusMeta = {
  slug: "pipeline-audit",
  emoji: "🔎",
  title: "Free Pipeline Audit",
  h1: "Where is your hiring pipeline stuck?",
  description: "Free hiring pipeline audit. Enter how many candidates are waiting at each stage and for how long, and get your bottleneck, who the pipeline is waiting on and a fix plan. Works in any country.",
  audience: "Recruitment agency owners, team leads and in-house HR managers",
  format: "Interactive audit and report",
  keywords: ["hiring pipeline audit", "recruitment pipeline bottleneck", "recruiting pipeline analysis", "time to hire delays", "candidate drop off", "recruitment pipeline review", "hiring process audit"],
  intro: "Pipelines rarely fail loudly. Candidates just wait, a day at a time, until they stop replying. This free audit looks at the candidates in your pipeline right now: how many are waiting at each of six stages, how long they have waited on average and the longest wait, against a target you set for each stage. It shows which stage holds up the most candidate-days, whether the delay sits with your team, the client or the candidates, and which candidates are most at risk. You also tick six process habits and get a fix plan. It uses only the numbers you enter, works in any country and takes about three minutes.",
  faq: [
    { q: "How does the pipeline audit find the bottleneck?", a: "For each stage it multiplies the candidates waiting by the days they have waited beyond your target. The stage with the most candidate-days over target is the bottleneck. A stage with a few candidates waiting a very long time and a stage with many candidates waiting slightly too long are both counted fairly." },
    { q: "What target days should I use?", a: "The audit starts with planning assumptions (for example 3 days for client feedback). Replace them with what you have agreed with clients or what has worked for you, and set the joining target to the notice period you work with. Your own targets matter more than any average." },
    { q: "What do Flowing, Slowing and Stalled mean?", a: "They compare time spent waiting beyond target with all waiting time. Under 10% over target is Flowing, 10% to 30% is Slowing and 30% or more is Stalled. These thresholds are assumptions to start the conversation, not published statistics." },
    { q: "Why does it show who the pipeline is waiting on?", a: "The fix depends on who owns the next step. If your team is the delay, change your routine. If the client is, change how you agree and chase feedback. If candidates are, change how you communicate and close." },
    { q: "Is my data stored or shared?", a: "Your counts stay in the page while you work. Only the numbers you enter (no names) are sent if you choose to unlock the email report, and they are used to write it." },
  ],
  datePublished: "2026-10-27",
  type: "reveals-problem",
  problem: "Teams do not know where their hiring pipeline stalls, so candidates go cold while everyone is busy.",
  headlines: [
    "Where is your hiring pipeline stuck?",
    "Free pipeline audit: find the bottleneck in three minutes",
    "Your candidates are waiting. Find out where, and on whom",
  ],
  formats: ["Interactive audit", "Written report by email", "CSV for Excel and Google Sheets", "Print or save as PDF"],
  bridge: {
    heading: "An audit shows today's stall. Pipelines stall again tomorrow.",
    body: "A one-off audit finds the bottleneck once. Keeping it fixed needs live visibility: every candidate by stage, how long each has waited, and an alert when someone passes the target. HireTrack tracks that as the work happens, so you see a stall while the candidate is still interested.",
    cta: "See how HireTrack shows stalls as they happen",
  },
  benchmarks: [
    { value: "39 days", label: "median time to fill for nonexecutive roles in 2026", detail: "Calendar days; survey of over 4,600 organisations, mostly US. Your own targets matter more than any average.", source: "SHRM 2026 Recruiting Executives Benchmarking", url: SHRM, year: 2026 },
    { value: "28%", label: "of candidates dropped out of a hiring process; 22% of those said it took too long and 21% said communication was unclear or slow", detail: "Survey of 824 candidates in Ireland, June to July 2025. The page also gives 29% in its text, so treat it as roughly 28 to 29%.", source: "IrishJobs recruiter survey, August 2025", url: IJ, year: 2025 },
    { value: "26%", label: "of recruiters say following up after interviews slows hiring; 19% say gathering feedback from hiring managers does", detail: "Survey of 475 recruiters in Ireland, June to July 2025.", source: "IrishJobs recruiter survey, August 2025", url: IJ, year: 2025 },
  ],
  benchmarkNote: "Figures come from specific surveys (a large mostly-US survey and an Irish survey) and may not match your country, industry or definitions. The audit does not use them: every result comes from what you enter.",
};
