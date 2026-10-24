import type { Metadata } from "next";
import ComingSoonPage from "@/components/students/ComingSoonPage";

export const metadata: Metadata = {
  title: "Higher Education Pathway | Coming Soon | StrideNex",
  description:
    "StrideNex's Higher Education Pathway is coming soon. Explore career pathways while we prepare this student resource.",
  alternates: {
    canonical: "https://stridenex.ai/students/higher-education/",
  },
};

export default function Page() {
  return (
    <ComingSoonPage
      audience="higher education"
      title="Higher Education Pathway"
      description="Planning your next academic step? A guide to exploring higher education options and connecting them with your future goals is coming soon."
    />
  );
}
