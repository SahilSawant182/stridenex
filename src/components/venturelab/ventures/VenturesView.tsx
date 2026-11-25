"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, FolderSearch, Plus } from "lucide-react";
import { VENTURE_STAGES, type Venture, type VentureStageFilter } from "@/types/venturelab";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useVentureLab } from "../VentureLabProvider";
import { EmptyState, PageHeader, VLButton } from "../shared/primitives";
import { CreateVentureModal, RenameVentureModal } from "../shared/VentureFormModals";
import VentureCard, { type VentureCardActions } from "../overview/VentureCard";

const FILTERS: VentureStageFilter[] = ["All", ...VENTURE_STAGES];

export default function VenturesView() {
  const router = useRouter();
  const { showToast } = useToast();
  const { ventures, activeVenture, setActiveVenture, setArchived, duplicateVenture } = useVentureLab();
  const [filter, setFilter] = useState<VentureStageFilter>("All");
  const [showArchived, setShowArchived] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [renaming, setRenaming] = useState<Venture | null>(null);

  const pool = ventures.filter((v) => v.archived === showArchived);
  const visible = pool.filter((v) => filter === "All" || v.stage === filter);
  const countFor = (f: VentureStageFilter) => pool.filter((v) => f === "All" || v.stage === f).length;
  const archivedCount = ventures.filter((v) => v.archived).length;

  const actions: VentureCardActions = {
    onRename: (v) => setRenaming(v),
    onDuplicate: (v) => {
      duplicateVenture(v.id);
      showToast(`Duplicated ${v.name}`, "success");
    },
    onArchiveToggle: (v) => {
      setArchived(v.id, !v.archived);
      showToast(v.archived ? `${v.name} restored` : `${v.name} archived`, "info");
    },
  };

  const openVenture = (v: Venture) => {
    if (v.archived) setArchived(v.id, false);
    setActiveVenture(v.id);
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
          {FILTERS.map((f) => {
            const active = filter === f;
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

      {visible.length === 0 ? (
        <EmptyState
          icon={<FolderSearch className="h-7 w-7" />}
          title={showArchived ? "No archived ventures here" : filter === "All" ? "No ventures yet" : `No ventures in ${filter}`}
          body={
            filter === "All"
              ? "Every big company started as a small idea. Create your first venture to begin."
              : `None of your ${showArchived ? "archived " : ""}ventures are at the ${filter} stage yet. Keep building — or start something new.`
          }
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {filter !== "All" && (
                <VLButton variant="outline" onClick={() => setFilter("All")}>
                  Show all ventures
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
            <div key={v.id} className="vl-rise" style={{ animationDelay: `${i * 50}ms` }}>
              <VentureCard venture={v} isActive={v.id === activeVenture?.id} onOpen={openVenture} actions={actions} showMilestone={false} />
            </div>
          ))}
        </div>
      )}

      <CreateVentureModal open={createOpen} onOpenChange={setCreateOpen} />
      <RenameVentureModal
        ventureId={renaming?.id ?? null}
        currentName={renaming?.name ?? ""}
        onOpenChange={(o) => !o && setRenaming(null)}
      />
    </div>
  );
}
