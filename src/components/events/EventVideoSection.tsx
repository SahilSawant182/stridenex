"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type EventVideo, youtubeEmbedUrl } from "./events.types";

interface EventVideoSectionProps {
  eventTitle: string;
  videos: EventVideo[];
  videoIndex: number;
  onChangeVideoIndex: (index: number) => void;
}

export default function EventVideoSection({
  eventTitle,
  videos,
  videoIndex,
  onChangeVideoIndex,
}: EventVideoSectionProps) {
  const video = videos[videoIndex] || videos[0];
  const videoUrl = youtubeEmbedUrl(video?.event_video_link);

  if (!videoUrl) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      className="mt-12"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Watch</p>
          <h2 className="text-2xl font-bold tracking-tight">From the event</h2>
        </div>
        <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 lg:inline-flex">
          {videoIndex + 1} / {videos.length}
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Previous video"
          disabled={videos.length <= 1}
          onClick={() => onChangeVideoIndex((videoIndex - 1 + videos.length) % videos.length)}
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all enabled:hover:scale-105 enabled:hover:border-blue-300 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 enabled:hover:shadow-md enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-2 shadow-lg shadow-slate-200/70">
          <div className="aspect-video overflow-hidden rounded-xl bg-slate-900">
            <iframe
              loading="lazy"
              className="h-full w-full"
              src={videoUrl}
              title={`${eventTitle} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <button
          type="button"
          aria-label="Next video"
          disabled={videos.length <= 1}
          onClick={() => onChangeVideoIndex((videoIndex + 1) % videos.length)}
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all enabled:hover:scale-105 enabled:hover:border-blue-300 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 enabled:hover:shadow-md enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 lg:hidden">
        <button
          type="button"
          aria-label="Previous video"
          disabled={videos.length <= 1}
          onClick={() => onChangeVideoIndex((videoIndex - 1 + videos.length) % videos.length)}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition enabled:hover:border-blue-300 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {videoIndex + 1} / {videos.length}
        </span>
        <button
          type="button"
          aria-label="Next video"
          disabled={videos.length <= 1}
          onClick={() => onChangeVideoIndex((videoIndex + 1) % videos.length)}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition enabled:hover:border-blue-300 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.section>
  );
}
