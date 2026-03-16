"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { FileText, Calendar, Star, Send } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const MetricCard = ({ title, value, icon, colorClass, highlight }: { title: string, value: string | number, icon: React.ReactNode, colorClass: string, highlight?: boolean }) => (
  <BaseCard className={`p-4 border-slate-200 relative overflow-hidden ${highlight ? 'border-b-4 border-b-orange-500' : ''}`}>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-slate-800">{value}</h3>
      </div>
      <div className={`absolute top-4 right-4 w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-100`}>
        {icon}
      </div>
  </BaseCard>
);

const recruiters = [
  { name: "TCS", offers: 24, icon: "🏢" },
  { name: "Infosys", offers: 18, icon: "💻" },
  { name: "Razorpay", offers: 8, icon: "💳" },
  { name: "Zepto", offers: 5, icon: "⚡" },
  { name: "Google", offers: 3, icon: "🔍" },
];

const salaryBands = [
  { range: "<4 LPA", percentage: 12, color: "bg-red-500" },
  { range: "4-8 LPA", percentage: 38, color: "bg-orange-400" },
  { range: "8-15 LPA", percentage: 35, color: "bg-emerald-500" },
  { range: "15+ LPA", percentage: 15, color: "bg-blue-600" },
];

const funnelData = [
  { label: "Final Year Students", value: 680, width: "100%", color: "bg-slate-800" },
  { label: "Eligible (Score ≥60)", value: 521, width: "80%", color: "bg-blue-900" },
  { label: "Applications Sent", value: 847, width: "120%", color: "bg-blue-600" }, // Exceeds 100% intentionally, based on screenshot
  { label: "Shortlisted", value: 312, width: "50%", color: "bg-orange-500" },
  { label: "Interviews Done", value: 156, width: "25%", color: "bg-orange-400" },
  { label: "Offers Received", value: 98, width: "15%", color: "bg-emerald-500" },
  { label: "Accepted Offers", value: 89, width: "12%", color: "bg-emerald-600" },
];

export default function PlacementTabContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <MetricCard title="Applications Sent" value="847" icon={<Send className="w-4 h-4 text-slate-400" />} colorClass="slate" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard title="Shortlisted" value="312" icon={<Star className="w-4 h-4 text-orange-400" />} colorClass="orange" highlight />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard title="Interviews Scheduled" value="156" icon={<Calendar className="w-4 h-4 text-red-400" />} colorClass="red" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard title="Offers Received" value="98" icon={<span className="text-xl">🎉</span>} colorClass="emerald" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="lg:col-span-2">
           <BaseCard className="border-slate-200 p-5 h-full">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-green-600" />
              Placement Funnel 2024–25
            </h3>
            
            <div className="space-y-6">
              {funnelData.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <div className="w-48 text-sm font-semibold text-slate-700 shrink-0">
                    {stage.label}
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden flex-1 relative flex items-center">
                        <motion.div 
                          className={`h-2 rounded-full ${stage.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: stage.width }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                        />
                    </div>
                  </div>
                  <div className="w-8 text-right text-sm font-bold text-slate-800 shrink-0">
                    {stage.value}
                  </div>
                </div>
              ))}
            </div>
           </BaseCard>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 flex flex-col h-full">
          <BaseCard className="border-slate-200 p-5 flex-1">
             <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-wide">Top Recruiters</h3>
             <div className="space-y-5">
               {recruiters.map((recruiter, idx) => (
                 <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-slate-50 flex items-center justify-center rounded">
                        <span className="text-lg">{recruiter.icon}</span>
                     </div>
                     <span className="font-bold text-slate-800 text-sm">{recruiter.name}</span>
                   </div>
                   <span className="text-xs font-bold text-emerald-600">{recruiter.offers} offers</span>
                 </div>
               ))}
             </div>
          </BaseCard>
          
          <BaseCard className="border-slate-200 p-5">
             <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-wide">Salary Bands</h3>
             <div className="space-y-4">
                 {salaryBands.map((band, idx) => (
                   <div key={idx} className="flex items-center gap-4">
                      <div className="w-20 text-xs font-semibold text-slate-600">
                        {band.range}
                      </div>
                      <div className="flex-1 flex justify-end">
                         <div className={`h-1.5 rounded-full ${band.color}`} style={{ width: `${band.percentage}%` }} />
                      </div>
                      <div className={`w-8 text-right text-xs font-bold ${
                        band.percentage > 30 ? 'text-slate-800' : 'text-slate-500'
                      }`}>
                        {band.percentage}%
                      </div>
                   </div>
                 ))}
             </div>
             <div className="mt-5 pt-3 border-t border-slate-100 pb-1">
               <h2 className="text-2xl font-black text-slate-800">₹8.4 LPA</h2>
               <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Average CTC 2024–25</p>
             </div>
          </BaseCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Added missing icon definition for BarChart used in header
function BarChart(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}
