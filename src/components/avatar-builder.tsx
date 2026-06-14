"use client";

import { Check, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { ChoiceTile } from "@/components/ui/choice-tile";
import { ANIMALS, AVATAR_BG_COLORS, randomAnimal, type AvatarConfig } from "@/lib/avatar";

export function AvatarBuilder({
  value,
  onChange,
}: {
  value: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Big live preview */}
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-full bg-card p-2 shadow-cute ring-1 ring-border">
          <Avatar key={`${value.animal}-${value.bg}`} config={value} size={112} className="rise-in" />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="cta"
          onClick={() => onChange({ ...value, animal: randomAnimal() })}
        >
          <Shuffle className="size-5" />
          Promešaj
        </Button>
      </div>

      {/* Character picker */}
      <div>
        <p className="mb-2.5 font-semibold text-plum">Izaberi lik</p>
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
          {ANIMALS.map((animal) => (
            <ChoiceTile
              key={animal.id}
              selected={animal.id === value.animal}
              onClick={() => onChange({ ...value, animal: animal.id })}
              label={animal.label}
              ariaLabel={animal.label}
            >
              <Avatar config={{ ...value, animal: animal.id }} size={44} />
            </ChoiceTile>
          ))}
        </div>
      </div>

      {/* Background colour */}
      <div>
        <p className="mb-2.5 font-semibold text-plum">Boja pozadine</p>
        <div className="flex flex-wrap gap-3">
          {AVATAR_BG_COLORS.map((bg) => {
            const active = bg === value.bg;
            return (
              <button
                key={bg}
                type="button"
                aria-label={`Boja ${bg}`}
                aria-pressed={active}
                onClick={() => onChange({ ...value, bg })}
                style={{ backgroundColor: `#${bg}` }}
                className={cn(
                  "relative flex size-14 items-center justify-center rounded-full transition-transform active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active ? "ring-3 ring-plum ring-offset-2 ring-offset-card" : "ring-1 ring-black/10",
                )}
              >
                {active && <Check className="size-6 text-plum" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
