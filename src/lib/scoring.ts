import type { BabyActual, Prediction } from "./types";

// Scoring rules — defined exactly per SPEC.md.
//
//   Datum:     tačan dan = 50; ±1 = 35; ±2 = 25; ±3 = 15; ±5 = 5; inače 0
//   Težina:    |Δ| ≤ 50 g = 30; ≤ 150 g = 20; ≤ 300 g = 10; inače 0
//   Dužina:    |Δ| ≤ 1 cm = 20; ≤ 2 cm = 12; ≤ 4 cm = 5; inače 0
//   Boja kose: tačno = 10
//   Na koga liči: tačno = 10
//   Vreme:     |Δ| ≤ 30 min = 15; ≤ 60 min = 8; ≤ 120 min = 3; inače 0  (only if predicted)
//
//   Boja očiju: tačno = 10
//   Osobina: tačno = 10
//
// Max ≈ 155 poena. Tie-break by closest birth date.

export interface CategoryScore {
  key: "date" | "weight" | "length" | "hair" | "eyes" | "trait" | "resembles" | "time";
  label: string;
  points: number;
  max: number;
}

export interface ScoredPrediction {
  prediction: Prediction;
  total: number;
  breakdown: CategoryScore[];
  dateDiffDays: number | null; // absolute, for tie-breaking
}

function dayDiff(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round(Math.abs(da - db) / 86_400_000);
}

function scoreDate(pred: string | null, actual: string | null): number {
  if (!pred || !actual) return 0;
  const d = dayDiff(pred, actual);
  if (d === 0) return 50;
  if (d <= 1) return 35;
  if (d <= 2) return 25;
  if (d <= 3) return 15;
  if (d <= 5) return 5;
  return 0;
}

function scoreWeight(pred: number | null, actual: number | null): number {
  if (pred == null || actual == null) return 0;
  const d = Math.abs(pred - actual);
  if (d <= 50) return 30;
  if (d <= 150) return 20;
  if (d <= 300) return 10;
  return 0;
}

function scoreLength(pred: number | null, actual: number | null): number {
  if (pred == null || actual == null) return 0;
  const d = Math.abs(pred - actual);
  if (d <= 1) return 20;
  if (d <= 2) return 12;
  if (d <= 4) return 5;
  return 0;
}

function scoreExact(pred: string | null, actual: string | null): number {
  if (!pred || !actual) return 0;
  return pred.trim().toLowerCase() === actual.trim().toLowerCase() ? 10 : 0;
}

// Minutes since midnight for an "HH:MM[:SS]" string.
function toMinutes(t: string): number | null {
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function scoreTime(pred: string | null, actual: string | null): number {
  if (!pred || !actual) return 0;
  const p = toMinutes(pred);
  const a = toMinutes(actual);
  if (p == null || a == null) return 0;
  // Wrap-around aware diff (e.g. 23:50 vs 00:10 = 20 min).
  let d = Math.abs(p - a);
  d = Math.min(d, 1440 - d);
  if (d <= 30) return 15;
  if (d <= 60) return 8;
  if (d <= 120) return 3;
  return 0;
}

export function scorePrediction(prediction: Prediction, actual: BabyActual): ScoredPrediction {
  const predictedTime = !!prediction.birth_time;

  const breakdown: CategoryScore[] = [
    { key: "date", label: "Datum", points: scoreDate(prediction.birth_date, actual.birth_date), max: 50 },
    { key: "weight", label: "Težina", points: scoreWeight(prediction.weight_grams, actual.weight_grams), max: 30 },
    { key: "length", label: "Dužina", points: scoreLength(prediction.length_cm, actual.length_cm), max: 20 },
    { key: "hair", label: "Boja kose", points: scoreExact(prediction.hair_color, actual.hair_color), max: 10 },
    { key: "eyes", label: "Boja očiju", points: scoreExact(prediction.eye_color, actual.eye_color), max: 10 },
    { key: "trait", label: "Osobina", points: scoreExact(prediction.temperament, actual.temperament), max: 10 },
    { key: "resembles", label: "Na koga liči", points: scoreExact(prediction.resembles, actual.resembles), max: 10 },
    // "Vreme" only counts when the predictor actually entered a time.
    { key: "time", label: "Vreme", points: predictedTime ? scoreTime(prediction.birth_time, actual.birth_time) : 0, max: 15 },
  ];

  const total = breakdown.reduce((sum, c) => sum + c.points, 0);
  const dateDiffDays =
    prediction.birth_date && actual.birth_date ? dayDiff(prediction.birth_date, actual.birth_date) : null;

  return { prediction, total, breakdown, dateDiffDays };
}

export function hasActualData(actual: BabyActual | null | undefined): actual is BabyActual {
  return !!actual && !!actual.birth_date;
}

// Ranked scoreboard. Tie-break: higher total, then closest birth date.
export function buildScoreboard(predictions: Prediction[], actual: BabyActual): ScoredPrediction[] {
  return predictions
    .map((p) => scorePrediction(p, actual))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      const ad = a.dateDiffDays ?? Number.POSITIVE_INFINITY;
      const bd = b.dateDiffDays ?? Number.POSITIVE_INFINITY;
      return ad - bd;
    });
}
