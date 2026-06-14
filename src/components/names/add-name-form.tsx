"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { celebrate } from "@/lib/celebrate";

export function AddNameForm({
  onAdd,
}: {
  onAdd: (name: string, note: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onAdd(name, note);
      setName("");
      setNote("");
      setOpen(false);
      celebrate();
      toast.success("Predlog je dodat — hvala! 🎀");
    } catch {
      toast.error("Nije uspelo, pokušaj ponovo za koji tren.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="cta-xl" className="w-full">
        <Plus className="size-5" />
        Predloži ime
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rise-in space-y-4 rounded-3xl border border-border bg-card p-6 shadow-cute"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[1rem]">
          Ime
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="npr. Mila"
          maxLength={40}
          autoFocus
          className="h-14 rounded-2xl text-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="note" className="text-[1rem]">
          Značenje (opciono)
        </Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Kratko značenje ili komentar…"
          maxLength={160}
          rows={2}
          className="rounded-2xl text-lg"
        />
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="ghost" size="cta" onClick={() => setOpen(false)} disabled={saving}>
          Otkaži
        </Button>
        <Button type="submit" size="cta" className="flex-1" disabled={saving || !name.trim()}>
          {saving ? "Čuvam…" : "Dodaj"}
        </Button>
      </div>
    </form>
  );
}
