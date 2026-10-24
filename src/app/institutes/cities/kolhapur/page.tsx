import type { Metadata } from "next";
import KolhapurPage from "@/components/institutes/cities/KolhapurPage";

const pageUrl = "https://stridenex.ai/institutes/cities/kolhapur/";

export const metadata: Metadata = {
  title: "Engineering Placements in Kolhapur | Global Careers | StrideNex",
  description:
    "Kolhapur engineering colleges connect students with global companies, international startups, and remote-first teams through StrideNex.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Engineering Placements in Kolhapur | Global Careers | StrideNex",
    description:
      "Kolhapur engineering colleges connect students with global companies, international startups, and remote-first teams through StrideNex.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        alt: "StrideNex engineering college placements in Kolhapur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Placements in Kolhapur | Global Careers | StrideNex",
    description:
      "Kolhapur engineering colleges connect students with global companies, international startups, and remote-first teams through StrideNex.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <KolhapurPage />;
}
