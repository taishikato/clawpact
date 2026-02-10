import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  return NextResponse.redirect(`${requestUrl.origin}${safeRedirect}`);
}
