import type { BonusMeta } from "@/lib/types";
const LC = "https://www.livecareer.com/resources/careers/1-in-4-job-seekers-have-ghosted-a-potential-employer";
export const meta: BonusMeta = {
  slug: "ghosting-risk-score",
  emoji: "👻",
  title: "Candidate Ghosting Risk Score",
  h1: "Which of your candidates will ghost you?",
  description: "Free candidate ghosting risk score. Rate any candidate in 2 minutes, see why they may vanish and what to do before they stop replying. Works in any country.",
  audience: "Recruiters, recruitment agencies and in-house HR teams",
  format: "Interactive score tool",
  keywords: ["candidate ghosting", "candidate ghosting risk score", "how to stop candidates ghosting", "candidate no show", "offer dropout", "recruiter follow up"],
  intro: "Candidates rarely vanish without warning. Slow replies, no agreed next step, a pay gap or another offer all show up days earlier. This free score turns those signals into a 0 to 100 ghosting risk for each candidate, shows the three biggest reasons behind the number, and tells you what to do about each one. Add up to ten candidates to rank your shortlist by risk. It uses only what you enter, works in any country, and treats the score as a prompt for follow-up, never as a reason to reject someone.",
  faq: [
    { q: "What is candidate ghosting?", a: "Candidate ghosting is when a candidate stops replying without explanation. It can happen after an application, after an interview, after an offer, or as a no-show on the first day of work." },
    { q: "How is the ghosting risk score calculated?", a: "You answer nine questions about one candidate: other offers, days of silence, your reply speed, pay alignment, role match, next-step clarity, engagement, time in process and, once an offer is made, notice period. Each answer adds points, up to 100 in total. The full points table is printed in the toolkit below the tool." },
    { q: "Is the score a prediction?", a: "No. The weights are planning assumptions based on the reasons candidates say they ghost, not a statistical model. Use it to decide who needs a follow-up first. After you log 20 or more outcomes, compare scores with who actually vanished and adjust your own thresholds." },
    { q: "At which stage do candidates ghost?", a: "Any stage. In LiveCareer's 2026 survey of US workers, 15% of job seekers said they stopped responding after applying, 13% after a screening call or interview, and 8% after receiving a job offer. These are US figures, so treat them as context for your own market." },
    { q: "Is it fair to score candidates?", a: "The score uses process signals only: timing, communication, pay, clarity and competing offers. Do not add personal traits such as age, gender, nationality or religion, and do not reject someone because of a score. Use it to decide who to call first. Confirm local rules on data and contact with local counsel." },
  ],
  datePublished: "2026-10-23",
  type: "reveals-problem",
  problem: "Recruiters lose candidates mid-process and cannot tell in advance who is about to vanish.",
  headlines: [
    "Which of your candidates will ghost you?",
    "Ghosting risk score: a 2-minute check",
    "Stop losing candidates mid-process: score the risk before they vanish",
  ],
  formats: ["Interactive score tool", "Ranked shortlist", "CSV download", "Print or save as PDF"],
  bridge: {
    heading: "Know who might vanish? Now stop it happening again.",
    body: "A score shows who is at risk today. The cause is usually slow follow-ups and no single view of where every candidate stands. HireTrack tracks every candidate by stage in one place and sets goals per role and recruiter, so follow-ups do not slip.",
    cta: "See how HireTrack keeps follow-ups on track",
  },
  benchmarks: [
    { value: "25%", label: "of US job seekers say they have ghosted an employer", detail: "Survey of 1,008 employed US adults.", source: "LiveCareer Vanishing Candidate Report", url: LC, year: 2026 },
    { value: "51%", label: "of candidates who ghosted say they had accepted another job", detail: "The most common reason, ahead of losing interest (32%).", source: "LiveCareer Vanishing Candidate Report", url: LC, year: 2026 },
    { value: "39%", label: "would consider ghosting after a bad or unfair hiring experience", detail: "Pay not competitive (23%) and a misleading job description (19%) were also cited.", source: "LiveCareer Vanishing Candidate Report", url: LC, year: 2026 },
    { value: "29%", label: "say consistent updates at each stage would prevent ghosting", detail: "The top answer, followed by salary and timeline transparency (25%) and clear next-step timelines (23%).", source: "LiveCareer Vanishing Candidate Report", url: LC, year: 2026 },
    { value: "15% / 13% / 8%", label: "stopped responding after applying / after a screening call or interview / after an offer", detail: "Share of all job seekers surveyed, so ghosting is not limited to early stages.", source: "LiveCareer Vanishing Candidate Report", url: LC, year: 2026 },
    { value: "53%", label: "of job seekers were ghosted by an employer in the past year", detail: "Up from 48% in 2025 and 38% in 2024. Candidates who are ghosted tend to lose trust, which feeds the cycle. As reported by Fortune.", source: "Criteria 2026 Candidate Experience Report, via Fortune", url: "https://fortune.com/2026/03/20/job-seekers-arent-imagining-things-candidates-ghosted-by-employers-hit-three-year-high/", year: 2026 },
  ],
  benchmarkNote: "All figures come from US surveys and are self-reported, so they may not match your country or industry. Definitions of ghosting differ between studies. The score on this page does not use these figures; it uses only what you enter.",
};
