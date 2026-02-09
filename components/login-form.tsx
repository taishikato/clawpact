"use client";

import { googleLogin } from "@/app/login/actions";
import { GoogleButton } from "./google-button";

export function LoginForm({
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <form action={googleLogin}>
      <GoogleButton />
    </form>
  );
}
