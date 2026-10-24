import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  assessmentFindings,
  credentialCosts,
  credentialFilterReasons,
  credentialResearch,
  measurementProblems,
} from "./data";

export default function ProblemSection() {
  return (
    <SectionWrapper bgColor="white">
      <SectionHeading
        eyebrow="The problem"
        title="The credential filter problem: why great talent is invisible"
        description="College, experience, and job titles can be useful context. They are not the same as observing how someone performs a role-relevant task."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Reveal delay={0.05} className="h-full" animation="left">
          <article className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl sm:p-8">
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-extrabold text-primary">
              01
            </span>
            <p className="text-sm font-bold uppercase tracking-wider text-accent">
              The signal
            </p>
            <h3 className="mt-3 text-xl font-bold text-slate-950">
              College brand can shape access
            </h3>
            <p className="mt-4 leading-7 text-slate-600">
              Recruiting and salary outcomes can reflect access to recruiters
              and networks, alongside many other factors. Salary alone does
              not establish capability.
            </p>
          </article>
        </Reveal>

        <Reveal delay={0.12} className="h-full" animation="right">
          <article className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl sm:p-8">
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-lg font-extrabold text-accent">
              02
            </span>
            <p className="text-sm font-bold uppercase tracking-wider text-accent">
              The risk
            </p>
            <h3 className="mt-3 text-xl font-bold text-slate-950">
              A credential is not a capability assessment
            </h3>
            <p className="mt-4 leading-7 text-slate-600">
              A credential filter can screen out candidates before they
              demonstrate their skills. It can also give a hiring team
              confidence without directly showing how a candidate handles the
              work.
            </p>
          </article>
        </Reveal>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {credentialResearch.map((item, index) => (
          <Reveal
            key={item.title}
            delay={index * 0.08}
            animation={index === 0 ? "left" : "right"}
          >
            <article className="h-full rounded-2xl border border-primary/10 bg-white p-6 sm:p-7">
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8" animation="scale">
        <div className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/[0.04] via-white to-accent/[0.05] p-6 sm:p-9">
          <h3 className="text-2xl font-bold text-slate-950">
            The credential paradox
          </h3>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="font-bold text-slate-950">
                IIT graduate: credential pass, capability gap
              </p>
              <p className="mt-3 leading-7 text-slate-600">
                Brand score: 9/10. The company hires based on the credential,
                but the candidate&apos;s capability is 5/10. In year one, they
                struggle with novel problems, need hand-holding, and learn
                slowly. A capability assessment would flag weak problem-solving
                and learning velocity.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="font-bold text-slate-950">
                Tier-2 engineer: credential fail, capability strength
              </p>
              <p className="mt-3 leading-7 text-slate-600">
                Brand score: 3/10. A credential screen rejects the candidate
                despite actual capability of 8/10, strong problem-solving,
                fast learning, and high execution. The team misses this
                engineer and hires the weaker candidate instead.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10" animation="up">
        <h3 className="text-2xl font-bold text-slate-950">
          What credential filters can cost
        </h3>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {credentialCosts.map((group) => (
            <article
              key={group.audience}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h4 className="text-lg font-bold text-slate-950">
                {group.audience}
              </h4>
              <ul className="mt-4 space-y-3">
                {group.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 leading-6 text-slate-600"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-10" animation="scale">
        <h3 className="text-2xl font-bold text-slate-950">
          Capability signals credentials can miss
        </h3>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {assessmentFindings.map((finding) => (
            <article
              key={finding.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h4 className="font-bold text-slate-950">{finding.title}</h4>
              <p className="mt-3 leading-7 text-slate-600">{finding.copy}</p>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <h3 className="text-2xl font-bold text-slate-950">
          Why credential filters persist
        </h3>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {credentialFilterReasons.map((reason) => (
            <li
              key={reason}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 leading-6 text-slate-600 shadow-sm"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
              {reason}
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/[0.04] p-6">
          <h4 className="font-bold text-slate-950">
            Why the data can be hard to see
          </h4>
          <ul className="mt-4 space-y-3">
            {measurementProblems.map((problem) => (
              <li
                key={problem}
                className="flex items-start gap-3 leading-7 text-slate-600"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                {problem}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}