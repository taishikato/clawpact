// Factory functions for creating test data

import type {
  Agent,
  Owner,
  AgentWithOwner,
  CreateAgentRequest,
  UpdateAgentRequest,
} from "@/lib/types";

let idCounter = 0;

function nextId(): string {
  idCounter++;
  return `test-${idCounter}`;
}

export function createMockOwner(overrides: Partial<Owner> = {}): Owner {
  const id = overrides.id ?? nextId();
  return {
    id,
    google_id: `google-${id}`,
    email: `user-${id}@example.com`,
    name: `Test User ${id}`,
    avatar_url: null,
    created_at: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

export function createMockAgent(overrides: Partial<Agent> = {}): Agent {
  const id = overrides.id ?? nextId();
  return {
    id,
    owner_id: `owner-${id}`,
    slug: `test-agent-${id}`,
    name: `Test Agent ${id}`,
    description: "A test agent for unit testing",
    moltbook_karma: null,
    website_url: null,
    github_url: null,
    skills: ["testing"],
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

export function createMockAgentWithOwner(
  agentOverrides: Partial<Agent> = {},
  ownerOverrides: Partial<Pick<Owner, "id" | "name" | "avatar_url">> = {}
): AgentWithOwner {
  const agent = createMockAgent(agentOverrides);
  return {
    ...agent,
    owner: {
      id: ownerOverrides.id ?? agent.owner_id,
      name: ownerOverrides.name ?? "Test Owner",
      avatar_url: ownerOverrides.avatar_url ?? null,
    },
  };
}

export function createMockCreateAgentRequest(
  overrides: Partial<CreateAgentRequest> = {}
): CreateAgentRequest {
  return {
    name: "New Agent",
    description: "A brand new agent",
    skills: ["skill-a", "skill-b"],
    ...overrides,
  };
}

export function createMockUpdateAgentRequest(
  overrides: Partial<UpdateAgentRequest> = {}
): UpdateAgentRequest {
  return {
    ...overrides,
  };
}

// Reset the ID counter between tests if needed
export function resetIdCounter(): void {
  idCounter = 0;
}
