import { describe, it, expect, beforeEach } from "vitest";
import {
  createMockOwner,
  createMockAgent,
  createMockAgentWithOwner,
  createMockCreateAgentRequest,
  createMockUpdateAgentRequest,
  resetIdCounter,
} from "@/__tests__/helpers/factories";

describe("Test factories", () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe("createMockOwner", () => {
    it("should create an owner with default values", () => {
      const owner = createMockOwner();
      expect(owner.id).toBeDefined();
      expect(owner.email).toContain("@example.com");
      expect(owner.name).toContain("Test User");
    });

    it("should allow overriding fields", () => {
      const owner = createMockOwner({ name: "Custom Name", email: "custom@test.com" });
      expect(owner.name).toBe("Custom Name");
      expect(owner.email).toBe("custom@test.com");
    });
  });

  describe("createMockAgent", () => {
    it("should create an agent with default values", () => {
      const agent = createMockAgent();
      expect(agent.id).toBeDefined();
      expect(agent.slug).toContain("test-agent");
      expect(agent.skills).toEqual(["testing"]);
    });

    it("should allow overriding fields", () => {
      const agent = createMockAgent({ name: "Custom Agent", skills: ["a", "b"] });
      expect(agent.name).toBe("Custom Agent");
      expect(agent.skills).toEqual(["a", "b"]);
    });
  });

  describe("createMockAgentWithOwner", () => {
    it("should create an agent with embedded owner data", () => {
      const agentWithOwner = createMockAgentWithOwner();
      expect(agentWithOwner.owner).toBeDefined();
      expect(agentWithOwner.owner.name).toBe("Test Owner");
    });

    it("should allow overriding both agent and owner fields", () => {
      const agentWithOwner = createMockAgentWithOwner(
        { name: "Special Agent" },
        { name: "Special Owner" }
      );
      expect(agentWithOwner.name).toBe("Special Agent");
      expect(agentWithOwner.owner.name).toBe("Special Owner");
    });
  });

  describe("createMockCreateAgentRequest", () => {
    it("should create a valid request with defaults", () => {
      const req = createMockCreateAgentRequest();
      expect(req.name).toBe("New Agent");
      expect(req.description).toBe("A brand new agent");
      expect(req.skills).toEqual(["skill-a", "skill-b"]);
    });

    it("should allow overrides", () => {
      const req = createMockCreateAgentRequest({ name: "Overridden" });
      expect(req.name).toBe("Overridden");
    });
  });

  describe("createMockUpdateAgentRequest", () => {
    it("should create a request with only provided fields", () => {
      const req = createMockUpdateAgentRequest({ name: "Updated" });
      expect(req.name).toBe("Updated");
      expect(req).not.toHaveProperty("description");
    });

    it("should allow an empty update", () => {
      const req = createMockUpdateAgentRequest();
      expect(Object.keys(req)).toHaveLength(0);
    });
  });
});
