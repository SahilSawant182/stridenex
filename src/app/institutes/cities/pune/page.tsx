import type { Metadata } from "next";
import PunePage from "@/components/institutes/cities/PunePage";

const pageUrl = "https://stridenex.ai/institutes/cities/pune/";

export const metadata: Metadata = {
  title: "Engineering Placements in Pune | Local Industry Roles | StrideNex",
  description:
    "StrideNex helps Pune engineering colleges connect students with local employers through skill-based matching, mentoring, internships, and placement support.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Engineering Placements in Pune | Local Industry Roles | StrideNex",
    description:
      "Connect Pune engineering students with local employers through skill-based matching, mentoring, internships, and placement support.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/hero-industry-connections.jpeg",
        alt: "Students and industry professionals connecting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Placements in Pune | Local Industry Roles | StrideNex",
    description:
      "Connect Pune engineering students with local employers through skill-based matching, mentoring, internships, and placement support.",
    images: ["https://stridenex.ai/images/hero-industry-connections.jpeg"],
  },
};

export default function Page() {
  return <PunePage />;
}
