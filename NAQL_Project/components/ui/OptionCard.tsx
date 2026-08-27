"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function OptionCard({ selected, onClick, title, description, icon, className }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-start gap-1.5 rounded-xl border px-4 py-3.5 text-start transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected
          ? "border-primary bg-primary-light/60 ring-1 ring-primary"
          : "border-border bg-surface hover:border-border-strong",
        className || ""
      )}
    >
      {selected ? (
        <span className="absolute end-3 top-3 flex size-4 items-center justify-center rounded-full bg-primary text-white">
          <Check className="size-3" strokeWidth={3} />
        </span>
      ) : null}
      {icon}
      <span className="text-sm font-medium text-ink">{title}</span>
      {description ? <span className="text-xs leading-relaxed text-ink-muted">{description}</span> : null}
    </button>
  );
}
