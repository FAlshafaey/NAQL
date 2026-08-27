import { NextResponse } from "next/server";
import { SERVICE_PROVIDERS } from "@/data/providers";
import { AIServiceError, aiErrorStatus, type AIErrorPayload } from "@/lib/ai-errors";
import { parseJSONLoose, requestChatCompletion } from "@/lib/openrouter";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { validateCompareRequest } from "@/lib/validation";
import type { CompareRequestBody, CompareResult } from "@/types";

export const runtime = "nodejs";

interface CandidateProvider {
  id: string;
  name: string;
  city: string;
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  estimatedDurationHours: number;
  features: string[];
  qualityIndicator: string;
}

function buildPrompt(candidates: CandidateProvider[], input: CompareRequestBody) {
  const system =
    "أنت مستشار نَقْل، مساعد ذكاء اصطناعي داخل منصة نَقْل السعودية لتنظيم الانتقال بين المساكن. " +
    "مهمتك تحليل قائمة مزودي خدمات محددة مسبقًا فقط وترشيح الأنسب منها بناءً على أولوية المستخدم. " +
    "ممنوع اختراع أي مزود أو سعر أو تقييم أو ميزة غير موجودة في القائمة المرسلة إليك. " +
    "أجب حصرًا بكائن JSON صالح وفق المخطط المطلوب، بدون أي نص أو شرح خارج كائن JSON.";

    const user = `بيانات مزودي الخدمة المتاحين لفئة "${input.category}":
${JSON.stringify(candidates)}

تفضيلات المستخدم:
- الأولوية: ${input.priority}
${input.city ? `- مدينة المستخدم: ${input.city}` : "- لم يحدد المستخدم مدينة معينة"}
${input.budgetMax ? `- الميزانية القصوى: ${input.budgetMax} ر.س` : "- لم يحدد المستخدم ميزانية قصوى"}

المطلوب: أعد كائن JSON فقط بهذا المخطط بالضبط (بدون أي نص إضافي قبله أو بعده):
{
  "recommendedProviderId": "معرّف المزود المرشّح الأنسب بناءً على أولوية المستخدم",
  "cheapestProviderId": "معرّف المزود الأقل سعرًا من بين القائمة أعلاه",
  "highestQualityProviderId": "معرّف المزود الأعلى جودة وتقييمًا من بين القائمة أعلاه",
  "bestValueProviderId": "معرّف المزود الأفضل من حيث التوازن بين السعر والجودة",
  "reason": "جملة أو جملتان بالعربية تشرحان سبب اختيار الترشيح الرئيسي",
  "tradeoffs": ["نقطة موازنة أو مفاضلة، بالعربية"],
  "tips": ["نصيحة عملية قصيرة بالعربية"]
}

قواعد صارمة:
- جميع معرّفات "...ProviderId" يجب أن تكون من ضمن معرّفات القائمة أعلاه فقط، ولا شيء غيرها.
- إذا تجاوز الخيار المرشّح الميزانية القصوى المذكورة، وضّح ذلك في "tradeoffs".
- اجعل "tradeoffs" و"tips" مصفوفتين من نصوص قصيرة عملية (بحد أقصى 4 عناصر لكل منهما).`;

  return { system, user };
}

export async function POST(request: Request) {
  try {
    const clientKey = getClientKey(request);
    if (!checkRateLimit(clientKey)) {
      throw new AIServiceError("RATE_LIMITED", "عدد الطلبات مرتفع حاليًا. الرجاء المحاولة بعد دقيقة.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new AIServiceError("INVALID_INPUT", "تعذّر قراءة بيانات الطلب.");
    }

    const validation = validateCompareRequest(body);
    if (!validation.ok) {
      throw new AIServiceError("INVALID_INPUT", validation.message);
    }
    const input = validation.data;

    const candidates: CandidateProvider[] = SERVICE_PROVIDERS.filter((p) => p.category === input.category).map(
      (p) => ({
        id: p.id,
        name: p.name,
        city: p.city,
        startingPrice: p.startingPrice,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        estimatedDurationHours: p.estimatedDurationHours,
        features: p.features,
        qualityIndicator: p.qualityIndicator,
      })
    );

    if (candidates.length === 0) {
      throw new AIServiceError("INVALID_RESPONSE", "لا يوجد مزودو خدمات متاحون لهذه الفئة حاليًا.");
    }

    const { system, user } = buildPrompt(candidates, input);
    const raw = await requestChatCompletion(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { jsonMode: true, temperature: 0.3, maxTokens: 700 }
    );

    const parsed = parseJSONLoose<Partial<CompareResult>>(raw);
    const result = sanitizeCompareResult(parsed, candidates);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof AIServiceError) {
      const payload: AIErrorPayload = { error: error.code, message: error.message };
      return NextResponse.json(payload, { status: aiErrorStatus(error.code) });
    }
    const payload: AIErrorPayload = { error: "UNKNOWN", message: "حدث خطأ غير متوقع أثناء إعداد الترشيح." };
    return NextResponse.json(payload, { status: 500 });
  }
}

function sanitizeCompareResult(parsed: Partial<CompareResult>, candidates: CandidateProvider[]): CompareResult {
  const validIds = new Set(candidates.map((c) => c.id));

  const recommendedProviderId = pickValidId(parsed.recommendedProviderId, validIds);
  const cheapestProviderId = pickValidId(parsed.cheapestProviderId, validIds) ?? computeCheapest(candidates);
  const highestQualityProviderId = pickValidId(parsed.highestQualityProviderId, validIds) ?? computeHighestRated(candidates);
  const bestValueProviderId = pickValidId(parsed.bestValueProviderId, validIds) ?? recommendedProviderId ?? computeHighestRated(candidates);

  if (!recommendedProviderId) {
    throw new AIServiceError("INVALID_RESPONSE", "لم يتمكن مستشار نَقْل من تحديد ترشيح صالح.");
  }

  const reason =
    typeof parsed.reason === "string" && parsed.reason.trim() ? parsed.reason.trim().slice(0, 500) : "هذا الخيار يحقق أفضل توازن بين تفضيلاتك والخيارات المتاحة.";

  return {
    recommendedProviderId,
    cheapestProviderId,
    highestQualityProviderId,
    bestValueProviderId,
    reason,
    tradeoffs: sanitizeStringArray(parsed.tradeoffs),
    tips: sanitizeStringArray(parsed.tips),
  };
}

function pickValidId(value: unknown, validIds: Set<string>): string | null {
  return typeof value === "string" && validIds.has(value) ? value : null;
}

function computeCheapest(candidates: CandidateProvider[]): string {
  return candidates.reduce((min, c) => (c.startingPrice < min.startingPrice ? c : min), candidates[0]).id;
}

function computeHighestRated(candidates: CandidateProvider[]): string {
  return candidates.reduce((max, c) => (c.rating > max.rating ? c : max), candidates[0]).id;
}

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .slice(0, 6)
    .map((item) => item.trim().slice(0, 220));
}
