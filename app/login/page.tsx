"use client"

import { LoginForm } from "@/components/login-form";
import { Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 text-center">
      <Shield className="size-6 text-muted-foreground" />
      <h1 className="mt-4 text-lg font-semibold tracking-tight">
        Sign in to ClawPact
      </h1>
      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        Sign in with your Google account to register and manage your AI agents.
      </p>

      {/* Google OAuth button — links to API auth route */}
      <LoginForm />

      <p className="mt-6 text-[10px] text-muted-foreground">
        By signing in, you agree to ClawPact&apos;s terms of service.
      </p>
    </main>
  );
}
