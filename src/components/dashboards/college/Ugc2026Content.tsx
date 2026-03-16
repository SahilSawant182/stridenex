"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Scale, Users, Eye, Clock, AlertOctagon, XCircle, ShieldOff, AlertTriangle, Check, Hourglass } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const setupItems = [
  {
    title: "Equal Opportunity Centre (EOC)",
    icon: <span className="text-xl">🏛️</span>,
    status: "Not Established",
    statusColor: "text-red-500 bg-red-50",
    bullets: [
      "Central hub for equity policies",
      "Financial support for marginalised students",
      "Dedicated EOC officer appointment",
      "EOC committee with VC representation"
    ]
  },
  {
    title: "Equity Committee",
    icon: <Users className="w-5 h-5 text-blue-500" />,
    status: "Partially Done",
    statusColor: "text-amber-500 bg-amber-50",
    bullets: [
      "Chaired by Vice-Chancellor / Principal",
      "SC/ST/OBC/Women/PwD representatives",
      "Monthly meeting cadence",
      "Grievance escalation authority"
    ]
  },
  {
    title: "Equity Squads & Ambassadors",
    icon: <Eye className="w-5 h-5 text-amber-700" />,
    status: "Not Started",
    statusColor: "text-red-500 bg-red-50",
    bullets: [
      "Mobile squads: hostels, labs, canteen",
      "Dept ambassadors in every department",
      "Real-time violation reporting",
      "Time-stamped evidence upload"
    ]
  }
];

const slas = [
  {
    time: "24 Hours",
    desc: "Equity Committee must convene after complaint filed",
    subDesc: "Auto-triggered via Grievance Engine",
    status: "Configured",
    statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200"
  },
  {
    time: "15 Working Days",
    desc: "Full investigation report must be submitted",
    subDesc: "Tracked in system dashboard",
    status: "Configure",
    statusColor: "text-amber-600 bg-amber-50 border-amber-200"
  },
  {
    time: "7 Working Days",
    desc: "Head of Institution must initiate action on report",
    subDesc: "Tracked in system dashboard",
    status: "Configure",
    statusColor: "text-amber-600 bg-amber-50 border-amber-200"
  },
  {
    time: "30 Days",
    desc: "Appeal window with independent Ombudsperson",
    subDesc: "Displayed in student portal",
    status: "Configured",
    statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200"
  }
];

const penalties = [
  {
    title: "Debarment from UGC Grants",
    desc: "All central and state UGC funding schemes suspended immediately",
    icon: <ShieldOff className="w-5 h-5 text-red-500" />
  },
  {
    title: "Degree-Granting Suspension",
    desc: "Right to award degrees or run ODL/online programs revoked",
    icon: <span className="text-xl">📜</span>
  },
  {
    title: "2(f)/12B Recognition Removal",
    desc: "Institution delisted from recognised HEI list under UGC Act",
    icon: <XCircle className="w-5 h-5 text-red-500" />
  },
  {
    title: "Legal Liability",
    desc: "Individual officers and institution face civil/criminal action",
    icon: <span className="text-xl">💼</span>
  }
];

export default function Ugc2026Content() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 mt-6">
      
      {/* Warning Banner */}
      <motion.div variants={itemVariants}>
         <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
            <Scale className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
               <h3 className="text-sm font-bold text-slate-800 mb-1 leading-none tracking-wide">
                 Legal Status: UGC 2026 Equity Regulations — Currently Stayed by Supreme Court
               </h3>
               <p className="text-sm text-slate-600 font-medium leading-snug">
                 Stayed on Jan 29, 2026 (concerns over vague definitions). 2012 Regulations remain in force. Planning ahead ensures no disruption when the final verdict arrives.
               </p>
            </div>
         </div>
      </motion.div>

      {/* Setup Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {setupItems.map((item, idx) => (
            <motion.div variants={itemVariants} key={idx}>
               <BaseCard className="p-6 border-slate-200 shadow-sm flex flex-col h-full bg-white">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                       {item.icon}
                     </div>
                     <h3 className="text-base font-bold text-slate-800 tracking-tight leading-none">{item.title}</h3>
                  </div>
                  <div className="ml-11 mb-6">
                     <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${item.statusColor}`}>
                       {item.status}
                     </span>
                  </div>

                  <ul className="space-y-3 list-none text-slate-600 font-medium mb-8 flex-1">
                     {item.bullets.map((bullet, i) => (
                       <li key={i} className="text-sm flex items-start gap-2">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                          {bullet}
                       </li>
                     ))}
                  </ul>

                  <div className="mt-auto">
                     <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-sm">
                       Setup Now
                     </button>
                  </div>
               </BaseCard>
            </motion.div>
         ))}
      </div>

      {/* SLA Timelines */}
      <motion.div variants={itemVariants}>
         <BaseCard className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden p-0">
             <h3 className="text-sm font-bold text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" /> Mandatory SLA Timelines
             </h3>
             <div className="p-5 bg-slate-50/50">
               <p className="text-sm font-medium text-slate-500 mb-6 max-w-4xl">
                 The UGC 2026 rules introduced strict SLA-style timelines. Non-compliance can result in debarment from UGC grants, suspension of degree rights, and removal from 2(f)/12B recognition.
               </p>
               
               <div className="space-y-6">
                  {slas.map((sla, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                       <div className="flex items-start gap-4 sm:gap-6">
                          <div className="w-24 sm:w-32 text-orange-500 font-black text-lg leading-tight tracking-tight shrink-0">
                            {sla.time}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 leading-snug">{sla.desc}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">{sla.subDesc}</p>
                          </div>
                       </div>
                       <div className="sm:ml-4 shrink-0">
                          <button className={`px-3 py-1 text-xs font-bold rounded-md border flex items-center gap-1.5 transition-colors uppercase tracking-wider ${sla.statusColor} ${sla.status === 'Configure' ? 'hover:bg-amber-100 cursor-pointer' : 'cursor-default'}`}>
                             {sla.status === 'Configured' && <Check className="w-3.5 h-3.5" />}
                             {sla.status === 'Configure' && <Hourglass className="w-3.5 h-3.5" />}
                             {sla.status}
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
         </BaseCard>
      </motion.div>

      {/* Penalties Grid */}
      <motion.div variants={itemVariants}>
         <BaseCard className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden p-0">
            <h3 className="text-sm font-bold text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-500" /> Penalties for Non-Compliance
            </h3>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {penalties.map((penalty, idx) => (
                   <div key={idx} className="bg-red-50/50 border border-red-100 rounded-lg p-4 flex gap-4 transition-colors hover:bg-red-50">
                      <div className="shrink-0 mt-0.5">
                        {penalty.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-red-800 mb-1">{penalty.title}</h4>
                        <p className="text-xs font-medium text-red-600/80 leading-snug">{penalty.desc}</p>
                      </div>
                   </div>
                ))}
            </div>
         </BaseCard>
      </motion.div>
    </motion.div>
  );
}
