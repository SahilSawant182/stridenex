import { apiService } from "./api.services";

const BASE = "method/stridenex_app.entrepreneurship.doctype.venture_bmc_canvas.venture_bmc_canvas";

/** One sticky note on the canvas (a child row of the canvas doc). */
export interface CanvasNote {
  row_id: string;
  block_name: string; // e.g. "Value Propositions"
  item_text: string;
  is_assumption: number; // 1 = Assumption, 0 = Validated
  source_type?: string;
  order_index?: number;
  story_answer_ref?: string;
}

/** Notes grouped by backend block name. */
export type CanvasNoteBlocks = Record<string, CanvasNote[]>;

export interface ActiveCanvasData {
  name: string;
  venture: string;
  version_number: number;
  version_label?: string;
  is_active: number;
  total_items_count: number;
  assumptions_count: number;
  blocks: CanvasNoteBlocks;
}

export interface CanvasVersionSummary {
  name: string;
  venture: string;
  version_number: number;
  version_label: string; // e.g. "1.0", "1.1", "2"
  version_note?: string;
  is_active: number;
  total_items_count: number;
  assumptions_count: number;
  creation: string;
  modified: string;
}

/** A historical snapshot, normalised to the same block grouping as the active canvas. */
export interface CanvasVersionData extends Partial<CanvasVersionSummary> {
  name: string;
  blocks: CanvasNoteBlocks;
}

/** Every endpoint answers { message: { status, message, data } }. */
function unwrap<T>(res: unknown): T {
  const m = (res as { message?: { status?: string; message?: string; data?: T } } | null)?.message;
  if (!m || (m.status && m.status !== "success")) throw new Error(m?.message || "Something went wrong. Please try again.");
  return m.data as T;
}

type RawNote = Partial<CanvasNote> & { name?: string; bmc_block?: string };

/** Normalise a note row (versions may name fields `name` / `bmc_block`). */
const toNote = (r: RawNote): CanvasNote => ({
  ...r,
  row_id: r.row_id ?? r.name ?? "",
  block_name: r.block_name ?? r.bmc_block ?? "",
  item_text: r.item_text ?? "",
  is_assumption: r.is_assumption ? 1 : 0,
});

/** Accept either `blocks: {name: notes[]}` or a flat `canvas_items` list. */
function toBlocks(data: { blocks?: Record<string, RawNote[]>; canvas_items?: RawNote[] } | null | undefined): CanvasNoteBlocks {
  const out: CanvasNoteBlocks = {};
  if (data?.blocks && typeof data.blocks === "object") {
    for (const [block, rows] of Object.entries(data.blocks)) out[block] = (rows ?? []).map((r) => toNote({ block_name: block, ...r }));
  } else {
    for (const r of data?.canvas_items ?? []) {
      const n = toNote(r);
      (out[n.block_name] ??= []).push(n);
    }
  }
  for (const rows of Object.values(out)) rows.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  return out;
}

export const canvasService = {
  /** 1. GET get_active_canvas — the backend creates version 1 for a brand-new venture. */
  async getActiveCanvas(ventureId: string): Promise<ActiveCanvasData> {
    const data = unwrap<ActiveCanvasData & { canvas_items?: RawNote[] }>(await apiService.get(`${BASE}.get_active_canvas`, { params: { venture: ventureId } }));
    return { ...data, blocks: toBlocks(data) };
  },

  /** 2. POST add_canvas_item. Resolves with the new note (row_id may be missing if the backend doesn't echo it). */
  async addCanvasItem(payload: { venture: string; block_name: string; item_text: string; is_assumption?: number }): Promise<CanvasNote | null> {
    const data = unwrap<RawNote | null>(await apiService.post(`${BASE}.add_canvas_item`, payload));
    return data && (data.row_id || data.name) ? toNote({ block_name: payload.block_name, ...data }) : null;
  },

  /** 3. PUT update_canvas_item — edit text and/or toggle the assumption flag. */
  async updateCanvasItem(payload: { venture: string; row_id: string; item_text?: string; is_assumption?: number }): Promise<void> {
    unwrap(await apiService.put(`${BASE}.update_canvas_item`, payload));
  },

  /** 4. DELETE delete_canvas_item. */
  async deleteCanvasItem(ventureId: string, rowId: string): Promise<void> {
    unwrap(await apiService.delete(`${BASE}.delete_canvas_item`, { params: { venture: ventureId, row_id: rowId } }));
  },

  /** 5. POST save_canvas_version — snapshot the current canvas. */
  async saveCanvasVersion(ventureId: string, versionNote?: string): Promise<void> {
    unwrap(await apiService.post(`${BASE}.save_canvas_version`, { venture: ventureId, version_note: versionNote || undefined }));
  },

  /** 6. GET get_canvas_versions — newest first. */
  async getCanvasVersions(ventureId: string): Promise<CanvasVersionSummary[]> {
    const data = unwrap<{ versions?: CanvasVersionSummary[] } | CanvasVersionSummary[] | null>(
      await apiService.get(`${BASE}.get_canvas_versions`, { params: { venture: ventureId } }),
    );
    const rows = Array.isArray(data) ? data : data?.versions ?? [];
    return [...rows].sort((a, b) => b.version_number - a.version_number);
  },

  /** 7. GET get_canvas_version — one historical snapshot (read-only). */
  async getCanvasVersion(canvasName: string): Promise<CanvasVersionData> {
    const data = unwrap<(CanvasVersionData & { canvas_items?: RawNote[] }) | null>(await apiService.get(`${BASE}.get_canvas_version`, { params: { name: canvasName } }));
    return { ...(data ?? {}), name: data?.name ?? canvasName, blocks: toBlocks(data) };
  },

  /** 8. POST restore_canvas_version — make an old snapshot the active canvas. */
  async restoreCanvasVersion(canvasName: string, versionNote?: string): Promise<void> {
    unwrap(await apiService.post(`${BASE}.restore_canvas_version`, { name: canvasName, version_note: versionNote || undefined }));
  },
};
