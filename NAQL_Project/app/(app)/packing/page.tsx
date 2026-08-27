"use client";

import { BedDouble, Boxes, ShowerHead, Sofa, UtensilsCrossed, Warehouse, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RoomCard } from "@/components/packing/RoomCard";
import { useJourney } from "@/context/JourneyContext";
import { computePackingProgress } from "@/lib/journey-metrics";
import { formatArabicNumber } from "@/lib/utils";

const ROOM_ICONS: Record<string, LucideIcon> = {
  "room-bedroom": BedDouble,
  "room-kitchen": UtensilsCrossed,
  "room-living": Sofa,
  "room-bathroom": ShowerHead,
  "room-storage": Warehouse,
};

export default function PackingPage() {
  const journey = useJourney();
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  if (!journey.hasStarted) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={<Boxes className="size-6" />}
          title="لم تبدأ رحلة انتقالك بعد"
          description="ابدأ رحلتك أولًا لنجهّز لك متابعة تغليف كل غرفة."
          action={<Button href="/start">ابدأ رحلة انتقالك</Button>}
        />
      </div>
    );
  }

  const rooms = journey.packingRooms;
  const overall = computePackingProgress(rooms);

  return (
    <div className="container flex flex-col gap-6 py-8 sm:py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">التغليف</h1>
        <p className="mt-1 text-sm text-ink-muted">تابع تجهيز كل غرفة على حدة وحدّث حالة كل عنصر أولًا بأول.</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">التقدم الإجمالي</p>
          <p className="text-sm font-semibold text-ink">
            {formatArabicNumber(overall.completedItems)} من {formatArabicNumber(overall.totalItems)} عنصرًا ({overall.percentage}%)
          </p>
        </div>
        <ProgressBar value={overall.percentage} tone={overall.percentage === 100 ? "success" : "primary"} />
      </div>

      <div className="flex flex-col gap-3">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            icon={ROOM_ICONS[room.id] ?? Boxes}
            expanded={expandedRoom === room.id}
            onToggleExpand={() => setExpandedRoom((current) => (current === room.id ? null : room.id))}
            onToggleItem={(itemId) => journey.togglePackingItem(room.id, itemId)}
          />
        ))}
      </div>
    </div>
  );
}
