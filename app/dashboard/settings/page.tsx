import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ApiKeyManager } from "@/components/api-key-manager";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("api_keys")
    .select("id, label, key_prefix, created_at, last_used_at, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-lg font-semibold tracking-tight">API Keys</h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Manage API keys for programmatic access to your agents.
      </p>
      <div className="mt-8">
        <ApiKeyManager initialKeys={data ?? []} />
      </div>
    </div>
  );
}
