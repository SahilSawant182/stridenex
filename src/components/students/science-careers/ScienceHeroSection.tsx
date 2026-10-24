import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  FlaskConical,
  Leaf,
  Microscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "../management-careers/Reveal";

const scienceAreas = [
  { name: "Biotech", icon: FlaskConical },
  { name: "Materials", icon: Atom },
  { name: "Climate", icon: Leaf },
  { name: "Research", icon: Microscope },
];

export default function ScienceHeroSection() {
  return (
    <SectionWrapper
      bgColor="gradient"
      spacing="none"
      className="relative isolate overflow-hidden px-6 pt-4 pb-14 sm:pt-5 sm:pb-16 lg:pt-6 lg:pb-20"
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
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_2px_2px,#0f0fbd_1px,transparent_0)] [background-size:40px_40px]"
      />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm sm:text-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            Science and research pathways
          </p>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
            Science careers: build tomorrow&apos;s{" "}
            <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              Technology.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Science builds the future: biotech teams work on disease, materials
            scientists develop aerospace materials, climate-tech teams address
            energy and carbon, and AI researchers build models. Yet Tier-2
            science graduates can feel limited to a long PhD route or commodity
            technical roles. StrideNex connects scientists with research and
            development roles at companies, research institutes, and venture
            labs.
          </p>
          <p className="mt-3 max-w-xl leading-7 text-slate-500">
            More than 450 Tier-2 scientists launched research careers in the
            last year. Researchers can own discovery problems, publish
            findings, build core technologies, and bring research toward
            commercial use.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild variant="accent" size="lg" className="rounded-xl">
              <Link href="/signup?role=student">
                Launch your research career
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
            >
              <a href="#science-stories">
                Read scientist stories
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-8 border-t border-slate-200/80 pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Explore research fields
            </p>
            <div className="flex flex-wrap gap-2">
              {scienceAreas.map(({ name, icon: Icon }) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Reveal
          className="mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"
          delay={0.12}
          direction="right"
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-accent/20 blur-xl"
            />
            <div className="relative aspect-[1.08/1] overflow-hidden rounded-[1.75rem] border border-white shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5 sm:rounded-[2rem]">
              <Image
                src="/images/students-career-science.png"
                alt="A diverse team collaborating on a research and technology project"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover object-[center_42%]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
