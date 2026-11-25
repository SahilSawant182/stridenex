import type { Metadata } from "next";
import OverviewView from "@/components/venturelab/overview/OverviewView";

export const metadata: Metadata = { title: "Overview · VentureLab · StrideNex" };

export default function Page() {
  return <OverviewView />;
}
