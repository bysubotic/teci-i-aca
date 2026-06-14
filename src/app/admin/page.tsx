"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfigSection } from "@/components/admin/config-section";
import { ShortlistSection } from "@/components/admin/shortlist-section";
import { LettersSection } from "@/components/admin/letters-section";
import { BabyActualSection } from "@/components/admin/baby-actual-section";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.ok))
      .catch(() => setAuthed(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthed(false);
  }, []);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-16 sm:max-w-2xl">
      <header className="flex items-center justify-between pt-6 pb-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[0.95rem] text-muted-foreground hover:text-plum"
        >
          <ArrowLeft className="size-5" />
          Nazad
        </Link>
        {authed && (
          <Button variant="ghost" size="sm" className="h-10" onClick={logout}>
            <LogOut className="size-4" />
            Odjava
          </Button>
        )}
      </header>

      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent/25 text-3xl">
          👩‍🍼
        </span>
        <h1 className="font-heading text-[2rem] font-semibold text-plum">Kutak za roditelje</h1>
        <p className="mt-1 text-muted-foreground">Samo za mamu i tatu 💛</p>
      </div>

      {authed === null ? (
        <p className="text-center text-muted-foreground">Učitavam…</p>
      ) : authed ? (
        <div className="space-y-5">
          <ConfigSection />
          <ShortlistSection />
          <LettersSection />
          <BabyActualSection />
        </div>
      ) : (
        <AdminLogin onSuccess={() => setAuthed(true)} />
      )}
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Pogrešna admin šifra.");
        return;
      }
      onSuccess();
    } catch {
      setError("Nema veze sa serverom.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-sm space-y-5 rounded-3xl border border-border bg-card p-6 shadow-cute"
    >
      <div className="space-y-2">
        <Label htmlFor="admin-code" className="text-[1rem]">
          Admin šifra
        </Label>
        <Input
          id="admin-code"
          type="password"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="••••••••"
          className="h-14 rounded-2xl text-lg"
        />
      </div>
      {error && <p className="text-[1rem] font-medium text-destructive">{error}</p>}
      <Button type="submit" size="cta-xl" className="w-full" disabled={loading}>
        <ShieldCheck className="size-5" />
        {loading ? "Proveravam…" : "Uđi"}
      </Button>
    </form>
  );
}
