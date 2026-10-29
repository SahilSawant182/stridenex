"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Film, RefreshCw } from "lucide-react";
import VideoBanner from "./VideoBanner";
import VideoCard from "./VideoCard";
import VideoFilterBar, { type VideoCategoryOption } from "./VideoFilterBar";
import VideosPagination from "./VideosPagination";
import {
  VIDEOS_PER_PAGE,
  type VideoItem,
  type YouTubeOEmbedMetadata,
  getVideoTopic,
  getVideosEndpoint,
  normalizeDisplayOrder,
} from "./videos.types";

function filterAndSortVideos(rawVideos: VideoItem[]): VideoItem[] {
  const published = rawVideos.filter((item) => {
    if (!item.youtube_url) return false;
    if (item.category_details && item.category_details.is_active === 0) return false;
    if (!item.publication_status) return true;
    const status = item.publication_status.toLowerCase();
    return status === "publish" || status === "published";
  });

  published.sort((a, b) => {
    const orderA = normalizeDisplayOrder(a.category_details?.display_order);
    const orderB = normalizeDisplayOrder(b.category_details?.display_order);
    if (orderA !== orderB) return orderA - orderB;
    const dateA = new Date(a.creation.replace(" ", "T")).getTime() || 0;
    const dateB = new Date(b.creation.replace(" ", "T")).getTime() || 0;
    return dateB - dateA;
  });

  return published;
}

export default function VideosPage() {
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [metadataMap, setMetadataMap] = useState<Record<string, YouTubeOEmbedMetadata>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const gridTopRef = useRef<HTMLDivElement>(null);

  const isFiltering = selectedCategory !== "All" || searchQuery.trim().length > 0;

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(getVideosEndpoint(1, VIDEOS_PER_PAGE));
      if (!response.ok) {
        throw new Error(`Videos API returned ${response.status}`);
      }

      const result = await response.json();
      const firstPageRaw: VideoItem[] = result?.message?.data || [];
      const pagination = result?.message?.pagination;

      const resolvedTotalCount = Number(pagination?.total_count) || firstPageRaw.length;
      const resolvedTotalPages =
        Number(pagination?.total_pages) ||
        Math.max(1, Math.ceil(resolvedTotalCount / VIDEOS_PER_PAGE));

      const combinedMap = new Map<string, VideoItem>();
      for (const v of firstPageRaw) {
        if (v?.name) combinedMap.set(v.name, v);
      }

      if (resolvedTotalPages > 1) {
        const BATCH_SIZE = 5;
        for (let startPage = 2; startPage <= resolvedTotalPages; startPage += BATCH_SIZE) {
          const endPage = Math.min(resolvedTotalPages, startPage + BATCH_SIZE - 1);
          const batchPromises: Promise<VideoItem[]>[] = [];

          for (let p = startPage; p <= endPage; p += 1) {
            batchPromises.push(
              fetch(getVideosEndpoint(p, VIDEOS_PER_PAGE))
                .then((res) => (res.ok ? res.json() : null))
                .then((json) => (json?.message?.data ? (json.message.data as VideoItem[]) : []))
                .catch(() => [])
            );
          }

          const batchPages = await Promise.all(batchPromises);
          for (const pageList of batchPages) {
            for (const v of pageList) {
              if (v?.name) combinedMap.set(v.name, v);
            }
          }
        }
      }

      const globallySortedVideos = filterAndSortVideos(Array.from(combinedMap.values()));
      setAllVideos(globallySortedVideos);
    } catch (fetchError) {
      console.error("Failed to fetch videos:", fetchError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleMetadataLoaded = useCallback(
    (videoName: string, meta: YouTubeOEmbedMetadata) => {
      setMetadataMap((prev) => {
        if (prev[videoName]?.title === meta.title) return prev;
        return { ...prev, [videoName]: meta };
      });
    },
    []
  );

  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const categories: VideoCategoryOption[] = useMemo(() => {
    const map = new Map<string, VideoCategoryOption>();

    for (const video of allVideos) {
      const topic = getVideoTopic(video);
      const existing = map.get(topic);
      const rawOrder = video.category_details?.display_order ?? 0;
      const displayOrder = normalizeDisplayOrder(rawOrder);
      const hasOrder = typeof rawOrder === "number" && rawOrder > 0;

      if (existing) {
        existing.count += 1;
        existing.displayOrder = Math.min(existing.displayOrder, displayOrder);
        existing.hasDisplayOrder = existing.hasDisplayOrder || hasOrder;
      } else {
        map.set(topic, {
          id: topic,
          label: topic,
          count: 1,
          displayOrder,
          hasDisplayOrder: hasOrder,
        });
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label)
    );
  }, [allVideos]);

  const filteredVideos = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return allVideos.filter((video) => {
      const topic = getVideoTopic(video);
      if (selectedCategory !== "All" && topic !== selectedCategory) {
        return false;
      }

      if (!normalizedQuery) return true;

      const meta = metadataMap[video.name];
      const titleText = (video.title || meta?.title || "").toLowerCase();
      const authorText = (meta?.author_name || "").toLowerCase();
      const topicText = topic.toLowerCase();
      const nameText = video.name.toLowerCase();

      return (
        titleText.includes(normalizedQuery) ||
        topicText.includes(normalizedQuery) ||
        authorText.includes(normalizedQuery) ||
        nameText.includes(normalizedQuery)
      );
    });
  }, [allVideos, selectedCategory, searchQuery, metadataMap]);

  const effectiveTotalCount = filteredVideos.length;
  const effectiveTotalPages = Math.max(1, Math.ceil(effectiveTotalCount / VIDEOS_PER_PAGE));

  const displayedVideos = useMemo(
    () =>
      filteredVideos.slice(
        (currentPage - 1) * VIDEOS_PER_PAGE,
        currentPage * VIDEOS_PER_PAGE
      ),
    [filteredVideos, currentPage]
  );

  const showingStart =
    effectiveTotalCount === 0 || displayedVideos.length === 0
      ? 0
      : (currentPage - 1) * VIDEOS_PER_PAGE + 1;
  const showingEnd =
    effectiveTotalCount === 0 || displayedVideos.length === 0
      ? 0
      : Math.min(
          effectiveTotalCount,
          (currentPage - 1) * VIDEOS_PER_PAGE + displayedVideos.length
        );

  const handlePageChange = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, effectiveTotalPages));
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Video Hero Banner */}
      <VideoBanner />

      <section
        ref={gridTopRef}
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 pt-2 sm:px-6 lg:px-8"
      >
        {/* Category Chips, Topics Dropdown & Search Bar */}
        {!error && allVideos.length > 0 && (
          <VideoFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            totalCount={allVideos.length}
          />
        )}

        {/* Loading Skeleton Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
              >
                <div className="aspect-video w-full animate-pulse rounded-xl bg-slate-200/80" />
                <div className="mt-3.5 flex gap-3 px-1 pb-1">
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-3.5 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-12 text-center">
            <p className="text-sm font-medium text-red-700">
              We couldn&apos;t load videos right now. Please try again.
            </p>
            <button
              type="button"
              onClick={() => loadVideos()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        ) : displayedVideos.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Film className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isFiltering ? "No matching videos found" : "No videos available yet"}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {isFiltering
                ? "Try selecting a different topic or clearing your search query."
                : "Check back soon for new podcasts, tutorials, and career insights."}
            </p>
            {isFiltering && (
              <button
                type="button"
                onClick={() => {
                  handleSelectCategory("All");
                  handleSearchChange("");
                }}
                className="mt-5 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayedVideos.map((video, index) => (
                <VideoCard
                  key={video.name}
                  video={video}
                  index={index}
                  metadata={metadataMap[video.name]}
                  onMetadataLoaded={handleMetadataLoaded}
                />
              ))}
            </div>

            <VideosPagination
              currentPage={currentPage}
              totalPages={effectiveTotalPages}
              showingStart={showingStart}
              showingEnd={showingEnd}
              totalVideosCount={effectiveTotalCount}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </main>
  );
}
