import type { Metadata } from "next";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };

export default async function Unsubscribe({ searchParams }: { searchParams: Promise<{ t?: string; done?: string }> }) {
  const { t, done } = await searchParams;
  return (
    <>
      <h1>Unsubscribe</h1>
      <div className="card faq">
        {done ? (
          <p>You are unsubscribed. We will not send you tips or product updates. If you unlock another tool, you can still receive that tool&apos;s report.</p>
        ) : t ? (
          <form method="post" action={`/api/unsubscribe?t=${encodeURIComponent(t)}`}>
            <p>Stop receiving hiring tips and HireTrack product updates by email?</p>
            <button className="btn" type="submit">Yes, unsubscribe me</button>
          </form>
        ) : (
          <p>This unsubscribe link is not valid. Use the link in the footer of any email we sent you.</p>
        )}
      </div>
    </>
  );
}
