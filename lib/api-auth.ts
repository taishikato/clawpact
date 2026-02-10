// API key authentication for v1 API routes

import { createClient } from "@supabase/supabase-js";
import { createHash, randomBytes } from "crypto";

export interface AuthenticatedUser {
  userId: string;
  apiKeyId: string;
}

// Service-role client that bypasses RLS (for API key lookups)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export { supabaseAdmin };

/**
 * Authenticate a request via Bearer token (API key).
 * Returns the authenticated user or null if invalid.
 */
export async function authenticateApiKey(
  authHeader: string | null
): Promise<AuthenticatedUser | null> {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const rawKey = authHeader.slice(7);
  if (!rawKey) {
    return null;
  }

  const keyHash = createHash("sha256").update(rawKey).digest("hex");

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, user_id, revoked_at")
    .eq("key_hash", keyHash)
    .single();

  if (error || !data || data.revoked_at !== null) {
    return null;
  }

  // Update last_used_at asynchronously (fire-and-forget)
  supabaseAdmin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id)
    .then(() => {});

  return { userId: data.user_id, apiKeyId: data.id };
}

/**
 * Generate a new API key with cp_ prefix.
 * Returns the raw key (shown once), its hash (stored), and a prefix (for display).
 */
export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const raw = "cp_" + randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(raw).digest("hex");
  const prefix = raw.slice(0, 12) + "...";

  return { raw, hash, prefix };
}
