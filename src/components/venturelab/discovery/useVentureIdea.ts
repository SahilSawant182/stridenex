"use client";

import { useEffect, useState } from "react";
import { ventureIdeaService, type VentureIdeaRecord } from "@/services/ventureIdea.services";

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");

type State = { idea: VentureIdeaRecord | null; loading: boolean; error: string | null };

/**
 * The venture's idea (a venture holds one). Loads on mount, so render the
 * consumer with `key={ventureId}` to reload when the active venture changes.
 */
export function useVentureIdea(ventureId: string) {
  const [state, setState] = useState<State>({ idea: null, loading: true, error: null });

  const fetchIdea = () =>
    ventureIdeaService.getIdeas(ventureId).then(
      (ideas) => setState({ idea: ideas[0] ?? null, loading: false, error: null }),
      (e) => setState({ idea: null, loading: false, error: errMsg(e) }),
    );

  useEffect(() => {
    let cancelled = false;
    ventureIdeaService.getIdeas(ventureId).then(
      (ideas) => !cancelled && setState({ idea: ideas[0] ?? null, loading: false, error: null }),
      (e) => !cancelled && setState({ idea: null, loading: false, error: errMsg(e) }),
    );
    return () => {
      cancelled = true;
    };
  }, [ventureId]);

  /** Re-fetch from the server (after create / update). */
  const reload = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    return fetchIdea();
  };
  const clear = () => setState({ idea: null, loading: false, error: null });

  return { ...state, reload, clear };
}
