"use client";

import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

const pipelineColumns = [
  { id: "applied", title: "Applied", count: 247, color: "bg-slate-800" },
  { id: "ai_screened", title: "AI Screened", count: 162, color: "bg-blue-600" },
  { id: "hr_review", title: "HR Review", count: 68, color: "bg-indigo-500" },
  { id: "tech_round", title: "Tech Round", count: 28, color: "bg-orange-500" },
  { id: "final", title: "Final", count: 11, color: "bg-emerald-500" },
  { id: "offered", title: "Offered", count: 5, color: "bg-green-600" }
];

const candidates = {
  applied: [
    { id: 1, initials: "PS", bgColor: "bg-red-500", name: "Priya Sharma", college: "VJTI", skills: ["Python", "ML"], match: 94 },
    { id: 2, initials: "SP", bgColor: "bg-lime-500", name: "Sneha Patel", college: "COEP", skills: ["Python", "SQL"], match: 88 },
    { id: 3, initials: "AN", bgColor: "bg-green-500", name: "Arjun Nair", college: "IIT", skills: ["ML", "Python"], match: 82 },
    { id: 4, initials: "KR", bgColor: "bg-blue-500", name: "Kiran Reddy", college: "NIT", skills: ["Deep Learning"], match: 77 }
  ],
  ai_screened: [
    { id: 5, initials: "PS", bgColor: "bg-red-500", name: "Priya Sharma", college: "VJTI", skills: ["Python", "ML"], match: 92 },
    { id: 6, initials: "SP", bgColor: "bg-lime-500", name: "Sneha Patel", college: "COEP", skills: ["Python", "SQL"], match: 86 },
    { id: 7, initials: "AN", bgColor: "bg-green-500", name: "Arjun Nair", college: "IIT", skills: ["ML", "Python"], match: 80 }
  ],
  hr_review: [
    { id: 8, initials: "PS", bgColor: "bg-red-500", name: "Priya Sharma", college: "VJTI", skills: ["Python", "ML"], match: 90 },
    { id: 9, initials: "SP", bgColor: "bg-lime-500", name: "Sneha Patel", college: "COEP", skills: ["Python", "SQL"], match: 84 }
  ],
  tech_round: [
    { id: 10, initials: "PS", bgColor: "bg-red-500", name: "Priya Sharma", college: "VJTI", skills: ["Python", "ML"], match: 88 }
  ],
  final: [
    { id: 11, initials: "PS", bgColor: "bg-red-500", name: "Priya Sharma", college: "VJTI", skills: ["Python", "ML"], match: 86 }
  ],
  offered: [
    { id: 12, initials: "PS", bgColor: "bg-red-500", name: "Priya Sharma", college: "VJTI", skills: ["Python", "ML"], match: 84 }
  ]
};

export default function PipelineTabContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="h-full">
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar min-h-[600px]">
        {pipelineColumns.map((col) => (
          <motion.div variants={item} key={col.id} className="min-w-[280px] w-[280px] flex flex-col gap-3 bg-slate-50/50 rounded-2xl p-2 border border-slate-100">
            {/* Column Header */}
            <div className={`${col.color} text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-sm`}>
              <h3 className="font-bold text-sm tracking-wide">{col.title}</h3>
              <div className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {col.count}
              </div>
            </div>

            {/* Candidate Cards */}
            <div className="flex flex-col gap-3 overflow-y-auto hide-scrollbar pb-2">
              {candidates[col.id as keyof typeof candidates]?.map((candidate) => (
                <div key={candidate.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full ${candidate.bgColor} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                      {candidate.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{candidate.name}</h4>
                      <p className="text-xs text-slate-500">{candidate.college}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {candidate.match}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
