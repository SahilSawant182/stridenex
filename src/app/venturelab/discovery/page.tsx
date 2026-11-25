import type { Metadata } from "next";
import DiscoveryView from "@/components/venturelab/discovery/DiscoveryView";

export const metadata: Metadata = { title: "Idea Discovery · VentureLab · StrideNex" };

export default function Page() {
  return <DiscoveryView />;
}
