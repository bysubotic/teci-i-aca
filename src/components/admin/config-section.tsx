"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentToggle } from "@/components/ui/segment-toggle";
import { useConfig } from "@/hooks/use-config";
import { arePredictionsLocked } from "@/lib/format";
import type { Config } from "@/lib/types";
import { AdminCard } from "./admin-card";

type ConfigPatch = Partial<Omit<Config, "id">>;

export function ConfigSection() {
  const { config, refresh } = useConfig();
  const [busy, setBusy] = useState(false);

  async function update(patch: ConfigPatch) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error);
      await refresh();
      toast.success("Sačuvano 💛");
    } catch {
      toast.error("Nije sačuvano, pokušaj ponovo.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const autoLocked = !!config && !config.predictions_locked && arePredictionsLocked(config);

  return (
    <AdminCard
      title="Podešavanja"
      description="Termin, zaključavanje i otkrivanje."
      icon={<CalendarDays className="size-6 text-primary" />}
    >
      <div className="space-y-6">
        <Field label="Termin" hint="Na ovaj datum se tipovanje automatski zaključava.">
          <Input
            type="date"
            disabled={busy}
            value={config?.due_date ?? ""}
            onChange={(e) => update({ due_date: e.target.value || null })}
            className="h-14 rounded-2xl text-lg"
          />
        </Field>

        <Field
          label="Tipovanje"
          hint={autoLocked ? "Već je zaključano jer je termin stigao." : "Kad zaključaš, svi tipovi postaju vidljivi."}
        >
          <SegmentToggle
            idBase="lock"
            value={config?.predictions_locked ? "on" : "off"}
            onChange={(v) => update({ predictions_locked: v === "on" })}
            options={[
              { value: "off", label: "Otključano" },
              { value: "on", label: "Zaključano 🔒" },
            ]}
          />
        </Field>

        <Field
          label="Veliko otkrivanje imena"
          hint="Kad uključiš: 👑 na imenima sa vaše tajne liste + poklapanje sa top 5."
        >
          <SegmentToggle
            idBase="reveal"
            value={config?.reveal_shortlist ? "on" : "off"}
            onChange={(v) => update({ reveal_shortlist: v === "on" })}
            options={[
              { value: "off", label: "Sakriveno" },
              { value: "on", label: "Otkriveno 👑" },
            ]}
          />
        </Field>

        <Field
          label="Vremenska kapsula za želje"
          hint="Sakrij sve želje do ovog datuma. Ostavi prazno da ih svi vide odmah."
        >
          <Input
            type="date"
            disabled={busy}
            value={config?.capsule_unlock_date ?? ""}
            onChange={(e) => update({ capsule_unlock_date: e.target.value || null })}
            className="h-14 rounded-2xl text-lg"
          />
        </Field>
      </div>
    </AdminCard>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[1rem]">{label}</Label>
      {children}
      <p className="text-[0.9rem] text-muted-foreground">{hint}</p>
    </div>
  );
}
