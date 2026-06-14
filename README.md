# Čeka se devojčica 🎀

Topao porodični kutak za bebu na putu — glasanje za ime, tipovanje (baby pool) i
zid želja. Privatna aplikacija zaštićena zajedničkom porodičnom šifrom, bez pravih
naloga. Sav tekst je na srpskom (latinica).

> Family baby-hub app. Friends & family suggest and vote on names, place fun
> predictions, and leave wishes. UI copy is Serbian; code is English.

## Šta sve ima

- **Svoj lik** — pri ulasku svako napravi svog DiceBear avatara (stil + „promešaj" +
  boja pozadine). Lik se vidi svuda: u zaglavlju, uz predloge imena, tipove, želje i
  na scoreboard-u.
- **Imena** — predloži ime + značenje, lajkuj (jedan lajk po osobi po imenu),
  živa rang lista (Supabase Realtime), filter „prikaži samo moje”. Roditelji drže
  tajni uži izbor; kad uključe **„Veliko otkrivanje”**, imena sa njihove liste
  dobijaju 👑 i vidi se koliko se top 5 porodice poklopilo.
- **Tipovanje** — svako ostavlja jedan tip (datum, vreme, težina, dužina, boja
  kose, na koga liči). Zaključava se automatski na termin ili ručno iz admina.
  Posle zaključavanja svi tipovi postaju vidljivi + **scoreboard** sa bodovima.
- **Želje** — topao zid poruka; opcioni režim **vremenske kapsule** (sakrij sve
  želje do datuma koji roditelji izaberu).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Supabase (Postgres + Realtime +
RLS) · Tailwind CSS v4 · shadcn/ui · Vercel.

> Spec je tražio Next.js 15; `create-next-app@latest` danas instalira Next 16
> (isti App Router + React 19, sve kompatibilno).

## Pokretanje

### 1. Supabase

1. Napravi projekat na [supabase.com](https://supabase.com).
2. U **SQL Editor** nalepi i pokreni ceo [`supabase/schema.sql`](supabase/schema.sql).
   Time se prave tabele, RLS politike, realtime i seed redovi. Skripta je
   idempotentna — možeš je ponovo pokrenuti (npr. dodaje avatar kolone na
   postojeću bazu) bez gubitka podataka.
3. U **Project Settings → API** pokupi: `Project URL`, `anon public` ključ i
   `service_role` ključ (tajni).

### 2. Env varijable

Kopiraj `.env.local.example` u `.env.local` i popuni:

| Varijabla | Gde se koristi | Tajna? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | klijent + server | ne (javno) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | klijent (čitanje/upis po RLS) | ne (javno) |
| `SUPABASE_SERVICE_ROLE_KEY` | samo server: admin upisi + `/api/reveal` | **da** |
| `FAMILY_CODE` | porodična šifra (gate), validira se na serveru | **da** |
| `ADMIN_CODE` | šifra za `/admin`, validira se na serveru | **da** |

> **O `SUPABASE_SERVICE_ROLE_KEY`:** spec je naveo samo anon ključ, ali sam dodao
> service-role ključ da bi tajni uži izbor roditelja zaista ostao tajan (tabela
> `parents_shortlist` je zatvorena za anon — čita je jedino server preko
> `/api/reveal` kad je „Veliko otkrivanje” uključeno) i da bi admin upisi išli
> mimo RLS-a. Drži ga samo na serveru; nikad ga ne prefiksuj sa `NEXT_PUBLIC_`.

### 3. Instalacija i dev

```bash
pnpm install
pnpm dev
```

Otvori http://localhost:3000, unesi `FAMILY_CODE` i svoje ime.

## Kako roditelji koriste `/admin`

Otvori `/admin`, unesi `ADMIN_CODE`. Tu možeš da:

- postaviš **termin** (na taj datum se tipovanje auto-zaključava),
- ručno **zaključaš tipovanje**,
- uključiš **„Veliko otkrivanje imena”** (👑 + poklapanje sa top 5),
- vodiš **tajni uži izbor**,
- postaviš **vremensku kapsulu** za želje,
- uneseš **stvarne podatke o bebi** (tada se računa scoreboard).

## Bodovanje (scoreboard)

| Kategorija | Bodovi |
|---|---|
| Datum | tačno 50 · ±1 35 · ±2 25 · ±3 15 · ±5 5 |
| Težina | ≤50 g 30 · ≤150 g 20 · ≤300 g 10 |
| Dužina | ≤1 cm 20 · ≤2 cm 12 · ≤4 cm 5 |
| Boja kose | tačno 10 |
| Na koga liči | tačno 10 |
| Vreme (ako uneto) | ≤30 min 15 · ≤60 min 8 · ≤120 min 3 |

Maks ≈ 135 poena. Nerešeno se razrešava najbližim datumom rođenja. Računa se na
klijentu iz `baby_actual` (vidi [`src/lib/scoring.ts`](src/lib/scoring.ts)).

## Deploy na Vercel

1. Push na GitHub i import projekta na Vercel.
2. U **Settings → Environment Variables** dodaj svih 5 varijabli iz tabele gore
   (`SUPABASE_SERVICE_ROLE_KEY`, `FAMILY_CODE`, `ADMIN_CODE` bez `NEXT_PUBLIC_`).
3. Deploy. (Build: `next build`, ništa dodatno nije potrebno.)

## Bezbednosne napomene

- Ovo je **privatna, low-stakes** aplikacija bez naloga. Anon ključ je javan po
  dizajnu; RLS politike su namerno permisivne za porodične tabele.
- Porodična šifra je „meka” barijera (UX gate) — kod se validira na serveru pa se
  ne šalje klijentu, ali pristup podacima ide preko javnog anon ključa.
- Pravi bezbednosni sloj je `ADMIN_CODE` (server-side) + `service_role` ključ:
  admin upisi i tajni uži izbor ne mogu se dirati anon ključem.
- Ne čuvaj nikakve osetljive podatke.
