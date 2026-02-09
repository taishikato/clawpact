// POST /api/agents - Register a new agent (requires auth)

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { createAgentSchema, generateSlug } from "@/lib/validations";
import type { Agent, ApiResponse, ApiError } from "@/lib/types";

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<Agent> | ApiError>> {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const parsed = createAgentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, description, skills, website_url, github_url } = parsed.data;
    const slug = generateSlug(name);

    if (!slug) {
      return NextResponse.json(
        { error: "Name must contain at least one alphanumeric character" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("agents")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `Slug "${slug}" is already taken` },
        { status: 409 }
      );
    }

    const { data: agent, error } = await supabase
      .from("agents")
      .insert({
        owner_ids: [user.id],
        slug,
        name,
        description,
        skills: skills ?? [],
        website_url: website_url ?? null,
        github_url: github_url ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: agent as Agent }, { status: 201 });
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
