// lib/venturelab/utils.ts
// Pure helpers for VentureLab — progress maths, dates, ids. No React here.
import { addDays, differenceInCalendarDays, format, parseISO, startOfWeek } from "date-fns";
import type {
  BmcBlockId,
  CanvasBlocks,
  JourneyStep,
  Milestone,
  RoadmapTask,
  TaskStatus,
  Venture,
} from "@/types/venturelab";
import { BMC_STORY_ORDER } from "./constants";

export function uid(prefix = "id"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${rand}`;
}

export function initials(name: string): string {
  return name
    .replace(/^(dr|mr|ms|mrs|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Deterministic avatar colour from a string. */
export function avatarColor(seed: string): string {
  const palette = ["bg-[#0f0fbd]", "bg-[#ff6b00]", "bg-emerald-600", "bg-violet-600", "bg-sky-700", "bg-rose-600"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

export const toISODate = (d: Date) => format(d, "yyyy-MM-dd");

export function mondayOf(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/** Inclusive date range for a 1-based week window relative to the roadmap start. */
export function weekRange(roadmapStart: string, startWeek: number, endWeek: number) {
  const start = parseISO(roadmapStart);
  return {
    startDate: toISODate(addDays(start, (startWeek - 1) * 7)),
    endDate: toISODate(addDays(start, endWeek * 7 - 3)), // ends on Friday of endWeek
  };
}

export function weekLabel(startWeek: number, endWeek: number) {
  return startWeek === endWeek ? `Week ${startWeek}` : `Weeks ${startWeek}–${endWeek}`;
}

export function shortDate(iso: string) {
  return format(parseISO(iso), "d MMM");
}

export function daysBetween(a: string, b: string) {
  return differenceInCalendarDays(parseISO(b), parseISO(a));
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

export function emptyCanvas(): CanvasBlocks {
  return { kp: [], ka: [], kr: [], vp: [], cr: [], ch: [], cs: [], co: [], rs: [] };
}

export function cloneBlocks(blocks: CanvasBlocks): CanvasBlocks {
  const out = emptyCanvas();
  (Object.keys(out) as BmcBlockId[]).forEach((k) => {
    out[k] = blocks[k].map((i) => ({ ...i }));
  });
  return out;
}

export function filledBlockCount(blocks: CanvasBlocks): number {
  return BMC_STORY_ORDER.filter((id) => blocks[id].length > 0).length;
}

export function canvasCompleteness(blocks: CanvasBlocks): number {
  return Math.round((filledBlockCount(blocks) / 9) * 100);
}

export function canvasEquals(a: CanvasBlocks, b: CanvasBlocks): boolean {
  return BMC_STORY_ORDER.every(
    (id) =>
      a[id].length === b[id].length &&
      a[id].every((item, i) => item.text === b[id][i].text && item.isAssumption === b[id][i].isAssumption),
  );
}

/** Bumps "v1.0" -> "v1.1". */
export function nextVersionLabel(latest: string | undefined): string {
  if (!latest) return "v1.0";
  const m = latest.match(/^v(\d+)\.(\d+)$/);
  if (!m) return "v1.0";
  return `v${m[1]}.${Number(m[2]) + 1}`;
}

/* ------------------------------------------------------------------ */
/* Execution                                                           */
/* ------------------------------------------------------------------ */

export const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  "To Do": "In Progress",
  "In Progress": "Completed",
  Completed: "To Do",
};

export function allTasks(milestones: Milestone[]): RoadmapTask[] {
  return milestones.flatMap((m) => m.tasks);
}

export function milestoneDone(m: Milestone) {
  return m.tasks.filter((t) => t.status === "Completed").length;
}

export function milestoneStatus(m: Milestone): TaskStatus {
  if (m.tasks.length === 0) return "To Do";
  const done = milestoneDone(m);
  if (done === m.tasks.length) return "Completed";
  if (done > 0 || m.tasks.some((t) => t.status === "In Progress")) return "In Progress";
  return "To Do";
}

export function roadmapCompletion(milestones: Milestone[]): number {
  const tasks = allTasks(milestones);
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.status === "Completed").length / tasks.length) * 100);
}

export function activeRoadmap(v: Venture): Milestone[] {
  return v.execution.roadmaps[v.execution.activeTemplate];
}

export function nextMilestone(v: Venture): Milestone | null {
  return activeRoadmap(v).find((m) => milestoneStatus(m) !== "Completed") ?? null;
}

export function completedMilestones(v: Venture): number {
  return activeRoadmap(v).filter((m) => m.tasks.length > 0 && milestoneStatus(m) === "Completed").length;
}

/* ------------------------------------------------------------------ */
/* Venture-level progress & journey                                    */
/* ------------------------------------------------------------------ */

/** Discovery is done once the generated canvas has customers and a value proposition. */
const discoveryDone = (v: Venture) => v.canvas.blocks.cs.length > 0 && v.canvas.blocks.vp.length > 0;

/**
 * Weighted progress: discovery 10%, canvas 40%, roadmap 40%, team 10%.
 * Kept simple and explainable so students can see how to move the needle.
 */
export function ventureProgress(v: Venture): number {
  const discovery = discoveryDone(v) ? 100 : 0;
  const canvas = canvasCompleteness(v.canvas.blocks);
  const roadmap = roadmapCompletion(activeRoadmap(v));
  const team = v.team.filter((m) => m.status === "Active").length >= 2 ? 100 : 0;
  return Math.round(discovery * 0.1 + canvas * 0.4 + roadmap * 0.4 + team * 0.1);
}

/** Sequential journey: the first unfinished step is "In Progress", later ones "Upcoming". */
export function journeySteps(v: Venture | null): JourneyStep[] {
  const done = v
    ? [
        discoveryDone(v),
        canvasCompleteness(v.canvas.blocks) === 100,
        roadmapCompletion(activeRoadmap(v)) === 100,
        v.team.filter((m) => m.status === "Active" && m.canWrite).length >= 2 &&
          v.team.every((m) => m.status === "Active"),
      ]
    : [false, false, false, false];

  const base: Omit<JourneyStep, "status">[] = [
    { key: "discover", title: "Discover Your Idea", description: "Capture the problem, audience and solution.", href: "/venturelab/discovery" },
    { key: "model", title: "Define Business Model", description: "Fill all 9 blocks of the canvas.", href: "/venturelab/canvas" },
    { key: "execution", title: "Execution Roadmap", description: "Work through milestones and tasks.", href: "/venturelab/execution" },
    { key: "team", title: "Team & Collaboration", description: "Bring co-founders and mentors on board.", href: "/venturelab/team" },
  ];

  let blocked = false;
  return base.map((step, i) => {
    if (blocked) return { ...step, status: "Upcoming" };
    if (done[i]) return { ...step, status: "Completed" };
    blocked = true;
    return { ...step, status: "In Progress" };
  });
}

/** Plain-text export of the canvas — also used by the "Full Story" wizard step. */
export function canvasToText(name: string, blocks: CanvasBlocks, blockNames: Record<BmcBlockId, string>): string {
  const lines = [`${name} — Business Model Canvas`, "".padEnd(40, "="), ""];
  BMC_STORY_ORDER.forEach((id) => {
    lines.push(`${blockNames[id]}`);
    if (blocks[id].length === 0) lines.push("  (empty)");
    blocks[id].forEach((item) => lines.push(`  • ${item.text}${item.isAssumption ? "  [assumption]" : ""}`));
    lines.push("");
  });
  return lines.join("\n");
}
