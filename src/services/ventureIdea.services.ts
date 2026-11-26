import { apiService } from "./api.services";

const BASE = "method/stridenex_app.entrepreneurship.doctype.venture_idea.venture_idea";

/** A venture idea as returned by the backend. A venture may hold only one active idea. */
export interface VentureIdeaRecord {
  name: string; // e.g. "IDEA-VEN-2026-00004"
  venture: string;
  domain_tag: string | null;
  problem_statement: string | null;
  target_audience: string | null;
  proposed_solution: string | null;
  /** Reset to 0 by the backend whenever problem/audience/solution change. */
  is_approved?: number | boolean | null;
  approved_at?: string | null;
  creation?: string | null;
  modified?: string | null;
}
export type VentureIdea = VentureIdeaRecord;

export interface IdeaFields {
  domain_tag: string;
  problem_statement: string;
  target_audience: string;
  proposed_solution: string;
}

export interface VentureIdeaPayload extends IdeaFields {
  venture: string;
}

/** Every endpoint answers { message: { status, message, data } }. */
function unwrap(res: unknown): unknown {
  const m = (res as { message?: { status?: string; message?: string; data?: unknown } } | null)?.message;
  if (!m || (m.status && m.status !== "success")) throw new Error(m?.message || "Something went wrong. Please try again.");
  return m.data;
}

export const ventureIdeaService = {
  /** GET get_venture_ideas — ideas linked to a venture. */
  async getIdeas(ventureName: string): Promise<VentureIdea[]> {
    const data = unwrap(await apiService.get(`${BASE}.get_venture_ideas`, { params: { venture: ventureName } })) as {
      total?: number;
      ideas?: VentureIdeaRecord[];
    } | null;
    // A venture holds at most one idea (the backend enforces 1-to-1), so callers read ideas[0].
    return (data?.ideas ?? []).filter((r) => r?.name);
  },

  /** POST create_venture_idea — links the idea to `payload.venture`. */
  async createIdea(payload: VentureIdeaPayload): Promise<void> {
    unwrap(await apiService.post(`${BASE}.create_venture_idea`, payload));
  },

  /** PUT update_venture_idea — changing problem/audience/solution resets approval on the server. */
  async updateIdea(name: string, payload: IdeaFields): Promise<void> {
    unwrap(await apiService.put(`${BASE}.update_venture_idea`, { name, ...payload }));
  },

  /** DELETE delete_venture_idea. */
  async deleteIdea(name: string): Promise<void> {
    unwrap(await apiService.delete(`${BASE}.delete_venture_idea`, { params: { name } }));
  },
};
