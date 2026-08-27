import { CalendarClock, ClipboardCheck, Store, Wallet } from "lucide-react";

const AREAS = [
  {
    icon: ClipboardCheck,
    title: "التجهيز",
    description: "اعرف ما تحتاج لإنجازه قبل موعد الانتقال.",
  },
  {
    icon: CalendarClock,
    title: "المهام والمواعيد",
    description: "نظّم مهامك ومواعيدك المهمة في مكان واحد.",
  },
  {
    icon: Wallet,
    title: "الميزانية",
    description: "تابع تكاليف انتقالك وخطط مصروفاتك بوضوح.",
  },
  {
    icon: Store,
    title: "الخدمات",
    description: "قارن خيارات النقل والتنظيف والتغليف واختر الأنسب لك.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-b border-border bg-bg py-20 sm:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-bold text-ink sm:text-4xl">
            الانتقال أكثر من مجرد نقل الأثاث
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {AREAS.map((area) => (
            <div key={area.title} className="flex gap-4 rounded-2xl border border-border bg-surface p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                <area.icon className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink">{area.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{area.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-14 max-w-xl text-balance text-center font-display text-xl font-semibold text-ink">
          نَقْل تجمع رحلة انتقالك في تجربة واحدة واضحة.
        </p>
      </div>
    </section>
  );
}
