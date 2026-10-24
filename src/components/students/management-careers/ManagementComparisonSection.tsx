import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import { managementReasonsToSwitch, pathComparison } from "./data";

export default function ManagementComparisonSection() {
  return (
    <SectionWrapper bgColor="slate">
      <SectionHeader
        badge="Compare career paths"
        title="Explore the differences between career tracks"
        subtitle="Compare individual-contributor, management-transition, and management-track opportunities."
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
                  IC commodity path
                </th>
                <th scope="col" className="p-4 font-semibold">
                  IC → manager (5-year wait)
                </th>
                <th scope="col" className="p-4 font-semibold">
                  StrideNex management track
                </th>
              </tr>
            </thead>
            <tbody>
              {pathComparison.map(([factor, ic, transition, management]) => (
                <tr
                  key={factor}
                  className="border-t border-slate-100 odd:bg-white even:bg-slate-50/70"
                >
                  <th scope="row" className="p-4 font-semibold text-slate-800">
                    {factor}
                  </th>
                  <td className="p-4 leading-6 text-slate-600">{ic}</td>
                  <td className="p-4 leading-6 text-slate-600">{transition}</td>
                  <td className="p-4 font-semibold leading-6 text-primary">
                    {management}
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
            Why managers choose this path
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {managementReasonsToSwitch.map((reason) => (
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
