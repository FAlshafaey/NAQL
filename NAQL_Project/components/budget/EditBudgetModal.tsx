"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";

interface EditBudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (total: number) => void;
  currentTotal: number;
}

export function EditBudgetModal({ open, onClose, onSubmit, currentTotal }: EditBudgetModalProps) {
  const [value, setValue] = useState(String(currentTotal));
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (open) {
      setValue(String(currentTotal));
      setAttemptedSubmit(false);
    }
  }, [open, currentTotal]);

  const numericValue = Number(value);
  const error =
    attemptedSubmit && (!Number.isFinite(numericValue) || numericValue <= 0)
      ? "الرجاء إدخال مبلغ صحيح أكبر من صفر."
      : undefined;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setAttemptedSubmit(true);
    if (!Number.isFinite(numericValue) || numericValue <= 0) return;
    onSubmit(Math.round(numericValue));
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="تعديل الميزانية الإجمالية" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="الميزانية الإجمالية (ر.س)" htmlFor="budget-total" required error={error}>
          <Input
            id="budget-total"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            hasError={Boolean(error)}
          />
        </FormField>
        <div className="mt-2 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit">حفظ</Button>
        </div>
      </form>
    </Modal>
  );
}
