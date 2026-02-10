// GET /api/v1/agents/[slug]    - Get agent (API key auth, owner only)
// PATCH /api/v1/agents/[slug]  - Update agent (API key auth, owner only)
// DELETE /api/v1/agents/[slug] - Delete agent (API key auth, owner only)

import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { authenticateApiKey, supabaseAdmin } from "@/lib/api-auth";
import type { Agent } from "@/lib/types";

type RouteParams = { params: Promise<{ slug: string }> };

const updateAgentV1Schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less")
    .optional(),
  skills: z
    .array(
      z.string().min(1, "Skill must not be empty").max(50, "Skill must be 50 characters or less")
    )
    .min(1, "At least one skill is required")
    .max(20, "Maximum 20 skills allowed")
    .optional(),
});

export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<{ data: Agent & { profile_url: string } } | { error: string }>> {
  const user = await authenticateApiKey(request.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const { data: agent, error } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .contains("owner_ids", [user.userId])
    .single();

  if (error || !agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      ...(agent as Agent),
      profile_url: `https://clawpact.com/agents/${slug}`,
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<{ data: Agent & { profile_url: string } } | { error: string }>> {
  const user = await authenticateApiKey(request.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateAgentV1Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  // Verify ownership
  const { data: existing } = await supabaseAdmin
    .from("agents")
    .select("id, owner_ids")
    .eq("slug", slug)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  if (!existing.owner_ids.includes(user.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Build update payload with only provided fields
  const updateData: Record<string, unknown> = {};
  const fields = parsed.data;
  if (fields.name !== undefined) updateData.name = fields.name;
  if (fields.description !== undefined) updateData.description = fields.description;
  if (fields.skills !== undefined) updateData.skills = fields.skills;

  const { data: agent, error } = await supabaseAdmin
    .from("agents")
    .update(updateData)
    .eq("id", existing.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: {
      ...(agent as Agent),
      profile_url: `https://clawpact.com/agents/${slug}`,
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<null | { error: string }>> {
  const user = await authenticateApiKey(request.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  // Verify ownership
  const { data: existing } = await supabaseAdmin
    .from("agents")
    .select("id, owner_ids")
    .eq("slug", slug)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  if (!existing.owner_ids.includes(user.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabaseAdmin
    .from("agents")
    .delete()
    .eq("id", existing.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
