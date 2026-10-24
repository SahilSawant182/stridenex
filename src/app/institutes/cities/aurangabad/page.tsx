import type { Metadata } from "next";
import AurangabadPage from "@/components/institutes/cities/AurangabadPage";

const pageUrl = "https://stridenex.ai/institutes/cities/aurangabad/";

export const metadata: Metadata = {
  title: "Engineering Placements in Aurangabad | SEZ Careers | StrideNex",
  description:
    "Explore placement pathways for Aurangabad colleges, connecting engineering talent with IT SEZ and manufacturing-tech employers.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Engineering Placements in Aurangabad | SEZ Careers | StrideNex",
    description:
      "Explore placement pathways for Aurangabad colleges, connecting engineering talent with IT SEZ and manufacturing-tech employers.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        alt: "StrideNex engineering college placements in Aurangabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Placements in Aurangabad | SEZ Careers | StrideNex",
    description:
      "Explore placement pathways for Aurangabad colleges, connecting engineering talent with IT SEZ and manufacturing-tech employers.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <AurangabadPage />;
}
