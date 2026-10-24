import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { hiringInsights } from "./data";

export default function InsightsCalloutSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-[#11183d] to-slate-950 px-6 py-20 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          tone="light"
          eyebrow="Key insights"
          title="Three Key Insights from Hiring Data"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {hiringInsights.map((insight, index) => (
            <Reveal
              key={insight.title}
              delay={index * 0.08}
              animation={index === 1 ? "up" : index === 0 ? "left" : "right"}
            >
              <article className="h-full rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-lg shadow-slate-950/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.09] sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sm font-extrabold text-accent-light">
                  0{index + 1}
                </span>
                <p className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {insight.metric}
                </p>
                <h3 className="mt-3 text-xl font-bold text-blue-100">
                  {insight.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-300">
                  {insight.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
