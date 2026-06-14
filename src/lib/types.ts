// Domain types mirroring the Supabase schema (see supabase/schema.sql).

// Free text now — the baby can resemble a named blood relative (see
// RESEMBLES_OPTIONS in src/lib/options.ts).
export type Resembles = string;

export interface Config {
  id: number;
  due_date: string | null; // ISO date (YYYY-MM-DD)
  predictions_locked: boolean;
  reveal_shortlist: boolean;
  capsule_unlock_date: string | null;
}

export interface NameSuggestion {
  id: string;
  name: string;
  note: string | null;
  suggested_by: string | null;
  suggested_by_avatar: string | null;
  created_at: string;
}

export interface NameLike {
  id: string;
  name_id: string;
  voter_id: string;
  voter_name: string | null;
  voter_avatar: string | null;
  created_at: string;
}

export interface Prediction {
  visitor_id: string;
  predictor_name: string;
  predictor_avatar: string | null;
  birth_date: string | null;
  weight_grams: number | null;
  length_cm: number | null;
  hair_color: string | null;
  eye_color: string | null;
  temperament: string | null;
  resembles: Resembles | null;
  birth_time: string | null; // HH:MM[:SS]
  created_at: string;
  updated_at: string;
}

export interface BabyActual {
  id: number;
  birth_date: string | null;
  weight_grams: number | null;
  length_cm: number | null;
  hair_color: string | null;
  eye_color: string | null;
  temperament: string | null;
  resembles: Resembles | null;
  birth_time: string | null;
}

export interface Wish {
  id: string;
  author_name: string;
  author_avatar: string | null;
  message: string;
  unlock_date: string | null;
  created_at: string;
}

// Private letter for the baby to read when she grows up. Content is readable
// only by parents (service role); the family sees only count + authors.
export interface Letter {
  id: string;
  author_name: string;
  author_avatar: string | null;
  message: string;
  created_at: string;
}

export interface LettersSummary {
  count: number;
  authors: { name: string; avatar: string | null }[];
}

// Derived shape used by the leaderboard UI.
export interface NameWithLikes extends NameSuggestion {
  likeCount: number;
  likedByMe: boolean;
  crowned: boolean;
}

// Returned by /api/reveal when the parents flip "Veliko otkrivanje".
export interface RevealResult {
  revealed: boolean;
  crownedNameIds: string[];
  overlapCount: number;
  topConsidered: number;
}
