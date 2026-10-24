import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "StrideNex | Pathways to Your Future",
  description:
    "Explore career pathways, build practical skills, and prepare for opportunities in industry, entrepreneurship, or further study with StrideNex.",
  alternates: {
    canonical: "https://stridenex.ai/",
  },
  openGraph: {
    title: "StrideNex | Pathways to Your Future",
    description:
      "Explore career pathways, build practical skills, and prepare for opportunities in industry, entrepreneurship, or further study with StrideNex.",
    url: "https://stridenex.ai/",
    siteName: "StrideNex",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "StrideNex | Pathways to Your Future",
    description:
      "Explore career pathways, build practical skills, and prepare for opportunities in industry, entrepreneurship, or further study with StrideNex.",
  },
};

export default function Home() {
  return <HomePage appName="StrideNex" />;
}