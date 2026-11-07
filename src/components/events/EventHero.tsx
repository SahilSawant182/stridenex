"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { type EventItem, formatDate, mediaUrl } from "./events.types";

interface EventHeroProps {
  event: EventItem;
}

export default function EventHero({ event }: EventHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      className="relative isolate mb-10 overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-200 sm:px-10 sm:py-12 lg:px-14 lg:py-14"
    >
      <div className="pointer-events-none absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <div className="mb-6 flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-blue-300">
            <span>Events</span>
            <span className="text-white/30">/</span>
            <span>{event.event_type || "Event"}</span>
          </div>
          <h1 className="max-w-3xl text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {event.event_title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {event.short_description ||
              "Join us for an inspiring event filled with ideas, conversations, and meaningful connections."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <CalendarDays className="h-4 w-4 text-blue-300" />
              {formatDate(event.creation)}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-blue-300" />
              {event.venue || "Venue to be announced"}
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          {event.event_thumbnail ? (
            <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/80 shadow-2xl">
              <Image
                src={mediaUrl(event.event_thumbnail)}
                alt=""
                fill
                unoptimized
                aria-hidden="true"
                className="scale-110 object-cover opacity-30 blur-xl"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <Image
                src={mediaUrl(event.event_thumbnail)}
                alt={event.event_title}
                fill
                priority
                unoptimized
                className="object-contain p-2 transition duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          ) : (
            <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-2xl font-bold text-white/50">
              {event.event_title}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
