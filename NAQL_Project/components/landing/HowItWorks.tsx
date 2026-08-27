const STAGES = [
  { number: "01", title: "خطط", description: "حدد موعد انتقالك ومعلومات المسكن." },
  { number: "02", title: "جهّز", description: "نظّم مهامك وتغليفك وميزانيتك." },
  { number: "03", title: "انقل", description: "تابع يوم الانتقال والخدمات المرتبطة به." },
  { number: "04", title: "استقر", description: "أكمل تجهيز مسكنك الجديد." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border bg-surface py-20 sm:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-teal">كيف تعمل نَقْل</p>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold text-ink sm:text-4xl">
            رحلتك في أربع مراحل
          </h2>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl ps-16 sm:ps-0">
          <div className="absolute inset-y-0 start-7 w-px bg-border sm:hidden" aria-hidden="true" />
          <div className="absolute top-7 hidden h-px bg-border sm:block sm:inset-x-6" aria-hidden="true" />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-4 sm:gap-6">
            {STAGES.map((stage) => (
              <div key={stage.number} className="relative -ms-16 flex gap-4 sm:ms-0 sm:flex-col sm:items-center sm:gap-4 sm:text-center">
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface font-display text-lg font-bold text-primary shadow-card">
                  {stage.number}
                </span>
                <div className="sm:px-2">
                  <h3 className="font-display text-base font-semibold text-ink">{stage.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
