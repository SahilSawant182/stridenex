"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Check, Hourglass, Target, Layers } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const pillars = [
  {
    title: "360° Holistic Progress Cards",
    docRef: "NEP 2020 §4.34",
    value: "62%",
    status: "Action Needed",
    statusColor: "text-amber-500",
    barColor: "bg-amber-500",
    progress: 62,
    desc: "Assess students across cognitive, affective & psychomotor domains with self/peer-assessment data.",
    doneItems: [
      "Self-assessment module live",
      "Faculty rubrics configured"
    ],
    pendingItems: [
      "Peer-assessment rollout",
      "Psychomotor domain tracking"
    ],
    icon: <span className="text-xl">📄</span>,
    borderColor: "border-t-amber-500"
  },
  {
    title: "Academic Bank of Credits (ABC)",
    docRef: "NEP 2020 §10.10",
    value: "78%",
    status: "On Track",
    statusColor: "text-emerald-500",
    barColor: "bg-emerald-500",
    progress: 78,
    desc: "Every student's credits synced to NAD repository. Enables multiple entry/exit options.",
    doneItems: [
      "ABC API v2.1 connected",
      "Auto-sync on completion",
      "Exit option tracking"
    ],
    pendingItems: [
      "Cross-institution import testing"
    ],
    icon: <span className="text-xl">🏛️</span>,
    borderColor: "border-t-blue-500" // the image shows blue border top on right card
  },
  {
    title: "Outcome-Based Education (OBE)",
    docRef: "UGC OBE 2022",
    value: "55%",
    status: "Action Needed",
    statusColor: "text-amber-500",
    barColor: "bg-amber-500",
    progress: 55,
    desc: "Every course mapped to Learning Outcomes; attainment levels reported continuously to NAAC.",
    doneItems: [
      "CSE dept course-LO mapping",
      "Attainment calculation engine"
    ],
    pendingItems: [
      "ECE/Mech/MBA mapping",
      "Continuous reporting dashboard"
    ],
    icon: <Target className="w-5 h-5 text-red-500" />,
    borderColor: "border-t-emerald-500" // bottom left image shows green border top
  },
  {
    title: "Equity & Inclusion (EOC)",
    docRef: "UGC 2026 Regs",
    value: "40%",
    status: "Critical Gap",
    statusColor: "text-red-500",
    barColor: "bg-red-500",
    progress: 40,
    desc: "Mandatory Equal Opportunity Centres, annual equity audits, 24/7 grievance redressal for all categories.",
    doneItems: [
      "Anti-discrimination policy uploaded"
    ],
    pendingItems: [
      "EOC committee formation",
      "Equity squad deployment",
      "24/7 helpline activation"
    ],
    icon: <span className="text-xl">♟️</span>,
    borderColor: "border-t-orange-400" // bottom right shows orange border top
  }
];

const alignments = [
  { dept: "Computer Science", mapped: "44/48", progress: 92, color: "bg-emerald-500" },
  { dept: "Electronics", mapped: "36/42", progress: 86, color: "bg-emerald-500" },
  { dept: "Mechanical", mapped: "28/38", progress: 74, color: "bg-amber-500" },
  { dept: "Civil", mapped: "22/35", progress: 63, color: "bg-red-500" },
  { dept: "MBA", mapped: "18/28", progress: 64, color: "bg-red-500" },
  { dept: "Chemical", mapped: "17/32", progress: 53, color: "bg-red-500" }
];

export default function Nep2020Content() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {pillars.map((pillar, idx) => (
           <motion.div variants={itemVariants} key={idx}>
             <BaseCard className={`p-6 border-slate-200 border-t-4 ${pillar.borderColor} shadow-sm flex flex-col h-full bg-white`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                       {pillar.icon}
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{pillar.title}</h3>
                       <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500">
                         {pillar.docRef}
                       </span>
                     </div>
                  </div>
                  <div className="text-right shrink-0">
                    <h2 className="text-2xl font-black">{pillar.value}</h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${pillar.statusColor}`}>
                      {pillar.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-500 mb-5">
                  {pillar.desc}
                </p>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
                   <div 
                     className={`h-full rounded-full ${pillar.barColor}`}
                     style={{ width: `${pillar.progress}%` }}
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 flex-1">
                  <div>
                    <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-2">
                       <Check className="w-3.5 h-3.5" /> DONE
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600 font-medium ml-1">
                      {pillar.doneItems.map((item, i) => (
                        <li key={i} className="text-xs sm:text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 mb-2">
                       <Hourglass className="w-3.5 h-3.5" /> PENDING
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600 font-medium ml-1">
                      {pillar.pendingItems.map((item, i) => (
                        <li key={i} className="text-xs sm:text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
                    Take Action &rarr;
                  </button>
                </div>
             </BaseCard>
           </motion.div>
         ))}
      </div>

      <motion.div variants={itemVariants}>
        <BaseCard className="p-6 border-slate-200 shadow-sm bg-white">
           <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
             NHEQF Curriculum Alignment by Department
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
             {alignments.map((align, idx) => (
               <div key={idx}>
                  <div className="flex justify-between items-end mb-2">
                     <div>
                       <h4 className="text-sm font-bold text-slate-800 leading-none mb-1">{align.dept}</h4>
                       <span className="text-xs font-semibold text-slate-500">{align.mapped} courses mapped</span>
                     </div>
                     <span className={`text-sm font-black ${align.color.replace('bg-', 'text-')}`}>{align.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full ${align.color}`}
                       style={{ width: `${align.progress}%` }}
                     />
                  </div>
               </div>
             ))}
           </div>
        </BaseCard>
      </motion.div>
    </motion.div>
  );
}
