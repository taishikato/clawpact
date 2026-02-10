// POST /api/v1/agents/claim - Claim an unclaimed agent (session auth)

import { NextResponse } from "next/server";
import { sanitizeAgent, supabaseAdmin } from "@/lib/api-auth";
import { claimAgentSchema } from "@/lib/validations";
import { getUser } from "@/lib/auth";
import type { Agent } from "@/lib/types";

export async function POST(
  request: Request
): Promise<NextResponse<{ data: Omit<Agent, "api_key_hash" | "api_key_prefix" | "claim_token"> } | { error: string }>> {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = claimAgentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { claim_token } = parsed.data;

  // Look up agent by claim token
  const { data: agent, error: findError } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("claim_token", claim_token)
    .eq("status", "unclaimed")
    .single<Agent>();

  if (findError || !agent) {
    return NextResponse.json(
      { error: "Invalid or already claimed token" },
      { status: 404 }
    );
  }

  // Claim the agent
  const { data: updated, error: updateError } = await supabaseAdmin
    .from("agents")
    .update({
      owner_ids: [user.id],
      status: "claimed",
      claim_token: null,
    })
    .eq("id", agent.id)
    .select()
    .single<Agent>();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: "Failed to claim agent" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: sanitizeAgent(updated) });
}
