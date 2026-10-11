export type Faq = { q: string; a: string };
export type Benchmark = { value: string; label: string; detail: string; source: string; url: string; year: number };
export type BonusMeta = {
  slug: string;
  emoji: string;
  title: string;        // short name, used in <title> and cards
  h1: string;           // page headline
  description: string;  // meta description, aim for under 160 characters
  audience: string;
  format: string;
  keywords: string[];
  intro: string;        // crawlable paragraph shown above the tool
  faq: Faq[];           // rendered on the page and as FAQPage JSON-LD
  datePublished: string; // YYYY-MM-DD
  benchmarks?: Benchmark[]; // published stats shown for context only (always with source, year, link)
  benchmarkNote?: string;
  // Lead magnet design (Hormozi $100M Leads). Fill in before publishing; see BONUS_GUIDE.md.
  type: "reveals-problem" | "sample" | "one-step"; // what kind of lead magnet this is
  problem: string;      // the ONE narrow problem this solves, and for whom
  headlines: string[];  // 3+ H1 variants to test; h1 is the live one
  formats: string[];    // e.g. ["Web calculator", "CSV download", "Print / PDF"]
  bridge: { heading: string; body: string; cta: string }; // the next problem this reveals and how HireTrack solves it
};
