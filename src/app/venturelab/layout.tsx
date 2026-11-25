import type { Metadata } from "next";
import VentureLabShell from "@/components/venturelab/VentureLabShell";
import "./venturelab.css";

export const metadata: Metadata = {
  title: "VentureLab · StrideNex",
  description: "Turn your idea into a venture — discovery, business model, execution and team, inside StrideNex.",
};

export default function VentureLabLayout({ children }: { children: React.ReactNode }) {
  return <VentureLabShell>{children}</VentureLabShell>;
}
