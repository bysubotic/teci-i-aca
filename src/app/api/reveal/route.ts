import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type { RevealResult } from "@/lib/types";

const TOP_N = 5;

function normalize(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

const EMPTY: RevealResult = {
  revealed: false,
  crownedNameIds: [],
  overlapCount: 0,
  topConsidered: TOP_N,
};

// Public endpoint, but it only returns anything meaningful once
// config.reveal_shortlist is true — that's what keeps the surprise. Any failure
// (e.g. service key not configured) fails soft to "not revealed" so the names
// tab keeps working without crowns rather than erroring.
export async function GET() {
  try {
    return await computeReveal();
  } catch (err) {
    console.error("[/api/reveal]", err);
    return NextResponse.json(EMPTY);
  }
}

async function computeReveal() {
  const supabase = getSupabaseServiceClient();

  const { data: config } = await supabase
    .from("config")
    .select("reveal_shortlist")
    .eq("id", 1)
    .single();

  if (!config?.reveal_shortlist) {
    return NextResponse.json(EMPTY);
  }

  const [{ data: shortlist }, { data: names }, { data: likes }] = await Promise.all([
    supabase.from("parents_shortlist").select("name"),
    supabase.from("name_suggestions").select("id, name"),
    supabase.from("name_likes").select("name_id"),
  ]);

  const shortlistSet = new Set((shortlist ?? []).map((s) => normalize(s.name)));

  // Crown every suggestion whose name matches a parents' pick.
  const crownedNameIds = (names ?? [])
    .filter((n) => shortlistSet.has(normalize(n.name)))
    .map((n) => n.id);

  // Family's top N by like count.
  const counts = new Map<string, number>();
  for (const like of likes ?? []) {
    counts.set(like.name_id, (counts.get(like.name_id) ?? 0) + 1);
  }
  const topNames = (names ?? [])
    .map((n) => ({ name: n.name, count: counts.get(n.id) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "sr"))
    .slice(0, TOP_N);

  const overlapCount = topNames.filter((n) => shortlistSet.has(normalize(n.name))).length;

  const result: RevealResult = {
    revealed: true,
    crownedNameIds,
    overlapCount,
    topConsidered: TOP_N,
  };
  return NextResponse.json(result);
}
