"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Download, FileText, Settings, BarChart, FileJson } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const reports = [
  {
    target: "NEP 2020 Full Compliance Report",
    desc: "HPC, ABC, OBE, Equity — all pillars with evidence",
    formats: ["PDF", "Word"],
    status: "Data Ready",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    action: "Download",
    icon: <BarChart className="w-5 h-5 text-emerald-500" />
  },
  {
    target: "UGC 2026 Equity Readiness Report",
    desc: "EOC status, grievance SLA, equity audit data",
    formats: ["PDF"],
    status: "Data Pending",
    statusColor: "bg-amber-50 text-amber-600 border-amber-100",
    action: "Configure",
    icon: <span className="text-xl">⚖️</span>
  },
  {
    target: "NAAC Self-Study Report Pack",
    desc: "Pre-formatted as per NAAC 2024 SSR template",
    formats: ["Word", "PDF"],
    status: "Data Ready",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    action: "Download",
    icon: <FileText className="w-5 h-5 text-amber-600" />
  },
  {
    target: "ABC Credit Summary Report",
    desc: "Student-wise credit accumulation for NAD submission",
    formats: ["Excel", "CSV"],
    status: "Data Ready",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    action: "Download",
    icon: <span className="text-xl">🏛️</span>
  },
  {
    target: "OBE Attainment Analytics",
    desc: "Course-LO mapping, attainment levels by department",
    formats: ["Excel"],
    status: "Data Pending",
    statusColor: "bg-amber-50 text-amber-600 border-amber-100",
    action: "Configure",
    icon: <BarChart className="w-5 h-5 text-red-500" />
  },
  {
    target: "Holistic Progress Card Batch",
    desc: "Generate HPC for all students — print-ready format",
    formats: ["PDF (bulk)"],
    status: "Data Ready",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    action: "Download",
    icon: <span className="text-xl">🎓</span>
  },
  {
    target: "Industry Collaboration MoU Report",
    desc: "Active partnerships, intern outcomes, co-curriculum",
    formats: ["PDF"],
    status: "Data Ready",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    action: "Download",
    icon: <span className="text-xl">🤝</span>
  },
  {
    target: "Grievance Resolution Report",
    desc: "Monthly stats, SLA compliance, anonymised case data",
    formats: ["PDF"],
    status: "Data Ready",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    action: "Download",
    icon: <span className="text-xl">📢</span>
  }
];

export default function ReportsTabContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      <BaseCard className="p-6 border-slate-200 shadow-sm">
         <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
           <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2zm0 8h2v2h-2z"/>
           </svg>
           Generate Compliance Reports
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {reports.map((report, idx) => (
             <motion.div variants={itemVariants} key={idx} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                    {report.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1">{report.target}</h3>
                    <p className="text-xs font-medium text-slate-500">{report.desc}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between pl-14">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-400">
                       {report.formats.join(' / ')}
                     </span>
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border ${report.statusColor}`}>
                       {report.status === "Data Ready" && <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                       {report.status === "Data Pending" && <span className="text-amber-500">⏳</span>}
                       {report.status}
                     </span>
                  </div>

                  {report.action === "Download" ? (
                    <button className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm transition-colors uppercase tracking-wider">
                      <Download className="w-3 h-3" /> Download
                    </button>
                  ) : (
                    <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm transition-colors uppercase tracking-wider">
                      Configure
                    </button>
                  )}
                </div>
             </motion.div>
           ))}
         </div>
      </BaseCard>
    </motion.div>
  );
}
