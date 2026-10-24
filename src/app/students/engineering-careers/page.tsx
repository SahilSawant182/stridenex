import type { Metadata } from "next";
import EngineeringCareersPage from "@/components/students/engineering-careers/EngineeringCareersPage";

const pageUrl = "https://stridenex.ai/students/engineering-careers/";

export const metadata: Metadata = {
  title: "Engineering Careers in Technology & Industry | StrideNex",
  description:
    "Explore software, electronics, manufacturing, civil technology, and emerging engineering careers. Find roles where your skills solve real problems.",
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "engineering careers India",
    "tier-2 engineering placements",
    "mechanical engineering careers",
    "electronics engineering jobs",
    "software engineering roles",
    "scale company hiring",
    "startup engineering careers",
    "technical leadership jobs",
  ],
  openGraph: {
    title: "Engineering Careers in Technology & Industry | StrideNex",
    description:
      "Explore engineering roles in software, electronics, manufacturing, civil technology, and emerging fields.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        width: 1200,
        height: 630,
        alt: "StrideNex engineering careers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Careers in Technology & Industry | StrideNex",
    description:
      "Explore engineering roles in software, electronics, manufacturing, civil technology, and emerging fields.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <EngineeringCareersPage />;
}
