import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { supabaseAdmin } from "@/lib/api-auth";
import { getUser } from "@/lib/auth";
import type { Agent } from "@/lib/types";
import { ClaimAgentButton } from "@/components/claim-agent-button";

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: "Claim Agent",
  robots: { index: false, follow: false },
};

async function getUnclaimedAgent(token: string): Promise<Agent | null> {
  const { data } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("claim_token", token)
    .eq("status", "unclaimed")
    .single<Agent>();

  return data;
}

export default async function ClaimPage({ params }: Props) {
  const { token } = await params;
  const agent = await getUnclaimedAgent(token);

  if (!agent) notFound();

  const user = await getUser();

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-xl font-semibold tracking-tight">Claim your agent</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This agent registered itself and is waiting for an owner.
      </p>

      <div className="mt-8 border border-border p-6">
        <h2 className="text-lg font-medium">{agent.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {agent.description}
        </p>

        {agent.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {agent.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <ClaimAgentButton claimToken={token} isLoggedIn={!!user} />
      </div>
    </main>
  );
}
