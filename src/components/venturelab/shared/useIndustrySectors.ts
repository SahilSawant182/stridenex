"use client";

import { useCallback, useState } from "react";
import { getMasterData } from "@/services/industry.services";

// The sector list is the same for every venture form, so fetch it once per page load.
let cache: string[] | null = null;
let inflight: Promise<string[]> | null = null;

function fetchSectors(): Promise<string[]> {
  if (cache) return Promise.resolve(cache);
  inflight ??= getMasterData("Industry Sector")
    .then((res) => {
      const names = (res.data as { name?: string }[]).map((d) => d.name).filter((n): n is string => !!n);
      cache = names;
      return names;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/**
 * Industry sectors from the backend's "Industry Sector" master list. Nothing is
 * requested until `ensureLoaded` is called (when the dropdown is first opened).
 */
export function useIndustrySectors() {
  const [state, setState] = useState<{ sectors: string[]; loading: boolean; error: string | null }>({
    sectors: cache ?? [],
    loading: false,
    error: null,
  });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchSectors().then(
      (sectors) => setState({ sectors, loading: false, error: null }),
      () => setState({ sectors: [], loading: false, error: "Couldn’t load sectors." }),
    );
  }, []);

  /** Fetch on first use; a no-op while loading or once loaded. */
  const ensureLoaded = useCallback(() => {
    if (!cache && !inflight) load();
    else if (cache && state.sectors.length === 0) setState({ sectors: cache, loading: false, error: null });
  }, [load, state.sectors.length]);

  return { ...state, ensureLoaded, retry: load };
}
