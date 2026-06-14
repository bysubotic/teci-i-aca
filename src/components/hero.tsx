"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Avatar } from "@/components/avatar";
import { todayIso, pluralSr, effectiveDueDate } from "@/lib/format";
import { PARENTS } from "@/lib/constants";
import type { Config } from "@/lib/types";
import type { Identity } from "@/lib/identity";

function daysUntil(due: string): number {
  const today = new Date(`${todayIso()}T00:00:00Z`).getTime();
  const target = new Date(`${due}T00:00:00Z`).getTime();
  return Math.round((target - today) / 86_400_000);
}

function Countdown({ config }: { config: Config | null }) {
  const days = daysUntil(effectiveDueDate(config));

  if (days < 0) return <p className="text-sm text-muted-foreground">Beba je na putu! 💕</p>;
  if (days === 0) return <p className="text-sm font-medium text-plum">Termin je danas! 🎉</p>;
  if (days <= 7) {
    return (
      <p className="text-sm font-medium text-plum">
        Još samo {days} {pluralSr(days, ["dan", "dana", "dana"])} do susreta 🎀
      </p>
    );
  }
  if (days <= 60) {
    return (
      <p className="text-sm text-muted-foreground">
        Još <span className="font-semibold text-plum">{days}</span>{" "}
        {pluralSr(days, ["dan", "dana", "dana"])} do termina 🗓️
      </p>
    );
  }
  return (
    <p className="text-sm text-muted-foreground">
      Još <span className="font-semibold text-plum">{days}</span>{" "}
      {pluralSr(days, ["dan", "dana", "dana"])} do najlepšeg dana {PARENTS.momGen} i {PARENTS.dadGen} 🤍
    </p>
  );
}

const TITLE_WORDS = ["Čeka", "se", "devojčica"];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

export function Hero({ identity, config }: { identity: Identity; config: Config | null }) {
  const reduce = useReducedMotion();

  return (
    <header className="relative pt-8 pb-5 text-center">
      {/* One calm twinkling sparkle (CSS only, hidden under reduced-motion) */}
      <span aria-hidden className="sparkle pointer-events-none absolute right-[26%] top-5 text-base" style={{ animationDelay: "0.6s" }}>
        ✨
      </span>

      {/* One gentle ambient blob (transform/opacity only) */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ willChange: "transform" }}
          className="pointer-events-none absolute -top-6 left-1/3 -z-10 size-40 transform-gpu rounded-full bg-primary/15 blur-3xl"
          animate={{ x: [0, 16, 0], y: [0, 10, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 17, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      )}

      {/* User's character with halo + gentle float */}
      <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center">
        {!reduce && (
          <motion.span
            aria-hidden
            style={{ willChange: "transform, opacity" }}
            className="absolute inset-0 transform-gpu rounded-full bg-primary/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <motion.div
          animate={reduce ? undefined : { y: [0, -5, 0, -2, 0], rotate: [-3, 3, -3, 3, -3] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative rounded-full bg-card p-1 shadow-cute ring-1 ring-border"
        >
          <Avatar config={identity.avatar} name={identity.name} size={64} />
        </motion.div>
      </div>

      <motion.h1
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-x-2 font-heading text-3xl font-semibold tracking-tight text-plum"
      >
        {TITLE_WORDS.map((w, i) => (
          <motion.span key={i} variants={word} className="inline-block">
            {w}
          </motion.span>
        ))}
      </motion.h1>

      <div className="mt-1.5">
        <Countdown config={config} />
      </div>
    </header>
  );
}
