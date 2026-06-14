"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { encodeAvatar } from "@/lib/avatar";
import type { Identity } from "@/lib/identity";
import type { NameSuggestion, NameWithLikes, RevealResult } from "@/lib/types";

interface LikeRow {
  name_id: string;
  voter_id: string;
}

const EMPTY_REVEAL: RevealResult = {
  revealed: false,
  crownedNameIds: [],
  overlapCount: 0,
  topConsidered: 5,
};

export function useNames(identity: Identity) {
  const [names, setNames] = useState<NameWithLikes[]>([]);
  const [reveal, setReveal] = useState<RevealResult>(EMPTY_REVEAL);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    try {
    const [namesRes, likesRes, revealRes] = await Promise.all([
      supabase.from("name_suggestions").select("*").order("created_at", { ascending: true }),
      supabase.from("name_likes").select("name_id, voter_id"),
      fetch("/api/reveal")
        .then((r) => r.json() as Promise<RevealResult>)
        .catch(() => EMPTY_REVEAL),
    ]);

    const suggestions = (namesRes.data ?? []) as NameSuggestion[];
    const likes = (likesRes.data ?? []) as LikeRow[];
    const revealData = revealRes ?? EMPTY_REVEAL;

    const counts = new Map<string, number>();
    const mine = new Set<string>();
    for (const like of likes) {
      counts.set(like.name_id, (counts.get(like.name_id) ?? 0) + 1);
      if (like.voter_id === identity.id) mine.add(like.name_id);
    }
    const crowned = new Set(revealData.crownedNameIds);

    const merged: NameWithLikes[] = suggestions
      .map((s) => ({
        ...s,
        likeCount: counts.get(s.id) ?? 0,
        likedByMe: mine.has(s.id),
        crowned: crowned.has(s.id),
      }))
      .sort(
        (a, b) =>
          b.likeCount - a.likeCount ||
          a.created_at.localeCompare(b.created_at),
      );

    setNames(merged);
    setReveal(revealData);
    } finally {
      setLoading(false);
    }
  }, [identity.id]);

  // Debounced refetch so a burst of realtime events collapses into one fetch.
  const scheduleRefetch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void fetchAll(), 250);
  }, [fetchAll]);

  useEffect(() => {
    void fetchAll();
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("names-leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "name_likes" }, scheduleRefetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "name_suggestions" }, scheduleRefetch)
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      void supabase.removeChannel(channel);
    };
  }, [fetchAll, scheduleRefetch]);

  const addName = useCallback(
    async (name: string, note: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("name_suggestions").insert({
        name: name.trim(),
        note: note.trim() || null,
        suggested_by: identity.name,
        suggested_by_avatar: encodeAvatar(identity.avatar),
      });
      if (error) throw error;
      await fetchAll();
    },
    [fetchAll, identity.name, identity.avatar],
  );

  const toggleLike = useCallback(
    async (nameId: string, currentlyLiked: boolean) => {
      const supabase = getSupabaseBrowserClient();

      // Optimistic update.
      setNames((prev) =>
        prev.map((n) =>
          n.id === nameId
            ? { ...n, likedByMe: !currentlyLiked, likeCount: n.likeCount + (currentlyLiked ? -1 : 1) }
            : n,
        ),
      );

      if (currentlyLiked) {
        const { error } = await supabase
          .from("name_likes")
          .delete()
          .eq("name_id", nameId)
          .eq("voter_id", identity.id);
        if (error) await fetchAll(); // reconcile on failure
      } else {
        const { error } = await supabase.from("name_likes").insert({
          name_id: nameId,
          voter_id: identity.id,
          voter_name: identity.name,
          voter_avatar: encodeAvatar(identity.avatar),
        });
        if (error) await fetchAll();
      }
    },
    [fetchAll, identity.id, identity.name, identity.avatar],
  );

  return { names, reveal, loading, addName, toggleLike, refresh: fetchAll };
}
