// Tests for POST /api/v1/agents/register

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock modules before importing the route handler
vi.mock("@/lib/api-auth", () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
  generateApiKey: vi.fn(),
  generateClaimToken: vi.fn(),
}));

import { POST } from "@/app/api/v1/agents/register/route";
import { supabaseAdmin, generateApiKey, generateClaimToken } from "@/lib/api-auth";

function createRequest(body: unknown): Request {
  return new Request("http://localhost/api/v1/agents/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function createInvalidJsonRequest(): Request {
  return new Request("http://localhost/api/v1/agents/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not valid json{",
  });
}

const validBody = {
  name: "Test Agent",
  slug: "test-agent",
  description: "A test agent for testing",
  skills: ["testing"],
};

describe("POST /api/v1/agents/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SITE_URL = "https://clawpact.com";

    vi.mocked(generateApiKey).mockReturnValue({
      raw: "cp_testapikey123",
      hash: "hash123",
      prefix: "cp_testapikey...",
    });
    vi.mocked(generateClaimToken).mockReturnValue("clp_testtoken456");
  });

  it("should return 201 with api_key, claim_url, profile_url, and slug on success", async () => {
    // Mock slug uniqueness check (no existing agent)
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });
    // Mock insert
    const insertMock = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(supabaseAdmin.from).mockImplementation((table: string) => {
      if (table === "agents") {
        return { select: selectMock, insert: insertMock } as never;
      }
      return {} as never;
    });

    const res = await POST(createRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data).toEqual({
      api_key: "cp_testapikey123",
      claim_url: "https://clawpact.com/claim/clp_testtoken456",
      profile_url: "https://clawpact.com/agents/test-agent",
      slug: "test-agent",
    });
  });

  it("should call supabaseAdmin.insert with correct data", async () => {
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });
    const insertMock = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(supabaseAdmin.from).mockImplementation((table: string) => {
      if (table === "agents") {
        return { select: selectMock, insert: insertMock } as never;
      }
      return {} as never;
    });

    await POST(createRequest(validBody));

    expect(insertMock).toHaveBeenCalledWith({
      owner_ids: [],
      slug: "test-agent",
      name: "Test Agent",
      description: "A test agent for testing",
      skills: ["testing"],
      status: "unclaimed",
      claim_token: "clp_testtoken456",
      api_key_hash: "hash123",
      api_key_prefix: "cp_testapikey...",
    });
  });

  it("should return 400 when name is missing", async () => {
    const { name, ...bodyWithoutName } = validBody;
    const res = await POST(createRequest(bodyWithoutName));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 400 when slug is missing", async () => {
    const { slug, ...bodyWithoutSlug } = validBody;
    const res = await POST(createRequest(bodyWithoutSlug));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 400 when slug format is invalid", async () => {
    const res = await POST(createRequest({ ...validBody, slug: "INVALID SLUG!" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Slug must");
  });

  it("should return 400 when slug is too short", async () => {
    const res = await POST(createRequest({ ...validBody, slug: "ab" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 400 when description is missing", async () => {
    const { description, ...bodyWithoutDesc } = validBody;
    const res = await POST(createRequest(bodyWithoutDesc));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 400 when skills is empty", async () => {
    const res = await POST(createRequest({ ...validBody, skills: [] }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("At least one skill");
  });

  it("should return 400 for invalid JSON body", async () => {
    const res = await POST(createInvalidJsonRequest());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid JSON body");
  });

  it("should return 409 when slug is already taken", async () => {
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id: "existing-id" }, error: null }),
      }),
    });

    vi.mocked(supabaseAdmin.from).mockImplementation((table: string) => {
      if (table === "agents") {
        return { select: selectMock } as never;
      }
      return {} as never;
    });

    const res = await POST(createRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.error).toContain("already taken");
  });

  it("should return 500 when database insert fails", async () => {
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });
    const insertMock = vi.fn().mockResolvedValue({
      error: { message: "DB error" },
    });

    vi.mocked(supabaseAdmin.from).mockImplementation((table: string) => {
      if (table === "agents") {
        return { select: selectMock, insert: insertMock } as never;
      }
      return {} as never;
    });

    const res = await POST(createRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("DB error");
  });
});
