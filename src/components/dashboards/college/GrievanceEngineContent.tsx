"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { AlertCircle, Clock, CheckCircle2, TrendingUp, Lock, ArrowRight, ShieldCheck } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const topStats = [
  { label: "Open Grievances", value: "4", icon: <span className="text-xl">📣</span>, color: "text-red-500 bg-red-50 border-red-200" },
  { label: "SLA at Risk (24hr)", value: "2", icon: <Clock className="w-5 h-5 text-amber-500" />, color: "text-amber-500 bg-amber-50 border-amber-200" },
  { label: "Resolved This Month", value: "18", icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, color: "text-emerald-500 bg-emerald-50 border-emerald-200" },
  { label: "Resolution Rate", value: "91%", icon: <TrendingUp className="w-5 h-5 text-blue-500" />, color: "text-blue-500 bg-blue-50 border-blue-200" }
];

const activeGrievances = [
  { id: "GRV-001", type: "Discrimination", status: "Under Review", statusColor: "text-amber-600 bg-amber-50", risk: "SLA at risk", filed: "Feb 20", elapsed: "3d elapsed", elapsedColor: "text-red-600 bg-red-50" },
  { id: "GRV-002", type: "Hostel Segregation", status: "Resolved", statusColor: "text-emerald-600 bg-emerald-50", risk: null, filed: "Feb 18", elapsed: "14d elapsed", elapsedColor: "text-emerald-600 bg-emerald-50" },
  { id: "GRV-003", type: "Academic Bias", status: "Escalated", statusColor: "text-red-600 bg-red-50", risk: null, filed: "Feb 15", elapsed: "18d elapsed", elapsedColor: "text-amber-600 bg-amber-50" },
  { id: "GRV-004", type: "Infrastructure Access", status: "Pending 24hr", statusColor: "text-amber-600 bg-amber-50", risk: "SLA at risk", filed: "Feb 22", elapsed: "1d elapsed", elapsedColor: "text-red-600 bg-red-50" },
];

export default function GrievanceEngineContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 mt-6">
      
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topStats.map((stat, idx) => (
          <motion.div variants={itemVariants} key={idx}>
            <BaseCard className={`p-5 shadow-sm border ${stat.color} flex flex-col justify-between h-full bg-white`}>
               <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2 leading-tight">
                 {stat.label}
               </h3>
               <div className="flex justify-between items-end mt-auto">
                 <span className="text-3xl font-black text-slate-800 leading-none">{stat.value}</span>
                 <div className={`p-1.5 rounded-lg bg-white/50 backdrop-blur-sm self-start shrink-0 pointer-events-none`}>
                   {stat.icon}
                 </div>
               </div>
            </BaseCard>
          </motion.div>
        ))}
      </div>

      {/* Active Grievances Tracker */}
      <motion.div variants={itemVariants}>
         <BaseCard className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden p-0">
             <h3 className="text-sm font-bold text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2">
                Active Grievances — Live Tracker
             </h3>
             <div className="p-5 space-y-4">
                {activeGrievances.map((grv, idx) => (
                   <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors gap-4">
                      
                      {/* Left: Info & Tags */}
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-400">{grv.id}</span>
                            <span className="text-sm font-bold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-md">{grv.type}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-current/10 ${grv.statusColor}`}>
                             {grv.status}
                           </span>
                           {grv.risk && (
                             <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100">
                               <AlertCircle className="w-3 h-3" /> {grv.risk}
                             </span>
                           )}
                         </div>
                      </div>

                      {/* Right: Actions & Timing */}
                      <div className="flex flex-col items-end gap-3 justify-between h-full">
                         <div className="flex items-center gap-3 text-xs font-semibold">
                            <span className="text-slate-400">Filed: {grv.filed}</span>
                            <span className={`px-2 py-0.5 rounded ${grv.elapsedColor}`}>{grv.elapsed}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
                              View Details
                            </button>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                              Trigger Meeting
                            </button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
         </BaseCard>
      </motion.div>

      {/* Bottom Grid: Helpline & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         <motion.div variants={itemVariants}>
            <BaseCard className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden p-0 h-full">
               <h3 className="text-sm font-bold text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2">
                 <span className="text-lg leading-none">📞</span> 24/7 Anonymous Helpline
               </h3>
               
               <div className="p-5 space-y-5">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="text-lg font-black text-slate-800 mb-1 tracking-tight">Helpline: 1800-STIDNX <span className="text-sm font-bold text-slate-500">(toll-free)</span></h4>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      Anonymous reporting · Digital chain of custody · Auto-assigns to Equity Committee within 24hr
                    </p>
                  </div>

                  <ul className="space-y-4 px-2">
                     <li className="flex gap-4 items-start">
                        <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-bold text-slate-800">Anonymity Layer</h5>
                          <p className="text-xs font-medium text-slate-500">Complainant identity masked from investigators</p>
                        </div>
                     </li>
                     <li className="flex gap-4 items-start">
                        <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-bold text-slate-800">24hr Auto-Trigger</h5>
                          <p className="text-xs font-medium text-slate-500">Committee meeting invite sent automatically</p>
                        </div>
                     </li>
                     <li className="flex gap-4 items-start">
                        <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-bold text-slate-800">Evidence Upload</h5>
                          <p className="text-xs font-medium text-slate-500">Time-stamped photos, screenshots, documents</p>
                        </div>
                     </li>
                  </ul>
               </div>
            </BaseCard>
         </motion.div>

         <motion.div variants={itemVariants}>
            <BaseCard className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden p-0 h-full flex flex-col">
               <h3 className="text-sm font-bold text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2 mb-auto">
                 <BarChartIcon className="w-4 h-4 text-emerald-500" /> Grievance Analytics
               </h3>
               
               <div className="p-8 flex flex-col items-center justify-center flex-1 space-y-6">
                  {/* Generic Bar Chart Placeholder visual */}
                  <div className="flex items-end justify-between w-full h-32 gap-2 border-b-2 border-slate-100 px-2 pb-2">
                     {[30, 45, 25, 60, 80, 40, 35].map((h, i) => (
                       <div key={i} className="w-full bg-orange-400 hover:bg-orange-500 rounded-t-sm transition-colors cursor-crosshair" style={{ height: `${h}%` }}></div>
                     ))}
                  </div>

                  <div className="w-full space-y-3">
                     {[
                       { label: 'Discrimination', value: '32%' },
                       { label: 'Academic Bias', value: '24%' },
                       { label: 'Infrastructure', value: '20%' },
                       { label: 'Hostel', value: '16%' }
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center text-sm">
                         <span className="font-semibold text-slate-700">{item.label}</span>
                         <div className="flex items-center gap-3 w-1/2">
                           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-orange-500 rounded-full" style={{ width: item.value }}></div>
                           </div>
                           <span className="font-bold text-slate-500 text-xs w-8 text-right">{item.value}</span>
                         </div>
                       </div>
                     ))}
                  </div>
               </div>
            </BaseCard>
         </motion.div>

      </div>
    </motion.div>
  );
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  )
}
