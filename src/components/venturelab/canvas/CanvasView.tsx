"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { AlertTriangle, ArrowRight, BadgeCheck, Camera, Check, ChevronDown, Download, Eye, FlaskConical, History, Loader2, Play, RotateCcw, Sparkles, StickyNote } from "lucide-react";
import { BMC_STORY_ORDER, REVEAL_FLAG_KEY, stageBadge } from "@/lib/venturelab/constants";
import type { CanvasVersionSummary } from "@/services/canvas.services";
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
  DropdownTrigger,
  EmptyState,
  FieldLabel,
  Modal,
  VLButton,
  inputClass,
} from "../shared/primitives";
import CanvasGrid from "./CanvasGrid";
import ExportCanvasModal from "./ExportCanvasModal";
import { errMsg, toLocalBlocks, useCanvas } from "./useCanvas";

const vLabel = (v: Pick<CanvasVersionSummary, "version_label" | "version_number">) => `v${v.version_label || v.version_number}`;

const safeDate = (iso?: string) => {
  try {
    return iso ? format(parseISO(iso.replace(" ", "T")), "d MMM yyyy, h:mm a") : "";
  } catch {
    return "";
  }
};

/** Encouraging line for the validation meter. */
function validationCopy(pct: number, total: number) {
  if (total === 0) return "Add notes to start building your model";
  if (pct === 0) return "Everything is still a guess. Go talk to real users!";
  if (pct < 40) return "Nice start: keep testing your assumptions";
  if (pct < 80) return "Your model is getting real";
  if (pct < 100) return "Almost fully validated 🔥";
  return "Fully validated. Ship it! 🚀";
}

function StatTile({ kpi, label, value, icon, tone }: { kpi: string; label: string; value: number; icon: React.ReactNode; tone: string }) {
  return (
    <div data-kpi={kpi} className={cn("flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 ring-1 ring-inset sm:min-w-[118px]", tone)}>
      <span className="hidden opacity-70 sm:block">{icon}</span>
      <div className="min-w-0">
        <dt className="truncate text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</dt>
        <dd className="text-lg font-extrabold leading-none tabular-nums">{value}</dd>
      </div>
    </div>
  );
}

export default function CanvasView() {
  const { activeVenture } = useVentureLab();
  if (!activeVenture) return null;
  // Keyed so switching ventures loads that venture's own canvas.
  return <CanvasBody key={activeVenture.id} />;
}

function CanvasBody() {
  const router = useRouter();
  const { showToast } = useToast();
  const { activeVenture, replaceCanvasBlocks } = useVentureLab();
  const venture = activeVenture!;
  const c = useCanvas(venture.id);

  const [exportOpen, setExportOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [snapshotNote, setSnapshotNote] = useState("");
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  /* ---- Reveal animation (plays once after Idea Discovery builds the canvas) ---- */
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
  const loaded = !c.loading && !c.error;
  useEffect(() => {
    if (!loaded) return;
    try {
      if (window.sessionStorage.getItem(REVEAL_FLAG_KEY)) {
        window.sessionStorage.removeItem(REVEAL_FLAG_KEY);
        // No cleanup on purpose: the flag is consumed once, so StrictMode's re-run must not cancel it.
        setTimeout(() => replay(), 200);
      }
    } catch {
      /* ignore */
    }
  }, [loaded, replay]);

  /* ---- Keep the local canvas cache (Overview progress, header search) in step with the server ---- */
  useEffect(() => {
    if (loaded) replaceCanvasBlocks(toLocalBlocks(c.notes));
    // replaceCanvasBlocks is recreated every render; the notes are what matter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, c.notes]);

  if (c.loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500" role="status">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden /> Loading your canvas…
      </div>
    );
  }

  if (c.error) {
    return (
      <EmptyState
        icon={<AlertTriangle className="h-7 w-7" />}
        title="Couldn’t load your canvas"
        body={c.error}
        action={
          <VLButton variant="accent" onClick={c.retry}>
            Try again
          </VLButton>
        }
      />
    );
  }

  const viewing = c.viewing;
  const shown = viewing?.notes ?? c.notes;
  const { total, assumptions, validated } = c.counts(shown);
  const pct = total ? Math.round((validated / total) * 100) : 0;
  const active = c.versions.find((v) => v.is_active);
  const activeLabel = active ? vLabel(active) : c.canvas ? vLabel({ version_label: c.canvas.version_label ?? "", version_number: c.canvas.version_number }) : "v1";

  const onSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await c.saveSnapshot(snapshotNote);
      showToast("Snapshot saved", "success");
      setSnapshotOpen(false);
      setSnapshotNote("");
    } catch (err) {
      showToast(`Couldn’t save the snapshot: ${errMsg(err)}`, "error");
    } finally {
      setBusy(false);
    }
  };

  const onRestore = async () => {
    if (!viewing) return;
    setBusy(true);
    try {
      await c.restore(viewing.version, `Restored from ${vLabel(viewing.version)}`);
      showToast(`${vLabel(viewing.version)} restored as the active canvas`, "success");
      setRestoreOpen(false);
    } catch (err) {
      showToast(`Couldn’t restore: ${errMsg(err)}`, "error");
    } finally {
      setBusy(false);
    }
  };

  const openVersion = (v: CanvasVersionSummary) =>
    c.viewVersion(v).catch((err) => showToast(`Couldn’t open ${vLabel(v)}: ${errMsg(err)}`, "error"));

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <Card className="overflow-hidden p-0">
        <div className="relative space-y-4 p-4 sm:p-5">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-[#0f0fbd]/10 via-fuchsia-400/10 to-orange-300/20 blur-2xl" />
          <div className="relative flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f0fbd]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> Business Model Canvas
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="min-w-0 break-words text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">{venture.name}</h1>
                <Badge className={stageBadge(venture.stage)}>{venture.stage}</Badge>
                {venture.archived && <Badge className="bg-slate-800 text-white ring-slate-800">Archived</Badge>}
              </div>
              {venture.description && <p className="mt-1 max-w-2xl text-sm text-slate-600">{venture.description}</p>}
            </div>

            <div className="vl-no-print grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center xl:justify-end">
              <VLButton variant="outline" onClick={() => setSnapshotOpen(true)} disabled={!!viewing} className="rounded-xl" aria-label="Save Snapshot">
                <Camera className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Save Snapshot</span><span className="sm:hidden">Snapshot</span>
              </VLButton>
              <VLButton variant="outline" onClick={() => setExportOpen(true)} className="rounded-xl">
                <Download className="h-4 w-4" aria-hidden /> Export
              </VLButton>
              <VLButton variant="outline" onClick={replay} disabled={revealCount !== null} className="rounded-xl">
                <Play className="h-4 w-4" aria-hidden /> Replay
              </VLButton>
              <VLButton onClick={() => router.push("/venturelab/discovery")} className="col-span-3 rounded-xl bg-gradient-to-r from-[#0f0fbd] to-[#4f46e5] shadow-md shadow-[#0f0fbd]/20 hover:opacity-95">
                Refine in Idea Discovery <ArrowRight className="h-4 w-4" aria-hidden />
              </VLButton>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5 xl:flex-row xl:items-center">
          <Dropdown>
            <DropdownTrigger asChild>
              <button
                aria-label={`Canvas version ${viewing ? vLabel(viewing.version) : `${activeLabel} (active)`}. Choose a version`}
                disabled={c.viewLoading}
                className="group inline-flex min-h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 sm:w-auto"
              >
                {c.viewLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" aria-hidden /> : <History className="h-4 w-4 text-slate-500" aria-hidden />}
                {viewing ? vLabel(viewing.version) : activeLabel}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    viewing ? "bg-blue-100 text-[#0f0fbd]" : "bg-emerald-100 text-emerald-800",
                  )}
                >
                  {viewing ? "Viewing" : "Active"}
                </span>
                <ChevronDown className="ml-auto h-4 w-4 text-slate-500 transition-transform group-data-[state=open]:rotate-180" aria-hidden />
              </button>
            </DropdownTrigger>
            <DropdownContent align="start" className="w-[min(320px,calc(100vw-32px))]">
              <DropdownLabel>Canvas versions</DropdownLabel>
              {c.versions.length === 0 && <p className="px-3 py-2 text-sm text-slate-500">No snapshots yet.</p>}
              {c.versions.map((v) => {
                const selected = viewing ? viewing.version.name === v.name : !!v.is_active;
                return (
                  <DropdownItem key={v.name} onSelect={() => void openVersion(v)}>
                    <span className="w-12 shrink-0 font-bold text-slate-900">{vLabel(v)}</span>
                    <span className="min-w-0 flex-1">
                      {/* Saving a snapshot makes a new active version carrying the note, so show notes on every version. */}
                      <span className="block truncate text-xs text-slate-700">
                        {v.is_active && <span className="mr-1 font-semibold text-[#0f0fbd]">Active ·</span>}
                        {v.version_note || (v.is_active ? "Current canvas" : "Snapshot")}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {safeDate(v.creation)} · {v.total_items_count} notes
                      </span>
                    </span>
                    {selected && <Check className="h-4 w-4 text-[#0f0fbd]" aria-label="Selected" />}
                  </DropdownItem>
                );
              })}
            </DropdownContent>
          </Dropdown>

          <dl className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
            <StatTile kpi="total" label="Total Notes" value={total} icon={<StickyNote className="h-4 w-4" aria-hidden />} tone="bg-white text-slate-900 ring-slate-200" />
            <StatTile kpi="assumptions" label="Assumptions" value={assumptions} icon={<FlaskConical className="h-4 w-4" aria-hidden />} tone="bg-amber-50 text-amber-900 ring-amber-200" />
            <StatTile kpi="validated" label="Validated" value={validated} icon={<BadgeCheck className="h-4 w-4" aria-hidden />} tone="bg-emerald-50 text-emerald-900 ring-emerald-200" />
          </dl>

          <div className="min-w-0 flex-1 xl:pl-2">
            <div className="flex items-baseline justify-between gap-2 text-xs font-semibold">
              <span className="text-slate-700">{validationCopy(pct, total)}</span>
              <span className="font-extrabold tabular-nums text-emerald-700">{pct}%</span>
            </div>
            <div
              className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-200/80"
              role="progressbar"
              aria-label="Notes validated"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {viewing && (
        <div role="status" className="vl-rise flex flex-col gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-[#0f0fbd]">
            <Eye className="h-4 w-4 shrink-0" aria-hidden />
            <span>
              Viewing historical snapshot <strong>{vLabel(viewing.version)}</strong> (Read-Only).
              {viewing.version.version_note && <span className="text-[#0f0fbd]/80"> — {viewing.version.version_note}</span>}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <VLButton size="sm" variant="outline" onClick={c.closeVersion}>
              Back to Active Canvas
            </VLButton>
            <VLButton size="sm" onClick={() => setRestoreOpen(true)}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Restore as Active Canvas
            </VLButton>
          </div>
        </div>
      )}

      <div className={cn(c.viewLoading && "pointer-events-none opacity-60")}>
        <CanvasGrid
          notes={shown}
          readOnly={!!viewing}
          revealCount={revealCount}
          actions={viewing ? undefined : { onAdd: c.addNote, onUpdate: c.updateNote, onDelete: c.deleteNote }}
        />
      </div>

      <Modal
        open={snapshotOpen}
        onOpenChange={(o) => !busy && setSnapshotOpen(o)}
        size="sm"
        title="Save a snapshot"
        description="Freeze the canvas as it is now so you can compare or come back to it later."
        footer={
          <>
            <VLButton variant="outline" onClick={() => setSnapshotOpen(false)} disabled={busy}>
              Cancel
            </VLButton>
            <VLButton type="submit" form="vl-snapshot" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Camera className="h-4 w-4" aria-hidden />} Save snapshot
            </VLButton>
          </>
        }
      >
        <form id="vl-snapshot" onSubmit={onSnapshot}>
          <FieldLabel htmlFor="vl-snapshot-note">Note (optional)</FieldLabel>
          <input
            id="vl-snapshot-note"
            autoFocus
            maxLength={140}
            value={snapshotNote}
            onChange={(e) => setSnapshotNote(e.target.value)}
            placeholder="e.g. After customer discovery interviews"
            className={inputClass}
          />
        </form>
      </Modal>

      <Modal
        open={restoreOpen}
        onOpenChange={(o) => !busy && setRestoreOpen(o)}
        size="sm"
        title={viewing ? `Restore ${vLabel(viewing.version)}?` : "Restore version?"}
        description="This snapshot becomes your active canvas. Save a snapshot first if you want to keep the current one."
        footer={
          <>
            <VLButton variant="outline" onClick={() => setRestoreOpen(false)} disabled={busy}>
              Cancel
            </VLButton>
            <VLButton onClick={() => void onRestore()} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RotateCcw className="h-4 w-4" aria-hidden />} Restore
            </VLButton>
          </>
        }
      >
        <p className="text-sm text-slate-600">You’ll be able to edit it again straight away.</p>
      </Modal>

      <ExportCanvasModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        ventureName={venture.name}
        versionLabel={viewing ? vLabel(viewing.version) : activeLabel}
        blocks={toLocalBlocks(shown)}
      />
    </div>
  );
}
