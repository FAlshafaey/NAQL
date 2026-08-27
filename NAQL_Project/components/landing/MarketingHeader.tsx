"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  { href: "#top", label: "الرئيسية" },
  { href: "#how-it-works", label: "كيف تعمل نَقْل" },
  { href: "/services", label: "الخدمات" },
  { href: "/guide", label: "دليل الانتقال" },
  { href: "#about", label: "عن نَقْل" },
];

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Button href="/start" size="sm">
              ابدأ رحلة انتقالك
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="فتح القائمة"
            aria-expanded={mobileOpen}
            className="flex size-10 items-center justify-center rounded-xl border border-border text-ink lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-border px-4 py-3 lg:hidden" aria-label="التنقل الرئيسي - جوال">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface-muted hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/start"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-white"
            >
              ابدأ رحلة انتقالك
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
