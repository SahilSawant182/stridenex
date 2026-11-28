"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Archive, FolderSearch, Loader2, Plus } from "lucide-react";
import type { Venture, VentureStageFilter } from "@/types/venturelab";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useVentureLab } from "../VentureLabProvider";
import { EmptyState, Modal, PageHeader, VLButton } from "../shared/primitives";
import { CreateVentureModal, EditVentureModal } from "../shared/VentureFormModals";
import VentureCard, { type VentureCardActions } from "../overview/VentureCard";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");

export default function VenturesView() {
  const router = useRouter();
  const { showToast } = useToast();
  const { ventures, activeVenture, loading, loadError, refresh, setActiveVenture, setArchived, duplicateVenture, deleteVenture, syncVenture } =
    useVentureLab();
  const [filter, setFilter] = useState<VentureStageFilter>("All");
  const [showArchived, setShowArchived] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Venture | null>(null);
  const [deleting, setDeleting] = useState<Venture | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const pool = ventures.filter((v) => v.archived === showArchived);
  // Stage names come from the backend, so the filter pills are built from what exists.
  const stages = Array.from(new Set(ventures.map((v) => v.stage)));
  const filters: VentureStageFilter[] = ["All", ...stages];
  const activeFilter = filters.includes(filter) ? filter : "All";
  const visible = pool.filter((v) => activeFilter === "All" || v.stage === activeFilter);
  const countFor = (f: VentureStageFilter) => pool.filter((v) => f === "All" || v.stage === f).length;
  const archivedCount = ventures.filter((v) => v.archived).length;

  /** Run a backend action, toasting success or the server's message. */
  const run = async (v: Venture, task: () => Promise<void>, ok: string) => {
    setBusyId(v.id);
    try {
      await task();
      showToast(ok, "success");
    } catch (e) {
      showToast(errMsg(e), "error");
    } finally {
      setBusyId(null);
    }
  };

  const actions: VentureCardActions = {
    onEdit: (v) => setEditing(v),
    onDuplicate: (v) => void run(v, () => duplicateVenture(v.id), `Duplicated ${v.name}`),
    onArchiveToggle: (v) => void run(v, () => setArchived(v.id, !v.archived), v.archived ? `${v.name} restored` : `${v.name} archived`),
    onDelete: (v) => setDeleting(v),
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteVenture(deleting.id);
      showToast(`${deleting.name} deleted`, "info");
      setDeleting(null);
    } catch (e) {
      showToast(errMsg(e), "error");
    } finally {
      setDeleteBusy(false);
    }
  };

  const openVenture = (v: Venture) => {
    setActiveVenture(v.id);
    void syncVenture(v.id); // pull the latest details in the background
    router.push("/venturelab/overview");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Ventures"
        subtitle="Every idea you’re building, at every stage. Switch, duplicate or archive in a click."
        actions={
          <VLButton variant="accent" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden /> Create New Venture
          </VLButton>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter ventures by stage" className="vl-scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                  active ? "border-[#0f0fbd] bg-[#0f0fbd] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                )}
              >
                {f}
                <span className={cn("rounded-full px-1.5 text-xs tabular-nums", active ? "bg-white/20" : "bg-slate-100 text-slate-600")}>{countFor(f)}</span>
              </button>
            );
          })}
        </div>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 accent-[#0f0fbd]"
          />
          <Archive className="h-4 w-4 text-slate-500" aria-hidden /> Show archived ({archivedCount})
        </label>
      </div>

      {loading && ventures.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-slate-500" role="status">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden /> Loading your ventures…
        </div>
      ) : loadError && ventures.length === 0 ? (
        <EmptyState
          icon={<AlertTriangle className="h-7 w-7" />}
          title="Couldn’t load your ventures"
          body={loadError}
          action={
            <VLButton variant="accent" onClick={() => void refresh()}>
              Try again
            </VLButton>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<FolderSearch className="h-7 w-7" />}
          title={
            activeFilter !== "All"
              ? `No ${showArchived ? "archived " : ""}ventures in ${activeFilter}`
              : showArchived
                ? "Nothing archived yet"
                : ventures.length === 0
                  ? "No ventures yet"
                  : "No active ventures"
          }
          body={
            activeFilter !== "All"
              ? `None of your ${showArchived ? "archived " : ""}ventures are at the ${activeFilter} stage yet. Keep building — or start something new.`
              : showArchived
                ? `Ventures you archive will show up here. You have ${ventures.length - archivedCount} active venture${ventures.length - archivedCount === 1 ? "" : "s"}.`
                : ventures.length === 0
                  ? "Every big company started as a small idea. Create your first venture to begin."
                  : `All your ventures are archived (${archivedCount}). Restore one, or start something new.`
          }
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {activeFilter !== "All" && (
                <VLButton variant="outline" onClick={() => setFilter("All")}>
                  Show all ventures
                </VLButton>
              )}
              {activeFilter === "All" && showArchived && ventures.length > archivedCount && (
                <VLButton variant="outline" onClick={() => setShowArchived(false)}>
                  Back to active ventures
                </VLButton>
              )}
              {activeFilter === "All" && !showArchived && archivedCount > 0 && (
                <VLButton variant="outline" onClick={() => setShowArchived(true)}>
                  View archived ({archivedCount})
                </VLButton>
              )}
              <VLButton variant="accent" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" aria-hidden /> Create New Venture
              </VLButton>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((v, i) => (
            <div key={v.id} className={cn("vl-rise", busyId === v.id && "pointer-events-none opacity-60")} aria-busy={busyId === v.id} style={{ animationDelay: `${i * 50}ms` }}>
              <VentureCard venture={v} isActive={v.id === activeVenture?.id} onOpen={openVenture} actions={actions} showMilestone={false} />
            </div>
          ))}
        </div>
      )}

      <CreateVentureModal open={createOpen} onOpenChange={setCreateOpen} />
      <EditVentureModal venture={editing} onOpenChange={(o) => !o && setEditing(null)} />
      <Modal
        open={deleting !== null}
        onOpenChange={(o) => !o && !deleteBusy && setDeleting(null)}
        size="sm"
        title="Delete venture?"
        description={deleting ? `${deleting.name} will be permanently deleted. This can’t be undone.` : undefined}
        footer={
          <>
            <VLButton variant="outline" onClick={() => setDeleting(null)} disabled={deleteBusy}>
              Cancel
            </VLButton>
            <VLButton variant="danger" onClick={() => void confirmDelete()} disabled={deleteBusy}>
              {deleteBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} {deleteBusy ? "Deleting…" : "Delete"}
            </VLButton>
          </>
        }
      >
        <p className="text-sm text-slate-600">Want to keep it around? Archive it instead — you can restore it any time.</p>
      </Modal>
    </div>
  );
}
