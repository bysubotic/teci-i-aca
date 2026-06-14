import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service-role key. Used exclusively by
// ADMIN_CODE-gated route handlers (admin writes) and the /api/reveal endpoint,
// which must read the secret parents_shortlist without exposing it to clients.
//
// The service-role key bypasses RLS, so it MUST never be imported into client
// code or prefixed with NEXT_PUBLIC_.
let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient {
  if (serviceClient) return serviceClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Accept both the new "secret" key name and the legacy "service_role" name.
  const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Nedostaje SUPABASE_SECRET_KEY (ili NEXT_PUBLIC_SUPABASE_URL). Potreban je za admin operacije.",
    );
  }

  serviceClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceClient;
}

// Non-throwing variant so admin route handlers can return a clean JSON error
// (instead of a 500 with no body) when the service key isn't configured yet.
export function getServiceClientSafe(): SupabaseClient | null {
  try {
    return getSupabaseServiceClient();
  } catch {
    return null;
  }
}
