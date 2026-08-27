// أدوات مساعدة عامة: تواريخ، أرقام، وتنسيق نصوص.

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/** يرجع تاريخ اليوم بصيغة yyyy-mm-dd حسب التوقيت المحلي (وليس UTC). */
export function todayISO(): string {
  return formatDateISO(new Date());
}

/** يحوّل كائن Date إلى نص yyyy-mm-dd باستخدام التوقيت المحلي لتفادي انزياح المنطقة الزمنية. */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** يضيف عدد أيام (قد يكون سالبًا) لتاريخ ISO ويرجع تاريخ ISO جديد. */
export function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() + days);
  return formatDateISO(date);
}

/** عدد الأيام الكاملة بين تاريخين (to - from)، بدون كسور بسبب التوقيت الصيفي. */
export function daysBetween(fromISO: string, toISO: string): number {
  const [fy, fm, fd] = fromISO.split("-").map(Number);
  const [ty, tm, td] = toISO.split("-").map(Number);
  const from = Date.UTC(fy, (fm ?? 1) - 1, fd ?? 1);
  const to = Date.UTC(ty, (tm ?? 1) - 1, td ?? 1);
  return Math.round((to - from) / 86_400_000);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percentage(part: number, total: number): number {
  if (total <= 0) return 0;
  return clamp(Math.round((part / total) * 100), 0, 100);
}

const arabicGregorianFormatter = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const arabicGregorianShortFormatter = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
  day: "numeric",
  month: "short",
});

const arabicWeekdayFormatter = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
  weekday: "long",
});

/** ينسّق تاريخ ISO بالعربية والتقويم الميلادي، مثل: "12 مارس 2026". */
export function formatArabicDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return arabicGregorianFormatter.format(date);
}

/** صيغة مختصرة، مثل: "12 مارس". */
export function formatArabicDateShort(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return arabicGregorianShortFormatter.format(date);
}

export function formatArabicWeekday(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return arabicWeekdayFormatter.format(date);
}

const sarFormatter = new Intl.NumberFormat("ar-SA", {
  maximumFractionDigits: 0,
});

/** ينسّق مبلغًا بالريال السعودي، مثل: "2,850 ر.س". */
export function formatSAR(amount: number): string {
  return `${sarFormatter.format(Math.round(amount))} ر.س`;
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-SA");

export function formatArabicNumber(value: number): string {
  return arabicNumberFormatter.format(value);
}

/** يصوغ عدد الأيام بصيغة عربية سليمة (اليوم / يوم واحد / يومان / 3 أيام / 11 يومًا...). */
export function formatDaysLabel(days: number): string {
  const abs = Math.abs(Math.round(days));
  if (abs === 0) return "اليوم";
  if (abs === 1) return "يوم واحد";
  if (abs === 2) return "يومان";
  if (abs >= 3 && abs <= 10) return `${formatArabicNumber(abs)} أيام`;
  return `${formatArabicNumber(abs)} يومًا`;
}

export function generateId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}
