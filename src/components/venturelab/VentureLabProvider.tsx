"use client";

// Global VentureLab state. The venture list (name, sector, stage, tagline,
// status, progress) is owned by the backend; canvas, roadmap and team are still
// local-only extras keyed by the venture's document id and persisted to
// localStorage until those tabs get their own APIs.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  VENTURE_DEFAULT_STAGE,
  VENTURE_STATUS_ACTIVE,
  VENTURE_STATUS_ARCHIVED,
  ventureService,
  type ApiVenture,
} from "@/services/venture.services";
import type {
  CanvasBlocks,
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
import { ventureStore, type PersistedState } from "@/lib/venturelab/store";
import { NEXT_STATUS, cloneBlocks, uid } from "@/lib/venturelab/utils";

export interface VentureLabContextValue {
  ready: boolean;
  /** True while the venture list is being fetched from the backend. */
  loading: boolean;
  /** Set when the list could not be loaded. */
  loadError: string | null;
  /** Re-fetch the venture list. */
  refresh: () => Promise<void>;
  ventures: Venture[];
  activeVenture: Venture | null;
  notifications: VentureNotification[];

  // Ventures
  setActiveVenture: (id: string) => void;
  /** Resolves with the new venture's id; rejects with the backend's message. */
  createVenture: (input: { name: string; sector: string; description: string }) => Promise<string>;
  editVenture: (id: string, input: { name: string; sector: string; description: string }) => Promise<void>;
  setArchived: (id: string, archived: boolean) => Promise<void>;
  duplicateVenture: (id: string) => Promise<void>;
  deleteVenture: (id: string) => Promise<void>;
  /** Fetch one venture's latest details from the backend. */
  syncVenture: (id: string) => Promise<void>;
  /** Local-only working-title edit used by Idea Discovery (not sent to the backend yet). */
  renameVenture: (id: string, name: string) => void;
  updateVenture: (id: string, patch: Partial<Pick<Venture, "description" | "rawIdea" | "stage" | "sector">>) => void;

  // Canvas (active venture) — the server owns the canvas (see canvas/useCanvas.ts);
  // this local copy is only a cache for Overview progress and header search.
  /** Replace the cached canvas with the server's latest. */
  replaceCanvasBlocks: (blocks: CanvasBlocks) => void;

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

const SECTOR_FALLBACK = ""; // venture has no sector yet

/** Fold a backend row into a local venture, keeping local canvas/roadmap/team extras. */
function applyApi(local: Venture, api: ApiVenture): Venture {
  return {
    ...local,
    name: api.venture_name,
    sector: api.industry_sector || SECTOR_FALLBACK,
    stage: api.stage || VENTURE_DEFAULT_STAGE,
    description: api.tagline ?? "",
    archived: api.status === VENTURE_STATUS_ARCHIVED,
    overallProgress: typeof api.overall_progress === "number" ? api.overall_progress : local.overallProgress,
    createdAt: api.creation ? api.creation.replace(" ", "T") : local.createdAt,
    updatedAt: api.modified ? api.modified.replace(" ", "T") : local.updatedAt,
  };
}

const errorMessage = (e: unknown) => (e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.");

export function VentureLabProvider({ children }: { children: React.ReactNode }) {
  // Server render and first hydration pass see `null` (not ready); the client then reads storage.
  const snapshot = useSyncExternalStore(ventureStore.subscribe, ventureStore.getSnapshot, ventureStore.getServerSnapshot);
  const ready = snapshot !== null;
  const state = snapshot ?? EMPTY_STATE;
  const setState = ventureStore.update;

  const { currentUser, fullName } = useAuth();
  const [sync, setSync] = useState<{ loading: boolean; error: string | null }>({ loading: true, error: null });

  /** Create the local scaffold for a backend row (owner = the signed-in student). */
  const scaffold = useCallback(
    (api: ApiVenture): Venture => {
      const email = api.student_owner || currentUser || "";
      const base = createBlankVenture(
        { id: api.name, name: api.venture_name, sector: SECTOR_FALLBACK, stage: VENTURE_DEFAULT_STAGE, description: "" },
        fullName || email.split("@")[0] || "Founder",
        email,
      );
      return applyApi(base, api);
    },
    [currentUser, fullName],
  );

  /** Replace the venture list with the backend's, keeping local extras for ids we already know. */
  const reload = useCallback(() => {
    return ventureService.list().then(
      (rows) => {
        setState((s) => {
          const byId = new Map(s.ventures.map((v) => [v.id, v]));
          const ventures = rows.map((r) => {
            const known = byId.get(r.name);
            return known ? applyApi(known, r) : scaffold(r);
          });
          const activeVentureId = ventures.some((v) => v.id === s.activeVentureId) ? s.activeVentureId : null;
          return { ...s, ventures, activeVentureId };
        });
        setSync({ loading: false, error: null });
      },
      (e: unknown) => setSync({ loading: false, error: errorMessage(e) }),
    );
  }, [scaffold, setState]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const refresh = useCallback(() => {
    setSync({ loading: true, error: null });
    return reload();
  }, [reload]);

  /** Upsert one backend row into the store. */
  const upsertApi = useCallback(
    (api: ApiVenture, makeActive = false) =>
      setState((s) => {
        const exists = s.ventures.some((v) => v.id === api.name);
        const ventures = exists
          ? s.ventures.map((v) => (v.id === api.name ? applyApi(v, api) : v))
          : [scaffold(api), ...s.ventures];
        return { ...s, ventures, activeVentureId: makeActive ? api.name : s.activeVentureId };
      }),
    [scaffold, setState],
  );

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
  /** Current backend-shaped view of a venture, used to fill gaps in partial update responses. */
  const ventureFromStore = (id: string): ApiVenture | null => {
    const v = state.ventures.find((x) => x.id === id);
    return v
      ? {
          name: v.id,
          venture_name: v.name,
          tagline: v.description || null,
          student_owner: currentUser,
          stage: v.stage,
          status: v.archived ? VENTURE_STATUS_ARCHIVED : VENTURE_STATUS_ACTIVE,
          industry_sector: v.sector || null,
          overall_progress: v.overallProgress ?? null,
        }
      : null;
  };

  const value: VentureLabContextValue = {
    ready,
    loading: sync.loading,
    loadError: sync.error,
    refresh,
    ventures: state.ventures,
    activeVenture,
    notifications: state.notifications,

    /* ---------------- Ventures ---------------- */
    setActiveVenture: (id) => setState((s) => ({ ...s, activeVentureId: id })),

    createVenture: async (input) => {
      const created = await ventureService.create({
        venture_name: input.name,
        tagline: input.description || null,
        student_owner: currentUser,
        stage: VENTURE_DEFAULT_STAGE,
        status: VENTURE_STATUS_ACTIVE,
        industry_sector: input.sector || null,
      });
      if (!created.name) throw new Error("The venture was created but the server did not return its id. Refresh to see it.");
      // Fill anything the response left out with what we sent.
      const row: ApiVenture = {
        student_owner: currentUser,
        stage: VENTURE_DEFAULT_STAGE,
        status: VENTURE_STATUS_ACTIVE,
        tagline: input.description || null,
        industry_sector: input.sector || null,
        venture_name: input.name,
        ...created,
        name: created.name,
      };
      upsertApi(row, true);
      return row.name;
    },

    editVenture: async (id, input) => {
      const updated = await ventureService.update({
        name: id,
        venture_name: input.name,
        tagline: input.description || null,
        industry_sector: input.sector || null,
      });
      upsertApi({
        ...(ventureFromStore(id) ?? ({} as ApiVenture)),
        name: id,
        venture_name: input.name,
        tagline: input.description || null,
        industry_sector: input.sector || null,
        ...updated,
      });
    },

    setArchived: async (id, archived) => {
      const status = archived ? VENTURE_STATUS_ARCHIVED : VENTURE_STATUS_ACTIVE;
      await ventureService.update({ name: id, status });
      setState((s) => {
        const ventures = s.ventures.map((v) => (v.id === id ? { ...v, archived, updatedAt: new Date().toISOString() } : v));
        // If the active venture is archived, hop to the next live one.
        const activeVentureId =
          archived && s.activeVentureId === id ? ventures.find((v) => !v.archived)?.id ?? null : s.activeVentureId;
        return { ...s, ventures, activeVentureId };
      });
    },

    duplicateVenture: async (id) => {
      const src = state.ventures.find((v) => v.id === id);
      if (!src) return;
      const created = await ventureService.create({
        venture_name: `${src.name} (Copy)`,
        tagline: src.description || null,
        student_owner: currentUser,
        stage: src.stage,
        status: VENTURE_STATUS_ACTIVE,
        industry_sector: src.sector || null,
      });
      if (!created?.name) throw new Error("The copy was created but the server did not return its id. Refresh to see it.");
      upsertApi({
        student_owner: currentUser,
        stage: src.stage,
        status: VENTURE_STATUS_ACTIVE,
        tagline: src.description || null,
        industry_sector: src.sector || null,
        venture_name: `${src.name} (Copy)`,
        ...created,
        name: created.name,
      });
    },

    deleteVenture: async (id) => {
      await ventureService.remove(id);
      setState((s) => {
        const ventures = s.ventures.filter((v) => v.id !== id);
        const activeVentureId = s.activeVentureId === id ? ventures.find((v) => !v.archived)?.id ?? null : s.activeVentureId;
        return { ...s, ventures, activeVentureId };
      });
    },

    syncVenture: async (id) => {
      try {
        const api = await ventureService.details(id);
        if (api?.name) upsertApi(api);
      } catch {
        /* the list data is still good enough to open the venture */
      }
    },

    renameVenture: (id, name) => mutateVenture(id, (v) => (v.name = name)),

    updateVenture: (id, patch) => mutateVenture(id, (v) => Object.assign(v, patch)),

    /* ---------------- Canvas (cache) ---------------- */
    replaceCanvasBlocks: (blocks) =>
      mutateActive((v) => {
        v.canvas.blocks = cloneBlocks(blocks);
        v.canvas.dirty = false;
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
