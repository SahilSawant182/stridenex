"use client";

import { useEffect, useState } from "react";
import type { BmcBlockId, CanvasBlocks } from "@/types/venturelab";
import { BMC_BLOCKS, bmcBlockIdByName } from "@/lib/venturelab/constants";
import { emptyCanvas } from "@/lib/venturelab/utils";
import {
  canvasService,
  type ActiveCanvasData,
  type CanvasNote,
  type CanvasNoteBlocks,
  type CanvasVersionSummary,
} from "@/services/canvas.services";

export type NotesByBlock = Record<BmcBlockId, CanvasNote[]>;

export const errMsg = (e: unknown) => (e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.");

const BLOCK_IDS = Object.keys(BMC_BLOCKS) as BmcBlockId[];

/** Block name to send for a new note when the canvas hasn't told us its spelling yet. */
const DEFAULT_BLOCK_NAME: Record<BmcBlockId, string> = {
  ...(Object.fromEntries(BLOCK_IDS.map((id) => [id, BMC_BLOCKS[id].name])) as Record<BmcBlockId, string>),
  kp: "Key Partnerships",
};

const emptyNotes = (): NotesByBlock => Object.fromEntries(BLOCK_IDS.map((id) => [id, []])) as unknown as NotesByBlock;

/** Group backend blocks (keyed by name) by block id; also remember each block's backend spelling. */
function group(blocks: CanvasNoteBlocks) {
  const notes = emptyNotes();
  const names: Partial<Record<BmcBlockId, string>> = {};
  for (const [name, rows] of Object.entries(blocks)) {
    const id = bmcBlockIdByName(name);
    if (!id) continue;
    names[id] = name;
    notes[id].push(...rows);
  }
  return { notes, names };
}

/** Shape the notes for code that still reads the local canvas (Export, Overview progress, search). */
export function toLocalBlocks(notes: NotesByBlock): CanvasBlocks {
  const out = emptyCanvas();
  for (const id of BLOCK_IDS) out[id] = notes[id].map((n) => ({ id: n.row_id, text: n.item_text, isAssumption: !!n.is_assumption }));
  return out;
}

type State = {
  canvas: ActiveCanvasData | null;
  notes: NotesByBlock;
  names: Partial<Record<BmcBlockId, string>>;
  versions: CanvasVersionSummary[];
  loading: boolean;
  error: string | null;
};

type Viewing = { version: CanvasVersionSummary; notes: NotesByBlock } | null;

/**
 * The venture's active canvas + version history, with note CRUD. Render the
 * consumer with `key={ventureId}` so switching ventures reloads.
 */
export function useCanvas(ventureId: string) {
  const [state, setState] = useState<State>({ canvas: null, notes: emptyNotes(), names: {}, versions: [], loading: true, error: null });
  const [viewing, setViewing] = useState<Viewing>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const fetchAll = () =>
    Promise.all([canvasService.getActiveCanvas(ventureId), canvasService.getCanvasVersions(ventureId)]).then(([canvas, versions]) => {
      const { notes, names } = group(canvas.blocks);
      return { canvas, notes, names, versions, loading: false, error: null } satisfies State;
    });

  useEffect(() => {
    let cancelled = false;
    fetchAll().then(
      (s) => !cancelled && setState(s),
      (e) => !cancelled && setState((p) => ({ ...p, loading: false, error: errMsg(e) })),
    );
    return () => {
      cancelled = true;
    };
    // fetchAll only depends on ventureId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ventureId]);

  /** Re-read the active canvas and versions (after add without an echoed row, snapshot, restore). */
  const reload = () => fetchAll().then(setState);

  const retry = () => {
    setState((p) => ({ ...p, loading: true, error: null }));
    reload().catch((e) => setState((p) => ({ ...p, loading: false, error: errMsg(e) })));
  };

  const setNotes = (fn: (n: NotesByBlock) => NotesByBlock) => setState((p) => ({ ...p, notes: fn(p.notes) }));

  /* ---------------- Notes (active canvas) ---------------- */

  const addNote = async (block: BmcBlockId, text: string, isAssumption: boolean) => {
    const clean = text.trim();
    if (!clean) return;
    const note = await canvasService.addCanvasItem({
      venture: ventureId,
      block_name: state.names[block] ?? DEFAULT_BLOCK_NAME[block],
      item_text: clean,
      is_assumption: isAssumption ? 1 : 0,
    });
    if (note) setNotes((n) => ({ ...n, [block]: [...n[block], note] }));
    else await reload(); // the backend didn't echo the row, so read it back to get its id
  };

  /** Optimistic edit; rolls back and rethrows if the server refuses. */
  const updateNote = async (block: BmcBlockId, note: CanvasNote, patch: { item_text?: string; is_assumption?: number }) => {
    const apply = (to: Partial<CanvasNote>) =>
      setNotes((n) => ({ ...n, [block]: n[block].map((x) => (x.row_id === note.row_id ? { ...x, ...to } : x)) }));
    apply(patch);
    try {
      await canvasService.updateCanvasItem({ venture: ventureId, row_id: note.row_id, ...patch });
    } catch (e) {
      apply({ item_text: note.item_text, is_assumption: note.is_assumption });
      throw e;
    }
  };

  /** Optimistic delete; puts the note back in place if the server refuses. */
  const deleteNote = async (block: BmcBlockId, note: CanvasNote) => {
    const index = state.notes[block].findIndex((x) => x.row_id === note.row_id);
    setNotes((n) => ({ ...n, [block]: n[block].filter((x) => x.row_id !== note.row_id) }));
    try {
      await canvasService.deleteCanvasItem(ventureId, note.row_id);
    } catch (e) {
      setNotes((n) => {
        const list = [...n[block]];
        list.splice(index < 0 ? list.length : index, 0, note);
        return { ...n, [block]: list };
      });
      throw e;
    }
  };

  /* ---------------- Versions ---------------- */

  const saveSnapshot = async (note: string) => {
    await canvasService.saveCanvasVersion(ventureId, note.trim());
    await reload();
  };

  /** Open a historical version read-only. Picking the active version returns to the live canvas. */
  const viewVersion = async (version: CanvasVersionSummary) => {
    if (version.is_active) {
      setViewing(null);
      return;
    }
    setViewLoading(true);
    try {
      const data = await canvasService.getCanvasVersion(version.name);
      setViewing({ version, notes: group(data.blocks).notes });
    } finally {
      setViewLoading(false);
    }
  };

  const restore = async (version: CanvasVersionSummary, note?: string) => {
    await canvasService.restoreCanvasVersion(version.name, note);
    setViewing(null);
    await reload();
  };

  const counts = (notes: NotesByBlock) => {
    const all = BLOCK_IDS.flatMap((id) => notes[id]);
    const assumptions = all.filter((n) => n.is_assumption).length;
    return { total: all.length, assumptions, validated: all.length - assumptions };
  };

  return {
    ...state,
    viewing,
    viewLoading,
    closeVersion: () => setViewing(null),
    counts,
    retry,
    addNote,
    updateNote,
    deleteNote,
    saveSnapshot,
    viewVersion,
    restore,
  };
}

export type CanvasState = ReturnType<typeof useCanvas>;
