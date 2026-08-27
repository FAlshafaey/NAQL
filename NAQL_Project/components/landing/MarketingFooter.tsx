import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const COLUMNS = [
  {
    title: "المنصة",
    links: [
      { href: "/services", label: "الخدمات" },
      { href: "/guide", label: "دليل الانتقال" },
      { href: "/advisor", label: "مستشار نَقْل الذكي" },
    ],
  },
  {
    title: "عن نَقْل",
    links: [
      { href: "#how-it-works", label: "كيف تعمل نَقْل" },
      { href: "#about", label: "عن المنصة" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container flex flex-col gap-10 py-14 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            منصة سعودية رقمية تساعدك على تنظيم رحلة انتقالك من مسكن إلى آخر بخطوات واضحة.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-display text-sm font-semibold text-ink">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-muted transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} نَقْل. مشروع تعليمي — جميع بيانات الخدمات في المنصة تجريبية لأغراض العرض.</p>
          <p>صُنع لتسهيل رحلة انتقالك</p>
        </div>
      </div>
    </footer>
  );
}
