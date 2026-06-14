"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Baby, CalendarHeart, Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BigSlider } from "@/components/ui/big-slider";
import { ChoiceTile } from "@/components/ui/choice-tile";
import { StepDots } from "@/components/ui/step-dots";
import { celebrate } from "@/lib/celebrate";
import { HAIR_COLORS, EYE_COLORS, RESEMBLES_OPTIONS, TRAITS, relativeEmoji, hairHex, eyeHex } from "@/lib/options";
import { effectiveDueDate, formatDate } from "@/lib/format";
import { BabyFace } from "./baby-face";
import type { Config, Prediction, Resembles } from "@/lib/types";
import type { PredictionInput } from "@/hooks/use-predictions";

// Steps match scoring.ts (weight step 50 g, length step 0.5 cm).
const WEIGHT = { min: 1500, max: 5500, step: 50, big: 100, default: 3400 };
const LENGTH = { min: 38, max: 58, step: 0.5, big: 1, default: 51 };
const WEIGHT_PRESETS = [
  { label: "sitna ~3000", value: 3000 },
  { label: "taman ~3400", value: 3400 },
  { label: "bucka ~3900", value: 3900 },
];
const LENGTH_PRESETS = [
  { label: "kraća ~48", value: 48 },
  { label: "taman ~51", value: 51 },
  { label: "duža ~54", value: 54 },
];
const STEPS = ["kada", "tezina", "duzina", "kosa", "oci", "osobina", "lici"] as const;

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function dayDiff(a: string, b: string): number {
  return Math.round(
    (new Date(`${a}T00:00:00Z`).getTime() - new Date(`${b}T00:00:00Z`).getTime()) / 86_400_000,
  );
}

export function PredictionForm({
  initial,
  config,
  onSave,
  onDone,
}: {
  initial: Prediction | null;
  config: Config | null;
  onSave: (input: PredictionInput) => Promise<void>;
  onDone?: () => void;
}) {
  const due = effectiveDueDate(config);

  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState(initial?.birth_date ?? due);
  const [weight, setWeight] = useState(initial?.weight_grams ?? WEIGHT.default);
  const [length, setLength] = useState(initial?.length_cm ?? LENGTH.default);
  const [hairColor, setHairColor] = useState(initial?.hair_color ?? "");
  const [eyeColor, setEyeColor] = useState(initial?.eye_color ?? "");
  const [trait, setTrait] = useState(initial?.temperament ?? "");
  const [resembles, setResembles] = useState<Resembles | "">(initial?.resembles ?? "");
  const [timeOn, setTimeOn] = useState(!!initial?.birth_time);
  const [birthTime, setBirthTime] = useState(initial?.birth_time?.slice(0, 5) ?? "");
  const [saving, setSaving] = useState(false);

  const key = STEPS[step];
  const last = step === STEPS.length - 1;
  const diff = dayDiff(birthDate, due);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        birth_date: birthDate,
        weight_grams: weight,
        length_cm: length,
        hair_color: hairColor || null,
        eye_color: eyeColor || null,
        temperament: trait || null,
        resembles: (resembles || null) as Resembles | null,
        birth_time: timeOn && birthTime ? birthTime : null,
      });
      celebrate();
      toast.success(initial ? "Tip je ažuriran ✨" : "Tvoj tip je zabeležen 🍼");
      onDone?.();
    } catch {
      toast.error("Nije uspelo, pokušaj ponovo za koji tren.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Live baby, always on top */}
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-card p-1.5 shadow-cute ring-1 ring-gold/30">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${hairColor}-${eyeColor}-${trait}`}
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 340, damping: 13 }}
              className="block size-32 overflow-hidden rounded-full"
            >
              <BabyFace hairColorHex={hairHex(hairColor)} eyeColorHex={eyeHex(eyeColor)} expression={trait} size={128} />
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="mt-3">
          <StepDots total={STEPS.length} current={step} />
        </div>
      </div>

      {/* One question per step */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="min-h-[16rem]"
        >
          {key === "kada" && (
            <section className="space-y-4 text-center">
              <h3 className="font-heading text-xl font-semibold text-plum">Kada stiže? 🗓️</h3>
              <p className="font-heading text-2xl font-bold text-plum">{formatDate(birthDate)}</p>
              <p className="text-muted-foreground">
                {diff === 0
                  ? "tačno na termin ✨"
                  : `${Math.abs(diff)} ${Math.abs(diff) === 1 ? "dan" : "dana"} ${diff < 0 ? "pre" : "posle"} termina`}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" size="cta" onClick={() => setBirthDate(addDays(birthDate, -1))}>
                  <Minus className="size-5" /> dan ranije
                </Button>
                <Button type="button" variant="outline" size="cta" onClick={() => setBirthDate(addDays(birthDate, 1))}>
                  <Plus className="size-5" /> dan kasnije
                </Button>
              </div>
              <Button
                type="button"
                variant={diff === 0 ? "default" : "secondary"}
                size="cta"
                className="w-full"
                onClick={() => setBirthDate(due)}
              >
                <Star className="size-5" /> Tačno na termin
              </Button>
            </section>
          )}

          {key === "tezina" && (
            <section className="space-y-4">
              <h3 className="text-center font-heading text-xl font-semibold text-plum">Kolika će biti? ⚖️</h3>
              <BigSlider
                value={weight}
                displayValue={`${weight.toLocaleString("sr-Latn")} g`}
                onChange={setWeight}
                min={WEIGHT.min}
                max={WEIGHT.max}
                step={WEIGHT.step}
                bigStep={WEIGHT.big}
                legendLeft="😴 sitna"
                legendRight="bucka 🍼"
                presets={WEIGHT_PRESETS}
              />
            </section>
          )}

          {key === "duzina" && (
            <section className="space-y-4">
              <h3 className="text-center font-heading text-xl font-semibold text-plum">Koliko dugačka? 📏</h3>
              <BigSlider
                value={length}
                displayValue={`${length} cm`}
                onChange={setLength}
                min={LENGTH.min}
                max={LENGTH.max}
                step={LENGTH.step}
                bigStep={LENGTH.big}
                legendLeft="38 cm"
                legendRight="58 cm"
                presets={LENGTH_PRESETS}
              />
            </section>
          )}

          {key === "kosa" && (
            <section className="space-y-4">
              <h3 className="text-center font-heading text-xl font-semibold text-plum">Kakva kosica? 💇</h3>
              <div className="grid grid-cols-3 gap-3">
                {HAIR_COLORS.map((c) => (
                  <ChoiceTile
                    key={c.value}
                    selected={c.value === hairColor}
                    onClick={() => setHairColor(c.value === hairColor ? "" : c.value)}
                    label={c.label}
                    ariaLabel={c.label}
                  >
                    <span className="size-9 rounded-full ring-1 ring-black/10" style={{ backgroundColor: `#${c.hex}` }} />
                  </ChoiceTile>
                ))}
              </div>
            </section>
          )}

          {key === "oci" && (
            <section className="space-y-4">
              <h3 className="text-center font-heading text-xl font-semibold text-plum">Kakve očice? 👁️</h3>
              <div className="grid grid-cols-3 gap-3">
                {EYE_COLORS.map((c) => (
                  <ChoiceTile
                    key={c.value}
                    selected={c.value === eyeColor}
                    onClick={() => setEyeColor(c.value === eyeColor ? "" : c.value)}
                    label={c.label}
                    ariaLabel={c.label}
                  >
                    <span className="size-9 rounded-full ring-1 ring-black/10" style={{ backgroundColor: `#${c.hex}` }} />
                  </ChoiceTile>
                ))}
              </div>
            </section>
          )}

          {key === "osobina" && (
            <section className="space-y-4">
              <h3 className="text-center font-heading text-xl font-semibold text-plum">Kakva će biti? ✨</h3>
              <div className="grid grid-cols-3 gap-3">
                {TRAITS.map((t) => (
                  <ChoiceTile
                    key={t.value}
                    selected={t.value === trait}
                    onClick={() => setTrait(t.value === trait ? "" : t.value)}
                    label={t.label}
                    ariaLabel={t.label}
                  >
                    <span className="text-3xl">{t.emoji}</span>
                  </ChoiceTile>
                ))}
              </div>
            </section>
          )}

          {key === "lici" && (
            <section className="space-y-4">
              <h3 className="text-center font-heading text-xl font-semibold text-plum">Na koga liči? 💕</h3>
              <div className="grid grid-cols-3 gap-3">
                {RESEMBLES_OPTIONS.map((o) => (
                  <ChoiceTile
                    key={o.value}
                    selected={o.value === resembles}
                    onClick={() => setResembles(o.value === resembles ? "" : o.value)}
                    label={o.label}
                    ariaLabel={o.label}
                  >
                    <span className="text-3xl">{relativeEmoji(o.label)}</span>
                  </ChoiceTile>
                ))}
              </div>
              {!timeOn ? (
                <Button type="button" variant="ghost" size="cta" className="w-full" onClick={() => setTimeOn(true)}>
                  <CalendarHeart className="size-5" /> Dodaj i tačan sat? (bonus ⏱️)
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-muted-foreground">Vreme:</span>
                  <Input
                    type="time"
                    step={300}
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="h-12 max-w-36 text-lg"
                  />
                </div>
              )}
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button type="button" variant="ghost" size="cta" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="size-5" /> Nazad
          </Button>
        )}
        {!last ? (
          <Button type="button" size="cta" className="flex-1" onClick={() => setStep((s) => s + 1)}>
            Dalje <ArrowRight className="size-5" />
          </Button>
        ) : (
          <Button type="button" size="cta" className="flex-1" disabled={saving} onClick={handleSave}>
            <Baby className="size-5" /> {saving ? "Čuvam…" : "Sačuvaj tip"}
          </Button>
        )}
      </div>
    </div>
  );
}
