import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { faqs } from "./data";

export default function FaqSection() {
  return (
    <SectionWrapper bgColor="slate">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Questions"
          title="Assessment questions, answered"
        />

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.03}>
              <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 open:border-primary/20 open:shadow-md sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 marker:hidden">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl text-primary transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}