import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  assessmentStories,
  hiringOutcomes,
  twoYearOutcomes,
} from "./data";

export default function HiringEvidenceSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-[#11183d] to-slate-950 px-6 py-20 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          tone="light"
          eyebrow="Hiring outcomes"
          title="The data: AI assessment outpredicts credentials"
          description="A same-company, same-role comparison of two 50-person engineering cohorts."
        />

        <div className="mb-7 grid gap-5 md:grid-cols-2">
          <Reveal animation="left">
            <article className="h-full rounded-2xl border border-white/15 bg-white/[0.06] p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-200">
                Cohort 1 · Credential-filtered
              </p>
              <p className="mt-2 text-2xl font-extrabold">50 engineers</p>
              <p className="mt-2 leading-7 text-slate-300">
                Hired for the same role using a college-brand filter limited to
                IIT/NIT colleges.
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.08} animation="right">
            <article className="h-full rounded-2xl border border-accent/30 bg-accent/[0.08] p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-accent-light">
                Cohort 2 · Capability-assessed
              </p>
              <p className="mt-2 text-2xl font-extrabold">50 engineers</p>
              <p className="mt-2 leading-7 text-slate-300">
                Hired for the same role with an AI assessment score of 6.5/10
                or higher, across diverse colleges.
              </p>
            </article>
          </Reveal>
        </div>

        <Reveal animation="scale">
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-white/[0.04] shadow-2xl shadow-slate-950/20 backdrop-blur-sm">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-white/10">
                <tr>
                  <th scope="col" className="p-4 font-semibold">
                    Year-one measure
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Credential-filtered cohort
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Capability-assessed cohort
                  </th>
                </tr>
              </thead>

              <tbody>
                {hiringOutcomes.map(([measure, credential, capability]) => (
                  <tr
                    key={measure}
                    className="border-t border-white/10 transition-colors hover:bg-white/[0.06]"
                  >
                    <th
                      scope="row"
                      className="p-4 font-medium text-slate-200"
                    >
                      {measure}
                    </th>
                    <td className="p-4 text-slate-300">{credential}</td>
                    <td className="p-4 font-semibold text-blue-200">
                      {capability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal className="mt-10" animation="up">
          <h3 className="text-2xl font-bold">Two-year career progression</h3>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/15 bg-white/[0.04]">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-white/10">
                <tr>
                  <th scope="col" className="p-4 font-semibold">Career track</th>
                  <th scope="col" className="p-4 font-semibold">Credential-filtered</th>
                  <th scope="col" className="p-4 font-semibold">Capability-assessed</th>
                </tr>
              </thead>
              <tbody>
                {twoYearOutcomes.map(([track, credential, capability]) => (
                  <tr key={track} className="border-t border-white/10">
                    <th scope="row" className="p-4 font-medium text-slate-200">
                      {track}
                    </th>
                    <td className="p-4 text-slate-300">{credential}</td>
                    <td className="p-4 font-semibold text-blue-200">
                      {capability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 rounded-xl bg-accent/10 p-4 font-semibold text-accent-light">
            Reported talent value for the capability-assessed cohort: 3.5×
            higher.
          </p>
        </Reveal>

        <div className="mt-12">
          <h3 className="text-2xl font-bold">Assessment and hiring stories</h3>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {assessmentStories.map((story, index) => (
              <Reveal
                key={story.name}
                delay={index * 0.07}
                animation={index === 1 ? "up" : index === 0 ? "left" : "right"}
              >
                <figure className="h-full rounded-2xl border border-white/15 bg-white/[0.06] p-6">
                  <blockquote className="leading-7 text-slate-200">
                    “{story.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-white/10 pt-4">
                    <p className="font-bold">{story.name}</p>
                    <p className="mt-1 text-sm text-blue-200">{story.profile}</p>
                    <p className="mt-1 text-sm text-slate-400">{story.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}