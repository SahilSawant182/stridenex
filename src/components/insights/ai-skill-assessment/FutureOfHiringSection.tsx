import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  capabilityHiringOutcomes,
  futureOfHiring,
  talentTakeaways,
  whyNow,
} from "./data";

export default function FutureOfHiringSection() {
  return (
    <SectionWrapper bgColor="slate">
      <SectionHeading
        eyebrow="The future of hiring"
        title="Capability, not credentials"
        description="More employers are expanding skills-based and non-degree hiring. The opportunity is to evaluate the capability needed for the work."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal animation="left">
          <article className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">
              The shift is already happening
            </h3>
            <ul className="mt-5 space-y-4">
              {futureOfHiring.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-7 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>

        <Reveal animation="right">
          <article className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">Why now?</h3>
            <ul className="mt-5 space-y-4">
              {whyNow.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-7 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>

      <Reveal className="mt-10" animation="scale">
        <div className="rounded-3xl bg-gradient-to-br from-primary-dark via-[#11183d] to-slate-950 p-6 text-white sm:p-9">
          <h3 className="text-2xl font-extrabold">
            The inflection point: outcomes for capability-first hiring
          </h3>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {capabilityHiringOutcomes.map(([label, outcome]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/[0.06] p-5"
              >
                <dt className="text-sm font-medium text-slate-300">{label}</dt>
                <dd className="mt-2 text-xl font-extrabold text-blue-200">
                  {outcome}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <Reveal className="mt-10" animation="up">
        <h3 className="text-2xl font-bold text-slate-950">For talent</h3>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {talentTakeaways.map((takeaway) => (
            <li
              key={takeaway}
              className="rounded-2xl border border-slate-200 bg-white p-5 leading-7 text-slate-700 shadow-sm"
            >
              {takeaway}
            </li>
          ))}
        </ul>
      </Reveal>
    </SectionWrapper>
  );
}
