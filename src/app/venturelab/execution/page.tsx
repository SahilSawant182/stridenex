import type { Metadata } from "next";
import ExecutionView from "@/components/venturelab/execution/ExecutionView";

export const metadata: Metadata = { title: "Execution Hub · VentureLab · StrideNex" };

export default function Page() {
  return <ExecutionView />;
}
