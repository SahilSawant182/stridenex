"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { BmcBlockId, CanvasItem } from "@/types/venturelab";
import { BMC_ACCENTS, BMC_BLOCKS, BMC_ICONS } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";
import { useVentureLab } from "../VentureLabProvider";
import { IconButton, VLButton, inputClass } from "../shared/primitives";

/**
 * One canvas block: items as sticky notes, quick "+ Add Item" and delete
 * right in the block. The pencil opens the full editor (guidance, suggestions,
 * assumption toggles).
 */
export default function CanvasBlockCell({
  id,
  items,
  readOnly,
  onEdit,
  revealClass,
}: {
  id: BmcBlockId;
  items: CanvasItem[];
  readOnly?: boolean;
  onEdit: (id: BmcBlockId) => void;
  revealClass?: string;
}) {
  const { addCanvasItem, removeCanvasItem } = useVentureLab();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const meta = BMC_BLOCKS[id];
  const Icon = BMC_ICONS[id];
  const accent = BMC_ACCENTS[id];

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    addCanvasItem(id, draft, true); // quick adds are assumptions until validated
    setDraft("");
  };

  const cancel = () => {
    setAdding(false);
    setDraft("");
  };

  return (
    <section
      style={{ gridArea: id }}
      aria-label={`${meta.name} (${items.length} item${items.length === 1 ? "" : "s"})`}
      className={cn("flex h-full min-h-[160px] flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm", revealClass)}
    >
      <div className="flex items-start gap-2.5">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", accent.icon)}>
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 tabular-nums">{String(meta.number).padStart(2, "0")}</span>
            <span
              className={cn(
                "rounded-full px-1.5 text-[11px] font-bold tabular-nums ring-1 ring-inset",
                items.length === 0 ? "bg-slate-50 text-slate-500 ring-slate-200" : "bg-slate-900 text-white ring-slate-900",
              )}
            >
              {items.length}
            </span>
          </div>
          <h3 className="text-sm font-bold leading-tight text-slate-900">{meta.name}</h3>
        </div>
        {!readOnly && (
          <IconButton label={`Open ${meta.name} editor`} onClick={() => onEdit(id)} className="-mr-1.5 -mt-1 h-9 w-9 text-slate-500 hover:text-[#0f0fbd]">
            <Pencil className="h-4 w-4" />
          </IconButton>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-slate-200 py-4 text-center text-xs font-medium text-slate-500">
          {readOnly ? "Empty in this version" : "No items added yet"}
        </p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {items.map((it) => (
            <li
              key={it.id}
              className="group/note flex items-start gap-1.5 rounded-md border border-amber-100 bg-amber-50/70 py-1.5 pl-2 pr-1 text-[13px] leading-snug text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            >
              <span className="min-w-0 flex-1 break-words">
                {it.text}
                {it.isAssumption && (
                  <span className="ml-1.5 inline-block rounded-full bg-orange-100 px-1.5 align-middle text-[10px] font-bold uppercase tracking-wide text-[#c2410c]">
                    Assumption
                  </span>
                )}
              </span>
              {!readOnly && (
                <IconButton
                  label={`Delete ${it.text}`}
                  onClick={() => removeCanvasItem(id, it.id)}
                  className="-my-1 h-8 w-8 shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600 lg:opacity-0 lg:focus-visible:opacity-100 lg:group-hover/note:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              )}
            </li>
          ))}
        </ul>
      )}

      {!readOnly &&
        (adding ? (
          <form onSubmit={add} className="mt-2 flex gap-1.5">
            <label htmlFor={`vl-add-${id}`} className="sr-only">
              New {meta.name} item
            </label>
            <input
              id={`vl-add-${id}`}
              autoFocus
              value={draft}
              maxLength={120}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && cancel()}
              onBlur={() => !draft.trim() && cancel()}
              placeholder="New item…"
              className={cn(inputClass, "min-h-9 text-[13px]")}
            />
            <VLButton type="submit" size="sm" disabled={!draft.trim()}>
              Add
            </VLButton>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-2 inline-flex min-h-9 items-center gap-1 self-start rounded-lg px-2 text-xs font-semibold text-[#0f0fbd] hover:bg-blue-50"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden /> Add Item
          </button>
        ))}
    </section>
  );
}
