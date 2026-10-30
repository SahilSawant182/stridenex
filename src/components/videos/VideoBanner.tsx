"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface VideoBannerProps {
  bannerSrc?: string;
  altText?: string;
}

export default function VideoBanner({
  bannerSrc = "/images/video_banner.png",
  altText = "Our Videos - Explore our latest videos on technology, career growth, industry insights, company updates and more.",
}: VideoBannerProps) {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50/80 to-white pt-4 pb-6 sm:pt-6 sm:pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-[#eef4ff] shadow-md shadow-slate-200/60 sm:rounded-3xl"
        >
          <Image
            src={bannerSrc}
            alt={altText}
            width={1920}
            height={440}
            priority
            unoptimized
            className="h-auto w-full object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </motion.div>
      </div>
    </section>
  );
}
