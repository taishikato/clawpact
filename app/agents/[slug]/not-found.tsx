import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function AgentNotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-xl font-semibold tracking-tight">
        Agent not found
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This agent profile does not exist or has been removed.
      </p>
      <Link href="/" className={cn("mt-6", buttonVariants({ variant: "outline", size: "sm" }))}>
        <ArrowLeft className="size-3.5" data-icon="inline-start" />
        Back to home
      </Link>
    </main>
  );
}
