"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { FolderKanban, CheckCircle2, History } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const portfolios = [
  {
    title: "SWAYAM/MOOC Completions",
    naac: "NAAC: C3.1",
    items: "1,240",
    size: "4.2 GB",
    status: "Synced",
    icon: <span className="text-2xl">🎓</span>
  },
  {
    title: "Internship Reports",
    naac: "NAAC: C1.2",
    items: "847",
    size: "12.8 GB",
    status: "Synced",
    icon: <span className="text-2xl">🏭</span>
  },
  {
    title: "Research & Project Videos",
    naac: "NAAC: C3.2",
    items: "312",
    size: "28.4 GB",
    status: "Processing",
    icon: <span className="text-2xl">🔬</span>
  },
  {
    title: "Certifications & Awards",
    naac: "NAAC: C3.3",
    items: "2,104",
    size: "1.8 GB",
    status: "Synced",
    icon: <span className="text-2xl">📜</span>
  },
  {
    title: "Community Engagement Logs",
    naac: "NAAC: C2.6",
    items: "540",
    size: "3.1 GB",
    status: "Synced",
    icon: <span className="text-2xl">🤝</span>
  },
  {
    title: "Faculty CPD Evidence",
    naac: "NAAC: C4.1",
    items: "186",
    size: "6.7 GB",
    status: "Processing",
    icon: <span className="text-2xl">📋</span>
  }
];

export default function PortfolioLockerContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 mt-6">
      
      <motion.div variants={itemVariants}>
         <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 shadow-sm relative overflow-hidden items-center">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-300"></div>
            <FolderKanban className="w-5 h-5 text-slate-500 shrink-0" />
            <p className="text-sm font-medium text-slate-600 leading-snug">
               <strong className="text-slate-800">NEP Portfolio Locker</strong> — Auto-tags student and faculty uploads (project videos, SWAYAM/MOOC certificates, internship reports) to relevant NAAC/NBA criteria. All evidence is immutable once uploaded.
            </p>
         </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {portfolios.map((portfolio, idx) => (
            <motion.div variants={itemVariants} key={idx}>
               <BaseCard className="p-6 border-slate-200 shadow-sm flex flex-col h-full bg-white group hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start mb-6 w-full">
                     <div className="flex items-center gap-3">
                        {portfolio.icon}
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 leading-tight">{portfolio.title}</h3>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{portfolio.naac}</span>
                        </div>
                     </div>
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ml-2 shrink-0 ${
                       portfolio.status === 'Synced' 
                         ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                         : 'text-amber-600 bg-amber-50 border-amber-200'
                     }`}>
                       {portfolio.status}
                     </span>
                  </div>

                  <div className="flex justify-between items-end mb-6">
                     <div>
                       <span className="block text-xl font-black text-slate-800 leading-none mb-1">{portfolio.items}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items</span>
                     </div>
                     <div className="text-right">
                       <span className="block text-xl font-black text-blue-600 leading-none mb-1">{portfolio.size}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Used</span>
                     </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 pb-2">
                     <button className="w-full text-center text-sm font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg py-2 transition-colors hover:bg-slate-50 shadow-sm group-hover:border-slate-300">
                       Browse Evidence
                     </button>
                  </div>
               </BaseCard>
            </motion.div>
         ))}
      </div>

    </motion.div>
  );
}
