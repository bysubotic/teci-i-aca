"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// A big, double-coded selectable tile: visual + word label + ✓ ring when
// chosen (so it works for low-vision / colour-blind users, not colour alone).
export function ChoiceTile({
  selected,
  onClick,
  label,
  ariaLabel,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  label?: React.ReactNode;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={cn(
        "relative flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-2 transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        selected
          ? "border-plum bg-primary/10 ring-2 ring-plum/25"
          : "border-border bg-card hover:border-primary/50",
        className,
      )}
    >
      {selected && (
        <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-plum text-card">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      )}
      {children}
      {label != null && (
        <span className={cn("text-[0.9rem] font-semibold", selected ? "text-plum" : "text-foreground/70")}>
          {label}
        </span>
      )}
    </button>
  );
}
