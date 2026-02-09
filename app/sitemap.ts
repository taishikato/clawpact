import type { MetadataRoute } from "next";
import { mockAgents } from "@/lib/mock-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://clawpact.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Dynamic agent pages
  // TODO: Replace with real Supabase query when moving off mock data
  const agentPages: MetadataRoute.Sitemap = mockAgents.map((agent) => ({
    url: `https://clawpact.com/agents/${agent.slug}`,
    lastModified: new Date(agent.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...agentPages];
}
