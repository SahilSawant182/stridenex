import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function HeroSection() {
  return (
    <SectionWrapper
      bgColor="gradient"
      spacing="none"
      className="relative isolate overflow-hidden px-6 py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl sm:h-[28rem] sm:w-[28rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_2px_2px,#0f0fbd_1px,transparent_0)] [background-size:40px_40px]"
      />

      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm sm:text-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            StrideNex Research · September 2024
          </p>

          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-5xl xl:text-6xl">
            Your Degree Is a Prediction of Wealth.{" "}
            <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              Not Talent.
            </span>
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            Hiring funnels often use college, experience, and job titles because they are
            easy to filter. These signals can shape access to recruiters, but they do not
            directly measure how someone thinks, solves problems, learns, or executes.
          </p>

          <p className="mt-4 max-w-3xl leading-7 text-slate-500">
            Hiring systems can optimize for signals rather than capability:
            capable Tier-2 talent is filtered out, while a Tier-1 graduate may
            pass without demonstrating role-relevant skills. StrideNex
            capability assessment evaluates how people think, solve problems,
            learn, and execute. Top talent is everywhere—it can be invisible to
            credential-based systems.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild variant="accent" size="lg" className="rounded-xl">
              <Link href="/signup?role=student">
                Assess your capability
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
            >
              <a href="#hiring-leaders">
                For hiring leaders
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div
          className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div className="relative rounded-3xl border border-white/80 bg-white/85 p-6 shadow-2xl shadow-primary/10 backdrop-blur sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
              Inside the assessment
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
              What capability looks like
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Example skills assessed—not scores or rankings.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  skill: "Problem-solving",
                  description: "How you approach unfamiliar challenges",
                },
                {
                  skill: "Learning velocity",
                  description: "How you pick up and apply new ideas",
                },
                {
                  skill: "Execution",
                  description: "How you turn decisions into outcomes",
                },
              ].map((item, index) => (
                <div
                  key={item.skill}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${index === 1 ? "bg-accent text-slate-950" : "bg-primary text-white"
                      }`}
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">{item.skill}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}