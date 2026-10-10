import type { BonusMeta } from "@/lib/types";
export const meta: BonusMeta = {
  slug: "cost-per-hire-calculator",
  emoji: "🧮",
  title: "Cost-per-Hire Calculator",
  h1: "What does one hire really cost?",
  description: "Free cost-per-hire calculator. Enter your own numbers to see the full cost of filling a role, including vacancy cost and the cost of a bad hire. Any currency.",
  audience: "In-house HR teams, recruitment agencies and founders",
  format: "Interactive calculator",
  keywords: ["cost per hire calculator", "cost of a bad hire", "recruitment cost calculator", "vacancy cost", "hiring budget"],
  intro: "Most teams count only the agency fee when they think about the cost of hiring. The real cost per hire also includes internal time, job ads and tools, onboarding, and every day the seat stays empty. This free calculator uses only the numbers you enter, so the result reflects your own hiring process rather than generic averages. It works in any currency and also estimates what one bad hire could cost you.",
  faq: [
    { q: "How is cost per hire calculated?", a: "Add the direct costs of filling a role (agency fees, internal recruiter time, job ads and tools), then add onboarding costs and the cost of the vacancy while the role is open. This calculator does that from your own inputs." },
    { q: "What is vacancy cost?", a: "Vacancy cost is the value lost while a role is empty. Here it is estimated as the role's daily salary multiplied by the days the role stays open and a value factor you set." },
    { q: "How is the cost of a bad hire estimated?", a: "It combines the cost of hiring again with the salary paid for the unproductive part of the months the person stayed. You choose the months and the unproductive share." },
    { q: "Does this calculator use industry statistics?", a: "No. Every figure comes from the inputs you enter, so you can re-run it with real data from your own process." },
  ],
  datePublished: "2026-10-10",
};
