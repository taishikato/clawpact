// Tests for GET/PATCH/DELETE /api/v1/agents/me

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockAgent } from "../helpers/factories";

// Mock modules before importing the route handler
vi.mock("@/lib/api-auth", () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
  authenticateAgentApiKey: vi.fn(),
  sanitizeAgent: vi.fn((agent) => {
    const { api_key_hash, api_key_prefix, claim_token, ...safe } = agent;
    return safe;
  }),
}));

import { GET, PATCH, DELETE } from "@/app/api/v1/agents/me/route";
import { supabaseAdmin, authenticateAgentApiKey } from "@/lib/api-auth";

const mockAgent = createMockAgent({
  id: "agent-1",
  slug: "test-agent",
  name: "Test Agent",
  description: "A test agent",
  skills: ["testing"],
  status: "claimed",
  api_key_hash: "hash",
  api_key_prefix: "cp_...",
  claim_token: null,
});

function createGetRequest(apiKey?: string): Request {
  const headers: Record<string, string> = {};
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  return new Request("http://localhost/api/v1/agents/me", {
    method: "GET",
    headers,
  });
}

function createPatchRequest(body: unknown, apiKey?: string): Request {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  return new Request("http://localhost/api/v1/agents/me", {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
}

function createDeleteRequest(apiKey?: string): Request {
  const headers: Record<string, string> = {};
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  return new Request("http://localhost/api/v1/agents/me", {
    method: "DELETE",
    headers,
  });
}

function createInvalidJsonPatchRequest(apiKey: string): Request {
  return new Request("http://localhost/api/v1/agents/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: "not json{",
  });
}

describe("GET /api/v1/agents/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 with sanitized agent data for valid API key", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue({
      agentId: "agent-1",
      slug: "test-agent",
    });

    vi.mocked(supabaseAdmin.from).mockImplementation(() => {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockAgent,
              error: null,
            }),
          }),
        }),
      } as never;
    });

    const res = await GET(createGetRequest("cp_validapikey"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toBeDefined();
    expect(json.data.id).toBe("agent-1");
    expect(json.data.name).toBe("Test Agent");
    // Sensitive fields should be stripped
    expect(json.data.api_key_hash).toBeUndefined();
    expect(json.data.api_key_prefix).toBeUndefined();
    expect(json.data.claim_token).toBeUndefined();
  });

  it("should return 401 when no API key is provided", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue(null);

    const res = await GET(createGetRequest());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("should return 401 for an invalid API key", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue(null);

    const res = await GET(createGetRequest("cp_invalidkey"));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("should return 404 when agent is not found in database", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue({
      agentId: "agent-deleted",
      slug: "deleted-agent",
    });

    vi.mocked(supabaseAdmin.from).mockImplementation(() => {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "not found" },
            }),
          }),
        }),
      } as never;
    });

    const res = await GET(createGetRequest("cp_validkey"));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Agent not found");
  });
});

describe("PATCH /api/v1/agents/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 with updated agent data", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue({
      agentId: "agent-1",
      slug: "test-agent",
    });

    const updatedAgent = { ...mockAgent, name: "Updated Agent" };

    vi.mocked(supabaseAdmin.from).mockImplementation(() => {
      return {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: updatedAgent,
                error: null,
              }),
            }),
          }),
        }),
      } as never;
    });

    const res = await PATCH(
      createPatchRequest({ name: "Updated Agent" }, "cp_validapikey")
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.name).toBe("Updated Agent");
    expect(json.data.api_key_hash).toBeUndefined();
  });

  it("should return 401 when no API key is provided", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue(null);

    const res = await PATCH(createPatchRequest({ name: "New Name" }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("should return 400 for invalid JSON body", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue({
      agentId: "agent-1",
      slug: "test-agent",
    });

    const res = await PATCH(createInvalidJsonPatchRequest("cp_validapikey"));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid JSON body");
  });

  it("should return 400 for invalid update data", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue({
      agentId: "agent-1",
      slug: "test-agent",
    });

    // Name cannot be empty string
    const res = await PATCH(
      createPatchRequest({ name: "" }, "cp_validapikey")
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 500 when database update fails", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue({
      agentId: "agent-1",
      slug: "test-agent",
    });

    vi.mocked(supabaseAdmin.from).mockImplementation(() => {
      return {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "update failed" },
              }),
            }),
          }),
        }),
      } as never;
    });

    const res = await PATCH(
      createPatchRequest({ name: "New Name" }, "cp_validapikey")
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to update agent");
  });
});

describe("DELETE /api/v1/agents/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 with { deleted: true } on success", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue({
      agentId: "agent-1",
      slug: "test-agent",
    });

    vi.mocked(supabaseAdmin.from).mockImplementation(() => {
      return {
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      } as never;
    });

    const res = await DELETE(createDeleteRequest("cp_validapikey"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual({ deleted: true });
  });

  it("should return 401 when no API key is provided", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue(null);

    const res = await DELETE(createDeleteRequest());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("should return 500 when database delete fails", async () => {
    vi.mocked(authenticateAgentApiKey).mockResolvedValue({
      agentId: "agent-1",
      slug: "test-agent",
    });

    vi.mocked(supabaseAdmin.from).mockImplementation(() => {
      return {
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: "delete failed" },
          }),
        }),
      } as never;
    });

    const res = await DELETE(createDeleteRequest("cp_validapikey"));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("delete failed");
  });
});
