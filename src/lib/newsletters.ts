export interface NewsletterListItem {
  id: string;
  title: string;
  route: string;
  cover_image: string | null;
  short_description: string;
  author: string;
  published_at: string;
  total_views: number;
  target_groups: string[];
}

export interface NewsletterDetail extends NewsletterListItem {
  content_html: string;
  content_type: "Rich Text" | "HTML" | "Markdown";
  attachments: Array<{
    file_name: string;
    file_url: string;
  }>;
}

export interface NewsletterPagination {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

interface NewsletterApiMessage<T> {
  status?: number;
  message?: string;
  data?: T;
  pagination?: NewsletterPagination;
}

const NEWSLETTER_API =
  "/api/method/stridenex_app.api_stridenex_app.newsletter";
export const NEWSLETTER_ORIGIN = "https://devstridenex.quantcloud.in";

async function readApiMessage<T>(response: Response): Promise<NewsletterApiMessage<T>> {
  const body = await response.json().catch(() => null);
  const payload = body?.message;
  const message =
    typeof payload === "object" && payload !== null
      ? payload.message
      : typeof payload === "string"
        ? payload
        : undefined;

  if (!response.ok || (payload?.status != null && payload.status !== 200)) {
    throw new Error(message || "The newsletter service is unavailable. Please try again.");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("The newsletter service returned an unexpected response.");
  }

  return payload as NewsletterApiMessage<T>;
}

export async function fetchNewsletters(
  options: {
    page: number;
    pageSize: number;
    search?: string;
    group?: string;
  },
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    page: String(options.page),
    page_size: String(options.pageSize),
  });
  if (options.search) params.set("search", options.search);
  if (options.group) params.set("group", options.group);

  const response = await fetch(
    `${NEWSLETTER_API}.get_newsletters?${params.toString()}`,
    { signal, cache: "no-store" },
  );
  const payload = await readApiMessage<NewsletterListItem[]>(response);

  if (!Array.isArray(payload.data)) {
    throw new Error("Newsletter data could not be loaded.");
  }

  return {
    items: payload.data,
    pagination: payload.pagination ?? {
      page: options.page,
      page_size: options.pageSize,
      total_count: payload.data.length,
      total_pages: 1,
    },
  };
}

export async function fetchNewsletterDetail(id: string, signal?: AbortSignal) {
  const identifier = id.trim().replace(/\\+$/, "");
  const fetchByIdentifier = async (value: string) => {
    const params = new URLSearchParams({ identifier: value });
    const response = await fetch(
      `${NEWSLETTER_API}.get_newsletter_detail?${params.toString()}`,
      { signal, cache: "no-store" },
    );
    const payload = await readApiMessage<NewsletterDetail>(response);
    return payload.data?.id ? payload.data : null;
  };

  const detail = await fetchByIdentifier(identifier).catch((error: unknown) => {
    if (signal?.aborted) throw error;
    return null;
  });
  if (detail) return detail;

  // Newsletter emails use the public route (often a title slug), while the
  // detail endpoint may only accept the record ID. Resolve route links through
  // the listing API, then request the detail using the canonical ID.
  const { items } = await fetchNewsletters(
    { page: 1, pageSize: 100, search: identifier },
    signal,
  );
  const normalizeRoute = (value: string) =>
    decodeURIComponent(value).replace(/^\/+|\/+$/g, "").toLowerCase();
  const requestedRoute = normalizeRoute(identifier);
  const match = items.find((item) => {
    const route = item.route || "";
    return (
      normalizeRoute(item.id) === requestedRoute ||
      normalizeRoute(route) === requestedRoute ||
      normalizeRoute(route.split("/").pop() || "") === requestedRoute
    );
  });

  if (match && match.id !== identifier) {
    const resolvedDetail = await fetchByIdentifier(match.id);
    if (resolvedDetail) return resolvedDetail;
  }

  throw new Error("This newsletter could not be found.");
}

export async function subscribeToNewsletter(email: string) {
  const response = await fetch(`${NEWSLETTER_API}.subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim(),
      group: "Website Subscribers",
    }),
  });
  const payload = await readApiMessage<{ subscribed: boolean; email: string }>(
    response,
  );

  return payload.message || "Thank you for subscribing to our newsletter!";
}

export function getNewsletterAssetUrl(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value, NEWSLETTER_ORIGIN);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function getNewsletterAttachmentUrl(
  fileUrl: string,
  fileName: string,
) {
  const assetUrl = getNewsletterAssetUrl(fileUrl);
  if (!assetUrl) return null;

  try {
    const path = new URL(assetUrl).pathname;
    if (!path.startsWith("/files/")) return null;

    const params = new URLSearchParams({ path, filename: fileName });
    return `/api/newsletters/attachments?${params.toString()}`;
  } catch {
    return null;
  }
}

export function formatNewsletterDate(value: string) {
  const normalized = value
    .replace(" ", "T")
    .replace(/(\.\d{3})\d+$/, "$1");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return "Recently published";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
