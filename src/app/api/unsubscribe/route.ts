import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyLeadToken } from "@/lib/email/token";
import { POLICY_VERSION } from "@/lib/consent";
import { abs } from "@/lib/site";

export const runtime = "nodejs";

// Handles both the confirm button on /unsubscribe and mail clients' one-click unsubscribe (RFC 8058).
// Consent is append-only, so withdrawal is a new MARKETING_EMAILS row with granted = false.
export async function POST(req: Request) {
  const t = new URL(req.url).searchParams.get("t");
  const leadId = verifyLeadToken(t);
  if (!leadId) return NextResponse.json({ ok: false, error: "invalid link" }, { status: 400 });
  try {
    const prisma = db();
    const last = await prisma.consent.findFirst({ where: { leadId, type: "MARKETING_EMAILS" }, orderBy: { createdAt: "desc" } });
    if (last?.granted !== false) {
      await prisma.consent.create({ data: { leadId, type: "MARKETING_EMAILS", granted: false, policyVersion: POLICY_VERSION, consentText: "Unsubscribed using the link in an email.", bonusSlug: "email-unsubscribe", sourcePath: "/unsubscribe" } });
    }
  } catch (e) {
    console.error("[unsubscribe] database error", e);
    return NextResponse.json({ ok: false, error: "could not save" }, { status: 500 });
  }
  return NextResponse.redirect(abs("/unsubscribe?done=1"), 303);
}
