// POST /api/v1/agents - Register a new agent (API key auth)

import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { authenticateApiKey, supabaseAdmin } from "@/lib/api-auth";
import type { Agent } from "@/lib/types";

const createAgentV1Schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be 50 characters or less")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Slug must start and end with a letter or number, and contain only lowercase letters, numbers, and hyphens"
    ),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  skills: z
    .array(
      z.string().min(1, "Skill must not be empty").max(50, "Skill must be 50 characters or less")
    )
    .min(1, "At least one skill is required")
    .max(20, "Maximum 20 skills allowed"),
});

export async function POST(
  request: Request
): Promise<NextResponse<{ data: Agent & { profile_url: string } } | { error: string }>> {
  const user = await authenticateApiKey(request.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createAgentV1Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, slug, description, skills } = parsed.data;

  // Check slug uniqueness
  const { data: existing } = await supabaseAdmin
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

  const { data: agent, error } = await supabaseAdmin
    .from("agents")
    .insert({
      owner_ids: [user.userId],
      slug,
      name,
      description,
      skills,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      data: {
        ...(agent as Agent),
        profile_url: `https://clawpact.com/agents/${slug}`,
      },
    },
    { status: 201 }
  );
}
