"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { computeRoomProgress } from "@/lib/journey-metrics";
import { cn, formatArabicNumber } from "@/lib/utils";
import type { PackingRoom } from "@/types";

interface RoomCardProps {
  room: PackingRoom;
  icon: LucideIcon;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleItem: (itemId: string) => void;
}

export function RoomCard({ room, icon: Icon, expanded, onToggleExpand, onToggleItem }: RoomCardProps) {
  const progress = computeRoomProgress(room);
  const isComplete = progress.percentage === 100;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <button
        type="button"
        onClick={onToggleExpand}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 p-5 text-start transition-colors hover:bg-surface-muted/60"
      >
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            isComplete ? "bg-success-light text-success" : "bg-primary-light text-primary-dark"
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-base font-semibold text-ink">{room.name}</h3>
            <span className={cn("shrink-0 text-sm font-semibold", isComplete ? "text-success" : "text-ink")}>
              {progress.percentage}%
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">
            {formatArabicNumber(progress.completedItems)} من {formatArabicNumber(progress.totalItems)} عنصرًا جاهزًا
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className={cn("h-full rounded-full transition-[width] duration-500", isComplete ? "bg-success" : "bg-primary")}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        <ChevronDown className={cn("size-5 shrink-0 text-ink-faint transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded ? (
        <div className="grid grid-cols-1 gap-1.5 border-t border-border p-4 sm:grid-cols-2">
          {room.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleItem(item.id)}
              aria-pressed={item.completed}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-start transition-colors hover:bg-surface-muted"
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                  item.completed ? "border-primary bg-primary" : "border-border-strong bg-surface"
                )}
              >
                {item.completed ? <CheckMark /> : null}
              </span>
              <span className={cn("text-sm text-ink", item.completed && "text-ink-faint line-through")}>
                {item.name}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 12 12" className="size-3 text-white" fill="none" aria-hidden="true">
      <path d="M2.5 6.5L4.75 8.75L9.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
