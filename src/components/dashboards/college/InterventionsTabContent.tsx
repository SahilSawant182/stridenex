"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { AlertTriangle, Clock, TrendingDown, Target, Zap } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const MetricCard = ({ title, value, icon, iconColor, borderColor }: { title: string, value: string | number, icon: React.ReactNode, iconColor: string, borderColor?: string }) => (
  <BaseCard className={`p-4 border-slate-200 relative overflow-hidden ${borderColor ? `border-t-4 ${borderColor}` : ''}`}>
      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-slate-800">{value}</h3>
      </div>
      <div className={`absolute top-4 right-4 w-7 h-7 rounded bg-slate-50 flex items-center justify-center border border-slate-100 ${iconColor}`}>
        {icon}
      </div>
  </BaseCard>
);

const criticalStudents = [
  { id: "RM", name: "Rahul Mehta", detail: "ECE 4th", statLabel: "Employability", statValue: "54", statColor: "text-red-600" },
  { id: "VS", name: "Vikram Singh", detail: "ME 4th", statLabel: "Employability", statValue: "42", statColor: "text-red-600" },
  { id: "PS", name: "Priya Sharma", detail: "CSE 3rd", statLabel: "Employability", statValue: "87", statColor: "text-emerald-600" },
  { id: "RM2", name: "Rahul Mehta", detail: "ECE 4th", statLabel: "Employability", statValue: "54", statColor: "text-red-600" },
  { id: "AK", name: "Aisha Khan", detail: "MBA 2nd", statLabel: "Employability", statValue: "73", statColor: "text-amber-600" },
];

const recommendations = [
  { icon: "📚", text: "Bulk-enroll CSE 3rd Year in Data bootcamp", subject: "84 students", impact: "Impact: +15 avg score", impactColor: "text-emerald-600" },
  { icon: "🤝", text: "Peer mentors for at-risk 4th year students", subject: "47 students", impact: "Impact: Improve retention", impactColor: "text-emerald-600" },
  { icon: "🏢", text: "Partner with 3 more companies for mini-internships", subject: "120 students", impact: "Impact: NEP compliance", impactColor: "text-emerald-600" },
  { icon: "🎤", text: "AI mock-interview sessions for Mech students", subject: "52 students", impact: "Impact: +20% offer rate", impactColor: "text-emerald-600" },
];

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-purple-600', 'bg-amber-600', 'bg-emerald-500', 
    'bg-blue-600', 'bg-emerald-400', 'bg-indigo-500', 'bg-pink-600'
  ];
  // Simple deterministic hash
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default function InterventionsTabContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      {/* Top Warning metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <MetricCard 
             title="Critical Risk <40" 
             value="47" 
             icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 18a2 2 0 110-4 2 2 0 010 4zm1-6h-2v-6h2v6z"/></svg>} 
             iconColor="text-red-500" 
             borderColor="border-t-red-500" 
           />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard 
             title="High Risk 40-55" 
             value="96" 
             icon={<AlertTriangle className="w-4 h-4" />} 
             iconColor="text-amber-500" 
             borderColor="border-t-amber-500" 
           />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard 
             title="Declining Progress" 
             value="128" 
             icon={<TrendingDown className="w-4 h-4" />} 
             iconColor="text-blue-400" 
             borderColor="border-t-blue-500" 
           />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard 
             title="Placement-Ready" 
             value="312" 
             icon={<Target className="w-4 h-4" />} 
             iconColor="text-emerald-500" 
             borderColor="border-t-emerald-500" 
           />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Critical Students */}
        <motion.div variants={itemVariants}>
          <BaseCard className="border-slate-200 p-5 h-full">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-2">
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 18a2 2 0 110-4 2 2 0 010 4zm1-6h-2v-6h2v6z"/></svg>
              Critical Students — Immediate Action
            </h3>

            <div className="divide-y divide-slate-100">
              {criticalStudents.map((student, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(student.name)}`}>
                        {student.id}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{student.name} <span className="font-medium text-slate-400 text-xs ml-1">{student.detail}</span></h4>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {student.statLabel}: <span className={student.statColor}>{student.statValue}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-[10px] font-bold tracking-wide border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-full transition-colors">
                      Assign Mentor
                    </button>
                    <button className="text-[10px] font-bold tracking-wide bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                       AI Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </motion.div>

        {/* Right Column - AI Recommendations */}
        <motion.div variants={itemVariants}>
          <BaseCard className="border-slate-200 p-5 h-full">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <Zap className="w-4 h-4 text-blue-500" fill="currentColor" />
              AI Recommendations
            </h3>

            <div className="space-y-3">
               {recommendations.map((rec, idx) => (
                 <div key={idx} className="border border-orange-200/60 bg-gradient-to-r from-orange-50/50 to-white hover:bg-orange-50/80 rounded-xl p-3 flex justify-between items-center transition-colors">
                    <div className="flex items-start gap-3">
                       <div className="text-xl shrink-0 mt-0.5 bg-white p-1 rounded-lg border border-orange-100 shadow-sm">{rec.icon}</div>
                       <div>
                         <h4 className="text-sm font-bold text-slate-800 leading-tight">{rec.text}</h4>
                         <div className="flex items-center gap-2 mt-1.5">
                           <span className="text-[10px] bg-white border border-slate-100 font-bold px-1.5 py-0.5 text-slate-500 rounded">{rec.subject}</span>
                           <span className={`text-[10px] font-bold ${rec.impactColor}`}>{rec.impact}</span>
                         </div>
                       </div>
                    </div>
                    <button className="shrink-0 ml-4 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-full shadow-sm transition-colors">
                      Execute
                    </button>
                 </div>
               ))}
            </div>
          </BaseCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
