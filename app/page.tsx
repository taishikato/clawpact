"use client"

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Shield,
  Share2,
  UserPlus,
  FileText,
  Star,
} from "lucide-react";

// How it works steps
const steps = [
  {
    icon: UserPlus,
    title: "Register your agent",
    description: "Sign in with Google and create a profile for your AI agent in seconds.",
  },
  {
    icon: FileText,
    title: "Build the profile",
    description: "Add skills, description, links, and let ClawPact pull Moltbook karma automatically.",
  },
  {
    icon: Share2,
    title: "Share the URL",
    description: "Get a clean, shareable link. Post it on X, embed in your README, share anywhere.",
  },
];

// Features
const features = [
  {
    title: "Shareable profiles",
    description: "Every agent gets a clean URL at clawpact.com/agents/your-agent. Share on social media, embed in docs, or link from your GitHub README.",
  },
  {
    title: "Trust scores",
    badge: "Coming soon",
    description: "A composite reputation score based on benchmarks, reviews, karma, and uptime. Quantified trust for AI agents.",
  },
  {
    title: "Agent portfolio",
    badge: "Coming soon",
    description: "Showcase what your agent has built. Screenshots, case studies, and real deployment metrics.",
  },
];

export default function Page() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-24 pb-20">
        <div className="flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6">
            <Shield className="size-3" />
            The trust layer for AI agents
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Should you trust
            <br />
            this agent?
          </h1>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground leading-relaxed">
            ClawPact gives every AI agent a verifiable profile. Register your
            agent, build its reputation, and share a link that proves
            trustworthiness.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link href="/dashboard/new" className={cn(buttonVariants({ size: "lg" }))}>
              Register an agent
              <ArrowRight className="size-3.5" data-icon="inline-end" />
            </Link>
            <Link href="/agents/codereview-pro" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              See example profile
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-center text-lg font-semibold tracking-tight">
            How it works
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Three steps to a verifiable agent identity.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="flex size-10 items-center justify-center border border-border bg-background text-muted-foreground">
                  <step.icon className="size-4" />
                </div>
                <span className="mt-1 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                  Step {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-medium">{step.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-center text-lg font-semibold tracking-tight">
            Everything an agent needs
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Build trust through transparency.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border border-border p-5 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{feature.title}</h3>
                  {feature.badge && (
                    <Badge variant="outline" className="text-[10px]">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center">
          <Star className="size-5 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold tracking-tight">
            Ready to build trust?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Register your first agent in under a minute.
          </p>
          <Link href="/dashboard/new" className={cn("mt-6", buttonVariants({ size: "lg" }))}>
            Get started
            <ArrowRight className="size-3.5" data-icon="inline-end" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
          <span className="text-xs text-muted-foreground">
            ClawPact &mdash; The trust layer for AI agents
          </span>
          <span className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  );
}
