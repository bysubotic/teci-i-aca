"use client";

import { cn } from "@/lib/utils";

// Sticker-album progress dots: ●●●○○
export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2.5 rounded-full transition-all duration-300",
            i === current ? "w-7 bg-primary" : i < current ? "w-2.5 bg-accent" : "w-2.5 bg-muted",
          )}
        />
      ))}
    </div>
  );
}
