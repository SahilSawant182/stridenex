"use client";

import { formatDistanceToNow, parseISO } from "date-fns";
import { Archive, ArchiveRestore, ArrowRight, Calendar, Copy, MoreVertical, Pencil, Flag, Trash2 } from "lucide-react";
import type { Venture } from "@/types/venturelab";
import { stageBadge } from "@/lib/venturelab/constants";
import { initials, nextMilestone, ventureProgress, weekLabel } from "@/lib/venturelab/utils";
import { cn } from "@/lib/utils";
import {
  AvatarStack,
  Badge,
  Card,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
  IconButton,
  ProgressBar,
  VLButton,
} from "../shared/primitives";

export interface VentureCardActions {
  onEdit: (v: Venture) => void;
  onDelete: (v: Venture) => void;
  onArchiveToggle: (v: Venture) => void;
  onDuplicate: (v: Venture) => void;
}

export default function VentureCard({
  venture,
  isActive,
  onOpen,
  actions,
  showMilestone = true,
}: {
  venture: Venture;
  isActive?: boolean;
  onOpen: (v: Venture) => void;
  actions?: VentureCardActions;
  showMilestone?: boolean;
}) {
  const progress = venture.overallProgress ?? ventureProgress(venture);
  const next = nextMilestone(venture);

  return (
    <Card
      className={cn(
        "group flex h-full flex-col p-5 transition-shadow hover:shadow-md",
        isActive && "ring-2 ring-[#0f0fbd]/20",
        venture.archived && "opacity-75",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f0fbd] to-[#2e2ed9] text-sm font-bold text-white shadow-sm">
          {initials(venture.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-base font-bold text-slate-900">{venture.name}</h3>
            {isActive && <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0f0fbd]">Active</span>}
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {venture.sector && <Badge className="bg-slate-100 text-slate-700 ring-slate-200">{venture.sector}</Badge>}
            <Badge className={stageBadge(venture.stage)}>{venture.stage}</Badge>
            {venture.archived && <Badge className="bg-slate-800 text-white ring-slate-800">Archived</Badge>}
          </div>
        </div>
        {actions && (
          <Dropdown>
            <DropdownTrigger asChild>
              <IconButton label={`Actions for ${venture.name}`} className="-mr-2 -mt-1">
                <MoreVertical className="h-5 w-5" />
              </IconButton>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem onSelect={() => actions.onEdit(venture)}>
                <Pencil className="h-4 w-4" aria-hidden /> Edit details
              </DropdownItem>
              <DropdownItem onSelect={() => actions.onDuplicate(venture)}>
                <Copy className="h-4 w-4" aria-hidden /> Duplicate
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem onSelect={() => actions.onArchiveToggle(venture)} tone={venture.archived ? "default" : "danger"}>
                {venture.archived ? <ArchiveRestore className="h-4 w-4" aria-hidden /> : <Archive className="h-4 w-4" aria-hidden />}
                {venture.archived ? "Restore" : "Archive"}
              </DropdownItem>
              <DropdownItem onSelect={() => actions.onDelete(venture)} tone="danger">
                <Trash2 className="h-4 w-4" aria-hidden /> Delete
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{venture.description || "No tagline yet — add one from Edit details."}</p>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">Venture progress</span>
          <span className="font-bold text-slate-900 tabular-nums">{progress}%</span>
        </div>
        <ProgressBar value={progress} tone={progress >= 70 ? "success" : "primary"} label={`${venture.name} progress`} />
      </div>

      {showMilestone && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
          <Flag className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6b00]" aria-hidden />
          {next ? (
            <p className="min-w-0 text-slate-700">
              <span className="text-slate-500">Next: </span>
              <span className="font-semibold">{next.title}</span>
              <span className="text-slate-500"> · {weekLabel(next.startWeek, next.endWeek)}</span>
            </p>
          ) : (
            <p className="text-slate-700">All milestones complete 🎉</p>
          )}
        </div>
      )}

      <p className="mt-3 flex items-center gap-1 text-xs text-slate-500">
        <Calendar className="h-3.5 w-3.5" aria-hidden /> Updated {formatDistanceToNow(parseISO(venture.updatedAt), { addSuffix: true })}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <div className="flex min-w-0 items-center gap-3">
          <AvatarStack names={venture.team.map((m) => m.name)} />
        </div>
        <VLButton size="sm" variant={isActive ? "primary" : "outline"} onClick={() => onOpen(venture)}>
          Open Venture <ArrowRight className="h-4 w-4" aria-hidden />
        </VLButton>
      </div>
    </Card>
  );
}
