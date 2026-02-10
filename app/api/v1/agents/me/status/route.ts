// GET /api/v1/agents/me/status - Check agent claim status (agent API key auth)

import { NextResponse } from "next/server";
import { authenticateAgentApiKey, supabaseAdmin } from "@/lib/api-auth";

export async function GET(
  request: Request
): Promise<
  NextResponse<{ data: { status: "unclaimed" | "claimed" } } | { error: string }>
> {
  const agent = await authenticateAgentApiKey(
    request.headers.get("authorization")
  );
  if (!agent) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("agents")
    .select("status")
    .eq("id", agent.agentId)
    .single<{ status: "unclaimed" | "claimed" }>();

  if (error || !data) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({ data: { status: data.status } });
}
