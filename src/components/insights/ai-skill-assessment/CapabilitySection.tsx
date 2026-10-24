import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { dimensions } from "./data";

export default function CapabilitySection() {
  return (
    <SectionWrapper bgColor="slate">
      <SectionHeading
        eyebrow="The framework"
        title="AI capability assessment: what talent actually looks like"
        description="Assess capabilities relevant to the work, rather than relying only on college, years of experience, or job title."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dimensions.map((dimension, index) => (
          <Reveal
            key={dimension.title}
            delay={index * 0.07}
            className="h-full"
            animation={index % 2 === 0 ? "up" : "scale"}
          >
            <article className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-sm font-extrabold text-white shadow-md shadow-primary/20 transition duration-300 group-hover:rotate-3">
                0{index + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {dimension.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {dimension.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}