// lib/venturelab/store.ts
// Tiny external store for VentureLab state, read via useSyncExternalStore.
// Ventures are loaded from the backend; canvas/roadmap/team extras are still local.
import type { Venture, VentureNotification } from "@/types/venturelab";

const STORAGE_KEY = "stridenex:venturelab:v2";

export interface PersistedState {
  ventures: Venture[];
  activeVentureId: string | null;
  notifications: VentureNotification[];
}

export function seedState(): PersistedState {
  return { ventures: [], activeVentureId: null, notifications: [] };
}

function load(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (Array.isArray(parsed.ventures)) return parsed;
    }
  } catch {
    /* storage unavailable or corrupt — fall back to seed */
  }
  return seedState();
}

function persist(s: PersistedState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* quota / private mode — state still works in memory */
  }
}

let state: PersistedState | null = null;
const listeners = new Set<() => void>();

export const ventureStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** Client snapshot — lazily loaded on first read. */
  getSnapshot(): PersistedState {
    if (!state) state = load();
    return state;
  },
  /** Server render has no storage: null means "not ready yet". */
  getServerSnapshot(): PersistedState | null {
    return null;
  },
  update(fn: (s: PersistedState) => PersistedState) {
    state = fn(ventureStore.getSnapshot());
    persist(state);
    listeners.forEach((l) => l());
  },
};
