import type { Metadata } from "next";
import SangliPage from "@/components/institutes/cities/SangliPage";

const pageUrl = "https://stridenex.ai/institutes/cities/sangli/";

export const metadata: Metadata = {
  title: "Engineering Placements in Sangli | Manufacturing Careers | StrideNex",
  description:
    "Sangli engineering colleges connect students with ambitious careers in manufacturing, industrial technology, and Industry 4.0 through StrideNex.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Engineering Placements in Sangli | Manufacturing Careers | StrideNex",
    description:
      "Sangli engineering colleges connect students with ambitious careers in manufacturing, industrial technology, and Industry 4.0 through StrideNex.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        alt: "StrideNex engineering college placements in Sangli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Placements in Sangli | Manufacturing Careers | StrideNex",
    description:
      "Sangli engineering colleges connect students with ambitious careers in manufacturing, industrial technology, and Industry 4.0 through StrideNex.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <SangliPage />;
}
