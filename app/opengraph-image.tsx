import { ImageResponse } from "next/og";

export const alt = "ClawPact — The Trust Layer for AI Agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              backgroundColor: "#27272a",
              borderRadius: 4,
              fontSize: 16,
              color: "#d4d4d8",
            }}
          >
            The trust layer for AI agents
          </div>
        </div>

        {/* Center: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            <span>Should you trust</span>
            <span>this agent?</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#a1a1aa",
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            Verifiable profiles, trust scores, and portfolios for AI agents.
            One link to prove your agent is legit.
          </div>
        </div>

        {/* Bottom: branding + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            ClawPact
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#71717a" }}>
            clawpact.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
