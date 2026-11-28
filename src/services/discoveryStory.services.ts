import { apiService } from "./api.services";
import { ventureService } from "./venture.services";
import { BMC_STORY_ORDER, bmcBlockIdByName } from "@/lib/venturelab/constants";

const CHAPTER_API = "method/stridenex_app.entrepreneurship.doctype.venture_story_chapter.venture_story_chapter.get_story_chapters";
const VENTURE_UPDATE_API = "method/stridenex_app.entrepreneurship.doctype.venture.venture.update_venture";
const CANVAS_CREATE_API = "method/stridenex_app.entrepreneurship.doctype.venture_bmc_canvas.venture_bmc_canvas.create_bmc_canvas";

/** One page of the guided story (`Venture Story Chapter`). */
export interface StoryChapter {
  name: string; // e.g. "VSC-1"
  chapter_number: number;
  title: string;
  mapped_bmc_block: string; // e.g. "Customer Segments"
  is_mandatory: number;
  mentor_prompt: string;
  guidance_tip: string;
  default_choice_chips: string; // JSON string
}

/** A saved answer — a child row of the venture's `story_answers` table. */
export interface StoryAnswer {
  name?: string; // child row id; present once saved
  chapter_number: number;
  chapter_ref: string;
  question_key?: string;
  mapped_bmc_block: string;
  student_answer: string;
  selected_chips: string; // JSON string
  synced_to_canvas: number;
}

export interface CanvasItemPayload {
  /** The field create_bmc_canvas reads; a missing value silently falls back to Customer Segments. */
  block_name: string;
  /** Same value, kept for older spec readers. */
  bmc_block: string;
  item_text: string;
  description?: string;
  is_assumption: number;
}

/** Every endpoint answers { message: { status, message, data } }. */
function unwrap<T>(res: unknown): T {
  const m = (res as { message?: { status?: string; message?: string; data?: T } } | null)?.message;
  if (!m || (m.status && m.status !== "success")) throw new Error(m?.message || "Something went wrong. Please try again.");
  return m.data as T;
}

/** Parse a JSON-string list from the backend, tolerating blanks and bad JSON. */
export function parseChips(raw: string | null | undefined): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

// Chapters are global content, so fetch them once per page load.
let chapterCache: StoryChapter[] | null = null;

export const discoveryStoryService = {
  /**
   * GET get_story_chapters, in the entrepreneurial BMC order (Customers → Value →
   * Channels → Relationships → Revenue → Resources → Activities → Partners → Costs).
   * Chapters on the same block, or on a block name we don't recognise, keep
   * their chapter_number order (unrecognised ones go last), so any count works.
   */
  async getChapters(): Promise<StoryChapter[]> {
    if (chapterCache) return chapterCache;
    const rows = unwrap<StoryChapter[]>(await apiService.get(CHAPTER_API)) ?? [];
    const rank = (c: StoryChapter) => {
      const id = bmcBlockIdByName(c.mapped_bmc_block);
      return id ? BMC_STORY_ORDER.indexOf(id) : BMC_STORY_ORDER.length;
    };
    chapterCache = [...rows].sort((a, b) => rank(a) - rank(b) || a.chapter_number - b.chapter_number);
    return chapterCache;
  },

  /** The venture's saved answers, read from get_venture_details. */
  async getAnswers(ventureId: string): Promise<StoryAnswer[]> {
    const venture = (await ventureService.details(ventureId)) as { story_answers?: StoryAnswer[] };
    return Array.isArray(venture?.story_answers) ? venture.story_answers : [];
  },

  /**
   * PUT update_venture with the full answer list. Rows with a `name` are
   * updated; rows without one are appended. Resolves with the saved rows (so
   * new rows get their ids), re-reading the venture if the response omits them.
   */
  async saveAnswers(ventureId: string, answers: StoryAnswer[]): Promise<StoryAnswer[]> {
    const data = unwrap<{ story_answers?: StoryAnswer[]; venture?: { story_answers?: StoryAnswer[] } } | null>(
      await apiService.put(VENTURE_UPDATE_API, { name: ventureId, story_answers: answers }),
    );
    const rows = data?.story_answers ?? data?.venture?.story_answers;
    return Array.isArray(rows) ? rows : discoveryStoryService.getAnswers(ventureId);
  },

  /** POST create_bmc_canvas — builds the venture's active canvas from discovery. */
  async createCanvas(ventureId: string, items: CanvasItemPayload[]): Promise<unknown> {
    return unwrap(await apiService.post(CANVAS_CREATE_API, { venture: ventureId, is_active: 1, canvas_items: items }));
  },
};
