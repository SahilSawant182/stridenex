import type { Metadata } from "next";
import AiSkillAssessmentPage from "@/components/insights/ai-skill-assessment/AiSkillAssessmentPage";

const pageUrl = "https://stridenex.ai/insights/ai-skill-assessment/";

export const metadata: Metadata = {
  title: "AI Skill Assessment: Look Beyond Job Titles | StrideNex",
  description:
    "See how AI skill assessment can help hiring teams look beyond college brands and credentials to evaluate demonstrated talent and capability.",
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "AI skill assessment",
    "hiring bias",
    "credential filter",
    "college brand",
    "capability assessment",
    "talent evaluation",
    "IIT vs tier-2",
    "recruitment bias",
  ],
  openGraph: {
    title: "AI Skill Assessment: Look Beyond Job Titles | StrideNex",
    description:
      "Explore credential bias in hiring and how capability assessment can help teams look beyond college and job titles.",
    url: pageUrl,
    siteName: "StrideNex",
    type: "article",
    publishedTime: "2024-09-01",
    images: [
      {
        url: "https://stridenex.ai/images/Logo.png",
        width: 1200,
        height: 630,
        alt: "StrideNex capability assessment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Skill Assessment: Look Beyond Job Titles | StrideNex",
    description:
      "See how AI skill assessment can help hiring teams look beyond college brands and credentials.",
    images: ["https://stridenex.ai/images/Logo.png"],
  },
};

export default function Page() {
  return <AiSkillAssessmentPage />;
}