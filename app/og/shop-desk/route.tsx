import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "640px" }}>
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#E08A5A",
              fontWeight: 700,
            }}
          >
            Shop dashboard demo
          </div>
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
          <div style={{ fontSize: "58px", lineHeight: 0.95, fontFamily: "Georgia, serif" }}>
            See what a shop desk can look like.
          </div>
          <div style={{ fontSize: "26px", color: "#D8D3C8" }}>
            Your Site Solution
          </div>
        </div>
        <div
          style={{
            width: "360px",
            height: "420px",
            background: "#FAFAF7",
            color: "#1A1C19",
            borderRadius: "18px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "18px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#5C5A54" }}>
            Desk
          </div>
          <div style={{ fontSize: "28px", fontFamily: "Georgia, serif" }}>Calendar</div>
          <div style={{ fontSize: "28px", fontFamily: "Georgia, serif" }}>Customers</div>
          <div style={{ fontSize: "28px", fontFamily: "Georgia, serif" }}>Files</div>
          <div style={{ fontSize: "28px", fontFamily: "Georgia, serif" }}>Gallery</div>
          <div
            style={{
              marginTop: "auto",
              background: "#C45C26",
              color: "#FAFAF7",
              borderRadius: "8px",
              padding: "14px 18px",
              fontSize: "20px",
              fontWeight: 700,
              display: "flex",
              justifyContent: "center",
            }}
          >
            Open the demo
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
