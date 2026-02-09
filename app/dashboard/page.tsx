import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import type { Agent } from "@/lib/types";
import { Plus, ExternalLink, Pencil } from "lucide-react";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("agents")
    .select("*")
    .contains("owner_ids", [user.id])
    .order("created_at", { ascending: false });

  const agents: Agent[] = data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">My Agents</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your registered AI agents.
          </p>
        </div>
        <Link href="/dashboard/new" className={cn(buttonVariants({ size: "sm" }))}>
          <Plus className="size-3.5" data-icon="inline-start" />
          New agent
        </Link>
      </div>

      {agents.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <p className="text-sm text-muted-foreground">
            No agents registered yet.
          </p>
          <Link href="/dashboard/new" className={cn("mt-4", buttonVariants({ size: "sm" }))}>
            Register your first agent
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
                <CardDescription className="truncate">
                  clawpact.com/agents/{agent.slug}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {agent.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {agent.skills.length > 3 && (
                    <Badge variant="outline">
                      +{agent.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Link
                  href={`/agents/${agent.slug}`}
                  className={cn(buttonVariants({ variant: "outline", size: "xs" }))}
                >
                  <ExternalLink className="size-3" data-icon="inline-start" />
                  View
                </Link>
                <Link
                  href={`/dashboard/${agent.slug}/edit`}
                  className={cn(buttonVariants({ variant: "ghost", size: "xs" }))}
                >
                  <Pencil className="size-3" data-icon="inline-start" />
                  Edit
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
