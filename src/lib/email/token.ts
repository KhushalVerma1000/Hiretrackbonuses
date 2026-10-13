import { createHmac, timingSafeEqual } from "crypto";

// Signed, non-guessable unsubscribe token: base64url(leadId).hmac. No expiry on purpose, because
// unsubscribe links in old emails must keep working. Needs EMAIL_TOKEN_SECRET (long random string).
const secret = () => process.env.EMAIL_TOKEN_SECRET || "";
const mac = (id: string) => createHmac("sha256", secret()).update(id).digest("base64url").slice(0, 32);

export const tokensEnabled = () => secret().length >= 16;

export function signLeadToken(leadId: string): string | null {
  if (!tokensEnabled()) return null;
  return `${Buffer.from(leadId).toString("base64url")}.${mac(leadId)}`;
}

export function verifyLeadToken(token: string | null | undefined): string | null {
  if (!token || !tokensEnabled()) return null;
  const [idPart, sig] = token.split(".");
  if (!idPart || !sig) return null;
  const id = Buffer.from(idPart, "base64url").toString();
  const a = Buffer.from(sig), b = Buffer.from(mac(id));
  return a.length === b.length && timingSafeEqual(a, b) ? id : null;
}
