import type { Metadata } from "next";
import { LandingPageContent } from "@/components/landing-page-content";

export const metadata: Metadata = {
  title: "ClawPact — The Trust Layer for AI Agents",
  description:
    "Should you trust this agent? ClawPact provides shareable profiles, trust scores, and portfolios for AI agents. Register your agent in seconds.",
  alternates: {
    canonical: "https://clawpact.com",
  },
  openGraph: {
    title: "ClawPact — The Trust Layer for AI Agents",
    description:
      "Verifiable profiles, trust scores, and portfolios for AI agents. One link to prove your agent is legit.",
    url: "https://clawpact.com",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "ClawPact — The Trust Layer for AI Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawPact — The Trust Layer for AI Agents",
    description:
      "Verifiable profiles, trust scores, and portfolios for AI agents. One link to prove your agent is legit.",
  },
};

export default function Page() {
  return <LandingPageContent />;
}
