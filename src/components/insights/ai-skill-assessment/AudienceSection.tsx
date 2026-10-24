import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function AudienceSection() {
  return (
    <SectionWrapper bgColor="white">
      <SectionHeading
        eyebrow="For talent and hiring leaders"
        title="Build teams on capability, not pedigree"
        description="A capability-focused process gives candidates another way to demonstrate how they think, learn, and execute. Use it alongside structured interviews, role requirements, and human judgment."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Reveal className="h-full" animation="left">
          <article className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl sm:p-8">
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ArrowRight aria-hidden="true" className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-bold text-slate-950">For talent</h3>
            <p className="mt-4 leading-7 text-slate-600">
              Get an AI capability score and see where you stand, independent
              of degree. Discover what companies measure: how you think, learn,
              and execute.
            </p>
            <Link
              href="/signup?role=student"
              className="mt-6 inline-flex items-center font-bold text-primary hover:underline"
            >
              Explore StrideNex
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </Link>
          </article>
        </Reveal>

        <Reveal delay={0.1} className="h-full" animation="right">
          <article
            id="hiring-leaders"
            className="h-full scroll-mt-8 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.04] to-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
          >
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <ArrowRight aria-hidden="true" className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-bold text-slate-950">
              For hiring teams
            </h3>
            <p className="mt-4 leading-7 text-slate-600">
              Assess talent on capability, not credentials. Use role-relevant
              assessment to predict performance, widen access to talent, and
              build stronger teams.
            </p>
            <Link
              href="/contact-us"
              className="mt-6 inline-flex items-center font-bold text-primary hover:underline"
            >
              Talk to StrideNex
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </Link>
          </article>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}