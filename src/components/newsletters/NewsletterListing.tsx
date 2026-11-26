"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Mail,
  Newspaper,
  Search,
  Sparkles,
} from "lucide-react";
import {
  fetchNewsletters,
  formatNewsletterDate,
  getNewsletterAssetUrl,
  type NewsletterListItem,
  type NewsletterPagination,
} from "@/lib/newsletters";

const PAGE_SIZE = 9;
const filters = [
  { label: "All", value: "" },
  { label: "Students", value: "Student" },
  { label: "Mentors", value: "Mentor" },
  { label: "General Updates", value: "Website Subscribers" },
];

const initialPagination: NewsletterPagination = {
  page: 1,
  page_size: PAGE_SIZE,
  total_count: 0,
  total_pages: 1,
};

function getPageNumbers(current: number, total: number) {
  const count = Math.min(total, 5);
  const start = Math.max(1, Math.min(current - 2, total - count + 1));
  return Array.from({ length: count }, (_, index) => start + index);
}

function NewsletterCard({ item }: { item: NewsletterListItem }) {
  const cover = getNewsletterAssetUrl(item.cover_image);

  return (
    <article className="group flex h-full w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
      <Link
        href={`/newsletters/${encodeURIComponent(item.id)}`}
        className="flex h-full flex-col"
        aria-label={`Read ${item.title}`}
      >
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-orange-500 sm:h-44">
          <div className="absolute inset-0 flex items-center justify-center text-white/80">
            <Newspaper className="h-12 w-12" />
          </div>
          {cover && (
            <img
              src={cover}
              alt=""
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          )}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <Eye className="h-3.5 w-3.5" />
            {(item.total_views || 0).toLocaleString()} views
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex min-h-6 flex-wrap gap-2">
            {(item.target_groups || []).slice(0, 2).map((group) => (
              <span
                key={group}
                className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700"
              >
                {group}
              </span>
            ))}
            {(item.target_groups || []).length > 2 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                +{item.target_groups.length - 2}
              </span>
            )}
          </div>

          <h2 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition group-hover:text-orange-700 sm:text-lg">
            {item.title}
          </h2>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-5 text-slate-600">
            {item.short_description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="min-w-0 truncate font-medium text-slate-700">
              {item.author || "StrideNex Team"}
            </span>
            <time dateTime={item.published_at} className="shrink-0">
              {formatNewsletterDate(item.published_at)}
            </time>
          </div>
          <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-800">
            Read newsletter
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function NewsletterListing() {
  const [items, setItems] = useState<NewsletterListItem[]>([]);
  const [pagination, setPagination] =
    useState<NewsletterPagination>(initialPagination);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetchNewsletters(
      { page, pageSize: PAGE_SIZE, search, group },
      controller.signal,
    )
      .then((result) => {
        setItems(result.items);
        setPagination(result.pagination);
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load newsletters right now.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, search, group, retryKey]);

  const changeGroup = (value: string) => {
    setGroup(value);
    setPage(1);
  };

  const pageNumbers = getPageNumbers(page, pagination.total_pages || 1);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
              <Sparkles className="h-4 w-4 text-orange-300" />
              StrideNex insights
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              All Newsletters
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Ideas, stories, and practical insights for your learning and career journey.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter newsletters">
            {filters.map((filter) => (
              <button
                key={filter.value || "all"}
                type="button"
                role="tab"
                aria-selected={group === filter.value}
                onClick={() => changeGroup(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  group === filter.value
                    ? "bg-blue-900 text-white shadow"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <label className="relative block w-full lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setPage(1);
              }}
              placeholder="Search newsletters"
              aria-label="Search newsletters"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        <div className="mb-5 mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500" aria-live="polite">
            {loading
              ? "Loading newsletters…"
              : `${pagination.total_count.toLocaleString()} newsletter${pagination.total_count === 1 ? "" : "s"}`}
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-800">{error}</p>
            <button
              type="button"
              onClick={() => setRetryKey((key) => key + 1)}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="grid justify-items-center gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="w-full max-w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-40 animate-pulse bg-slate-200 sm:h-44" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-slate-200" />
                  <div className="h-16 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length ? (
          <div className="grid justify-items-center gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {items.map((item) => (
              <NewsletterCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Mail className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No newsletters found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try a different search or audience filter.
            </p>
          </div>
        )}

        {!error && pagination.total_pages > 1 && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Newsletter pages">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page <= 1 || loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                aria-current={page === pageNumber ? "page" : undefined}
                className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold ${
                  page === pageNumber
                    ? "bg-blue-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(pagination.total_pages, value + 1))}
              disabled={page >= pagination.total_pages || loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}
