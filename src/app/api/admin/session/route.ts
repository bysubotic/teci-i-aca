import { NextResponse } from "next/server";
import { hasValidAdminCookie, ADMIN_COOKIE, cookieOptions } from "@/lib/auth";

// Lets the /admin page check on mount whether the parents are already signed in.
export async function GET() {
  return NextResponse.json({ ok: await hasValidAdminCookie() });
}

// Log out (clear the admin cookie).
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
