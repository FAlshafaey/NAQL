import { NextResponse } from "next/server";
import { AIServiceError, aiErrorStatus, type AIErrorPayload } from "@/lib/ai-errors";
import { parseJSONLoose, requestChatCompletion } from "@/lib/openrouter";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { validateAssistantRequest } from "@/lib/validation";
import type { AssistantRequestBody, AssistantResult } from "@/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT =
  "أنت مستشار نَقْل، مساعد ذكاء اصطناعي داخل منصة نَقْل السعودية لتنظيم الانتقال بين المساكن. " +
  "مهمتك تقديم نصائح عملية عامة عن تنظيم الانتقال: التخطيط، التغليف، الميزانية، يوم الانتقال، والاستقرار في المسكن الجديد. " +
  "أجب بالعربية الفصحى الواضحة والمختصرة والعملية. " +
  "لا تخترع أسماء شركات أو أسعارًا أو تقييمات محددة؛ إن سُئلت عن مقارنة مزودي خدمات فعليين، " +
  "وجّه المستخدم لاستخدام ميزة \"مستشار نَقْل الذكي\" لمقارنة الخدمات بدلاً من افتراض بيانات غير موجودة. " +
  "أجب حصرًا بكائن JSON صالح وفق المخطط المطلوب، بدون أي نص خارج كائن JSON.";

function buildUserPrompt(input: AssistantRequestBody): string {
  const contextLines: string[] = [];
  if (input.context?.city) contextLines.push(`مدينة الوجهة: ${input.context.city}`);
  if (typeof input.context?.daysRemaining === "number") {
    contextLines.push(`الأيام المتبقية على موعد الانتقال: ${input.context.daysRemaining}`);
  }

  return `سؤال المستخدم: "${input.question}"
${contextLines.length > 0 ? contextLines.join("\n") : "لا يوجد سياق إضافي متاح."}

أعد كائن JSON فقط بهذا المخطط بالضبط (بدون أي نص إضافي قبله أو بعده):
{
  "answer": "إجابة عملية ومختصرة بالعربية (3 إلى 5 جمل كحد أقصى)",
  "tips": ["نصيحة قصيرة إضافية (اختياري، حتى 4 عناصر)"]
}`;
}

export async function POST(request: Request) {
  try {
    const clientKey = getClientKey(request);
    if (!checkRateLimit(clientKey)) {
      throw new AIServiceError("RATE_LIMITED", "عدد الأسئلة مرتفع حاليًا. الرجاء المحاولة بعد دقيقة.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new AIServiceError("INVALID_INPUT", "تعذّر قراءة بيانات الطلب.");
    }

    const validation = validateAssistantRequest(body);
    if (!validation.ok) {
      throw new AIServiceError("INVALID_INPUT", validation.message);
    }

    const raw = await requestChatCompletion(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(validation.data) },
      ],
      { jsonMode: true, temperature: 0.5, maxTokens: 500 }
    );

    const parsed = parseJSONLoose<Partial<AssistantResult>>(raw);

    const answer = typeof parsed.answer === "string" ? parsed.answer.trim().slice(0, 900) : "";
    if (!answer) {
      throw new AIServiceError("INVALID_RESPONSE", "لم يتمكن مستشار نَقْل من صياغة إجابة صالحة.");
    }

    const tips = Array.isArray(parsed.tips)
      ? parsed.tips
          .filter((tip): tip is string => typeof tip === "string" && tip.trim().length > 0)
          .slice(0, 4)
          .map((tip) => tip.trim().slice(0, 200))
      : [];

    const result: AssistantResult = { answer, tips };
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof AIServiceError) {
      const payload: AIErrorPayload = { error: error.code, message: error.message };
      return NextResponse.json(payload, { status: aiErrorStatus(error.code) });
    }
    const payload: AIErrorPayload = { error: "UNKNOWN", message: "حدث خطأ غير متوقع أثناء معالجة سؤالك." };
    return NextResponse.json(payload, { status: 500 });
  }
}
