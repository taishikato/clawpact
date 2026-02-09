import { Separator } from "@/components/ui/separator";

export default function AgentProfileLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      {/* Owner skeleton */}
      <div className="flex items-center gap-3">
        <div className="size-8 animate-pulse bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 animate-pulse bg-muted" />
          <div className="h-2.5 w-16 animate-pulse bg-muted" />
        </div>
      </div>

      {/* Title skeleton */}
      <div className="mt-6 h-7 w-48 animate-pulse bg-muted" />
      <div className="mt-3 space-y-2">
        <div className="h-3.5 w-full animate-pulse bg-muted" />
        <div className="h-3.5 w-4/5 animate-pulse bg-muted" />
      </div>

      {/* Skills skeleton */}
      <div className="mt-6 flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-16 animate-pulse bg-muted" />
        ))}
      </div>

      <Separator className="my-8" />

      {/* Metadata skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-20 animate-pulse border border-border bg-muted/50" />
        <div className="h-20 animate-pulse border border-border bg-muted/50" />
      </div>
    </main>
  );
}
