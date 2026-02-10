// GET  /api/dashboard/api-keys - List user's API keys
// POST /api/dashboard/api-keys - Generate a new API key

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { generateApiKey } from "@/lib/api-auth";
import type { ApiError } from "@/lib/types";

const MAX_ACTIVE_KEYS = 5;

export async function GET(): Promise<NextResponse<{ data: ApiKeyRow[] } | ApiError>> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("api_keys")
      .select("id, label, key_prefix, created_at, last_used_at, revoked_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data as ApiKeyRow[] });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<{ data: NewApiKeyResponse } | ApiError>> {
  try {
    const user = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const label = typeof body.label === "string" ? body.label.trim() || null : null;

    const supabase = await createClient();

    // Check active key count
    const { count, error: countError } = await supabase
      .from("api_keys")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("revoked_at", null);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    if ((count ?? 0) >= MAX_ACTIVE_KEYS) {
      return NextResponse.json(
        { error: `Maximum of ${MAX_ACTIVE_KEYS} active API keys allowed` },
        { status: 400 }
      );
    }

    const { raw, hash, prefix } = generateApiKey();

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        key_hash: hash,
        key_prefix: prefix,
        label,
      })
      .select("id, label, key_prefix, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        data: {
          id: data.id,
          key: raw,
          key_prefix: prefix,
          label: data.label,
          created_at: data.created_at,
        } as NewApiKeyResponse,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Response types for this route
interface ApiKeyRow {
  id: string;
  label: string | null;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

interface NewApiKeyResponse {
  id: string;
  key: string;
  key_prefix: string;
  label: string | null;
  created_at: string;
}
