import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../shared/primitives";

export default function MetricKpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "blue" | "orange" | "green" | "violet";
}) {
  const tones = {
    blue: "bg-blue-50 text-[#0f0fbd]",
    orange: "bg-orange-50 text-[#c2410c]",
    green: "bg-emerald-50 text-emerald-700",
    violet: "bg-violet-50 text-violet-700",
  } as const;

  return (
    <Card className="flex flex-col gap-2.5 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-5">
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-600 sm:text-sm">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
    </Card>
  );
}
