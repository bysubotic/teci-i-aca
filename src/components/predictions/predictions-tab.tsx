"use client";

import { useState } from "react";
import { Baby, Lock, Pencil, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/ui/story-card";
import {
  arePredictionsLocked,
  effectiveDueDate,
  formatDate,
  formatTime,
  pluralSr,
  resemblesLabel,
} from "@/lib/format";
import { decodeAvatar } from "@/lib/avatar";
import { HAIR_COLORS, EYE_COLORS, TRAITS, hairHex, eyeHex } from "@/lib/options";
import { Avatar } from "@/components/avatar";
import type { Identity } from "@/lib/identity";
import type { Config, Prediction, Resembles } from "@/lib/types";
import { usePredictions } from "@/hooks/use-predictions";
import { PredictionForm } from "./prediction-form";
import { PredictionCard, type DraftPrediction } from "./prediction-card";
import { BabyFace } from "./baby-face";
import { Scoreboard } from "./scoreboard";

function toDraft(p: Prediction): DraftPrediction {
  return {
    birthDate: p.birth_date ?? "",
    birthTime: p.birth_time?.slice(0, 5) ?? "",
    weight: p.weight_grams,
    length: p.length_cm,
    hairColor: p.hair_color ?? "",
    eyeColor: p.eye_color ?? "",
    trait: p.temperament ?? "",
    resembles: (p.resembles ?? "") as Resembles | "",
  };
}

export function PredictionsTab({ identity, config }: { identity: Identity; config: Config | null }) {
  const { all, mine, babyActual, loading, save } = usePredictions(identity);
  const locked = arePredictionsLocked(config);
  const [editing, setEditing] = useState(false);

  // Everyone always sees everyone's guesses — it's more fun this way. While
  // voting is open, your own tip is the big card on top, so the gallery below
  // shows just the others; once locked, the gallery shows all of them.
  const others = all.filter((p) => p.visitor_id !== identity.id);

  if (locked) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-muted/50 p-5">
          <Lock className="size-6 shrink-0 text-muted-foreground" />
          <p className="font-semibold text-plum">Tipovanje je zaključano 🔒</p>
        </div>
        <PredictionGallery title="Svi tipovi" predictions={all} myVisitorId={identity.id} />
        <Scoreboard predictions={all} babyActual={babyActual} />
      </div>
    );
  }

  const showWizard = !mine || editing;

  return (
    <div className="space-y-5">
      {showWizard ? (
        <StoryCard title={mine ? "Izmeni svoj tip" : "Napravi svoj tip"} icon={<Baby className="size-6 text-primary" />}>
          <PredictionForm
            initial={mine}
            config={config}
            onSave={save}
            onDone={() => setEditing(false)}
          />
        </StoryCard>
      ) : (
        <StoryCard title="Tvoj tip" icon={<Baby className="size-6 text-primary" />}>
          <PredictionCard name={identity.name} draft={toDraft(mine!)} dueDate={effectiveDueDate(config)} />
          <Button size="cta" className="mt-4 w-full" onClick={() => setEditing(true)}>
            <Pencil className="size-5" /> Izmeni tip
          </Button>
        </StoryCard>
      )}

      {!loading && (
        <p className="flex items-center justify-center gap-2 text-muted-foreground">
          <Users className="size-5" />
          {all.length === 0
            ? "Još niko nije tipovao."
            : `Do sada ${all.length} ${pluralSr(all.length, ["tip", "tipa", "tipova"])}.`}
        </p>
      )}

      <PredictionGallery title="Ostali tipovi" predictions={others} myVisitorId={identity.id} />
    </div>
  );
}

// Cute grid of everyone's guesses, each shown as the baby they imagined
// (hair + eyes recolour the face, the trait sets the expression).
function PredictionGallery({
  title,
  predictions,
  myVisitorId,
}: {
  title: string;
  predictions: Prediction[];
  myVisitorId: string;
}) {
  if (predictions.length === 0) return null;

  const sorted = [...predictions].sort((a, b) => {
    if (a.visitor_id === myVisitorId) return -1;
    if (b.visitor_id === myVisitorId) return 1;
    return a.predictor_name.localeCompare(b.predictor_name, "sr");
  });

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-xl font-semibold text-plum">{title}</h3>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-3">
        {sorted.map((p) => {
          const hairDot = HAIR_COLORS.find((c) => c.value === p.hair_color);
          const eyeDot = EYE_COLORS.find((c) => c.value === p.eye_color);
          const traitDef = TRAITS.find((t) => t.value === p.temperament);
          const isMine = p.visitor_id === myVisitorId;
          return (
            <li
              key={p.visitor_id}
              className={cn(
                "flex flex-col items-center rounded-3xl border bg-card p-4 shadow-sm",
                isMine ? "border-primary/50 ring-1 ring-primary/20" : "border-border",
              )}
            >
              <div className="rounded-full bg-secondary/40 p-1 ring-1 ring-gold/25">
                <span className="block size-20 overflow-hidden rounded-full">
                  <BabyFace
                    hairColorHex={hairHex(p.hair_color)}
                    eyeColorHex={eyeHex(p.eye_color)}
                    expression={p.temperament ?? ""}
                    size={80}
                  />
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1.5">
                <Avatar config={decodeAvatar(p.predictor_avatar)} name={p.predictor_name} size={22} />
                <p className="font-heading text-base font-semibold text-plum">
                  {p.predictor_name}
                  {isMine && <span className="ml-1 text-sm font-normal text-muted-foreground">(ti)</span>}
                </p>
              </div>

              <dl className="mt-2 grid w-full grid-cols-2 gap-x-3 gap-y-1.5">
                <Field label="Datum" value={formatDate(p.birth_date)} />
                <Field label="Vreme" value={p.birth_time ? formatTime(p.birth_time) : "—"} />
                <Field label="Težina" value={p.weight_grams ? `${p.weight_grams} g` : "—"} />
                <Field label="Dužina" value={p.length_cm ? `${p.length_cm} cm` : "—"} />
                <FieldDot label="Kosa" hex={hairDot?.hex} text={hairDot?.label ?? "—"} />
                <FieldDot label="Oči" hex={eyeDot?.hex} text={eyeDot?.label ?? "—"} />
                <Field label="Osobina" value={traitDef ? `${traitDef.emoji} ${traitDef.label}` : "—"} />
                <Field label="Liči" value={resemblesLabel(p.resembles)} />
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.8rem] text-muted-foreground">{label}</dt>
      <dd className="font-medium text-plum">{value}</dd>
    </div>
  );
}

function FieldDot({ label, hex, text }: { label: string; hex?: string; text: string }) {
  return (
    <div>
      <dt className="text-[0.8rem] text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1.5 font-medium text-plum">
        {hex && <span className="size-3 shrink-0 rounded-full ring-1 ring-black/10" style={{ backgroundColor: `#${hex}` }} />}
        {text}
      </dd>
    </div>
  );
}
