"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { encodeAvatar } from "@/lib/avatar";
import type { Identity } from "@/lib/identity";
import type { Wish } from "@/lib/types";

export function useWishes(identity: Identity) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    try {
      const { data } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false });
      setWishes((data ?? []) as Wish[]);
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleRefetch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void fetchAll(), 250);
  }, [fetchAll]);

  useEffect(() => {
    void fetchAll();
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("wishes-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "wishes" }, scheduleRefetch)
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      void supabase.removeChannel(channel);
    };
  }, [fetchAll, scheduleRefetch]);

  const add = useCallback(
    async (message: string, unlockDate: string | null) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("wishes").insert({
        author_name: identity.name,
        author_avatar: encodeAvatar(identity.avatar),
        message: message.trim(),
        unlock_date: unlockDate,
      });
      if (error) throw error;
      await fetchAll();
    },
    [fetchAll, identity.name, identity.avatar],
  );

  return { wishes, loading, add, refresh: fetchAll };
}
