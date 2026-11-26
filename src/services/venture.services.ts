import { apiService } from "./api.services";

const BASE = "method/stridenex_app.entrepreneurship.doctype.venture.venture";

/** A venture row as returned by the backend (list and details share these keys). */
export interface ApiVenture {
  name: string; // e.g. "VEN-2026-00002" — the document id
  venture_name: string;
  tagline: string | null;
  student_owner: string | null;
  stage: string | null;
  status: string | null;
  industry_sector: string | null;
  created_on?: string | null;
  overall_progress?: number | null;
  active_canvas?: string | null;
  active_template?: string | null;
  creation?: string | null;
  modified?: string | null;
}

export interface CreateVenturePayload {
  venture_name: string;
  tagline?: string | null;
  student_owner?: string | null;
  stage?: string;
  status?: string;
  industry_sector?: string | null;
}

export interface UpdateVenturePayload extends Partial<CreateVenturePayload> {
  name: string;
}

export const VENTURE_DEFAULT_STAGE = "Discovery";
export const VENTURE_STATUS_ACTIVE = "Active";
export const VENTURE_STATUS_ARCHIVED = "Archived";

/** Every endpoint answers { message: { status, message, data } }. */
function unwrap<T>(res: unknown): T {
  const m = (res as { message?: { status?: string; message?: string; data?: T } } | null)?.message;
  if (!m || (m.status && m.status !== "success")) {
    throw new Error(m?.message || "Something went wrong. Please try again.");
  }
  return m.data as T;
}

const PAGE = 100;

export const ventureService = {
  /** Every venture the student owns (pages through the list). */
  async list(): Promise<ApiVenture[]> {
    const all: ApiVenture[] = [];
    let start = 0;
    for (;;) {
      const data = unwrap<{ total: number; ventures: ApiVenture[] }>(
        await apiService.get(`${BASE}.get_ventures`, { params: { start, page_length: PAGE } }),
      );
      const rows = data?.ventures ?? [];
      all.push(...rows);
      start += rows.length;
      if (rows.length === 0 || start >= (data?.total ?? 0)) break;
    }
    return all;
  },

  async details(name: string): Promise<ApiVenture> {
    const data = unwrap<ApiVenture & { venture?: ApiVenture }>(await apiService.get(`${BASE}.get_venture_details`, { params: { name } }));
    return data?.venture ?? data;
  },

  async create(payload: CreateVenturePayload): Promise<Partial<ApiVenture>> {
    const data = unwrap<Partial<ApiVenture> & { venture?: Partial<ApiVenture> }>(await apiService.post(`${BASE}.create_venture`, payload));
    return data?.venture ?? data ?? {};
  },

  async update(payload: UpdateVenturePayload): Promise<Partial<ApiVenture>> {
    const data = unwrap<Partial<ApiVenture> & { venture?: Partial<ApiVenture> }>(await apiService.put(`${BASE}.update_venture`, payload));
    return data?.venture ?? data ?? {};
  },

  async remove(name: string): Promise<void> {
    unwrap(await apiService.delete(`${BASE}.delete_venture`, { params: { name } }));
  },
};
