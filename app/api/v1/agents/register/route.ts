// POST /api/v1/agents/register - Agent self-registration (no auth required)

import { NextResponse } from "next/server";
import {
  generateApiKey,
  generateClaimToken,
  supabaseAdmin,
} from "@/lib/api-auth";
import { registerAgentSchema } from "@/lib/validations";
import type { RegisterAgentResponse } from "@/lib/types";

export async function POST(
  request: Request
): Promise<NextResponse<{ data: RegisterAgentResponse } | { error: string }>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = registerAgentSchema.safeParse(body);
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

  const apiKey = generateApiKey();
  const claimToken = generateClaimToken();

  const { error } = await supabaseAdmin.from("agents").insert({
    owner_ids: [],
    slug,
    name,
    description,
    skills,
    status: "unclaimed",
    claim_token: claimToken,
    api_key_hash: apiKey.hash,
    api_key_prefix: apiKey.prefix,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawpact.com";

  return NextResponse.json(
    {
      data: {
        api_key: apiKey.raw,
        claim_url: `${baseUrl}/claim/${claimToken}`,
        profile_url: `${baseUrl}/agents/${slug}`,
        slug,
      },
    },
    { status: 201 }
  );
}
