import { NextResponse } from "next/server";
import { hasValidAdminCookie } from "@/lib/auth";
import { getServiceClientSafe } from "@/lib/supabase/server";

type ActualPatch = {
  birth_date?: string | null;
  weight_grams?: number | null;
  length_cm?: number | null;
  hair_color?: string | null;
  eye_color?: string | null;
  temperament?: string | null;
  resembles?: string | null;
  birth_time?: string | null;
};

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function strOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

export async function POST(request: Request) {
  if (!(await hasValidAdminCookie())) {
    return NextResponse.json({ ok: false, error: "Nije dozvoljeno." }, { status: 401 });
  }

  let body: ActualPatch;
  try {
    body = (await request.json()) as ActualPatch;
  } catch {
    return NextResponse.json({ ok: false, error: "Neispravni podaci." }, { status: 400 });
  }

  const patch = {
    birth_date: strOrNull(body.birth_date),
    weight_grams: numOrNull(body.weight_grams),
    length_cm: numOrNull(body.length_cm),
    hair_color: strOrNull(body.hair_color),
    eye_color: strOrNull(body.eye_color),
    temperament: strOrNull(body.temperament),
    resembles: strOrNull(body.resembles),
    birth_time: strOrNull(body.birth_time),
  };

  const supabase = getServiceClientSafe();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Server još nije povezan sa bazom (nedostaje service-role ključ)." },
      { status: 503 },
    );
  }
  const { data, error } = await supabase
    .from("baby_actual")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, babyActual: data });
}
