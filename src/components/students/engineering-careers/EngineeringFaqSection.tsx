import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "../management-careers/Reveal";
import { engineeringFaqs } from "./data";

export default function EngineeringFaqSection() {
  return (
    <SectionWrapper bgColor="white">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          badge="FAQs"
          title="Engineer questions, answered"
          subtitle="Consider these questions as you explore technical roles and discuss expectations with a potential employer."
        />

        <div className="space-y-3">
          {engineeringFaqs.map((item, index) => (
            <Reveal key={item.question} delay={(index % 4) * 0.025}>
              <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 open:border-primary/20 open:shadow-md sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 marker:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl text-primary transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
