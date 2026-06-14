import confetti from "canvas-confetti";

const WARM_COLORS = ["#EFA8A0", "#9DB89C", "#D9A441", "#F6E7DF", "#3D2B36"];

// A soft confetti burst — used on successful like / prediction / wish.
export function celebrate(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  confetti({
    particleCount: 70,
    spread: 70,
    startVelocity: 32,
    gravity: 0.9,
    scalar: 0.9,
    origin: { y: 0.7 },
    colors: WARM_COLORS,
    disableForReducedMotion: true,
  });
}

// One or more floating emojis drifting up from a clicked element. Used for the
// like button (💖) and the wish form (🌸).
export function popEmoji(anchor: HTMLElement | null, emoji = "💖", count = 1): void {
  if (typeof window === "undefined" || !anchor) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const rect = anchor.getBoundingClientRect();
  const baseLeft = rect.left + rect.width / 2;
  const baseTop = rect.top + window.scrollY;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "heart-pop";
    el.textContent = emoji;
    el.style.position = "absolute";
    // Small random spread + stagger so multiples feel organic, not stamped.
    el.style.left = `${baseLeft + (Math.random() - 0.5) * 40}px`;
    el.style.top = `${baseTop}px`;
    el.style.animationDelay = `${i * 80}ms`;
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 1100 + i * 80);
  }
}

// Back-compat single-heart helper.
export function popHeart(anchor: HTMLElement | null, emoji = "💖"): void {
  popEmoji(anchor, emoji, 1);
}
