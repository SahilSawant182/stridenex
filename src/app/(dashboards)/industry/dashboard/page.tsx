// app/(dashboards)/industry/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Briefcase,
  Target,
  Zap,
  Sparkles,
  Award,
  Calendar,
  ChevronRight,
  ClipboardList,
  Loader2
} from "lucide-react";
import StatsWidget from "@/components/dashboards/widgets/StatsWidget";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";
import { useIndustry } from "@/context/IndustryContext";
import { getApplicationStatusCount } from "@/services/industry.services";
import { useRouter } from "next/navigation";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};


const topCandidates = [
  {
    id: 1,
    initials: "PS",
    bgColor: "bg-red-500",
    name: "Priya Sharma",
    college: "VJTI Mumbai • CGPA 8.7",
    skills: ["Python", "ML", "SQL"],
    match: 94
  },
  {
    id: 2,
    initials: "SP",
    bgColor: "bg-lime-500",
    name: "Sneha Patel",
    college: "COEP Pune • CGPA 8.4",
    skills: ["Python", "SQL"],
    match: 88
  },
  {
    id: 3,
    initials: "AN",
    bgColor: "bg-green-500",
    name: "Arjun Nair",
    college: "IIT Bombay • CGPA 9.1",
    skills: ["ML", "Python"],
    match: 82
  }
];

const initialPipelineStages = [
  { stage: "New Applications", count: 0, color: "bg-slate-800", width: "5%", apiKey: "Applied" },
  { stage: "AI Pre-screened", count: 0, color: "bg-blue-500", width: "5%", apiKey: "Shortlisted" },
  { stage: "HR Shortlisted", count: 0, color: "bg-orange-500", width: "5%", apiKey: "HR" },
  { stage: "Interview Round 1", count: 0, color: "bg-orange-400", width: "5%", apiKey: "Tech Interview" },
  { stage: "Final Round", count: 0, color: "bg-emerald-500", width: "5%", apiKey: "Final" },
  { stage: "Offers Extended", count: 0, color: "bg-emerald-600", width: "5%", apiKey: "Selected" }
];

export default function IndustryOverviewPage() {
  const router = useRouter();
  const { industryData } = useIndustry();
  const [pipelineStages, setPipelineStages] = useState(initialPipelineStages);
  const [loadingPipeline, setLoadingPipeline] = useState(false);

  const [appliedCount, setAppliedCount] = useState<number>(0);

  useEffect(() => {
    const fetchPipelineCounts = async () => {
      if (industryData?.company_name) {
        try {
          setLoadingPipeline(true);
          const response = await getApplicationStatusCount(industryData.company_name);
          const apiData = response?.data || response?.message || {};

          // Update total applied count for the stats card
          setAppliedCount(Number(apiData["Applied"]) || 0);

          // Calculate max count for relative widths (funnel effect)
          const counts = Object.values(apiData).map(v => Number(v) || 0);
          const maxCount = Math.max(...counts, 1); // Avoid division by zero

          const updatedStages = initialPipelineStages.map(stage => {
            const count = Number(apiData[stage.apiKey]) || 0;
            return {
              ...stage,
              count,
              width: `${Math.max((count / maxCount) * 100, 5)}%`
            };
          });

          setPipelineStages(updatedStages);
        } catch (err) {
          console.error("Error fetching pipeline counts:", err);
        } finally {
          setLoadingPipeline(false);
        }
      }
    };

    fetchPipelineCounts();
  }, [industryData?.company_name]);

  const industryStats = [
    {
      id: 1,
      title: "SEARCHABLE STUDENTS",
      value: "12,840",
      change: 2100,
      changeLabel: "this month",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "up"
    },
    {
      id: 2,
      title: "APPLICATIONS RECEIVED",
      value: loadingPipeline ? "..." : appliedCount.toString(),
      change: 8,
      changeLabel: "new applicants",
      icon: ClipboardList,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      trend: "up"
    },
    {
      id: 3,
      title: "AVG SKILL MATCH",
      value: "89%",
      change: 17,
      changeLabel: "vs 72% industry",
      icon: Award,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      trend: "up"
    },
    {
      id: 4,
      title: "TIME TO SHORTLIST",
      value: "4.2d",
      change: 12,
      changeLabel: "vs 12 days manual",
      icon: Zap,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      trend: "up"
    }
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {industryStats.map((stat) => (
          <StatsWidget
            key={stat.id}
            title={stat.title}
            data={{
              value: stat.value,
              change: stat.change,
              changeLabel: stat.changeLabel,
              icon: stat.icon,
              iconBg: stat.iconBg,
              iconColor: stat.iconColor,
              trend: stat.trend as "up" | "down" | "neutral"
            }}
          />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Top AI Candidates */}
        <motion.div variants={item} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-slate-800">Top AI-Matched Candidates</h2>
          </div>
          
          <div className="space-y-4">
            {topCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-white border text-center lg:text-left border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm relative">
                {/* Match Badge */}
                <div className="absolute right-6 top-6 w-12 h-12 rounded-full border-[3px] border-emerald-500 flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">{candidate.match}%</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full ${candidate.bgColor} text-white flex items-center justify-center text-lg font-bold shrink-0`}>
                    {candidate.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{candidate.name}</h3>
                    <p className="text-sm text-slate-500 mb-2">{candidate.college}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      {candidate.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" />
                    Invite
                  </button>
                  <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2 rounded-lg border border-slate-200 transition-colors text-sm">
                    View Ledger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Pipeline & Actions */}
        <motion.div variants={item} className="flex flex-col gap-6">
          <BaseCard className="border-slate-200">
            <CardHeader title="Application Pipeline" />
            <div className="p-5 space-y-5 min-h-[300px] flex flex-col justify-center">
              {loadingPipeline ? (
                <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updating Pipeline...</p>
                </div>
              ) : (
                pipelineStages.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-36 text-sm font-medium text-slate-700 shrink-0">
                      {item.stage}
                    </div>
                    <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: item.width }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${item.color}`} 
                      />
                    </div>
                    <div className="w-8 text-right font-bold text-slate-800 text-sm">
                      {item.count}
                    </div>
                  </div>
                ))
              )}
            </div>
          </BaseCard>

          <BaseCard className="border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Quick Actions</h3>
            <div className="space-y-3">
                <button 
                  onClick={() => router.push("/industry/dashboard/internships?action=post-new")}
                  className="w-full text-left px-4 py-3 border border-slate-200 rounded-xl flex items-center gap-3 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                   <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                     <Briefcase className="w-4 h-4 text-orange-500" />
                   </div>
                   <span className="font-medium text-slate-700 text-sm flex-1">Post New Internship</span>
                </button>
                <button 
                  onClick={() => router.push("/industry/dashboard/projects?action=post-new")}
                  className="w-full text-left px-4 py-3 border border-slate-200 rounded-xl flex items-center gap-3 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                     <Target className="w-4 h-4 text-blue-500" />
                   </div>
                   <span className="font-medium text-slate-700 text-sm flex-1">Post Live Project</span>
                </button>
            </div>
          </BaseCard>
        </motion.div>
      </div>

    </motion.div>
  );
}