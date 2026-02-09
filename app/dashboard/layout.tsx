import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Plus, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "My Agents", icon: LayoutDashboard },
  { href: "/dashboard/new", label: "Register Agent", icon: Plus },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-5xl gap-0 px-4 py-8">
      {/* Sidebar */}
      <aside className="hidden w-48 shrink-0 md:block">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Dashboard
        </p>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              className="justify-start"
              render={<Link href={item.href} />}
            >
              <item.icon className="size-3.5" data-icon="inline-start" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      <Separator orientation="vertical" className="mx-6 hidden md:block" />

      {/* Main content */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
