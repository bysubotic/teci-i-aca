"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pluralSr } from "@/lib/format";
import type { LettersSummary } from "@/lib/types";
import { AdminCard } from "./admin-card";

export function LettersSection() {
  const router = useRouter();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/letters/summary")
      .then((r) => r.json())
      .then((d: LettersSummary) => setCount(d.count))
      .catch(() => setCount(0));
  }, []);

  return (
    <AdminCard
      title="Pisma za devojčicu"
      description="Tajna pisma koja čitate samo vi — kad poraste."
      icon={<Mail className="size-6 text-primary" />}
    >
      <p className="mb-4 text-plum">
        {count === null ? (
          "…"
        ) : count === 0 ? (
          "Još nema pisama."
        ) : (
          <>
            <span className="font-heading text-2xl font-bold">{count}</span>{" "}
            {pluralSr(count, ["pismo", "pisma", "pisama"])} vas čeka.
          </>
        )}
      </p>
      <Button size="cta" className="w-full" onClick={() => router.push("/admin/letters")}>
        <Mail className="size-5" />
        Pročitaj i izvezi
        <ArrowRight className="size-5" />
      </Button>
    </AdminCard>
  );
}
