"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function read(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/** A boolean persisted in localStorage (per-viewer UI preference). Server renders `false`. */
export function useLocalFlag(key: string): [boolean, (next: boolean) => void] {
  const subscribe = useCallback((l: () => void) => {
    listeners.add(l);
    window.addEventListener("storage", l);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", l);
    };
  }, []);

  const value = useSyncExternalStore(subscribe, () => read(key), () => false);

  const set = useCallback(
    (next: boolean) => {
      try {
        window.localStorage.setItem(key, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      listeners.forEach((l) => l());
    },
    [key],
  );

  return [value, set];
}
