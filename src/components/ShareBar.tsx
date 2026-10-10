"use client";
import { useState } from "react";
export default function ShareBar({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url), t = encodeURIComponent(text);
  const links: [string, string][] = [
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ["WhatsApp", `https://wa.me/?text=${t}%20${u}`],
    ["X", `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
    ["Email", `mailto:?subject=${t}&body=${u}`],
  ];
  return (
    <div className="share" aria-label="Share this tool">
      <b>Share this tool: </b><br />
      <button className="btn alt" onClick={async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? "Copied!" : "Copy link"}</button>
      {links.map(([n, h]) => <a key={n} className="btn alt" href={h} target="_blank" rel="noopener noreferrer">{n}</a>)}
    </div>
  );
}
