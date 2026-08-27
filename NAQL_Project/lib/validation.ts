import {
  AI_PRIORITIES,
  CITIES,
  SERVICE_CATEGORIES,
  type AIPriority,
  type AssistantRequestBody,
  type CityName,
  type CompareRequestBody,
  type ServiceCategory,
} from "@/types";

type ValidationResult<T> = { ok: true; data: T } | { ok: false; message: string };

function isServiceCategory(value: unknown): value is ServiceCategory {
  return typeof value === "string" && (SERVICE_CATEGORIES as readonly string[]).includes(value);
}

function isAIPriority(value: unknown): value is AIPriority {
  return typeof value === "string" && (AI_PRIORITIES as readonly string[]).includes(value);
}

function isCityName(value: unknown): value is CityName {
  return typeof value === "string" && (CITIES as readonly string[]).includes(value);
}

export function validateCompareRequest(body: unknown): ValidationResult<CompareRequestBody> {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "الطلب غير صالح." };
  }

  const { category, priority, budgetMax, city } = body as Record<string, unknown>;

  if (!isServiceCategory(category)) {
    return { ok: false, message: "فئة الخدمة غير صحيحة." };
  }

  if (!isAIPriority(priority)) {
    return { ok: false, message: "الأولوية المحددة غير صحيحة." };
  }

  let normalizedBudget: number | undefined;
  if (budgetMax !== undefined && budgetMax !== null && budgetMax !== "") {
    const numeric = typeof budgetMax === "number" ? budgetMax : Number(budgetMax);
    if (!Number.isFinite(numeric) || numeric <= 0 || numeric > 200_000) {
      return { ok: false, message: "الميزانية القصوى غير صحيحة." };
    }
    normalizedBudget = Math.round(numeric);
  }

  let normalizedCity: CityName | undefined;
  if (city !== undefined && city !== null && city !== "") {
    if (!isCityName(city)) {
      return { ok: false, message: "المدينة المحددة غير صحيحة." };
    }
    normalizedCity = city;
  }

  return {
    ok: true,
    data: {
      category,
      priority,
      budgetMax: normalizedBudget,
      city: normalizedCity,
    },
  };
}

const MAX_QUESTION_LENGTH = 400;

export function validateAssistantRequest(body: unknown): ValidationResult<AssistantRequestBody> {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "الطلب غير صالح." };
  }

  const { question, context } = body as Record<string, unknown>;

  if (typeof question !== "string") {
    return { ok: false, message: "السؤال مطلوب." };
  }

  const trimmed = question.trim();
  if (trimmed.length === 0) {
    return { ok: false, message: "الرجاء كتابة سؤال." };
  }
  if (trimmed.length > MAX_QUESTION_LENGTH) {
    return { ok: false, message: `الرجاء اختصار السؤال إلى ${MAX_QUESTION_LENGTH} حرفًا كحد أقصى.` };
  }

  let normalizedContext: AssistantRequestBody["context"];
  if (context && typeof context === "object") {
    const { city, daysRemaining } = context as Record<string, unknown>;
    normalizedContext = {};
    if (city !== undefined && city !== null && city !== "") {
      if (!isCityName(city)) {
        return { ok: false, message: "المدينة المحددة غير صحيحة." };
      }
      normalizedContext.city = city;
    }
    if (daysRemaining !== undefined && daysRemaining !== null) {
      const numeric = typeof daysRemaining === "number" ? daysRemaining : Number(daysRemaining);
      if (Number.isFinite(numeric) && Math.abs(numeric) <= 3650) {
        normalizedContext.daysRemaining = Math.round(numeric);
      }
    }
  }

  return {
    ok: true,
    data: {
      question: trimmed,
      context: normalizedContext,
    },
  };
}
