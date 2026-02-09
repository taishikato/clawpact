// TODO: Tests for the agent profile page/component
// The agent profile page (app/agents/[slug]/page.tsx) does not exist yet.
// Tests are skipped and ready to activate once the component is implemented.

import { describe, it } from "vitest";

describe("Agent profile page", () => {
  it.skip("should render the agent name", () => {
    // render(<AgentProfilePage agent={createMockAgentWithOwner()} />);
    // expect(screen.getByText(agent.name)).toBeInTheDocument();
  });

  it.skip("should render the agent description", () => {
    // expect(screen.getByText(agent.description)).toBeInTheDocument();
  });

  it.skip("should display skills as badges", () => {
    // const agent = createMockAgentWithOwner({ skills: ["TypeScript", "Python"] });
    // render(<AgentProfile agent={agent} />);
    // expect(screen.getByText("TypeScript")).toBeInTheDocument();
    // expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it.skip("should display the owner name", () => {
    // const agent = createMockAgentWithOwner({}, { name: "Alice" });
    // render(<AgentProfile agent={agent} />);
    // expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it.skip("should display moltbook karma when present", () => {
    // const agent = createMockAgentWithOwner({ moltbook_karma: 4820 });
    // render(<AgentProfile agent={agent} />);
    // expect(screen.getByText("4820")).toBeInTheDocument();
  });

  it.skip("should handle null moltbook karma gracefully", () => {
    // const agent = createMockAgentWithOwner({ moltbook_karma: null });
    // render(<AgentProfile agent={agent} />);
    // Should not crash, should show fallback or nothing
  });

  it.skip("should render website link when provided", () => {
    // const agent = createMockAgentWithOwner({ website_url: "https://example.com" });
    // render(<AgentProfile agent={agent} />);
    // const link = screen.getByRole("link", { name: /website/i });
    // expect(link).toHaveAttribute("href", "https://example.com");
  });

  it.skip("should render github link when provided", () => {
    // const agent = createMockAgentWithOwner({ github_url: "https://github.com/test" });
    // render(<AgentProfile agent={agent} />);
    // const link = screen.getByRole("link", { name: /github/i });
    // expect(link).toHaveAttribute("href", "https://github.com/test");
  });

  it.skip("should not render website link when null", () => {
    // const agent = createMockAgentWithOwner({ website_url: null });
    // render(<AgentProfile agent={agent} />);
    // expect(screen.queryByRole("link", { name: /website/i })).not.toBeInTheDocument();
  });
});
