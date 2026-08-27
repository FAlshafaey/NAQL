import { cn } from "@/lib/utils";

type Tone = "primary" | "teal" | "success" | "warning" | "danger" | "gold";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary",
  teal: "bg-teal",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  gold: "bg-gold",
};

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: Tone;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

export function ProgressBar({ value, max = 100, tone = "primary", size = "md", label, className }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("w-full overflow-hidden rounded-full bg-surface-muted", size === "sm" ? "h-1.5" : "h-2.5", className || "")}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500 ease-out", TONE_CLASSES[tone])}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
