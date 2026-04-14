"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

import {
  Briefcase,
  Target,
  Trophy,
  Users,
  Clock,
  ArrowRight,
  Loader2,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStudentProjectList, createStudentProjectEnrollment } from "@/services/student.services";
import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/components/ui/use-toast"; // use-toast not available


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


export default function ProjectsTabContent() {
  const { currentUser } = useAuth();
  // const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [successfullyEnrolled, setSuccessfullyEnrolled] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);



  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getStudentProjectList();
      const projectData = response?.message?.data || response?.data || response || [];
      setProjects(Array.isArray(projectData) ? projectData : []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (project: any) => {
    if (!currentUser) {
      alert("Authentication Required: Please log in to enroll in projects.");
      return;
    }


    try {
      setEnrolling(project.name);
      const payload = {
        student: currentUser,
        project: project.project_name,
        status: "Applied",
        applied_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
        resume: null,
        match_score: 0.0,
        notes: "Enrolled from Student Dashboard",
        industry: project.industry
      };

      const response = await createStudentProjectEnrollment(payload);
      
      if (response && (response.status === 200 || response.status === "200")) {
        setSuccessfullyEnrolled(prev => [...prev, project.name]);
        setFeedback({
          type: 'success',
          message: `Successfully enrolled in ${project.project_name}!`
        });
      } else {
        // Handle non-200 responses (e.g., 409 Conflict)
        setFeedback({
          type: 'error',
          message: response?.message || "Something went wrong. Please try again."
        });
      }
      setTimeout(() => setFeedback(null), 5000);


    } catch (err: any) {
      console.error("Enrollment error:", err);
      setFeedback({
        type: 'error',
        message: err?.message || "Something went wrong. Please try again."
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setEnrolling(null);
    }

  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-medium tracking-wide">Loading available projects...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {feedback && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          } text-sm font-medium mb-4 flex items-center justify-between`}
        >
          {feedback.message}
          <button onClick={() => setFeedback(null)} className="ml-4 opacity-50 hover:opacity-100">×</button>
        </motion.div>
      )}

      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row items-center justify-between gap-6 px-1">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Industry Projects & R&D</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1.5 opacity-90 font-outfit">
            Work on real-world challenges from top companies and earn certificates
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "AVAILABLE PROJECTS", value: projects.length.toString(), icon: Briefcase, color: "orange" },

          { label: "MY ENROLLMENTS", value: "0", icon: Target, color: "blue" },
          { label: "COMPLETED", value: "0", icon: CheckCircle2, color: "emerald" },
          { label: "CERTIFICATIONS", value: "0", icon: Trophy, color: "purple" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all border-t-4 ${
              stat.color === 'orange' ? 'border-t-orange-400' : 
              stat.color === 'blue' ? 'border-t-blue-400' : 
              stat.color === 'emerald' ? 'border-t-emerald-400' : 'border-t-purple-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${
                stat.color === 'orange' ? 'bg-orange-50' : 
                stat.color === 'blue' ? 'bg-blue-50' : 
                stat.color === 'emerald' ? 'bg-emerald-50' : 'bg-purple-50'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'orange' ? 'text-orange-500' : 
                  stat.color === 'blue' ? 'text-blue-500' : 
                  stat.color === 'emerald' ? 'text-emerald-500' : 'text-purple-500'
                }`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>


      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <motion.div key={project.name || idx} variants={item}>
            <BaseCard padding="none" className="overflow-hidden group hover:border-orange-200 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                    <Briefcase className="w-7 h-7 text-orange-500" />
                  </div>

                  <Badge className={`${
                    project.status?.toLowerCase() === "disabled" || project.status?.toLowerCase() === "disable"
                      ? "bg-red-50 text-red-600 border-red-100" 
                      : project.status === "Active" || project.status === "active" || !project.status
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-indigo-50 text-indigo-600 border-indigo-100"
                  } rounded-full text-[10px] px-3 py-1 font-bold`}>
                    {project.status || "Active"}
                  </Badge>



                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {project.project_name}
                </h3>

                <p className="text-[11px] text-slate-900 font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5 opacity-80">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-sm"></span>
                  {project.industry}
                </p>



                <p className="text-sm text-slate-900 leading-relaxed font-medium mb-6 line-clamp-2 h-10 opacity-80">

                  {project.description || "Contribute to real-world industrial projects and build your portfolio with top industry mentors."}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2.5 bg-slate-100/30 p-2.5 rounded-xl border border-slate-100/50">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Duration</span>
                      <span className="text-xs font-bold text-slate-900">{project.duration} Days</span>

                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-slate-100/30 p-2.5 rounded-xl border border-slate-100/50">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Deadline</span>
                      <span className="text-xs font-bold text-slate-900">{project.end_date?.split("-").reverse().join("/") || "TBA"}</span>

                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => handleEnroll(project)}
                    disabled={enrolling === project.name || project.status?.toLowerCase() === "disabled" || project.status?.toLowerCase() === "disable"}
                    className={`flex-1 ${
                      project.status?.toLowerCase() === "disabled" || project.status?.toLowerCase() === "disable"
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 translate-y-0 hover:-translate-y-0.5"


                    } font-bold h-11 rounded-xl transition-all text-xs`}
                  >
                    {enrolling === project.name ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : successfullyEnrolled.includes(project.name) ? (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    ) : project.status?.toLowerCase() === "disabled" || project.status?.toLowerCase() === "disable" ? null : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    {project.status?.toLowerCase() === "disabled" || project.status?.toLowerCase() === "disable" 
                      ? "Disabled" 
                      : successfullyEnrolled.includes(project.name) 
                      ? "Enrolled" 
                      : "Enroll Now"}
                  </Button>



                </div>
              </div>
            </BaseCard>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-[2rem]">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Projects Available</h3>
          <p className="text-slate-500 max-w-sm text-center mt-2 font-medium">
            Check back soon for new industry projects and research opportunities.
          </p>
        </div>
      )}
    </motion.div>
  );
}
