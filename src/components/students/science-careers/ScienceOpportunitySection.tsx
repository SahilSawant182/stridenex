import { BookOpenCheck, FlaskConical, Workflow } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "../management-careers/Reveal";
import { scienceConsequences, scienceProblemDetails } from "./data";

const challenges = [
  {
    icon: BookOpenCheck,
    title: "Research can seem like a single route",
    description:
      "Many students see a PhD as the only path to research. Academic study is important, but applied research roles may also exist across companies and labs.",
  },
  {
    icon: Workflow,
    title: "Industry roles can hide the science",
    description:
      "Generic job titles may not reveal whether a role involves experimentation, analysis, product development, or research ownership.",
  },
  {
    icon: FlaskConical,
    title: "Applied research is easy to miss",
    description:
      "Teams in biotech, climate, materials, AI, and agriculture may work on research questions that are not visible through campus recruitment alone.",
  },
];

export default function ScienceOpportunitySection() {
  return (
    <SectionWrapper bgColor="white">
      <SectionHeader
        badge="The opportunity"
        badgeColor="accent"
        title="Research careers can reach beyond the university lab"
        subtitle="Academic, applied, and industry research each have different goals. Understanding the work can help you find the path that suits your interests."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {challenges.map(({ icon: Icon, title, description }, index) => (
          <Reveal
            key={title}
            delay={index * 0.08}
            direction={index === 1 ? "up" : index === 0 ? "left" : "right"}
          >
            <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl sm:p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{description}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10" direction="up">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">
              The science career opportunity trap
            </h3>
            <ul className="mt-5 space-y-4">
              {scienceProblemDetails.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-7 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-3xl border border-accent/20 bg-accent/[0.04] p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">
              What this can mean for Tier-2 scientists
            </h3>
            <ul className="mt-5 space-y-4">
              {scienceConsequences.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-7 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Reveal>

      <Reveal className="mt-8" direction="scale">
        <div className="rounded-3xl border border-accent/15 bg-gradient-to-r from-primary/[0.04] via-white to-accent/[0.06] p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
                Explore your options
              </p>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Choose with the research in view.
              </h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Ask what question the team is trying to answer.",
                "Understand the methods, evidence, and resources involved.",
                "Discuss publication and intellectual-property policies.",
                "Consider how research may connect to an application.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-slate-700"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
