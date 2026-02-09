import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your registered AI agents on ClawPact.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-5xl gap-0 px-4 py-8">
      <DashboardSidebar />
      <Separator orientation="vertical" className="mx-6 hidden md:block" />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
