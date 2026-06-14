"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { popEmoji } from "@/lib/celebrate";
import { decodeAvatar } from "@/lib/avatar";
import { Avatar } from "@/components/avatar";
import { AnimalFace } from "@/components/animal-face";
import { isCapsuleLocked, formatDate } from "@/lib/format";
import type { Identity } from "@/lib/identity";
import type { Config, Wish } from "@/lib/types";
import { useWishes } from "@/hooks/use-wishes";

const CARD_TINTS = [
  "bg-primary/10 border-primary/25",
  "bg-accent/15 border-sage/30",
  "bg-gold/10 border-gold/30",
  "bg-secondary border-border",
];

export function WishesTab({ identity, config }: { identity: Identity; config: Config | null }) {
  const { wishes, loading, add } = useWishes(identity);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const sendRef = useRef<HTMLButtonElement>(null);

  const capsuleLocked = isCapsuleLocked(config);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSaving(true);
    try {
      await add(message, config?.capsule_unlock_date ?? null);
      setMessage("");
      // Soft flower drift instead of confetti — gentler, fits the wish wall.
      popEmoji(sendRef.current, "🌸", 3);
      toast.success(capsuleLocked ? "Želja je sačuvana za kapsulu 💌" : "Hvala na lepoj želji 💌");
    } catch {
      toast.error("Nije uspelo, pokušaj ponovo za koji tren.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-cute"
      >
        <div className="space-y-2">
          <Label htmlFor="wish" className="text-[1rem]">
            Napiši želju za bebu 💌
          </Label>
          <Textarea
            id="wish"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tvoja poruka…"
            maxLength={400}
            rows={4}
            className="rounded-2xl text-lg"
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[0.95rem] text-muted-foreground">Pišeš kao {identity.name}</span>
          <Button ref={sendRef} type="submit" size="cta" className="w-full" disabled={saving || !message.trim()}>
            <Send className="size-5" />
            {saving ? "Šaljem…" : "Pošalji"}
          </Button>
        </div>
      </form>

      {capsuleLocked ? (
        <div className="rise-in rounded-3xl border-2 border-gold/40 bg-gold/10 p-8 text-center">
          <p className="text-4xl">⏳</p>
          <p className="mt-3 font-heading text-xl font-semibold text-plum">Vremenska kapsula</p>
          <p className="mt-1 text-muted-foreground">
            Sve želje su skrivene do{" "}
            <span className="font-semibold text-plum">{formatDate(config?.capsule_unlock_date)}</span>.
            <br />
            Tvoja poruka je bezbedno sačuvana za taj dan. 💛
          </p>
        </div>
      ) : loading ? (
        <WishSkeleton />
      ) : wishes.length === 0 ? (
        <div className="rise-in rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center">
          <span className="wiggle-hover inline-block">
            <AnimalFace animal="meda" bg="9DB89C" size={80} />
          </span>
          <p className="mt-4 text-muted-foreground">
            Budi prva topla reč koju će devojčica jednog dana pročitati. 💌
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {wishes.map((wish, i) => (
            <WishCard key={wish.id} wish={wish} tint={CARD_TINTS[i % CARD_TINTS.length]} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}

function WishCard({ wish, tint, index }: { wish: Wish; tint: string; index: number }) {
  return (
    <li
      style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}
      className={`rise-in rounded-3xl border p-5 shadow-sm ${tint}`}
    >
      <p className="whitespace-pre-wrap text-lg leading-relaxed text-plum">{wish.message}</p>
      <div className="mt-3 flex items-center gap-2">
        <Avatar config={decodeAvatar(wish.author_avatar)} name={wish.author_name} size={28} />
        <span className="font-heading text-[1rem] font-semibold text-plum/80">{wish.author_name}</span>
      </div>
    </li>
  );
}

function WishSkeleton() {
  return (
    <ul className="space-y-3">
      {[0, 1].map((i) => (
        <li key={i} className="h-28 animate-pulse rounded-3xl border border-border bg-card/60" />
      ))}
    </ul>
  );
}
