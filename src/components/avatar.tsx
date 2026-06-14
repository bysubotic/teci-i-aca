"use client";

import { cn } from "@/lib/utils";
import { AnimalFace } from "@/components/animal-face";
import type { AvatarConfig } from "@/lib/avatar";

export function Avatar({
  config,
  name,
  size = 40,
  className,
}: {
  config: AvatarConfig | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  if (!config) {
    // Fallback: initials chip for older contributions without an avatar.
    const initial = (name ?? "?").trim().charAt(0).toUpperCase() || "?";
    return (
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-secondary font-heading font-semibold text-plum/70",
          className,
        )}
      >
        {initial}
      </span>
    );
  }

  return (
    <span
      style={{ width: size, height: size }}
      className={cn("wiggle-hover inline-block shrink-0 overflow-hidden rounded-full", className)}
    >
      <AnimalFace animal={config.animal} bg={config.bg} size={size} />
    </span>
  );
}
