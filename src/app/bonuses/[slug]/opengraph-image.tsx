import { ImageResponse } from "next/og";
import { bonuses, getBonus } from "@/bonuses";

export const alt = "HireTrack free tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export function generateStaticParams() { return bonuses.map((b) => ({ slug: b.meta.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const m = getBonus((await params).slug)?.meta;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0e1f33", padding: 64, color: "#ffffff" }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>HireTrack Bonuses</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 72, height: 8, borderRadius: 4, background: "#6fa6ff", marginBottom: 28 }} />
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.1 }}>{m?.title}</div>
          <div style={{ fontSize: 34, marginTop: 16, color: "#a3b3cb" }}>{m?.audience}</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, background: "#1553c7", color: "#fff", padding: "12px 26px", borderRadius: 10, alignSelf: "flex-start" }}>Free tool</div>
      </div>
    ),
    size,
  );
}
