"use client";

import { FlaskConical, Pencil, Plus } from "lucide-react";
import type { BmcBlockId, CanvasItem } from "@/types/venturelab";
import { BMC_ACCENTS, BMC_BLOCKS, BMC_ICONS } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";

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
  const meta = BMC_BLOCKS[id];
  const Icon = BMC_ICONS[id];
  const accent = BMC_ACCENTS[id];
  const empty = items.length === 0;

  const body = (
    <>
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
                empty ? "bg-slate-50 text-slate-500 ring-slate-200" : "bg-slate-900 text-white ring-slate-900",
              )}
            >
              {items.length}
            </span>
          </div>
          <h3 className="text-sm font-bold leading-tight text-slate-900">{meta.name}</h3>
        </div>
        {!readOnly && (
          <span
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-opacity group-hover:bg-slate-100 group-hover:text-[#0f0fbd] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
          >
            <Pencil className="h-4 w-4" />
          </span>
        )}
      </div>

      <p className="mt-1.5 text-xs leading-snug text-slate-500">{meta.description}</p>

      {empty ? (
        <span className="mt-3 flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 py-4 text-xs font-medium text-slate-500">
          {!readOnly && <Plus className="h-3.5 w-3.5" aria-hidden />}
          {readOnly ? "Empty in this version" : "Add your first item"}
        </span>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {items.map((it) => (
            <li key={it.id} className="flex items-start gap-1.5 rounded-md bg-slate-50 px-2 py-1.5 text-[13px] leading-snug text-slate-800">
              <span className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", accent.soft)} aria-hidden />
              <span className="min-w-0 flex-1 break-words">{it.text}</span>
              {it.isAssumption && (
                <span title="Assumption — needs validation" className="shrink-0">
                  <FlaskConical className="mt-0.5 h-3.5 w-3.5 text-amber-600" aria-label="Assumption" />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const shell = cn(
    "group flex h-full min-h-[160px] flex-col rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm",
    revealClass,
  );

  if (readOnly) {
    return (
      <section style={{ gridArea: id }} aria-label={meta.name} className={shell}>
        {body}
      </section>
    );
  }

  return (
    <button
      type="button"
      style={{ gridArea: id }}
      onClick={() => onEdit(id)}
      aria-label={`Edit ${meta.name} (${items.length} item${items.length === 1 ? "" : "s"})`}
      className={cn(
        shell,
        "transition-[box-shadow,border-color] hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0fbd]",
      )}
    >
      {body}
    </button>
  );
}
