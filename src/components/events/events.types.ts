export interface EventImage {
  image: string;
  caption?: string;
}

export interface EventReview {
  student_name?: string;
  student_review?: string;
  review_thumbnail?: string;
  review_video_link?: string;
}

export interface EventVideo {
  event_video_thumbnail?: string;
  event_video_link?: string;
}

export interface EventItem {
  name: string;
  event_title: string;
  event_description?: string;
  event_type?: string;
  short_description?: string;
  venue?: string;
  featured_event?: number;
  event_thumbnail?: string;
  creation: string;
  event_images?: EventImage[];
  event_reviews?: EventReview[];
  event_videos?: EventVideo[];
}

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, "") || "";
export const EVENTS_PER_PAGE = 6;

export function getEventsEndpoint(page: number, pageSize: number) {
  return `${BASE_URL}/api/method/stridenex_app.api_stridenex_app.events.get_events?page=${page}&page_size=${pageSize}`;
}

export function getPaginationItems(
  currentPage: number,
  totalPages: number
): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis-end", totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis-start", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", totalPages];
}

export function mediaUrl(path?: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
}

export function formatDate(value?: string) {
  if (!value) return "Date to be announced";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function youtubeEmbedUrl(value?: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    const shortId = url.pathname.split("/").filter(Boolean).pop();
    const id = url.hostname.includes("youtu.be")
      ? url.pathname.slice(1)
      : url.searchParams.get("v") || shortId;
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}
