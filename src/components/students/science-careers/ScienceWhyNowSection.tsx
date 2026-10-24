import {
  ArrowRight,
  Atom,
  FlaskConical,
  Leaf,
  Microscope,
  Sprout,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "../management-careers/Reveal";
import { scienceAdvantages } from "./data";

const icons = [FlaskConical, Leaf, Microscope, Atom, Sprout];

export default function ScienceWhyNowSection() {
  return (
    <SectionWrapper bgColor="white">
      <SectionHeader
        badge="Why science, why now?"
        badgeColor="accent"
        title="Research connects discovery with practical challenges"
        subtitle="Organizations are exploring scientific questions in health, materials, climate, food, and computing."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {scienceAdvantages.map((item, index) => {
          const Icon = icons[index];
          return (
            <Reveal key={item.title} delay={index * 0.07} direction="up">
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-8" direction="scale">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-primary-light p-6 text-white sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-100">
            For scientists
          </p>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-xl font-semibold leading-8 sm:text-2xl">
              Explore how scientists are turning research questions into
              experiments, publications, and real-world applications.
            </p>
            <a
              href="#science-stories"
              className="inline-flex shrink-0 items-center font-bold text-white underline decoration-white/50 underline-offset-4 transition hover:decoration-white"
            >
              Explore scientist stories
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
