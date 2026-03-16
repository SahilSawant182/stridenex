"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Link2, Zap, AlertTriangle, CheckCircle2, RefreshCcw } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const topStats = [
  { label: "Students on ABC Portal", value: "2,341", icon: <span className="text-xl">🏛️</span>, color: "text-blue-500 bg-blue-50 border-blue-200" },
  { label: "Credits Registered", value: "18,420", icon: <span className="text-xl">📊</span>, color: "text-orange-500 bg-orange-50 border-orange-200" },
  { label: "Sync Success Rate", value: "98.2%", icon: <RefreshCcw className="w-5 h-5 text-emerald-500" />, color: "text-emerald-500 bg-emerald-50 border-emerald-200" }
];

const departments = [
  { name: "Computer Science", registered: "420", credits: "8,420", exit: "12 students", sync: "Synced", syncColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "Electronics", registered: "380", credits: "7,600", exit: "8 students", sync: "Synced", syncColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "Mechanical", registered: "340", credits: "6,120", exit: "5 students", sync: "Synced", syncColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "MBA", registered: "180", credits: "3,240", exit: "3 students", sync: "Issues", syncColor: "text-amber-600 bg-amber-50 border-amber-200" },
  { name: "Civil", registered: "290", credits: "4,350", exit: "2 students", sync: "Synced", syncColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
];

export default function AbcCreditsContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 mt-6">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Integration Status & Table */}
      <motion.div variants={itemVariants}>
         <BaseCard className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden p-0">
             <h3 className="text-sm font-bold text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-slate-500" /> ABC / DigiLocker Integration Status
             </h3>
             
             <div className="p-5">
                {/* Status Banners */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                   <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col justify-center">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 mb-1">
                        <CheckCircle2 className="w-4 h-4" /> API Connected
                      </h4>
                      <p className="text-xs font-medium text-emerald-600/80">NAD API v2.1 — Last sync: 2 hours ago</p>
                   </div>
                   
                   <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col justify-center">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-1">
                         Auto-Sync: ON
                      </h4>
                      <p className="text-xs font-medium text-blue-600/80">Triggers on course completion + grade upload</p>
                   </div>

                   <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col justify-center">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-1">
                        41 Pending
                      </h4>
                      <p className="text-xs font-medium text-amber-700/80">Failed sync — Aadhaar mismatch</p>
                   </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                        <th className="px-5 py-4">Department</th>
                        <th className="px-5 py-4 text-center">Registered</th>
                        <th className="px-5 py-4 text-center">Credits Logged</th>
                        <th className="px-5 py-4 text-center">Multiple Exit</th>
                        <th className="px-5 py-4 text-right">Sync</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                      {departments.map((dept, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-4">{dept.name}</td>
                          <td className="px-5 py-4 text-center">{dept.registered}</td>
                          <td className="px-5 py-4 text-center text-blue-600 font-bold">{dept.credits}</td>
                          <td className="px-5 py-4 text-center text-xs font-medium text-slate-500">{dept.exit}</td>
                          <td className="px-5 py-4 text-right flex justify-end">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${dept.syncColor}`}>
                              {dept.sync === 'Synced' && <CheckCircle2 className="w-3 h-3" />}
                              {dept.sync === 'Issues' && <AlertTriangle className="w-3 h-3" />}
                              {dept.sync}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
         </BaseCard>
      </motion.div>

    </motion.div>
  );
}
