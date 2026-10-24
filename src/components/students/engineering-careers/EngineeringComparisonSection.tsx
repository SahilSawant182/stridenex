import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "../management-careers/Reveal";
import { engineeringComparison, engineeringReasonsToSwitch } from "./data";

export default function EngineeringComparisonSection() {
  return (
    <SectionWrapper bgColor="slate">
      <SectionHeader
        badge="Compare career paths"
        title="Look beyond the job title"
        subtitle="Compare service-company, campus-portal, and problem-led engineering opportunities."
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
                  Service company
                </th>
                <th scope="col" className="p-4 font-semibold">
                  Campus job portal
                </th>
                <th scope="col" className="p-4 font-semibold">
                  StrideNex scale
                </th>
              </tr>
            </thead>
            <tbody>
              {engineeringComparison.map(([factor, service, portal, pathway]) => (
                <tr
                  key={factor}
                  className="border-t border-slate-100 odd:bg-white even:bg-slate-50/70"
                >
                  <th scope="row" className="p-4 font-semibold text-slate-800">
                    {factor}
                  </th>
                  <td className="p-4 leading-6 text-slate-600">{service}</td>
                  <td className="p-4 leading-6 text-slate-600">{portal}</td>
                  <td className="p-4 font-semibold leading-6 text-primary">
                    {pathway}
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
            Why engineers choose this path
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {engineeringReasonsToSwitch.map((reason) => (
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
