import type { Metadata } from "next";
import ScienceCareersPage from "@/components/students/science-careers/ScienceCareersPage";

const pageUrl = "https://stridenex.ai/students/science-careers/";

export const metadata: Metadata = {
  title: "Science & Research Careers in Biotech, AI & Climate | StrideNex",
  description:
    "Explore applied research careers in biotech, materials science, climate technology, AI, and agriculture—from discovery to real-world impact.",
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "science careers India",
    "research careers",
    "biotech jobs India",
    "materials science careers",
    "climate tech opportunities",
    "AI research positions",
    "publication opportunities",
    "startup research roles",
  ],
  openGraph: {
    title: "Science & Research Careers in Biotech, AI & Climate | StrideNex",
    description:
      "Explore applied research roles across biotech, materials, climate, AI, and agricultural science.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        width: 1200,
        height: 630,
        alt: "StrideNex science and research careers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Science & Research Careers in Biotech, AI & Climate | StrideNex",
    description:
      "Explore applied research roles across biotech, materials, climate, AI, and agricultural science.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <ScienceCareersPage />;
}
