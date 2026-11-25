import type { Metadata } from "next";
import VenturesView from "@/components/venturelab/ventures/VenturesView";

export const metadata: Metadata = { title: "My Ventures · VentureLab · StrideNex" };

export default function Page() {
  return <VenturesView />;
}
