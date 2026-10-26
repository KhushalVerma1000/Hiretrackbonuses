import type { BonusMeta } from "@/lib/types";
const SHRM = "https://www.shrm.org/topics-tools/research/recruiting-benchmarking";
const GEM = "https://app.gem.com/blog/key-takeaways-from-the-2026-recruiting-benchmarks-report";
export const meta: BonusMeta = {
  slug: "recruiter-kpi-dashboard",
  emoji: "📊",
  title: "Recruiter KPI Dashboard",
  h1: "Which recruiter is really closing?",
  description: "Free recruiter KPI dashboard. Enter each recruiter's monthly numbers, see who is closing, where each one loses candidates and what to coach. Works in any country.",
  audience: "Recruitment agency owners, team leads and in-house HR managers",
  format: "Interactive dashboard",
  keywords: ["recruiter KPI dashboard", "recruiter performance tracking", "recruiter KPIs", "recruiting metrics template", "recruiter scorecard", "submission to interview ratio", "offer acceptance rate"],
  intro: "Most agencies track recruiter performance in scattered sheets, so nobody can say who is truly closing. This free dashboard turns one month of simple counts per recruiter (roles worked, candidates submitted, interviewed, offered, accepted and joined) into the conversion at each stage, a closing rate, a fair ranking and the single stage where each recruiter loses the most candidates. Add up to ten recruiters, compare each against the team, then download a CSV or print a coaching plan. It uses only the numbers you enter, works in any country and any currency, and is meant to start coaching conversations, not to judge people on numbers alone.",
  faq: [
    { q: "What are the most useful recruiter KPIs?", a: "Start with the four conversions of the hiring funnel: submitted to interviewed, interviewed to offer, offer to accepted and accepted to joined. Add the closing rate (joined divided by submitted), joined per role worked and average days to fill. These need only counts you already have." },
    { q: "How is the closing rate calculated?", a: "Closing rate is candidates joined divided by candidates submitted in the same period. It is shown only when a recruiter has submitted at least 10 candidates, because smaller samples swing too much to judge. Use the same period for every recruiter." },
    { q: "How does the dashboard find a recruiter's biggest leak?", a: "For each stage with at least 5 candidates it compares the recruiter's conversion with the team's combined conversion. The stage that trails by 5 points or more, by the widest margin, is the leak. With only one recruiter it compares against planning reference rates that you should replace with your own history." },
    { q: "Is it fair to rank recruiters on these numbers?", a: "Use the ranking as a prompt for coaching, not as the only basis for pay or performance decisions. Roles differ in difficulty, seniority and market, and small months are noisy. Compare like with like and look at several months. Confirm rules on employee performance data with local counsel." },
    { q: "Can a spreadsheet replace a recruiting tracker?", a: "For a handful of recruiters and one office it works well. As recruiters, clients and countries grow, manual updates fall behind, definitions drift and the numbers stop agreeing. That is the point where a shared tracker with goals per role and recruiter pays off." },
  ],
  datePublished: "2026-10-26",
  type: "one-step",
  problem: "Agencies cannot see which recruiter is actually closing, because performance data is scattered and stages are counted differently.",
  headlines: [
    "Which recruiter is really closing?",
    "The free recruiter KPI dashboard: know who is closing and where the rest lose candidates",
    "Stop guessing recruiter performance: see every stage in one dashboard",
  ],
  formats: ["Interactive dashboard", "CSV for Excel and Google Sheets", "Print or save as PDF coaching plan"],
  bridge: {
    heading: "A sheet works for a few recruiters. Then the updates start to slip.",
    body: "Once you have more recruiters, clients and countries, someone has to re-type these counts every month and the definitions drift. HireTrack tracks every candidate by stage as the work happens, so recruiter KPIs update on their own, goals are set per role and recruiter, and you see the leak while there is still time to fix it.",
    cta: "See how HireTrack tracks recruiters automatically",
  },
  benchmarks: [
    { value: "39 days", label: "median time to fill for nonexecutive roles in 2026", detail: "Calendar days; down from the previous year. Executive time to fill was unchanged. Survey of over 4,600 organisations, mostly US.", source: "SHRM 2026 Recruiting Executives Benchmarking", url: SHRM, year: 2026 },
    { value: "+67%", label: "rise in median requisitions per recruiter at extra-large organisations", detail: "Recruiter workload is rising, so per-recruiter volume needs context before you compare people.", source: "SHRM 2026 Recruiting Executives Benchmarking", url: SHRM, year: 2026 },
    { value: "0.5%", label: "of applicants receive an offer, roughly one hire per 200 applications", detail: "Only 8% of applicants advance past initial screening. These are applicant-level rates, so they are lower than the submitted-to-offer rates an agency sees.", source: "Gem 2026 Recruiting Benchmarks (data to May 2025)", url: GEM, year: 2026 },
  ],
  benchmarkNote: "All figures come from large US-centred datasets and may not match your country, industry or definitions. The dashboard does not use them: every number it shows comes from what you enter.",
};
