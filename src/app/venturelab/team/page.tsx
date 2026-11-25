import type { Metadata } from "next";
import TeamView from "@/components/venturelab/team/TeamView";

export const metadata: Metadata = { title: "Team & Collaboration · VentureLab · StrideNex" };

export default function Page() {
  return <TeamView />;
}
