import { describe, it, expect, beforeEach } from "vitest";
import {
  createMockUser,
  createMockAgent,
  createMockAgentWithOwners,
  createMockCreateAgentRequest,
  createMockUpdateAgentRequest,
  resetIdCounter,
} from "@/__tests__/helpers/factories";

describe("Test factories", () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe("createMockUser", () => {
    it("should create a user with default values", () => {
      const user = createMockUser();
      expect(user.id).toBeDefined();
      expect(user.email).toContain("@example.com");
      expect(user.name).toContain("Test User");
    });

    it("should allow overriding fields", () => {
      const user = createMockUser({ name: "Custom Name", email: "custom@test.com" });
      expect(user.name).toBe("Custom Name");
      expect(user.email).toBe("custom@test.com");
    });
  });

  describe("createMockAgent", () => {
    it("should create an agent with default values", () => {
      const agent = createMockAgent();
      expect(agent.id).toBeDefined();
      expect(agent.slug).toContain("test-agent");
      expect(agent.skills).toEqual(["testing"]);
      expect(agent.owner_ids).toHaveLength(1);
    });

    it("should allow overriding fields", () => {
      const agent = createMockAgent({ name: "Custom Agent", skills: ["a", "b"] });
      expect(agent.name).toBe("Custom Agent");
      expect(agent.skills).toEqual(["a", "b"]);
    });
  });

  describe("createMockAgentWithOwners", () => {
    it("should create an agent with embedded owner data", () => {
      const agentWithOwners = createMockAgentWithOwners();
      expect(agentWithOwners.owners).toBeDefined();
      expect(agentWithOwners.owners[0].name).toBe("Test Owner");
    });

    it("should allow overriding both agent and owner fields", () => {
      const agentWithOwners = createMockAgentWithOwners(
        { name: "Special Agent" },
        { name: "Special Owner" }
      );
      expect(agentWithOwners.name).toBe("Special Agent");
      expect(agentWithOwners.owners[0].name).toBe("Special Owner");
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
