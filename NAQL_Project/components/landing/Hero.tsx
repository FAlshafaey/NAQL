import { Fragment } from "react";
import { ChevronLeft, House, PackageSearch, SquareCheckBig, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";

const JOURNEY_STEPS = [
  { icon: House, label: "المسكن الحالي" },
  { icon: PackageSearch, label: "التجهيز" },
  { icon: Truck, label: "يوم النقل" },
  { icon: SquareCheckBig, label: "المسكن الجديد" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_top,_theme(colors.primary.light)_0%,_transparent_55%)] opacity-60" />
      <div className="container relative flex flex-col items-center gap-10 py-20 text-center sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-4 py-1.5 text-xs font-medium text-ink-muted">
          منصة سعودية لتنظيم رحلة الانتقال
        </span>

        <h1 className="max-w-3xl text-balance font-display text-4xl font-bold leading-tight text-ink sm:text-5xl md:text-6xl">
          انتقالك لمسكن جديد، أصبح أسهل.
        </h1>

        <p className="max-w-2xl text-balance text-lg leading-relaxed text-ink-muted">
          نَقْل تساعدك على تنظيم رحلة انتقالك، متابعة تجهيزاتك، إدارة ميزانيتك، ومقارنة خدمات الانتقال من مكان واحد.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button href="/start" size="lg">
            ابدأ رحلة انتقالك
          </Button>
          <Button href="#how-it-works" size="lg" variant="outline">
            اكتشف كيف تعمل نَقْل
          </Button>
        </div>

        <div className="mt-6 flex w-full max-w-3xl flex-col items-stretch gap-4 rounded-2xl border border-border bg-bg p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:p-8">
          {JOURNEY_STEPS.map((step, index) => (
            <Fragment key={step.label}>
              <div className="flex flex-1 items-center gap-4 sm:flex-col sm:gap-3 sm:text-center">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-primary shadow-card">
                  <step.icon className="size-6" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-ink">{step.label}</span>
              </div>
              {index < JOURNEY_STEPS.length - 1 ? (
                <ChevronLeft className="hidden size-5 shrink-0 text-ink-faint sm:block" aria-hidden="true" />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
