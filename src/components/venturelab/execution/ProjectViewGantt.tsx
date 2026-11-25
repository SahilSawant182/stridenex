"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { addDays, format, parseISO } from "date-fns";
import { CalendarRange, Table2 } from "lucide-react";
import { TASK_STATUSES, type Milestone, type RoadmapTask, type TaskStatus, type TeamMember } from "@/types/venturelab";
import { PRIORITY_BADGE, STATUS_FILL } from "@/lib/venturelab/constants";
import { daysBetween, milestoneStatus, shortDate, weekLabel } from "@/lib/venturelab/utils";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Card } from "../shared/primitives";
import { useNow } from "../shared/useNow";

/* ------------------------------------------------------------------ */
/* Tasks table (ERP-style list)                                        */
/* ------------------------------------------------------------------ */

const STATUS_SELECT: Record<TaskStatus, string> = {
  "To Do": "border-slate-200 bg-slate-50 text-slate-800",
  "In Progress": "border-amber-200 bg-amber-50 text-amber-900",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

function TasksTable({
  milestones,
  team,
  onStatusChange,
}: {
  milestones: Milestone[];
  team: TeamMember[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  const all = milestones.flatMap((m) => m.tasks.map((t) => ({ ...t, milestone: m })));
  const titleOf = (id: string | null) => (id ? all.find((t) => t.id === id)?.title : undefined);

  if (all.length === 0) return <p className="px-4 py-10 text-center text-sm text-slate-500">No tasks yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <caption className="sr-only">Roadmap tasks</caption>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600">
            <th scope="col" className="px-4 py-3">Subject</th>
            <th scope="col" className="px-3 py-3">Status</th>
            <th scope="col" className="px-3 py-3">Priority</th>
            <th scope="col" className="px-3 py-3">Assignee</th>
            <th scope="col" className="px-3 py-3">Exp. Start</th>
            <th scope="col" className="px-3 py-3">Exp. End</th>
            <th scope="col" className="px-3 py-3">Depends On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {all.map((t) => {
            const who = team.find((m) => m.id === t.assigneeId);
            const dep = titleOf(t.dependsOn);
            return (
              <tr key={t.id} className="hover:bg-slate-50/70">
                <td className="max-w-[280px] px-4 py-2.5">
                  <p className="truncate font-medium text-slate-900">{t.title}</p>
                  <p className="truncate text-xs text-slate-500">{t.milestone.title}</p>
                </td>
                <td className="px-3 py-2.5">
                  <label className="sr-only" htmlFor={`vl-status-${t.id}`}>
                    Status for {t.title}
                  </label>
                  <select
                    id={`vl-status-${t.id}`}
                    value={t.status}
                    onChange={(e) => onStatusChange(t.id, e.target.value as TaskStatus)}
                    className={cn("min-h-11 rounded-lg border px-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f0fbd]/30", STATUS_SELECT[t.status])}
                  >
                    {TASK_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2.5">
                  <Badge className={PRIORITY_BADGE[t.priority]}>{t.priority}</Badge>
                </td>
                <td className="px-3 py-2.5">
                  {who ? (
                    <span className="flex items-center gap-2">
                      <Avatar name={who.name} size="sm" />
                      <span className="truncate text-slate-800">{who.name}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">Unassigned</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 tabular-nums">{format(parseISO(t.startDate), "dd MMM yyyy")}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 tabular-nums">{format(parseISO(t.endDate), "dd MMM yyyy")}</td>
                <td className="max-w-[200px] truncate px-3 py-2.5 text-slate-600" title={dep}>
                  {dep ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Weekly Gantt (pure SVG)                                             */
/* ------------------------------------------------------------------ */

const LABEL_W = 240;
const WEEK_W = 84;
const HEADER_H = 44;
const ROW_H = 36;
const MS_ROW_H = 34;

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

function Gantt({ milestones, startDate, minWeeks }: { milestones: Milestone[]; startDate: string; minWeeks: number }) {
  const now = useNow(60_000);

  // Grow the chart to fit any task that runs past the template's planned length.
  const lastTaskDay = Math.max(0, ...milestones.flatMap((m) => m.tasks.map((t) => daysBetween(startDate, t.endDate) + 1)));
  const weeks = Math.max(minWeeks, ...milestones.map((m) => m.endWeek), Math.ceil(lastTaskDay / 7), 1);
  const dayW = WEEK_W / 7;
  const xOfDay = (d: number) => LABEL_W + d * dayW;

  type Row = { kind: "ms"; m: Milestone } | { kind: "task"; t: RoadmapTask };
  const rows: Row[] = milestones.flatMap((m) => [{ kind: "ms" as const, m }, ...m.tasks.map((t) => ({ kind: "task" as const, t }))]);

  const placed = rows.reduce<{ r: Row; y: number; h: number }[]>((acc, r) => {
    const prev = acc[acc.length - 1];
    acc.push({ r, y: prev ? prev.y + prev.h : HEADER_H, h: r.kind === "ms" ? MS_ROW_H : ROW_H });
    return acc;
  }, []);
  const last = placed[placed.length - 1];

  const width = LABEL_W + weeks * WEEK_W;
  const height = (last ? last.y + last.h : HEADER_H) + 30; // room for the Today pill
  const todayDay = daysBetween(startDate, format(now, "yyyy-MM-dd"));
  const todayVisible = todayDay >= 0 && todayDay <= weeks * 7;

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Weekly Gantt timeline across ${weeks} weeks`}
        className="block font-[Inter,system-ui,sans-serif]"
      >
        {/* Week columns */}
        {Array.from({ length: weeks }, (_, w) => {
          const x = LABEL_W + w * WEEK_W;
          const wkStart = addDays(parseISO(startDate), w * 7);
          return (
            <g key={w}>
              <rect x={x} y={0} width={WEEK_W} height={height} fill={w % 2 ? "#f8fafc" : "#ffffff"} />
              <line x1={x} x2={x} y1={0} y2={height} stroke="#e2e8f0" />
              <text x={x + 10} y={18} fontSize={12} fontWeight={700} fill="#0f172a">
                W{w + 1}
              </text>
              <text x={x + 10} y={34} fontSize={11} fill="#64748b">
                {format(wkStart, "d MMM")}
              </text>
            </g>
          );
        })}
        <line x1={0} x2={width} y1={HEADER_H} y2={HEADER_H} stroke="#cbd5e1" />
        <rect x={0} y={0} width={LABEL_W} height={height} fill="#ffffff" />
        <line x1={LABEL_W} x2={LABEL_W} y1={0} y2={height} stroke="#cbd5e1" />
        <text x={16} y={27} fontSize={12} fontWeight={700} fill="#475569" letterSpacing={0.6}>
          TASK
        </text>

        {/* Rows */}
        {placed.map(({ r, y: ry, h }) => {
          if (r.kind === "ms") {
            const x1 = xOfDay((r.m.startWeek - 1) * 7);
            const x2 = xOfDay(r.m.endWeek * 7 - 2);
            const st = milestoneStatus(r.m);
            return (
              <g key={`ms-${r.m.id}`}>
                <rect x={0} y={ry} width={width} height={h} fill="#0f0fbd" fillOpacity={0.04} />
                <text x={16} y={ry + h / 2 + 4} fontSize={12} fontWeight={700} fill="#0f0fbd">
                  {clip(r.m.title, 26)}
                </text>
                <rect x={x1} y={ry + h / 2 - 3} width={Math.max(6, x2 - x1)} height={6} rx={3} fill={STATUS_FILL[st]} opacity={0.9}>
                  <title>{`${r.m.title} · ${weekLabel(r.m.startWeek, r.m.endWeek)} · ${st}`}</title>
                </rect>
                <path d={`M${x1} ${ry + h / 2 - 7} l5 7 l-5 7 l-5 -7z`} fill="#0f0fbd" />
                <path d={`M${x2} ${ry + h / 2 - 7} l5 7 l-5 7 l-5 -7z`} fill="#0f0fbd" />
              </g>
            );
          }
          const t = r.t;
          const s = daysBetween(startDate, t.startDate);
          const e = daysBetween(startDate, t.endDate) + 1;
          const x1 = xOfDay(Math.max(0, s));
          const w = Math.max(dayW, xOfDay(e) - x1);
          return (
            <g key={t.id}>
              <line x1={0} x2={width} y1={ry + h} y2={ry + h} stroke="#f1f5f9" />
              <circle cx={24} cy={ry + h / 2} r={4} fill={STATUS_FILL[t.status]} />
              <text x={36} y={ry + h / 2 + 4} fontSize={12} fill={t.status === "Completed" ? "#64748b" : "#0f172a"}>
                {clip(t.title, 28)}
              </text>
              <rect x={x1} y={ry + 8} width={w} height={h - 16} rx={6} fill={STATUS_FILL[t.status]}>
                <title>{`${t.title}\n${shortDate(t.startDate)} – ${shortDate(t.endDate)} · ${t.status}`}</title>
              </rect>
              {w > 60 && (
                <text x={x1 + 8} y={ry + h / 2 + 4} fontSize={11} fontWeight={600} fill="#ffffff" pointerEvents="none">
                  {t.status === "Completed" ? "Done" : t.status === "In Progress" ? "In progress" : ""}
                </text>
              )}
            </g>
          );
        })}

        {/* Today indicator */}
        {todayVisible && (
          <g aria-label="Today">
            <line x1={xOfDay(todayDay)} x2={xOfDay(todayDay)} y1={HEADER_H} y2={height - 22} stroke="#ff6b00" strokeWidth={2} strokeDasharray="4 3" />
            <rect x={xOfDay(todayDay) - 24} y={height - 22} width={48} height={18} rx={9} fill="#ff6b00" />
            <text x={xOfDay(todayDay)} y={height - 9} fontSize={10} fontWeight={700} fill="#ffffff" textAnchor="middle">
              TODAY
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function ProjectViewGantt({
  milestones,
  team,
  startDate,
  minWeeks,
  onStatusChange,
}: {
  milestones: Milestone[];
  team: TeamMember[];
  startDate: string;
  minWeeks: number;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  const triggerCls =
    "inline-flex min-h-11 items-center gap-2 border-b-2 border-transparent px-4 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 data-[state=active]:border-[#0f0fbd] data-[state=active]:text-[#0f0fbd]";

  return (
    <Card className="overflow-hidden">
      <Tabs.Root defaultValue="tasks">
        <Tabs.List aria-label="Project view" className="flex gap-1 border-b border-slate-200 px-2">
          <Tabs.Trigger value="tasks" className={triggerCls}>
            <Table2 className="h-4 w-4" aria-hidden /> Tasks
          </Tabs.Trigger>
          <Tabs.Trigger value="gantt" className={triggerCls}>
            <CalendarRange className="h-4 w-4" aria-hidden /> Gantt Timeline
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tasks" className="focus:outline-none">
          <TasksTable milestones={milestones} team={team} onStatusChange={onStatusChange} />
        </Tabs.Content>
        <Tabs.Content value="gantt" className="focus:outline-none">
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-4 py-2.5 text-xs text-slate-600">
            {TASK_STATUSES.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-4 rounded-sm" style={{ background: STATUS_FILL[s] }} aria-hidden /> {s}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-0.5 bg-[#ff6b00]" aria-hidden /> Today
            </span>
          </div>
          <Gantt milestones={milestones} startDate={startDate} minWeeks={minWeeks} />
        </Tabs.Content>
      </Tabs.Root>
    </Card>
  );
}
