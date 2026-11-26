import type { Metadata } from "next";
import NewsletterListing from "@/components/newsletters/NewsletterListing";

export const metadata: Metadata = {
  title: "Newsletters | StrideNex",
  description:
    "Browse StrideNex newsletters for career insights, mentoring stories, and learning resources.",
};

export default function NewslettersPage() {
  return <NewsletterListing />;
}
