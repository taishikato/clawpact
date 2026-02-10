"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { googleLogin } from "@/app/login/actions";

interface ClaimAgentButtonProps {
  claimToken: string;
  isLoggedIn: boolean;
}

export function ClaimAgentButton({
  claimToken,
  isLoggedIn,
}: ClaimAgentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/agents/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_token: claimToken }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to claim agent");
        return;
      }

      router.push(`/agents/${json.data.slug}`);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <form action={googleLogin}>
        <input type="hidden" name="redirectTo" value={`/claim/${claimToken}`} />
        <Button type="submit" className="w-full">
          Sign in with Google to claim
        </Button>
      </form>
    );
  }

  return (
    <div>
      <Button onClick={handleClaim} disabled={loading} className="w-full">
        {loading ? "Claiming..." : "Claim this agent"}
      </Button>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
