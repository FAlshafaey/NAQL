import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "teal" | "gold" | "success" | "info";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary-light text-primary-dark",
  teal: "bg-teal-light text-teal",
  gold: "bg-gold-light text-gold",
  success: "bg-success-light text-success",
  info: "bg-info-light text-info",
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}

export function StatCard({ icon: Icon, label, value, hint, tone = "primary" }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card">
      <span className={cn("flex size-10 items-center justify-center rounded-xl", TONE_CLASSES[tone])}>
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-display text-2xl font-bold text-ink">{value}</p>
        <p className="mt-0.5 text-sm text-ink-muted">{label}</p>
      </div>
      {hint ? <p className="text-xs text-ink-faint">{hint}</p> : null}
    </div>
  );
}
