// Runtime environment variable validation

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Public env vars (available in browser)
export const NEXT_PUBLIC_SUPABASE_URL = (): string =>
  requireEnv("NEXT_PUBLIC_SUPABASE_URL");

export const NEXT_PUBLIC_SUPABASE_ANON_KEY = (): string =>
  requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

// Server-only env vars
export const SUPABASE_SERVICE_ROLE_KEY = (): string =>
  requireEnv("SUPABASE_SERVICE_ROLE_KEY");
