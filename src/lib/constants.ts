// Personal, app-wide constants for this family. The parents can still override
// the due date from /admin (config.due_date takes precedence over this default).

export const PARENTS = {
  // nominative (subject): "Teodora i Aleksandar postaju…"
  mom: "Teodora",
  dad: "Aleksandar",
  // genitive: "…dana Teodore i Aleksandra"
  momGen: "Teodore",
  dadGen: "Aleksandra",
  // dative: "pomozi Teodori i Aleksandru"
  momDat: "Teodori",
  dadDat: "Aleksandru",
} as const;

// Termin: 1. decembar 2026. Used as the fallback when config.due_date is unset
// (and as the seed value in supabase/schema.sql).
export const DEFAULT_DUE_DATE = "2026-12-01";
