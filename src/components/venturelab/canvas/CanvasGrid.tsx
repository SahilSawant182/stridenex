"use client";

import type { BmcBlockId, CanvasBlocks } from "@/types/venturelab";
import { BMC_STORY_ORDER } from "@/lib/venturelab/constants";
import CanvasBlockCell from "./CanvasBlockCell";

/**
 * Osterwalder 9-block grid. Layout lives in venturelab.css (.vl-bmc-grid):
 *   ≥1024px  10-column canonical layout
 *   768–1023 2-column stacked layout
 *   <768     single column in storytelling order
 */
export default function CanvasGrid({
  blocks,
  readOnly,
  onEditBlock,
  revealCount,
}: {
  blocks: CanvasBlocks;
  readOnly?: boolean;
  onEditBlock: (id: BmcBlockId) => void;
  /** During "Replay Reveal", how many blocks (in story order) are visible. null = all. */
  revealCount: number | null;
}) {
  return (
    <div className="vl-bmc-grid">
      {BMC_STORY_ORDER.map((id, i) => (
        <CanvasBlockCell
          key={id}
          id={id}
          items={blocks[id]}
          readOnly={readOnly}
          onEdit={onEditBlock}
          revealClass={revealCount === null ? undefined : i < revealCount ? "vl-reveal-shown" : "vl-reveal-hidden"}
        />
      ))}
    </div>
  );
}
