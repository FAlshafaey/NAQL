import "server-only";
import { AIServiceError } from "@/lib/ai-errors";

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o-mini";
const REQUEST_TIMEOUT_MS = 20_000;

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

interface RequestChatCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  /** يطلب من النموذج إخراج JSON صِرف عند دعمه ذلك. */
  jsonMode?: boolean;
}

/**
 * ينادي OpenRouter من الخادم فقط (لا يُستورد أبدًا في مكوّن عميل).
 * يرمي AIServiceError بأكواد واضحة (MISSING_API_KEY / TIMEOUT / UPSTREAM_ERROR / INVALID_RESPONSE)
 * ليتولى كل مسار API ترجمتها إلى استجابة عربية مناسبة.
 */
export async function requestChatCompletion(
  messages: ChatMessage[],
  options: RequestChatCompletionOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new AIServiceError("MISSING_API_KEY", "لم يتم إعداد مفتاح OpenRouter API على الخادم.");
  }

  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.4,
        max_tokens: options.maxTokens ?? 900,
        ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new AIServiceError("TIMEOUT", "استغرق طلب الذكاء الاصطناعي وقتًا أطول من المتوقع.");
    }
    throw new AIServiceError("UPSTREAM_ERROR", "تعذر الاتصال بمزود الذكاء الاصطناعي.");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
  const errorBody = await response.text();

  console.error("OpenRouter error:", response.status, errorBody);

  throw new AIServiceError(
    "UPSTREAM_ERROR",
    `تعذر الحصول على رد من مزود الذكاء الاصطناعي (رمز الحالة ${response.status}).`
  );
}

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AIServiceError("INVALID_RESPONSE", "تعذّر قراءة رد مزود الذكاء الاصطناعي.");
  }

  const content = extractContent(payload);
  if (!content || !content.trim()) {
    throw new AIServiceError("INVALID_RESPONSE", "رد مزود الذكاء الاصطناعي كان فارغًا.");
  }

  return content;
}

function extractContent(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const first = choices[0] as { message?: { content?: unknown } };
  const content = first.message?.content;
  return typeof content === "string" ? content : null;
}

/** يستخرج أول كتلة JSON صالحة من نص قد يحتوي على أسوار ```json``` أو نص إضافي حول الكائن. */
export function parseJSONLoose<T>(raw: string): T {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1)) as T;
      } catch {
        // تابع إلى الرمي أدناه
      }
    }
    throw new AIServiceError("INVALID_RESPONSE", "تعذّر فهم رد الذكاء الاصطناعي بصيغة JSON صحيحة.");
  }
}
