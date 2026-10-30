"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type EventReview } from "./events.types";

interface EventTestimonialsSectionProps {
  eventTitle: string;
  reviews: EventReview[];
}

export default function EventTestimonialsSection({
  eventTitle,
  reviews,
}: EventTestimonialsSectionProps) {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewViewportCount, setReviewViewportCount] = useState(3);
  const [reviewPaused, setReviewPaused] = useState(false);
  const [reviewTransitionEnabled, setReviewTransitionEnabled] = useState(true);

  useEffect(() => {
    const updateReviewViewport = () => {
      const nextViewportCount = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      setReviewViewportCount(nextViewportCount);
      setReviewIndex((current) => {
        if (reviews.length <= nextViewportCount) return 0;
        return Math.min(current, reviews.length - 1);
      });
    };

    updateReviewViewport();
    window.addEventListener("resize", updateReviewViewport);
    return () => window.removeEventListener("resize", updateReviewViewport);
  }, [reviews.length]);

  useEffect(() => {
    const reviewCount = reviews.length;
    const canSlide = reviewCount > reviewViewportCount;
    if (!canSlide || reviewPaused) return;

    const interval = window.setInterval(() => {
      setReviewIndex((current) => {
        if (current >= reviewCount) {
          setReviewTransitionEnabled(false);
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              setReviewTransitionEnabled(true);
              setReviewIndex(1);
            });
          });
          return 0;
        }
        setReviewTransitionEnabled(true);
        return current + 1;
      });
    }, 2500);

    return () => window.clearInterval(interval);
  }, [reviews, reviewViewportCount, reviewPaused]);

  const reviewCards = reviews;
  if (reviewCards.length === 0) return null;

  const visibleReviewCount = Math.max(1, Math.min(reviewViewportCount, reviewCards.length));
  const canSlideReviews = reviewCards.length > reviewViewportCount;
  const totalReviewSlides = reviewCards.length;
  const activeReviewIndex = totalReviewSlides > 0 ? reviewIndex % totalReviewSlides : 0;
  const maxVisibleDots = 7;
  const dotWindowStart =
    totalReviewSlides > maxVisibleDots
      ? Math.max(
          0,
          Math.min(
            activeReviewIndex - Math.floor(maxVisibleDots / 2),
            totalReviewSlides - maxVisibleDots
          )
        )
      : 0;
  const dotWindowEnd = Math.min(totalReviewSlides, dotWindowStart + maxVisibleDots);
  const visibleDotIndices = Array.from(
    { length: dotWindowEnd - dotWindowStart },
    (_, idx) => dotWindowStart + idx
  );
  const carouselReviewCards = canSlideReviews
    ? [...reviewCards, ...reviewCards.slice(0, visibleReviewCount)]
    : reviewCards;

  const handleNextReview = () => {
    if (!canSlideReviews) return;
    if (reviewIndex >= totalReviewSlides) {
      setReviewTransitionEnabled(false);
      setReviewIndex(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setReviewTransitionEnabled(true);
          setReviewIndex(1);
        });
      });
      return;
    }
    setReviewTransitionEnabled(true);
    setReviewIndex((current) => current + 1);
  };

  const handlePrevReview = () => {
    if (!canSlideReviews) return;
    if (reviewIndex <= 0) {
      setReviewTransitionEnabled(false);
      setReviewIndex(totalReviewSlides);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setReviewTransitionEnabled(true);
          setReviewIndex(totalReviewSlides - 1);
        });
      });
      return;
    }
    setReviewTransitionEnabled(true);
    setReviewIndex((current) => current - 1);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      className="mt-12"
      onMouseEnter={() => setReviewPaused(true)}
      onMouseLeave={() => setReviewPaused(false)}
      onClick={() => setReviewPaused(true)}
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Testimonials
          </p>
          <h2 className="text-2xl font-bold tracking-tight">What attendees say</h2>
        </div>
        <span className="text-sm text-slate-400">
          {canSlideReviews
            ? `${activeReviewIndex + 1} / ${reviewCards.length} reviews`
            : `${reviewCards.length} ${reviewCards.length === 1 ? "review" : "reviews"}`}
        </span>
      </div>
      <div className="relative py-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Previous review"
            disabled={!canSlideReviews}
            onClick={(event) => {
              event.stopPropagation();
              if (!canSlideReviews) return;
              setReviewPaused(true);
              handlePrevReview();
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all enabled:hover:scale-105 enabled:hover:border-blue-300 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 enabled:hover:shadow-md enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="relative min-w-0 flex-1 overflow-hidden py-2">
            <div
              className="flex w-full"
              onTransitionEnd={(event) => {
                if (event.target !== event.currentTarget) return;
                if (canSlideReviews && reviewIndex >= totalReviewSlides) {
                  setReviewTransitionEnabled(false);
                  setReviewIndex(0);
                  window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => {
                      setReviewTransitionEnabled(true);
                    });
                  });
                }
              }}
              style={{
                transform: `translateX(-${(canSlideReviews ? reviewIndex : 0) * (100 / visibleReviewCount)}%)`,
                transition: reviewTransitionEnabled
                  ? "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)"
                  : "none",
              }}
            >
              {carouselReviewCards.map((item, index) => {
                const originalIndex = index % reviewCards.length;
                const name = item.student_name || "Event attendee";
                const initials = name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={`${item.student_name || "attendee"}-${index}`}
                    className="box-border shrink-0 px-2"
                    style={{ width: `${100 / visibleReviewCount}%` }}
                  >
                    <figure
                      onClick={() => setReviewPaused(true)}
                      className="group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
                    >
                      <div
                        className={`absolute inset-x-0 top-0 h-1 ${originalIndex % 2 === 0 ? "bg-blue-500" : "bg-indigo-500"}`}
                      />
                      <div className="mb-6 flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${originalIndex % 2 === 0 ? "bg-blue-100 text-blue-700" : "bg-indigo-100 text-indigo-700"}`}
                          aria-hidden="true"
                        >
                          {initials}
                        </div>
                        <figcaption className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">{name}</p>
                          <p className="mt-0.5 text-xs font-medium text-slate-400">
                            Attendee feedback
                          </p>
                        </figcaption>
                      </div>
                      <blockquote className="relative flex-1 text-[15px] leading-relaxed text-slate-600">
                        <span className="absolute -left-1 -top-5 text-4xl font-serif leading-none text-blue-100">
                          “
                        </span>
                        <span className="relative">
                          {item.student_review || "A great event experience."}
                        </span>
                      </blockquote>
                      <div className="mt-5 h-px bg-slate-100 transition-colors group-hover:bg-blue-100" />
                      <div className="mt-3 truncate text-right text-xs font-medium text-slate-400">
                        {eventTitle}
                      </div>
                    </figure>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            aria-label="Next review"
            disabled={!canSlideReviews}
            onClick={(event) => {
              event.stopPropagation();
              if (!canSlideReviews) return;
              setReviewPaused(true);
              handleNextReview();
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all enabled:hover:scale-105 enabled:hover:border-blue-300 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 enabled:hover:shadow-md enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        {canSlideReviews && (
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {visibleDotIndices.map((dotIndex) => {
              const isActive = dotIndex === activeReviewIndex;
              const isEdgeDot =
                (dotWindowStart > 0 && dotIndex === dotWindowStart) ||
                (dotWindowEnd < totalReviewSlides && dotIndex === dotWindowEnd - 1);

              return (
                <button
                  key={dotIndex}
                  type="button"
                  aria-label={`Show review ${dotIndex + 1}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setReviewPaused(true);
                    setReviewTransitionEnabled(true);
                    setReviewIndex(dotIndex);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-1.5 w-6 bg-blue-600"
                      : isEdgeDot
                        ? "h-1 w-1 bg-slate-300/70"
                        : "h-1.5 w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}
