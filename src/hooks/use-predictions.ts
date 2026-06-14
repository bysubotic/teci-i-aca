"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { encodeAvatar } from "@/lib/avatar";
import type { Identity } from "@/lib/identity";
import type { BabyActual, Prediction } from "@/lib/types";

export type PredictionInput = Omit<
  Prediction,
  "visitor_id" | "predictor_name" | "predictor_avatar" | "created_at" | "updated_at"
>;

export function usePredictions(identity: Identity) {
  const [all, setAll] = useState<Prediction[]>([]);
  const [babyActual, setBabyActual] = useState<BabyActual | null>(null);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    try {
      const [predsRes, actualRes] = await Promise.all([
        supabase.from("predictions").select("*").order("created_at", { ascending: true }),
        supabase.from("baby_actual").select("*").eq("id", 1).single(),
      ]);
      setAll((predsRes.data ?? []) as Prediction[]);
      if (actualRes.data) setBabyActual(actualRes.data as BabyActual);
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
      .channel("predictions-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "predictions" }, scheduleRefetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "baby_actual" }, scheduleRefetch)
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      void supabase.removeChannel(channel);
    };
  }, [fetchAll, scheduleRefetch]);

  const save = useCallback(
    async (input: PredictionInput) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("predictions").upsert(
        {
          visitor_id: identity.id,
          predictor_name: identity.name,
          predictor_avatar: encodeAvatar(identity.avatar),
          ...input,
        },
        { onConflict: "visitor_id" },
      );
      if (error) throw error;
      await fetchAll();
    },
    [fetchAll, identity.id, identity.name, identity.avatar],
  );

  const mine = all.find((p) => p.visitor_id === identity.id) ?? null;

  return { all, mine, babyActual, loading, save, refresh: fetchAll };
}
