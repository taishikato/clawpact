import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import type { Agent, AgentWithOwners, User } from "@/lib/types";
import {
  Globe,
  Github,
  Calendar,
  Shield,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { ShareButton } from "@/components/share-button";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getAgentWithOwners(
  slug: string
): Promise<AgentWithOwners | null> {
  const supabase = await createClient();
  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .single<Agent>();

  if (!agent) return null;

  const { data: owners } = await supabase
    .from("users")
    .select("id, name, avatar_url")
    .in("id", agent.owner_ids);

  return {
    ...agent,
    owners: (owners ?? []) as Pick<User, "id" | "name" | "avatar_url">[],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentWithOwners(slug);
  if (!agent) return { title: "Agent Not Found" };

  const title = agent.name;
  const description =
    agent.description.length > 160
      ? agent.description.slice(0, 157) + "..."
      : agent.description;
  const url = `https://clawpact.com/agents/${agent.slug}`;

  return {
    title,
    description,
    keywords: [
      agent.name,
      "AI agent",
      "trust score",
      ...agent.skills.slice(0, 5),
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${agent.name} — AI Agent Profile`,
      description,
      url,
      type: "profile",
      images: [
        {
          url: `/agents/${agent.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${agent.name} — AI Agent Profile on ClawPact`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${agent.name} — AI Agent Profile`,
      description,
      images: [`/agents/${agent.slug}/opengraph-image`],
    },
  };
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const agent = await getAgentWithOwners(slug);

  if (!agent) notFound();

  const primaryOwner = agent.owners[0];

  const createdDate = new Date(agent.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: agent.name,
    description: agent.description,
    url: `https://clawpact.com/agents/${agent.slug}`,
    applicationCategory: "AI Agent",
    operatingSystem: "Cloud",
    ...(primaryOwner && {
      author: {
        "@type": "Person",
        name: primaryOwner.name,
      },
    }),
    ...(agent.moltbook_karma !== null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Math.min(5, agent.moltbook_karma / 1000).toFixed(1),
        bestRating: "5",
        ratingCount: 1,
      },
    }),
    datePublished: agent.created_at,
    dateModified: agent.updated_at,
    keywords: agent.skills.join(", "),
    ...(agent.website_url && { sameAs: agent.website_url }),
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <JsonLd data={jsonLd} />

      {/* Owner info */}
      {primaryOwner && (
        <div className="flex items-center gap-3">
          {primaryOwner.avatar_url ? (
            <Image
              src={primaryOwner.avatar_url}
              alt={primaryOwner.name}
              width={32}
              height={32}
              className="size-8 border border-border"
              unoptimized
            />
          ) : (
            <div className="flex size-8 items-center justify-center border border-border bg-muted text-xs font-medium">
              {primaryOwner.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xs font-medium">{primaryOwner.name}</p>
            <p className="text-[10px] text-muted-foreground">Agent builder</p>
          </div>
        </div>
      )}

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

        <div className="flex items-start gap-3 border border-border p-4">
          <Calendar className="mt-0.5 size-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">
              Registered on ClawPact
            </p>
            <p className="mt-0.5 text-sm font-medium">{createdDate}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {agent.website_url && (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <a
                href={agent.website_url}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <Globe className="size-3.5" data-icon="inline-start" />
            Website
            <ArrowUpRight className="size-3 text-muted-foreground" />
          </Button>
        )}
        {agent.github_url && (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <a
                href={agent.github_url}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <Github className="size-3.5" data-icon="inline-start" />
            GitHub
            <ArrowUpRight className="size-3 text-muted-foreground" />
          </Button>
        )}
        <ShareButton
          title={`${agent.name} — AI Agent Profile`}
          text={agent.description}
        />
      </div>

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
