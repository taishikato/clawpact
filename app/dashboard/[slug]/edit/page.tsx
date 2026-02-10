import { redirect, notFound } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { EditAgentForm } from "@/components/edit-agent-form";
import type { Agent } from "@/lib/types";

type PageProps = { params: Promise<{ slug: string }> };

export default async function EditAgentPage({ params }: PageProps) {
  const user = await getUser();
  if (!user) redirect("/login");

  const { slug } = await params;
  const supabase = await createClient();

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!agent) notFound();

  const typedAgent = agent as Agent;

  // Only owners can edit
  if (!typedAgent.owner_ids.includes(user.id)) notFound();

  return (
    <div>
      <h1 className="text-lg font-semibold tracking-tight">Edit agent</h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Update your agent&apos;s public profile.
      </p>
      <EditAgentForm agent={typedAgent} />
    </div>
  );
}
