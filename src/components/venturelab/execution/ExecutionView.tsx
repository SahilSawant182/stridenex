"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { GanttChartSquare, ListTree, PencilRuler, RotateCcw } from "lucide-react";
import type { Milestone, RoadmapTask, RoadmapTemplateId } from "@/types/venturelab";
import { ROADMAP_TEMPLATES } from "@/lib/venturelab/constants";
import { allTasks, roadmapCompletion } from "@/lib/venturelab/utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useVentureLab } from "../VentureLabProvider";
import { Modal, PageHeader, VLButton } from "../shared/primitives";
import RoadmapTemplateSelector from "./RoadmapTemplateSelector";
import MilestoneTimeline from "./MilestoneTimeline";
import ProjectViewGantt from "./ProjectViewGantt";
import EditRoadmapModal, { type RoadmapEditTarget } from "./EditRoadmapModal";

type View = "roadmap" | "project";

type PendingDelete = { kind: "milestone"; m: Milestone } | { kind: "template"; id: RoadmapTemplateId } | null;

export default function ExecutionView() {
  const {
    activeVenture,
    setActiveTemplate,
    resetTemplate,
    cycleTaskStatus,
    updateTask,
    upsertMilestone,
    deleteMilestone,
    upsertTask,
    deleteTask,
  } = useVentureLab();
  const { showToast } = useToast();
  const [view, setView] = useState<View>("roadmap");
  const [editMode, setEditMode] = useState(false);
  const [editTarget, setEditTarget] = useState<RoadmapEditTarget | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

  if (!activeVenture) return null;
  const { execution, team } = activeVenture;
  const templateId = execution.activeTemplate;
  const milestones = execution.roadmaps[templateId];
  const meta = ROADMAP_TEMPLATES[templateId];
  const pct = roadmapCompletion(milestones);

  const toggleEdit = () => {
    setEditMode((e) => !e);
    setView("roadmap");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Execution Hub"
        subtitle={`Turn ${activeVenture.name}’s canvas into weekly action — pick a roadmap, tick off tasks, and track it on a timeline.`}
      />

      <RoadmapTemplateSelector
        active={templateId}
        roadmaps={execution.roadmaps}
        onSelect={(id) => {
          setActiveTemplate(id);
          if (id !== templateId) showToast(`Switched to ${ROADMAP_TEMPLATES[id].name}`, "info");
        }}
      />

      <Tabs.Root value={view} onValueChange={(v) => setView(v as View)}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">{meta.name}</h2>
            <p className="text-sm text-slate-600">
              {milestones.length} milestones · {allTasks(milestones).length} tasks · <span className="font-semibold text-slate-900">{pct}% complete</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tabs.List aria-label="Execution view" className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
              {(
                [
                  ["roadmap", "Milestone Roadmap", ListTree],
                  ["project", "Project View", GanttChartSquare],
                ] as const
              ).map(([value, label, Icon]) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 data-[state=active]:bg-[#0f0fbd] data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden /> {label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <VLButton
              variant={editMode ? "accent" : "outline"}
              aria-pressed={editMode}
              onClick={toggleEdit}
            >
              <PencilRuler className="h-4 w-4" aria-hidden /> {editMode ? "Done Editing" : "Edit Roadmap"}
            </VLButton>
          </div>
        </div>

        {editMode && (
          <div role="status" className="vl-fade-in mt-4 flex flex-col gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <strong>Edit mode:</strong> rename, reschedule, add or delete milestones and tasks to fit {activeVenture.name}.
            </p>
            <VLButton size="sm" variant="outline" onClick={() => setPendingDelete({ kind: "template", id: templateId })}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Reset to template
            </VLButton>
          </div>
        )}

        <Tabs.Content value="roadmap" className={cn("mt-5 focus:outline-none")}>
          <MilestoneTimeline
            key={`${activeVenture.id}-${templateId}`}
            milestones={milestones}
            team={team}
            editMode={editMode}
            onCycleStatus={(mid, tid) => {
              const next = cycleTaskStatus(mid, tid);
              if (next === "Completed") showToast("Task completed ✓", "success");
            }}
            onAddMilestone={() => setEditTarget({ kind: "milestone" })}
            onEditMilestone={(m) => setEditTarget({ kind: "milestone", milestone: m })}
            onDeleteMilestone={(m) => setPendingDelete({ kind: "milestone", m })}
            onAddTask={(m) => setEditTarget({ kind: "task", milestone: m })}
            onEditTask={(m, t) => setEditTarget({ kind: "task", milestone: m, task: t })}
            onDeleteTask={(m: Milestone, t: RoadmapTask) => {
              deleteTask(m.id, t.id);
              showToast(`Deleted “${t.title}”`, "info");
            }}
          />
        </Tabs.Content>

        <Tabs.Content value="project" className="mt-5 focus:outline-none">
          <ProjectViewGantt
            milestones={milestones}
            team={team}
            startDate={execution.startDate}
            minWeeks={meta.durationWeeks}
            onStatusChange={(taskId, status) => updateTask(taskId, { status })}
          />
        </Tabs.Content>
      </Tabs.Root>

      <EditRoadmapModal
        target={editTarget}
        team={team}
        roadmapStart={execution.startDate}
        allTasks={allTasks(milestones)}
        onClose={() => setEditTarget(null)}
        onSaveMilestone={(m) => {
          upsertMilestone(m);
          showToast(m.id ? "Milestone updated" : "Milestone added", "success");
          setEditTarget(null);
        }}
        onSaveTask={(mid, t) => {
          upsertTask(mid, t);
          showToast(t.id ? "Task updated" : "Task added", "success");
          setEditTarget(null);
        }}
      />

      <Modal
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        size="sm"
        title={pendingDelete?.kind === "template" ? "Reset this roadmap?" : "Delete milestone?"}
        description={
          pendingDelete?.kind === "template"
            ? `All edits and task progress in ${meta.name} will be replaced with the original template.`
            : pendingDelete?.kind === "milestone"
              ? `“${pendingDelete.m.title}” and its ${pendingDelete.m.tasks.length} task(s) will be removed.`
              : undefined
        }
        footer={
          <>
            <VLButton variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </VLButton>
            <VLButton
              variant="danger"
              onClick={() => {
                if (pendingDelete?.kind === "milestone") {
                  deleteMilestone(pendingDelete.m.id);
                  showToast("Milestone deleted", "info");
                } else if (pendingDelete?.kind === "template") {
                  resetTemplate(pendingDelete.id);
                  showToast("Roadmap reset to template", "info");
                }
                setPendingDelete(null);
              }}
            >
              {pendingDelete?.kind === "template" ? "Reset roadmap" : "Delete"}
            </VLButton>
          </>
        }
      >
        <p className="text-sm text-slate-600">This can’t be undone.</p>
      </Modal>
    </div>
  );
}
