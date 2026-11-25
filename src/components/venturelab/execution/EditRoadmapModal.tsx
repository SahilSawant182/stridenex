"use client";

import { useState } from "react";
import { TASK_PRIORITIES, TASK_STATUSES, type Milestone, type RoadmapTask, type TaskPriority, type TaskStatus, type TeamMember } from "@/types/venturelab";
import { weekRange } from "@/lib/venturelab/utils";
import { FieldLabel, Modal, VLButton, inputClass } from "../shared/primitives";

export type RoadmapEditTarget =
  | { kind: "milestone"; milestone?: Milestone }
  | { kind: "task"; milestone: Milestone; task?: RoadmapTask };

type MilestoneInput = Pick<Milestone, "title" | "description" | "startWeek" | "endWeek"> & { id?: string };
type TaskInput = Omit<RoadmapTask, "id"> & { id?: string };

function MilestoneForm({ initial, onSubmit }: { initial?: Milestone; onSubmit: (m: MilestoneInput) => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startWeek, setStartWeek] = useState(initial?.startWeek ?? 1);
  const [endWeek, setEndWeek] = useState(initial?.endWeek ?? 2);
  const invalid = !title.trim() || startWeek < 1 || endWeek < startWeek;

  return (
    <form
      id="vl-roadmap-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!invalid) onSubmit({ id: initial?.id, title: title.trim(), description: description.trim(), startWeek, endWeek });
      }}
      className="space-y-4"
    >
      <div>
        <FieldLabel htmlFor="vl-ms-title">Milestone title</FieldLabel>
        <input id="vl-ms-title" autoFocus required maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Customer Interviews" />
      </div>
      <div>
        <FieldLabel htmlFor="vl-ms-desc">Goal (optional)</FieldLabel>
        <input id="vl-ms-desc" maxLength={140} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="What does done look like?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="vl-ms-start">Start week</FieldLabel>
          <input id="vl-ms-start" type="number" min={1} max={52} value={startWeek} onChange={(e) => setStartWeek(Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <FieldLabel htmlFor="vl-ms-end">End week</FieldLabel>
          <input id="vl-ms-end" type="number" min={startWeek} max={52} value={endWeek} onChange={(e) => setEndWeek(Number(e.target.value))} className={inputClass} />
        </div>
      </div>
      {endWeek < startWeek && <p className="text-sm text-red-600">End week must be on or after the start week.</p>}
    </form>
  );
}

function TaskForm({
  milestone,
  initial,
  team,
  roadmapStart,
  otherTasks,
  onSubmit,
}: {
  milestone: Milestone;
  initial?: RoadmapTask;
  team: TeamMember[];
  roadmapStart: string;
  otherTasks: RoadmapTask[];
  onSubmit: (t: TaskInput) => void;
}) {
  const defaults = weekRange(roadmapStart, milestone.startWeek, milestone.endWeek);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? "To Do");
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? "Medium");
  const [assigneeId, setAssigneeId] = useState(initial?.assigneeId ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? defaults.startDate);
  const [endDate, setEndDate] = useState(initial?.endDate ?? defaults.endDate);
  const [dependsOn, setDependsOn] = useState(initial?.dependsOn ?? "");
  const invalid = !title.trim() || !startDate || !endDate || endDate < startDate;

  return (
    <form
      id="vl-roadmap-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (invalid) return;
        onSubmit({
          id: initial?.id,
          title: title.trim(),
          status,
          priority,
          assigneeId: assigneeId || null,
          startDate,
          endDate,
          dependsOn: dependsOn || null,
        });
      }}
      className="space-y-4"
    >
      <div>
        <FieldLabel htmlFor="vl-task-title">Task</FieldLabel>
        <input id="vl-task-title" autoFocus required maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Interview 10 farmers" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="vl-task-status">Status</FieldLabel>
          <select id="vl-task-status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={inputClass}>
            {TASK_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="vl-task-priority">Priority</FieldLabel>
          <select id="vl-task-priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={inputClass}>
            {TASK_PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="vl-task-start">Expected start</FieldLabel>
          <input id="vl-task-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <FieldLabel htmlFor="vl-task-end">Expected end</FieldLabel>
          <input id="vl-task-end" type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <FieldLabel htmlFor="vl-task-assignee">Assignee</FieldLabel>
          <select id="vl-task-assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className={inputClass}>
            <option value="">Unassigned</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
                {m.status === "Invited" ? " (invited)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="vl-task-dep">Depends on</FieldLabel>
          <select id="vl-task-dep" value={dependsOn} onChange={(e) => setDependsOn(e.target.value)} className={inputClass}>
            <option value="">No dependency</option>
            {otherTasks
              .filter((t) => t.id !== initial?.id)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
          </select>
        </div>
      </div>
      {endDate < startDate && <p className="text-sm text-red-600">End date must be on or after the start date.</p>}
    </form>
  );
}

export default function EditRoadmapModal({
  target,
  team,
  roadmapStart,
  allTasks,
  onClose,
  onSaveMilestone,
  onSaveTask,
}: {
  target: RoadmapEditTarget | null;
  team: TeamMember[];
  roadmapStart: string;
  allTasks: RoadmapTask[];
  onClose: () => void;
  onSaveMilestone: (m: MilestoneInput) => void;
  onSaveTask: (milestoneId: string, t: TaskInput) => void;
}) {
  const isEdit = target?.kind === "milestone" ? !!target.milestone : !!target?.task;
  const noun = target?.kind === "milestone" ? "milestone" : "task";
  // Re-mount forms whenever the target changes so fields reset.
  const formKey =
    target?.kind === "milestone" ? `m-${target.milestone?.id ?? "new"}` : target ? `t-${target.milestone.id}-${target.task?.id ?? "new"}` : "none";

  return (
    <Modal
      open={target !== null}
      onOpenChange={(o) => !o && onClose()}
      title={`${isEdit ? "Edit" : "Add"} ${noun}`}
      description={target?.kind === "task" ? `In “${target.milestone.title}”` : "Milestones group tasks into phases of your roadmap."}
      footer={
        <>
          <VLButton variant="outline" onClick={onClose}>
            Cancel
          </VLButton>
          <VLButton type="submit" form="vl-roadmap-form">
            {isEdit ? "Save changes" : `Add ${noun}`}
          </VLButton>
        </>
      }
    >
      {target?.kind === "milestone" && <MilestoneForm key={formKey} initial={target.milestone} onSubmit={onSaveMilestone} />}
      {target?.kind === "task" && (
        <TaskForm
          key={formKey}
          milestone={target.milestone}
          initial={target.task}
          team={team}
          roadmapStart={roadmapStart}
          otherTasks={allTasks}
          onSubmit={(t) => onSaveTask(target.milestone.id, t)}
        />
      )}
    </Modal>
  );
}
