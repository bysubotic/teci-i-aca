import { NextResponse } from "next/server";
import { checkFamilyCode, familyToken, FAMILY_COOKIE, cookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  if (!process.env.FAMILY_CODE) {
    return NextResponse.json(
      { ok: false, error: "Šifra još nije podešena na serveru." },
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

  if (!checkFamilyCode(code)) {
    return NextResponse.json({ ok: false, error: "Pogrešna šifra." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(FAMILY_COOKIE, familyToken()!, cookieOptions);
  return res;
}
