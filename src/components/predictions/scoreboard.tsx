"use client";

import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildScoreboard, hasActualData } from "@/lib/scoring";
import { formatDate, formatTime, resemblesLabel } from "@/lib/format";
import { traitLabel } from "@/lib/options";
import { decodeAvatar } from "@/lib/avatar";
import { Avatar } from "@/components/avatar";
import type { BabyActual, Prediction } from "@/lib/types";

function rankMark(index: number): string {
  return ["🥇", "🥈", "🥉"][index] ?? `${index + 1}.`;
}

export function Scoreboard({
  predictions,
  babyActual,
}: {
  predictions: Prediction[];
  babyActual: BabyActual | null;
}) {
  if (!hasActualData(babyActual)) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
        <p className="text-3xl">🏆</p>
        <p className="mt-3 font-heading text-lg font-semibold text-plum">Pobednici</p>
        <p className="mt-1 text-sm text-muted-foreground">Rezultati još nisu uneti.</p>
      </div>
    );
  }

  const ranked = buildScoreboard(predictions, babyActual);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-sage/40 bg-accent/15 p-4 text-sm">
        <p className="font-heading text-base font-semibold text-plum">Stvarni podaci o bebi 🍼</p>
        <p className="mt-1 text-muted-foreground">
          {formatDate(babyActual.birth_date)}
          {babyActual.birth_time ? ` u ${formatTime(babyActual.birth_time)}` : ""} ·{" "}
          {babyActual.weight_grams ?? "—"} g · {babyActual.length_cm ?? "—"} cm · kosa{" "}
          {babyActual.hair_color ?? "—"} · oči {babyActual.eye_color ?? "—"} · {traitLabel(babyActual.temperament)} · liči{" "}
          {resemblesLabel(babyActual.resembles)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Trophy className="size-5 text-gold" />
        <h3 className="font-heading text-lg font-semibold text-plum">Pobednici</h3>
      </div>

      <ol className="space-y-2.5">
        {ranked.map((entry, index) => (
          <li
            key={entry.prediction.visitor_id}
            className={cn(
              "rounded-2xl border bg-card p-4 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm",
              index === 0 ? "border-gold/50 ring-1 ring-gold/30" : "border-border",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-7 text-center text-base font-semibold tabular-nums">
                  {rankMark(index)}
                </span>
                <Avatar
                  config={decodeAvatar(entry.prediction.predictor_avatar)}
                  name={entry.prediction.predictor_name}
                  size={30}
                />
                <span className="font-heading text-lg font-semibold text-plum">
                  {entry.prediction.predictor_name}
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold tabular-nums text-plum">
                {entry.total} <span className="font-normal text-muted-foreground">poena</span>
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.breakdown.map((cat) => (
                <span
                  key={cat.key}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-xs tabular-nums",
                    cat.points > 0
                      ? "border-sage/50 bg-accent/15 text-plum"
                      : "border-border bg-muted/40 text-muted-foreground",
                  )}
                  title={`${cat.label}: ${cat.points} / ${cat.max}`}
                >
                  {cat.label} {cat.points}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
