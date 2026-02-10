// GET/PATCH/DELETE /api/v1/agents/me - Agent self-management (agent API key auth)

import { NextResponse } from "next/server";
import {
  authenticateAgentApiKey,
  sanitizeAgent,
  supabaseAdmin,
} from "@/lib/api-auth";
import { updateAgentSchema } from "@/lib/validations";
import type { Agent } from "@/lib/types";

export async function GET(
  request: Request
): Promise<NextResponse<{ data: Omit<Agent, "api_key_hash" | "api_key_prefix" | "claim_token"> } | { error: string }>> {
  const agent = await authenticateAgentApiKey(
    request.headers.get("authorization")
  );
  if (!agent) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("id", agent.agentId)
    .single<Agent>();

  if (error || !data) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({ data: sanitizeAgent(data) });
}

export async function PATCH(
  request: Request
): Promise<NextResponse<{ data: Omit<Agent, "api_key_hash" | "api_key_prefix" | "claim_token"> } | { error: string }>> {
  const agent = await authenticateAgentApiKey(
    request.headers.get("authorization")
  );
  if (!agent) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateAgentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("agents")
    .update(parsed.data)
    .eq("id", agent.agentId)
    .select()
    .single<Agent>();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }

  return NextResponse.json({ data: sanitizeAgent(data) });
}

export async function DELETE(
  request: Request
): Promise<NextResponse<{ data: { deleted: true } } | { error: string }>> {
  const agent = await authenticateAgentApiKey(
    request.headers.get("authorization")
  );
  if (!agent) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("agents")
    .delete()
    .eq("id", agent.agentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { deleted: true } });
}
