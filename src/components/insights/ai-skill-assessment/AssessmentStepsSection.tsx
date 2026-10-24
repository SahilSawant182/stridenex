import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { assessmentResultExample, profileExample } from "./data";
import { assessmentSteps } from "./data";

export default function AssessmentStepsSection() {
  return (
    <SectionWrapper bgColor="white">
      <SectionHeading
        eyebrow="How it works"
        title="The 30-minute capability scan"
        description="Complete four timed activities, then review a profile of your demonstrated capabilities."
      />

      <div className="relative space-y-4 before:absolute before:bottom-8 before:left-[2.45rem] before:top-8 before:hidden before:w-px before:bg-gradient-to-b before:from-primary before:via-primary/30 before:to-accent/40 sm:before:block">
        {assessmentSteps.map((step, index) => (
          <Reveal
            key={step.title}
            delay={index * 0.05}
            animation={index % 2 === 0 ? "left" : "right"}
          >
            <article className="relative flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:border-primary/20 hover:shadow-lg sm:flex-row sm:items-start sm:p-6">
              <div className="flex shrink-0 items-start gap-4 sm:w-52">
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white shadow-md shadow-primary/20">
                  0{index + 1}
                </span>
                <div className="pt-1">
                  <p className="text-sm font-bold uppercase tracking-wide text-primary">
                    Step {index + 1}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{step.duration}</p>
                </div>
              </div>

              <div className="sm:pt-1">
                <h3 className="text-lg font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-2 leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8" animation="up">
        <article className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] via-white to-primary/[0.04] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-accent">
            Sample assessment result
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-3xl font-extrabold text-slate-950">
              {assessmentResultExample.score}
            </h3>
            <p className="font-semibold text-primary">
              {assessmentResultExample.tier}
            </p>
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {assessmentResultExample.dimensions.map(([dimension, score]) => (
              <div
                key={dimension}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <dt className="text-sm leading-5 text-slate-500">{dimension}</dt>
                <dd className="mt-2 text-xl font-bold text-slate-950">{score}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ["Best-fit roles", assessmentResultExample.roles],
              ["Growth path", assessmentResultExample.growth],
              ["Red flags", assessmentResultExample.flags],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/80 p-4">
                <h4 className="font-bold text-slate-950">{label}</h4>
                <p className="mt-2 leading-6 text-slate-600">{value}</p>
              </div>
            ))}
          </div>
        </article>
      </Reveal>

      <Reveal className="mt-12" animation="scale">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
          <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-white/75">
              Sample profile
            </p>
            <h3 className="mt-2 text-2xl font-extrabold">
              {profileExample.candidate}
            </h3>
            <p className="mt-1 text-white/85">{profileExample.credentials}</p>
          </div>

          <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h4 className="font-bold text-slate-950">
                Capability scores
              </h4>
              <dl className="mt-4 space-y-3">
                {profileExample.dimensions.map(([dimension, score, note]) => (
                  <div
                    key={dimension}
                    className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2"
                  >
                    <dt className="text-slate-600">{dimension}</dt>
                    {note && (
                      <dd className="mt-1 text-sm leading-5 text-slate-500">
                        {note}
                      </dd>
                    )}
                    <dd className="shrink-0 font-bold text-primary">{score}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-5">
                <h4 className="font-bold text-slate-950">
                  Credential-only view
                </h4>
                <p className="mt-2 leading-7 text-slate-600">
                  {profileExample.traditional}
                </p>
              </div>
              <div className="rounded-2xl bg-primary/[0.04] p-5">
                <h4 className="font-bold text-slate-950">
                  Capability-assessment view
                </h4>
                <p className="mt-2 leading-7 text-slate-600">
                  {profileExample.capability}
                </p>
              </div>
              <p className="border-l-4 border-accent pl-4 leading-7 text-slate-700">
                <strong>Profile summary: </strong>
                {profileExample.verdict}
              </p>
              <p className="leading-7 text-slate-600">
                <strong>Growth potential: </strong>
                {profileExample.growthPotential}
              </p>
              <p className="leading-7 text-slate-600">
                <strong>Red flag: </strong>
                {profileExample.redFlag}
              </p>
            </div>
          </div>
        </article>
      </Reveal>
    </SectionWrapper>
  );
}