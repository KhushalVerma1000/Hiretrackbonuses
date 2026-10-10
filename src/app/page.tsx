import type { Metadata } from "next";
import Link from "next/link";
import { bonuses, planned } from "@/bonuses";
import { SITE, abs } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: { absolute: "Free Hiring Tools and Templates for HR Teams and Agencies | HireTrack Bonuses" },
  description: "A free bundle of hiring calculators, scorecards and checklists for recruitment agencies and HR teams. No fluff, works in any country.",
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "Free hiring tools for agencies and HR teams", description: "Calculators, templates and checklists from HireTrack." },
};

export default function Home() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: "HireTrack Bonuses", itemListElement: bonuses.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.meta.title, url: abs(`/bonuses/${b.meta.slug}`) })) }} />
      <h1>Free hiring tools for agencies and HR teams</h1>
      <p className="lead">The HireTrack bonus bundle: practical calculators, templates and checklists you can use today. Every tool works in any country and uses only your own numbers.</p>
      <section className="cards" aria-label="Free tools">
        {bonuses.map(({ meta }) => (
          <Link key={meta.slug} href={`/bonuses/${meta.slug}`} className="card">
            <div className="emoji" aria-hidden="true">{meta.emoji}</div>
            <h2>{meta.title}</h2>
            <p>{meta.description}</p>
            <span className="tag">{meta.format}</span><span className="tag">Free</span>
          </Link>
        ))}
      </section>
      <section style={{ marginTop: 32 }}>
        <h2>Coming soon</h2>
        <ul>{planned.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="hint">New bonuses are added regularly.</p>
      </section>
      <p style={{ marginTop: 24 }}><a className="btn" href={SITE.productUrl} target="_blank" rel="noopener">See how HireTrack streamlines hiring</a></p>
    </>
  );
}
