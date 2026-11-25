"use client";

import { useState } from "react";
import { FlaskConical, HelpCircle, Plus, Trash2 } from "lucide-react";
import type { BmcBlockId, CanvasItem } from "@/types/venturelab";
import { BMC_ACCENTS, BMC_BLOCKS, BMC_ICONS } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";
import { useVentureLab } from "../VentureLabProvider";
import { IconButton, Sheet, VLButton, inputClass } from "../shared/primitives";
import ChoiceChipSelector from "../discovery/ChoiceChipSelector";

export default function BlockEditorDrawer({
  blockId,
  items,
  onOpenChange,
}: {
  blockId: BmcBlockId | null;
  items: CanvasItem[];
  onOpenChange: (open: boolean) => void;
}) {
  const { addCanvasItem, removeCanvasItem, toggleAssumption } = useVentureLab();
  const [draft, setDraft] = useState("");
  const [asAssumption, setAsAssumption] = useState(false);

  const meta = blockId ? BMC_BLOCKS[blockId] : null;
  const Icon = blockId ? BMC_ICONS[blockId] : HelpCircle;

  const add = (text: string, assumption = asAssumption) => {
    if (!blockId || !text.trim()) return;
    addCanvasItem(blockId, text, assumption);
    setDraft("");
  };

  return (
    <Sheet
      open={blockId !== null}
      onOpenChange={(o) => {
        if (!o) {
          setDraft("");
          setAsAssumption(false);
        }
        onOpenChange(o);
      }}
      title={meta?.name ?? ""}
      description={meta?.description}
      widthClass="sm:max-w-[460px]"
      header={
        meta && (
          <div className="mb-2 flex items-center gap-2">
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", BMC_ACCENTS[meta.id].icon)}>
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Block {meta.number} of 9</span>
          </div>
        )
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">Edits update your working canvas. Saved versions stay untouched until you click Save Canvas.</p>
          <VLButton onClick={() => onOpenChange(false)}>Done</VLButton>
        </div>
      }
    >
      {meta && blockId && (
        <div className="space-y-6">
          {/* Items */}
          <section aria-labelledby="vl-drawer-items">
            <h3 id="vl-drawer-items" className="mb-2 text-sm font-bold text-slate-900">
              Items <span className="font-medium text-slate-500">({items.length})</span>
            </h3>
            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-500">No items yet.</p>
            ) : (
              <ul className="space-y-2" aria-live="polite">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className={cn(
                      "flex items-center gap-1 rounded-xl border py-1 pl-3 pr-1",
                      it.isAssumption ? "border-amber-200 bg-amber-50/60" : "border-slate-200 bg-white",
                    )}
                  >
                    <span className="min-w-0 flex-1 break-words text-sm text-slate-800">{it.text}</span>
                    <IconButton
                      label={it.isAssumption ? `Unflag ${it.text} as assumption` : `Flag ${it.text} as assumption`}
                      aria-pressed={it.isAssumption}
                      onClick={() => toggleAssumption(blockId, it.id)}
                      className={cn(it.isAssumption && "text-amber-700 hover:bg-amber-100 hover:text-amber-800")}
                    >
                      <FlaskConical className="h-4 w-4" />
                    </IconButton>
                    <IconButton label={`Delete ${it.text}`} tone="danger" onClick={() => removeCanvasItem(blockId, it.id)}>
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Add */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add(draft);
            }}
            className="space-y-2"
          >
            <label htmlFor="vl-drawer-input" className="text-sm font-bold text-slate-900">
              Add an item
            </label>
            <div className="flex gap-2">
              <input
                id="vl-drawer-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={meta.placeholder}
                maxLength={120}
                className={inputClass}
              />
              <VLButton type="submit" disabled={!draft.trim()} aria-label="Add item">
                <Plus className="h-4 w-4" aria-hidden />
              </VLButton>
            </div>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={asAssumption}
                onChange={(e) => setAsAssumption(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 accent-amber-600"
              />
              <FlaskConical className="h-4 w-4 text-amber-600" aria-hidden />
              Mark as an assumption to validate
            </label>
          </form>

          {/* Guiding questions */}
          <section aria-labelledby="vl-drawer-questions" className="rounded-xl bg-blue-50/60 p-4">
            <h3 id="vl-drawer-questions" className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#0f0fbd]">
              <HelpCircle className="h-4 w-4" aria-hidden /> Guiding questions
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {meta.guidingQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </section>

          <ChoiceChipSelector options={meta.suggestions} selected={items.map((i) => i.text)} onPick={(s) => add(s, false)} />
        </div>
      )}
    </Sheet>
  );
}
