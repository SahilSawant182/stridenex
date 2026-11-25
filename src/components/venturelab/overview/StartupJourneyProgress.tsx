import Link from "next/link";
import { Check, ChevronRight, Circle, Loader } from "lucide-react";
import type { JourneyStep } from "@/types/venturelab";
import { cn } from "@/lib/utils";
import { Badge, Card } from "../shared/primitives";

const STATUS_STYLE = {
  Completed: { dot: "bg-emerald-500 text-white", badge: "bg-emerald-50 text-emerald-800 ring-emerald-200", line: "bg-emerald-400" },
  "In Progress": { dot: "bg-[#ff6b00] text-white ring-4 ring-orange-100", badge: "bg-amber-50 text-amber-800 ring-amber-200", line: "bg-slate-200" },
  Upcoming: { dot: "bg-white text-slate-400 ring-2 ring-slate-200", badge: "bg-slate-100 text-slate-700 ring-slate-200", line: "bg-slate-200" },
} as const;

export default function StartupJourneyProgress({ steps, ventureName }: { steps: JourneyStep[]; ventureName: string }) {
  const done = steps.filter((s) => s.status === "Completed").length;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Startup Journey</h2>
          <p className="text-sm text-slate-600">{ventureName}</p>
        </div>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 tabular-nums">
          {done}/{steps.length}
        </span>
      </div>

      <ol className="mt-5">
        {steps.map((step, i) => {
          const s = STATUS_STYLE[step.status];
          const last = i === steps.length - 1;
          return (
            <li key={step.key} className="relative flex gap-4 pb-1">
              {!last && <span className={cn("absolute left-[17px] top-10 h-[calc(100%-32px)] w-0.5", s.line)} aria-hidden />}
              <span className={cn("relative z-10 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", s.dot)}>
                {step.status === "Completed" ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : step.status === "In Progress" ? (
                  <Loader className="h-4 w-4" aria-hidden />
                ) : (
                  <Circle className="h-3 w-3" aria-hidden />
                )}
              </span>
              <Link
                href={step.href}
                className="group -mx-2 mb-3 flex min-h-11 flex-1 items-start justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">
                    {i + 1}. {step.title}
                  </span>
                  <span className="block text-xs text-slate-600">{step.description}</span>
                  <Badge className={cn("mt-1.5", s.badge)}>{step.status}</Badge>
                </span>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
