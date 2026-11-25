"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Suggested starter chips — one click adds the option. Already-added options render as selected. */
export default function ChoiceChipSelector({
  options,
  selected,
  onPick,
  label = "Suggestions",
}: {
  options: string[];
  selected: string[];
  onPick: (option: string) => void;
  label?: string;
}) {
  const taken = new Set(selected.map((s) => s.toLowerCase()));
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isTaken = taken.has(opt.toLowerCase());
          return (
            <button
              key={opt}
              type="button"
              disabled={isTaken}
              onClick={() => onPick(opt)}
              aria-label={isTaken ? `${opt} (added)` : `Add ${opt}`}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
                isTaken
                  ? "cursor-default border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-dashed border-slate-300 bg-white text-slate-700 hover:border-[#0f0fbd] hover:bg-blue-50/50 hover:text-[#0f0fbd]",
              )}
            >
              {!isTaken && <Plus className="h-3.5 w-3.5" aria-hidden />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
