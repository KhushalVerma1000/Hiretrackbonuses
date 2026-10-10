import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { POLICY_VERSION } from "@/lib/consent";

export const metadata: Metadata = { title: "Privacy Policy", description: "How HireTrack Bonuses collects, uses and protects your email address and consent choices.", alternates: { canonical: "/privacy" } };
const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function Privacy() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="hint">Version {POLICY_VERSION}</p>
      <div className="card faq">
        <h2>Who we are</h2>
        <p>HireTrack Bonuses is run by {SITE.company} ({SITE.companyUrl.replace("https://", "")}), the makers of HireTrack.</p>
        <h2>What we collect</h2>
        <p>When you unlock a tool we store your email address, which tool you unlocked, and the date and time. We also record your consent choices (what you agreed to, the exact wording, the policy version and when). For security and to prove consent, we store a one-way hash of your IP address (not the address itself) and your browser&apos;s user-agent text.</p>
        <h2>Why we collect it</h2>
        <p>To deliver the content you asked for and, only if you tick the optional box, to send you hiring tips and product updates. We rely on your consent.</p>
        <h2>Your choices</h2>
        <p>The marketing box is optional and unticked by default. You can withdraw consent at any time and ask us to access or delete your data{contact ? <>: <a href={`mailto:${contact}`}>{contact}</a></> : "."}</p>
        <h2>Retention and sharing</h2>
        <p>We keep your data for as long as needed for the purposes above or until you ask us to delete it. We do not sell your data. It is stored with our database provider and may be passed to the email or CRM tools we use to contact you.</p>
      </div>
    </>
  );
}
