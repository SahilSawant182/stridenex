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

const defaultInternships = [
  {
    role: "Data Science Intern",
    company: "TCS iON",
    match: 91,
    location: "Pune/Hybrid",
    duration: "3 mo",
    stipend: "₹15k/mo",
    matchColor: "text-emerald-600",
    ringColor: "border-emerald-500",
    bgColor: "bg-emerald-50"
  },
  {
    role: "ML Engineering Intern",
    company: "Razorpay",
    match: 76,
    location: "Bengaluru",
    duration: "6 mo",
    stipend: "₹40k/mo",
    matchColor: "text-orange-600",
    ringColor: "border-orange-500",
    bgColor: "bg-orange-50"
  },
  {
    role: "Analytics Intern",
    company: "Zepto",
    match: 84,
    location: "Mumbai",
    duration: "4 mo",
    stipend: "₹20k/mo",
    matchColor: "text-orange-600",
    ringColor: "border-orange-500",
    bgColor: "bg-orange-50"
  }
];

export default function InternshipsWidget({ data }: InternshipsWidgetProps) {
  const internships = data || defaultInternships;
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

              {/* Apply and Save buttons hidden temporarily */}
              {/* <div className="flex items-center gap-2 mt-auto">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-bold py-2.5 rounded-lg transition-colors shadow-sm">
                  Apply
                </Button>
                <Button variant="outline" className="px-4 py-2.5 border-slate-200 text-slate-600 hover:bg-slate-50 text-[13px] font-bold rounded-lg">
                  Save
                </Button>
              </div> */}
            </div>
          </BaseCard>
        ))}
      </div>
    </BaseCard>
  );
}