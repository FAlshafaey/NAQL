import { Check } from "lucide-react";
import type { JourneyStage, StageStatus } from "@/lib/journey-metrics";
import { cn } from "@/lib/utils";

interface StageIndicatorProps {
  stages: { stage: JourneyStage; status: StageStatus }[];
}

export function StageIndicator({ stages }: StageIndicatorProps) {
  return (
    <div className="relative">
      <div className="absolute top-4 hidden h-px bg-border sm:block sm:inset-x-8" aria-hidden="true" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-4 sm:gap-x-2 sm:gap-y-0">
        {stages.map(({ stage, status }) => (
          <div key={stage} className="flex flex-col items-center gap-2.5 text-center">
            <span
              className={cn(
                "relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-surface transition-colors",
                status === "done" && "border-primary bg-primary text-white",
                status === "current" && "border-primary text-primary",
                status === "upcoming" && "border-border-strong text-ink-faint"
              )}
            >
              {status === "done" ? (
                <Check className="size-4" strokeWidth={3} />
              ) : status === "current" ? (
                <span className="size-2.5 rounded-full bg-primary" />
              ) : (
                <span className="size-2 rounded-full bg-border-strong" />
              )}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                status === "current" ? "text-ink" : status === "done" ? "text-ink" : "text-ink-faint"
              )}
            >
              {stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
