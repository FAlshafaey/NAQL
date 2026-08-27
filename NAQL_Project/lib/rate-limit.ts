// محدد معدّل طلبات بسيط في الذاكرة لحماية مسارات الذكاء الاصطناعي من الاستخدام المفرط.
// ملاحظة: هذا حل مناسب لمشروع تعليمي بخادم واحد فقط. في بيئة إنتاج حقيقية
// (خوادم متعددة أو بدون حالة serverless) يجب استبداله بمخزن مشترك مثل Redis.

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

const requestLog = new Map<string, number[]>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return true;
}

export function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
