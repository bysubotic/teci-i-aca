import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Accept both the new "publishable" key name and the legacy "anon" key name.
function publicKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// True when real Supabase credentials are present. In preview (no backend) the
// data hooks short-circuit to empty states instead of hanging on doomed fetches.
export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!publicKey();
}

// Browser/anon client. The anon key is public by design (it ships to the
// client). Access is governed by the permissive RLS policies in
// supabase/schema.sql — this is a private, passphrase-gated family app.
let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let anonKey = publicKey();

  if (!url || !anonKey) {
    // In production a missing config is a hard error. In dev we fall back to a
    // harmless dummy endpoint so the whole UI is still browsable (queries just
    // return errors -> empty states) without a configured Supabase project.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Nedostaju Supabase env varijable (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).",
      );
    }
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY nisu podešeni — pregled radi bez baze (prazna stanja).",
    );
    url = "http://127.0.0.1:54321";
    anonKey = "preview-no-backend";
  }

  browserClient = createClient(url, anonKey, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 5 } },
  });
  return browserClient;
}
