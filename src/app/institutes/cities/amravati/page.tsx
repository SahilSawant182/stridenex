import type { Metadata } from "next";
import AmravatiPage from "@/components/institutes/cities/AmravatiPage";

const pageUrl = "https://stridenex.ai/institutes/cities/amravati/";

export const metadata: Metadata = {
  title: "Engineering Placements in Amravati | Growth Careers | StrideNex",
  description:
    "Explore growth-company placement pathways for Amravati colleges through skill-based matching, mentorship, and career development.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Engineering Placements in Amravati | Growth Careers | StrideNex",
    description:
      "Explore growth-company placement pathways for Amravati colleges through skill-based matching, mentorship, and career development.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        alt: "StrideNex engineering college placements in Amravati",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Placements in Amravati | Growth Careers | StrideNex",
    description:
      "Explore growth-company placement pathways for Amravati colleges through skill-based matching, mentorship, and career development.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <AmravatiPage />;
}
