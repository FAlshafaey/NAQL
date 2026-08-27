"use client";

import { Pencil, Plus, Receipt, Trash2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { BudgetChart } from "@/components/budget/BudgetChart";
import { EditBudgetModal } from "@/components/budget/EditBudgetModal";
import { ExpenseFormModal, type ExpenseFormValues } from "@/components/budget/ExpenseFormModal";
import { useJourney } from "@/context/JourneyContext";
import { computeBudgetSummary } from "@/lib/journey-metrics";
import { cn, formatArabicDate, formatSAR } from "@/lib/utils";
import type { Expense } from "@/types";

export default function BudgetPage() {
  const journey = useJourney();
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [editBudgetOpen, setEditBudgetOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const expenses = useMemo(
    () => [...journey.expenses].sort((a, b) => b.date.localeCompare(a.date)),
    [journey.expenses]
  );

  if (!journey.hasStarted) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={<Wallet className="size-6" />}
          title="لم تبدأ رحلة انتقالك بعد"
          description="ابدأ رحلتك أولًا لنجهّز لك ميزانية تقديرية يمكنك تعديلها."
          action={<Button href="/start">ابدأ رحلة انتقالك</Button>}
        />
      </div>
    );
  }

  const summary = computeBudgetSummary(journey.budgetTotal, journey.expenses);
  const isOverBudget = summary.remaining < 0;

  return (
    <div className="container flex flex-col gap-6 py-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">الميزانية</h1>
          <p className="mt-1 text-sm text-ink-muted">تابع مصروفات انتقالك بالريال السعودي وخطط لما تبقى بوضوح.</p>
        </div>
        <Button icon={<Plus className="size-4" />} onClick={() => setExpenseFormOpen(true)}>
          إضافة مصروف
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-muted">الميزانية</p>
            <button
              type="button"
              onClick={() => setEditBudgetOpen(true)}
              aria-label="تعديل الميزانية الإجمالية"
              className="flex size-7 items-center justify-center rounded-lg text-ink-faint hover:bg-surface-muted hover:text-ink"
            >
              <Pencil className="size-3.5" />
            </button>
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-ink">{formatSAR(summary.total)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">المصروف</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">{formatSAR(summary.spent)}</p>
          <p className="mt-1 text-xs text-ink-faint">{summary.percentageSpent}% من الميزانية</p>
        </Card>
        <div
          className={cn(
            "rounded-2xl border p-5 shadow-card",
            isOverBudget ? "border-danger/40 bg-danger-light" : "border-border bg-surface"
          )}
        >
          <p className="text-sm text-ink-muted">المتبقي</p>
          <p className={cn("mt-1 font-display text-2xl font-bold", isOverBudget ? "text-danger" : "text-ink")}>
            {formatSAR(Math.abs(summary.remaining))}
          </p>
          {isOverBudget ? <p className="mt-1 text-xs font-medium text-danger">تجاوزت الميزانية المحددة</p> : null}
        </div>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">توزيع المصروفات</h2>
        <BudgetChart byCategory={summary.byCategory} />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">سجل المصروفات</h2>
        {expenses.length === 0 ? (
          <EmptyState
            icon={<Receipt className="size-6" />}
            title="لا توجد مصروفات مسجلة"
            description="أضف أول مصروف لمتابعة ميزانية انتقالك."
            action={
              <Button size="sm" onClick={() => setExpenseFormOpen(true)}>
                إضافة مصروف
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{expense.label}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone="neutral">{expense.category}</Badge>
                    <span className="text-xs text-ink-muted">{formatArabicDate(expense.date)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-display text-sm font-semibold text-ink">{formatSAR(expense.amount)}</span>
                  <button
                    type="button"
                    onClick={() => setDeletingExpense(expense)}
                    aria-label="حذف المصروف"
                    className="flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-danger-light hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ExpenseFormModal
        open={expenseFormOpen}
        onClose={() => setExpenseFormOpen(false)}
        onSubmit={(values: ExpenseFormValues) => {
          journey.addExpense(values);
          setExpenseFormOpen(false);
        }}
      />

      <EditBudgetModal
        open={editBudgetOpen}
        onClose={() => setEditBudgetOpen(false)}
        currentTotal={journey.budgetTotal}
        onSubmit={(total) => journey.setBudgetTotal(total)}
      />

      <ConfirmDialog
        open={deletingExpense !== null}
        onClose={() => setDeletingExpense(null)}
        onConfirm={() => {
          if (deletingExpense) journey.deleteExpense(deletingExpense.id);
        }}
        title="حذف المصروف"
        description={`هل تريد حذف "${deletingExpense?.label ?? ""}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        danger
      />
    </div>
  );
}
