export const SITE = {
  name: "HireTrack Bonuses",
  tagline: "Free hiring tools for agencies and HR teams",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  productUrl: process.env.NEXT_PUBLIC_HIRETRACK_URL || "https://www.codzentechnology.com",
  company: "Codzen",
  companyUrl: "https://www.codzentechnology.com",
};
export const abs = (path: string) => `${SITE.url}${path}`;
