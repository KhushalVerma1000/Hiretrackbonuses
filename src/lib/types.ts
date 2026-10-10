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
};
