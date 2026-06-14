"use client";

import { MotionConfig } from "motion/react";

// Central motion config: with reducedMotion="user", motion automatically
// reduces transform/layout animations to opacity (or instant) for visitors who
// prefer reduced motion. Infinite loops still need their own useReducedMotion()
// guard — see the hero in app-shell.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
