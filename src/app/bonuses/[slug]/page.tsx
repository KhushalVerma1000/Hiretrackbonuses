import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bonuses, getBonus } from "@/bonuses";
import { SITE, abs } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import ShareBar from "@/components/ShareBar";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return bonuses.map((b) => ({ slug: b.meta.slug })); }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const b = getBonus((await params).slug);
  if (!b) return {};
  const m = b.meta, path = `/bonuses/${m.slug}`;
  return {
    title: m.title, description: m.description, keywords: m.keywords,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title: `${m.title}: free tool`, description: m.description },
    twitter: { card: "summary_large_image", title: m.title, description: m.description },
  };
}

export default async function BonusPage({ params }: P) {
  const b = getBonus((await params).slug);
  if (!b) notFound();
  const { meta: m, Component } = b, url = abs(`/bonuses/${m.slug}`);
  const others = bonuses.filter((x) => x.meta.slug !== m.slug);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: m.title, description: m.description, url, applicationCategory: "BusinessApplication", operatingSystem: "Any", datePublished: m.datePublished, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: SITE.company, url: SITE.companyUrl } }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: m.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Bonuses", item: abs("/") }, { "@type": "ListItem", position: 2, name: m.title, item: url }] }} />
      <p className="crumbs"><Link href="/">Bonuses</Link> / {m.title}</p>
      <h1>{m.h1}</h1>
      <p className="lead">{m.intro}</p>
      <Component />
      {m.benchmarks && (
        <section className="card" style={{ marginTop: 24 }} aria-label="Industry benchmarks">
          <h2>Industry benchmarks for context</h2>
          <p className="hint">Published figures, mostly from US employers and in US dollars. Your own numbers drive the calculator above.</p>
          <div className="bench">
            {m.benchmarks.map((x) => (
              <div key={x.label}><div className="big small">{x.value}</div><b>{x.label}</b>
                <p className="hint">{x.detail} <a href={x.url} target="_blank" rel="noopener noreferrer">{x.source}</a>, {x.year}.</p></div>
            ))}
          </div>
          {m.benchmarkNote && <p className="hint">{m.benchmarkNote}</p>}
        </section>
      )}
      <ShareBar url={url} text={`${m.title} (free): ${m.h1}`} />
      <section className="faq card" aria-label="Frequently asked questions">
        <h2>Frequently asked questions</h2>
        {m.faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </section>
      {others.length > 0 && (
        <section style={{ marginTop: 24 }}><h2>More free tools</h2>
          <div className="cards">{others.map((o) => <Link key={o.meta.slug} href={`/bonuses/${o.meta.slug}`} className="card"><div className="emoji" aria-hidden="true">{o.meta.emoji}</div><h2>{o.meta.title}</h2><p>{o.meta.description}</p></Link>)}</div></section>
      )}
      <p style={{ marginTop: 24 }}><a className="btn" href={SITE.productUrl} target="_blank" rel="noopener">Track every hire in HireTrack</a></p>
    </>
  );
}
