import { Globe2, ShieldCheck, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "بدون حساب أو تسجيل" },
  { icon: Sparkles, label: "مقارنة خدمات مدعومة بالذكاء الاصطناعي" },
  { icon: Globe2, label: "تجربة عربية كاملة بتصميم يراعي الاتجاه من اليمين لليسار" },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-bg py-20 sm:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-teal">عن نَقْل</p>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold text-ink sm:text-4xl">
            منصة تخطيط، لا شركة نقل
          </h2>
          <p className="mt-5 text-balance leading-relaxed text-ink-muted">
            نَقْل منصة سعودية رقمية لتنظيم رحلة الانتقال من مسكن إلى آخر. لسنا شركة نقل أثاث، بل مساحة واحدة
            تساعدك على التخطيط، متابعة تجهيزاتك، إدارة ميزانيتك، ومقارنة خدمات الانتقال المتاحة لاتخاذ قرار
            أنسب لظروفك وأولوياتك.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
          {HIGHLIGHTS.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink-muted"
            >
              <item.icon className="size-4 text-primary" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
