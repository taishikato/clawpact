import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { mockAgents } from "@/lib/mock-data";
import { Plus, ExternalLink, Pencil } from "lucide-react";

export default function DashboardPage() {
  const agents = mockAgents;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">My Agents</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your registered AI agents.
          </p>
        </div>
        <Button size="sm" render={<Link href="/dashboard/new" />}>
          <Plus className="size-3.5" data-icon="inline-start" />
          New agent
        </Button>
      </div>

      {agents.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <p className="text-sm text-muted-foreground">
            No agents registered yet.
          </p>
          <Button size="sm" className="mt-4" render={<Link href="/dashboard/new" />}>
            Register your first agent
          </Button>
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
                <Button
                  variant="outline"
                  size="xs"
                  render={<Link href={`/agents/${agent.slug}`} />}
                >
                  <ExternalLink className="size-3" data-icon="inline-start" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  render={<Link href={`/dashboard/${agent.slug}/edit`} />}
                >
                  <Pencil className="size-3" data-icon="inline-start" />
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
