"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Config } from "@/lib/types";

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.from("config").select("*").eq("id", 1).single();
    if (data) setConfig(data as Config);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    if (!isSupabaseConfigured()) return;

    // Live updates so a parent flipping a switch in /admin is reflected for
    // everyone (lock, reveal, capsule) without a manual refresh.
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("config-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "config" }, (payload) => {
        if (payload.new) setConfig(payload.new as Config);
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { config, loading, refresh, setConfig };
}
