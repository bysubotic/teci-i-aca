"use client";

import { motion } from "motion/react";
import { Heart, Baby, MessageCircleHeart, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_TABS = [
  { value: "imena", label: "Imena", icon: Heart },
  { value: "tipovanje", label: "Beba", icon: Baby },
  { value: "zelje", label: "Želje", icon: MessageCircleHeart },
  { value: "pisma", label: "Pisma", icon: Mail },
] as const;

// Fixed, thumb-zone bottom navigation — always in the same place, big targets,
// icon + full word, with a sliding blush sticker on the active tab.
export function BottomNav({ tab, onChange }: { tab: string; onChange: (v: string) => void }) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-2 pt-2 pb-1">
        {NAV_TABS.map(({ value, label, icon: Icon }) => {
          const active = tab === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              aria-pressed={active}
              className={cn(
                "relative flex h-16 flex-col items-center justify-center gap-1 rounded-2xl text-[0.9rem] font-semibold transition-colors",
                active ? "text-primary-foreground" : "text-foreground/55",
              )}
            >
              {active && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 -z-10 rounded-2xl bg-primary shadow-sm"
                />
              )}
              <Icon className="size-6" />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
