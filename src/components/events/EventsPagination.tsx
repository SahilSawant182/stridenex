"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationItems } from "./events.types";

interface EventsPaginationProps {
  currentPage: number;
  totalPages: number;
  showingStart: number;
  showingEnd: number;
  totalEventsCount: number;
  onPageChange: (page: number) => void;
}

export default function EventsPagination({
  currentPage,
  totalPages,
  showingStart,
  showingEnd,
  totalEventsCount,
  onPageChange,
}: EventsPaginationProps) {
  if (totalPages <= 1) return null;

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <motion.nav
      aria-label="Events pagination"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      className="mt-12 flex flex-col gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-center text-xs font-medium text-slate-500 sm:text-left">
        Showing <span className="font-semibold text-slate-800">{showingStart}</span>–
        <span className="font-semibold text-slate-800">{showingEnd}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalEventsCount}</span> events
      </p>

      {/* Mobile compact pagination */}
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <span className="text-xs font-semibold text-slate-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Tablet / Desktop numbered pagination with ellipsis */}
      <div className="hidden items-center gap-1.5 sm:flex">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <div className="flex items-center gap-1">
          {paginationItems.map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={`flex h-9 min-w-[36px] items-center justify-center rounded-xl px-2.5 text-xs font-semibold transition-all ${
                  item === currentPage
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item}
              </button>
            ) : (
              <span
                key={item}
                className="flex h-9 w-8 select-none items-center justify-center text-xs font-semibold text-slate-400"
                aria-hidden="true"
              >
                …
              </span>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.nav>
  );
}
