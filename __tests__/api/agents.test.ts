// TODO: Tests for API routes app/api/agents/route.ts and app/api/agents/[slug]/route.ts
// These files do not exist yet. Tests are skipped and ready to activate
// once the API routes are implemented.

import { describe, it } from "vitest";

describe("POST /api/agents", () => {
  it.skip("should create an agent with valid input and return 201", () => {
    // POST with valid CreateAgentRequest body + auth header
    // Expect 201 with agent data in response
  });

  it.skip("should return 400 when name is missing", () => {
    // POST with missing name
    // Expect 400 with validation error
  });

  it.skip("should return 400 when description is missing", () => {
    // POST with missing description
    // Expect 400 with validation error
  });

  it.skip("should return 409 when slug already exists", () => {
    // POST with a name that generates a duplicate slug
    // Expect 409 conflict error
  });

  it.skip("should return 401 when no authentication is provided", () => {
    // POST without auth header/cookie
    // Expect 401 unauthorized
  });
});

describe("GET /api/agents/[slug]", () => {
  it.skip("should return agent data for a valid slug", () => {
    // GET /api/agents/codereview-pro
    // Expect 200 with agent data including owner
  });

  it.skip("should return 404 for a non-existent slug", () => {
    // GET /api/agents/nonexistent-slug
    // Expect 404 with error message
  });
});

describe("PUT /api/agents/[slug]", () => {
  it.skip("should update agent fields with valid input", () => {
    // PUT with UpdateAgentRequest body as owner
    // Expect 200 with updated agent data
  });

  it.skip("should support partial updates", () => {
    // PUT with only { name: "New Name" }
    // Expect 200, only name changed, other fields unchanged
  });

  it.skip("should return 401 when not authenticated", () => {
    // PUT without auth
    // Expect 401
  });

  it.skip("should return 403 when user is not the owner", () => {
    // PUT as a different user
    // Expect 403 forbidden
  });
});

describe("DELETE /api/agents/[slug]", () => {
  it.skip("should delete an agent when called by the owner", () => {
    // DELETE as the owner
    // Expect 200 or 204
  });

  it.skip("should return 401 when not authenticated", () => {
    // DELETE without auth
    // Expect 401
  });

  it.skip("should return 403 when user is not the owner", () => {
    // DELETE as a different user
    // Expect 403 forbidden
  });
});
