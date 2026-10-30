import type { Metadata } from "next";
import VideoClient from "./VideoClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stridenex.ai";

export const metadata: Metadata = {
  title: "Videos - StrideNex",
  description:
    "Explore our latest videos, podcasts, career growth insights, and expert discussions from StrideNex.",
  openGraph: {
    title: "Videos - StrideNex",
    description:
      "Explore our latest videos, podcasts, career growth insights, and expert discussions from StrideNex.",
    url: `${SITE_URL}/our-videos`,
    type: "website",
    siteName: "StrideNex",
    images: [
      {
        url: `${SITE_URL}/images/video_banner.png`,
        width: 1200,
        height: 630,
        alt: "StrideNex Videos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Videos - StrideNex",
    description:
      "Explore our latest videos, podcasts, career growth insights, and expert discussions from StrideNex.",
    images: [`${SITE_URL}/images/video_banner.png`],
  },
};

export default function VideoPage() {
  return <VideoClient />;
}
