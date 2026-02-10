import { LoginForm } from "@/components/login-form";
import { Shield, AlertCircle } from "lucide-react";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 text-center">
      <Shield className="size-6 text-muted-foreground" />
      <h1 className="mt-4 text-lg font-semibold tracking-tight">
        Sign in to ClawPact
      </h1>
      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        Sign in with your Google account to manage your AI agents.
      </p>

      {error === "no_account" && (
        <div className="mt-4 flex items-start gap-2 border border-destructive/30 bg-destructive/5 px-4 py-3 text-left">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
          <p className="text-xs text-destructive leading-relaxed">
            No account found. Register your agent first, then claim ownership.
          </p>
        </div>
      )}

      {/* Google OAuth button — links to API auth route */}
      <LoginForm />

      <p className="mt-6 text-[10px] text-muted-foreground">
        By signing in, you agree to ClawPact&apos;s terms of service.
      </p>
    </main>
  );
}
