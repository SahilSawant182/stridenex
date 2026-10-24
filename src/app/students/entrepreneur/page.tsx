import type { Metadata } from "next";
import ComingSoonPage from "@/components/students/ComingSoonPage";

export const metadata: Metadata = {
  title: "Entrepreneur Development | Coming Soon | StrideNex",
  description:
    "StrideNex's Entrepreneur Development pathway is coming soon. Explore career pathways while we prepare this student resource.",
  alternates: {
    canonical: "https://stridenex.ai/students/entrepreneur/",
  },
};

export default function Page() {
  return (
    <ComingSoonPage
      audience="entrepreneurship"
      title="Entrepreneur Development"
      description="A pathway for students ready to turn ideas into action is on its way. We’re preparing practical guidance to help you explore entrepreneurship and take your next step."
    />
  );
}
