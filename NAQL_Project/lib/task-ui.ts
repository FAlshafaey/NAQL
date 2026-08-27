import type { TaskPriority } from "@/types";

export const PRIORITY_TONE: Record<TaskPriority, "danger" | "warning" | "neutral"> = {
  عالية: "danger",
  متوسطة: "warning",
  منخفضة: "neutral",
};
