"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertCircle, TrendingUp, Building2, BrainCircuit, Target, ArrowRight } from "lucide-react";

export default function PathTabContent() {
  const roadmap = [
    { title: "Python Fundamentals", subtitle: "Complete Python Basics course", date: "Jan 12", status: "completed" },
    { title: "Data Structures & Algo", subtitle: "DSA + 30 LeetCode problems", date: "Jan 28", status: "completed" },
    { title: "SQL & Database Design", subtitle: "Advanced SQL + 2 projects", date: "Feb 5", status: "completed" },
    { title: "Machine Learning Basics", subtitle: "Sklearn, Pandas - Active", date: "Due Mar 1", status: "active" },
    { title: "ML Capstone Project", subtitle: "Industry live project submission", date: "Mar 30", status: "upcoming" },
    { title: "Data Science Internship", subtitle: "Apply to shortlisted companies", date: "Apr-Jun", status: "upcoming" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Active Path Timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm lg:col-span-2"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Active Path: Data Scientist</h3>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">Progress</span>
            <span className="text-xl font-bold text-orange-500">58%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "58%" }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full bg-blue-600 rounded-full"
            />
          </div>
          <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> 
            Est. completion: Apr 2025 • Target: Data Scientist @ Startup
          </p>
        </div>

        <div className="relative pl-3 space-y-6">
           <div className="absolute left-[15px] top-2 bottom-4 w-[2px] bg-slate-100 rounded-full z-0"></div>

           {roadmap.map((step, idx) => (
             <div key={idx} className={`relative z-10 flex gap-4 ${step.status === 'upcoming' ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex-shrink-0 mt-0.5 relative z-10 bg-white group">
                  {step.status === 'completed' ? (
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : step.status === 'active' ? (
                     <div className="w-5 h-5 flex items-center justify-center">
                       <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50"></span>
                     </div>
                  ) : (
                     <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-bold ${step.status === 'active' ? 'text-slate-900' : 'text-slate-700'}`}>
                      {step.title}
                    </h4>
                    <span className="text-xs font-medium text-slate-400 mt-0.5">{step.date}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1">{step.subtitle}</p>
                </div>
             </div>
           ))}
        </div>
      </motion.div>


      {/* Recommendations & Alternate Paths */}
      <div className="space-y-6 lg:col-span-1">
        
        {/* AI Suggestion */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🤖</span>
            <h3 className="text-sm font-bold text-slate-800">AI Path Suggestions</h3>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 text-white hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-colors"></div>
            <p className="text-xs font-medium text-slate-300 leading-relaxed mb-4 relative z-10">
              Based on your psychometric profile, add <span className="text-white font-bold">Feature Engineering</span> next — it will boost your ML project quality by ~30%.
            </p>
            <div className="flex items-center gap-3 relative z-10">
              <button className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1">
                Accept
              </button>
              <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-md transition-colors">
                Other Paths
              </button>
            </div>
          </div>
        </motion.div>

        {/* Alternate Paths */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-800">Alternate Paths</h3>
          </div>
          
          <div className="space-y-4">
            
            <div className="group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">ML Engineer</h4>
                <div className="text-right">
                  <div className="text-red-500 font-bold text-sm">88%</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fit Score</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">Python</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">TF</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">MLOps</span>
              </div>
              <div className="w-full h-[1px] bg-slate-100 mt-4 group-last:hidden"></div>
            </div>

            <div className="group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Data Analyst</h4>
                <div className="text-right">
                  <div className="text-blue-500 font-bold text-sm">82%</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fit Score</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">SQL</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">Excel</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">Tableau</span>
              </div>
              <div className="w-full h-[1px] bg-slate-100 mt-4 group-last:hidden"></div>
            </div>

            <div className="group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">AI Researcher</h4>
                <div className="text-right">
                  <div className="text-purple-500 font-bold text-sm">71%</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fit Score</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">ML</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">Maths</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">Papers</span>
              </div>
              <div className="w-full h-[1px] bg-slate-100 mt-4 group-last:hidden"></div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
