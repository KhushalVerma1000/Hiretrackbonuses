import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE, abs } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: "Free calculators, templates and checklists for recruitment agencies and HR teams, from HireTrack, the hiring tracker that works in every country.",
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, locale: "en" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#101f35" }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: SITE.company, url: SITE.companyUrl }} />
        <header className="top"><div className="wrap">
          <Link href="/" className="brand"><span className="mark" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3.2L13 4.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>HireTrack Bonuses</Link>
          <nav><a href={SITE.productUrl} target="_blank" rel="noopener">About HireTrack</a></nav>
        </div></header>
        <div className="wrap"><main>{children}</main></div>
        <footer><div className="wrap">HireTrack is a product by <a href={SITE.companyUrl} rel="noopener">{SITE.company}</a>. Tools use only the numbers you enter and are for planning purposes.</div></footer>
      </body>
    </html>
  );
}
