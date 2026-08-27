import { daysBetween, percentage, todayISO } from "@/lib/utils";
import type { Expense, ExpenseCategory, JourneyInfo, PackingRoom, Task } from "@/types";

export type JourneyStage = "التخطيط" | "التجهيز" | "يوم الانتقال" | "الاستقرار";

export const JOURNEY_STAGES: JourneyStage[] = ["التخطيط", "التجهيز", "يوم الانتقال", "الاستقرار"];

export function computeDaysRemaining(journey: JourneyInfo): number {
  return daysBetween(todayISO(), journey.movingDate);
}

export function computeStage(journey: JourneyInfo): JourneyStage {
  const daysRemaining = computeDaysRemaining(journey);
  if (daysRemaining > 14) return "التخطيط";
  if (daysRemaining >= 1) return "التجهيز";
  if (daysRemaining === 0) return "يوم الانتقال";
  return "الاستقرار";
}

export type StageStatus = "done" | "current" | "upcoming";

export function stageStatuses(currentStage: JourneyStage): { stage: JourneyStage; status: StageStatus }[] {
  const currentIndex = JOURNEY_STAGES.indexOf(currentStage);
  return JOURNEY_STAGES.map((stage, index) => ({
    stage,
    status: index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming",
  }));
}

export interface TaskProgress {
  total: number;
  completed: number;
  remaining: number;
  percentage: number;
}

export function computeTaskProgress(tasks: Task[]): TaskProgress {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  return { total, completed, remaining: total - completed, percentage: percentage(completed, total) };
}

export function nextUpcomingTask(tasks: Task[]): Task | null {
  const upcoming = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return upcoming[0] ?? null;
}

export interface PackingProgress {
  totalItems: number;
  completedItems: number;
  percentage: number;
}

export function computePackingProgress(rooms: PackingRoom[]): PackingProgress {
  const allItems = rooms.flatMap((room) => room.items);
  const completedItems = allItems.filter((item) => item.completed).length;
  return {
    totalItems: allItems.length,
    completedItems,
    percentage: percentage(completedItems, allItems.length),
  };
}

export function computeRoomProgress(room: PackingRoom): PackingProgress {
  const completedItems = room.items.filter((item) => item.completed).length;
  return {
    totalItems: room.items.length,
    completedItems,
    percentage: percentage(completedItems, room.items.length),
  };
}

export interface BudgetSummary {
  total: number;
  spent: number;
  remaining: number;
  percentageSpent: number;
  byCategory: Partial<Record<ExpenseCategory, number>>;
}

export function computeBudgetSummary(total: number, expenses: Expense[]): BudgetSummary {
  const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory: Partial<Record<ExpenseCategory, number>> = {};
  for (const expense of expenses) {
    byCategory[expense.category] = (byCategory[expense.category] ?? 0) + expense.amount;
  }
  return {
    total,
    spent,
    remaining: total - spent,
    percentageSpent: percentage(spent, total),
    byCategory,
  };
}
