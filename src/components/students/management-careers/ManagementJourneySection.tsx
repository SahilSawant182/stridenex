import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { careerJourney } from "./data";

export default function ManagementJourneySection() {
  return (
    <SectionWrapper bgColor="white">
      <SectionHeader
        badge="Career trajectory"
        badgeColor="accent"
        title="From your degree to leading a function"
        subtitle="A management path is built through exploration, role clarity, guidance, and responsibility—not a single job title."
      />

      <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {careerJourney.map((step, index) => (
          <li
            key={step.title}
            className="relative h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:border-primary/20 hover:shadow-lg sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                Step {index + 1}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-950">
              {step.title}
            </h3>
            <p className="mt-2 leading-6 text-slate-600">{step.detail}</p>
          </li>
        ))}
      </ol>
    </SectionWrapper>
  );
}
