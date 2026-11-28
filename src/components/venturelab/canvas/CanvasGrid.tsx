"use client";

import { BMC_STORY_ORDER } from "@/lib/venturelab/constants";
import CanvasBlockCell, { type BlockActions } from "./CanvasBlockCell";
import type { NotesByBlock } from "./useCanvas";

/**
 * Osterwalder 9-block grid. Layout lives in venturelab.css (.vl-bmc-grid):
 *   ≥1280px  10-column canonical layout (Partners | Activities/Resources | Value |
 *            Relationships/Channels | Segments, then Cost | Revenue)
 *   768–1279 2-column stacked layout
 *   <768     single column in storytelling order
 */
export default function CanvasGrid({
  notes,
  readOnly,
  actions,
  revealCount,
}: {
  notes: NotesByBlock;
  readOnly?: boolean;
  actions?: BlockActions;
  /** During "Replay Reveal", how many blocks (in story order) are visible. null = all. */
  revealCount: number | null;
}) {
  return (
    <div className="vl-bmc-grid">
      {BMC_STORY_ORDER.map((id, i) => (
        <CanvasBlockCell
          key={id}
          id={id}
          notes={notes[id]}
          readOnly={readOnly}
          actions={actions}
          revealClass={revealCount === null ? undefined : i < revealCount ? "vl-reveal-shown" : "vl-reveal-hidden"}
        />
      ))}
    </div>
  );
}
