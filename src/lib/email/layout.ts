import { SITE, productLink, abs } from "@/lib/site";
import type { BonusMeta } from "@/lib/types";
import type { BonusEmailContent } from "./types";

// Escape anything that is not a hard-coded string before it goes into HTML.
export const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Small helpers so bonus builders stay readable. All styles are inline because email clients drop <style>.
const INK = "#4a2c2c", MUT = "#7d604d", LINE = "#6a3b3b", BG = "#fdf6e6", CARD = "#fffdf6", HOT = "#f27d72", SOFT = "#f3e2bf";
export const h2 = (t: string) => `<h2 style="margin:22px 0 8px;font-size:18px;line-height:1.3;color:${INK}">${esc(t)}</h2>`;
export const p = (t: string, muted = false) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:${muted ? MUT : INK}">${esc(t)}</p>`;
export const big = (t: string) => `<div style="font-size:34px;font-weight:800;line-height:1.2;color:${INK};margin:4px 0 8px">${esc(t)}</div>`;
export const list = (items: string[]) =>
  `<ol style="margin:0 0 12px;padding-left:20px;font-size:15px;line-height:1.55;color:${INK}">${items.map((i) => `<li style="margin-bottom:6px">${esc(i)}</li>`).join("")}</ol>`;
export const table = (rows: [string, string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 12px">${rows
    .map(([a, b]) => `<tr><td style="padding:8px 0;border-bottom:1px solid ${SOFT};font-size:15px;color:${INK}">${esc(a)}</td><td align="right" style="padding:8px 0;border-bottom:1px solid ${SOFT};font-size:15px;font-weight:700;color:${INK}">${esc(b)}</td></tr>`)
    .join("")}</table>`;
export const button = (label: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px 0"><tr><td style="background:${HOT};border:3px solid ${LINE};border-radius:14px"><a href="${esc(href)}" style="display:inline-block;padding:11px 20px;font-size:15px;font-weight:800;color:#ffffff;text-decoration:none">${esc(label)}</a></td></tr></table>`;

// Wraps a bonus's body in the shared shell. `unsubscribeUrl` is optional (omitted when no secret is configured).
export function renderEmail(meta: BonusMeta, body: BonusEmailContent, unsubscribeUrl: string | null) {
  const pageUrl = abs(`/bonuses/${meta.slug}`);
  const bridgeUrl = productLink(meta.slug, "email");
  const unsub = unsubscribeUrl ? ` <a href="${esc(unsubscribeUrl)}" style="color:${MUT}">Unsubscribe</a>.` : "";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(body.subject)}</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:'Trebuchet MS','Segoe UI',Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(body.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 4px 12px;font-size:14px;font-weight:800;color:${INK}">${esc(meta.emoji)} ${esc(SITE.name)}</td></tr>
<tr><td style="background:${CARD};border:3px solid ${LINE};border-radius:20px;padding:22px">
${body.html}
<div style="border-top:2px dashed ${SOFT};margin:22px 0 0;padding-top:4px">${h2(meta.bridge.heading)}${p(meta.bridge.body)}${button(meta.bridge.cta, bridgeUrl)}</div>
</td></tr>
<tr><td style="padding:14px 4px;font-size:12px;line-height:1.5;color:${MUT}">You are getting this because you asked for the ${esc(meta.title)} on <a href="${esc(pageUrl)}" style="color:${MUT}">${esc(SITE.url.replace(/^https?:\/\//, ""))}</a>. Sent by ${esc(SITE.company)}, the makers of HireTrack. <a href="${esc(abs("/privacy"))}" style="color:${MUT}">Privacy Policy</a>.${unsub}</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    body.text.trim(), "",
    `${meta.bridge.heading}`, meta.bridge.body, `${meta.bridge.cta}: ${bridgeUrl}`, "",
    `You are getting this because you asked for the ${meta.title} on ${SITE.url}. Sent by ${SITE.company}. Privacy Policy: ${abs("/privacy")}`,
    unsubscribeUrl ? `Unsubscribe: ${unsubscribeUrl}` : "",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
  return { html, text };
}

// Used for any bonus that has no email builder of its own (or when its payload is unusable).
export function genericBonusEmail(meta: BonusMeta): BonusEmailContent {
  const url = abs(`/bonuses/${meta.slug}`);
  return {
    subject: `Your free ${meta.title}`,
    preheader: `Here is your link to the ${meta.title}.`,
    html: `${p(`Thanks for unlocking the ${meta.title}.`)}${p(meta.description, true)}${button(`Open the ${meta.title}`, url)}`,
    text: `Thanks for unlocking the ${meta.title}.\n\n${meta.description}\n\nOpen it here: ${url}`,
  };
}
