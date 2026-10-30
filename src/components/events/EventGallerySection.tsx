"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Expand,
  Images,
  X,
} from "lucide-react";
import { type EventImage, mediaUrl } from "./events.types";

interface EventGallerySectionProps {
  eventTitle: string;
  images: EventImage[];
  galleryIndex?: number;
  onChangeGalleryIndex?: (index: number) => void;
}

const INITIAL_GRID_COUNT = 10;

export default function EventGallerySection({
  eventTitle,
  images,
  galleryIndex = 0,
  onChangeGalleryIndex,
}: EventGallerySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(galleryIndex);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [showAllGrid, setShowAllGrid] = useState(false);

  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (galleryIndex >= 0 && galleryIndex < images.length) {
      setActiveIndex(galleryIndex);
    }
  }, [galleryIndex, images.length]);

  const updateIndex = useCallback(
    (nextIndex: number, direction: 1 | -1 = 1) => {
      setSlideDirection(direction);
      setActiveIndex(nextIndex);
      onChangeGalleryIndex?.(nextIndex);
    },
    [onChangeGalleryIndex]
  );

  const openModalAt = (index: number) => {
    updateIndex(index, index >= activeIndex ? 1 : -1);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const showPrev = useCallback(() => {
    if (images.length <= 1) return;
    const prev = (activeIndex - 1 + images.length) % images.length;
    updateIndex(prev, -1);
  }, [activeIndex, images.length, updateIndex]);

  const showNext = useCallback(() => {
    if (images.length <= 1) return;
    const next = (activeIndex + 1) % images.length;
    updateIndex(next, 1);
  }, [activeIndex, images.length, updateIndex]);

  // Auto-scroll active thumbnail into center view when handling lots of images
  useEffect(() => {
    if (!isModalOpen) return;
    const activeThumb = thumbRefs.current[activeIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex, isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      } else if (event.key === "ArrowLeft") {
        showPrev();
      } else if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, closeModal, showPrev, showNext]);

  if (images.length === 0) return null;

  const hasMoreImages = images.length > INITIAL_GRID_COUNT;
  const visibleImages = showAllGrid ? images : images.slice(0, INITIAL_GRID_COUNT);
  const hiddenCount = Math.max(0, images.length - INITIAL_GRID_COUNT);
  const currentImage = images[activeIndex] || images[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX > 0) {
        showPrev();
      } else {
        showNext();
      }
    }
    touchStartX.current = null;
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.15 }}
        className="mt-12"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Moments
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Event highlights
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
            <Images className="h-3.5 w-3.5" />
            <span>
              {images.length} {images.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-1.5 shadow-sm backdrop-blur-sm sm:rounded-3xl sm:p-3 lg:p-4">
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 sm:gap-2 md:grid-cols-5 md:gap-2.5 lg:grid-cols-5 lg:gap-3.5">
            {visibleImages.map((item, index) => {
              const isLastVisibleWithOverflow =
                !showAllGrid && hasMoreImages && index === INITIAL_GRID_COUNT - 1;

              return (
                <motion.button
                  key={`${item.image}-${index}`}
                  type="button"
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min((index % INITIAL_GRID_COUNT) * 0.035, 0.3),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openModalAt(index)}
                  className="group relative aspect-square w-full overflow-hidden rounded-lg border border-slate-200/60 bg-slate-950 text-left shadow-sm transition-shadow duration-300 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:rounded-xl lg:rounded-2xl"
                  aria-label={`View image ${index + 1} of ${images.length}${
                    item.caption ? `: ${item.caption}` : ""
                  }`}
                >
                  {/* Soft ambient fill for portrait/irregular aspect ratios */}
                  <Image
                    src={mediaUrl(item.image)}
                    alt=""
                    fill
                    loading="lazy"
                    unoptimized
                    aria-hidden="true"
                    className="scale-125 object-cover opacity-40 blur-lg"
                    sizes="160px"
                  />

                  {/* Main grid thumbnail biased slightly toward upper-center to preserve faces in portrait shots */}
                  <Image
                    src={mediaUrl(item.image)}
                    alt={item.caption || `${eventTitle} highlight ${index + 1}`}
                    fill
                    loading="lazy"
                    unoptimized
                    className="object-cover object-[center_25%] transition-transform duration-500 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="pointer-events-none absolute left-1.5 top-1.5 hidden rounded-full bg-slate-950/60 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-md transition-transform duration-300 group-hover:scale-105 sm:left-2.5 sm:top-2.5 sm:inline-block">
                    #{index + 1}
                  </span>

                  <div className="pointer-events-none absolute right-1.5 top-1.5 hidden h-8 w-8 scale-90 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 sm:right-2.5 sm:top-2.5 sm:flex">
                    <Expand className="h-3.5 w-3.5" />
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 p-2.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                    <p className="line-clamp-1 text-xs font-medium text-white">
                      {item.caption || "Click to expand"}
                    </p>
                  </div>

                  {/* "+N more" overlay on the last visible card when there are lots of images */}
                  {isLastVisibleWithOverflow && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/75 p-1.5 text-center text-white backdrop-blur-[3px] transition-colors group-hover:bg-slate-950/65 sm:p-3">
                      <span className="text-base font-bold tracking-tight sm:text-2xl">
                        +{hiddenCount}
                      </span>
                      <span className="mt-0.5 text-[10px] font-medium text-blue-200 sm:text-[11px]">
                        More Photos
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {hasMoreImages && (
            <div className="mt-4 flex justify-center border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAllGrid((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                {showAllGrid ? (
                  <>
                    Show fewer photos <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Show all {images.length} photos <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.section>

      <AnimatePresence>
        {isModalOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/92 p-2.5 backdrop-blur-xl sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label={`${eventTitle} image gallery`}
          >
            {/* Ambient background glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <Image
                src={mediaUrl(currentImage.image)}
                alt=""
                fill
                unoptimized
                aria-hidden="true"
                className="scale-125 object-cover opacity-25 blur-3xl transition-all duration-700"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/45 to-slate-950/90" />
            </div>

            {/* Modal Header */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-white shadow-lg backdrop-blur-md sm:px-5 sm:py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 ring-1 ring-blue-400/30">
                  {activeIndex + 1} / {images.length}
                </span>
                <p className="truncate text-sm font-medium text-slate-200">
                  {eventTitle}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close gallery modal"
                className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:rotate-90 hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-200 active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Image Viewer with Sliding Arrows & Portrait Support */}
            <div
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative mx-auto my-2 flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center gap-2 sm:my-3 sm:gap-4"
            >
              <button
                type="button"
                aria-label="Previous image"
                disabled={images.length <= 1}
                onClick={showPrev}
                className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-md transition-all enabled:hover:scale-110 enabled:hover:border-blue-400/50 enabled:hover:bg-blue-500/25 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-900/70 p-2 shadow-2xl backdrop-blur-sm sm:p-3">
                <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-2xl bg-slate-950/60">
                  <AnimatePresence mode="wait" custom={slideDirection}>
                    <motion.div
                      key={`${currentImage.image}-${activeIndex}`}
                      custom={slideDirection}
                      initial={{ opacity: 0, x: slideDirection * 40, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: slideDirection * -40, scale: 0.97 }}
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                      className="relative h-full w-full"
                    >
                      {/* Blurred portrait/landscape fill inside stage so mobile 9:16 photos look framed */}
                      <Image
                        src={mediaUrl(currentImage.image)}
                        alt=""
                        fill
                        unoptimized
                        aria-hidden="true"
                        className="scale-110 object-cover opacity-30 blur-2xl select-none"
                        sizes="100vw"
                      />

                      {/* Full uncropped portrait or landscape image */}
                      <Image
                        src={mediaUrl(currentImage.image)}
                        alt={currentImage.caption || `${eventTitle} image ${activeIndex + 1}`}
                        fill
                        priority
                        unoptimized
                        className="object-contain p-1 select-none sm:p-2"
                        sizes="(max-width: 1280px) 95vw, 1100px"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {currentImage.caption && (
                  <div className="mt-2 shrink-0 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-center backdrop-blur-md">
                    <p className="line-clamp-2 text-xs text-slate-200 sm:text-sm">
                      {currentImage.caption}
                    </p>
                  </div>
                )}

                {/* Mobile Overlay Arrows */}
                {images.length > 1 && (
                  <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 items-center justify-between sm:hidden">
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={showPrev}
                      className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/75 text-white shadow-lg backdrop-blur-md active:scale-95"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={showNext}
                      className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/75 text-white shadow-lg backdrop-blur-md active:scale-95"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                aria-label="Next image"
                disabled={images.length <= 1}
                onClick={showNext}
                className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-md transition-all enabled:hover:scale-110 enabled:hover:border-blue-400/50 enabled:hover:bg-blue-500/25 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Auto-scrolling Thumbnail Strip Footer for Large Image Sets */}
            {images.length > 1 && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mx-auto w-full max-w-4xl shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 overflow-x-auto scroll-smooth px-1 py-0.5 [scrollbar-width:thin]">
                  {images.map((item, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={`thumb-${item.image}-${idx}`}
                        ref={(el) => {
                          thumbRefs.current[idx] = el;
                        }}
                        type="button"
                        onClick={() => updateIndex(idx, idx >= activeIndex ? 1 : -1)}
                        aria-label={`Go to image ${idx + 1}`}
                        className={`relative h-12 w-14 shrink-0 overflow-hidden rounded-xl border transition-all duration-200 sm:h-14 sm:w-16 ${
                          isActive
                            ? "scale-105 border-blue-400 ring-2 ring-blue-400/40"
                            : "border-white/15 opacity-50 hover:opacity-90"
                        }`}
                      >
                        <Image
                          src={mediaUrl(item.image)}
                          alt={item.caption || `${eventTitle} thumbnail ${idx + 1}`}
                          fill
                          loading="lazy"
                          unoptimized
                          className="object-cover object-[center_25%]"
                          sizes="64px"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
