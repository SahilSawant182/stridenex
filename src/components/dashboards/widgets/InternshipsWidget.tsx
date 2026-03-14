// components/dashboard/widgets/InternshipsWidget.tsx
"use client";

import { Building2, MapPin, Clock, IndianRupee } from "lucide-react";

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
    matchColor: "text-emerald-500",
    ringColor: "border-emerald-500"
  },
  {
    role: "ML Engineering Intern",
    company: "Razorpay",
    match: 76,
    location: "Bengaluru",
    duration: "6 mo",
    stipend: "₹40k/mo",
    matchColor: "text-orange-500",
    ringColor: "border-orange-500"
  },
  {
    role: "Analytics Intern",
    company: "Zepto",
    match: 84,
    location: "Mumbai",
    duration: "4 mo",
    stipend: "₹20k/mo",
    matchColor: "text-orange-500",
    ringColor: "border-orange-500"
  }
];

export default function InternshipsWidget({ data }: InternshipsWidgetProps) {
  const internships = data || defaultInternships;

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-50">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <span>🚀</span> Top Matched Internships
        </h3>
        <button className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors">
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {internships.map((internship: any, index: number) => (
          <div
            key={index}
            className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
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

            <div className="flex items-center gap-2 mt-auto">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-bold py-2.5 rounded-lg transition-colors shadow-sm">
                Apply
              </button>
              <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13px] font-bold rounded-lg transition-colors">
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}