"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { todayISO } from "@/lib/utils";
import { TASK_CATEGORIES, TASK_PRIORITIES, type Task, type TaskCategory, type TaskPriority } from "@/types";

export interface TaskFormValues {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
}

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
  initial?: Task | null;
}

export function TaskFormModal({ open, onClose, onSubmit, initial }: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>(TASK_CATEGORIES[0]);
  const [priority, setPriority] = useState<TaskPriority>("متوسطة");
  const [dueDate, setDueDate] = useState(todayISO());
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setCategory(initial?.category ?? TASK_CATEGORIES[0]);
      setPriority(initial?.priority ?? "متوسطة");
      setDueDate(initial?.dueDate ?? todayISO());
      setAttemptedSubmit(false);
    }
  }, [open, initial]);

  const titleError = attemptedSubmit && title.trim() === "" ? "الرجاء كتابة عنوان المهمة." : undefined;
  const dateError = attemptedSubmit && dueDate === "" ? "الرجاء تحديد تاريخ الاستحقاق." : undefined;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setAttemptedSubmit(true);
    if (title.trim() === "" || dueDate === "") return;
    onSubmit({ title: title.trim(), category, priority, dueDate });
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "تعديل المهمة" : "إضافة مهمة جديدة"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="عنوان المهمة" htmlFor="task-title" required error={titleError}>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تأكيد موعد شركة النقل"
            hasError={Boolean(titleError)}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="الفئة" htmlFor="task-category">
            <Select id="task-category" value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="الأولوية" htmlFor="task-priority">
            <Select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField label="تاريخ الاستحقاق" htmlFor="task-due-date" required error={dateError}>
          <Input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            hasError={Boolean(dateError)}
          />
        </FormField>

        <div className="mt-2 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit">{initial ? "حفظ التعديلات" : "إضافة المهمة"}</Button>
        </div>
      </form>
    </Modal>
  );
}
