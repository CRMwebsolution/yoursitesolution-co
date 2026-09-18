import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Your Site Solution";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px",
          background: "#1F4A3A",
          color: "#FAFAF7",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "720px" }}>
          <div
            style={{
              width: "84px",
              height: "96px",
              borderRadius: "16px",
              background: "#16382C",
              color: "#C45C26",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
            }}
          >
            YS
          </div>
          <div style={{ fontSize: "64px", lineHeight: 0.95, fontFamily: "Georgia, serif" }}>
            Custom websites for small businesses.
          </div>
          <div style={{ fontSize: "28px", color: "#D8D3C8" }}>yoursitesolution.com</div>
        </div>
        <div
          style={{
            width: "18px",
            height: "180px",
            background: "#C45C26",
            borderRadius: "8px",
          }}
        />
      </div>
    ),
    size,
  );
}
