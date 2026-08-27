"use client";

import { Info, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Field";
import { ProviderCard } from "@/components/services/ProviderCard";
import { useJourney } from "@/context/JourneyContext";
import { SERVICE_PROVIDERS } from "@/data/providers";
import { formatArabicNumber } from "@/lib/utils";
import { CITIES, SERVICE_CATEGORIES, type CityName, type ServiceCategory } from "@/types";

type PriceBand = "all" | "under-200" | "200-500" | "500-800" | "over-800";
type RatingFilter = "all" | "4" | "4.5";

const PRICE_BANDS: { value: PriceBand; label: string }[] = [
  { value: "all", label: "كل الأسعار" },
  { value: "under-200", label: "أقل من 200 ر.س" },
  { value: "200-500", label: "200 - 500 ر.س" },
  { value: "500-800", label: "500 - 800 ر.س" },
  { value: "over-800", label: "أكثر من 800 ر.س" },
];

function matchesPriceBand(price: number, band: PriceBand): boolean {
  switch (band) {
    case "under-200":
      return price < 200;
    case "200-500":
      return price >= 200 && price <= 500;
    case "500-800":
      return price > 500 && price <= 800;
    case "over-800":
      return price > 800;
    default:
      return true;
  }
}

export default function ServicesPage() {
  const { journey } = useJourney();
  const [category, setCategory] = useState<ServiceCategory | "all">("all");
  const [city, setCity] = useState<CityName | "all">(journey?.destinationCity ?? "all");
  const [priceBand, setPriceBand] = useState<PriceBand>("all");
  const [minRating, setMinRating] = useState<RatingFilter>("all");

  const filtered = useMemo(() => {
    const minRatingValue = minRating === "all" ? 0 : Number(minRating);
    return SERVICE_PROVIDERS.filter((provider) => {
      if (category !== "all" && provider.category !== category) return false;
      if (city !== "all" && provider.city !== city) return false;
      if (!matchesPriceBand(provider.startingPrice, priceBand)) return false;
      if (provider.rating < minRatingValue) return false;
      return true;
    }).sort((a, b) => b.rating - a.rating);
  }, [category, city, priceBand, minRating]);

  const hasActiveFilters = category !== "all" || city !== "all" || priceBand !== "all" || minRating !== "all";

  function resetFilters() {
    setCategory("all");
    setCity("all");
    setPriceBand("all");
    setMinRating("all");
  }

  return (
    <div className="container flex flex-col gap-6 py-8 sm:py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">خدمات الانتقال</h1>
        <p className="mt-1 text-sm text-ink-muted">قارن مزودي خدمات النقل والتنظيف والتغليف والتخزين، وصفِّ حسب ما يهمك.</p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-info-light px-3 py-1.5 text-xs font-medium text-info">
          <Info className="size-3.5" />
          بيانات المزودين في هذه الصفحة تجريبية بالكامل لأغراض العرض
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-4">
        <Select aria-label="الفئة" value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory | "all")}>
          <option value="all">جميع الفئات</option>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select aria-label="المدينة" value={city} onChange={(e) => setCity(e.target.value as CityName | "all")}>
          <option value="all">جميع المدن</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select aria-label="نطاق السعر" value={priceBand} onChange={(e) => setPriceBand(e.target.value as PriceBand)}>
          {PRICE_BANDS.map((band) => (
            <option key={band.value} value={band.value}>
              {band.label}
            </option>
          ))}
        </Select>

        <Select aria-label="الحد الأدنى للتقييم" value={minRating} onChange={(e) => setMinRating(e.target.value as RatingFilter)}>
          <option value="all">كل التقييمات</option>
          <option value="4">4 فأعلى</option>
          <option value="4.5">4.5 فأعلى</option>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{formatArabicNumber(filtered.length)} من مزودي الخدمات</p>
        {hasActiveFilters ? (
          <button type="button" onClick={resetFilters} className="text-sm font-medium text-primary hover:underline">
            إعادة تعيين الفلاتر
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<SearchX className="size-6" />}
          title="لا توجد نتائج مطابقة"
          description="جرّب توسيع نطاق السعر أو التقييم، أو اختر فئة أو مدينة مختلفة."
          action={
            <Button size="sm" variant="outline" onClick={resetFilters}>
              إعادة تعيين الفلاتر
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}
