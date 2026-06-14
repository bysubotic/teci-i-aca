"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { hairHex, eyeHex, HAIR_COLORS, EYE_COLORS, TRAITS, traitLabel } from "@/lib/options";
import { BabyFace } from "./baby-face";
import { formatDate, formatTime, resemblesLabel, todayIso } from "@/lib/format";
import type { Resembles } from "@/lib/types";

export interface DraftPrediction {
  birthDate: string;
  birthTime: string;
  weight: number | null;
  length: number | null;
  hairColor: string;
  eyeColor: string;
  trait: string;
  resembles: Resembles | "";
}

function dueLabel(birthDate: string, dueDate: string): string | null {
  if (!birthDate) return null;
  const b = new Date(`${birthDate}T00:00:00Z`).getTime();
  const d = new Date(`${dueDate}T00:00:00Z`).getTime();
  const diff = Math.round((b - d) / 86_400_000);
  if (diff === 0) return "tačno na termin ✨";
  const n = Math.abs(diff);
  return diff < 0 ? `${n} ${n === 1 ? "dan" : "dana"} pre termina` : `${n} ${n === 1 ? "dan" : "dana"} posle termina`;
}

function Row({ label, value, filled }: { label: string; value: string; filled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground/70">{label}</span>
      <span className={cn("text-sm font-medium tabular-nums", filled ? "text-plum" : "text-muted-foreground/40")}>
        {value}
      </span>
    </div>
  );
}

export function PredictionCard({
  name,
  draft,
  dueDate,
}: {
  name: string;
  draft: DraftPrediction;
  dueDate: string;
}) {
  const hex = hairHex(draft.hairColor);
  const eyeHexVal = eyeHex(draft.eyeColor);
  const rel = dueLabel(draft.birthDate, dueDate);
  const hairDot = HAIR_COLORS.find((c) => c.value === draft.hairColor);
  const eyeDot = EYE_COLORS.find((c) => c.value === draft.eyeColor);

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-gold/40 bg-gradient-to-b from-card to-secondary/40 p-5 shadow-cute">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-card p-1 shadow-sm ring-1 ring-gold/30">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${hex ?? "none"}-${eyeHexVal ?? "none"}-${draft.trait}`}
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 340, damping: 13 }}
              className="block size-24 overflow-hidden rounded-full"
            >
              <BabyFace hairColorHex={hex} eyeColorHex={eyeHexVal} expression={draft.trait} size={96} />
            </motion.span>
          </AnimatePresence>
        </div>

        <p className="mt-3 font-heading text-base font-semibold text-plum">
          {draft.birthDate ? formatDate(draft.birthDate) : "Datum?"}
        </p>
        {rel && <p className="text-xs text-muted-foreground">{rel}</p>}
        <p className="font-heading text-2xl font-semibold tabular-nums text-plum">
          {draft.birthTime ? formatTime(draft.birthTime) : "—:—"}
        </p>
      </div>

      <div className="mt-4 divide-y divide-border/60 border-t border-border/60">
        <Row label="Težina" value={draft.weight != null ? `${draft.weight.toLocaleString("sr-Latn")} g` : "—"} filled={draft.weight != null} />
        <Row label="Dužina" value={draft.length != null ? `${draft.length} cm` : "—"} filled={draft.length != null} />
        <div className="flex items-center justify-between gap-3 py-1.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground/70">Kosa</span>
          <span className="flex items-center gap-1.5">
            {hairDot && (
              <span className="size-3 rounded-full ring-1 ring-black/10" style={{ backgroundColor: `#${hairDot.hex}` }} />
            )}
            <span className={cn("text-sm font-medium", draft.hairColor ? "text-plum" : "text-muted-foreground/40")}>
              {hairDot?.label ?? "—"}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 py-1.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground/70">Oči</span>
          <span className="flex items-center gap-1.5">
            {eyeDot && (
              <span className="size-3 rounded-full ring-1 ring-black/10" style={{ backgroundColor: `#${eyeDot.hex}` }} />
            )}
            <span className={cn("text-sm font-medium", draft.eyeColor ? "text-plum" : "text-muted-foreground/40")}>
              {eyeDot?.label ?? "—"}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 py-1.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground/70">Osobina</span>
          <span className="flex items-center gap-1.5">
            {draft.trait && <span>{TRAITS.find((t) => t.value === draft.trait)?.emoji}</span>}
            <span className={cn("text-sm font-medium", draft.trait ? "text-plum" : "text-muted-foreground/40")}>
              {draft.trait ? traitLabel(draft.trait) : "—"}
            </span>
          </span>
        </div>
        <Row label="Liči" value={draft.resembles ? resemblesLabel(draft.resembles) : "—"} filled={!!draft.resembles} />
      </div>

      <p className="mt-4 text-center font-heading text-sm font-semibold text-plum/70">
        Tip — {name}
      </p>
      {todayIso() <= dueDate &&
        (!draft.weight || !draft.length || !draft.hairColor || !draft.eyeColor || !draft.resembles) && (
        <p className="mt-1 text-center text-xs text-muted-foreground/70">Još malo… popuni i ostalo 🤍</p>
      )}
    </div>
  );
}
