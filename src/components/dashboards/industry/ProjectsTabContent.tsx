"use client";

import { motion, Variants } from "framer-motion";
import { 
  Plus, 
  Briefcase, 
  Target,
  Trophy,
  Users,
  Star,
  Microscope,
  Palette,
  Database,
  BarChart3,
  Clock,
  ArrowRight
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.3 } },
};

const projects = [
  {
    id: 1,
    icon: Microscope,
    title: "AI-Powered Fraud Detection Engine",
    subtitle: "Risk & Payments • PRJ-2401",
    description: "Build an ML pipeline to detect real-time payment fraud using graph neural networks and anomaly detection.",
    tags: ["Python", "ML", "Statistics", "SQL"],
    badges: ["Open", "R&D"],
    metrics: { applied: 47, shortlisted: 8, award: "₹50,000", duration: "3 months" }
  },
  {
    id: 2,
    icon: Palette,
    title: "Payments Dashboard Redesign",
    subtitle: "Product Design • PRJ-2398",
    description: "Redesign our merchant payments dashboard with a focus on reducing cognitive load and improving conversion.",
    tags: ["Figma", "UX Research", "Prototyping"],
    badges: ["Shortlisting", "Design"],
    metrics: { applied: 31, shortlisted: 6, award: "Internship Offer", duration: "6 weeks" }
  },
  {
    id: 3,
    icon: Database,
    title: "Customer Churn Prediction Model",
    subtitle: "Data Science • PRJ-2391",
    description: "Develop a predictive model to identify high-risk customers based on transaction frequency and account age.",
    tags: ["Python", "Pandas", "Scikit-Learn"],
    badges: ["Open", "Data Science"],
    metrics: { applied: 112, shortlisted: 14, award: "₹30,000", duration: "2 months" }
  }
];

export default function ProjectsTabContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Header Section - Exact Match */}
      <motion.div variants={item} className="flex flex-col md:flex-row items-center justify-between gap-6 px-1">
         <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Live Projects & R&D Offerings</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Post real projects for students — best submissions get awarded, top performers get internship offers</p>
         </div>
         <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-500/10">
            <Plus className="w-4 h-4" /> Post New Project
         </button>
      </motion.div>

      {/* 2. Stats Grid - Exactly as Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "ACTIVE PROJECTS", value: "5", icon: Microscope, border: "border-t-purple-400", bg: "bg-purple-50/50", iconBg: "bg-purple-50" },
          { label: "TOTAL APPLICATIONS", value: "152", icon: Users, border: "border-t-blue-400", bg: "bg-blue-50/50", iconBg: "bg-blue-50" },
          { label: "STUDENTS AWARDED", value: "22", icon: Trophy, border: "border-t-emerald-400", bg: "bg-emerald-50/50", iconBg: "bg-emerald-50" },
          { label: "CONVERTED TO PPO", value: "8", icon: Briefcase, border: "border-t-orange-400", bg: "bg-orange-50/50", iconBg: "bg-orange-50" },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item} className={`bg-white rounded-xl border border-slate-200 ${stat.border} border-t-2 p-5 shadow-sm flex items-start justify-between group`}>
             <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
             </div>
             <div className={`p-3 ${stat.iconBg} rounded-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100`}>
                <stat.icon className="w-5 h-5 text-slate-400" />
             </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Projects Portfolio */}
      <div className="space-y-4">
         {projects.map((project) => (
            <motion.div 
               key={project.id} 
               variants={item}
               className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group"
            >
               <div className="flex flex-col gap-5">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-105 transition-transform">
                           <project.icon className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-slate-800">{project.title}</h3>
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{project.subtitle}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        {project.badges.map((badge, bIdx) => (
                           <span key={bIdx} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${badge === "Open" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>
                              {badge}
                           </span>
                        ))}
                     </div>
                  </div>

                  {/* Body Text & Tags */}
                  <div className="space-y-4">
                     <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-4xl opacity-80">
                        {project.description}
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                           <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-500 text-[10px] font-bold rounded-lg border border-indigo-100">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>

                  {/* High Fidelity Footer Row */}
                  <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex flex-wrap items-center gap-8">
                        <div className="flex flex-col">
                           <span className="text-lg font-bold text-orange-500 leading-none">{project.metrics.applied}</span>
                           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Applied</p>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-lg font-bold text-blue-500 leading-none">{project.metrics.shortlisted}</span>
                           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Shortlisted</p>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-lg font-bold text-emerald-500 leading-none">{project.metrics.award}</span>
                           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Award</p>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-600 leading-none">{project.metrics.duration}</span>
                           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Duration</p>
                        </div>
                     </div>
                     <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 active:scale-95">
                        Manage <ArrowRight className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </div>
            </motion.div>
         ))}
      </div>
    </motion.div>
  );
}
