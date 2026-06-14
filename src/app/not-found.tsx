import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <span className="text-5xl">🍼</span>
      <h1 className="mt-4 font-heading text-2xl font-semibold text-plum">Ova stranica ne postoji</h1>
      <p className="mt-2 text-sm text-muted-foreground">Možda je beba sakrila? 😊</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Nazad na početnu
      </Link>
    </main>
  );
}
