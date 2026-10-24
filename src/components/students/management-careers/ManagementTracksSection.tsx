import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import { specializationTracks } from "./data";

export default function ManagementTracksSection() {
  return (
    <SectionWrapper bgColor="white">
      <SectionHeader
        badge="Explore specializations"
        badgeColor="accent"
        title="Find a management function that fits your interests"
        subtitle="Management is not one job. Explore the work, scope, and skills across different functions."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {specializationTracks.map((track, index) => (
          <Reveal
            key={track.title}
            delay={(index % 3) * 0.06}
            direction={index % 2 === 0 ? "up" : "scale"}
          >
            <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  {track.companyCount}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {track.title}
              </h3>
              <p className="mt-3 flex-1 leading-7 text-slate-600">
                {track.description}
              </p>
              <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold leading-6 text-primary">
                {track.outcome}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
