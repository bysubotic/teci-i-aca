import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Cookie-based gating without real auth. We never store the raw passphrase in
// the cookie; we store an HMAC of a fixed label keyed by the secret code. An
// attacker can't forge the token without knowing the code, and we compare in
// constant time.

export const FAMILY_COOKIE = "fam_ok";
export const ADMIN_COOKIE = "admin_ok";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

function token(secret: string, label: string): string {
  return createHmac("sha256", secret).update(label).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function familyToken(): string | null {
  const code = process.env.FAMILY_CODE;
  if (!code) return null;
  return token(code, "family");
}

export function adminToken(): string | null {
  const code = process.env.ADMIN_CODE;
  if (!code) return null;
  return token(code, "admin");
}

export function checkFamilyCode(input: string): boolean {
  const code = process.env.FAMILY_CODE;
  if (!code) return false;
  return safeEqual(input, code);
}

export function checkAdminCode(input: string): boolean {
  const code = process.env.ADMIN_CODE;
  if (!code) return false;
  return safeEqual(input, code);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

export async function hasValidFamilyCookie(): Promise<boolean> {
  const expected = familyToken();
  if (!expected) return false;
  const store = await cookies();
  const value = store.get(FAMILY_COOKIE)?.value;
  return !!value && safeEqual(value, expected);
}

export async function hasValidAdminCookie(): Promise<boolean> {
  const expected = adminToken();
  if (!expected) return false;
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, expected);
}
