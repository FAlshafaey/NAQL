import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatSAR } from "@/lib/utils";
import type { ServiceProvider } from "@/types";

const QUALITY_TONE: Record<ServiceProvider["qualityIndicator"], "neutral" | "teal" | "gold"> = {
  قياسي: "neutral",
  موثوق: "teal",
  ممتاز: "gold",
};

export function ProviderCard({ provider }: { provider: ServiceProvider }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">{provider.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {provider.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {provider.estimatedDurationHours <= 1 ? "حسب الطلب" : `${provider.estimatedDurationHours} ساعات تقريبًا`}
            </span>
          </div>
        </div>
        <Badge tone={QUALITY_TONE[provider.qualityIndicator]}>{provider.qualityIndicator}</Badge>
      </div>

      <RatingStars rating={provider.rating} reviewsCount={provider.reviewsCount} />

      <div className="flex flex-wrap gap-1.5">
        {provider.features.slice(0, 3).map((feature) => (
          <Badge key={feature} tone="neutral">
            {feature}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-ink-muted">يبدأ من</p>
          <p className="font-display text-lg font-bold text-ink">{formatSAR(provider.startingPrice)}</p>
        </div>
        <Badge tone="primary">{provider.category}</Badge>
      </div>
    </div>
  );
}
