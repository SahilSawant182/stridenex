import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { sixWeekProcess } from "./data";

export default function ManagementProcessSection() {
  return (
    <SectionWrapper bgColor="gradient">
      <SectionHeader
        badge="How it works"
        title="A six-week path to explore leadership roles"
        subtitle="See the six-week process for exploring management roles."
      />

      <ol className="mx-auto max-w-4xl space-y-4">
        {sixWeekProcess.map((week, index) => (
          <li
            key={week.week}
            className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[8rem_1fr] sm:gap-6 sm:p-6"
          >
            <div>
              <span className="inline-flex rounded-full bg-accent/10 px-3 py-1.5 text-sm font-extrabold text-orange-800">
                {week.week}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-950">
                {week.title}
              </h3>
              <p className="mt-2 leading-7 text-slate-600">
                {week.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SectionWrapper>
  );
}
