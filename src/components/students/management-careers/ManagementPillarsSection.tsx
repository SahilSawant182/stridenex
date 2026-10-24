import { BrainCircuit, Building2, Compass, Handshake } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import { managementPillars } from "./data";

const icons = [BrainCircuit, Building2, Compass, Handshake];

export default function ManagementPillarsSection() {
  return (
    <SectionWrapper bgColor="slate">
      <SectionHeader
        badge="The StrideNex approach"
        title="A supported path into management careers"
        subtitle="Explore your strengths, learn about growing companies, and get guidance as you consider roles with meaningful ownership."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {managementPillars.map((pillar, index) => {
          const Icon = icons[index];
          return (
            <Reveal
              key={pillar.number}
              delay={index * 0.07}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <article className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white shadow-md shadow-primary/20">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-extrabold tracking-wider text-accent">
                    {pillar.number}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-950">
                  {pillar.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {pillar.description}
                </p>
                <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold leading-6 text-primary">
                  {pillar.result}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
