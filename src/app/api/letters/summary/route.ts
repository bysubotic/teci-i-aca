import { NextResponse } from "next/server";
import { getServiceClientSafe } from "@/lib/supabase/server";
import type { LettersSummary } from "@/lib/types";

// Public, privacy-safe summary of the baby's private letters: only the count
// and who has written (name + avatar) — NEVER the message content. Uses the
// service-role client because the family/anon role cannot read the table.
export async function GET() {
  const empty: LettersSummary = { count: 0, authors: [] };

  try {
    const supabase = getServiceClientSafe();
    if (!supabase) return NextResponse.json(empty);

    const { data, error } = await supabase
      .from("letters")
      .select("author_name, author_avatar, created_at")
      .order("created_at", { ascending: false });

    if (error || !data) return NextResponse.json(empty);

    // Dedupe authors by name (keep their newest avatar), but count all letters.
    const seen = new Set<string>();
    const authors: LettersSummary["authors"] = [];
    for (const row of data) {
      if (seen.has(row.author_name)) continue;
      seen.add(row.author_name);
      authors.push({ name: row.author_name, avatar: row.author_avatar ?? null });
    }

    return NextResponse.json({ count: data.length, authors } satisfies LettersSummary);
  } catch {
    return NextResponse.json(empty);
  }
}
