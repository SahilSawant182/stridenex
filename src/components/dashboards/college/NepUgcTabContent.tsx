"use client";

import React, { useState } from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import Nep2020Content from "./Nep2020Content";
import Ugc2026Content from "./Ugc2026Content";
import GrievanceEngineContent from "./GrievanceEngineContent";
import PortfolioLockerContent from "./PortfolioLockerContent";
import AbcCreditsContent from "./AbcCreditsContent";
import EquityAuditContent from "./EquityAuditContent";
import ReportsTabContent from "./ReportsTabContent";
import { FileText, Target, CheckSquare, BarChart, Download, Users, Briefcase, Calendar } from "lucide-react";

// Icons used in sub nav
const DesktopNavTab = ({ label, icon, isActive, onClick, iconColor }: { label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void, iconColor: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold transition-all rounded-t-lg
      ${isActive 
        ? 'text-slate-800 bg-white border-x border-t border-slate-200 shadow-sm relative z-10' 
        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
      }
    `}
  >
    <span className={iconColor}>{icon}</span>
    {label}
  </button>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const complianceMetrics = [
  { id: 1, title: "Holistic Progress Cards", value: "62%", status: "Action Needed", statusColor: "text-amber-500", progress: 62, barColor: "bg-amber-500", icon: <FileText className="w-5 h-5 text-slate-400" /> },
  { id: 2, title: "ABC Credit Sync", value: "78%", status: "On Track", statusColor: "text-emerald-500", progress: 78, barColor: "bg-emerald-500", icon: <Target className="w-5 h-5 text-slate-400" /> },
  { id: 3, title: "Equity (EOC Setup)", value: "40%", status: "Critical", statusColor: "text-red-500", progress: 40, barColor: "bg-red-500", icon: <Users className="w-5 h-5 text-slate-400" /> },
  { id: 4, title: "UDISE+ Submission", value: "85%", status: "On Track", statusColor: "text-emerald-500", progress: 85, barColor: "bg-emerald-500", icon: <BarChart className="w-5 h-5 text-slate-400" /> },
  { id: 5, title: "OBE Mapping", value: "55%", status: "Action Needed", statusColor: "text-amber-500", progress: 55, barColor: "bg-amber-500", icon: <Target className="w-5 h-5 text-slate-400" /> },
  { id: 6, title: "Grievance SLA", value: "48%", status: "Action Needed", statusColor: "text-amber-500", progress: 48, barColor: "bg-amber-500", icon: <FileText className="w-5 h-5 text-slate-400" /> },
  { id: 7, title: "Faculty CPD Tracking", value: "74%", status: "On Track", statusColor: "text-emerald-500", progress: 74, barColor: "bg-emerald-500", icon: <Users className="w-5 h-5 text-slate-400" /> },
  { id: 8, title: "NAAC Portfolio", value: "68%", status: "Action Needed", statusColor: "text-amber-500", progress: 68, barColor: "bg-amber-500", icon: <Briefcase className="w-5 h-5 text-slate-400" /> },
];

const deadlines = [
  { date: "Mar 15", task: "NAAC Self-Study Report Submission", priority: "high", priorityColor: "bg-red-50 text-red-600 border-red-100" },
  { date: "Mar 20", task: "ABC Credit Data Upload — Q3", priority: "medium", priorityColor: "bg-amber-50 text-amber-600 border-amber-100" },
  { date: "Apr 1", task: "UGC Equity Annual Report", priority: "high", priorityColor: "bg-red-50 text-red-600 border-red-100" },
  { date: "Apr 15", task: "UDISE+ Data Finalization", priority: "medium", priorityColor: "bg-amber-50 text-amber-600 border-amber-100" },
];

const actions = [
  { task: "Submit ABC credit data to DigiLocker", status: "Pending", statusColor: "bg-slate-100 text-slate-600", icon: <Target className="w-4 h-4 text-blue-500" /> },
  { task: "Generate Holistic Progress Cards (batch)", status: "Ready", statusColor: "bg-emerald-50 text-emerald-600", icon: <FileText className="w-4 h-4 text-slate-400" /> },
  { task: "Resolve 2 grievance cases (SLA at risk)", status: "Urgent", statusColor: "bg-red-50 text-red-600", icon: <CheckSquare className="w-4 h-4 text-amber-500" /> },
  { task: "Upload SWAYAM certificates", status: "Ready", statusColor: "bg-emerald-50 text-emerald-600", icon: <Briefcase className="w-4 h-4 text-orange-400" /> },
];

export default function NepUgcTabContent() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="space-y-4">
      {/* Sub Navigation */}
      <div className="flex items-end border-b border-slate-200 overflow-x-auto hide-scrollbar pt-2 pl-2">
        <DesktopNavTab label="Dashboard" icon={<BarChart className="w-4 h-4"/>} isActive={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} iconColor={activeTab === "Dashboard" ? "text-blue-500" : "text-green-600"} />
        <DesktopNavTab label="NEP 2020" icon={<FileText className="w-4 h-4"/>} isActive={activeTab === "NEP 2020"} onClick={() => setActiveTab("NEP 2020")} iconColor="text-orange-500" />
        <DesktopNavTab label="UGC 2026" icon={<Target className="w-4 h-4"/>} isActive={activeTab === "UGC 2026"} onClick={() => setActiveTab("UGC 2026")} iconColor="text-red-400" />
        <DesktopNavTab label="Grievance Engine" icon={<CheckSquare className="w-4 h-4"/>} isActive={activeTab === "Grievance Engine"} onClick={() => setActiveTab("Grievance Engine")} iconColor="text-amber-500" />
        <DesktopNavTab label="Portfolio Locker" icon={<Briefcase className="w-4 h-4"/>} isActive={activeTab === "Portfolio Locker"} onClick={() => setActiveTab("Portfolio Locker")} iconColor="text-slate-500" />
        <DesktopNavTab label="ABC Credits" icon={<Users className="w-4 h-4"/>} isActive={activeTab === "ABC Credits"} onClick={() => setActiveTab("ABC Credits")} iconColor="text-green-500" />
        <DesktopNavTab label="Equity Audit" icon={<Target className="w-4 h-4"/>} isActive={activeTab === "Equity Audit"} onClick={() => setActiveTab("Equity Audit")} iconColor="text-emerald-500" />
        <DesktopNavTab label="Reports" icon={<BarChart className="w-4 h-4"/>} isActive={activeTab === "Reports"} onClick={() => setActiveTab("Reports")} iconColor="text-blue-500" />
      </div>

      {activeTab === "Dashboard" && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 -mt-[17px] relative z-0">
          
          {/* Main Top Banner Card */}
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#0d4f30] to-[#047857] text-white rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-md">
             {/* Decorative pattern behind text */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
             
             <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full mb-4 md:mb-0">
               {/* Donut Chart placeholder */}
               <div className="relative w-24 h-24 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#fbbf24" strokeWidth="3"
                      strokeDasharray="64, 100"
                    />
                     <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981" strokeWidth="3" strokeOpacity="0.3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white leading-none">64<span className="text-sm font-medium ml-0.5">%</span></span>
                    <span className="text-[10px] text-white/80 font-semibold tracking-wider">Overall</span>
                  </div>
               </div>
               
               <div className="text-center md:text-left">
                 <h2 className="text-2xl font-bold mb-2">Compliance Score</h2>
                 <p className="text-sm text-emerald-100 max-w-2xl mb-4 font-medium leading-relaxed">
                   Based on NEP 2020 mandates, UGC 2026 Equity Regulations, NAAC criteria, and UDISE+ requirements.
                 </p>
                 <div className="flex items-center justify-center md:justify-start gap-4">
                   <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded">
                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                     <span className="text-xs font-semibold">3 On Track</span>
                   </div>
                   <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded">
                     <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                     <span className="text-xs font-semibold">4 Action Needed</span>
                   </div>
                   <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"></div>
                     <span className="text-xs font-semibold">1 Critical Gap</span>
                   </div>
                 </div>
               </div>
             </div>

             <div className="flex gap-3 shrink-0 relative z-10">
               <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                 <Download className="w-4 h-4" />
                 Export
               </button>
               <button className="bg-white hover:bg-slate-50 text-blue-900 border border-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                 <FileText className="w-4 h-4" />
                 Submit to UGC
               </button>
             </div>
          </motion.div>

          {/* Grid of Metrics */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceMetrics.map((metric) => (
              <BaseCard key={metric.id} className="p-5 border-slate-200 shadow-sm flex flex-col border-b-2">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                    {metric.icon}
                  </div>
                  <span className={`text-[10px] font-bold ${metric.statusColor}`}>
                    {metric.status}
                  </span>
                </div>
                <div className="space-y-1 mb-4 flex-1">
                  <h3 className="text-2xl font-black text-slate-800">{metric.value}</h3>
                  <p className="text-xs font-semibold text-slate-500 leading-tight">{metric.title}</p>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full ${metric.barColor}`}
                     style={{ width: `${metric.progress}%` }}
                   />
                </div>
              </BaseCard>
            ))}
          </motion.div>

          {/* Bottom Two Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             {/* Left - Deadlines */}
             <motion.div variants={itemVariants}>
               <BaseCard className="p-5 border-slate-200 shadow-sm h-full">
                 <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                   <Calendar className="w-4 h-4 text-red-500" />
                   Upcoming Deadlines
                 </h3>
                 <div className="space-y-4">
                   {deadlines.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4">
                       <div className="w-14 text-sm font-black text-orange-600 shrink-0 text-right">
                         {item.date}
                       </div>
                       <div className="flex-1 text-sm font-bold text-slate-700">
                         {item.task}
                       </div>
                       <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border shrink-0 ${item.priorityColor}`}>
                         {item.priority}
                       </div>
                     </div>
                   ))}
                 </div>
               </BaseCard>
             </motion.div>
             
             {/* Right - Quick Actions */}
             <motion.div variants={itemVariants}>
               <BaseCard className="p-5 border-slate-200 shadow-sm h-full">
                 <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                   <Zap className="w-4 h-4 text-amber-500" fill="currentColor" />
                   Quick Actions
                 </h3>
                 <div className="space-y-4">
                   {actions.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                         {item.icon}
                       </div>
                       <div className="flex-1 text-sm font-bold text-slate-700">
                         {item.task}
                       </div>
                       <div className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 ${item.statusColor}`}>
                         {item.status}
                       </div>
                     </div>
                   ))}
                 </div>
               </BaseCard>
             </motion.div>
          </div>

        </motion.div>
      )}

      {activeTab === "NEP 2020" && <Nep2020Content />}
      {activeTab === "UGC 2026" && <Ugc2026Content />}
      {activeTab === "Grievance Engine" && <GrievanceEngineContent />}
      {activeTab === "Portfolio Locker" && <PortfolioLockerContent />}
      {activeTab === "ABC Credits" && <AbcCreditsContent />}
      {activeTab === "Equity Audit" && <EquityAuditContent />}
      {activeTab === "Reports" && <div className="mt-6"><ReportsTabContent /></div>}

      {/* Placeholders for other sub-tabs */}
      {activeTab !== "Dashboard" && activeTab !== "NEP 2020" && activeTab !== "UGC 2026" && activeTab !== "Grievance Engine" && activeTab !== "Portfolio Locker" && activeTab !== "ABC Credits" && activeTab !== "Equity Audit" && activeTab !== "Reports" && (
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 -mt-[17px] relative z-0 h-48 flex items-center justify-center"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-700">{activeTab} Section</h3>
            <p className="text-sm">Detailed views for {activeTab} will go here.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Added Zap missing icon
function Zap(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
