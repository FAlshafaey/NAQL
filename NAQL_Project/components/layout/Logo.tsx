import Link from "next/link";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className || "")}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white transition-transform group-hover:scale-105">
        <Package className="size-5" strokeWidth={2} />
      </span>
      <span className="font-display text-xl font-bold text-ink">نَقْل</span>
    </Link>
  );
}
