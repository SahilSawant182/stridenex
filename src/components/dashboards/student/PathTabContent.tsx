"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  Loader2,
  ArrowRight,
  Compass,
  Search,
  Plus,
  X,
  Lock,
  Check,
  Sparkles,
  BookOpen,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Calendar,
  Heart,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  SkipForward
} from "lucide-react";
import {
  getStudentCareerPath,
  getRecommendedPaths,
  enrollStudentPath,
  createStudentSkill,
  logMilestoneProgress,
  getMasterData,
  getCareerPathDetail,
  getCareerRecommendations,
  getHierarchySkillsForPath,
  getStudentSkills,
  completeMilestonePoint
} from "@/services/student.services";

export default function PathTabContent() {
  const [loading, setLoading] = useState(true);
  const [activePath, setActivePath] = useState<any>(null);
  const [recommendedPaths, setRecommendedPaths] = useState<any[]>([]);
  const [enrollingPath, setEnrollingPath] = useState<string | null>(null);

  // Wizard state variables
  const [inWizardMode, setInWizardMode] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [selectedPathDetails, setSelectedPathDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  // Student Profile fields
  const [degree, setDegree] = useState<string>("B.Tech");
  const [specialisation, setSpecialisation] = useState<string>("Computer Science");
  const [academicYear, setAcademicYear] = useState<number>(3);
  const [interests, setInterests] = useState<string>("Web Development, Artificial Intelligence");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillsInput, setSkillsInput] = useState<string>("");

  // Hierarchy skills retrieved for the selected career path
  const [hierarchySkills, setHierarchySkills] = useState<any>(null);

  // Student skills ledger entries
  const [studentSkills, setStudentSkills] = useState<any[]>([]);
  const [revisedMilestones, setRevisedMilestones] = useState<Record<string, boolean>>({});
  const [collapsedChecklists, setCollapsedChecklists] = useState<Record<string, boolean>>({});

  // AI Generation simulation states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationPhase, setGenerationPhase] = useState<string>("");

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const studentEmail = localStorage.getItem("currentUser") || "ac1@gmail.com";

      // Fetch active career path and student skills in parallel
      const [careerPathRes, studentSkillsRes] = await Promise.all([
        getStudentCareerPath(studentEmail).catch(err => {
          console.warn("getStudentCareerPath API failed, using fallback data:", err);
          return null;
        }),
        getStudentSkills(studentEmail).catch(err => {
          console.warn("getStudentSkills API failed:", err);
          return null;
        })
      ]);

      if (studentSkillsRes?.message) {
        setStudentSkills(Array.isArray(studentSkillsRes.message) ? studentSkillsRes.message : []);
      } else if (Array.isArray(studentSkillsRes)) {
        setStudentSkills(studentSkillsRes);
      }

      if (careerPathRes?.message) {
        const msg = careerPathRes.message;
        setActivePath(msg);
        if (msg.type === "active_plan" || (msg.data && msg.data.has_active_plan)) {
          setInWizardMode(false);
          setIsGenerating(false);
        } else if (msg.type === "generating") {
          setInWizardMode(false);
          setIsGenerating(true);
          if (!generationPhase) {
            setGenerationPhase("🤖 AI is generating your customized milestones...");
          }
        } else {
          setInWizardMode(true);
          setIsGenerating(false);
        }
      } else {
        setInWizardMode(true);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error loading path tab content:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await getMasterData("Skill", { page_size: 150 });
      if (res?.data) {
        const names = res.data.map((item: any) => item.skill_name || item.name || item.skill);
        const uniqueNames = Array.from(new Set(names.filter(Boolean))) as string[];
        setSkillsList(uniqueNames.sort());
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      console.warn("Failed to fetch skills from master, using default list:", err);
      setSkillsList([
        "Python", "HTML", "CSS", "JavaScript", "SQL", "Machine Learning", "Git", "React",
        "Django", "Flask", "TailwindCSS", "Node.js", "Docker", "AWS", "Frappe", "Jinja",
        "Deep Learning", "Data Analysis", "TypeScript", "Next.js", "PostgreSQL", "Linux"
      ]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSkills();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isGenerating) {
      interval = setInterval(() => {
        fetchData(true);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  useEffect(() => {
    const parsed = skillsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    setSelectedSkills(parsed);
  }, [skillsInput]);

  useEffect(() => {
    if (studentSkills.length > 0 && !skillsInput) {
      const list = studentSkills.map((s: any) => s.skill || s.skill_name || s.name).filter(Boolean);
      setSkillsInput(list.join(", "));
    }
  }, [studentSkills]);

  const handleEnrollPath = async (careerPathName: string, generationMode: string = "Standard") => {
    const studentEmail = localStorage.getItem("currentUser") || "ac1@gmail.com";
    let hasSucceeded = false;
    try {
      setEnrollingPath(careerPathName);
      if (generationMode === "AI") {
        setIsGenerating(true);
        setGenerationPhase("🤖 Initiating AI roadmap generation...");
      }
      const res = await enrollStudentPath(studentEmail, careerPathName, generationMode);
      if (res) {
        hasSucceeded = true;
        if (generationMode === "AI") {
          setInWizardMode(false);
        }
        await fetchData();
      }
    } catch (err: any) {
      console.error("Enrollment failed:", err);
      alert(err?.response?.data?.message || err?.message || "Failed to switch career path. Please try again.");
    } finally {
      setEnrollingPath(null);
      if (!hasSucceeded || generationMode !== "AI") {
        setIsGenerating(false);
        setGenerationPhase("");
      }
    }
  };

  const handleCompleteMilestone = async (milestoneName: string) => {
    if (!pathData?.enrollment_id) return;
    try {
      setLoading(true);
      await logMilestoneProgress(pathData.enrollment_id, milestoneName);
      alert("Milestone marked as completed! You have gained the corresponding skills.");
      await fetchData();
    } catch (err: any) {
      console.error("Failed to complete milestone:", err);
      alert(err?.response?.data?.message || err?.message || "Failed to mark milestone as complete.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePoint = async (milestoneTitle: string, pointTitle: string, currentStatus: string) => {
    if (!pathData?.enrollment_id) return;
    try {
      setLoading(true);
      const newCompleted = currentStatus !== 'Completed';
      const res = await completeMilestonePoint({
        enrollment: pathData.enrollment_id,
        milestone_title: milestoneTitle,
        point_title: pointTitle,
        completed: newCompleted
      });
      if (res?.message?.milestone_completed) {
        alert("🎉 Milestone fully completed! You have gained the corresponding skills.");
      }
      await fetchData();
    } catch (err: any) {
      console.error("Failed to toggle checklist point:", err);
      alert(err?.response?.data?.message || err?.message || "Failed to update checklist item.");
    } finally {
      setLoading(false);
    }
  };

  // Submit profile details to fetch career recommendations
  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const params = {
        degree: degree,
        branch: specialisation,
        year: academicYear,
        country: "India",
        interests: interests,
        skills: selectedSkills
      };

      const res = await getCareerRecommendations(params);
      if (res?.message?.recommended_paths) {
        setRecommendedPaths(res.message.recommended_paths);
        setWizardStep(2);
      } else if (res?.recommended_paths) {
        setRecommendedPaths(res.recommended_paths);
        setWizardStep(2);
      } else {
        alert("No recommendations found for this profile. Using fallback career paths.");
        setRecommendedPaths(defaultRecommended);
        setWizardStep(2);
      }
    } catch (err: any) {
      console.error("Failed to get career recommendations:", err);
      alert("Error generating recommendations: " + (err.message || err));
      setRecommendedPaths(defaultRecommended);
      setWizardStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Select a recommended path and load its hierarchy skills
  const handleSelectPathForSkills = async (path: any) => {
    setSelectedPath(path);
    setDetailsLoading(true);
    try {
      const pathTitle = path.career || path.title || path.path_name;
      const res = await getHierarchySkillsForPath(pathTitle);
      if (res?.message) {
        setHierarchySkills(res.message);
      } else if (res) {
        setHierarchySkills(res);
      }
    } catch (err) {
      console.error("Error getting hierarchy skills for path:", err);
      setHierarchySkills({
        foundation_skills: path.skills ? path.skills.slice(0, 2) : [],
        core_domain_skills: path.skills ? path.skills.slice(2, 4) : [],
        industry_skills: path.skills ? path.skills.slice(4, 5) : [],
        emerging_skills: path.skills ? path.skills.slice(5) : []
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Move to gap analysis preview step
  const handleGoToGapAnalysis = async () => {
    if (!selectedPath) return;
    setDetailsLoading(true);
    try {
      const pathTitle = selectedPath.career || selectedPath.title || selectedPath.path_name;
      const res = await getCareerPathDetail(pathTitle);
      if (res?.message) {
        setSelectedPathDetails(res.message);
      } else {
        setSelectedPathDetails(selectedPath);
      }
      setWizardStep(3);
    } catch (err) {
      console.error("Error getting career path detail:", err);
      setSelectedPathDetails(selectedPath);
      setWizardStep(3);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Start AI personalized roadmap wizard execution
  const handleStartPersonalizedRoadmap = async () => {
    if (!selectedPath) return;
    const studentEmail = localStorage.getItem("currentUser") || "ac1@gmail.com";
    const pathTitle = selectedPath.career || selectedPath.title || selectedPath.path_name;
    let hasSucceeded = false;

    try {
      setIsGenerating(true);
      setGenerationPhase("🤖 Self-declaring selected skills into Skill Ledger...");

      // Call createStudentSkill in parallel for all selected skills
      await Promise.all(
        selectedSkills.map(async (skillName) => {
          try {
            await createStudentSkill({
              student: studentEmail,
              skill: skillName,
              current_level: "Intermediate",
              self_declared: 1,
              ai_verified: 1,
              status: "Verified"
            });
          } catch (e) {
            console.warn("Skill already exists or failed to declare:", skillName, e);
          }
        })
      );

      setGenerationPhase("🤖 Enrolling student and generating personalized roadmap...");

      const res = await enrollStudentPath(studentEmail, pathTitle, "AI");
      if (res) {
        hasSucceeded = true;
        setInWizardMode(false);
        setWizardStep(1);
        setSelectedPath(null);
        setSelectedPathDetails(null);
        setHierarchySkills(null);
        setSelectedSkills([]);
        await fetchData();
      }
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      alert(err?.response?.data?.message || err?.message || "Failed to generate AI roadmap. Please try again.");
    } finally {
      if (!hasSucceeded) {
        setIsGenerating(false);
        setGenerationPhase("");
      }
    }
  };

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
    {
      career: "AI Engineer",
      category: "AI & Data",
      confidence: 85,
      career_stage: "Established",
      future_demand: "Very High",
      industry: "Technology",
      skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "NLP", "Git"]
    },
    {
      career: "Frontend Developer",
      category: "Web Development",
      confidence: 90,
      career_stage: "Growing",
      future_demand: "High",
      industry: "Technology",
      skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "TailwindCSS"]
    },
    {
      career: "DevOps Engineer",
      category: "Cloud",
      confidence: 65,
      career_stage: "Established",
      future_demand: "Very High",
      industry: "Infrastructure",
      skills: ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Git"]
    }
  ];

  // Map Active Path
  const pathData = activePath?.data || activePath;
  const activePathTitle = pathData?.career_path || pathData?.career_path_name || pathData?.path_name || pathData?.title || "Data Scientist";
  const activePathProgress = pathData?.progress_percent !== undefined
    ? pathData.progress_percent
    : 0;
  const isPathCompleted = pathData?.is_completed === 1 || pathData?.is_completed === true || activePathProgress >= 100;
  const estCompletion = pathData?.estimated_completion || pathData?.est_completion || (pathData?.estimated_duration ? `${pathData.estimated_duration} Year(s)` : "Apr 2025");
  const targetRole = pathData?.target_role || pathData?.target || "Data Scientist @ Startup";

  const rawSteps = pathData?.milestones || pathData?.roadmap || pathData?.steps || pathData?.path_items || pathData?.items;

  const roadmap = Array.isArray(rawSteps) && rawSteps.length > 0
    ? rawSteps.map((step: any) => {
      return {
        name: step.name || "",
        title: step.milestone_title || step.title || step.step_name || "Untitled Step",
        skill: step.skill || "",
        required_skill_level: step.required_skill_level || step.level || "Beginner",
        category: step.category || "Fundamental",
        topic: step.topic || "",
        subtopic: step.subtopic || "",
        is_mandatory: step.is_mandatory !== undefined ? step.is_mandatory : 1,
        milestone_type: step.milestone_type || "Learn",
        linked_resource_type: step.linked_resource_type || "Course",
        linked_resource: step.linked_resource || "",
        objective: step.objective || "",
        project: step.project || "",
        date: step.display_date || (step.duration_days ? `${step.duration_days} Days` : ""),
        status: step.status || "upcoming",
        points: step.points || []
      };
    })
    : defaultRoadmap;

  // Map Recommended / Alternate Paths
  const rawAlternatePaths = recommendedPaths.length > 0 ? recommendedPaths : defaultRecommended;
  const alternatePaths = rawAlternatePaths.map((path: any) => ({
    title: path.career || path.career_path || path.path_name || path.title || "Career Path",
    fitScore: typeof path.confidence === 'number' ? path.confidence : (typeof path.fit_score === 'number' ? path.fit_score : 80),
    targetRole: path.target_role || path.category || "N/A",
    difficulty: path.career_stage || "Growing",
    matchedCount: path.matched_count !== undefined ? path.matched_count : 0,
    missingCount: path.missing_count !== undefined ? path.missing_count : 0,
    totalSkills: path.total_skills !== undefined ? path.total_skills : 0,
    duration: path.estimated_duration !== undefined ? path.estimated_duration : 1,
    salary: path.average_salary !== undefined ? path.average_salary : 0,
    skills: Array.isArray(path.skills)
      ? path.skills
      : (typeof path.skills === 'string'
        ? path.skills.split(',').map((s: string) => s.trim())
        : (path.tags || []))
  }));

  // Toggle skills selected by user
  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Filter skills based on user search
  const filteredSkills = skillsList.filter(skill =>
    skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium italic tracking-widest uppercase opacity-70">Syncing Career Paths...</span>
      </div>
    );
  }

  // Render the AI Roadmap Generation overlay
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto bg-white rounded-2xl border border-slate-100 p-8 shadow-md">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 relative z-10 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" />
          AI Personalized Roadmap Builder
        </h3>
        <p className="text-sm font-bold text-slate-600 max-w-sm mb-2 leading-relaxed">
          Stay tuned! Your personalized learning roadmap is being built by AI.
        </p>
        <p className="text-xs font-medium text-slate-400 max-w-sm mb-6 leading-relaxed">
          Once completed, your new custom milestones and checklists will appear instantly on your active dashboard journey path. Please do not refresh or close this page.
        </p>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
          <motion.div
            initial={{ width: "10%" }}
            animate={{ width: "95%" }}
            transition={{ duration: 6, ease: "easeInOut" }}
            className="h-full bg-blue-600 rounded-full"
          />
        </div>
        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full inline-block animate-pulse">
          {generationPhase}
        </div>
      </div>
    );
  }

  return (
    <div>
      {inWizardMode ? (
        /* WIZARD FLOW SCREEN */
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 max-w-4xl mx-auto">

          {/* Header & Steps indicators */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                AI Career Pathfinder Onboarding
              </h2>
              <p className="text-xs text-slate-500 mt-1">Design your custom, gap-optimized milestone learning path</p>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep === stepNum
                    ? 'bg-blue-600 text-white ring-4 ring-blue-50'
                    : wizardStep > stepNum
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                    }`}>
                    {wizardStep > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-0.5 ${wizardStep > stepNum ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: DEFINE PROFILE & DECLARED SKILLS */}
          {wizardStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Degree */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Degree / Qualification
                  </label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                  >
                    <option value="B.Tech">Bachelor of Technology (B.Tech)</option>
                    <option value="B.E.">Bachelor of Engineering (B.E.)</option>
                    <option value="M.Tech">Master of Technology (M.Tech)</option>
                    <option value="B.C.A.">Bachelor of Computer Applications (BCA)</option>
                    <option value="M.C.A.">Master of Computer Applications (MCA)</option>
                    <option value="B.Sc.">Bachelor of Science (B.Sc)</option>
                    <option value="M.Sc.">Master of Science (M.Sc)</option>
                  </select>
                </div>

                {/* Specialisation */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Branch / Specialisation
                  </label>
                  <input
                    type="text"
                    value={specialisation}
                    onChange={(e) => setSpecialisation(e.target.value)}
                    placeholder="e.g. Computer Science, Information Technology"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                  >
                    <option value="1">First Year (1st)</option>
                    <option value="2">Second Year (2nd)</option>
                    <option value="3">Third Year (3rd)</option>
                    <option value="4">Fourth Year (4th)</option>
                    <option value="5">Graduate / Completed</option>
                  </select>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-blue-600" />
                    Core Interests (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Web Dev, AI, Automation, Databases"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  What Skills Do You Already Possess? (Comma Separated)
                </label>
                <p className="text-xs text-slate-500 mb-4">We will use these skills to run gap analysis and offer milestone revision options.</p>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. HTML, CSS, JavaScript, React, Node.js"
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={handleGetRecommendations}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm active:scale-98"
                >
                  Find Recommended Paths
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PATH RECOMMENDATIONS & SKILLAGENT HIERARCHY */}
          {wizardStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Recommended Career Paths (Retrieved/Generated by AI Agents)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {alternatePaths.map((path: any, idx: number) => {
                    const isSelected = selectedPath?.title === path.title;
                    return (
                      <div
                        key={`${path.title}-${idx}`}
                        className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                          ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-500 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'
                          }`}
                        onClick={() => handleSelectPathForSkills(path)}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">{path.title}</h4>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{path.targetRole}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100">
                                {path.fitScore}% Match
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 my-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded">
                              {path.difficulty}
                            </span>
                            {path.salary > 0 && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded">
                                {path.salary} LPA Avg
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {path.skills.slice(0, 4).map((skill: string, skillIdx: number) => (
                              <span key={skillIdx} className="px-1.5 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-medium rounded border border-slate-100">
                                {skill}
                              </span>
                            ))}
                            {path.skills.length > 4 && (
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-medium rounded">
                                +{path.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                          <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'} flex items-center gap-0.5`}>
                            {isSelected ? "Selected" : "Click to View Details"}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hierarchy-wise skills found by Skill Agent for the selected path */}
              {selectedPath && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 rounded-xl border border-slate-150 p-6 space-y-4 shadow-inner"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                      SkillAgent Hierarchy Analysis: {selectedPath.title}
                    </h4>
                    {detailsLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                  </div>

                  {hierarchySkills ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Foundation */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-2">Foundation</span>
                        <div className="flex flex-col gap-1">
                          {hierarchySkills.foundation_skills?.length > 0 ? (
                            hierarchySkills.foundation_skills.map((s: string) => (
                              <span key={s} className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-blue-500"></span>{s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">None found</span>
                          )}
                        </div>
                      </div>

                      {/* Core Domain */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-2">Core Domain</span>
                        <div className="flex flex-col gap-1">
                          {hierarchySkills.core_domain_skills?.length > 0 ? (
                            hierarchySkills.core_domain_skills.map((s: string) => (
                              <span key={s} className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-indigo-500"></span>{s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">None found</span>
                          )}
                        </div>
                      </div>

                      {/* Industry */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-2">Industry</span>
                        <div className="flex flex-col gap-1">
                          {hierarchySkills.industry_skills?.length > 0 ? (
                            hierarchySkills.industry_skills.map((s: string) => (
                              <span key={s} className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>{s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">None found</span>
                          )}
                        </div>
                      </div>

                      {/* Emerging */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm">
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-2">Emerging</span>
                        <div className="flex flex-col gap-1">
                          {hierarchySkills.emerging_skills?.length > 0 ? (
                            hierarchySkills.emerging_skills.map((s: string) => (
                              <span key={s} className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-orange-500"></span>{s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">None found</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs font-medium text-slate-400 italic">
                      Click on a career path card to parse hierarchy skills via SkillAgent...
                    </div>
                  )}

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={handleGoToGapAnalysis}
                      disabled={!hierarchySkills}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Find Skill Gap
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Back to Profile
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: HIERARCHICAL SKILL GAP ANALYSIS & CONFIRM ENROLL */}
          {wizardStep === 3 && selectedPath && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                <h4 className="text-sm font-bold text-slate-800 mb-1">Career Goal: {selectedPath.title}</h4>
                <p className="text-xs text-slate-500">Comparing your claimed skills against SkillAgent requirements</p>
              </div>

              {hierarchySkills && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">Hierarchical Gap Assessment</h4>

                  {[
                    { label: "Foundation Tiers", matched: hierarchySkills.foundation_skills?.filter((s: string) => selectedSkills.some(k => k.toLowerCase() === s.toLowerCase())) || [], missing: hierarchySkills.foundation_skills?.filter((s: string) => !selectedSkills.some(k => k.toLowerCase() === s.toLowerCase())) || [] },
                    { label: "Core Domains", matched: hierarchySkills.core_domain_skills?.filter((s: string) => selectedSkills.some(k => k.toLowerCase() === s.toLowerCase())) || [], missing: hierarchySkills.core_domain_skills?.filter((s: string) => !selectedSkills.some(k => k.toLowerCase() === s.toLowerCase())) || [] },
                    { label: "Industry Applications", matched: hierarchySkills.industry_skills?.filter((s: string) => selectedSkills.some(k => k.toLowerCase() === s.toLowerCase())) || [], missing: hierarchySkills.industry_skills?.filter((s: string) => !selectedSkills.some(k => k.toLowerCase() === s.toLowerCase())) || [] },
                    { label: "Emerging Fields", matched: hierarchySkills.emerging_skills?.filter((s: string) => selectedSkills.some(k => k.toLowerCase() === s.toLowerCase())) || [], missing: hierarchySkills.emerging_skills?.filter((s: string) => !selectedSkills.some(k => k.toLowerCase() === s.toLowerCase())) || [] },
                  ].map((group, idx) => (
                    <div key={idx} className="bg-white border border-slate-150 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
                      <div className="border-r border-slate-100 pr-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{group.label} - Matched</span>
                        <div className="flex flex-wrap gap-1">
                          {group.matched.length > 0 ? (
                            group.matched.map((s: string) => (
                              <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded border border-emerald-100">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">None matched</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{group.label} - Gap</span>
                        <div className="flex flex-wrap gap-1">
                          {group.missing.length > 0 ? (
                            group.missing.map((s: string) => (
                              <span key={s} className="px-2 py-0.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded border border-rose-100">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-bold">🎉 Fully covered!</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Standard Milestones Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Roadmap Sequence Preview</h4>
                <div className="space-y-2 border border-slate-100 rounded-xl p-4 max-h-40 overflow-y-auto bg-slate-50/20">
                  {selectedPathDetails?.milestones ? (
                    selectedPathDetails.milestones.map((m: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 font-medium">{m.milestone_title}</div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                          {m.milestone_type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No milestones preview available.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Back to Suggestions
                </button>
                <button
                  onClick={handleStartPersonalizedRoadmap}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  Proceed & Activate Path
                </button>
              </div>
            </motion.div>
          )}

        </div>
      ) : (

        /* ACTIVE TIMELINE JOURNEY BOARD */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Active Path Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Active Journey</h3>
                  <p className="text-xs font-medium text-slate-500">{activePathTitle}</p>
                </div>
              </div>

              <button
                onClick={() => setInWizardMode(true)}
                className="px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 shadow-sm"
              >
                <Compass className="w-3.5 h-3.5" />
                Switch Career Path
              </button>
            </div>

            {isPathCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md border border-emerald-400/20 relative overflow-hidden"
              >
                <div className="absolute right-0 bottom-0 opacity-15 translate-x-4 translate-y-4">
                  <CheckCircle2 className="w-40 h-40 text-white" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl shrink-0 animate-bounce">
                    🎓
                  </div>
                  <div>
                    <h4 className="text-base font-bold">Career Path Fully Mastered!</h4>
                    <p className="text-xs text-emerald-50 opacity-90 mt-1">
                      You have completed all milestones for <span className="font-bold underline">{activePathTitle}</span>. Your skill ledger is updated with the required credentials!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">Journey Progress</span>
                <span className={`text-xl font-bold ${isPathCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>{activePathProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${activePathProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${isPathCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-blue-600'}`}
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
                </div>
              )}

              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 flex-wrap">
                <TrendingUp className="w-3.5 h-3.5" />
                Est. completion: {estCompletion} • Target: {targetRole}
              </p>
            </div>

            {/* Acquired Skills and Missing Skills details */}
            {pathData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-100">
                {/* Acquired Skills */}
                <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100/60">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-mono">
                    ✅ Acquired Skills
                  </h4>
                  {Array.isArray(pathData.matched_skills) && pathData.matched_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {pathData.matched_skills.map((matched: any, idx: number) => {
                        const skillName = matched.skill || matched.name || "";
                        const skillLevel = matched.current_level || matched.level || "Beginner";
                        return (
                          <span key={idx} className="inline-flex items-center px-2.5 py-1 bg-white text-slate-700 text-xs font-semibold rounded-md border border-emerald-200/60 shadow-sm">
                            {skillName} <span className="ml-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">{skillLevel}</span>
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-slate-400 italic">No acquired skills yet</p>
                  )}
                </div>

                {/* Missing Skills */}
                <div className="bg-rose-50/30 rounded-xl p-4 border border-rose-100/60">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-mono">
                    ⚠️ Missing Skills to Acquire
                  </h4>
                  {Array.isArray(pathData.missing_skills) && pathData.missing_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {pathData.missing_skills.map((missing: any, idx: number) => {
                        const skillName = missing.skill || missing.name || "";
                        const skillLevel = missing.required_level || missing.level || "Beginner";
                        return (
                          <span key={idx} className="inline-flex items-center px-2.5 py-1 bg-white text-slate-700 text-xs font-semibold rounded-md border border-rose-200/60 shadow-sm">
                            {skillName} <span className="ml-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">{skillLevel}</span>
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

            {/* Timeline milestone items */}
            <div className="relative pl-3 space-y-6 pt-4 border-t border-slate-100">
              <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-100 rounded-full z-0"></div>

              {roadmap.map((step: any, idx: number) => {
                const isCompleted = step.status === 'Completed' || step.status === 'completed';
                const isActive = step.status === 'In Progress' || step.status === 'active';

                const totalPoints = step.points ? step.points.length : 0;
                const completedPoints = step.points ? step.points.filter((p: any) => p.status === 'Completed').length : 0;
                const isCollapsedByDefault = isCompleted || (completedPoints === totalPoints && totalPoints > 0);
                const isCurrentlyCollapsed = collapsedChecklists[step.name] !== undefined
                  ? collapsedChecklists[step.name]
                  : isCollapsedByDefault;

                // Check if user already possesses the milestone skill
                const hasAcquiredSkill = step.skill && studentSkills.some(s => s.skill.toLowerCase() === step.skill.toLowerCase());
                const showRevisionPrompt = isActive && hasAcquiredSkill && !revisedMilestones[step.name];

                return (
                  <div key={idx} className={`relative z-10 flex gap-4 ${!isActive && !isCompleted ? 'opacity-65' : ''}`}>
                    <div className="flex-shrink-0 mt-1.5 relative z-10 bg-white">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : isActive ? (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-50 animate-pulse"></span>
                        </div>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-300 ml-0.5" />
                      )}
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm font-bold ${isActive ? 'text-slate-900 font-extrabold' : 'text-slate-700'}`}>
                            {step.title}
                          </h4>
                          {step.is_mandatory === 1 && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-50 text-red-600 border border-red-100 rounded">
                              Mandatory
                            </span>
                          )}
                          {step.milestone_type && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded uppercase font-mono">
                              {step.milestone_type}
                            </span>
                          )}
                          {totalPoints > 0 && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 rounded">
                              {completedPoints}/{totalPoints} Tasks
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{step.date}</span>
                      </div>

                      {/* Display revision skip prompt if they already know the skill */}
                      {showRevisionPrompt ? (
                        <div className="mt-3 bg-amber-50 border border-amber-200/80 rounded-xl p-4 shadow-sm animate-fade-in">
                          <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-xs font-bold text-amber-800">Skill already in your Profile!</h5>
                              <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                                You already have the skill <strong className="font-bold">{step.skill}</strong> in your ledger. Would you like to revise this milestone, or skip it?
                              </p>
                              <div className="flex gap-2.5 mt-3">
                                <button
                                  onClick={() => setRevisedMilestones({ ...revisedMilestones, [step.name]: true })}
                                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-md transition-colors flex items-center gap-1"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  Yes, Revise
                                </button>
                                <button
                                  onClick={() => handleCompleteMilestone(step.name)}
                                  className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md transition-colors flex items-center gap-1 shadow-sm"
                                >
                                  <SkipForward className="w-3 h-3" />
                                  No, Skip & Complete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs font-medium text-slate-500 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/60">
                            <div>
                              <span className="font-bold text-slate-400">Skill: </span>
                              <span className="text-slate-700">{step.skill} ({step.required_skill_level})</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-400">Category: </span>
                              <span className="text-slate-700">{step.category}</span>
                            </div>
                            {step.objective && (
                              <div className="col-span-1 md:col-span-2">
                                <span className="font-bold text-slate-400">Objective: </span>
                                <span className="text-slate-700">{step.objective}</span>
                              </div>
                            )}
                            {step.project && (
                              <div className="col-span-1 md:col-span-2">
                                <span className="font-bold text-slate-400">Practical Project: </span>
                                <span className="text-emerald-700 font-semibold">{step.project}</span>
                              </div>
                            )}
                            {step.linked_resource && (
                              <div className="col-span-1 md:col-span-2">
                                <span className="font-bold text-slate-400">Resource: </span>
                                <span className="text-blue-700 font-semibold">{step.linked_resource}{step.linked_resource_type ? ` (${step.linked_resource_type})` : ""}</span>
                              </div>
                            )}
                            {!step.linked_resource && step.linked_resource_type && (
                              <div className="col-span-1 md:col-span-2">
                                <span className="font-bold text-slate-400">Resource Type: </span>
                                <span className="text-slate-700">{step.linked_resource_type}</span>
                              </div>
                            )}
                          </div>

                          {/* Milestone Checklist Sub-Tasks */}
                          {totalPoints > 0 && (
                            <div className="mt-4 bg-slate-50/80 rounded-xl p-4 border border-slate-200/60">
                              <button
                                onClick={() => {
                                  setCollapsedChecklists(prev => ({
                                    ...prev,
                                    [step.name]: !isCurrentlyCollapsed
                                  }));
                                }}
                                className="w-full flex justify-between items-center text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono hover:text-slate-900 transition-colors focus:outline-none select-none"
                              >
                                <span className="flex items-center gap-1.5">
                                  📋 Checklist Tasks ({completedPoints}/{totalPoints})
                                </span>
                                {isCurrentlyCollapsed ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                ) : (
                                  <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                )}
                              </button>

                              {!isCurrentlyCollapsed && (
                                <div className="space-y-2 mt-3 animate-fade-in">
                                  {step.points.map((pt: any, ptIdx: number) => {
                                    const ptCompleted = pt.status === "Completed";
                                    const isPtClickable = isActive || isCompleted;
                                    return (
                                      <div
                                        key={ptIdx}
                                        onClick={() => {
                                          if (isPtClickable) {
                                            handleTogglePoint(step.title, pt.point_title, pt.status);
                                          }
                                        }}
                                        className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-200 ${ptCompleted
                                          ? "bg-emerald-50/40 border-emerald-100/60 text-emerald-800"
                                          : "bg-white border-slate-200/80 text-slate-700 hover:border-slate-300"
                                          } ${isPtClickable ? "cursor-pointer active:scale-[0.99] hover:bg-slate-50/50" : "cursor-not-allowed opacity-75"}`}
                                      >
                                        <div className="mt-0.5">
                                          {ptCompleted ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                          ) : (
                                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                                          )}
                                        </div>
                                        <span className={`text-xs font-semibold ${ptCompleted ? "line-through opacity-60" : ""}`}>
                                          {pt.point_title}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Complete Milestone Action Button */}
                          {isActive && (
                            <div className="mt-3 flex justify-end">
                              {totalPoints > 0 ? (
                                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/50 flex items-center gap-1.5 font-mono">
                                  🤖 Complete checklist to finish milestone
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleCompleteMilestone(step.name)}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Mark Completed
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>


          {/* Alternate Paths side lists - Hidden temporarily as requested */}
          {false && (
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
                    Based on your skill gap profile, add <span className="text-white font-bold">Deep Learning</span> next — it will boost your ML career readiness score by ~30%.
                  </p>
                  <div className="flex items-center gap-3 relative z-10">
                    <button className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1">
                      Accept
                    </button>
                    <button onClick={() => setInWizardMode(true)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-md transition-colors">
                      Explore Paths
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Alternate Paths list */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-slate-800">Other Career Paths</h3>
                </div>

                <div className="space-y-4">
                  {alternatePaths.map((path: any, idx: number) => (
                    <div key={`${path.title}-${idx}`} className="group cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{path.title}</h4>
                          {path.targetRole && (
                            <p className="text-xs text-slate-500 mt-0.5">Target: {path.targetRole}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm text-blue-600">
                            {path.fitScore}%
                          </div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 font-mono">Fit Score</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 my-2">
                        {path.difficulty && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded border border-slate-200/40">
                            {path.difficulty}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        {activePathTitle?.toLowerCase() === path.title?.toLowerCase() ? (
                          <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default">
                            Active
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEnrollPath(path.title, "Standard");
                              }}
                              disabled={enrollingPath !== null}
                              className="px-3 py-1.5 text-xs font-bold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/60 transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {enrollingPath === path.title ? (
                                <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                              ) : null}
                              <span>Standard Setup</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEnrollPath(path.title, "AI");
                              }}
                              disabled={enrollingPath !== null}
                              className="px-3 py-1.5 text-xs font-bold rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow active:scale-95 transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {enrollingPath === path.title ? (
                                <Loader2 className="w-3 h-3 animate-spin text-white" />
                              ) : (
                                <span className="text-[11px]">🤖</span>
                              )}
                              <span>Generate AI Roadmap</span>
                            </button>
                          </>
                        )}
                      </div>
                      <div className="w-full h-[1px] bg-slate-100 mt-4 group-last:hidden"></div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
