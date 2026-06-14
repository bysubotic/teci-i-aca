"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Word-labelled two-state control with a sliding blush pill — replaces bare
// Switches, which read as unclear/decorative to older users.
export function SegmentToggle<T extends string>({
  value,
  onChange,
  options,
  idBase,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
  idBase: string;
}) {
  return (
    <div
      className="grid gap-1 rounded-full border border-border bg-card p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cn(
              "relative flex h-12 items-center justify-center gap-1.5 rounded-full text-[0.95rem] font-semibold transition-colors",
              active ? "text-primary-foreground" : "text-foreground/60",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${idBase}`}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-full bg-primary"
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
