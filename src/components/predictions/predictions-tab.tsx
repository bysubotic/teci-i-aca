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
import { traitLabel } from "@/lib/options";
import { Avatar } from "@/components/avatar";
import type { Identity } from "@/lib/identity";
import type { Config, Prediction, Resembles } from "@/lib/types";
import { usePredictions } from "@/hooks/use-predictions";
import { PredictionForm } from "./prediction-form";
import { PredictionCard, type DraftPrediction } from "./prediction-card";
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

  if (locked) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-muted/50 p-5">
          <Lock className="size-6 shrink-0 text-muted-foreground" />
          <p className="font-semibold text-plum">Tipovanje je zaključano 🔒</p>
        </div>
        <AllPredictions predictions={all} myVisitorId={identity.id} />
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
    </div>
  );
}

function AllPredictions({ predictions, myVisitorId }: { predictions: Prediction[]; myVisitorId: string }) {
  if (predictions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center text-muted-foreground">
        Niko nije tipovao na vreme. 🤷
      </div>
    );
  }

  const sorted = [...predictions].sort((a, b) => a.predictor_name.localeCompare(b.predictor_name, "sr"));

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-xl font-semibold text-plum">Svi tipovi</h3>
      <ul className="space-y-3">
        {sorted.map((p) => (
          <li
            key={p.visitor_id}
            className={cn(
              "rounded-3xl border bg-card p-5 shadow-sm",
              p.visitor_id === myVisitorId ? "border-primary/50 ring-1 ring-primary/20" : "border-border",
            )}
          >
            <div className="flex items-center gap-2.5">
              <Avatar config={decodeAvatar(p.predictor_avatar)} name={p.predictor_name} size={32} />
              <p className="font-heading text-lg font-semibold text-plum">
                {p.predictor_name}
                {p.visitor_id === myVisitorId && (
                  <span className="ml-2 text-[0.95rem] font-normal text-muted-foreground">(ti)</span>
                )}
              </p>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              <Field label="Datum" value={formatDate(p.birth_date)} />
              <Field label="Vreme" value={p.birth_time ? formatTime(p.birth_time) : "—"} />
              <Field label="Težina" value={p.weight_grams ? `${p.weight_grams} g` : "—"} />
              <Field label="Dužina" value={p.length_cm ? `${p.length_cm} cm` : "—"} />
              <Field label="Kosa" value={p.hair_color ?? "—"} />
              <Field label="Oči" value={p.eye_color ?? "—"} />
              <Field label="Osobina" value={traitLabel(p.temperament)} />
              <Field label="Liči" value={resemblesLabel(p.resembles)} />
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.9rem] text-muted-foreground">{label}</dt>
      <dd className="font-medium text-plum">{value}</dd>
    </div>
  );
}
