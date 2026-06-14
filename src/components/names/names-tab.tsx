"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Crown, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { popEmoji } from "@/lib/celebrate";
import { PARENTS } from "@/lib/constants";
import { decodeAvatar } from "@/lib/avatar";
import { Avatar } from "@/components/avatar";
import { AnimalFace } from "@/components/animal-face";
import { SegmentToggle } from "@/components/ui/segment-toggle";
import type { Identity } from "@/lib/identity";
import type { NameWithLikes } from "@/lib/types";
import { useNames } from "@/hooks/use-names";
import { AddNameForm } from "./add-name-form";

function rankBadge(index: number): string {
  return ["🥇", "🥈", "🥉"][index] ?? `${index + 1}.`;
}

function LikeButton({
  name,
  onToggle,
}: {
  name: NameWithLikes;
  onToggle: (id: string, liked: boolean) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={ref}
      type="button"
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 500, damping: 24 }}
      aria-pressed={name.likedByMe}
      aria-label={name.likedByMe ? `Ukloni lajk za ${name.name}` : `Lajkuj ${name.name}`}
      onClick={() => {
        if (!name.likedByMe) popEmoji(ref.current, "💖", 4);
        onToggle(name.id, name.likedByMe);
      }}
      className={cn(
        "flex h-14 shrink-0 items-center gap-1.5 rounded-full border-2 px-4 text-lg font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        name.likedByMe
          ? "border-primary bg-primary/15 text-plum"
          : "border-border bg-background text-muted-foreground",
      )}
    >
      <Heart className={cn("size-6", name.likedByMe && "fill-primary text-primary")} />
      <span className="tabular-nums">{name.likeCount}</span>
    </motion.button>
  );
}

export function NamesTab({ identity }: { identity: Identity }) {
  const { names, reveal, loading, addName, toggleLike } = useNames(identity);
  const [filter, setFilter] = useState<"sve" | "moje">("sve");

  const visible = filter === "moje" ? names.filter((n) => n.likedByMe) : names;

  return (
    <div className="space-y-5">
      <AddNameForm onAdd={addName} />

      {reveal.revealed && (
        <div className="rise-in flex items-start gap-3 rounded-3xl border-2 border-gold/40 bg-gold/10 p-5">
          <Sparkles className="mt-0.5 size-6 shrink-0 text-gold" />
          <div className="text-plum">
            <p className="font-heading text-lg font-semibold">Veliko otkrivanje! 👑</p>
            <p className="mt-0.5 text-muted-foreground">
              {reveal.overlapCount > 0 ? (
                <>
                  <span className="font-semibold text-plum">
                    {reveal.overlapCount} od {reveal.topConsidered}
                  </span>{" "}
                  vaših najomiljenijih imena je i na tajnoj listi roditelja!
                </>
              ) : (
                <>Nijedno od top {reveal.topConsidered} se ne poklapa sa izborom roditelja — iznenađenje! 😊</>
              )}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-xl font-semibold text-plum">Rang lista</h2>
        <SegmentToggle
          idBase="names"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "sve", label: "Sva imena" },
            { value: "moje", label: "Samo moja ❤" },
          ]}
        />
      </div>

      {loading ? (
        <LeaderboardSkeleton />
      ) : visible.length === 0 ? (
        <EmptyState onlyMine={filter === "moje"} />
      ) : (
        <ul className="space-y-3">
          {visible.map((name, index) => (
            <li
              key={name.id}
              style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
              className="rise-in flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm"
            >
              <span className="w-8 shrink-0 text-center text-xl font-bold tabular-nums text-muted-foreground">
                {filter === "moje" ? "•" : rankBadge(index)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading text-xl font-bold text-plum">{name.name}</span>
                  {name.crowned && (
                    <span className="flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[0.85rem] font-semibold text-gold">
                      <Crown className="size-4" />
                      Izbor roditelja
                    </span>
                  )}
                </div>
                {name.note && <p className="mt-0.5 text-muted-foreground">{name.note}</p>}
                {name.suggested_by && (
                  <p className="mt-1 flex items-center gap-1.5 text-[0.9rem] text-muted-foreground">
                    <Avatar config={decodeAvatar(name.suggested_by_avatar)} name={name.suggested_by} size={20} />
                    predložio/la {name.suggested_by}
                  </p>
                )}
              </div>
              <LikeButton name={name} onToggle={toggleLike} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState({ onlyMine }: { onlyMine: boolean }) {
  return (
    <div className="rise-in rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center">
      <span className="wiggle-hover inline-block">
        <AnimalFace animal={onlyMine ? "maca" : "zeka"} bg="F2C6C0" size={80} />
      </span>
      <p className="mt-4 text-muted-foreground">
        {onlyMine
          ? "Lajkuj ime koje ti se sviđa i pojaviće se ovde. 🤍"
          : `Još nema predloga — pomozi ${PARENTS.momDat} i ${PARENTS.dadDat}, predloži prvo ime. 🌸`}
      </p>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <ul className="space-y-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="h-[84px] animate-pulse rounded-3xl border border-border bg-card/60" />
      ))}
    </ul>
  );
}
