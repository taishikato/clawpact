"use client"

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/login/actions";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {pending && <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />}
      Log out
    </Button>
  );
}

export function Nav() {
  const supabase = createClient()
  const [user, setUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      setUser(!!user)
    }

    fetchUser()
  }, [supabase.auth])

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <div className="mr-auto flex items-center gap-x-3">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span>
              🛡️
            </span>
            ClawPact
            <span>🦞</span>
          </Link>
          <ThemeToggle />
        </div>
        <nav className="flex items-center gap-3">
          {user && <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Dashboard
          </Link>}
          {!user && <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
            Sign in
          </Link>}
          {user && (
            <form action={signOut}>
              <LogoutButton />
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
