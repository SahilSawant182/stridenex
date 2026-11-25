"use client";

import { Sparkles } from "lucide-react";
import type { BmcBlockId, CanvasBlocks } from "@/types/venturelab";
import { BMC_ACCENTS, BMC_BLOCKS, BMC_ICONS, BMC_STORY_ORDER } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";
import { Card, ProgressBar } from "../shared/primitives";

/**
 * A "shadow" canvas that lights up as the founder answers each wizard question.
 * Always uses the true 10-column Osterwalder layout — it's a thumbnail.
 */
export default function LiveCanvasPreview({
  blocks,
  clarity,
  focusBlock,
  onSelectBlock,
}: {
  blocks: CanvasBlocks;
  clarity: number;
  focusBlock: BmcBlockId | null;
  onSelectBlock: (id: BmcBlockId) => void;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-1.5 text-base font-bold text-slate-900">
            <Sparkles className="h-4 w-4 text-[#ff6b00]" aria-hidden /> Your canvas is unfolding
          </h2>
          <p className="text-sm text-slate-600">Each answer lights up a block of your business model.</p>
        </div>
      </div>

      <div className="vl-bmc-mini aspect-[16/10] w-full">
        {BMC_STORY_ORDER.map((id) => {
          const meta = BMC_BLOCKS[id];
          const Icon = BMC_ICONS[id];
          const count = blocks[id].length;
          const lit = count > 0;
          const focused = focusBlock === id;
          return (
            <button
              key={id}
              type="button"
              style={{ gridArea: id }}
              onClick={() => onSelectBlock(id)}
              aria-label={`${meta.name}: ${count} item${count === 1 ? "" : "s"}. Go to this question`}
              className={cn(
                "relative flex min-h-11 flex-col items-start justify-between overflow-hidden rounded-lg border p-1.5 text-left transition-all duration-500 sm:p-2",
                lit ? "border-transparent text-white shadow-sm" : "border-dashed border-slate-300 bg-slate-50 text-slate-500",
                lit && BMC_ACCENTS[id].soft,
                focused && "ring-2 ring-[#ff6b00] ring-offset-2",
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", !lit && "opacity-60")} aria-hidden />
              <span className="w-full">
                <span className="block truncate text-[10px] font-semibold leading-tight sm:text-[11px]">{meta.shortName}</span>
                {lit && <span className="block text-[10px] font-bold opacity-90 tabular-nums">{count}</span>}
              </span>
              {focused && <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden />}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">Idea clarity</span>
          <span className="font-bold text-slate-900 tabular-nums">{clarity}% Clarity</span>
        </div>
        <ProgressBar value={clarity} tone={clarity === 100 ? "success" : "accent"} label="Idea clarity" />
        <p className="mt-2 text-xs text-slate-500">
          {clarity === 100
            ? "Every block has a first answer. Time to pressure-test it on the canvas."
            : "Clarity grows as you answer the raw thought and each of the 9 blocks."}
        </p>
      </div>
    </Card>
  );
}
