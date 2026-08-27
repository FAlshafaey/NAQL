"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types";

export interface ExpenseFormValues {
  label: string;
  category: ExpenseCategory;
  amount: number;
}

interface ExpenseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ExpenseFormValues) => void;
}

export function ExpenseFormModal({ open, onClose, onSubmit }: ExpenseFormModalProps) {
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (open) {
      setLabel("");
      setCategory(EXPENSE_CATEGORIES[0]);
      setAmount("");
      setAttemptedSubmit(false);
    }
  }, [open]);

  const numericAmount = Number(amount);
  const labelError = attemptedSubmit && label.trim() === "" ? "الرجاء كتابة وصف المصروف." : undefined;
  const amountError =
    attemptedSubmit && (!Number.isFinite(numericAmount) || numericAmount <= 0)
      ? "الرجاء إدخال مبلغ صحيح أكبر من صفر."
      : undefined;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setAttemptedSubmit(true);
    if (label.trim() === "" || !Number.isFinite(numericAmount) || numericAmount <= 0) return;
    onSubmit({ label: label.trim(), category, amount: Math.round(numericAmount) });
  }

  return (
    <Modal open={open} onClose={onClose} title="إضافة مصروف" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="وصف المصروف" htmlFor="expense-label" required error={labelError}>
          <Input
            id="expense-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="مثال: شراء كراتين تغليف"
            hasError={Boolean(labelError)}
          />
        </FormField>

        <FormField label="الفئة" htmlFor="expense-category">
          <Select id="expense-category" value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="المبلغ (ر.س)" htmlFor="expense-amount" required error={amountError}>
          <Input
            id="expense-amount"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            hasError={Boolean(amountError)}
          />
        </FormField>

        <div className="mt-2 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit">إضافة المصروف</Button>
        </div>
      </form>
    </Modal>
  );
}
