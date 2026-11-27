"use client";

import { useEffect, useState } from "react";
import { discoveryStoryService, parseChips, type StoryAnswer, type StoryChapter } from "@/services/discoveryStory.services";

export interface ChapterDraft {
  /** The student's answer points, in the order added. */
  points: string[];
  /** Child row id once the answer has been saved. */
  rowName?: string;
}

type Drafts = Record<string, ChapterDraft>; // keyed by chapter.name

const EMPTY: ChapterDraft = { points: [] };

export const errMsg = (e: unknown) => (e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.");

export const isAnswered = (d: ChapterDraft | undefined) => !!d && d.points.length > 0;

/** "Customer Segments" → "customer_segments" */
const keyOf = (block: string) => block.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

/**
 * `selected_chips` holds every item as a JSON list (the source of truth);
 * `student_answer` is the same items joined with "; " for reading. Older saves
 * without the list fall back to splitting the text.
 */
function pointsFrom(row: StoryAnswer): string[] {
  const items = parseChips(row.selected_chips).map((c) => c.trim()).filter(Boolean);
  if (items.length) return items;
  return (row.student_answer ?? "").split(/;|\n/).map((l) => l.trim()).filter(Boolean);
}

/** Fold saved rows into drafts, matching on chapter_ref and falling back to chapter_number. */
function draftsFrom(chapters: StoryChapter[], rows: StoryAnswer[]): Drafts {
  const out: Drafts = {};
  for (const ch of chapters) {
    const row = rows.find((r) => r.chapter_ref === ch.name) ?? rows.find((r) => r.chapter_number === ch.chapter_number);
    out[ch.name] = row ? { points: pointsFrom(row), rowName: row.name } : EMPTY;
  }
  return out;
}

const sameDraft = (a: ChapterDraft | undefined, b: ChapterDraft | undefined) => JSON.stringify(a?.points ?? []) === JSON.stringify(b?.points ?? []);

type State = {
  chapters: StoryChapter[];
  drafts: Drafts; // what the student is editing
  saved: Drafts; // what the backend last confirmed
  loading: boolean;
  error: string | null;
};

/**
 * Chapters + this venture's saved story answers, with edit and save. Everything
 * is persisted on the backend (no local storage). Render the consumer with
 * `key={ventureId}` so switching ventures reloads.
 */
export function useDiscoveryStory(ventureId: string) {
  const [state, setState] = useState<State>({ chapters: [], drafts: {}, saved: {}, loading: true, error: null });
  const [saving, setSaving] = useState(false);

  const fetchAll = () =>
    Promise.all([discoveryStoryService.getChapters(), discoveryStoryService.getAnswers(ventureId)]).then(([chapters, rows]) => {
      const drafts = draftsFrom(chapters, rows);
      return { chapters, drafts, saved: drafts, loading: false, error: null } satisfies State;
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

  const retry = () => {
    setState((p) => ({ ...p, loading: true, error: null }));
    fetchAll().then(setState, (e) => setState((p) => ({ ...p, loading: false, error: errMsg(e) })));
  };

  const draftOf = (ch: StoryChapter) => state.drafts[ch.name] ?? EMPTY;

  const patch = (ch: StoryChapter, fn: (d: ChapterDraft) => ChapterDraft) =>
    setState((p) => ({ ...p, drafts: { ...p.drafts, [ch.name]: fn(p.drafts[ch.name] ?? EMPTY) } }));

  /** Add one answer point (ignores blanks and case-insensitive duplicates). */
  const addPoint = (ch: StoryChapter, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    patch(ch, (d) => (d.points.some((p) => p.toLowerCase() === clean.toLowerCase()) ? d : { ...d, points: [...d.points, clean] }));
  };

  const removePoint = (ch: StoryChapter, index: number) => patch(ch, (d) => ({ ...d, points: d.points.filter((_, i) => i !== index) }));

  const dirty = state.chapters.some((ch) => !sameDraft(state.drafts[ch.name], state.saved[ch.name]));

  /**
   * Save every answered chapter (plus any previously saved row, so clearing an
   * answer is persisted too). Resolves true on success; rejects with the server's message.
   */
  const save = async (opts: { force?: boolean } = {}): Promise<boolean> => {
    if (saving) return false;
    if (!dirty && !opts.force) return true;
    const answers: StoryAnswer[] = state.chapters
      .filter((ch) => isAnswered(state.drafts[ch.name]) || state.drafts[ch.name]?.rowName)
      .map((ch) => {
        const d = state.drafts[ch.name] ?? EMPTY;
        return {
          ...(d.rowName ? { name: d.rowName } : {}),
          chapter_number: ch.chapter_number,
          chapter_ref: ch.name,
          question_key: keyOf(ch.mapped_bmc_block),
          mapped_bmc_block: ch.mapped_bmc_block,
          student_answer: d.points.join("; "),
          selected_chips: JSON.stringify(d.points),
          synced_to_canvas: 1,
        };
      });
    if (answers.length === 0) return true;
    setSaving(true);
    try {
      const rows = await discoveryStoryService.saveAnswers(ventureId, answers);
      const confirmed = draftsFrom(state.chapters, rows);
      // Keep any typing that happened during the request; adopt the new row ids.
      setState((p) => ({
        ...p,
        saved: confirmed,
        drafts: Object.fromEntries(
          p.chapters.map((ch) => [ch.name, { ...(p.drafts[ch.name] ?? EMPTY), rowName: confirmed[ch.name]?.rowName ?? p.drafts[ch.name]?.rowName }]),
        ),
      }));
      return true;
    } finally {
      setSaving(false);
    }
  };

  const answeredCount = state.chapters.filter((ch) => isAnswered(state.drafts[ch.name])).length;
  const clarity = state.chapters.length ? Math.round((answeredCount / state.chapters.length) * 100) : 0;

  return { ...state, saving, dirty, clarity, answeredCount, draftOf, addPoint, removePoint, save, retry };
}

export type DiscoveryStory = ReturnType<typeof useDiscoveryStory>;
