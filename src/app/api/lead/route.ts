import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: { email?: string; bonus?: string; website?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot: silently drop bots
  const email = (body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  const lead = { email, bonus: String(body.bonus || "").slice(0, 80), createdAt: new Date().toISOString() };
  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
      if (!r.ok) return NextResponse.json({ ok: false }, { status: 502 });
    } catch { return NextResponse.json({ ok: false }, { status: 502 }); }
  } else {
    console.log("[lead] LEAD_WEBHOOK_URL not set, lead not stored:", lead);
  }
  return NextResponse.json({ ok: true });
}
