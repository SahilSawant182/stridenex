"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import EventCard from "./EventCard";
import EventGallerySection from "./EventGallerySection";
import EventHero from "./EventHero";
import EventOverview from "./EventOverview";
import EventShareModal from "./EventShareModal";
import EventsPagination from "./EventsPagination";
import EventTestimonialsSection from "./EventTestimonialsSection";
import EventVideoSection from "./EventVideoSection";
import {
  EVENTS_PER_PAGE,
  type EventItem,
  type EventVideo,
  getEventsEndpoint,
} from "./events.types";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEventsCount, setTotalEventsCount] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(getEventsEndpoint(currentPage, EVENTS_PER_PAGE));
        if (!response.ok) throw new Error(`Events API returned ${response.status}`);
        const result = await response.json();
        const fetchedEvents: EventItem[] = result?.message?.data || [];
        const pagination = result?.message?.pagination;
        fetchedEvents.sort((a, b) => Number(b.featured_event || 0) - Number(a.featured_event || 0));
        setEvents(fetchedEvents);

        const apiTotalCount = Number(pagination?.total_count) || fetchedEvents.length;
        const apiTotalPages =
          Number(pagination?.total_pages) || Math.max(1, Math.ceil(apiTotalCount / EVENTS_PER_PAGE));
        setTotalEventsCount(apiTotalCount);
        setTotalPages(Math.max(1, apiTotalPages));

        const id = new URLSearchParams(window.location.search).get("id");
        if (id) {
          const foundEvent = fetchedEvents.find((event) => event.name === id);
          if (foundEvent) setSelectedEvent(foundEvent);
        }
      } catch (fetchError) {
        console.error(fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [currentPage]);

  useEffect(() => {
    const handlePopState = () => {
      const id = new URLSearchParams(window.location.search).get("id");
      setSelectedEvent(events.find((event) => event.name === id) || null);
      setGalleryIndex(0);
      setVideoIndex(0);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [events]);

  const openEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setGalleryIndex(0);
    setVideoIndex(0);
    window.history.pushState({}, "", `/events?id=${encodeURIComponent(event.name)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeEvent = () => {
    setSelectedEvent(null);
    setGalleryIndex(0);
    setVideoIndex(0);
    window.history.pushState({}, "", "/events");
  };

  const handleShare = (event: EventItem) => {
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator
        .share({
          title: event.event_title,
          text: event.short_description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopy = async () => {
    const url = window.location.href;
    try {
      if (typeof window !== "undefined" && window.ClipboardItem) {
        const textBlob = new Blob([url], { type: "text/plain" });
        const htmlBlob = new Blob([`<a href="${url}">${url}</a>`], { type: "text/html" });
        const item = new ClipboardItem({ "text/plain": textBlob, "text/html": htmlBlob });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 2000);
  };

  if (selectedEvent) {
    const images = selectedEvent.event_images || [];
    const reviews = selectedEvent.event_reviews || [];
    const eventVideos = selectedEvent.event_videos?.filter((item) => item.event_video_link) || [];
    const videos: EventVideo[] =
      eventVideos.length > 0
        ? eventVideos
        : selectedEvent.event_reviews
            ?.filter((item) => item.review_video_link)
            .map((item) => ({
              event_video_link: item.review_video_link,
              event_video_thumbnail: item.review_thumbnail,
            })) || [];

    return (
      <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8"
        >
          <button
            onClick={closeEvent}
            className="group flex items-center gap-2 rounded-full px-1 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to
            events
          </button>
          <button
            onClick={() => handleShare(selectedEvent)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-md"
          >
            <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Share event</span>
            <span className="sm:hidden">Share</span>
          </button>
        </motion.div>

        <article className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <EventHero event={selectedEvent} />
          <EventOverview event={selectedEvent} onShare={handleShare} />
          <EventVideoSection
            eventTitle={selectedEvent.event_title}
            videos={videos}
            videoIndex={videoIndex}
            onChangeVideoIndex={setVideoIndex}
          />
          <EventGallerySection
            eventTitle={selectedEvent.event_title}
            images={images}
            galleryIndex={galleryIndex}
            onChangeGalleryIndex={setGalleryIndex}
          />
          <EventTestimonialsSection
            key={selectedEvent.name}
            eventTitle={selectedEvent.event_title}
            reviews={reviews}
          />
        </article>

        {showShareModal && (
          <EventShareModal
            eventTitle={selectedEvent.event_title}
            shareCopied={shareCopied}
            onCopy={handleCopy}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </main>
    );
  }

  const displayedEvents =
    events.length > EVENTS_PER_PAGE
      ? events.slice((currentPage - 1) * EVENTS_PER_PAGE, currentPage * EVENTS_PER_PAGE)
      : events;
  const showingStart = totalEventsCount === 0 ? 0 : (currentPage - 1) * EVENTS_PER_PAGE + 1;
  const showingEnd = Math.min(
    totalEventsCount,
    (currentPage - 1) * EVENTS_PER_PAGE + displayedEvents.length
  );

  const handlePageChange = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <section className="bg-white pb-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-[28px] font-medium tracking-normal">Events</h1>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center text-sm font-medium text-slate-500">
            Loading events...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-12 text-center text-sm text-red-700">
            We couldn&apos;t load events right now. Please try again later.
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-16 text-center">
            <h2 className="text-lg font-semibold">No events found</h2>
            <p className="mt-2 text-sm text-slate-500">No past events are available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {displayedEvents.map((event, index) => (
                <EventCard key={event.name} event={event} index={index} onOpen={openEvent} />
              ))}
            </div>

            <EventsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              showingStart={showingStart}
              showingEnd={showingEnd}
              totalEventsCount={totalEventsCount}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </main>
  );
}
