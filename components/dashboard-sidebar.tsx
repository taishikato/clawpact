"use client"

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Plus } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "My Agents", icon: LayoutDashboard },
  { href: "/dashboard/new", label: "Register Agent", icon: Plus },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden w-48 shrink-0 md:block">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Dashboard
      </p>
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("justify-start", buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <item.icon className="size-3.5" data-icon="inline-start" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
