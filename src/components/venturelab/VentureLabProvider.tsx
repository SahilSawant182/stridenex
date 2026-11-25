"use client";

// Global VentureLab state. Stage 1 is front-end only: state is seeded from mock
// data and persisted to localStorage so a student's edits survive reloads.
// Swap the load/save functions for API calls when the backend lands.

import React, { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type {
  BmcBlockId,
  MemberCategory,
  Milestone,
  RoadmapTask,
  RoadmapTemplateId,
  TaskStatus,
  TeamMember,
  Venture,
  VentureNotification,
} from "@/types/venturelab";
import { createBlankVenture, templateMilestones } from "@/lib/venturelab/mockData";
import { seedState, ventureStore, type PersistedState } from "@/lib/venturelab/store";
import { NEXT_STATUS, canvasEquals, cloneBlocks, nextVersionLabel, uid } from "@/lib/venturelab/utils";

export interface VentureLabContextValue {
  ready: boolean;
  ventures: Venture[];
  activeVenture: Venture | null;
  notifications: VentureNotification[];

  // Ventures
  setActiveVenture: (id: string) => void;
  createVenture: (input: { name: string; sector: string; description: string }) => string;
  renameVenture: (id: string, name: string) => void;
  setArchived: (id: string, archived: boolean) => void;
  duplicateVenture: (id: string) => void;
  updateVenture: (id: string, patch: Partial<Pick<Venture, "description" | "rawIdea" | "stage" | "sector">>) => void;

  // Canvas (active venture)
  addCanvasItem: (block: BmcBlockId, text: string, isAssumption?: boolean) => void;
  removeCanvasItem: (block: BmcBlockId, itemId: string) => void;
  toggleAssumption: (block: BmcBlockId, itemId: string) => void;
  saveCanvas: (note?: string) => string;
  restoreCanvasVersion: (versionId: string) => void;

  // Execution (active venture)
  setActiveTemplate: (id: RoadmapTemplateId) => void;
  resetTemplate: (id: RoadmapTemplateId) => void;
  cycleTaskStatus: (milestoneId: string, taskId: string) => TaskStatus | null;
  updateTask: (taskId: string, patch: Partial<Omit<RoadmapTask, "id">>) => void;
  upsertMilestone: (milestone: Pick<Milestone, "title" | "description" | "startWeek" | "endWeek"> & { id?: string }) => void;
  deleteMilestone: (milestoneId: string) => void;
  upsertTask: (milestoneId: string, task: Omit<RoadmapTask, "id"> & { id?: string }) => void;
  deleteTask: (milestoneId: string, taskId: string) => void;

  // Team (active venture)
  inviteMember: (input: { name: string; email: string; category: MemberCategory; canRead: boolean; canWrite: boolean }) => void;
  setPermission: (memberId: string, perm: "read" | "write", value: boolean) => void;
  setMemberCategory: (memberId: string, category: MemberCategory) => void;
  removeMember: (memberId: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  resetDemoData: () => void;
}

const VentureLabContext = createContext<VentureLabContextValue | null>(null);

const EMPTY_STATE: PersistedState = { ventures: [], activeVentureId: null, notifications: [] };

/** Active venture, falling back to the first non-archived one. */
function resolveActive(s: PersistedState): Venture | null {
  return s.ventures.find((v) => v.id === s.activeVentureId) ?? s.ventures.find((v) => !v.archived) ?? null;
}

const touch = (v: Venture) => {
  v.updatedAt = new Date().toISOString();
};

const markCanvasDirty = (v: Venture) => {
  const latest = v.canvas.versions[0];
  v.canvas.dirty = latest ? !canvasEquals(v.canvas.blocks, latest.blocks) : true;
};

export function VentureLabProvider({ children }: { children: React.ReactNode }) {
  // Server render and first hydration pass see `null` (not ready); the client then reads storage.
  const snapshot = useSyncExternalStore(ventureStore.subscribe, ventureStore.getSnapshot, ventureStore.getServerSnapshot);
  const ready = snapshot !== null;
  const state = snapshot ?? EMPTY_STATE;
  const setState = ventureStore.update;

  /** Immutable update of one venture via a mutable draft clone. */
  const mutate = useCallback((pickId: (s: PersistedState) => string | null, fn: (draft: Venture) => void) => {
    setState((s) => {
      const id = pickId(s);
      if (!id) return s;
      return {
        ...s,
        ventures: s.ventures.map((v) => {
          if (v.id !== id) return v;
          const draft = structuredClone(v);
          fn(draft);
          touch(draft);
          return draft;
        }),
      };
    });
  }, [setState]);

  const mutateVenture = (id: string, fn: (draft: Venture) => void) => mutate(() => id, fn);
  const mutateActive = (fn: (draft: Venture) => void) => mutate((s) => resolveActive(s)?.id ?? null, fn);

  const activeVenture = useMemo(() => resolveActive(state), [state]);
  const findActive = () => activeVenture;

  const value: VentureLabContextValue = {
    ready,
    ventures: state.ventures,
    activeVenture,
    notifications: state.notifications,

    /* ---------------- Ventures ---------------- */
    setActiveVenture: (id) => setState((s) => ({ ...s, activeVentureId: id })),

    createVenture: (input) => {
      const owner = findActive()?.team.find((m) => m.isOwner);
      const v = createBlankVenture(input, owner?.name ?? "Founder", owner?.email ?? "");
      setState((s) => ({ ...s, ventures: [v, ...s.ventures], activeVentureId: v.id }));
      return v.id;
    },

    renameVenture: (id, name) => mutateVenture(id, (v) => (v.name = name)),

    setArchived: (id, archived) =>
      setState((s) => {
        const ventures = s.ventures.map((v) => (v.id === id ? { ...v, archived, updatedAt: new Date().toISOString() } : v));
        // If the active venture is archived, hop to the next live one.
        const activeVentureId =
          archived && s.activeVentureId === id ? ventures.find((v) => !v.archived)?.id ?? null : s.activeVentureId;
        return { ...s, ventures, activeVentureId };
      }),

    duplicateVenture: (id) =>
      setState((s) => {
        const src = s.ventures.find((v) => v.id === id);
        if (!src) return s;
        const copy = structuredClone(src);
        copy.id = uid("v");
        copy.name = `${src.name} (Copy)`;
        copy.archived = false;
        copy.createdAt = copy.updatedAt = new Date().toISOString();
        const idx = s.ventures.findIndex((v) => v.id === id);
        const ventures = [...s.ventures];
        ventures.splice(idx + 1, 0, copy);
        return { ...s, ventures };
      }),

    updateVenture: (id, patch) => mutateVenture(id, (v) => Object.assign(v, patch)),

    /* ---------------- Canvas ---------------- */
    addCanvasItem: (block, text, isAssumption = false) =>
      mutateActive((v) => {
        const clean = text.trim();
        if (!clean || v.canvas.blocks[block].some((i) => i.text.toLowerCase() === clean.toLowerCase())) return;
        v.canvas.blocks[block].push({ id: uid("ci"), text: clean, isAssumption });
        markCanvasDirty(v);
      }),

    removeCanvasItem: (block, itemId) =>
      mutateActive((v) => {
        v.canvas.blocks[block] = v.canvas.blocks[block].filter((i) => i.id !== itemId);
        markCanvasDirty(v);
      }),

    toggleAssumption: (block, itemId) =>
      mutateActive((v) => {
        const it = v.canvas.blocks[block].find((i) => i.id === itemId);
        if (it) it.isAssumption = !it.isAssumption;
        markCanvasDirty(v);
      }),

    saveCanvas: (note) => {
      const label = nextVersionLabel(findActive()?.canvas.versions[0]?.label);
      mutateActive((v) => {
        const now = new Date().toISOString();
        v.canvas.versions.unshift({ id: uid("cv"), label, note: note || "Saved from canvas", savedAt: now, blocks: cloneBlocks(v.canvas.blocks) });
        v.canvas.lastSavedAt = now;
        v.canvas.dirty = false;
      });
      return label;
    },

    restoreCanvasVersion: (versionId) =>
      mutateActive((v) => {
        const ver = v.canvas.versions.find((x) => x.id === versionId);
        if (!ver) return;
        v.canvas.blocks = cloneBlocks(ver.blocks);
        markCanvasDirty(v);
      }),

    /* ---------------- Execution ---------------- */
    setActiveTemplate: (id) => mutateActive((v) => (v.execution.activeTemplate = id)),

    resetTemplate: (id) =>
      mutateActive((v) => {
        const owner = v.team.find((m) => m.isOwner)?.id ?? null;
        v.execution.roadmaps[id] = templateMilestones(id, v.execution.startDate, owner);
      }),

    cycleTaskStatus: (milestoneId, taskId) => {
      const v = findActive();
      const t = v?.execution.roadmaps[v.execution.activeTemplate].find((m) => m.id === milestoneId)?.tasks.find((x) => x.id === taskId);
      if (!t) return null;
      const next = NEXT_STATUS[t.status];
      mutateActive((d) => {
        const task = d.execution.roadmaps[d.execution.activeTemplate].find((m) => m.id === milestoneId)?.tasks.find((x) => x.id === taskId);
        if (task) task.status = next;
      });
      return next;
    },

    updateTask: (taskId, patch) =>
      mutateActive((v) => {
        for (const m of v.execution.roadmaps[v.execution.activeTemplate]) {
          const t = m.tasks.find((x) => x.id === taskId);
          if (t) {
            Object.assign(t, patch);
            return;
          }
        }
      }),

    upsertMilestone: (input) =>
      mutateActive((v) => {
        const list = v.execution.roadmaps[v.execution.activeTemplate];
        const existing = input.id ? list.find((m) => m.id === input.id) : undefined;
        if (existing) Object.assign(existing, { ...input, id: existing.id });
        else list.push({ ...input, id: uid("m"), tasks: [] });
        list.sort((a, b) => a.startWeek - b.startWeek);
      }),

    deleteMilestone: (milestoneId) =>
      mutateActive((v) => {
        const key = v.execution.activeTemplate;
        const removed = new Set(v.execution.roadmaps[key].find((m) => m.id === milestoneId)?.tasks.map((t) => t.id));
        v.execution.roadmaps[key] = v.execution.roadmaps[key].filter((m) => m.id !== milestoneId);
        v.execution.roadmaps[key].forEach((m) => m.tasks.forEach((t) => t.dependsOn && removed.has(t.dependsOn) && (t.dependsOn = null)));
      }),

    upsertTask: (milestoneId, input) =>
      mutateActive((v) => {
        const m = v.execution.roadmaps[v.execution.activeTemplate].find((x) => x.id === milestoneId);
        if (!m) return;
        const existing = input.id ? m.tasks.find((t) => t.id === input.id) : undefined;
        if (existing) Object.assign(existing, { ...input, id: existing.id });
        else m.tasks.push({ ...input, id: uid("t") });
      }),

    deleteTask: (milestoneId, taskId) =>
      mutateActive((v) => {
        const list = v.execution.roadmaps[v.execution.activeTemplate];
        const m = list.find((x) => x.id === milestoneId);
        if (m) m.tasks = m.tasks.filter((t) => t.id !== taskId);
        list.forEach((ms) => ms.tasks.forEach((t) => t.dependsOn === taskId && (t.dependsOn = null)));
      }),

    /* ---------------- Team ---------------- */
    inviteMember: (input) =>
      mutateActive((v) => {
        const member: TeamMember = {
          id: uid("tm"),
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          title: input.category,
          category: input.category,
          status: "Invited",
          isOwner: false,
          canRead: input.canRead || input.canWrite,
          canWrite: input.canWrite,
        };
        v.team.push(member);
      }),

    setPermission: (memberId, perm, value) =>
      mutateActive((v) => {
        const m = v.team.find((x) => x.id === memberId);
        if (!m || m.isOwner) return;
        if (perm === "write") {
          m.canWrite = value;
          if (value) m.canRead = true; // write implies read
        } else {
          m.canRead = value;
          if (!value) m.canWrite = false; // no read ⇒ no write
        }
      }),

    setMemberCategory: (memberId, category) =>
      mutateActive((v) => {
        const m = v.team.find((x) => x.id === memberId);
        if (m && !m.isOwner) m.category = category;
      }),

    removeMember: (memberId) =>
      mutateActive((v) => {
        if (v.team.find((m) => m.id === memberId)?.isOwner) return;
        v.team = v.team.filter((m) => m.id !== memberId);
        Object.values(v.execution.roadmaps).forEach((ms) =>
          ms.forEach((m) => m.tasks.forEach((t) => t.assigneeId === memberId && (t.assigneeId = null))),
        );
      }),

    /* ---------------- Notifications ---------------- */
    markNotificationRead: (id) =>
      setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
    markAllNotificationsRead: () =>
      setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

    resetDemoData: () => setState(() => seedState()),
  };

  return <VentureLabContext.Provider value={value}>{children}</VentureLabContext.Provider>;
}

export function useVentureLab(): VentureLabContextValue {
  const ctx = useContext(VentureLabContext);
  if (!ctx) throw new Error("useVentureLab must be used inside <VentureLabProvider>");
  return ctx;
}

/** Convenience for pages that require an active venture. */
export function useActiveVenture(): Venture | null {
  return useVentureLab().activeVenture;
}
