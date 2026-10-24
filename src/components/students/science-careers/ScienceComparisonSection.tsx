import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "../management-careers/Reveal";
import { scienceComparison, scienceReasonsToSwitch } from "./data";

export default function ScienceComparisonSection() {
  return (
    <SectionWrapper bgColor="slate">
      <SectionHeader
        badge="Compare research paths"
        title="Consider the research environment—not only the title"
        subtitle="Compare academic, industry, and applied research across key career factors."
      />

      <Reveal direction="right">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-primary text-white">
              <tr>
                <th scope="col" className="p-4 font-semibold">
                  Factor
                </th>
                <th scope="col" className="p-4 font-semibold">
                  PhD path
                </th>
                <th scope="col" className="p-4 font-semibold">
                  Commodity IC role
                </th>
                <th scope="col" className="p-4 font-semibold">
                  StrideNex research track
                </th>
              </tr>
            </thead>
            <tbody>
              {scienceComparison.map(([factor, academic, commodity, applied]) => (
                <tr
                  key={factor}
                  className="border-t border-slate-100 odd:bg-white even:bg-slate-50/70"
                >
                  <th scope="row" className="p-4 font-semibold text-slate-800">
                    {factor}
                  </th>
                  <td className="p-4 leading-6 text-slate-600">{academic}</td>
                  <td className="p-4 leading-6 text-slate-600">{commodity}</td>
                  <td className="p-4 font-semibold leading-6 text-primary">
                    {applied}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-7" direction="up">
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm sm:p-7">
          <h3 className="text-lg font-bold text-slate-950">
            Why scientists choose a research track
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scienceReasonsToSwitch.map((reason) => (
              <li key={reason} className="flex items-start gap-3 leading-6 text-slate-600">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
