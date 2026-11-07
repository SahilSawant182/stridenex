"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Share2 } from "lucide-react";
import { type EventItem, formatDate } from "./events.types";

interface EventOverviewProps {
  event: EventItem;
  onShare: (event: EventItem) => void;
}

export default function EventOverview({ event, onShare }: EventOverviewProps) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.15 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-9"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-blue-600" />
          <h2 className="text-2xl font-bold tracking-tight">About this event</h2>
        </div>
        <div
          className="prose prose-slate max-w-none text-[15px] leading-[1.85] sm:text-[16px]"
          dangerouslySetInnerHTML={{
            __html: event.event_description || "<p>No description provided.</p>",
          }}
        />
      </motion.section>

      <motion.aside
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.15 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:sticky lg:top-6"
      >
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Event at a glance
        </p>
        <div className="space-y-5">
          <div className="flex gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-slate-400">Date</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDate(event.creation)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-slate-400">Location</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-800">
                {event.venue || "Venue to be announced"}
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-5">
            <p className="text-xs leading-relaxed text-slate-500">
              Keep this event close and share it with someone who would enjoy it.
            </p>
            <button
              onClick={() => onShare(event)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
            >
              <Share2 className="h-4 w-4" /> Share event
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
