"use client";

import type { AnimalId } from "@/lib/avatar";

// Hand-drawn, consistently cute animal faces. Same warm style as the baby:
// round face, big eyes, rosy cheeks. Each visitor's character = animal + bg.

function Eyes() {
  return (
    <>
      <circle cx="40" cy="54" r="5" fill="#3d2b36" />
      <circle cx="60" cy="54" r="5" fill="#3d2b36" />
      <circle cx="41.7" cy="52.2" r="1.7" fill="#fff" />
      <circle cx="61.7" cy="52.2" r="1.7" fill="#fff" />
    </>
  );
}

function Cheeks({ y = 63 }: { y?: number }) {
  return (
    <>
      <circle cx="32" cy={y} r="5.5" fill="#f3a39c" opacity="0.45" />
      <circle cx="68" cy={y} r="5.5" fill="#f3a39c" opacity="0.45" />
    </>
  );
}

function Smile() {
  return (
    <path d="M44 67 q6 5 12 0" stroke="#c5685d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
  );
}

function Glasses() {
  return (
    <g fill="none" stroke="#6b5b63" strokeWidth="1.6">
      <circle cx="40" cy="54" r="7.5" />
      <circle cx="60" cy="54" r="7.5" />
      <path d="M47.5 54 h5" />
      <path d="M32.5 53 l-7 -2" />
      <path d="M67.5 53 l7 -2" />
    </g>
  );
}

const SKIN = "#f8d6bd";

// Composable cute adult face — hair colour + style + features. Used for the
// extended family (tetka, ujak, stric…) so they stay consistent and on-style.
function Adult({
  hair,
  style,
  beard,
  mustache,
  glasses,
  earrings,
}: {
  hair: string;
  style: "short" | "long" | "bun" | "balding";
  beard?: boolean;
  mustache?: boolean;
  glasses?: boolean;
  earrings?: boolean;
}) {
  const headR = style === "long" ? 26 : 28;
  return (
    <>
      {style === "long" && (
        <path
          d="M50 22 C28 22 18 40 20 60 C21 74 26 80 30 82 C26 66 30 52 50 52 C70 52 74 66 70 82 C74 80 79 74 80 60 C82 40 72 22 50 22 Z"
          fill={hair}
        />
      )}
      <circle cx="50" cy="56" r={headR} fill={SKIN} />
      {beard && <path d="M26 56 Q28 84 50 85 Q72 84 74 56 Q66 72 50 72 Q34 72 26 56 Z" fill={hair} />}
      {style === "short" && (
        <path d="M23 50 Q25 27 50 26 Q75 27 77 50 Q68 41 50 42 Q32 41 23 50 Z" fill={hair} />
      )}
      {style === "long" && (
        <path d="M25 47 Q27 28 50 27 Q73 28 75 47 Q64 41 50 43 Q36 41 25 47 Z" fill={hair} />
      )}
      {style === "bun" && (
        <>
          <path d="M22 50 Q24 26 50 25 Q76 26 78 50 Q70 44 50 45 Q30 44 22 50 Z" fill={hair} />
          <circle cx="50" cy="24" r="6.5" fill={hair} />
        </>
      )}
      {style === "balding" && (
        <>
          <path d="M22 54 Q21 39 28 35 Q26 46 32 50 Q26 51 22 54 Z" fill={hair} />
          <path d="M78 54 Q79 39 72 35 Q74 46 68 50 Q74 51 78 54 Z" fill={hair} />
          <path d="M38 33 Q50 28 62 33 Q50 31 38 33 Z" fill={hair} />
        </>
      )}
      {earrings && (
        <>
          <circle cx="24" cy="63" r="1.8" fill="#d9a441" />
          <circle cx="76" cy="63" r="1.8" fill="#d9a441" />
        </>
      )}
      <Cheeks y={beard ? 58 : 63} />
      <Eyes />
      {glasses && <Glasses />}
      {mustache && <path d="M41 64 Q50 69 59 64 Q54 66 50 65 Q46 66 41 64 Z" fill={hair} />}
      {beard && <path d="M44 65 q6 4 12 0" stroke="#00000022" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {!mustache && !beard && <Smile />}
    </>
  );
}

const ART: Record<AnimalId, React.ReactNode> = {
  sestra: (
    <>
      <circle cx="20" cy="49" r="8.5" fill="#7a4a2a" />
      <circle cx="80" cy="49" r="8.5" fill="#7a4a2a" />
      <circle cx="50" cy="56" r="28" fill={SKIN} />
      <path
        d="M22 50 Q24 26 50 25 Q76 26 78 50 Q68 44 60 48 Q55 42 50 47 Q45 42 40 48 Q32 44 22 50 Z"
        fill="#7a4a2a"
      />
      <g transform="translate(20 41)">
        <path d="M0 0 L-6 -3.5 Q-7 0 -6 3.5 Z" fill="#efa8a0" />
        <path d="M0 0 L6 -3.5 Q7 0 6 3.5 Z" fill="#efa8a0" />
        <circle r="2" fill="#e2867f" />
      </g>
      <g transform="translate(80 41)">
        <path d="M0 0 L-6 -3.5 Q-7 0 -6 3.5 Z" fill="#efa8a0" />
        <path d="M0 0 L6 -3.5 Q7 0 6 3.5 Z" fill="#efa8a0" />
        <circle r="2" fill="#e2867f" />
      </g>
      <Cheeks />
      <Eyes />
      <Smile />
    </>
  ),
  brat: (
    <>
      <circle cx="50" cy="56" r="28" fill={SKIN} />
      <path
        d="M23 50 Q25 27 50 25 Q75 27 77 50 Q68 42 60 45 Q57 36 50 41 Q43 37 41 45 Q32 42 23 50 Z"
        fill="#6b4423"
      />
      <Cheeks />
      <Eyes />
      <Smile />
    </>
  ),
  mama: (
    <>
      <path
        d="M50 22 C28 22 18 40 20 60 C21 74 26 80 30 82 C26 66 30 52 50 52 C70 52 74 66 70 82 C74 80 79 74 80 60 C82 40 72 22 50 22 Z"
        fill="#7a4a2a"
      />
      <circle cx="50" cy="56" r="26" fill={SKIN} />
      <path d="M25 47 Q27 28 50 27 Q73 28 75 47 Q64 41 50 43 Q36 41 25 47 Z" fill="#7a4a2a" />
      <circle cx="24" cy="63" r="1.8" fill="#d9a441" />
      <circle cx="76" cy="63" r="1.8" fill="#d9a441" />
      <Cheeks />
      <Eyes />
      <Smile />
    </>
  ),
  tata: (
    <>
      <circle cx="50" cy="56" r="28" fill={SKIN} />
      <path d="M26 56 Q28 84 50 85 Q72 84 74 56 Q66 72 50 72 Q34 72 26 56 Z" fill="#4a3328" />
      <path d="M23 50 Q25 27 50 26 Q75 27 77 50 Q68 41 50 42 Q32 41 23 50 Z" fill="#4a3328" />
      <Cheeks y={57} />
      <Eyes />
      <path d="M44 65 q6 4 12 0" stroke="#6b4a36" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  baba: (
    <>
      <circle cx="50" cy="56" r="28" fill={SKIN} />
      <path d="M22 50 Q24 26 50 25 Q76 26 78 50 Q70 44 50 45 Q30 44 22 50 Z" fill="#cfc9d1" />
      <circle cx="50" cy="24" r="6.5" fill="#cfc9d1" />
      <Cheeks />
      <Eyes />
      <Glasses />
      <Smile />
    </>
  ),
  deka: (
    <>
      <circle cx="50" cy="56" r="28" fill={SKIN} />
      <path d="M22 54 Q21 39 28 35 Q26 46 32 50 Q26 51 22 54 Z" fill="#cfc9d1" />
      <path d="M78 54 Q79 39 72 35 Q74 46 68 50 Q74 51 78 54 Z" fill="#cfc9d1" />
      <path d="M38 33 Q50 28 62 33 Q50 31 38 33 Z" fill="#cfc9d1" />
      <Cheeks y={58} />
      <Eyes />
      <Glasses />
      <path d="M41 64 Q50 69 59 64 Q54 66 50 65 Q46 66 41 64 Z" fill="#cfc9d1" />
    </>
  ),
  tetka: <Adult style="long" hair="#9c5a3c" earrings />,
  teca: <Adult style="short" hair="#2c1b18" mustache />,
  ujak: <Adult style="short" hair="#6b4423" glasses />,
  ujna: <Adult style="bun" hair="#caa45c" earrings />,
  stric: <Adult style="short" hair="#3a2418" beard glasses />,
  strina: <Adult style="long" hair="#241a14" earrings />,
  kum: <Adult style="short" hair="#8a7a70" mustache />,
  kuma: <Adult style="bun" hair="#6b4423" earrings />,
  zeka: (
    <>
      <ellipse cx="40" cy="22" rx="6" ry="16" fill="#fdf3ea" transform="rotate(-13 40 22)" />
      <ellipse cx="60" cy="22" rx="6" ry="16" fill="#fdf3ea" transform="rotate(13 60 22)" />
      <ellipse cx="40" cy="23" rx="2.6" ry="10.5" fill="#f5c2ca" transform="rotate(-13 40 23)" />
      <ellipse cx="60" cy="23" rx="2.6" ry="10.5" fill="#f5c2ca" transform="rotate(13 60 23)" />
      <circle cx="50" cy="56" r="28" fill="#fdf3ea" />
      <Cheeks />
      <Eyes />
      <path d="M50 62 l-3.5 -3 h7 Z" fill="#e8909b" />
      <path
        d="M50 62 v3 M50 65 q-2.5 2 -4.5 1 M50 65 q2.5 2 4.5 1"
        stroke="#d98f97"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  meda: (
    <>
      <circle cx="29" cy="32" r="9" fill="#c79a6e" />
      <circle cx="71" cy="32" r="9" fill="#c79a6e" />
      <circle cx="29" cy="32" r="4.5" fill="#e7c8a6" />
      <circle cx="71" cy="32" r="4.5" fill="#e7c8a6" />
      <circle cx="50" cy="56" r="28" fill="#c79a6e" />
      <ellipse cx="50" cy="64" rx="13" ry="10" fill="#ecd4b8" />
      <Cheeks y={60} />
      <Eyes />
      <ellipse cx="50" cy="60" rx="4" ry="3" fill="#4a3326" />
      <path
        d="M50 63 v3 M50 66 q-3 2.5 -5 1 M50 66 q3 2.5 5 1"
        stroke="#7a5640"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  maca: (
    <>
      <path d="M30 38 L26 17 L45 30 Z" fill="#b4afba" />
      <path d="M70 38 L74 17 L55 30 Z" fill="#b4afba" />
      <path d="M31 34 L29 23 L41 30 Z" fill="#f3bfc6" />
      <path d="M69 34 L71 23 L59 30 Z" fill="#f3bfc6" />
      <circle cx="50" cy="56" r="28" fill="#b4afba" />
      <g stroke="#cfcad4" strokeWidth="1.2" strokeLinecap="round">
        <path d="M21 55 h11 M22 60 h10" />
        <path d="M79 55 h-11 M78 60 h-10" />
      </g>
      <Cheeks />
      <Eyes />
      <path d="M50 60 l-3 -2.5 h6 Z" fill="#e0808c" />
      <path
        d="M50 60 v2.5 M50 62.5 q-2.5 2 -4.5 1 M50 62.5 q2.5 2 4.5 1"
        stroke="#7c7782"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  lija: (
    <>
      <path d="M30 36 L24 15 L46 29 Z" fill="#e8915a" />
      <path d="M70 36 L76 15 L54 29 Z" fill="#e8915a" />
      <path d="M28 22 L24 15 L33 20 Z" fill="#3d2b36" />
      <path d="M72 22 L76 15 L67 20 Z" fill="#3d2b36" />
      <circle cx="50" cy="56" r="28" fill="#e8915a" />
      <path d="M50 80 C35 80 32 65 38 58 C43 53 57 53 62 58 C68 65 65 80 50 80 Z" fill="#fdf3ea" />
      <Cheeks y={61} />
      <Eyes />
      <ellipse cx="50" cy="63" rx="3.6" ry="2.8" fill="#3d2b36" />
      <path
        d="M50 66 v2.5 M50 68.5 q-2.5 2 -4.5 1 M50 68.5 q2.5 2 4.5 1"
        stroke="#b9806a"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  pile: (
    <>
      <path d="M44 29 L42 19 L48 27 Z M50 27 L50 16 L54 26 Z M56 29 L60 20 L56 28 Z" fill="#f3c84a" />
      <circle cx="50" cy="56" r="28" fill="#f8d75e" />
      <Cheeks y={62} />
      <Eyes />
      <path d="M50 57 l-5.5 4.5 l5.5 4.5 l5.5 -4.5 Z" fill="#f0a13c" />
      <path d="M44.5 61.5 h11" stroke="#d98a2c" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  panda: (
    <>
      <circle cx="28" cy="30" r="9" fill="#3d2b36" />
      <circle cx="72" cy="30" r="9" fill="#3d2b36" />
      <circle cx="50" cy="56" r="28" fill="#fdf3ea" />
      <ellipse cx="40" cy="54" rx="7" ry="9" fill="#3d2b36" transform="rotate(20 40 54)" />
      <ellipse cx="60" cy="54" rx="7" ry="9" fill="#3d2b36" transform="rotate(-20 60 54)" />
      <circle cx="41" cy="55" r="3.2" fill="#fff" />
      <circle cx="59" cy="55" r="3.2" fill="#fff" />
      <circle cx="41" cy="55" r="1.6" fill="#3d2b36" />
      <circle cx="59" cy="55" r="1.6" fill="#3d2b36" />
      <Cheeks y={64} />
      <ellipse cx="50" cy="63" rx="3.2" ry="2.4" fill="#3d2b36" />
      <path
        d="M50 65 v2.5 M50 67.5 q-2.5 2 -4.5 1 M50 67.5 q2.5 2 4.5 1"
        stroke="#3d2b36"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
};

export function AnimalFace({
  animal,
  bg,
  size = 96,
  className,
}: {
  animal: AnimalId;
  bg: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label={animal}>
      <circle cx="50" cy="50" r="50" fill={`#${bg}`} />
      {ART[animal] ?? ART.zeka}
    </svg>
  );
}
