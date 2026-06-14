import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { hasValidAdminCookie } from "@/lib/auth";
import { getServiceClientSafe } from "@/lib/supabase/server";
import { PARENTS } from "@/lib/constants";
import { formatDate, pluralSr } from "@/lib/format";
import { decodeAvatar } from "@/lib/avatar";
import { Avatar } from "@/components/avatar";
import { PrintButton } from "@/components/letters/print-button";
import type { Letter } from "@/lib/types";

export default async function LettersPrintPage() {
  if (!(await hasValidAdminCookie())) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl">🔒</span>
        <p className="text-lg text-plum">Ova stranica je samo za mamu i tatu.</p>
        <Link href="/admin" className="font-semibold text-primary underline underline-offset-2">
          Idi na prijavu
        </Link>
      </main>
    );
  }

  const supabase = getServiceClientSafe();
  let letters: Letter[] = [];
  if (supabase) {
    const { data } = await supabase.from("letters").select("*").order("created_at", { ascending: true });
    letters = (data ?? []) as Letter[];
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <div className="no-print mb-8 flex items-center justify-between gap-3">
        <Link href="/admin" className="flex items-center gap-1.5 text-[0.95rem] text-muted-foreground hover:text-plum">
          <ArrowLeft className="size-5" />
          Nazad
        </Link>
        <PrintButton />
      </div>

      <header className="mb-10 text-center">
        <div className="text-5xl">🎀</div>
        <h1 className="mt-2 font-heading text-[2.4rem] font-semibold leading-tight text-plum">
          Pisma za našu devojčicu
        </h1>
        <p className="mt-1 font-heading text-lg text-plum/80">
          {PARENTS.mom} &amp; {PARENTS.dad}
        </p>
        <p className="mt-2 text-muted-foreground">
          {letters.length} {pluralSr(letters.length, ["pismo", "pisma", "pisama"])} s ljubavlju 🤍
        </p>
      </header>

      {letters.length === 0 ? (
        <p className="text-center text-muted-foreground">Još nema pisama.</p>
      ) : (
        <div className="space-y-6">
          {letters.map((l) => (
            <article
              key={l.id}
              className="letter-page rounded-3xl border border-border bg-card p-6 shadow-cute"
            >
              <p className="whitespace-pre-wrap text-lg leading-relaxed text-plum">{l.message}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border/70 pt-4">
                <Avatar config={decodeAvatar(l.author_avatar)} name={l.author_name} size={40} />
                <div>
                  <p className="font-heading font-semibold text-plum">{l.author_name}</p>
                  <p className="text-[0.9rem] text-muted-foreground">{formatDate(l.created_at.slice(0, 10))}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
