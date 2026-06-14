"use client";

// A hand-drawn, genuinely cute baby girl — chubby face, big eyes, rosy cheeks,
// a little pink bow, and a hair tuft that takes the guessed hair colour.
// Purely cosmetic (lives on the live prediction card).
function Eyes({ iris, expression }: { iris: string; expression?: string }) {
  // Sleepy → closed lids (eye colour naturally not visible while dozing).
  if (expression === "pospana") {
    return (
      <>
        <path d="M34 56 q6 4.5 12 0" stroke="#3a2b30" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M54 56 q6 4.5 12 0" stroke="#3a2b30" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </>
    );
  }
  const r = expression === "radoznala" ? 6 : 5; // curious → wide eyes
  return (
    <>
      <circle cx="40" cy="56" r={r} fill={iris} />
      <circle cx="60" cy="56" r={r} fill={iris} />
      <circle cx="40" cy="56" r="2.4" fill="#2a2030" />
      <circle cx="60" cy="56" r="2.4" fill="#2a2030" />
      <circle cx="41.8" cy="54" r="1.6" fill="#fff" />
      <circle cx="61.8" cy="54" r="1.6" fill="#fff" />
    </>
  );
}

function Mouth({ expression }: { expression?: string }) {
  const c = "#c5685d";
  switch (expression) {
    case "mirna":
      return <path d="M46 66 q4 3 8 0" stroke={c} strokeWidth="2.2" fill="none" strokeLinecap="round" />;
    case "radoznala":
      return <ellipse cx="50" cy="67" rx="2.6" ry="3.2" fill={c} />;
    case "nestasna":
      return (
        <>
          <path d="M44 65 q7 5.5 13 -1" stroke={c} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M52 68 q2.5 2 4 0" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case "pospana":
      return <path d="M47 67 q3 2 6 0" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />;
    case "brbljiva":
      return (
        <>
          <ellipse cx="50" cy="67" rx="4" ry="3.2" fill={c} />
          <ellipse cx="50" cy="68.5" rx="2" ry="1.3" fill="#e58a90" />
        </>
      );
    default: // nasmejana
      return <path d="M43 66 q7 6.5 14 0" stroke={c} strokeWidth="2.4" fill="none" strokeLinecap="round" />;
  }
}

export function BabyFace({
  hairColorHex,
  eyeColorHex,
  expression,
  size = 128,
  className,
}: {
  hairColorHex?: string;
  eyeColorHex?: string;
  expression?: string;
  size?: number;
  className?: string;
}) {
  const hair = hairColorHex ? `#${hairColorHex}` : "#ead9be";
  const iris = eyeColorHex ? `#${eyeColorHex}` : "#5a4636";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Beba devojčica"
    >
      <circle cx="50" cy="50" r="50" fill="#fcebe1" />

      {/* ears */}
      <circle cx="21" cy="57" r="7" fill="#f6cdaf" />
      <circle cx="79" cy="57" r="7" fill="#f6cdaf" />
      <circle cx="21" cy="57" r="3" fill="#eab89a" />
      <circle cx="79" cy="57" r="3" fill="#eab89a" />

      {/* head */}
      <ellipse cx="50" cy="55" rx="29" ry="28" fill="#f9d6bd" />

      {/* hair: soft fringe cap + a little cowlick curl */}
      <path
        d="M22 54 Q23 27 50 26 Q77 27 78 54 Q72 45 65 50 Q58 42 50 49 Q42 42 35 50 Q28 45 22 54 Z"
        fill={hair}
      />
      <path d="M50 26 q-4 -9 3 -12 q-1.5 5 2.5 6.5 q-3.5 2 -5.5 5.5 Z" fill={hair} />

      {/* bow (top-left) */}
      <g transform="translate(30 27) rotate(-18)">
        <path d="M0 0 L-11 -6 Q-13 0 -11 6 Z" fill="#efa8a0" />
        <path d="M0 0 L11 -6 Q13 0 11 6 Z" fill="#efa8a0" />
        <circle cx="0" cy="0" r="3.4" fill="#e2867f" />
      </g>

      {/* cheeks */}
      <circle cx="33" cy="62" r="6" fill="#f3a39c" opacity="0.5" />
      <circle cx="67" cy="62" r="6" fill="#f3a39c" opacity="0.5" />

      {/* eyes + mouth change with the guessed personality */}
      <Eyes iris={iris} expression={expression} />

      {/* nose */}
      <path d="M48.5 61.5 q1.5 1.6 3 0" stroke="#e0a98f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Mouth expression={expression} />

      {/* sleepy zzz */}
      {expression === "pospana" && (
        <text x="72" y="40" fontSize="11" fill="#9a8" fontWeight="700">
          z
        </text>
      )}
    </svg>
  );
}
