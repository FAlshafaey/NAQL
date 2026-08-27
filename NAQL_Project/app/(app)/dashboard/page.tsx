"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Gauge,
  MapPin,
  MessageCircleQuestion,
  Package,
  Sparkles,
  Store,
  BookOpen,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StageIndicator } from "@/components/dashboard/StageIndicator";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAssistantPanel } from "@/context/AssistantPanelContext";
import { useJourney } from "@/context/JourneyContext";
import {
  computeBudgetSummary,
  computeDaysRemaining,
  computePackingProgress,
  computeStage,
  computeTaskProgress,
  nextUpcomingTask,
  stageStatuses,
} from "@/lib/journey-metrics";
import { formatArabicDate, formatDaysLabel, formatSAR } from "@/lib/utils";
import { PRIORITY_TONE } from "@/lib/task-ui";

const QUICK_LINKS = [
  { href: "/tasks", label: "مهامي", icon: ClipboardList },
  { href: "/packing", label: "التغليف", icon: Boxes },
  { href: "/budget", label: "الميزانية", icon: Wallet },
  { href: "/services", label: "الخدمات", icon: Store },
  { href: "/guide", label: "دليل نَقْل", icon: BookOpen },
];

export default function DashboardPage() {
  const journey = useJourney();
  const { openAssistant } = useAssistantPanel();

  if (!journey.hasStarted || !journey.journey) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={<Package className="size-6" />}
          title="لم تبدأ رحلة انتقالك بعد"
          description="أجب عن بضعة أسئلة سريعة عن انتقالك القادم، وسننشئ لك خطة، مهامًا، وتغليفًا وميزانية جاهزة للمتابعة."
          action={<Button href="/start">ابدأ رحلة انتقالك</Button>}
        />
      </div>
    );
  }

  const { journey: info, tasks, packingRooms, budgetTotal, expenses } = journey;
  const daysRemaining = computeDaysRemaining(info);
  const stage = computeStage(info);
  const stages = stageStatuses(stage);
  const taskProgress = computeTaskProgress(tasks);
  const packingProgress = computePackingProgress(packingRooms);
  const budgetSummary = computeBudgetSummary(budgetTotal, expenses);
  const nextTask = nextUpcomingTask(tasks);

  const daysMessage =
    daysRemaining > 0
      ? `متبقي ${formatDaysLabel(daysRemaining)}`
      : daysRemaining === 0
        ? "اليوم هو يوم انتقالك"
        : `مضى ${formatDaysLabel(daysRemaining)} على انتقالك`;

  return (
    <div className="container flex flex-col gap-8 py-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">رحلة انتقالك</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              {info.currentCity} إلى {info.destinationCity}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatArabicDate(info.movingDate)}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={openAssistant} icon={<MessageCircleQuestion className="size-4" />}>
          اسأل مستشار نَقْل
        </Button>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">مراحل رحلتك</h2>
          <span className="text-sm font-medium text-primary">{daysMessage}</span>
        </div>
        <StageIndicator stages={stages} />
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="الأيام المتبقية"
          value={daysRemaining >= 0 ? formatDaysLabel(daysRemaining) : "انتقلت"}
          tone="primary"
        />
        <StatCard
          icon={Gauge}
          label="التقدم العام"
          value={`${taskProgress.percentage}%`}
          hint={`${taskProgress.completed} من ${taskProgress.total} مهمة مكتملة`}
          tone="teal"
        />
        <StatCard
          icon={Wallet}
          label="الميزانية المقدّرة"
          value={formatSAR(budgetSummary.remaining)}
          hint={`من أصل ${formatSAR(budgetSummary.total)}`}
          tone="gold"
        />
        <StatCard
          icon={Boxes}
          label="تقدّم التغليف"
          value={`${packingProgress.percentage}%`}
          hint={`${packingProgress.completedItems} من ${packingProgress.totalItems} عنصرًا`}
          tone="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">المهمة القادمة</h2>
            <Link href="/tasks" className="text-sm font-medium text-primary hover:underline">
              عرض كل المهام
            </Link>
          </div>

          {nextTask ? (
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary-dark">
                  <ClipboardCheck className="size-4" />
                </span>
                <div>
                  <p className="font-medium text-ink">{nextTask.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">{nextTask.category}</Badge>
                    <Badge tone={PRIORITY_TONE[nextTask.priority]}>{nextTask.priority}</Badge>
                    <span className="text-xs text-ink-muted">{formatArabicDate(nextTask.dueDate)}</span>
                  </div>
                </div>
              </div>
              <Button href="/tasks" variant="outline" size="sm" icon={<ArrowLeft className="size-4" />} iconPosition="end">
                فتح المهام
              </Button>
            </div>
          ) : (
            <EmptyState
              icon={<ClipboardCheck className="size-6" />}
              title="أنجزت جميع مهامك!"
              description="لا توجد مهام معلّقة حاليًا. أضف مهمة جديدة إن احتجت."
              action={
                <Button href="/tasks" size="sm">
                  إضافة مهمة
                </Button>
              }
            />
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-ink-muted">تقدّم المهام</span>
                <span className="font-medium text-ink">{taskProgress.percentage}%</span>
              </div>
              <ProgressBar value={taskProgress.percentage} tone="primary" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-ink-muted">تقدّم التغليف</span>
                <span className="font-medium text-ink">{packingProgress.percentage}%</span>
              </div>
              <ProgressBar value={packingProgress.percentage} tone="success" />
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4 rounded-2xl border border-primary bg-primary p-6 text-white shadow-card">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold">مستشار نَقْل الذكي</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/80">
              قارن مزودي الخدمات المتاحين حسب السعر والجودة والتقييم، واحصل على ترشيح مبني على أولوياتك.
            </p>
          </div>
          <Button href="/advisor" variant="inverse" fullWidth>
            قارن الخيارات بالذكاء الاصطناعي
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">وصول سريع</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-surface p-5 text-center transition-colors hover:border-primary/40 hover:bg-primary-light/40"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-surface-muted text-primary">
                <link.icon className="size-5" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-ink">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
