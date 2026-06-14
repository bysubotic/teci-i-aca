"use client";

import { useCallback, useEffect, useState } from "react";
import { Crown, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminCard } from "./admin-card";

interface ShortlistEntry {
  id: string;
  name: string;
}

export function ShortlistSection() {
  const [entries, setEntries] = useState<ShortlistEntry[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/shortlist");
      const data = await res.json();
      if (data.ok) setEntries(data.shortlist as ShortlistEntry[]);
    } catch {
      // network/preview issue — leave the list empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error);
      setName("");
      await load();
    } catch {
      toast.error("Nije dodato.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/shortlist?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error);
      await load();
    } catch {
      toast.error("Nije obrisano.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminCard
      title="Tajni uži izbor roditelja"
      description="Niko od porodice ovo ne vidi dok ne uključiš „Veliko otkrivanje”."
      icon={<Crown className="size-6 text-gold" />}
    >
      <form onSubmit={add} className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dodaj ime…"
          maxLength={40}
          disabled={busy}
          className="h-14 rounded-2xl text-lg"
        />
        <Button type="submit" size="cta" disabled={busy || !name.trim()}>
          <Plus className="size-5" />
          Dodaj
        </Button>
      </form>

      {loading ? (
        <p className="mt-4 text-muted-foreground">Učitavam…</p>
      ) : entries.length === 0 ? (
        <p className="mt-4 text-muted-foreground">Lista je još prazna.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/5 py-3 pl-4 pr-2.5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Crown className="size-5" />
              </span>
              <span className="w-6 shrink-0 text-center font-semibold tabular-nums text-muted-foreground">
                {i + 1}.
              </span>
              <span className="flex-1 text-[1.1rem] font-semibold text-plum">{entry.name}</span>
              <button
                type="button"
                onClick={() => remove(entry.id)}
                disabled={busy}
                aria-label={`Ukloni ${entry.name}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  );
}
