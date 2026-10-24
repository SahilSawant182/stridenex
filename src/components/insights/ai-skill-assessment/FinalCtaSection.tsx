import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function FinalCtaSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <Reveal className="mx-auto max-w-7xl" animation="scale">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-light to-accent px-6 py-10 text-white shadow-2xl shadow-primary/15 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10 sm:h-80 sm:w-80"
          />

          <div className="relative max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/80">
              Measure capability, not credentials
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
              Measure capability, not credentials. Assess now.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/85">
              Get your AI capability score, see where you stand independent of
              degree, and discover what companies will measure. Hiring leaders
              can explore the data behind capability-based hiring.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup?role=student"
                className="inline-flex items-center rounded-xl bg-white px-6 py-3 font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Explore StrideNex
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/blogs"
                className="inline-flex items-center rounded-xl border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                More insights
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center rounded-xl border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Request the research methodology
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}