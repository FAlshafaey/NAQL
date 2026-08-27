"use client";

import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PRIORITY_TONE } from "@/lib/task-ui";
import { cn, formatArabicDate } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskRowProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isOverdue?: boolean;
}

export function TaskRow({ task, onToggle, onEdit, onDelete, isOverdue }: TaskRowProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-colors",
        task.completed && "bg-surface-muted/50"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={task.completed}
        aria-label={task.completed ? "إلغاء إكمال المهمة" : "تحديد المهمة كمكتملة"}
        className="mt-0.5 shrink-0"
      >
        {task.completed ? (
          <CheckCircle2 className="size-5 text-primary" />
        ) : (
          <Circle className="size-5 text-border-strong transition-colors hover:text-primary" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium text-ink", task.completed && "text-ink-faint line-through")}>
          {task.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{task.category}</Badge>
          <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
          <span className={cn("text-xs", isOverdue && !task.completed ? "font-medium text-danger" : "text-ink-muted")}>
            {formatArabicDate(task.dueDate)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label="تعديل المهمة"
          className="flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="حذف المهمة"
          className="flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-danger-light hover:text-danger"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
