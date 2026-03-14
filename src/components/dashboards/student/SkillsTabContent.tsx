// components/dashboard/student/SkillsTabContent.tsx
"use client";

import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { CheckCircle2, ShieldCheck, Award, FileText, Lock, Star } from "lucide-react";

// Types
interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

interface LedgerItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

interface SkillRow {
  id: string;
  name: string;
  category: string;
  categoryType: "Technical" | "Cognitive" | "Soft Skill";
  level: string;
  levelType: "Advanced" | "Intermediate" | "Beginner";
  evidence: number;
  endorsements: number;
  aiVerified: boolean;
  lastDemo: string;
}

// Data
const radarData: RadarData[] = [
  { subject: 'Python', A: 90, fullMark: 100 },
  { subject: 'ML', A: 70, fullMark: 100 },
  { subject: 'SQL', A: 85, fullMark: 100 },
  { subject: 'Comm', A: 65, fullMark: 100 },
  { subject: 'Problem', A: 80, fullMark: 100 },
  { subject: 'Data Viz', A: 75, fullMark: 100 },
];

const ledgerSummary: LedgerItem[] = [
  {
    label: 'Total Skills',
    value: 14,
    icon: <span className="w-5 h-5 flex items-center justify-center bg-red-50 text-red-500 rounded-full text-xs">🎯</span>,
    bgColor: 'bg-red-50',
    textColor: 'text-red-500'
  },
  {
    label: 'AI Verified',
    value: 6,
    icon: <span className="w-5 h-5 flex items-center justify-center bg-blue-50 text-blue-500 rounded-full text-xs">🤖</span>,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-500'
  },
  {
    label: 'Mentor Endorsed',
    value: 4,
    icon: <Award className="w-3 h-3" />,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-500'
  },
  {
    label: 'Industry Endorsed',
    value: 2,
    icon: <span className="w-5 h-5 flex items-center justify-center bg-purple-50 text-purple-500 rounded-full text-xs">🏭</span>,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-500'
  },
  {
    label: 'Evidence Items',
    value: 23,
    icon: <FileText className="w-3 h-3" />,
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-500'
  },
];

const skillRows: SkillRow[] = [
  { id: '1', name: 'Python', category: 'Technical', categoryType: 'Technical', level: 'Advanced', levelType: 'Advanced', evidence: 5, endorsements: 2, aiVerified: true, lastDemo: 'Feb 14' },
  { id: '2', name: 'SQL', category: 'Technical', categoryType: 'Technical', level: 'Advanced', levelType: 'Advanced', evidence: 4, endorsements: 2, aiVerified: true, lastDemo: 'Feb 10' },
  { id: '3', name: 'Problem Solving', category: 'Cognitive', categoryType: 'Cognitive', level: 'Advanced', levelType: 'Advanced', evidence: 6, endorsements: 1, aiVerified: true, lastDemo: 'Feb 18' },
  { id: '4', name: 'Machine Learning', category: 'Technical', categoryType: 'Technical', level: 'Intermediate', levelType: 'Intermediate', evidence: 3, endorsements: 1, aiVerified: true, lastDemo: 'Jan 30' },
  { id: '5', name: 'Communication', category: 'Soft Skill', categoryType: 'Soft Skill', level: 'Intermediate', levelType: 'Intermediate', evidence: 2, endorsements: 1, aiVerified: false, lastDemo: 'Jan 20' },
];

// Helper functions
const getCategoryStyle = (category: string) => {
  const styles = {
    Technical: "bg-slate-100 text-slate-600",
    Cognitive: "bg-purple-100 text-purple-600",
    "Soft Skill": "bg-emerald-100 text-emerald-600"
  };
  return styles[category as keyof typeof styles] || "bg-slate-100 text-slate-600";
};

const getLevelStyle = (level: string, type: string) => {
  if (type === 'Advanced') return "text-orange-500 font-medium text-xs";
  if (type === 'Intermediate') return "text-blue-500 font-medium text-xs";
  return "text-slate-500 font-medium text-xs";
};

export default function SkillsTabContent() {
  return (
    <div className="space-y-6">
      {/* Top Row: Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Skill Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200/60 p-6 flex flex-col shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-800 mb-4">Skill Radar</h3>
          <div className="flex-1 min-h-[220px] w-full relative -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Student" dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Ledger Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200/60 p-6 flex flex-col shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-800 mb-6">Ledger Summary</h3>
          <div className="flex-1 flex flex-col justify-between">
            {ledgerSummary.map((item, index) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`w-5 h-5 flex items-center justify-center ${item.bgColor} ${item.textColor} rounded-full text-xs`}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-5 h-5 flex items-center justify-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                Ledger Integrity
              </div>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-slate-800" /> Verified
              </span>
            </div>
          </div>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200/60 p-6 flex flex-col justify-center items-center shadow-sm relative overflow-hidden group"
        >
          <h3 className="text-sm font-bold text-slate-800 absolute top-6 left-6">Overall Score</h3>
          <div className="relative w-32 h-32 mt-4 hover:scale-105 transition-transform duration-300">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="none" />
              <motion.circle
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - 0.73) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="50" cy="50" r="40"
                className="stroke-orange-500"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="251.2"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800">73</span>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Overall</span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-6 group-hover:text-slate-700 transition-colors">
            Top 15% in cohort · 6 skills verified
          </p>
        </motion.div>
      </div>

      {/* Full Skill Ledger Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Full Skill Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['Skill', 'Category', 'Level', 'Evidence', 'Endorsements', 'AI Verified', 'Last Demo'].map((header) => (
                  <th key={header} className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {skillRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6 font-semibold text-slate-800">{row.name}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${getCategoryStyle(row.categoryType)}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getLevelStyle(row.level, row.levelType)}>{row.level}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{row.evidence} items</td>
                  <td className="py-4 px-6 text-slate-700 font-medium flex items-center gap-1 mt-1">
                    {row.endorsements} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </td>
                  <td className="py-4 px-6">
                    {row.aiVerified ? (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-bold flex items-center w-fit gap-1">
                        <ShieldCheck className="w-3 h-3" />Verified
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium text-[11px] px-2 py-1">Pending</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs font-medium">{row.lastDemo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}