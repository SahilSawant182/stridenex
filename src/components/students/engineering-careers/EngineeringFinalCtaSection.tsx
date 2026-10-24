import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Compass,
  Handshake,
  MessageSquareText,
  Play,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "../management-careers/Reveal";

const nextSteps = [
  { icon: ClipboardCheck, text: "Take a 30-minute specialization assessment" },
  { icon: Compass, text: "Review 5–10 problems matched to your technical fit" },
  { icon: Handshake, text: "Meet an engineer who solved similar problems at scale" },
  { icon: MessageSquareText, text: "Deep-dive with the hiring engineer on the technical challenge" },
  { icon: Wrench, text: "Complete a merit-based interview and offer process (2–3 weeks)" },
  { icon: Play, text: "Start building and own a core technical problem" },
];

export default function EngineeringFinalCtaSection() {
  return (
    <>
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <Reveal className="mx-auto max-w-7xl" direction="scale">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-light to-accent px-6 py-10 text-white shadow-2xl shadow-primary/15 sm:px-12 sm:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10 sm:h-80 sm:w-80"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-100">
                  Engineer? Build the future.
                </p>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
                  Engineer? Build the future at scale. Start now.
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-white/90">
                  AI profiles your technical depth and problem-solving style.
                  See matched company problems, meet an engineering mentor,
                  understand the role, then start building.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl bg-white font-bold text-primary hover:bg-slate-100"
                  >
                    <Link href="/signup?role=student">
                      Launch your career
                      <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-xl border-white/60 bg-white/5 text-white hover:bg-white/10"
                  >
                    <a href="#engineering-stories">Read engineer stories</a>
                  </Button>
                </div>
                <Link
                  href="/contact-us?interest=engineering"
                  className="mt-5 inline-flex items-center text-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-4 transition hover:text-white"
                >
                  Ask about engineering pathways
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-orange-100">
                  What happens next
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {nextSteps.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-medium leading-5 text-white backdrop-blur-sm"
                    >
                      <Icon
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-orange-100"
                      />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="border-t border-slate-200 bg-slate-50 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-600">
          <Link
            href="/students/management-careers/"
            className="transition hover:text-primary"
          >
            Management &amp; leadership careers
          </Link>
          <Link
            href="/students/science-careers/"
            className="transition hover:text-primary"
          >
            Science &amp; research careers
          </Link>
          <Link
            href="/signup?role=student"
            className="transition hover:text-primary"
          >
            Start your student journey
          </Link>
          <Link
            href="/contact-us?interest=engineering"
            className="transition hover:text-primary"
          >
            Ask about engineering pathways
          </Link>
        </div>
      </section>
    </>
  );
}
