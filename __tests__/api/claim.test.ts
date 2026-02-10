// Tests for POST /api/v1/agents/claim

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockAgent } from "../helpers/factories";

// Mock modules before importing the route handler
vi.mock("@/lib/api-auth", () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
  sanitizeAgent: vi.fn((agent) => {
    const { api_key_hash, api_key_prefix, claim_token, ...safe } = agent;
    return safe;
  }),
}));

vi.mock("@/lib/auth", () => ({
  getUser: vi.fn(),
}));

import { POST } from "@/app/api/v1/agents/claim/route";
import { supabaseAdmin } from "@/lib/api-auth";
import { getUser } from "@/lib/auth";

function createRequest(body: unknown): Request {
  return new Request("http://localhost/api/v1/agents/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function createInvalidJsonRequest(): Request {
  return new Request("http://localhost/api/v1/agents/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not json{",
  });
}

const mockUser = { id: "user-123", email: "test@example.com" };

const unclaimedAgent = createMockAgent({
  id: "agent-1",
  owner_ids: [],
  status: "unclaimed",
  claim_token: "clp_validtoken",
  api_key_hash: "hash",
  api_key_prefix: "cp_...",
});

const claimedAgent = createMockAgent({
  id: "agent-1",
  owner_ids: [mockUser.id],
  status: "claimed",
  claim_token: null,
  api_key_hash: "hash",
  api_key_prefix: "cp_...",
});

describe("POST /api/v1/agents/claim", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 with sanitized agent data on successful claim", async () => {
    vi.mocked(getUser).mockResolvedValue(mockUser as never);

    // Mock finding the unclaimed agent
    const selectEqStatusSingle = vi.fn().mockResolvedValue({
      data: unclaimedAgent,
      error: null,
    });

    // Mock updating the agent
    const updateSelectSingle = vi.fn().mockResolvedValue({
      data: claimedAgent,
      error: null,
    });

    let callCount = 0;
    vi.mocked(supabaseAdmin.from).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // First call: select for finding agent by claim_token
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: selectEqStatusSingle,
              }),
            }),
          }),
        } as never;
      }
      // Second call: update for claiming
      return {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: updateSelectSingle,
            }),
          }),
        }),
      } as never;
    });

    const res = await POST(createRequest({ claim_token: "clp_validtoken" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toBeDefined();
    // Sanitized: no api_key_hash, api_key_prefix, claim_token
    expect(json.data.api_key_hash).toBeUndefined();
    expect(json.data.api_key_prefix).toBeUndefined();
    expect(json.data.claim_token).toBeUndefined();
    expect(json.data.status).toBe("claimed");
  });

  it("should return 401 when user is not logged in", async () => {
    vi.mocked(getUser).mockResolvedValue(null);

    const res = await POST(createRequest({ claim_token: "clp_anytoken" }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("should return 400 for invalid JSON body", async () => {
    vi.mocked(getUser).mockResolvedValue(mockUser as never);

    const res = await POST(createInvalidJsonRequest());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid JSON body");
  });

  it("should return 400 when claim_token is missing", async () => {
    vi.mocked(getUser).mockResolvedValue(mockUser as never);

    const res = await POST(createRequest({}));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 400 when claim_token is empty", async () => {
    vi.mocked(getUser).mockResolvedValue(mockUser as never);

    const res = await POST(createRequest({ claim_token: "" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 404 when claim token is invalid", async () => {
    vi.mocked(getUser).mockResolvedValue(mockUser as never);

    vi.mocked(supabaseAdmin.from).mockImplementation(() => {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "not found" },
              }),
            }),
          }),
        }),
      } as never;
    });

    const res = await POST(createRequest({ claim_token: "clp_invalidtoken" }));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Invalid or already claimed token");
  });

  it("should return 500 when update fails", async () => {
    vi.mocked(getUser).mockResolvedValue(mockUser as never);

    let callCount = 0;
    vi.mocked(supabaseAdmin.from).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: unclaimedAgent,
                  error: null,
                }),
              }),
            }),
          }),
        } as never;
      }
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

    const res = await POST(createRequest({ claim_token: "clp_validtoken" }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to claim agent");
  });
});
