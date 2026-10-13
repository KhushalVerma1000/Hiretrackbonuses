import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { db } from "@/lib/db";
import { getBonus } from "@/bonuses";
import { CONSENT_TEXT, POLICY_VERSION } from "@/lib/consent";
import { sendBonusEmail, type EmailResult } from "@/lib/email/send";

export const runtime = "nodejs";
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  let b: { email?: string; bonus?: string; website?: string; consentProcessing?: boolean; consentMarketing?: boolean; path?: string; payload?: unknown };
  try { b = await req.json(); } catch { return bad("invalid request"); }
  if (b.website) return NextResponse.json({ ok: true }); // honeypot: silently drop bots

  const email = (b.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return bad("invalid email");
  const bonusSlug = String(b.bonus || "");
  if (!getBonus(bonusSlug)) return bad("unknown bonus");
  if (b.consentProcessing !== true) return bad("consent required"); // no consent, nothing is stored
  const marketing = b.consentMarketing === true;

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const salt = process.env.IP_HASH_SALT;
  const ipHash = ip && salt ? createHash("sha256").update(salt + ip).digest("hex") : null;
  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;
  const sourcePath = typeof b.path === "string" ? b.path.slice(0, 200) : null;
  const payload = JSON.stringify(b.payload ?? null).length <= 4000 ? b.payload : undefined; // inputs for the personalised email, size-capped
  const base = { policyVersion: POLICY_VERSION, bonusSlug, sourcePath, ipHash, userAgent };

  let leadId: string;
  try {
    const prisma = db();
    const lead = await prisma.lead.upsert({ where: { email }, update: {}, create: { email } });
    leadId = lead.id;
    await prisma.$transaction([
      prisma.bonusSignup.upsert({ where: { leadId_bonusSlug: { leadId: lead.id, bonusSlug } }, update: {}, create: { leadId: lead.id, bonusSlug } }),
      prisma.consent.createMany({ data: [
        { leadId: lead.id, type: "DATA_PROCESSING", granted: true, consentText: CONSENT_TEXT.DATA_PROCESSING, ...base },
        { leadId: lead.id, type: "MARKETING_EMAILS", granted: marketing, consentText: CONSENT_TEXT.MARKETING_EMAILS, ...base },
      ] }),
    ]);
  } catch (e) {
    console.error("[lead] database error", e);
    return bad("could not save", 500);
  }

  const hook = process.env.LEAD_WEBHOOK_URL; // optional, best effort: the database already has the lead
  if (hook) {
    fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, bonus: bonusSlug, marketingConsent: marketing, createdAt: new Date().toISOString() }) })
      .catch((e) => console.error("[lead] webhook failed", e));
  }

  // Delivery email (Resend). Never blocks the unlock: the lead is already saved, so a failure only means no email.
  const mail: EmailResult = await sendBonusEmail({ leadId, email, bonusSlug, payload });
  return NextResponse.json({ ok: true, email: mail });
}
