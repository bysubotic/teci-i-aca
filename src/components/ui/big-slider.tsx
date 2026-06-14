"use client";

import { Minus, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// A value picker that never *requires* dragging — big −/+ buttons (56px) and
// preset bubbles, with the slider as an optional fine control. Big number on top.
export function BigSlider({
  value,
  displayValue,
  onChange,
  min,
  max,
  step,
  bigStep,
  legendLeft,
  legendRight,
  presets,
}: {
  value: number;
  displayValue: string;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  bigStep: number;
  legendLeft: string;
  legendRight: string;
  presets?: { label: string; value: number }[];
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Manje"
          onClick={() => onChange(clamp(value - bigStep))}
          className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-plum transition-transform active:scale-90"
        >
          <Minus className="size-6" strokeWidth={2.5} />
        </button>
        <div className="min-w-[150px] text-center font-heading text-3xl font-bold tabular-nums text-plum">
          {displayValue}
        </div>
        <button
          type="button"
          aria-label="Više"
          onClick={() => onChange(clamp(value + bigStep))}
          className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-plum transition-transform active:scale-90"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-1">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : (v as number))}
        />
        <div className="mt-1.5 flex justify-between text-[0.9rem] text-muted-foreground">
          <span>{legendLeft}</span>
          <span>{legendRight}</span>
        </div>
      </div>

      {presets && (
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange(p.value)}
              className={cn(
                "h-12 rounded-full border-2 px-2 text-[0.9rem] font-semibold transition-colors",
                value === p.value
                  ? "border-plum bg-primary/10 text-plum"
                  : "border-border bg-card text-foreground/70 hover:border-primary/50",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
