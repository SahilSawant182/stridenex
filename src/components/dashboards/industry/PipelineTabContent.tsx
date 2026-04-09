"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import { getStudentApplicationList } from "@/services/industry.services";
import { useIndustry } from "@/context/IndustryContext";
import { Loader2, Zap } from "lucide-react";

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
  { id: "Applied", title: "Applied", color: "bg-slate-800" },
  { id: "Shortlisted", title: "Shortlisted", color: "bg-blue-600" },
  { id: "Tech Interview", title: "Tech Interview", color: "bg-orange-500" },
  { id: "HR", title: "HR", color: "bg-indigo-500" },
  { id: "Rejected", title: "Rejected", color: "bg-red-600" },
  { id: "Selected", title: "Selected", color: "bg-emerald-500" }
];

interface Candidate {
  id: string;
  initials: string;
  bgColor: string;
  name: string;
  college: string;
  skills: string[];
  match: number;
}

export default function PipelineTabContent() {
  const { industryData, loading: industryLoading, error: industryError } = useIndustry();
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>({
    "Applied": [],
    "Shortlisted": [],
    "Tech Interview": [],
    "HR": [],
    "Rejected": [],
    "Selected": [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async (companyName: string) => {
    try {
      setLoading(true);
      // For now, only 'Applied' is available dynamically as per user request
      const response = await getStudentApplicationList(companyName, "Applied");
      
      // Resilient data extraction to ensure all items are listed
      const apiData = response?.data || response?.message?.data || response?.message;

      if (Array.isArray(apiData)) {
        console.log(`Pipeline: Fetched ${apiData.length} applications for ${companyName}`);
        const mappedApplied: Candidate[] = apiData.map((app: any) => {
          const email = app.student || "Student";
          const initials = email.charAt(0).toUpperCase();
          const bgColors = ["bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-indigo-500", "bg-orange-500", "bg-purple-500"];
          const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

          return {
            id: app.name || Math.random().toString(),
            name: email.split('@')[0], 
            initials: initials,
            bgColor: randomColor,
            college: app.college || "N/A", 
            skills: app.applied_on ? [new Date(app.applied_on).toLocaleDateString()] : [],
            match: Math.round(app.match_score * 100) || 0
          };
        });

        setCandidates(prev => ({
          ...prev,
          "Applied": mappedApplied
        }));
        setError(null);
      }
    } catch (err: any) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (industryData?.company_name) {
      fetchApplications(industryData.company_name);
    }
  }, [industryData?.company_name, fetchApplications]);

  if (industryLoading || (loading && candidates["Applied"].length === 0)) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Syncing Pipeline Data...</p>
      </div>
    );
  }

  if (industryError || error) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <Zap className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Connection Error</h2>
        <p className="text-slate-500 font-medium max-w-md">{industryError || error}</p>
        <button
          onClick={() => industryData?.company_name && fetchApplications(industryData.company_name)}
          className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="h-full">
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar min-h-[600px]">
        {pipelineColumns.map((col) => (
          <motion.div variants={item} key={col.id} className="min-w-[280px] w-[280px] flex flex-col gap-3 bg-slate-50/50 rounded-2xl p-2 border border-slate-100">
            {/* Column Header */}
            <div className={`${col.color} text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-sm`}>
              <h3 className="font-bold text-sm tracking-wide">{col.title}</h3>
              <div className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {candidates[col.id]?.length || 0}
              </div>
            </div>

            {/* Candidate Cards */}
            <div className="flex flex-col gap-3 overflow-y-auto hide-scrollbar pb-2">
              {candidates[col.id]?.length > 0 ? (
                candidates[col.id].map((candidate) => (
                  <div key={candidate.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full ${candidate.bgColor} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                        {candidate.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{candidate.name}</h4>
                        <p className="text-xs text-slate-500 font-semibold">{candidate.college}</p>
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
                      {candidate.match > 0 && (
                        <div className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {candidate.match}%
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Empty Stage</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
