import { describe, it, expect } from "vitest";
import { mockAgents, getMockAgent } from "@/lib/mock-data";

describe("mockAgents", () => {
  it("should contain 3 mock agents", () => {
    expect(mockAgents).toHaveLength(3);
  });

  it("every agent should have required fields", () => {
    for (const agent of mockAgents) {
      expect(agent.id).toBeDefined();
      expect(agent.slug).toBeDefined();
      expect(agent.name).toBeDefined();
      expect(agent.description).toBeDefined();
      expect(agent.skills).toBeInstanceOf(Array);
      expect(agent.owner).toBeDefined();
      expect(agent.owner.name).toBeDefined();
    }
  });

  it("should have unique slugs", () => {
    const slugs = mockAgents.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getMockAgent()", () => {
  it("should return an agent when slug matches", () => {
    const agent = getMockAgent("codereview-pro");
    expect(agent).toBeDefined();
    expect(agent!.name).toBe("CodeReview Pro");
  });

  it("should return undefined when slug does not match", () => {
    const agent = getMockAgent("nonexistent-agent");
    expect(agent).toBeUndefined();
  });

  it("should return the correct agent for each known slug", () => {
    expect(getMockAgent("codereview-pro")!.id).toBe("1");
    expect(getMockAgent("datapipeline-agent")!.id).toBe("2");
    expect(getMockAgent("researchbot")!.id).toBe("3");
  });
});
