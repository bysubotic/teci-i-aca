"use client";

import { useEffect, useState } from "react";
import { Baby } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChoiceTile } from "@/components/ui/choice-tile";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { HAIR_COLORS, EYE_COLORS, RESEMBLES_OPTIONS, TRAITS, relativeEmoji } from "@/lib/options";
import type { BabyActual, Resembles } from "@/lib/types";
import { AdminCard } from "./admin-card";

export function BabyActualSection() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [trait, setTrait] = useState("");
  const [resembles, setResembles] = useState<Resembles | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("baby_actual")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const a = data as BabyActual;
        setBirthDate(a.birth_date ?? "");
        setBirthTime(a.birth_time?.slice(0, 5) ?? "");
        setWeight(a.weight_grams?.toString() ?? "");
        setLength(a.length_cm?.toString() ?? "");
        setHairColor(a.hair_color ?? "");
        setEyeColor(a.eye_color ?? "");
        setTrait(a.temperament ?? "");
        setResembles((a.resembles as Resembles) ?? "");
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/baby-actual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_date: birthDate || null,
          birth_time: birthTime || null,
          weight_grams: weight || null,
          length_cm: length || null,
          hair_color: hairColor || null,
          eye_color: eyeColor || null,
          temperament: trait || null,
          resembles: resembles || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error);
      toast.success("Sačuvano! 🍼 Rezultati su objavljeni.");
    } catch {
      toast.error("Nije sačuvano, pokušaj ponovo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminCard
      title="Stvarni podaci o bebi"
      description="Popuni kad se beba rodi — scoreboard se računa odavde."
      icon={<Baby className="size-6 text-primary" />}
    >
      <form onSubmit={save} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="a-date" className="text-[1rem]">Datum rođenja</Label>
            <Input id="a-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="h-14 rounded-2xl text-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="a-time" className="text-[1rem]">Vreme rođenja</Label>
            <Input id="a-time" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="h-14 rounded-2xl text-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="a-weight" className="text-[1rem]">Težina (g)</Label>
            <Input id="a-weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="npr. 3400" className="h-14 rounded-2xl text-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="a-length" className="text-[1rem]">Dužina (cm)</Label>
            <Input id="a-length" type="number" step="0.5" value={length} onChange={(e) => setLength(e.target.value)} placeholder="npr. 51" className="h-14 rounded-2xl text-lg" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[1rem]">Boja kose</Label>
          <div className="grid grid-cols-3 gap-3">
            {HAIR_COLORS.map((c) => (
              <ChoiceTile key={c.value} selected={c.value === hairColor} onClick={() => setHairColor(c.value === hairColor ? "" : c.value)} label={c.label} ariaLabel={c.label}>
                <span className="size-9 rounded-full ring-1 ring-black/10" style={{ backgroundColor: `#${c.hex}` }} />
              </ChoiceTile>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[1rem]">Boja očiju</Label>
          <div className="grid grid-cols-3 gap-3">
            {EYE_COLORS.map((c) => (
              <ChoiceTile key={c.value} selected={c.value === eyeColor} onClick={() => setEyeColor(c.value === eyeColor ? "" : c.value)} label={c.label} ariaLabel={c.label}>
                <span className="size-9 rounded-full ring-1 ring-black/10" style={{ backgroundColor: `#${c.hex}` }} />
              </ChoiceTile>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[1rem]">Osobina</Label>
          <div className="grid grid-cols-3 gap-3">
            {TRAITS.map((t) => (
              <ChoiceTile key={t.value} selected={t.value === trait} onClick={() => setTrait(t.value === trait ? "" : t.value)} label={t.label} ariaLabel={t.label}>
                <span className="text-3xl">{t.emoji}</span>
              </ChoiceTile>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[1rem]">Na koga liči?</Label>
          <div className="grid grid-cols-3 gap-3">
            {RESEMBLES_OPTIONS.map((o) => (
              <ChoiceTile key={o.value} selected={o.value === resembles} onClick={() => setResembles(o.value === resembles ? "" : o.value)} label={o.label} ariaLabel={o.label}>
                <span className="text-3xl">{relativeEmoji(o.label)}</span>
              </ChoiceTile>
            ))}
          </div>
        </div>

        <Button type="submit" size="cta-xl" className="w-full" disabled={saving}>
          <Baby className="size-5" />
          {saving ? "Čuvam…" : "Sačuvaj stvarne podatke"}
        </Button>
      </form>
    </AdminCard>
  );
}
