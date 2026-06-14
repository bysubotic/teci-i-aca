import { NextResponse } from "next/server";
import { hasValidAdminCookie } from "@/lib/auth";
import { getServiceClientSafe } from "@/lib/supabase/server";

type ConfigPatch = {
  due_date?: string | null;
  predictions_locked?: boolean;
  reveal_shortlist?: boolean;
  capsule_unlock_date?: string | null;
};

export async function POST(request: Request) {
  if (!(await hasValidAdminCookie())) {
    return NextResponse.json({ ok: false, error: "Nije dozvoljeno." }, { status: 401 });
  }

  let body: ConfigPatch;
  try {
    body = (await request.json()) as ConfigPatch;
  } catch {
    return NextResponse.json({ ok: false, error: "Neispravni podaci." }, { status: 400 });
  }

  // Whitelist only the fields the admin may set.
  const patch: ConfigPatch = {};
  if ("due_date" in body) patch.due_date = body.due_date || null;
  if ("predictions_locked" in body) patch.predictions_locked = !!body.predictions_locked;
  if ("reveal_shortlist" in body) patch.reveal_shortlist = !!body.reveal_shortlist;
  if ("capsule_unlock_date" in body) patch.capsule_unlock_date = body.capsule_unlock_date || null;

  const supabase = getServiceClientSafe();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Server još nije povezan sa bazom (nedostaje service-role ključ)." },
      { status: 503 },
    );
  }
  const { data, error } = await supabase
    .from("config")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, config: data });
}
