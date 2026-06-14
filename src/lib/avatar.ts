// "Napravi svoj lik" — each visitor picks a cute animal character + background
// colour. Tiny, deterministic config, persisted in the DB so everyone sees each
// other's characters. The art lives in src/components/animal-face.tsx.

// Cute characters: family people (close + extended) + animals.
export type AnimalId =
  | "sestra"
  | "brat"
  | "mama"
  | "tata"
  | "baba"
  | "deka"
  | "tetka"
  | "teca"
  | "ujak"
  | "ujna"
  | "stric"
  | "strina"
  | "kum"
  | "kuma"
  | "zeka"
  | "meda"
  | "maca"
  | "lija"
  | "pile"
  | "panda";

export interface AvatarConfig {
  animal: AnimalId;
  bg: string; // hex without '#'
}

export const ANIMALS: { id: AnimalId; label: string }[] = [
  { id: "sestra", label: "Sestra" },
  { id: "brat", label: "Brat" },
  { id: "mama", label: "Mama" },
  { id: "tata", label: "Tata" },
  { id: "baba", label: "Baba" },
  { id: "deka", label: "Deka" },
  { id: "tetka", label: "Tetka" },
  { id: "teca", label: "Teča" },
  { id: "ujak", label: "Ujak" },
  { id: "ujna", label: "Ujna" },
  { id: "stric", label: "Stric" },
  { id: "strina", label: "Strina" },
  { id: "kum", label: "Kum" },
  { id: "kuma", label: "Kuma" },
  { id: "zeka", label: "Zeka" },
  { id: "meda", label: "Meda" },
  { id: "maca", label: "Maca" },
  { id: "lija", label: "Lija" },
  { id: "pile", label: "Pile" },
  { id: "panda", label: "Panda" },
];

const ANIMAL_IDS = new Set(ANIMALS.map((a) => a.id));

// Background swatches from the warm palette (+ a soft baby blue / lilac).
export const AVATAR_BG_COLORS = ["EFA8A0", "9DB89C", "D9A441", "F2C6C0", "A9C7D9", "C9B7DD"];

export const DEFAULT_AVATAR: AvatarConfig = {
  animal: "zeka",
  bg: AVATAR_BG_COLORS[0],
};

// Random animal (client event handlers only — never during render).
export function randomAnimal(): AnimalId {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)].id;
}

// --- DB encoding ----------------------------------------------------------
// Stored as a compact JSON string alongside each contribution.

export function encodeAvatar(config: AvatarConfig | null | undefined): string | null {
  if (!config) return null;
  return JSON.stringify({ a: config.animal, b: config.bg });
}

export function decodeAvatar(raw: string | null | undefined): AvatarConfig | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { a?: string; b?: string };
    if (!parsed.a || !parsed.b || !ANIMAL_IDS.has(parsed.a as AnimalId)) return null;
    return { animal: parsed.a as AnimalId, bg: parsed.b };
  } catch {
    return null;
  }
}
