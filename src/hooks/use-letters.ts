"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { encodeAvatar } from "@/lib/avatar";
import type { Identity } from "@/lib/identity";
import type { LettersSummary } from "@/lib/types";

// Family side: can WRITE a private letter, and read only the public summary
// (count + authors). The content is never fetched here — only parents can read it.
export function useLetters(identity: Identity) {
  const [summary, setSummary] = useState<LettersSummary>({ count: 0, authors: [] });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/letters/summary");
      setSummary((await res.json()) as LettersSummary);
    } catch {
      // keep previous
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (message: string) => {
      if (!isSupabaseConfigured()) throw new Error("no-backend");
      const supabase = getSupabaseBrowserClient();
      // No .select() — anon may insert but not read back (RLS keeps content private).
      const { error } = await supabase.from("letters").insert({
        author_name: identity.name,
        author_avatar: encodeAvatar(identity.avatar),
        message: message.trim(),
      });
      if (error) throw error;
      await refresh();
    },
    [identity.name, identity.avatar, refresh],
  );

  return { summary, loading, add, refresh };
}
