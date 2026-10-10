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
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fdf6e6", border: "16px solid #6a3b3b", padding: 56, color: "#4a2c2c" }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>HireTrack Bonuses</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: "#a8e6cf", border: "6px solid #6a3b3b", marginBottom: 16 }} />
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.1 }}>{m?.title}</div>
          <div style={{ fontSize: 34, marginTop: 16, color: "#7d604d" }}>{m?.audience}</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, background: "#f27d72", color: "#fff", padding: "10px 24px", borderRadius: 40, alignSelf: "flex-start" }}>Free tool</div>
      </div>
    ),
    size,
  );
}
