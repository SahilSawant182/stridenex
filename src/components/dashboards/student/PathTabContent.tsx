"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, TrendingUp, Target, Loader2 } from "lucide-react";
import { getStudentCareerPath, getRecommendedPaths } from "@/services/student.services";

export default function PathTabContent() {
  const [loading, setLoading] = useState(true);
  const [activePath, setActivePath] = useState<any>(null);
  const [recommendedPaths, setRecommendedPaths] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const studentEmail = localStorage.getItem("currentUser") || "ac1@gmail.com";
        
        // Fetch active career path and recommended paths in parallel
        const [careerPathRes, recommendedRes] = await Promise.all([
          getStudentCareerPath(studentEmail).catch(err => {
            console.warn("getStudentCareerPath API failed or not whitelisted, using fallback data:", err);
            return null;
          }),
          getRecommendedPaths(studentEmail).catch(err => {
            console.warn("getRecommendedPaths API failed or not whitelisted, using fallback data:", err);
            return null;
          })
        ]);

        if (careerPathRes?.message) {
          setActivePath(careerPathRes.message);
        }
        
        if (recommendedRes?.message) {
          const message = recommendedRes.message;
          setRecommendedPaths(Array.isArray(message) ? message : []);
        }
      } catch (error) {
        console.error("Error loading path tab content:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Default roadmaps / fallback values
  const defaultRoadmap = [
    { title: "Python Fundamentals", subtitle: "Complete Python Basics course", date: "Jan 12", status: "completed" },
    { title: "Data Structures & Algo", subtitle: "DSA + 30 LeetCode problems", date: "Jan 28", status: "completed" },
    { title: "SQL & Database Design", subtitle: "Advanced SQL + 2 projects", date: "Feb 5", status: "completed" },
    { title: "Machine Learning Basics", subtitle: "Sklearn, Pandas - Active", date: "Due Mar 1", status: "active" },
    { title: "ML Capstone Project", subtitle: "Industry live project submission", date: "Mar 30", status: "upcoming" },
    { title: "Data Science Internship", subtitle: "Apply to shortlisted companies", date: "Apr-Jun", status: "upcoming" },
  ];

  const defaultRecommended = [
    { title: "ML Engineer", fitScore: 88, skills: ["Python", "TF", "MLOps"] },
    { title: "Data Analyst", fitScore: 82, skills: ["SQL", "Excel", "Tableau"] },
    { title: "AI Researcher", fitScore: 71, skills: ["ML", "Maths", "Papers"] }
  ];

  // Map Active Path
  const pathData = activePath?.data || activePath;
  const activePathTitle = pathData?.career_path || pathData?.career_path_name || pathData?.path_name || pathData?.title || "Data Scientist";
  const activePathProgress = pathData?.progress !== undefined 
    ? pathData?.progress 
    : (pathData?.total_skills 
        ? Math.round(((pathData.matched_count || 0) / pathData.total_skills) * 100) 
        : (pathData?.completion_rate || 58));
  const estCompletion = pathData?.estimated_completion || pathData?.est_completion || (pathData?.estimated_duration ? `${pathData.estimated_duration} Year(s)` : "Apr 2025");
  const targetRole = pathData?.target_role || pathData?.target || "Data Scientist @ Startup";

  const rawSteps = pathData?.milestones || pathData?.roadmap || pathData?.steps || pathData?.path_items || pathData?.items;
  
  let firstIncompleteFound = false;
  const roadmap = Array.isArray(rawSteps) && rawSteps.length > 0 
    ? rawSteps.map((step: any) => {
        const skillName = step.skill;
        let status = "upcoming";
        
        // Find if this skill is matched
        const isMatched = pathData?.matched_skills?.some((s: any) => 
          (typeof s === 'string' ? s.toLowerCase() === skillName?.toLowerCase() : s?.skill?.toLowerCase() === skillName?.toLowerCase())
        );

        if (isMatched) {
          status = "completed";
        } else {
          const isPartial = pathData?.partial_skills?.some((s: any) => 
            (typeof s === 'string' ? s.toLowerCase() === skillName?.toLowerCase() : s?.skill?.toLowerCase() === skillName?.toLowerCase())
          );
          if (isPartial) {
            status = "active";
            firstIncompleteFound = true;
          } else if (!firstIncompleteFound) {
            status = "active";
            firstIncompleteFound = true;
          } else {
            status = "upcoming";
          }
        }

        return {
          title: step.milestone_title || step.title || step.step_name || step.name || "Untitled Step",
          skill: step.skill || "",
          required_skill_level: step.required_skill_level || step.level || "Beginner",
          category: step.category || "Fundamental",
          topic: step.topic || "",
          subtopic: step.subtopic || "",
          is_mandatory: step.is_mandatory !== undefined ? step.is_mandatory : 1,
          milestone_type: step.milestone_type || "Learn",
          linked_resource_type: step.linked_resource_type || "Course",
          date: step.date || step.due_date || step.target_date || step.estimated_date || (step.duration_days ? `${step.duration_days} Days` : ""),
          status: step.status || status
        };
      })
    : defaultRoadmap;

  // Map Recommended / Alternate Paths
  const alternatePaths = recommendedPaths.length > 0
    ? recommendedPaths.map((path: any) => ({
        title: path.title || path.career_path || path.name || "Career Path",
        fitScore: path.fit_score || path.score || path.match_percentage || 80,
        skills: Array.isArray(path.skills) 
          ? path.skills 
          : (typeof path.skills === 'string' 
              ? path.skills.split(',').map((s: string) => s.trim()) 
              : (path.tags || []))
      }))
    : defaultRecommended;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="text-sm font-medium italic tracking-widest uppercase opacity-70">Syncing Paths...</span>
      </div>
    );
  }

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
          <h3 className="text-base font-bold text-slate-800">Active Path: {activePathTitle}</h3>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">Progress</span>
            <span className="text-xl font-bold text-orange-500">{activePathProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${activePathProgress}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full bg-blue-600 rounded-full"
            />
          </div>

          {pathData && (pathData.difficulty_level || pathData.average_salary || pathData.missing_count !== undefined) && (
            <div className="flex flex-wrap gap-2 mb-4 mt-2">
              {pathData.difficulty_level && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                  Difficulty: {pathData.difficulty_level}
                </span>
              )}
              {pathData.average_salary && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md">
                  Avg Salary: {pathData.average_salary} LPA
                </span>
              )}
              {pathData.missing_count !== undefined && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-md">
                  Missing Skills: {pathData.missing_count}
                </span>
              )}
            </div>
          )}

          <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 flex-wrap">
            <TrendingUp className="w-3.5 h-3.5" /> 
            Est. completion: {estCompletion} • Target: {targetRole}
          </p>
        </div>

        {/* Prerequisites and Missing Skills details */}
        {pathData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-100">
            {/* Prerequisites */}
            <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                🔑 Prerequisite Skills
              </h4>
              {Array.isArray(pathData.prerequisite_skills) && pathData.prerequisite_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {pathData.prerequisite_skills.map((prereq: any, idx: number) => {
                    const skillName = prereq.prerequisite_skills || prereq.skill || prereq.name || "";
                    const skillLevel = prereq.level || prereq.required_level || "Beginner";
                    return (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 bg-white text-slate-700 text-xs font-semibold rounded-md border border-slate-200 shadow-sm">
                        {skillName} <span className="ml-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1 rounded">{skillLevel}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs font-medium text-slate-400 italic">No prerequisites required</p>
              )}
            </div>

            {/* Missing Skills */}
            <div className="bg-amber-50/30 rounded-xl p-4 border border-amber-100/60">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                ⚠️ Missing Skills to Acquire
              </h4>
              {Array.isArray(pathData.missing_skills) && pathData.missing_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {pathData.missing_skills.map((missing: any, idx: number) => {
                    const skillName = missing.skill || missing.name || "";
                    const skillLevel = missing.required_level || missing.level || "Beginner";
                    return (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 bg-white text-slate-700 text-xs font-semibold rounded-md border border-amber-200/60 shadow-sm">
                        {skillName} <span className="ml-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded">{skillLevel}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs font-medium text-emerald-600 italic">🎉 All skills matched! You are fully qualified.</p>
              )}
            </div>
          </div>
        )}

        <div className="relative pl-3 space-y-6">
           <div className="absolute left-[15px] top-2 bottom-4 w-[2px] bg-slate-100 rounded-full z-0"></div>

           {roadmap.map((step: any, idx: number) => (
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-sm font-bold ${step.status === 'active' ? 'text-slate-900' : 'text-slate-700'}`}>
                        {step.title}
                      </h4>
                      {step.is_mandatory === 1 && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-50 text-red-600 border border-red-200 rounded">
                          Mandatory
                        </span>
                      )}
                      {step.milestone_type && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded">
                          {step.milestone_type}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{step.date}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs font-medium text-slate-500 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/60">
                    <div>
                      <span className="font-bold text-slate-400">Skill: </span>
                      <span className="text-slate-700">{step.skill} ({step.required_skill_level})</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400">Category: </span>
                      <span className="text-slate-700">{step.category}</span>
                    </div>
                    {(step.topic || step.subtopic) && (
                      <div className="col-span-1 md:col-span-2">
                        <span className="font-bold text-slate-400">Focus: </span>
                        <span className="text-slate-700">{step.topic || "N/A"}{step.subtopic ? ` → ${step.subtopic}` : ""}</span>
                      </div>
                    )}
                    {step.linked_resource_type && (
                      <div className="col-span-1 md:col-span-2">
                        <span className="font-bold text-slate-400">Resource: </span>
                        <span className="text-slate-700">{step.linked_resource_type}</span>
                      </div>
                    )}
                  </div>
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
            {alternatePaths.map((path: any, idx: number) => (
              <div key={`${path.title}-${idx}`} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{path.title}</h4>
                  <div className="text-right">
                    <div className={`${
                      path.fitScore >= 85 ? 'text-red-500' : path.fitScore >= 75 ? 'text-blue-500' : 'text-purple-500'
                    } font-bold text-sm`}>
                      {path.fitScore}%
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fit Score</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill: string, skillIdx: number) => (
                    <span key={skillIdx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded shrink-0">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="w-full h-[1px] bg-slate-100 mt-4 group-last:hidden"></div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
