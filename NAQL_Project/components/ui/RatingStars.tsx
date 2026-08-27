import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatArabicNumber } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, reviewsCount, size = "sm", className }: RatingStarsProps) {
  const starSize = size === "sm" ? "size-3.5" : "size-4";
  const stars = [0, 1, 2, 3, 4];

  return (
    <div className={cn("flex items-center gap-1.5", className || "")}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {stars.map((index) => {
          const fillLevel = clamp01(rating - index);
          return (
            <span key={index} className="relative inline-flex">
              <Star className={cn(starSize, "text-border-strong")} strokeWidth={1.5} />
              {fillLevel > 0 ? (
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillLevel * 100}%` }}>
                  <Star className={cn(starSize, "fill-gold text-gold")} strokeWidth={1.5} />
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
      <span className="text-sm font-medium text-ink">{formatArabicNumber(rating)}</span>
      {typeof reviewsCount === "number" ? (
        <span className="text-xs text-ink-muted">({formatArabicNumber(reviewsCount)} تقييم)</span>
      ) : null}
    </div>
  );
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}
