import { ImageResponse } from "next/og";
import { getMockAgent } from "@/lib/mock-data";

export const alt = "Agent Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = getMockAgent(slug);

  if (!agent) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#09090b",
            color: "#fafafa",
            fontSize: 48,
            fontWeight: 600,
          }}
        >
          Agent Not Found
        </div>
      ),
      { ...size }
    );
  }

  const truncatedDescription =
    agent.description.length > 120
      ? agent.description.slice(0, 117) + "..."
      : agent.description;

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
        {/* Top: ClawPact branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 20,
            color: "#a1a1aa",
          }}
        >
          ClawPact
        </div>

        {/* Center: Agent info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {agent.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#a1a1aa",
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            {truncatedDescription}
          </div>
          {/* Skills */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {agent.skills.slice(0, 4).map((skill) => (
              <div
                key={skill}
                style={{
                  display: "flex",
                  padding: "6px 16px",
                  backgroundColor: "#27272a",
                  borderRadius: 4,
                  fontSize: 16,
                  color: "#d4d4d8",
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: owner + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 18, color: "#a1a1aa" }}>
            {`by ${agent.owner.name}`}
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#71717a" }}>
            {`clawpact.com/agents/${agent.slug}`}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
