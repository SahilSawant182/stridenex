import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { comparisonRows } from "./data";

export default function ComparisonSection() {
  return (
    <SectionWrapper bgColor="slate">
      <SectionHeading
        eyebrow="The comparison"
        title="Capability assessment and credential filters measure different things"
        description="Compare how credential filters and capability assessments perform across key hiring measures."
      />

      <Reveal animation="right">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-primary text-white">
              <tr>
                <th scope="col" className="p-4 font-semibold">
                  Measure
                </th>
                <th scope="col" className="p-4 font-semibold">
                  Credential filter
                </th>
                <th scope="col" className="p-4 font-semibold">
                  Capability assessment
                </th>
              </tr>
            </thead>

            <tbody>
              {comparisonRows.map(([measure, credential, capability]) => (
                <tr
                  key={measure}
                  className="border-t border-slate-100 transition-colors odd:bg-white even:bg-slate-50/70 hover:bg-primary/[0.04]"
                >
                  <th scope="row" className="p-4 font-medium text-slate-700">
                    {measure}
                  </th>
                  <td className="p-4 text-slate-600">{credential}</td>
                  <td className="p-4 font-semibold text-accent-dark">
                    {capability}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}