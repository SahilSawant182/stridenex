"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type EventItem, formatDate, mediaUrl } from "./events.types";

interface EventCardProps {
  event: EventItem;
  index: number;
  onOpen: (event: EventItem) => void;
}

export default function EventCard({ event, index, onOpen }: EventCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(event)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
    >
      <div className="relative mb-4 aspect-[1.6] w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
        {event.event_thumbnail ? (
          <Image
            src={mediaUrl(event.event_thumbnail)}
            alt={event.event_title}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            unoptimized
            className="object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center font-semibold text-slate-400">
            {event.event_title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-2">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {event.event_type || "Event"}
        </div>
        <h3 className="mb-2.5 line-clamp-2 text-[17px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-slate-700">
          {event.event_title}
        </h3>
        <p className="mb-5 line-clamp-3 flex-1 text-[14px] leading-relaxed text-slate-600">
          {event.short_description}
        </p>
        <div className="text-[13px] text-slate-400">{formatDate(event.creation)}</div>
      </div>
    </motion.button>
  );
}
