"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { BarChart, AlertTriangle, CheckCircle2 } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const topStats = [
  { label: "SC Students", value: "12%", target: "Target: 15%", status: "Below target", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-amber-500", targetColor: "text-slate-500", mt: "mt-1" },
  { label: "ST Students", value: "6.6%", target: "Target: 7.5%", status: "Below target", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-amber-500", targetColor: "text-slate-500", mt: "mt-1" },
  { label: "OBC Students", value: "30%", target: "Target: 27%", status: "Met target", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-emerald-500", targetColor: "text-slate-500", mt: "mt-1" },
  { label: "PwD Students", value: "1.6%", target: "Target: 3%", status: "Below target", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-amber-500", targetColor: "text-slate-500", mt: "mt-1" }
];

const indicators = [
  { label: "Admission Equity", progress: 68, color: "bg-orange-500", barColor: "bg-orange-500" },
  { label: "Hostel Allocation Fairness", progress: 82, color: "bg-emerald-500", barColor: "bg-emerald-500" },
  { label: "Scholarship Distribution", progress: 74, color: "bg-blue-600", barColor: "bg-blue-600" },
  { label: "Faculty Representation", progress: 45, color: "bg-red-500", barColor: "bg-red-500" },
  { label: "Grievance Resolution Equity", progress: 58, color: "bg-orange-500", barColor: "bg-orange-500" },
];

export default function EquityAuditContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 mt-6">
      
      <motion.div variants={itemVariants}>
         <BaseCard className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden p-0">
             <h3 className="text-sm font-bold text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-emerald-500" /> Annual Equity Audit — 2024-25
             </h3>
             
             <div className="p-6 space-y-8">
                {/* Top Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {topStats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center flex flex-col items-center justify-center">
                       <span className="block text-3xl font-black text-red-500 leading-none mb-2 tracking-tight">
                         {stat.value}
                       </span>
                       <h4 className="text-sm font-bold text-slate-800 leading-tight mb-2">{stat.label}</h4>
                       
                       <p className={`text-[10px] font-bold uppercase tracking-wider ${stat.targetColor}`}>
                         {stat.target}
                       </p>
                       <span className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${stat.color}`}>
                         {stat.icon} {stat.status}
                       </span>
                    </div>
                  ))}
                </div>

                {/* Indicators List */}
                <div className="space-y-6 mt-8 max-w-4xl">
                   {indicators.map((ind, idx) => (
                     <div key={idx}>
                        <div className="flex justify-between items-end mb-2">
                           <h4 className="text-sm font-bold text-slate-800 leading-none">{ind.label}</h4>
                           <span className={`text-sm font-black ${ind.color.replace('bg-', 'text-')}`}>{ind.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                           <div 
                             className={`h-full rounded-full transition-all duration-1000 ${ind.barColor}`}
                             style={{ width: `${ind.progress}%` }}
                           />
                        </div>
                     </div>
                   ))}
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-slate-100 flex gap-3">
                   <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm shadow-sm">
                     Generate Equity Report for UGC
                   </button>
                   <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-lg transition-colors text-sm shadow-sm">
                     Export to Excel
                   </button>
                </div>
             </div>
         </BaseCard>
      </motion.div>

    </motion.div>
  );
}
