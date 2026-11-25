"use client";

import { Banknote, CheckCircle2, Clock, FlaskConical, Flag, Megaphone, Rocket, type LucideIcon } from "lucide-react";
import type { Milestone, RoadmapTemplateId } from "@/types/venturelab";
import { ROADMAP_TEMPLATES, ROADMAP_TEMPLATE_ORDER } from "@/lib/venturelab/constants";
import { roadmapCompletion } from "@/lib/venturelab/utils";
import { cn } from "@/lib/utils";
import { ProgressBar } from "../shared/primitives";

const ICONS: Record<RoadmapTemplateId, LucideIcon> = {
  "mvp-launch": Rocket,
  "validation-sprint": FlaskConical,
  "gtm-launch": Megaphone,
  fundraising: Banknote,
};

export default function RoadmapTemplateSelector({
  active,
  roadmaps,
  onSelect,
}: {
  active: RoadmapTemplateId;
  roadmaps: Record<RoadmapTemplateId, Milestone[]>;
  onSelect: (id: RoadmapTemplateId) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Roadmap template" className="vl-scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
      {ROADMAP_TEMPLATE_ORDER.map((id) => {
        const meta = ROADMAP_TEMPLATES[id];
        const ms = roadmaps[id];
        const pct = roadmapCompletion(ms);
        const weeks = Math.max(meta.durationWeeks, ...ms.map((m) => m.endWeek));
        const Icon = ICONS[id];
        const selected = id === active;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(id)}
            className={cn(
              "relative flex w-[78%] shrink-0 snap-start flex-col rounded-2xl border bg-white p-4 text-left shadow-sm transition-all sm:w-auto",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0fbd]",
              selected ? "border-[#0f0fbd] ring-1 ring-[#0f0fbd]" : "border-slate-200 hover:border-slate-300 hover:shadow-md",
            )}
          >
            {selected && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#0f0fbd] px-2 py-0.5 text-[11px] font-bold text-white">
                <CheckCircle2 className="h-3 w-3" aria-hidden /> Active
              </span>
            )}
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", selected ? "bg-[#0f0fbd] text-white" : "bg-slate-100 text-slate-700")}>
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="mt-3 text-sm font-bold text-slate-900">{meta.name}</span>
            <span className="mt-0.5 line-clamp-2 text-xs text-slate-600">{meta.description}</span>
            <span className="mt-3 flex items-center gap-3 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden /> {weeks} weeks
              </span>
              <span className="inline-flex items-center gap-1">
                <Flag className="h-3.5 w-3.5" aria-hidden /> {ms.length} milestones
              </span>
            </span>
            <span className="mt-3 flex items-center gap-2">
              <ProgressBar value={pct} tone={pct === 100 ? "success" : selected ? "primary" : "accent"} label={`${meta.name} completion`} />
              <span className="w-9 shrink-0 text-right text-xs font-bold text-slate-900 tabular-nums">{pct}%</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
