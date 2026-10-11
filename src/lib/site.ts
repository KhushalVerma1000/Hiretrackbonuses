export const SITE = {
  name: "HireTrack Bonuses",
  tagline: "Free hiring tools for agencies and HR teams",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  productUrl: process.env.NEXT_PUBLIC_HIRETRACK_URL || "https://www.codzentechnology.com",
  company: "Codzen",
  companyUrl: "https://www.codzentechnology.com",
};
// Link to the product with UTM tags so each bonus and button placement can be measured.
export const productLink = (slug: string, placement: string) => {
  try {
    const u = new URL(SITE.productUrl);
    u.searchParams.set("utm_source", "bonuses"); u.searchParams.set("utm_medium", "lead-magnet");
    u.searchParams.set("utm_campaign", slug); u.searchParams.set("utm_content", placement);
    return u.toString();
  } catch { return SITE.productUrl; }
};
export const abs = (path: string) => `${SITE.url}${path}`;
