import { NextResponse } from "next/server";
import { hasValidAdminCookie } from "@/lib/auth";
import { getServiceClientSafe } from "@/lib/supabase/server";

// Manage the parents' secret shortlist. Only reachable with a valid admin
// cookie, and it uses the service-role client (the table is closed to anon).

function noDb() {
  return NextResponse.json(
    { ok: false, error: "Server još nije povezan sa bazom (nedostaje service-role ključ)." },
    { status: 503 },
  );
}

export async function GET() {
  if (!(await hasValidAdminCookie())) {
    return NextResponse.json({ ok: false, error: "Nije dozvoljeno." }, { status: 401 });
  }
  const supabase = getServiceClientSafe();
  if (!supabase) return noDb();
  const { data, error } = await supabase
    .from("parents_shortlist")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, shortlist: data });
}

export async function POST(request: Request) {
  if (!(await hasValidAdminCookie())) {
    return NextResponse.json({ ok: false, error: "Nije dozvoljeno." }, { status: 401 });
  }

  let name = "";
  try {
    const body = await request.json();
    name = typeof body?.name === "string" ? body.name.trim() : "";
  } catch {
    name = "";
  }
  if (!name) {
    return NextResponse.json({ ok: false, error: "Unesi ime." }, { status: 400 });
  }

  const supabase = getServiceClientSafe();
  if (!supabase) return noDb();
  const { data, error } = await supabase
    .from("parents_shortlist")
    .insert({ name })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, entry: data });
}

export async function DELETE(request: Request) {
  if (!(await hasValidAdminCookie())) {
    return NextResponse.json({ ok: false, error: "Nije dozvoljeno." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Nedostaje id." }, { status: 400 });
  }

  const supabase = getServiceClientSafe();
  if (!supabase) return noDb();
  const { error } = await supabase.from("parents_shortlist").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
