import type { Expense } from "@/types";
import { addDays, generateId, todayISO } from "@/lib/utils";

export const DEFAULT_BUDGET_TOTAL = 5000;

interface ExpenseBlueprint {
  label: string;
  category: Expense["category"];
  amount: number;
  daysAgo: number;
}

const EXPENSE_BLUEPRINTS: ExpenseBlueprint[] = [
  { label: "دفعة مقدمة لشركة نقل الأثاث", category: "نقل الأثاث", amount: 1200, daysAgo: 18 },
  { label: "حجز شركة تنظيف المسكن القديم", category: "التنظيف", amount: 350, daysAgo: 14 },
  { label: "شراء كراتين وشريط لاصق", category: "التغليف", amount: 180, daysAgo: 12 },
  { label: "أدوات تنظيف وتعبئة", category: "المستلزمات", amount: 220, daysAgo: 10 },
  { label: "شراء مروحة إضافية للمنزل الجديد", category: "الأجهزة", amount: 400, daysAgo: 8 },
  { label: "رسوم نقل الاشتراكات", category: "أخرى", amount: 150, daysAgo: 6 },
  { label: "تأمين إضافي على الأثاث", category: "نقل الأثاث", amount: 250, daysAgo: 4 },
  { label: "غلاف بابل إضافي للأدوات الهشة", category: "التغليف", amount: 100, daysAgo: 2 },
];

export function generateDefaultExpenses(): Expense[] {
  const today = todayISO();
  return EXPENSE_BLUEPRINTS.map((blueprint) => ({
    id: generateId("expense"),
    label: blueprint.label,
    category: blueprint.category,
    amount: blueprint.amount,
    date: addDays(today, -blueprint.daysAgo),
  }));
}
