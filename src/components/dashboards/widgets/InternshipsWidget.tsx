// components/dashboards/widgets/InternshipsWidget.tsx
"use client";

import { Building2, MapPin, Clock, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";
// import { Button } from "@/components/ui/button";

interface InternshipsWidgetProps {
  data?: any;
}

export default function InternshipsWidget({ data }: InternshipsWidgetProps) {
  const internships = data || [];
  const router = useRouter();

  return (
    <BaseCard padding="lg">
      <CardHeader 
        title="Top Matched Internships" 
        icon={<span>🚀</span>}
        action={{ 
          label: "View All",
          onClick: () => router.push("/student/dashboard/internships")
        }}
      />

      {!internships || internships.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Building2 className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-[14px] font-bold text-slate-700 mb-1">No internships matched for you yet</p>
          <p className="text-[12px] text-slate-500 max-w-sm">
            Keep completing milestone goals and verifying new skills to let our AI match you with the best industry internships.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {internships.map((internship: any, index: number) => (
            <BaseCard key={index} hoverEffect={false} className="border-slate-200 hover:shadow-md">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-800 leading-tight mb-0.5">{internship.role}</h4>
                      <p className="text-[13px] text-slate-500 font-medium">{internship.company}</p>
                    </div>
                  </div>
                  
                  {/* Circular Match Badge */}
                  <div className={`w-11 h-11 rounded-full border-[3px] ${internship.ringColor} flex items-center justify-center shrink-0`}>
                    <span className={`text-[12px] font-bold ${internship.matchColor}`}>{internship.match}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded text-[11px] font-semibold text-slate-600">
                    <MapPin className="w-3 h-3 text-red-400" />
                    {internship.location}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded text-[11px] font-semibold text-slate-600">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {internship.duration}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded text-[11px] font-bold">
                    <IndianRupee className="w-3 h-3" />
                    {internship.stipend}
                  </div>
                </div>
              </div>
            </BaseCard>
          ))}
        </div>
      )}
    </BaseCard>
  );
}