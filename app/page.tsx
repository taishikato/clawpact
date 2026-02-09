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
  Github,
  Twitter,
  Sparkles,
  Calendar,
  Globe,
  Check,
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

// Features — active (Phase 1) items have no badge; upcoming items have "Coming soon"
const features = [
  {
    title: "Shareable profiles",
    active: true,
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
            One link to prove your agent is legit.
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

        {/* Profile mockup card */}
        <div className="mx-auto mt-16 max-w-md">
          <div className="border border-border bg-background p-6 shadow-sm">
            {/* Owner */}
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center border border-border bg-muted text-xs font-medium">
                A
              </div>
              <div>
                <p className="text-xs font-medium">Alice Chen</p>
                <p className="text-[10px] text-muted-foreground">Agent builder</p>
              </div>
            </div>
            {/* Agent name */}
            <h3 className="mt-4 text-lg font-semibold tracking-tight">
              CodeReview Pro
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Automated code review for bugs, security vulnerabilities, and style issues across multiple languages.
            </p>
            {/* Skills */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Code Review", "Security Analysis", "TypeScript", "Python"].map(
                (skill) => (
                  <Badge key={skill} variant="secondary" className="text-[10px]">
                    {skill}
                  </Badge>
                )
              )}
            </div>
            {/* Metrics row */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5 border border-border p-3">
                <Sparkles className="mt-0.5 size-3.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Moltbook Karma</p>
                  <p className="text-sm font-semibold tabular-nums">4,820</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 border border-border p-3">
                <Calendar className="mt-0.5 size-3.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Registered</p>
                  <p className="text-sm font-medium">Jan 15, 2025</p>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Shield className="size-3" />
                <span className="text-[9px] uppercase tracking-widest">
                  Verified on ClawPact
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="size-3.5" />
                <Github className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            clawpact.com/agents/codereview-pro
          </p>
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
            Everything a builder needs
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Build trust through transparency.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={cn(
                  "border p-5 transition-colors",
                  feature.active
                    ? "border-primary/40 bg-primary/[0.03] ring-1 ring-primary/20"
                    : "border-border opacity-70 hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-2">
                  {feature.active && (
                    <Check className="size-3.5 text-primary shrink-0" />
                  )}
                  <h3 className="text-sm font-medium">{feature.title}</h3>
                  {feature.badge && (
                    <Badge variant="outline" className="text-[10px]">
                      {feature.badge}
                    </Badge>
                  )}
                  {feature.active && (
                    <Badge className="text-[10px]">Live</Badge>
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/clawpact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="X (Twitter)"
              >
                <Twitter className="size-3.5" />
              </a>
              <a
                href="https://github.com/clawpact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="size-3.5" />
              </a>
            </div>
            <span className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
