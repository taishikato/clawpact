import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://clawpact.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const supabase = await createClient();
  const { data: agents } = await supabase
    .from("agents")
    .select("slug, updated_at");

  const agentPages: MetadataRoute.Sitemap = (agents ?? []).map((agent) => ({
    url: `https://clawpact.com/agents/${agent.slug}`,
    lastModified: new Date(agent.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...agentPages];
}
