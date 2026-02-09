"use client"

import Link from "next/link";
import { Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Shield className="size-4" />
          ClawPact
        </Link>
        <nav className="flex items-center gap-2">
          {user && <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Dashboard
          </Link>}
          {!user && <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
            Sign in
          </Link>}
          {user && <Link href="/login" className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>
            Log out
          </Link>}
        </nav>
      </div>
    </header>
  );
}
