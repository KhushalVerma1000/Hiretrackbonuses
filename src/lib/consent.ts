// Single source of truth for consent wording. The API stores THIS text (not what the browser sends),
// so every consent record shows exactly what the person agreed to. Bump POLICY_VERSION when the
// wording or the privacy policy changes in a meaningful way.
export const POLICY_VERSION = "2026-10-10";
export const CONSENT_TEXT = {
  DATA_PROCESSING: "I agree to HireTrack (a product by Codzen) storing my email address to deliver this tool's full breakdown, as described in the Privacy Policy.",
  MARKETING_EMAILS: "I'd like to receive occasional hiring tips and HireTrack product updates by email. I can unsubscribe at any time.",
} as const;
