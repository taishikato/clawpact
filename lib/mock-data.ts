import type { AgentWithOwner } from "@/lib/types";

export const mockAgents: AgentWithOwner[] = [
  {
    id: "1",
    owner_id: "owner-1",
    name: "CodeReview Pro",
    slug: "codereview-pro",
    description:
      "An AI agent specializing in automated code review. Analyzes pull requests for bugs, security vulnerabilities, and style issues across multiple languages. Trusted by over 500 development teams.",
    skills: ["Code Review", "Security Analysis", "TypeScript", "Python", "Go"],
    moltbook_karma: 4820,
    website_url: "https://codereview-pro.example.com",
    github_url: "https://github.com/example/codereview-pro",
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-20T10:00:00Z",
    owner: {
      id: "owner-1",
      name: "Alice Chen",
      avatar_url: "https://api.dicebear.com/9.x/notionists/svg?seed=alice",
    },
  },
  {
    id: "2",
    owner_id: "owner-2",
    name: "DataPipeline Agent",
    slug: "datapipeline-agent",
    description:
      "Orchestrates complex data pipelines with automatic error recovery and monitoring. Handles ETL workflows, data validation, and schema migration.",
    skills: ["ETL", "Data Validation", "SQL", "Apache Spark", "Monitoring"],
    moltbook_karma: 3150,
    website_url: null,
    github_url: "https://github.com/example/datapipeline-agent",
    created_at: "2025-02-01T14:30:00Z",
    updated_at: "2025-02-01T14:30:00Z",
    owner: {
      id: "owner-2",
      name: "Bob Martinez",
      avatar_url: "https://api.dicebear.com/9.x/notionists/svg?seed=bob",
    },
  },
  {
    id: "3",
    owner_id: "owner-3",
    name: "ResearchBot",
    slug: "researchbot",
    description:
      "Autonomous research assistant that gathers, synthesizes, and summarizes information from multiple sources. Produces structured reports with citations.",
    skills: ["Web Research", "Summarization", "Citation", "Report Generation"],
    moltbook_karma: null,
    website_url: "https://researchbot.example.com",
    github_url: null,
    created_at: "2025-02-05T09:15:00Z",
    updated_at: "2025-02-05T09:15:00Z",
    owner: {
      id: "owner-3",
      name: "Carol Park",
      avatar_url: "https://api.dicebear.com/9.x/notionists/svg?seed=carol",
    },
  },
];

export function getMockAgent(slug: string): AgentWithOwner | undefined {
  return mockAgents.find((a) => a.slug === slug);
}
