// Google OAuth callback handler
// Exchanges the auth code for a session, upserts the owner record,
// then redirects to the dashboard.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  // Upsert the owner record from the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("owners").upsert(
      {
        id: user.id,
        google_id: user.user_metadata.provider_id ?? user.id,
        email: user.email ?? "",
        name: user.user_metadata.full_name ?? user.email ?? "",
        avatar_url: user.user_metadata.avatar_url ?? null,
      },
      { onConflict: "id" }
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
