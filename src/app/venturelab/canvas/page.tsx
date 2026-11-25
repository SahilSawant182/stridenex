import type { Metadata } from "next";
import CanvasView from "@/components/venturelab/canvas/CanvasView";

export const metadata: Metadata = { title: "Business Model Canvas · VentureLab · StrideNex" };

export default function Page() {
  return <CanvasView />;
}
