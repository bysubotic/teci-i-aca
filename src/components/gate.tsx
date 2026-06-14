"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarBuilder } from "@/components/avatar-builder";
import { StepDots } from "@/components/ui/step-dots";
import { PARENTS } from "@/lib/constants";
import { celebrate } from "@/lib/celebrate";
import { AVATAR_BG_COLORS, type AvatarConfig } from "@/lib/avatar";

export function Gate({ onEnter }: { onEnter: (name: string, avatar: AvatarConfig) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<AvatarConfig>(() => ({
    animal: "zeka",
    bg: AVATAR_BG_COLORS[0],
  }));

  async function handleStepOne(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!code.trim() || !trimmedName) {
      setError("Upiši i šifru i svoje ime 🤍");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("Hmm, šifra ne valja — probaj opet 🤍");
        return;
      }
      setStep(2);
    } catch {
      setError("Nema veze sa internetom — probaj opet 🤍");
    } finally {
      setLoading(false);
    }
  }

  function finish() {
    celebrate();
    onEnter(name.trim(), avatar);
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-5">
      {/* Step 2 (make-your-character) gets more room on desktop; mobile stays compact. */}
      <div className={`w-full ${step === 2 ? "max-w-sm sm:max-w-2xl" : "max-w-sm"}`}>
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/25 text-3xl">
            🎀
          </span>
          <h1 className="font-heading text-[2rem] font-semibold tracking-tight text-plum">
            Čeka se devojčica
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            {PARENTS.mom} &amp; {PARENTS.dad} uskoro postaju mama i tata 💕
          </p>
        </div>

        <div className="mb-4">
          <StepDots total={2} current={step - 1} />
        </div>

        {step === 1 ? (
          <form
            onSubmit={handleStepOne}
            className="rise-in space-y-5 rounded-3xl border border-border bg-card p-6 shadow-cute"
          >
            <div className="space-y-2">
              <Label htmlFor="family-code" className="text-[1rem]">
                Porodična šifra
              </Label>
              <Input
                id="family-code"
                type="password"
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="••••••••"
                className="h-14 rounded-2xl text-lg"
                aria-describedby={error ? "gate-error" : undefined}
                aria-invalid={!!error}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitor-name" className="text-[1rem]">
                Tvoje ime
              </Label>
              <Input
                id="visitor-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="npr. Deda Gagi"
                maxLength={40}
                className="h-14 rounded-2xl text-lg"
              />
            </div>

            {error && (
              <p id="gate-error" role="alert" className="text-[1rem] font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="cta-xl" className="w-full" disabled={loading}>
              {loading ? "Trenutak…" : "Dalje"}
              <ArrowRight className="size-5" />
            </Button>
          </form>
        ) : (
          <div className="rise-in space-y-5 rounded-3xl border border-border bg-card p-6 shadow-cute">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-semibold text-plum">Zdravo, {name.trim()}! 👋</h2>
              <p className="mt-0.5 text-muted-foreground">Napravi svoj lik 🎨</p>
            </div>

            <AvatarBuilder value={avatar} onChange={setAvatar} />

            <div className="flex gap-3">
              <Button type="button" variant="ghost" size="cta" onClick={() => setStep(1)}>
                <ArrowLeft className="size-5" />
                Nazad
              </Button>
              <Button type="button" size="cta-xl" className="flex-1" onClick={finish}>
                <Heart className="size-5" />
                Uđi
              </Button>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-[0.95rem] text-muted-foreground">
          Ime i lik se čuvaju samo na ovom telefonu.
        </p>
        <p className="mt-1 text-center text-[0.9rem] text-muted-foreground/80">
          napravljeno s ljubavlju, za moju sestru 🤍
        </p>
      </div>
    </main>
  );
}
