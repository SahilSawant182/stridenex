"use client";

import { motion, Variants } from "framer-motion";
import { 
  Star, 
  ThumbsUp,
  BarChart3,
  Lightbulb,
  Lock,
  TrendingUp,
  Users,
  FileText
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.3 } },
};

const feedbackReviews = [
  {
    id: 1,
    student: "Anonymous Student",
    role: "AI Fraud Detection Internship • Jan-Mar 2025",
    text: "Great technical mentorship and collaborative team culture. Projects were impactful and real. Compensation could improve for interns.",
    rating: 4.5,
    date: "Mar 10, 2025",
    tags: ["Good Mentorship", "Real Projects", "Inclusive Culture"],
    breakdown: { mentorship: "4/5", culture: "5/5", learning: "4/5", compensation: "3/5", worklife: "4/5" }
  },
  {
    id: 2,
    student: "Anonymous Student",
    role: "Payments Dashboard Internship • Oct-Dec 2024",
    text: "Exceptional learning experience. The manager was incredibly supportive and the team treated me as a full member from day one.",
    rating: 5,
    date: "Jan 5, 2025",
    tags: ["Excellent Culture", "Growth Focused", "Highly Recommend"],
    breakdown: { mentorship: "5/5", culture: "5/5", learning: "5/5", compensation: "4/5", worklife: "5/5" }
  },
  {
    id: 3,
    student: "Anonymous Student",
    role: "Data Science Project • Aug-Oct 2024",
    text: "Decent experience overall. The initial onboarding was slow and tools access took 2 weeks. Once set up, the work was interesting but could be better structured.",
    rating: 3.5,
    date: "Nov 2, 2024",
    tags: ["Needs Better Onboarding", "Good Team", "Average Pay"],
    breakdown: { mentorship: "3/5", culture: "4/5", learning: "3/5", compensation: "3/5", worklife: "3/5" }
  }
];

export default function FeedbackTabContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Policy Banner - Less Gray, More Info */}
      <motion.div variants={item} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 border border-blue-200">
           <Lock className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-sm leading-relaxed text-slate-600 font-medium">
           <span className="font-bold text-blue-600">Anonymous Feedback Policy:</span> All reviews are strictly anonymised. Student identities remain hidden. These insights help you improve the intern experience.
        </p>
      </motion.div>

      {/* 2. Stats Grid - Larger Values & Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "OVERALL RATING", value: "4.0/5", icon: Star, borderColor: "border-t-orange-500", iconColor: "text-orange-500", bgColor: "bg-orange-50/30" },
          { label: "TOTAL REVIEWS", value: "4", icon: FileText, borderColor: "border-t-blue-500", iconColor: "text-blue-500", bgColor: "bg-blue-50/30" },
          { label: "RECOMMEND", value: "92%", icon: ThumbsUp, borderColor: "border-t-emerald-500", iconColor: "text-emerald-500", bgColor: "bg-emerald-50/30" },
          { label: "RATING TREND", value: "+0.4", icon: TrendingUp, borderColor: "border-t-red-500", iconColor: "text-red-500", bgColor: "bg-red-50/30" },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item} className={`bg-white rounded-2xl border border-slate-200 ${stat.borderColor} border-t-2 p-6 shadow-sm flex items-center justify-between group`}>
             <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
             </div>
             <div className={`p-4 ${stat.bgColor} rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <BaseCard className="border-slate-200 shadow-sm">
             <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <BarChart3 className="w-4 h-4 text-white" />
                   </div>
                   <h2 className="text-lg font-bold text-slate-900">Category Breakdown</h2>
                </div>

                <div className="space-y-6">
                   {[
                     { label: "Mentorship Quality", value: "4.0/5", width: "80%", color: "bg-emerald-500" },
                     { label: "Company Culture", value: "4.5/5", width: "90%", color: "bg-emerald-500" },
                     { label: "Learning Opportunity", value: "4.3/5", width: "86%", color: "bg-emerald-500" },
                     { label: "Compensation", value: "3.5/5", width: "70%", color: "bg-orange-500" },
                     { label: "Work-Life Balance", value: "3.8/5", width: "76%", color: "bg-orange-500" },
                   ].map((cat, idx) => (
                     <div key={idx} className="space-y-2.5">
                        <div className="flex justify-between items-center text-[13px] font-bold text-slate-700">
                           <span>{cat.label}</span>
                           <span className="text-slate-900">{cat.value}</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                           <div className={`h-full rounded-full ${cat.color} shadow-sm`} style={{ width: cat.width }} />
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-10 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6">
                   <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                         <Lightbulb className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Actionable Insights</h3>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-start gap-4">
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-lg shadow-emerald-500/30" />
                         <p className="text-sm text-slate-700 font-medium leading-relaxed">
                            <span className="font-bold text-slate-900">Strong Points:</span> Culture & Tech Mentorship are top-rated areas.
                         </p>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 shrink-0 shadow-lg shadow-orange-500/30" />
                         <p className="text-sm text-slate-700 font-medium leading-relaxed">
                            <span className="font-bold text-slate-900">Opportunity:</span> Onboarding speed and tool access latency needs work.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </BaseCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           <BaseCard className="border-slate-200">
              <CardHeader title="Rating Distribution" />
              <div className="p-8 space-y-4">
                 {[5,4,3,2,1].map((stars, idx) => {
                   const percent = [25, 50, 25, 0, 0][idx];
                   const count = [1, 2, 1, 0, 0][idx];
                   return (
                     <div key={idx} className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 w-8">
                           <span className="text-sm font-bold text-slate-800">{stars}</span>
                           <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        </div>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 rounded-full shadow-sm" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-900 w-4 text-right">{count}</span>
                     </div>
                   );
                 })}
              </div>
           </BaseCard>

           <BaseCard className="border-slate-200">
              <div className="p-8">
                 <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Most Mentioned Tags</h2>
                 <div className="flex flex-wrap gap-2">
                    {["Good Mentorship", "Real Projects", "Inclusive Culture", "Excellent Support", "Growth Focused", "Fast Paced"].map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors cursor-default shadow-sm">
                         {tag}
                      </span>
                    ))}
                 </div>
              </div>
           </BaseCard>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-6">
         <div className="flex items-center gap-3 px-2">
            <Users className="w-6 h-6 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900">Student Reviews</h2>
         </div>

         {feedbackReviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
               <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-blue-100 transition-colors shadow-inner">
                        <Users className="w-6 h-6 text-indigo-500" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="text-base font-black text-slate-900">Anonymous Intern</h3>
                           <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-wider backdrop-blur-md">HIDDEN</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded-md inline-block border border-slate-100">{review.role}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-1 justify-end mb-1">
                        {[1,2,3,4,5].map(s => (
                           <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(review.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                        ))}
                     </div>
                     <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{review.date}</span>
                  </div>
               </div>

               <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium mb-5 pl-4 border-l-2 border-indigo-500">
                  "{review.text}"
               </p>

               <div className="flex flex-wrap gap-2 mb-6">
                  {review.tags.map(tag => (
                     <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200 shadow-sm">{tag}</span>
                  ))}
               </div>

               <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-slate-100">
                  {Object.entries(review.breakdown).map(([key, val]) => (
                     <div key={key}>
                        <span className="text-lg font-black text-indigo-600 block leading-tight">{val}</span>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">{key}</p>
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>
    </motion.div>
  );
}
