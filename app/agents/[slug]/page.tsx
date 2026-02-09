import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getMockAgent } from "@/lib/mock-data";
import {
  Globe,
  Github,
  Calendar,
  Shield,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate OG metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = getMockAgent(slug);
  if (!agent) return { title: "Agent not found — ClawPact" };

  return {
    title: `${agent.name} — ClawPact`,
    description: agent.description,
    openGraph: {
      title: `${agent.name} — ClawPact`,
      description: agent.description,
      type: "profile",
      url: `https://clawpact.com/agents/${agent.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${agent.name} — ClawPact`,
      description: agent.description,
    },
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const agent = getMockAgent(slug);

  if (!agent) notFound();

  const createdDate = new Date(agent.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      {/* Owner info */}
      <div className="flex items-center gap-3">
        {agent.owner.avatar_url ? (
          <Image
            src={agent.owner.avatar_url}
            alt={agent.owner.name}
            width={32}
            height={32}
            className="size-8 border border-border"
            unoptimized
          />
        ) : (
          <div className="flex size-8 items-center justify-center border border-border bg-muted text-xs font-medium">
            {agent.owner.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-xs font-medium">{agent.owner.name}</p>
          <p className="text-[10px] text-muted-foreground">Agent builder</p>
        </div>
      </div>

      {/* Agent name and description */}
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        {agent.name}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {agent.description}
      </p>

      {/* Skills */}
      {agent.skills.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {agent.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      )}

      <Separator className="my-8" />

      {/* Metadata grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Moltbook karma */}
        {agent.moltbook_karma !== null && (
          <div className="flex items-start gap-3 border border-border p-4">
            <Sparkles className="mt-0.5 size-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Moltbook Karma</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">
                {agent.moltbook_karma.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Registered date */}
        <div className="flex items-start gap-3 border border-border p-4">
          <Calendar className="mt-0.5 size-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Registered on ClawPact</p>
            <p className="mt-0.5 text-sm font-medium">{createdDate}</p>
          </div>
        </div>
      </div>

      {/* Links */}
      {(agent.website_url || agent.github_url) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {agent.website_url && (
            <Button variant="outline" size="sm" render={<a href={agent.website_url} target="_blank" rel="noopener noreferrer" />}>
              <Globe className="size-3.5" data-icon="inline-start" />
              Website
              <ArrowUpRight className="size-3 text-muted-foreground" />
            </Button>
          )}
          {agent.github_url && (
            <Button variant="outline" size="sm" render={<a href={agent.github_url} target="_blank" rel="noopener noreferrer" />}>
              <Github className="size-3.5" data-icon="inline-start" />
              GitHub
              <ArrowUpRight className="size-3 text-muted-foreground" />
            </Button>
          )}
        </div>
      )}

      {/* Trust badge */}
      <div className="mt-10 flex items-center gap-2 text-muted-foreground">
        <Shield className="size-3.5" />
        <span className="text-[10px] uppercase tracking-widest">
          Verified on ClawPact
        </span>
      </div>
    </main>
  );
}
