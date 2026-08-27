"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  id?: string;
}

export function NumberStepper({ value, onChange, min = 1, max = 20, label, id }: NumberStepperProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`إنقاص ${label}`}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg border border-border text-ink transition-colors hover:bg-surface-muted disabled:opacity-40"
          )}
        >
          <Minus className="size-3.5" />
        </button>
        <span id={id} className="w-6 text-center text-sm font-semibold tabular-nums text-ink">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`زيادة ${label}`}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg border border-border text-ink transition-colors hover:bg-surface-muted disabled:opacity-40"
          )}
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
