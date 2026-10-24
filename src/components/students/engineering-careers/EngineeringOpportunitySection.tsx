import {
  Eye,
  Layers3,
  Wrench,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "../management-careers/Reveal";
import { engineeringConsequences, engineeringProblemDetails } from "./data";

const challenges = [
  {
    icon: Eye,
    title: "The roles can be hard to see",
    description:
      "Campus hiring may show only a narrow set of openings, while product, manufacturing, infrastructure, and engineering-led companies recruit through other channels.",
  },
  {
    icon: Wrench,
    title: "Your specialization may be underused",
    description:
      "A mechanical, electronics, civil, or chemical background can be overlooked when a role is described only with a generic job title.",
  },
  {
    icon: Layers3,
    title: "The problem behind the role matters",
    description:
      "A title does not tell you whether you will build a system, solve a technical constraint, maintain existing software, or contribute to a product.",
  },
];

export default function EngineeringOpportunitySection() {
  return (
    <SectionWrapper bgColor="white">
      <SectionHeader
        badge="The opportunity"
        badgeColor="accent"
        title="Strong fundamentals deserve a closer look at the work"
        subtitle="Engineering careers are shaped by the problems you solve, the systems you build, and how your strengths fit the team's technical needs."
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
              How the opportunity mismatch appears
            </h3>
            <ul className="mt-5 space-y-4">
              {engineeringProblemDetails.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-7 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-3xl border border-accent/20 bg-accent/[0.04] p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">
              What this can mean for engineering graduates
            </h3>
            <ul className="mt-5 space-y-4">
              {engineeringConsequences.map((item) => (
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
                A more considered engineering path
              </p>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Start with the problem. Then find where you fit.
              </h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Understand the technical challenge and team context.",
                "Look for a meaningful connection to your discipline.",
                "Compare learning opportunities and role expectations.",
                "Ask how your work contributes to a product or system.",
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
