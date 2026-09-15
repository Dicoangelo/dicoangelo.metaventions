import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dico Angelo | Revenue Technology and GTM Operations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px 76px", background: "#f8f7f3", color: "#202923" }}>
      <div style={{ display: "flex", fontSize: 23, color: "#426450" }}>Dico Angelo</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, letterSpacing: -2 }}>Revenue technology.</div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, letterSpacing: -2 }}>GTM operations.</div>
        <div style={{ display: "flex", fontSize: 28, color: "#526158", marginTop: 16 }}>Systems, adoption, and practical AI.</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#526158" }}>
        <div style={{ display: "flex" }}>Revenue Technology Manager at EZRA</div>
        <div style={{ display: "flex" }}>dicoangelo.metaventionsai.com</div>
      </div>
    </div>,
    size,
  );
}
