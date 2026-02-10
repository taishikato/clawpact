// PATCH /api/dashboard/api-keys/[id] - Revoke an API key

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, AuthError } from "@/lib/auth";
import type { ApiError } from "@/lib/types";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse<{ data: RevokedKeyResponse } | ApiError>> {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const supabase = await createClient();

    // Verify the key belongs to the current user
    const { data: existing } = await supabase
      .from("api_keys")
      .select("id, revoked_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    if (existing.revoked_at) {
      return NextResponse.json(
        { error: "API key is already revoked" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, label, key_prefix, created_at, last_used_at, revoked_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data as RevokedKeyResponse });
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

interface RevokedKeyResponse {
  id: string;
  label: string | null;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string;
}
