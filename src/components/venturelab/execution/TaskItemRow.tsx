"use client";

import { Calendar, Check, Link2, Pencil, Trash2 } from "lucide-react";
import type { RoadmapTask, TaskStatus, TeamMember } from "@/types/venturelab";
import { PRIORITY_BADGE, STATUS_BADGE } from "@/lib/venturelab/constants";
import { NEXT_STATUS, shortDate } from "@/lib/venturelab/utils";
import { cn } from "@/lib/utils";
import { Avatar, Badge, IconButton } from "../shared/primitives";

/** Circular check-off: To Do → In Progress → Completed → To Do. */
export function StatusCircle({ status, onClick, taskTitle }: { status: TaskStatus; onClick: () => void; taskTitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${taskTitle}: ${status}. Mark as ${NEXT_STATUS[status]}`}
      title={`Mark as ${NEXT_STATUS[status]}`}
      className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0fbd]"
    >
      <span
        className={cn(
          "relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all group-hover:scale-110",
          status === "Completed" && "border-emerald-500 bg-emerald-500 text-white",
          status === "In Progress" && "border-amber-500 bg-white",
          status === "To Do" && "border-slate-300 bg-white group-hover:border-slate-400",
        )}
      >
        {status === "Completed" && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
        {status === "In Progress" && (
          // Half-filled circle
          <span className="absolute inset-[3px] overflow-hidden rounded-full" aria-hidden>
            <span className="absolute inset-y-0 left-0 w-1/2 bg-amber-500" />
          </span>
        )}
      </span>
    </button>
  );
}

export default function TaskItemRow({
  task,
  assignee,
  dependsOnTitle,
  editMode,
  onCycleStatus,
  onEdit,
  onDelete,
}: {
  task: RoadmapTask;
  assignee: TeamMember | undefined;
  dependsOnTitle: string | null;
  editMode: boolean;
  onCycleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const done = task.status === "Completed";
  return (
    <li className="flex items-start gap-1 rounded-xl px-1 py-1 hover:bg-slate-50 sm:items-center">
      <StatusCircle status={task.status} onClick={onCycleStatus} taskTitle={task.title} />
      <div className="min-w-0 flex-1 py-2.5 sm:py-1.5">
        <p className={cn("text-sm font-medium", done ? "text-slate-500 line-through decoration-slate-400" : "text-slate-900")}>{task.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden /> {shortDate(task.startDate)} – {shortDate(task.endDate)}
          </span>
          {dependsOnTitle && (
            <span className="inline-flex min-w-0 items-center gap-1" title={`Depends on: ${dependsOnTitle}`}>
              <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden /> <span className="truncate">After “{dependsOnTitle}”</span>
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 py-2 sm:py-0">
        <Badge className={cn("hidden md:inline-flex", PRIORITY_BADGE[task.priority])}>{task.priority}</Badge>
        <Badge className={cn("hidden sm:inline-flex", STATUS_BADGE[task.status])}>{task.status}</Badge>
        {assignee ? (
          <span title={assignee.name}>
            <Avatar name={assignee.name} size="sm" />
            <span className="sr-only">Assigned to {assignee.name}</span>
          </span>
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-slate-300 text-[10px] text-slate-400" title="Unassigned">
            —
          </span>
        )}
      </div>
      {editMode && (
        <div className="vl-fade-in flex shrink-0">
          <IconButton label={`Edit task ${task.title}`} onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </IconButton>
          <IconButton label={`Delete task ${task.title}`} tone="danger" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      )}
    </li>
  );
}
