import { NextResponse } from "next/server";
import { checkAdminCode, adminToken, ADMIN_COOKIE, cookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  if (!process.env.ADMIN_CODE) {
    return NextResponse.json(
      { ok: false, error: "Admin šifra još nije podešena na serveru." },
      { status: 500 },
    );
  }

  let code = "";
  try {
    const body = await request.json();
    code = typeof body?.code === "string" ? body.code : "";
  } catch {
    code = "";
  }

  if (!checkAdminCode(code)) {
    return NextResponse.json({ ok: false, error: "Pogrešna admin šifra." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken()!, cookieOptions);
  return res;
}
