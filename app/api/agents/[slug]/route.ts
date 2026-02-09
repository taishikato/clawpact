// GET /api/agents/[slug]    - Get agent profile (public)
// PUT /api/agents/[slug]    - Update agent (auth, owner only)
// DELETE /api/agents/[slug] - Delete agent (auth, owner only)

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { updateAgentSchema } from "@/lib/validations";
import type { AgentWithOwner, Agent, ApiResponse, ApiError } from "@/lib/types";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<AgentWithOwner> | ApiError>> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: agent, error } = await supabase
    .from("agents")
    .select("*, owner:owners(id, name, avatar_url)")
    .eq("slug", slug)
    .single();

  if (error || !agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({ data: agent as AgentWithOwner });
}

export async function PUT(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Agent> | ApiError>> {
  try {
    const user = await requireAuth();
    const { slug } = await params;
    const body = await request.json();

    const parsed = updateAgentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify agent exists and the user owns it
    const { data: existing } = await supabase
      .from("agents")
      .select("id, owner_id")
      .eq("slug", slug)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (existing.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build the update payload with only provided fields
    const updateData: Record<string, unknown> = {};
    const fields = parsed.data;
    if (fields.name !== undefined) updateData.name = fields.name;
    if (fields.description !== undefined)
      updateData.description = fields.description;
    if (fields.skills !== undefined) updateData.skills = fields.skills;
    if (fields.website_url !== undefined)
      updateData.website_url = fields.website_url ?? null;
    if (fields.github_url !== undefined)
      updateData.github_url = fields.github_url ?? null;
    if (fields.moltbook_karma !== undefined)
      updateData.moltbook_karma = fields.moltbook_karma ?? null;

    const { data: agent, error } = await supabase
      .from("agents")
      .update(updateData)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: agent as Agent });
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

export async function DELETE(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse<{ success: true } | ApiError>> {
  try {
    const user = await requireAuth();
    const { slug } = await params;
    const supabase = await createClient();

    // Verify agent exists and the user owns it
    const { data: existing } = await supabase
      .from("agents")
      .select("id, owner_id")
      .eq("slug", slug)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (existing.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
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
