"use client";

import {
  AlertTriangle,
  Award,
  Banknote,
  Loader2,
  MapPin,
  RefreshCcw,
  Scale,
  Sparkles,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField, Input } from "@/components/ui/Field";
import { OptionCard } from "@/components/ui/OptionCard";
import { RatingStars } from "@/components/ui/RatingStars";
import { ProviderCard } from "@/components/services/ProviderCard";
import { useJourney } from "@/context/JourneyContext";
import type { AIErrorPayload } from "@/lib/ai-errors";
import { formatSAR } from "@/lib/utils";
import { AI_PRIORITIES, SERVICE_CATEGORIES, type AIPriority, type CompareResult, type ServiceCategory } from "@/types";
import { SERVICE_PROVIDERS } from "@/data/providers";

type Phase = "form" | "loading" | "results" | "error";

export default function AdvisorPage() {
  const { journey } = useJourney();
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [priority, setPriority] = useState<AIPriority | null>(null);
  const [budgetMax, setBudgetMax] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");

  const canSubmit = category !== null && priority !== null;

  async function handleSubmit() {
    if (!category || !priority) return;
    setPhase("loading");
    try {
      const res = await fetch("/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          priority,
          budgetMax: budgetMax.trim() ? Number(budgetMax) : undefined,
          city: journey?.destinationCity,
        }),
      });

      const payload = (await res.json()) as CompareResult | AIErrorPayload;

      if (!res.ok || "error" in payload) {
        const message = "message" in payload ? payload.message : "تعذر إكمال المقارنة الآن.";
        const code = "error" in payload ? payload.error : "UNKNOWN";
        setErrorMessage(message);
        setErrorCode(code);
        setPhase("error");
        return;
      }

      setResult(payload);
      setPhase("results");
    } catch {
      setErrorMessage("تعذر الاتصال بمستشار نَقْل. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.");
      setErrorCode("UNKNOWN");
      setPhase("error");
    }
  }

  function reset() {
    setPhase("form");
    setResult(null);
  }

  const candidates = category ? SERVICE_PROVIDERS.filter((p) => p.category === category) : [];

  return (
    <div className="container flex flex-col gap-8 py-8 sm:py-10">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
          <Sparkles className="size-6" />
        </span>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">خلّ نَقْل يساعدك تختار.</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
          حدد الخدمة التي تحتاجها وأولوياتك، وسيقارن مستشار نَقْل الخيارات المتاحة لمساعدتك في الوصول إلى أفضل توازن بين
          السعر والجودة.
        </p>
      </div>

      {phase === "form" || phase === "loading" ? (
        <Card className="mx-auto flex w-full max-w-2xl flex-col gap-7 p-6 sm:p-8">
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">ما الخدمة التي تبحث عنها؟</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {SERVICE_CATEGORIES.map((c) => (
                <OptionCard key={c} selected={category === c} onClick={() => setCategory(c)} title={c} className="items-center text-center" />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-ink">ما الأهم بالنسبة لك؟</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {AI_PRIORITIES.map((p) => (
                <OptionCard key={p} selected={priority === p} onClick={() => setPriority(p)} title={p} className="items-center text-center" />
              ))}
            </div>
          </div>

          <FormField label="ميزانيتي القصوى (اختياري)" htmlFor="budget-max" hint="بالريال السعودي">
            <Input
              id="budget-max"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="مثال: 700"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
            />
          </FormField>

          {journey ? (
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-info-light px-3 py-1.5 text-xs font-medium text-info">
              <MapPin className="size-3.5" />
              سيأخذ الترشيح بعين الاعتبار وجهتك: {journey.destinationCity}
            </p>
          ) : null}

          <Button size="lg" disabled={!canSubmit} loading={phase === "loading"} onClick={handleSubmit} icon={<Sparkles className="size-4" />}>
            {phase === "loading" ? "مستشار نَقْل يقارن الخيارات المتاحة…" : "ابحث عن الأنسب ✦"}
          </Button>

          {phase === "loading" ? (
            <div className="flex items-center justify-center gap-2 text-sm text-ink-muted">
              <Loader2 className="size-4 animate-spin" />
              يحلّل مستشار نَقْل {candidates.length} خيارًا متاحًا في هذه الفئة…
            </div>
          ) : null}
        </Card>
      ) : null}

      {phase === "error" ? (
        <Card className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-danger-light text-danger">
            <AlertTriangle className="size-6" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">تعذّر إكمال المقارنة</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{errorMessage}</p>
            {errorCode === "MISSING_API_KEY" ? (
              <p className="mt-2 text-xs text-ink-faint">
                يمكنك تصفح مزودي الخدمات ومقارنتهم يدويًا من صفحة الخدمات في هذه الأثناء.
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" href="/services">
              تصفح الخدمات يدويًا
            </Button>
            <Button onClick={() => (canSubmit ? handleSubmit() : setPhase("form"))} icon={<RefreshCcw className="size-4" />}>
              إعادة المحاولة
            </Button>
          </div>
        </Card>
      ) : null}

      {phase === "results" && result ? (
        <ResultsView result={result} category={category} onReset={reset} />
      ) : null}
    </div>
  );
}

function ResultsView({
  result,
  category,
  onReset,
}: {
  result: CompareResult;
  category: ServiceCategory | null;
  onReset: () => void;
}) {
  const recommended = SERVICE_PROVIDERS.find((p) => p.id === result.recommendedProviderId);
  const cheapest = SERVICE_PROVIDERS.find((p) => p.id === result.cheapestProviderId);
  const highestQuality = SERVICE_PROVIDERS.find((p) => p.id === result.highestQualityProviderId);
  const bestValue = SERVICE_PROVIDERS.find((p) => p.id === result.bestValueProviderId);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <HighlightCard icon={Tag} label="الأقل سعرًا" provider={cheapest} tone="info" />
        <HighlightCard icon={Award} label="الأعلى تقييمًا" provider={highestQuality} tone="gold" />
        <HighlightCard icon={Scale} label="أفضل قيمة" provider={bestValue} tone="success" />
      </div>

      {recommended ? (
        <div className="rounded-2xl border border-primary/30 bg-primary-light p-6 shadow-card sm:p-7">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-sm font-semibold text-primary-dark">ترشيح مستشار نَقْل</p>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-ink">{result.reason}</p>
          <ProviderCard provider={recommended} />
        </div>
      ) : null}

      {result.tradeoffs.length > 0 ? (
        <Card className="p-6">
          <h3 className="mb-3 font-display text-base font-semibold text-ink">نقاط مهمة للموازنة</h3>
          <ul className="flex flex-col gap-2">
            {result.tradeoffs.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                <Banknote className="mt-0.5 size-4 shrink-0 text-ink-faint" />
                {point}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {result.tips.length > 0 ? (
        <Card className="p-6">
          <h3 className="mb-3 font-display text-base font-semibold text-ink">نصائح مستشار نَقْل</h3>
          <ul className="flex flex-col gap-2">
            {result.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <p className="text-center text-xs text-ink-faint">
        الترشيح مبني على بيانات تجريبية لمزودي خدمات {category ?? ""}، وليس نتائج بحث حي في السوق.
      </p>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onReset} icon={<RefreshCcw className="size-4" />}>
          مقارنة جديدة
        </Button>
      </div>
    </div>
  );
}

function HighlightCard({
  icon: Icon,
  label,
  provider,
  tone,
}: {
  icon: typeof Tag;
  label: string;
  provider: (typeof SERVICE_PROVIDERS)[number] | undefined;
  tone: "info" | "gold" | "success";
}) {
  if (!provider) return null;
  const toneClasses = {
    info: "bg-info-light text-info",
    gold: "bg-gold-light text-gold",
    success: "bg-success-light text-success",
  }[tone];

  return (
    <Card className="flex flex-col gap-3 p-5">
      <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses}`}>
        <Icon className="size-3.5" />
        {label}
      </span>
      <p className="font-display text-sm font-semibold text-ink">{provider.name}</p>
      <p className="font-display text-lg font-bold text-ink">{formatSAR(provider.startingPrice)}</p>
      <RatingStars rating={provider.rating} size="sm" />
      <Badge tone="neutral" className="w-fit">
        {provider.city}
      </Badge>
    </Card>
  );
}
