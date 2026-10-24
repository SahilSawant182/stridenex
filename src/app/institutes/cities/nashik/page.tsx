import type { Metadata } from "next";
import NashikPage from "@/components/institutes/cities/NashikPage";

const pageUrl = "https://stridenex.ai/institutes/cities/nashik/";

export const metadata: Metadata = {
  title: "Engineering Placements in Nashik | Tier-2 Hiring | StrideNex",
  description:
    "Explore placement pathways for Nashik colleges, with skill-based matching, Tier-2-friendly employers, and mentorship.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Engineering Placements in Nashik | Tier-2 Hiring | StrideNex",
    description:
      "Explore placement pathways for Nashik colleges, with skill-based matching, Tier-2-friendly employers, and mentorship.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        alt: "StrideNex engineering college placements in Nashik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Placements in Nashik | Tier-2 Hiring | StrideNex",
    description:
      "Explore placement pathways for Nashik colleges, with skill-based matching, Tier-2-friendly employers, and mentorship.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <NashikPage />;
}
