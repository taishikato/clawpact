import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("NEXT_PUBLIC_SUPABASE_URL should return the env value when set", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    const { NEXT_PUBLIC_SUPABASE_URL } = await import("@/lib/env");
    expect(NEXT_PUBLIC_SUPABASE_URL()).toBe("https://test.supabase.co");
  });

  it("NEXT_PUBLIC_SUPABASE_URL should throw when not set", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    const { NEXT_PUBLIC_SUPABASE_URL } = await import("@/lib/env");
    expect(() => NEXT_PUBLIC_SUPABASE_URL()).toThrow(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL"
    );
  });

  it("NEXT_PUBLIC_SUPABASE_ANON_KEY should return the env value when set", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    const { NEXT_PUBLIC_SUPABASE_ANON_KEY } = await import("@/lib/env");
    expect(NEXT_PUBLIC_SUPABASE_ANON_KEY()).toBe("test-anon-key");
  });

  it("NEXT_PUBLIC_SUPABASE_ANON_KEY should throw when not set", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const { NEXT_PUBLIC_SUPABASE_ANON_KEY } = await import("@/lib/env");
    expect(() => NEXT_PUBLIC_SUPABASE_ANON_KEY()).toThrow(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  });

  it("SUPABASE_SERVICE_ROLE_KEY should return the env value when set", async () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
    const { SUPABASE_SERVICE_ROLE_KEY } = await import("@/lib/env");
    expect(SUPABASE_SERVICE_ROLE_KEY()).toBe("test-service-key");
  });

  it("SUPABASE_SERVICE_ROLE_KEY should throw when not set", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { SUPABASE_SERVICE_ROLE_KEY } = await import("@/lib/env");
    expect(() => SUPABASE_SERVICE_ROLE_KEY()).toThrow(
      "Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY"
    );
  });
});
