"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatSAR } from "@/lib/utils";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types";

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  "نقل الأثاث": "#0B4332",
  التنظيف: "#3F6E67",
  التغليف: "#B8862E",
  المستلزمات: "#3D6B8C",
  الأجهزة: "#3F8F5F",
  أخرى: "#8A9089",
};

interface BudgetChartProps {
  byCategory: Partial<Record<ExpenseCategory, number>>;
}

export function BudgetChart({ byCategory }: BudgetChartProps) {
  const data = EXPENSE_CATEGORIES.map((category) => ({
    name: category,
    value: byCategory[category] ?? 0,
  })).filter((entry) => entry.value > 0);

  if (data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-sm text-ink-muted">لا توجد مصروفات مسجلة بعد.</div>;
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="h-56 w-full shrink-0 sm:w-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} strokeWidth={0}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatSAR(value)}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E4E0D5",
                fontFamily: "var(--font-body)",
                direction: "rtl",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-1 flex-col gap-2.5">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[entry.name] }} />
              {entry.name}
            </span>
            <span className="font-medium text-ink">{formatSAR(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
