import type { Metadata } from "next";
import NewsletterReader from "@/components/newsletters/NewsletterReader";

export const metadata: Metadata = {
  title: "Newsletter | StrideNex",
  description: "Read the latest insights and updates from StrideNex.",
};

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let newsletterId = id;

  try {
    newsletterId = decodeURIComponent(id);
  } catch {
    // Keep the original identifier if it is not a valid encoded value.
  }

  return <NewsletterReader id={newsletterId} />;
}
