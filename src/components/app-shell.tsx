"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useIdentity } from "@/hooks/use-identity";
import { useConfig } from "@/hooks/use-config";
import { Gate } from "@/components/gate";
import { Avatar } from "@/components/avatar";
import { Hero } from "@/components/hero";
import { BottomNav } from "@/components/bottom-nav";
import { NamesTab } from "@/components/names/names-tab";
import { PredictionsTab } from "@/components/predictions/predictions-tab";
import { WishesTab } from "@/components/wishes/wishes-tab";
import { LettersTab } from "@/components/letters/letters-tab";
import type { Identity } from "@/lib/identity";

export function AppShell() {
  const { identity, ready, create, reset } = useIdentity();

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <span className="animate-pulse text-3xl">🎀</span>
      </main>
    );
  }

  if (!identity) {
    return <Gate onEnter={create} />;
  }

  return <AppContent identity={identity} onReset={reset} />;
}

function AppContent({ identity, onReset }: { identity: Identity; onReset: () => void }) {
  const { config } = useConfig();
  const [tab, setTab] = useState<string>("imena");

  return (
    <>
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-32">
        <Hero identity={identity} config={config} />

        <div className="mt-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {tab === "imena" && <NamesTab identity={identity} />}
              {tab === "tipovanje" && <PredictionsTab identity={identity} config={config} />}
              {tab === "zelje" && <WishesTab identity={identity} config={config} />}
              {tab === "pisma" && <LettersTab identity={identity} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.95rem] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Avatar config={identity.avatar} name={identity.name} size={24} />
            Ćao, {identity.name} 👋
          </span>
          <span aria-hidden>·</span>
          <button
            type="button"
            onClick={() =>
              toast("Da promenimo ime?", {
                description: "Tvoji lajkovi i tip ostaju vezani za sadašnje ime.",
                action: { label: "Da, promeni", onClick: onReset },
                cancel: { label: "Ostavi ovako", onClick: () => {} },
              })
            }
            className="rounded-sm underline underline-offset-2 hover:text-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            promeni ime
          </button>
          <span aria-hidden>·</span>
          <Link href="/admin" className="underline underline-offset-2 hover:text-plum">
            za mamu i tatu
          </Link>
        </footer>
      </div>

      <BottomNav tab={tab} onChange={setTab} />
    </>
  );
}
