"use client";

import { useState } from "react";
import { Check, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import type { Milestone, RoadmapTask, TeamMember } from "@/types/venturelab";
import { STATUS_BADGE } from "@/lib/venturelab/constants";
import { milestoneDone, milestoneStatus, weekLabel } from "@/lib/venturelab/utils";
import { cn } from "@/lib/utils";
import { Badge, Card, IconButton, ProgressBar, VLButton } from "../shared/primitives";
import TaskItemRow from "./TaskItemRow";

export default function MilestoneTimeline({
  milestones,
  team,
  editMode,
  onCycleStatus,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  milestones: Milestone[];
  team: TeamMember[];
  editMode: boolean;
  onCycleStatus: (milestoneId: string, taskId: string) => void;
  onAddMilestone: () => void;
  onEditMilestone: (m: Milestone) => void;
  onDeleteMilestone: (m: Milestone) => void;
  onAddTask: (m: Milestone) => void;
  onEditTask: (m: Milestone, t: RoadmapTask) => void;
  onDeleteTask: (m: Milestone, t: RoadmapTask) => void;
}) {
  // Open whatever is in flight by default; the founder can toggle any phase.
  const [open, setOpen] = useState<Set<string>>(() => {
    const current =
      milestones.find((m) => milestoneStatus(m) === "In Progress") ?? milestones.find((m) => milestoneStatus(m) !== "Completed");
    return new Set(current ? [current.id] : []);
  });
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const allTasks = milestones.flatMap((m) => m.tasks);
  const titleOf = (id: string | null) => (id ? allTasks.find((t) => t.id === id)?.title ?? null : null);

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2">
        <VLButton variant="ghost" size="sm" onClick={() => setOpen(new Set(milestones.map((m) => m.id)))}>
          Expand all
        </VLButton>
        <VLButton variant="ghost" size="sm" onClick={() => setOpen(new Set())}>
          Collapse all
        </VLButton>
      </div>

      <ol className="relative space-y-4">
        {milestones.map((m, idx) => {
          const status = milestoneStatus(m);
          const done = milestoneDone(m);
          const isOpen = open.has(m.id);
          const pct = m.tasks.length ? Math.round((done / m.tasks.length) * 100) : 0;
          const panelId = `vl-ms-${m.id}`;
          const last = idx === milestones.length - 1;
          return (
            <li key={m.id} className="relative pl-12 sm:pl-14">
              {/* Timeline rail */}
              {!last && <span className="absolute left-[19px] top-12 h-[calc(100%-8px)] w-0.5 bg-slate-200 sm:left-[23px]" aria-hidden />}
              <span
                className={cn(
                  "absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold sm:left-1",
                  status === "Completed" && "bg-emerald-500 text-white",
                  status === "In Progress" && "bg-[#ff6b00] text-white ring-4 ring-orange-100",
                  status === "To Do" && "border-2 border-slate-200 bg-white text-slate-500",
                )}
                aria-hidden
              >
                {status === "Completed" ? <Check className="h-5 w-5" /> : idx + 1}
              </span>

              <Card className={cn("overflow-hidden", status === "In Progress" && "border-orange-200")}>
                <div className="flex items-start gap-2 p-3 sm:p-4">
                  <button
                    onClick={() => toggle(m.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex min-h-11 min-w-0 flex-1 flex-col items-start gap-2 text-left sm:flex-row sm:items-center sm:gap-4"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-[#0f0fbd]/[0.07] text-[#0f0fbd] ring-[#0f0fbd]/20">{weekLabel(m.startWeek, m.endWeek)}</Badge>
                        <Badge className={STATUS_BADGE[status]}>{status}</Badge>
                      </span>
                      <span className="mt-1.5 block text-base font-bold text-slate-900">{m.title}</span>
                      {m.description && <span className="block text-sm text-slate-600">{m.description}</span>}
                    </span>
                    <span className="flex w-full items-center gap-3 sm:w-44 sm:shrink-0">
                      <ProgressBar value={pct} tone={pct === 100 ? "success" : "primary"} label={`${m.title} progress`} />
                      <span className="shrink-0 text-xs font-bold text-slate-900 tabular-nums">
                        {done}/{m.tasks.length} Done
                      </span>
                    </span>
                    <ChevronDown
                      className={cn("hidden h-5 w-5 shrink-0 text-slate-400 transition-transform sm:block", isOpen && "rotate-180")}
                      aria-hidden
                    />
                  </button>
                  {editMode && (
                    <div className="vl-fade-in flex shrink-0">
                      <IconButton label={`Edit milestone ${m.title}`} onClick={() => onEditMilestone(m)}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      <IconButton label={`Delete milestone ${m.title}`} tone="danger" onClick={() => onDeleteMilestone(m)}>
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  )}
                </div>

                {isOpen && (
                  <div id={panelId} className="vl-fade-in border-t border-slate-100 px-2 pb-3 pt-2 sm:px-3">
                    {m.tasks.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-slate-500">No tasks in this milestone yet.</p>
                    ) : (
                      <ul aria-label={`${m.title} tasks`}>
                        {m.tasks.map((t) => (
                          <TaskItemRow
                            key={t.id}
                            task={t}
                            assignee={team.find((p) => p.id === t.assigneeId)}
                            dependsOnTitle={titleOf(t.dependsOn)}
                            editMode={editMode}
                            onCycleStatus={() => onCycleStatus(m.id, t.id)}
                            onEdit={() => onEditTask(m, t)}
                            onDelete={() => onDeleteTask(m, t)}
                          />
                        ))}
                      </ul>
                    )}
                    {editMode && (
                      <VLButton variant="ghost" size="sm" className="ml-1 mt-1 text-[#0f0fbd]" onClick={() => onAddTask(m)}>
                        <Plus className="h-4 w-4" aria-hidden /> Add Task
                      </VLButton>
                    )}
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ol>

      {milestones.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
          This roadmap has no milestones. Turn on <strong>Edit Roadmap</strong> to add your first one.
        </p>
      )}

      {editMode && (
        <div className="mt-4 pl-12 sm:pl-14">
          <button
            onClick={onAddMilestone}
            className="vl-fade-in flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-600 transition-colors hover:border-[#0f0fbd] hover:text-[#0f0fbd]"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add Milestone
          </button>
        </div>
      )}
    </div>
  );
}
