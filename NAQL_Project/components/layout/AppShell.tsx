"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Boxes, ClipboardList, LayoutDashboard, Menu, MessageCircleQuestion, Sparkles, Store, BookOpen, Wallet, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { useAssistantPanel } from "@/context/AssistantPanelContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/tasks", label: "مهامي", icon: ClipboardList },
  { href: "/packing", label: "التغليف", icon: Boxes },
  { href: "/budget", label: "الميزانية", icon: Wallet },
  { href: "/services", label: "الخدمات", icon: Store },
  { href: "/guide", label: "دليل نَقْل", icon: BookOpen },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openAssistant } = useAssistantPanel();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        تخطَّ إلى المحتوى الرئيسي
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
                      active ? "bg-primary-light text-primary-dark" : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <Button href="/advisor" size="sm" icon={<Sparkles className="size-4" />}>
                مستشار نَقْل الذكي
              </Button>
            </div>
            <button
              type="button"
              onClick={openAssistant}
              aria-label="اسأل مستشار نَقْل"
              className="flex size-10 items-center justify-center rounded-xl border border-border text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <MessageCircleQuestion className="size-5" />
            </button>
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
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium",
                      active ? "bg-primary-light text-primary-dark" : "text-ink-muted hover:bg-surface-muted"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/advisor"
                onClick={() => setMobileOpen(false)}
                className="mt-1 flex items-center gap-2.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white"
              >
                <Sparkles className="size-4" />
                مستشار نَقْل الذكي
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-ink-faint sm:flex-row">
          <p>نَقْل — مشروع تعليمي بمعرض عرض بيانات تجريبية.</p>
          <p>© {new Date().getFullYear()} نَقْل</p>
        </div>
      </footer>
    </div>
  );
}
