import type { Config } from "./types";
import { DEFAULT_DUE_DATE } from "./constants";

// Effective due date: parents' admin value wins, else the family default.
export function effectiveDueDate(config: Config | null): string {
  return config?.due_date ?? DEFAULT_DUE_DATE;
}

// Shared date/lock helpers used by predictions + wishes.

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// Serbian plural selection: [jednina, paukal (2–4), množina (5+)].
// e.g. pluralSr(1, ["dan","dana","dana"]) -> "dan"; pluralSr(5, ...) -> "dana".
export function pluralSr(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

// Predictions lock when the admin flips the switch OR the due date has arrived.
export function arePredictionsLocked(config: Config | null): boolean {
  if (config?.predictions_locked) return true;
  return todayIso() >= effectiveDueDate(config);
}

// Capsule is "closed" while the unlock date is still in the future.
export function isCapsuleLocked(config: Config | null): boolean {
  if (!config?.capsule_unlock_date) return false;
  return todayIso() < config.capsule_unlock_date;
}

const DATE_FMT = new Intl.DateTimeFormat("sr-Latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return DATE_FMT.format(new Date(`${iso}T00:00:00`));
  } catch {
    return iso;
  }
}

export function formatTime(t: string | null | undefined): string {
  if (!t) return "—";
  return t.slice(0, 5);
}

// The stored value is now the relative's name itself (e.g. "Baka Veci").
export function resemblesLabel(value: string | null | undefined): string {
  return value || "—";
}
