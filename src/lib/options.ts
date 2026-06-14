// Hair-color choices. Predictions and the admin "actual" form share this list
// so scoring can do a clean exact match.
// `hex` is only the visual swatch + the colour fed to the live baby avatar.
// The stored `value` never changes, so scoreExact() stays clean.
export const HAIR_COLORS = [
  { value: "crna", label: "Crna", hex: "2c1b18" },
  { value: "smeđa", label: "Smeđa", hex: "6b4423" },
  { value: "plava", label: "Plava", hex: "d6b370" },
  { value: "riđa", label: "Riđa", hex: "b55239" },
  { value: "svetla", label: "Svetla", hex: "e8d5b5" },
] as const;

export function hairHex(value: string | null | undefined): string | undefined {
  return HAIR_COLORS.find((c) => c.value === value)?.hex;
}

// Eye colours — same pattern: stored `value` is scored, `hex` is just visual.
export const EYE_COLORS = [
  { value: "smeđe", label: "Smeđe", hex: "6b4423" },
  { value: "plave", label: "Plave", hex: "6c9bd1" },
  { value: "zelene", label: "Zelene", hex: "5e9b6a" },
  { value: "sive", label: "Sive", hex: "8a8f99" },
  { value: "crne", label: "Crne", hex: "2c2230" },
] as const;

export function eyeHex(value: string | null | undefined): string | undefined {
  return EYE_COLORS.find((c) => c.value === value)?.hex;
}

// Named blood relatives the baby might resemble. `value` = `label` (stored as
// free text). The parents can tell us to edit this list any time.
export const RESEMBLES_OPTIONS: { value: string; label: string }[] = [
  "Mama Teci",
  "Tata Aca",
  "Baka Veci",
  "Tetka Ivanka",
  "Ujka Đole",
  "Baka Dragana",
  "Deda Gagi",
  "Deda Dejan",
  "Tetka Stela",
].map((name) => ({ value: name, label: name }));

// Character / personality guesses. `value` doubles as the BabyFace expression key.
export const TRAITS = [
  { value: "nasmejana", label: "Nasmejana", emoji: "😊" },
  { value: "mirna", label: "Mirna", emoji: "😌" },
  { value: "radoznala", label: "Radoznala", emoji: "🤔" },
  { value: "nestasna", label: "Nestašna", emoji: "😜" },
  { value: "pospana", label: "Pospana", emoji: "😴" },
  { value: "brbljiva", label: "Brbljiva", emoji: "💬" },
] as const;

export function traitLabel(value: string | null | undefined): string {
  return TRAITS.find((t) => t.value === value)?.label ?? "—";
}

// Cute emoji guessed from the first word of the relative's label.
export function relativeEmoji(label: string): string {
  const w = label.trim().toLowerCase().split(/\s+/)[0];
  if (["mama", "majka", "keva"].includes(w)) return "👩";
  if (["tata", "otac", "ćale"].includes(w)) return "👨";
  if (["baka", "baba"].includes(w)) return "👵";
  if (["deda", "deka", "deka,"].includes(w)) return "👴";
  if (["tetka", "strina", "ujna", "kuma"].includes(w)) return "👩";
  if (["ujka", "ujak", "stric", "teča", "teca", "kum"].includes(w)) return "👨";
  if (["brat", "bata", "braco"].includes(w)) return "👦";
  if (["sestra", "seka", "seja"].includes(w)) return "👧";
  return "💕";
}
