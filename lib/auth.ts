// Auth utility helpers for server-side usage

import { createClient } from "@/lib/supabase/server";
import type { User, Session } from "@supabase/supabase-js";

export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Returns the authenticated user or throws (for protected routes)
export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) {
    throw new AuthError("Authentication required");
  }
  return user;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
