import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthError } from "@/lib/auth";

// Mock the Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("AuthError", () => {
  it("should be an instance of Error", () => {
    const err = new AuthError("test");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("AuthError");
    expect(err.message).toBe("test");
  });
});

describe("getUser", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should return user when authenticated", async () => {
    const mockUser = { id: "user-123", email: "test@test.com" };
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    } as any);

    const { getUser } = await import("@/lib/auth");
    const user = await getUser();
    expect(user).toEqual(mockUser);
  });

  it("should return null when not authenticated", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as any);

    const { getUser } = await import("@/lib/auth");
    const user = await getUser();
    expect(user).toBeNull();
  });
});

describe("requireAuth", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should return user when authenticated", async () => {
    const mockUser = { id: "user-123", email: "test@test.com" };
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    } as any);

    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();
    expect(user).toEqual(mockUser);
  });

  it("should throw AuthError when not authenticated", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as any);

    const { requireAuth } = await import("@/lib/auth");
    await expect(requireAuth()).rejects.toThrow("Authentication required");
  });
});
