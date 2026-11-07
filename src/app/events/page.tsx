import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Events - StrideNex",
  description: "Discover upcoming events, conferences, and opportunities from StrideNex.",
  openGraph: {
    title: "Events - StrideNex",
    description: "Discover upcoming events, conferences, and opportunities from StrideNex.",
    type: "website",
    siteName: "StrideNex",
  },
};

export default function EventsPage() {
  return <EventsClient />;
}
