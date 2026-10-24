import type { Metadata } from "next";
import ManagementCareersPage from "@/components/students/management-careers/ManagementCareersPage";

const pageUrl = "https://stridenex.ai/students/management-careers/";

export const metadata: Metadata = {
  title: "Management Careers in Product & Operations | StrideNex",
  description:
    "Explore product, operations, strategy, sales, and finance careers. Build teams, lead functions, and help growing companies deliver results.",
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "management careers India",
    "tier-2 management roles",
    "product management jobs",
    "operations management careers",
    "strategy roles India",
    "sales management positions",
    "scale company leadership",
    "startup management careers",
  ],
  openGraph: {
    title: "Management Careers in Product & Operations | StrideNex",
    description:
      "Explore management career paths in product, operations, strategy, sales, and finance at growing companies.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "website",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        width: 1200,
        height: 630,
        alt: "StrideNex management careers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Management Careers in Product & Operations | StrideNex",
    description:
      "Explore management career paths in product, operations, strategy, sales, and finance at growing companies.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <ManagementCareersPage />;
}
