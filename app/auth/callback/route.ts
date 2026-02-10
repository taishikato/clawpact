import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/api-auth";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.redirect(`${requestUrl.origin}/login`);

  // Support redirect after OAuth for claim flow (validate to prevent open redirect)
  const redirectPath = requestUrl.searchParams.get("redirect");
  const safeRedirect = redirectPath?.startsWith("/claim/")
    ? redirectPath
    : "/dashboard";

  // Check if user has a public.users record (gatekeeper)
  const { data: publicUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (publicUser) {
    // Existing user — normal flow
    return NextResponse.redirect(`${requestUrl.origin}${safeRedirect}`);
  }

  if (redirectPath?.startsWith("/claim/")) {
    // New user via claim flow — create public.users record from auth metadata
    await supabaseAdmin.from("users").insert({
      id: user.id,
      email: user.email ?? "",
      name:
        user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
      avatar_url: user.user_metadata?.avatar_url ?? null,
    });
    return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
  }

  // New user attempting direct login — no account, reject
  await supabase.auth.signOut();
  return NextResponse.redirect(
    `${requestUrl.origin}/login?error=no_account`
  );
}
