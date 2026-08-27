"use client";

import { ClipboardList, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { TaskFormModal, type TaskFormValues } from "@/components/tasks/TaskFormModal";
import { TaskRow } from "@/components/tasks/TaskRow";
import { useJourney } from "@/context/JourneyContext";
import { todayISO } from "@/lib/utils";
import type { Task } from "@/types";

type TabValue = "all" | "upcoming" | "completed";

export default function TasksPage() {
  const journey = useJourney();
  const [tab, setTab] = useState<TabValue>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const today = todayISO();
  const tasks = journey.tasks;

  const sorted = useMemo(() => [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [tasks]);
  const upcoming = sorted.filter((t) => !t.completed);
  const completed = sorted.filter((t) => t.completed);
  const visibleTasks = tab === "all" ? sorted : tab === "upcoming" ? upcoming : completed;

  if (!journey.hasStarted) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={<ClipboardList className="size-6" />}
          title="لم تبدأ رحلة انتقالك بعد"
          description="ابدأ رحلتك أولًا لنُنشئ لك قائمة مهام جاهزة يمكنك تعديلها بحرية."
          action={<Button href="/start">ابدأ رحلة انتقالك</Button>}
        />
      </div>
    );
  }

  function handleFormSubmit(values: TaskFormValues) {
    if (editingTask) {
      journey.updateTask(editingTask.id, values);
    } else {
      journey.addTask(values);
    }
    setFormOpen(false);
    setEditingTask(null);
  }

  return (
    <div className="container flex flex-col gap-6 py-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">مهامي</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {upcoming.length > 0 ? `لديك ${upcoming.length} مهمة قادمة` : "أنجزت جميع مهامك الحالية"}
          </p>
        </div>
        <Button
          icon={<Plus className="size-4" />}
          onClick={() => {
            setEditingTask(null);
            setFormOpen(true);
          }}
        >
          إضافة مهمة
        </Button>
      </div>

      <Tabs
        value={tab}
        onChange={(v) => setTab(v as TabValue)}
        items={[
          { value: "all", label: "الكل", count: sorted.length },
          { value: "upcoming", label: "القادمة", count: upcoming.length },
          { value: "completed", label: "المكتملة", count: completed.length },
        ]}
      />

      {visibleTasks.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" />}
          title={tab === "completed" ? "لا توجد مهام مكتملة بعد" : tab === "upcoming" ? "لا توجد مهام قادمة" : "لا توجد مهام"}
          description={tab === "completed" ? "أكمل بعض المهام لتظهر هنا." : "أضف أول مهمة لرحلة انتقالك."}
          action={
            <Button
              size="sm"
              onClick={() => {
                setEditingTask(null);
                setFormOpen(true);
              }}
            >
              إضافة مهمة
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {visibleTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isOverdue={task.dueDate < today}
              onToggle={() => journey.toggleTask(task.id)}
              onEdit={() => {
                setEditingTask(task);
                setFormOpen(true);
              }}
              onDelete={() => setDeletingTask(task)}
            />
          ))}
        </div>
      )}

      <TaskFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initial={editingTask}
      />

      <ConfirmDialog
        open={deletingTask !== null}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => {
          if (deletingTask) journey.deleteTask(deletingTask.id);
        }}
        title="حذف المهمة"
        description={`هل تريد حذف مهمة "${deletingTask?.title ?? ""}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        danger
      />
    </div>
  );
}
