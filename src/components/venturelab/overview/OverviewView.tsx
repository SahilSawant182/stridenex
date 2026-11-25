"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Gauge, Lightbulb, Plus, Rocket, Sparkles } from "lucide-react";
import type { Venture } from "@/types/venturelab";
import { completedMilestones, journeySteps, ventureProgress } from "@/lib/venturelab/utils";
import { useVentureLab } from "../VentureLabProvider";
import { PageHeader, VLButton } from "../shared/primitives";
import { CreateVentureModal } from "../shared/VentureFormModals";
import MetricKpiCard from "./MetricKpiCard";
import VentureCard from "./VentureCard";
import StartupJourneyProgress from "./StartupJourneyProgress";

export default function OverviewView() {
  const router = useRouter();
  const { ventures, activeVenture, setActiveVenture } = useVentureLab();
  const [createOpen, setCreateOpen] = useState(false);

  const live = ventures.filter((v) => !v.archived);
  const ordered = [...live].sort((a, b) => (a.id === activeVenture?.id ? -1 : b.id === activeVenture?.id ? 1 : 0));
  const milestonesDone = live.reduce((n, v) => n + completedMilestones(v), 0);
  const avgProgress = live.length ? Math.round(live.reduce((n, v) => n + ventureProgress(v), 0) / live.length) : 0;
  const owner = activeVenture?.team.find((m) => m.isOwner);
  const firstName = owner?.name.split(" ")[0] ?? "Founder";

  const openVenture = (v: Venture) => {
    setActiveVenture(v.id);
    // Land the founder on whatever step of their journey is in progress.
    const step = journeySteps(v).find((s) => s.status === "In Progress");
    router.push(step?.href ?? "/venturelab/canvas");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        subtitle="Your founder cockpit — every venture, milestone and next step in one place."
        actions={
          <>
            <VLButton variant="outline" onClick={() => router.push("/venturelab/discovery")}>
              <Lightbulb className="h-4 w-4" aria-hidden /> Explore My Ideas
            </VLButton>
            <VLButton variant="accent" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" aria-hidden /> Create New Venture
            </VLButton>
          </>
        }
      />

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <MetricKpiCard label="Active Ventures" value={live.length} hint={`${ventures.length - live.length} archived`} icon={Rocket} tone="blue" />
        <MetricKpiCard label="Ideas Explored" value={ventures.length} hint="Every venture starts as an idea" icon={Sparkles} tone="violet" />
        <MetricKpiCard label="Completed Milestones" value={milestonesDone} hint="Across active roadmaps" icon={CheckCircle2} tone="green" />
        <MetricKpiCard label="Overall Progress" value={`${avgProgress}%`} hint="Average across active ventures" icon={Gauge} tone="orange" />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="vl-active-ventures">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="vl-active-ventures" className="text-base font-bold text-slate-900">
              Active ventures
            </h2>
            <VLButton variant="ghost" size="sm" onClick={() => router.push("/venturelab/ventures")}>
              View all
            </VLButton>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ordered.map((v, i) => (
              <div key={v.id} className="vl-rise" style={{ animationDelay: `${i * 60}ms` }}>
                <VentureCard venture={v} isActive={v.id === activeVenture?.id} onOpen={openVenture} />
              </div>
            ))}
          </div>
        </section>

        {activeVenture && (
          <aside aria-label="Startup journey">
            <StartupJourneyProgress steps={journeySteps(activeVenture)} ventureName={activeVenture.name} />
          </aside>
        )}
      </div>

      <CreateVentureModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
