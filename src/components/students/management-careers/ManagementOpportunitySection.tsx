import { ArrowRight, EyeOff, GraduationCap, TrendingDown } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import { managementConsequences, managementProblemDetails } from "./data";

const blindSpots = [
  {
    icon: EyeOff,
    title: "Management is treated as a later promotion",
    description:
      "Many graduates assume they must spend years in an individual-contributor role before they can lead. Management is also a career path with its own entry roles and skills.",
  },
  {
    icon: GraduationCap,
    title: "Campus hiring can hide management roles",
    description:
      "If campus opportunities mainly advertise engineering or analyst roles, students may not discover product, operations, strategy, or business development tracks.",
  },
  {
    icon: TrendingDown,
    title: "An MBA is mistaken for a prerequisite",
    description:
      "Some management positions value relevant fundamentals, communication, judgment, learning, and role fit. Requirements vary by employer and function.",
  },
];

export default function ManagementOpportunitySection() {
  return (
    <SectionWrapper bgColor="white">
      <SectionHeader
        badge="The opportunity"
        badgeColor="accent"
        title="When leadership roles are invisible, graduates can miss the path"
        subtitle="Technical and business fundamentals can open more than one direction. Discover the management roles and business impact that traditional campus routes may not show."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {blindSpots.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.08} direction={index === 1 ? "up" : index === 0 ? "left" : "right"}>
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
              The management opportunity blindness
            </h3>
            <ul className="mt-5 space-y-4">
              {managementProblemDetails.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-7 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-3xl border border-accent/20 bg-accent/[0.04] p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">
              What this can mean for graduates
            </h3>
            <ul className="mt-5 space-y-4">
              {managementConsequences.map((item) => (
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
                Your management path
              </p>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Your degree is a foundation—not a ceiling.
              </h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Build on your technical, analytical, or business fundamentals.",
                "Explore product, operations, strategy, sales, or finance.",
                "Grow toward team and function ownership.",
                "Learn with clear expectations and experienced guidance.",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-accent" />
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
