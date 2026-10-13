import { Resend } from "resend";
import { db } from "@/lib/db";
import { getBonus } from "@/bonuses";
import { abs } from "@/lib/site";
import { genericBonusEmail, renderEmail } from "./layout";
import { signLeadToken } from "./token";

// "sent"   delivered to Resend    "recent" we already emailed this person this bonus a moment ago (rate limit)
// "off"    email not configured   "failed" Resend or the database refused it (the unlock itself still works)
export type EmailResult = "sent" | "recent" | "off" | "failed";

const KIND = "BONUS_DELIVERY";
const MIN_GAP_MS = 2 * 60 * 1000; // at most one delivery email per person per bonus every 2 minutes...
const DAILY_MAX = 3;              // ...and three per day, so the form cannot be used to spam an inbox

let client: Resend | null = null;
const resend = (key: string) => (client ??= new Resend(key));

export async function sendBonusEmail(args: { leadId: string; email: string; bonusSlug: string; payload?: unknown }): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY, from = process.env.EMAIL_FROM;
  if (!key || !from) { console.warn("[email] RESEND_API_KEY or EMAIL_FROM not set, skipping"); return "off"; }
  const bonus = getBonus(args.bonusSlug);
  if (!bonus) return "failed";

  const prisma = db();
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await prisma.emailLog.findMany({
      where: { leadId: args.leadId, bonusSlug: args.bonusSlug, kind: KIND, status: "SENT", createdAt: { gte: since } },
      select: { createdAt: true }, orderBy: { createdAt: "desc" },
    });
    if (recent.length >= DAILY_MAX || (recent[0] && Date.now() - recent[0].createdAt.getTime() < MIN_GAP_MS)) return "recent";

    let content = null;
    try { content = bonus.email ? bonus.email(args.payload) : null; } catch (e) { console.error("[email] builder failed, using generic email", e); }
    content ??= genericBonusEmail(bonus.meta);

    const token = signLeadToken(args.leadId);
    const unsubscribeUrl = token ? abs(`/unsubscribe?t=${encodeURIComponent(token)}`) : null;
    const { html, text } = renderEmail(bonus.meta, content, unsubscribeUrl);

    const { data, error } = await resend(key).emails.send({
      from,
      to: args.email,
      subject: content.subject,
      html,
      text,
      replyTo: process.env.EMAIL_REPLY_TO || undefined,
      attachments: content.attachments?.map((a) => ({ filename: a.filename, content: Buffer.from(a.content, "utf-8"), contentType: a.contentType })),
      headers: token ? { "List-Unsubscribe": `<${abs(`/api/unsubscribe?t=${encodeURIComponent(token)}`)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : undefined,
      tags: [{ name: "kind", value: "bonus_delivery" }, { name: "bonus", value: args.bonusSlug.replace(/[^a-zA-Z0-9_-]/g, "_") }],
    });

    await prisma.emailLog.create({ data: { leadId: args.leadId, bonusSlug: args.bonusSlug, kind: KIND, status: error ? "FAILED" : "SENT", providerId: data?.id ?? null, error: error ? `${error.name}: ${error.message}`.slice(0, 300) : null } });
    if (error) { console.error("[email] resend error", error); return "failed"; }
    return "sent";
  } catch (e) {
    console.error("[email] unexpected error", e);
    return "failed";
  }
}
