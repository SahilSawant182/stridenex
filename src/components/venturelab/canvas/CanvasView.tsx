"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { differenceInSeconds, formatDistanceStrict, parseISO } from "date-fns";
import { Check, ChevronDown, CircleDot, Download, Eye, FlaskConical, History, Play, RotateCcw, Save } from "lucide-react";
import type { BmcBlockId } from "@/types/venturelab";
import { BMC_BLOCKS, BMC_STORY_ORDER, REVEAL_FLAG_KEY } from "@/lib/venturelab/constants";
import { canvasCompleteness, filledBlockCount } from "@/lib/venturelab/utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useVentureLab } from "../VentureLabProvider";
import {
  Badge,
  Card,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  ProgressBar,
  VLButton,
} from "../shared/primitives";
import { useNow } from "../shared/useNow";
import CanvasGrid from "./CanvasGrid";
import BlockEditorDrawer from "./BlockEditorDrawer";
import ExportCanvasModal from "./ExportCanvasModal";

export default function CanvasView() {
  const { activeVenture, saveCanvas, restoreCanvasVersion } = useVentureLab();
  const { showToast } = useToast();
  const now = useNow();
  const [editing, setEditing] = useState<BmcBlockId | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [revealCount, setRevealCount] = useState<number | null>(null);
  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const replay = useCallback(() => {
    if (revealTimer.current) clearInterval(revealTimer.current);
    setRevealCount(0);
    let n = 0;
    revealTimer.current = setInterval(() => {
      n += 1;
      setRevealCount(n);
      if (n >= BMC_STORY_ORDER.length) {
        if (revealTimer.current) clearInterval(revealTimer.current);
        setTimeout(() => setRevealCount(null), 450);
      }
    }, 260);
  }, []);

  useEffect(() => () => {
    if (revealTimer.current) clearInterval(revealTimer.current);
  }, []);

  // Arriving from Idea Discovery's "Build my Business Model Canvas" plays the reveal once.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(REVEAL_FLAG_KEY)) {
        window.sessionStorage.removeItem(REVEAL_FLAG_KEY);
        // No cleanup on purpose: the flag is consumed once, so StrictMode's re-run must not cancel it.
        setTimeout(() => replay(), 200);
      }
    } catch {
      /* ignore */
    }
  }, [replay]);

  // Leaving a venture resets any historical view.
  const ventureId = activeVenture?.id;
  const [prevVentureId, setPrevVentureId] = useState(ventureId);
  if (ventureId !== prevVentureId) {
    setPrevVentureId(ventureId);
    setViewingId(null);
  }

  if (!activeVenture) return null;
  const { canvas } = activeVenture;
  const latest = canvas.versions[0];
  const viewing = viewingId ? canvas.versions.find((v) => v.id === viewingId) ?? null : null;
  const shownBlocks = viewing?.blocks ?? canvas.blocks;
  const completeness = canvasCompleteness(shownBlocks);
  const currentLabel = viewing?.label ?? (latest ? (canvas.dirty ? `${latest.label} · draft` : latest.label) : "Draft");

  const assumptions = BMC_STORY_ORDER.flatMap((id) => shownBlocks[id].filter((i) => i.isAssumption).map((i) => ({ ...i, block: id })));

  const savedStatus = (() => {
    if (canvas.dirty || !canvas.lastSavedAt) return { text: "Unsaved changes", tone: "text-amber-700", dot: "bg-amber-500" };
    const secs = differenceInSeconds(now, parseISO(canvas.lastSavedAt));
    return {
      text: secs < 60 ? "Saved just now" : `Saved ${formatDistanceStrict(parseISO(canvas.lastSavedAt), now, { addSuffix: true })}`,
      tone: "text-emerald-700",
      dot: "bg-emerald-500",
    };
  })();

  const onSave = () => {
    if (!canvas.dirty && latest) {
      showToast(`No changes since ${latest.label}`, "info");
      return;
    }
    const label = saveCanvas();
    showToast(`Canvas saved as ${label}`, "success");
  };

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <Card className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Business Model Canvas</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">{activeVenture.name}</h1>

            <Dropdown>
              <DropdownTrigger asChild>
                <button
                  aria-label={`Canvas version ${currentLabel}. Choose a version`}
                  className="group inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <History className="h-4 w-4 text-slate-500" aria-hidden />
                  {currentLabel}
                  <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-data-[state=open]:rotate-180" aria-hidden />
                </button>
              </DropdownTrigger>
              <DropdownContent align="start" className="w-[280px]">
                <DropdownLabel>Canvas versions</DropdownLabel>
                <DropdownItem onSelect={() => setViewingId(null)}>
                  <CircleDot className="h-4 w-4 text-[#ff6b00]" aria-hidden />
                  <span className="flex-1">
                    Working copy{canvas.dirty && <span className="text-amber-700"> · unsaved</span>}
                  </span>
                  {!viewing && <Check className="h-4 w-4 text-[#0f0fbd]" aria-label="Selected" />}
                </DropdownItem>
                {canvas.versions.length > 0 && <DropdownSeparator />}
                {canvas.versions.map((ver) => (
                  <DropdownItem key={ver.id} onSelect={() => setViewingId(ver.id)}>
                    <span className="w-10 font-bold text-slate-900">{ver.label}</span>
                    <span className="min-w-0 flex-1 truncate text-xs text-slate-500">{ver.note}</span>
                    {viewing?.id === ver.id && <Check className="h-4 w-4 text-[#0f0fbd]" aria-label="Selected" />}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>

            <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", savedStatus.tone)} aria-live="polite">
              <span className={cn("h-2 w-2 rounded-full", savedStatus.dot)} aria-hidden />
              {savedStatus.text}
            </span>
          </div>
        </div>

        <div className="vl-no-print flex flex-wrap gap-2">
          <VLButton variant="outline" onClick={replay} disabled={revealCount !== null}>
            <Play className="h-4 w-4" aria-hidden /> Replay Reveal
          </VLButton>
          <VLButton variant="outline" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4" aria-hidden /> Export
          </VLButton>
          <VLButton onClick={onSave} disabled={!!viewing}>
            <Save className="h-4 w-4" aria-hidden /> Save Canvas
          </VLButton>
        </div>
      </Card>

      {viewing && (
        <div role="status" className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-[#0f0fbd]">
            <Eye className="h-4 w-4 shrink-0" aria-hidden />
            <span>
              Viewing <strong>{viewing.label}</strong> (read-only) — {viewing.note}
            </span>
          </p>
          <div className="flex gap-2">
            <VLButton size="sm" variant="outline" onClick={() => setViewingId(null)}>
              Back to working copy
            </VLButton>
            <VLButton
              size="sm"
              onClick={() => {
                restoreCanvasVersion(viewing.id);
                setViewingId(null);
                showToast(`Restored ${viewing.label} into your working copy`, "success");
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Restore this version
            </VLButton>
          </div>
        </div>
      )}

      <CanvasGrid blocks={shownBlocks} readOnly={!!viewing} onEditBlock={setEditing} revealCount={revealCount} />

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-5">
          <h2 className="text-sm font-bold text-slate-900">Canvas completeness</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{completeness}%</p>
          <ProgressBar value={completeness} tone={completeness === 100 ? "success" : "primary"} className="mt-3" label="Canvas completeness" />
          <p className="mt-2 text-xs text-slate-500">
            {filledBlockCount(shownBlocks)} of 9 blocks have at least one item.
            {completeness < 100 &&
              ` Missing: ${BMC_STORY_ORDER.filter((id) => shownBlocks[id].length === 0)
                .map((id) => BMC_BLOCKS[id].shortName)
                .join(", ")}.`}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <FlaskConical className="h-4 w-4 text-amber-600" aria-hidden /> Assumptions to validate
            </h2>
            <Badge className="bg-amber-50 text-amber-800 ring-amber-200">{assumptions.length}</Badge>
          </div>
          {assumptions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No flagged assumptions. Open a block and tap the flask icon on anything you haven’t tested with real customers.</p>
          ) : (
            <ul className="mt-3 space-y-1">
              {assumptions.map((a) => (
                <li key={a.id}>
                  <button
                    disabled={!!viewing}
                    onClick={() => setEditing(a.block)}
                    className="flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-slate-50 disabled:hover:bg-transparent"
                  >
                    <span className="min-w-0 flex-1 truncate text-slate-800">{a.text}</span>
                    <span className="shrink-0 text-xs text-slate-500">{BMC_BLOCKS[a.block].shortName}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 md:col-span-2 xl:col-span-1">
          <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
            <History className="h-4 w-4 text-slate-500" aria-hidden /> Version history
          </h2>
          {canvas.versions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No saved versions yet. Click Save Canvas to create v1.0.</p>
          ) : (
            <ol className="mt-3 space-y-1">
              {canvas.versions.map((ver, i) => (
                <li key={ver.id}>
                  <button
                    onClick={() => setViewingId(ver.id)}
                    className={cn(
                      "flex min-h-11 w-full items-start gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50",
                      viewing?.id === ver.id && "bg-blue-50/60",
                    )}
                  >
                    <span className={cn("mt-0.5 rounded-md px-1.5 text-xs font-bold", i === 0 ? "bg-[#0f0fbd] text-white" : "bg-slate-100 text-slate-700")}>
                      {ver.label}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-slate-800">{ver.note}</span>
                      <span className="block text-xs text-slate-500">
                        {formatDistanceStrict(parseISO(ver.savedAt), now, { addSuffix: true })} · {canvasCompleteness(ver.blocks)}% complete
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <BlockEditorDrawer blockId={editing} items={editing ? canvas.blocks[editing] : []} onOpenChange={(o) => !o && setEditing(null)} />
      <ExportCanvasModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        ventureName={activeVenture.name}
        versionLabel={viewing?.label ?? (canvas.dirty || !latest ? "draft" : latest.label)}
        blocks={shownBlocks}
      />
    </div>
  );
}
