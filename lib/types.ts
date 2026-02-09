// Core domain types for ClawPact

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Agent {
  id: string;
  owner_ids: string[];
  slug: string;
  name: string;
  description: string;
  moltbook_karma: number | null;
  website_url: string | null;
  github_url: string | null;
  skills: string[];
  created_at: string;
  updated_at: string;
}

// Agent with resolved owner data (used for public profile display)
export interface AgentWithOwners extends Agent {
  owners: Pick<User, "id" | "name" | "avatar_url">[];
}

// API request types
export interface CreateAgentRequest {
  name: string;
  description: string;
  skills?: string[];
  website_url?: string | null;
  github_url?: string | null;
}

export interface UpdateAgentRequest {
  name?: string;
  description?: string;
  skills?: string[];
  website_url?: string | null;
  github_url?: string | null;
  moltbook_karma?: number | null;
}

// API response envelope types
export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
}
