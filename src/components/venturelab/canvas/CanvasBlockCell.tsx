"use client";

import { useState } from "react";
import { BadgeCheck, Check, FlaskConical, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { BmcBlockId } from "@/types/venturelab";
import type { CanvasNote } from "@/services/canvas.services";
import { BMC_ACCENTS, BMC_BLOCKS, BMC_ICONS } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { VLButton } from "../shared/primitives";
import { errMsg } from "./useCanvas";

export interface BlockActions {
  onAdd: (block: BmcBlockId, text: string, isAssumption: boolean) => Promise<void>;
  onUpdate: (block: BmcBlockId, note: CanvasNote, patch: { item_text?: string; is_assumption?: number }) => Promise<void>;
  onDelete: (block: BmcBlockId, note: CanvasNote) => Promise<void>;
}

const fieldClass =
  "w-full min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0f0fbd] focus:ring-4 focus:ring-[#0f0fbd]/10";

/** Small square icon button used on notes. */
function NoteIcon({ label, onClick, danger, children, type = "button", disabled }: { label: string; onClick?: () => void; danger?: boolean; children: React.ReactNode; type?: "button" | "submit"; disabled?: boolean }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0fbd]/40 disabled:opacity-40",
        danger ? "hover:text-red-600" : "hover:text-[#0f0fbd]",
      )}
    >
      {children}
    </button>
  );
}

/** Assumption / Validated status. As a button it flips the status. */
function StatusPill({ assumption, onToggle }: { assumption: boolean; onToggle?: () => void }) {
  const Icon = assumption ? FlaskConical : BadgeCheck;
  const body = (
    <>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {assumption ? "Assumption" : "Validated"}
    </>
  );
  const tone = assumption
    ? "bg-amber-100 text-amber-800 ring-amber-300/60"
    : "bg-emerald-100 text-emerald-800 ring-emerald-300/60";
  if (!onToggle) {
    return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset", tone)}>{body}</span>;
  }
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${assumption ? "Assumption" : "Validated"} — mark as ${assumption ? "validated" : "assumption"}`}
      title={assumption ? "Tested it with real users? Tap to mark as validated" : "Tap to mark as an assumption again"}
      className={cn(
        "group/pill inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold ring-1 ring-inset transition active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0fbd]/50",
        tone,
        assumption ? "hover:bg-amber-200" : "hover:bg-emerald-200",
      )}
    >
      {body}
      <span aria-hidden className="hidden text-[10px] font-semibold opacity-70 lg:group-hover/pill:inline">
        · {assumption ? "validate" : "undo"}
      </span>
    </button>
  );
}

/** One sticky note: text (tap to edit), status pill, edit/delete. */
function Note({ block, note, readOnly, actions }: { block: BmcBlockId; note: CanvasNote; readOnly?: boolean; actions?: BlockActions }) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.item_text);
  const [saving, setSaving] = useState(false);
  const assumption = !!note.is_assumption;

  const startEdit = () => {
    setText(note.item_text);
    setEditing(true);
  };

  const saveText = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = text.trim();
    if (!actions || !clean || clean === note.item_text) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await actions.onUpdate(block, note, { item_text: clean });
      setEditing(false);
    } catch (err) {
      showToast(`Couldn’t save the note: ${errMsg(err)}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const toggle = () =>
    actions?.onUpdate(block, note, { is_assumption: assumption ? 0 : 1 }).catch((err) => showToast(`Couldn’t update the note: ${errMsg(err)}`, "error"));

  const remove = () => actions?.onDelete(block, note).catch((err) => showToast(`Couldn’t delete the note: ${errMsg(err)}`, "error"));

  if (editing) {
    return (
      <li className="rounded-xl border border-[#0f0fbd]/30 bg-white p-2 shadow-sm">
        <form onSubmit={saveText} className="flex items-center gap-1">
          <label htmlFor={`vl-note-${note.row_id}`} className="sr-only">
            Edit note
          </label>
          <input
            id={`vl-note-${note.row_id}`}
            autoFocus
            value={text}
            maxLength={200}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            className={fieldClass}
          />
          <NoteIcon label="Save note" type="submit" disabled={saving || !text.trim()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-[#0f0fbd]" />}
          </NoteIcon>
          <NoteIcon label="Cancel editing" onClick={() => setEditing(false)} disabled={saving}>
            <X className="h-4 w-4" />
          </NoteIcon>
        </form>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "group/note relative overflow-hidden rounded-xl border py-2 pl-3.5 pr-2 text-[13px] leading-snug text-slate-800 transition-colors duration-300",
        "before:absolute before:inset-y-0 before:left-0 before:w-1 before:transition-colors before:duration-300",
        assumption ? "border-amber-200/80 bg-amber-50 before:bg-amber-400" : "border-emerald-200/80 bg-emerald-50 before:bg-emerald-500",
      )}
    >
      {readOnly ? (
        <p className="break-words font-medium">{note.item_text}</p>
      ) : (
        <button
          type="button"
          onClick={startEdit}
          className="w-full break-words text-left font-medium transition-colors hover:text-[#0f0fbd]"
          aria-label={`Edit note: ${note.item_text}`}
        >
          {note.item_text}
        </button>
      )}
      <div className="mt-1.5 flex items-center justify-between gap-1">
        <StatusPill assumption={assumption} onToggle={readOnly ? undefined : toggle} />
        {!readOnly && (
          <span className="-mr-1 flex transition-opacity lg:opacity-0 lg:focus-within:opacity-100 lg:group-hover/note:opacity-100">
            <NoteIcon label={`Edit ${note.item_text}`} onClick={startEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </NoteIcon>
            <NoteIcon label={`Delete ${note.item_text}`} onClick={remove} danger>
              <Trash2 className="h-3.5 w-3.5" />
            </NoteIcon>
          </span>
        )}
      </div>
    </li>
  );
}

export default function CanvasBlockCell({
  id,
  notes,
  readOnly,
  actions,
  revealClass,
}: {
  id: BmcBlockId;
  notes: CanvasNote[];
  readOnly?: boolean;
  actions?: BlockActions;
  revealClass?: string;
}) {
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [assumption, setAssumption] = useState(true);
  const [saving, setSaving] = useState(false);
  const meta = BMC_BLOCKS[id];
  const Icon = BMC_ICONS[id];
  const accent = BMC_ACCENTS[id];
  const validated = notes.filter((n) => !n.is_assumption).length;

  const cancel = () => {
    setAdding(false);
    setDraft("");
    setAssumption(true);
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actions || !draft.trim() || saving) return;
    setSaving(true);
    try {
      await actions.onAdd(id, draft, assumption);
      setDraft(""); // keep the form open for the next note
    } catch (err) {
      showToast(`Couldn’t add the note: ${errMsg(err)}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const segment = (value: boolean, label: string, SegIcon: typeof FlaskConical) => (
    <label
      className={cn(
        "flex min-h-9 min-w-0 cursor-pointer items-center justify-center gap-1 rounded-lg px-1 text-[12px] font-bold transition xl:text-[11px] 2xl:text-[12px]",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#0f0fbd]/40",
        assumption === value
          ? value
            ? "bg-white text-amber-800 shadow-sm ring-1 ring-amber-300"
            : "bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-300"
          : "text-slate-500 hover:text-slate-700",
      )}
    >
      <input type="radio" name={`vl-status-${id}`} value={value ? "assumption" : "validated"} checked={assumption === value} onChange={() => setAssumption(value)} className="sr-only" />
      <SegIcon className="h-3.5 w-3.5 shrink-0 xl:hidden 2xl:block" aria-hidden />
      <span className="truncate">{label}</span>
    </label>
  );

  return (
    <section
      style={{ gridArea: id }}
      aria-label={`${meta.name} (${notes.length} note${notes.length === 1 ? "" : "s"})`}
      className={cn(
        "relative flex h-full min-h-[170px] flex-col overflow-hidden rounded-2xl border bg-white p-3.5 pt-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md",
        id === "vp" ? "border-[#0f0fbd]/25 ring-1 ring-[#0f0fbd]/10" : "border-slate-200/80",
        revealClass,
      )}
    >
      {/* colour strip identifies the block family */}
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", accent.soft)} />

      <header className="flex items-start gap-2.5">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", accent.icon)}>
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-extrabold leading-tight tracking-tight text-slate-900">{meta.name}</h3>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-500 tabular-nums">
            {notes.length === 0 ? "Empty" : `${notes.length} note${notes.length === 1 ? "" : "s"}`}
            {validated > 0 && <span className="text-emerald-700"> · {validated} ✓</span>}
          </p>
        </div>
        {!readOnly && !adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            aria-label={`Add a note to ${meta.name}`}
            title={`Add to ${meta.name}`}
            className="-mr-1 -mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f0fbd]/5 text-[#0f0fbd] transition hover:bg-[#0f0fbd] hover:text-white active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0fbd]/40"
          >
            <Plus className="h-[18px] w-[18px]" aria-hidden />
          </button>
        )}
      </header>

      {notes.length === 0 && !adding ? (
        readOnly ? (
          <p className="mt-3 flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 py-5 text-xs font-medium text-slate-400">Empty in this version</p>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-3 flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 px-3 py-5 text-center text-slate-400 transition hover:border-[#0f0fbd]/40 hover:bg-[#0f0fbd]/[0.03] hover:text-[#0f0fbd]"
          >
            <span className="text-xs font-bold">No items added yet</span>
            <span className="text-[11px] font-medium">Tap to add your first idea</span>
          </button>
        )
      ) : (
        notes.length > 0 && (
          <ul className="mt-3 space-y-2">
            {notes.map((n) => (
              <Note key={n.row_id} block={id} note={n} readOnly={readOnly} actions={actions} />
            ))}
          </ul>
        )
      )}

      {!readOnly && adding && (
        <form onSubmit={add} className="vl-rise mt-2.5 space-y-2 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-200">
          <label htmlFor={`vl-add-${id}`} className="sr-only">
            New {meta.name} note
          </label>
          <input
            id={`vl-add-${id}`}
            autoFocus
            value={draft}
            maxLength={200}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && cancel()}
            placeholder={meta.placeholder || "Type an idea and press Enter"}
            className={fieldClass}
          />
          <fieldset className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/60 p-1">
            <legend className="sr-only">Is this an assumption?</legend>
            {segment(true, "Assumption", FlaskConical)}
            {segment(false, "Validated", BadgeCheck)}
          </fieldset>
          <div className="flex items-center justify-end gap-1.5">
            <VLButton size="sm" variant="ghost" onClick={cancel} disabled={saving}>
              Done
            </VLButton>
            <VLButton size="sm" type="submit" disabled={!draft.trim() || saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Plus className="h-3.5 w-3.5" aria-hidden />} Add
            </VLButton>
          </div>
        </form>
      )}
    </section>
  );
}
