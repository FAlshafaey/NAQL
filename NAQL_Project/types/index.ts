// أنواع البيانات الأساسية في تطبيق نَقْل.
// كل البيانات هنا تعيش في حالة الواجهة الأمامية فقط (لا قاعدة بيانات).

export const CITIES = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
] as const;

export type CityName = (typeof CITIES)[number];

export const HOME_TYPES = ["شقة", "فيلا", "دور في فيلا", "استوديو"] as const;

export type HomeType = (typeof HOME_TYPES)[number];

export interface JourneyInfo {
  movingDate: string; // ISO date (yyyy-mm-dd)
  currentCity: CityName;
  destinationCity: CityName;
  currentHomeType: HomeType;
  newHomeType: HomeType;
  roomsCount: number;
  peopleCount: number;
  needsFurnitureMoving: boolean;
  needsPacking: boolean;
  needsCleaning: boolean;
  startedAt: string; // ISO datetime
}

export const TASK_CATEGORIES = [
  "التخطيط",
  "التغليف",
  "الخدمات",
  "الأوراق والاشتراكات",
  "يوم الانتقال",
  "المسكن الجديد",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export const TASK_PRIORITIES = ["عالية", "متوسطة", "منخفضة"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  dueDate: string; // ISO date
  priority: TaskPriority;
  completed: boolean;
}

export interface PackingItem {
  id: string;
  name: string;
  completed: boolean;
}

export interface PackingRoom {
  id: string;
  name: string;
  items: PackingItem[];
}

export const EXPENSE_CATEGORIES = [
  "نقل الأثاث",
  "التنظيف",
  "التغليف",
  "المستلزمات",
  "الأجهزة",
  "أخرى",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: string;
  label: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // ISO date
}

export const SERVICE_CATEGORIES = [
  "نقل الأثاث",
  "تنظيف المنازل",
  "التغليف",
  "التخزين",
  "خدمات مساندة",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const QUALITY_INDICATORS = ["قياسي", "موثوق", "ممتاز"] as const;

export type QualityIndicator = (typeof QUALITY_INDICATORS)[number];

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  city: CityName;
  startingPrice: number; // ر.س
  rating: number; // 0 - 5
  reviewsCount: number;
  services: string[];
  estimatedDurationHours: number;
  features: string[];
  qualityIndicator: QualityIndicator;
}

export interface GuideArticleSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface GuideArticle {
  id: string;
  title: string;
  summary: string;
  readTime: string;
  sections: GuideArticleSection[];
}

// ---------- مستشار نَقْل الذكي ----------

export const AI_PRIORITIES = [
  "أقل سعر",
  "أعلى جودة",
  "أفضل توازن بين السعر والجودة",
  "أعلى تقييم",
  "أسرع خدمة",
] as const;

export type AIPriority = (typeof AI_PRIORITIES)[number];

export interface CompareRequestBody {
  category: ServiceCategory;
  priority: AIPriority;
  budgetMax?: number;
  city?: CityName;
}

export interface CompareResult {
  recommendedProviderId: string;
  cheapestProviderId: string;
  highestQualityProviderId: string;
  bestValueProviderId: string;
  reason: string;
  tradeoffs: string[];
  tips: string[];
}

export interface AssistantRequestBody {
  question: string;
  context?: {
    city?: CityName;
    daysRemaining?: number;
  };
}

export interface AssistantResult {
  answer: string;
  tips: string[];
}
