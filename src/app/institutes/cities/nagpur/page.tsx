import type { Metadata } from "next";
import NagpurPage from "@/components/institutes/cities/NagpurPage";

const pageUrl = "https://stridenex.ai/institutes/cities/nagpur/";

export const metadata: Metadata = {
  title: "Engineering Placements in Nagpur | Pan-India Roles | StrideNex",
  description:
    "Explore pan-India and distributed placement pathways for Nagpur colleges, with skills-based matching and mentorship.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Engineering Placements in Nagpur | Pan-India Roles | StrideNex",
    description:
      "Explore pan-India and distributed placement pathways for Nagpur colleges, with skills-based matching and mentorship.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        alt: "StrideNex engineering college placements in Nagpur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Placements in Nagpur | Pan-India Roles | StrideNex",
    description:
      "Explore pan-India and distributed placement pathways for Nagpur colleges, with skills-based matching and mentorship.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <NagpurPage />;
}
