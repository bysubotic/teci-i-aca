"use client";

import { useRef, useState } from "react";
import { Lock, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StoryCard } from "@/components/ui/story-card";
import { Avatar } from "@/components/avatar";
import { AnimalFace } from "@/components/animal-face";
import { popEmoji } from "@/lib/celebrate";
import { decodeAvatar } from "@/lib/avatar";
import { pluralSr } from "@/lib/format";
import { PARENTS } from "@/lib/constants";
import type { Identity } from "@/lib/identity";
import { useLetters } from "@/hooks/use-letters";

export function LettersTab({ identity }: { identity: Identity }) {
  const { summary, loading, add } = useLetters(identity);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const sendRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSaving(true);
    try {
      await add(message);
      setMessage("");
      popEmoji(sendRef.current, "💌", 3);
      toast.success("Pismo je zapečaćeno za devojčicu 💌");
    } catch {
      toast.error("Nije uspelo, pokušaj ponovo za koji tren.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <StoryCard title="Pismo za devojčicu" icon={<Lock className="size-6 text-primary" />}>
        <div className="mb-4 flex items-start gap-3 rounded-2xl bg-secondary/60 p-3.5 text-[0.95rem] text-plum">
          <span className="text-xl">🤍</span>
          <p>
            Napiši nešto što će pročitati <span className="font-semibold">kad poraste</span>. Ovo je
            tajna — čitaju samo mama {PARENTS.mom} i tata {PARENTS.dad}, niko drugi ne vidi tekst.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="letter" className="text-[1rem]">
              Tvoje pismo
            </Label>
            <Textarea
              id="letter"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Draga naša devojčice…"
              maxLength={2000}
              rows={5}
              className="rounded-2xl text-lg"
            />
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[0.95rem] text-muted-foreground">Pišeš kao {identity.name}</span>
            <Button ref={sendRef} type="submit" size="cta" className="w-full" disabled={saving || !message.trim()}>
              <Send className="size-5" />
              {saving ? "Šaljem…" : "Pošalji pismo"}
            </Button>
          </div>
        </form>
      </StoryCard>

      {/* Count + who wrote (no content) */}
      {!loading && (
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-cute">
          <span className="wiggle-hover inline-block">
            <AnimalFace animal="zeka" bg="F2C6C0" size={72} />
          </span>
          <p className="mt-3 font-heading text-xl font-semibold text-plum">
            {summary.count === 0
              ? "Još nema pisama"
              : `${summary.count} ${pluralSr(summary.count, ["pismo", "pisma", "pisama"])} čeka devojčicu 💌`}
          </p>
          {summary.authors.length > 0 && (
            <>
              <p className="mt-4 text-[0.95rem] text-muted-foreground">Pisali su:</p>
              <ul className="mt-2 flex flex-wrap justify-center gap-2.5">
                {summary.authors.map((a) => (
                  <li
                    key={a.name}
                    className="flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pl-1.5 pr-3.5 text-[0.95rem] font-medium text-plum"
                  >
                    <Avatar config={decodeAvatar(a.avatar)} name={a.name} size={26} />
                    {a.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
