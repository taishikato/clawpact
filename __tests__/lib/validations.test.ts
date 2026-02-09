import { describe, it, expect } from "vitest";
import {
  createAgentSchema,
  updateAgentSchema,
  generateSlug,
} from "@/lib/validations";

describe("createAgentSchema", () => {
  it("should accept valid input with all fields", () => {
    const result = createAgentSchema.safeParse({
      name: "My Agent",
      description: "Does great things",
      skills: ["coding", "research"],
      website_url: "https://example.com",
      github_url: "https://github.com/example/agent",
    });
    expect(result.success).toBe(true);
  });

  it("should accept valid input with only required fields", () => {
    const result = createAgentSchema.safeParse({
      name: "My Agent",
      description: "Does great things",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing name", () => {
    const result = createAgentSchema.safeParse({
      description: "No name provided",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing description", () => {
    const result = createAgentSchema.safeParse({
      name: "Agent without description",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty name", () => {
    const result = createAgentSchema.safeParse({
      name: "",
      description: "desc",
    });
    expect(result.success).toBe(false);
  });

  it("should reject non-string skills", () => {
    const result = createAgentSchema.safeParse({
      name: "Agent",
      description: "desc",
      skills: [123],
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid website_url", () => {
    const result = createAgentSchema.safeParse({
      name: "Agent",
      description: "desc",
      website_url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid github_url", () => {
    const result = createAgentSchema.safeParse({
      name: "Agent",
      description: "desc",
      github_url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should reject name longer than 100 chars", () => {
    const result = createAgentSchema.safeParse({
      name: "a".repeat(101),
      description: "desc",
    });
    expect(result.success).toBe(false);
  });

  it("should reject description longer than 2000 chars", () => {
    const result = createAgentSchema.safeParse({
      name: "Agent",
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("should default skills to empty array when omitted", () => {
    const result = createAgentSchema.safeParse({
      name: "Agent",
      description: "desc",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.skills).toEqual([]);
    }
  });
});

describe("updateAgentSchema", () => {
  it("should accept partial updates", () => {
    const result = updateAgentSchema.safeParse({
      name: "Updated Name",
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty object", () => {
    const result = updateAgentSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should reject invalid field types", () => {
    const result = updateAgentSchema.safeParse({
      name: 123,
    });
    expect(result.success).toBe(false);
  });

  it("should accept moltbook_karma as integer", () => {
    const result = updateAgentSchema.safeParse({
      moltbook_karma: 42,
    });
    expect(result.success).toBe(true);
  });

  it("should reject negative moltbook_karma", () => {
    const result = updateAgentSchema.safeParse({
      moltbook_karma: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe("generateSlug", () => {
  it("should lowercase and hyphenate", () => {
    expect(generateSlug("My Cool Agent")).toBe("my-cool-agent");
  });

  it("should strip special characters", () => {
    expect(generateSlug("Agent@v2.0!")).toBe("agentv20");
  });

  it("should collapse multiple hyphens", () => {
    expect(generateSlug("agent---name")).toBe("agent-name");
  });

  it("should trim leading/trailing hyphens", () => {
    expect(generateSlug("-agent-")).toBe("agent");
  });

  it("should handle whitespace", () => {
    expect(generateSlug("  spaced  out  ")).toBe("spaced-out");
  });
});
