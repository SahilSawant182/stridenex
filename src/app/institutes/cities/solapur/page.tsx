import type { Metadata } from "next";
import SolapurPage from "@/components/institutes/cities/SolapurPage";

const pageUrl = "https://stridenex.ai/institutes/cities/solapur/";

export const metadata: Metadata = {
  title: "Engineering Placements in Solapur | Textile-Tech Careers | StrideNex",
  description:
    "Explore textile-tech, manufacturing, and local career pathways for Solapur colleges through skill matching and mentorship.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Engineering Placements in Solapur | Textile-Tech Careers | StrideNex",
    description:
      "Explore textile-tech, manufacturing, and local career pathways for Solapur colleges through skill matching and mentorship.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        alt: "StrideNex engineering college placements in Solapur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Placements in Solapur | Textile-Tech Careers | StrideNex",
    description:
      "Explore textile-tech, manufacturing, and local career pathways for Solapur colleges through skill matching and mentorship.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <SolapurPage />;
}
