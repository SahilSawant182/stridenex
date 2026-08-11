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
  CheckCircle2,
  Search
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { OfferLetterModal } from "@/components/dashboards/shared/OfferLetterModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getStudentProjectList, applyOpportunity, getStudentByEmail, getStudentApplications, updateApplicationStatus } from "@/services/student.services";
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
  const [studentApplications, setStudentApplications] = useState<any[]>([]);
  const [acceptingOffer, setAcceptingOffer] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({ total_projects: 0, total_applied: 0, total_completed: 0, total_awarded: 0 });
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Offer Letter State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPdfUrl, setOfferPdfUrl] = useState<string | null>(null);
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [selectedOfferApp, setSelectedOfferApp] = useState<{item: any, type: string} | null>(null);
  const [rejectingOffer, setRejectingOffer] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const getApplicationName = (item: any, type: string) => {
    if (item.application) return item.application;
    if (item.application_name) return item.application_name;
    if (item.application_id) return item.application_id;
    
    const match = studentApplications.find(app => {
      if (type === "Internship") {
        return app.internship === item.name;
      }
      if (type === "Project") {
        return app.project === item.name;
      }
      if (type === "Job") {
        return app.job_profile === item.name;
      }
      return false;
    });
    return match?.name || null;
  };

  const handleAcceptOffer = async (item: any, type: string) => {
    const appName = getApplicationName(item, type);
    if (!appName) {
      alert("Application ID not found. Please try refreshing the page.");
      return;
    }
    
    if (!confirm("Are you sure you want to accept this offer?")) {
      return;
    }

    try {
      setAcceptingOffer(item.name);
      await updateApplicationStatus(appName, "Accepted");
      alert("Congratulations! You have accepted the offer.");
      fetchProjects();
    } catch (err: any) {
      console.error("Error accepting offer:", err);
      alert(err.message || "Failed to accept the offer. Please try again.");
    } finally {
      setAcceptingOffer(null);
      setShowOfferModal(false);
    }
  };

  const handleRejectOffer = async (item: any, type: string) => {
    const appName = getApplicationName(item, type);
    if (!appName) return;
    
    if (!confirm("Are you sure you want to reject this offer? This action cannot be undone.")) return;

    try {
      setRejectingOffer(item.name);
      await updateApplicationStatus(appName, "Rejected");
      alert("You have rejected the offer.");
      fetchProjects();
    } catch (err: any) {
      console.error("Error rejecting offer:", err);
      alert(err.message || "Failed to reject the offer. Please try again.");
    } finally {
      setRejectingOffer(null);
      setShowOfferModal(false);
    }
  };

  const handleViewOfferLetter = async (item: any, type: string) => {
    setSelectedOfferApp({ item, type });
    setShowOfferModal(true);
    setLoadingOffer(true);
    setOfferPdfUrl(null);
    
    try {
      const queryParams = new URLSearchParams({
        student: currentUser || "",
        name: item.name || "",
        offer_type: type || "",
        template: type || ""
      }).toString();
      
      const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
      const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
      const authHeader: Record<string, string> = apiKey && apiSecret ? { "Authorization": `token ${apiKey}:${apiSecret}` } : {};
      
      const response = await fetch(`https://devstridenex.quantcloud.in/api/method/stridenex_app.api_stridenex_app.app.get_offer_letter?${queryParams}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...authHeader
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to load offer letter");
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setOfferPdfUrl(url);
    } catch (err: any) {
      console.error(err);
      alert("Could not load the offer letter.");
      setShowOfferModal(false);
    } finally {
      setLoadingOffer(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'applied':
        return { bg: "bg-blue-50 text-blue-600 border-blue-100", label: "Applied" };
      case 'shortlisted':
        return { bg: "bg-purple-50 text-purple-700 border-purple-200", label: "Shortlisted" };
      case 'selected':
        return { bg: "bg-amber-50 text-amber-600 border-amber-100", label: "Selected" };
      case 'awarded':
        return { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Awarded" };
      case 'accepted':
        return { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", label: "Accepted" };
      default:
        return { bg: "bg-slate-50 text-slate-600 border-slate-100", label: status };
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const studentEmail = localStorage.getItem("userEmail") || currentUser || "";
      
      let course = null;
      let department = null;
      let academicYear = null;

      if (studentEmail) {
        try {
          const studentRes = await getStudentByEmail(studentEmail);
          const profile = studentRes?.message?.data || studentRes?.data || {};
          course = profile.course || null;
          department = profile.department || null;
          academicYear = profile.current_year || profile.academic_year || null;
        } catch (err) {
          console.error("Error fetching student profile:", err);
        }
      }

      const response = await getStudentProjectList(studentEmail, course, department, academicYear, search);
      const dataContainer = (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) ? response : (response?.message && typeof response.message === 'object' ? response.message : response);
      const mappedProjects = dataContainer?.data?.projects || dataContainer?.projects || [];

      const stats = dataContainer?.data?.statistics || dataContainer?.statistics || {};
      const activeProjectsCount = mappedProjects.filter(
        (p: any) => p.status === "Active" || p.status === "active" || !p.status
      ).length;

      setProjects(mappedProjects);
      setStatistics({
        total_projects: activeProjectsCount,
        total_applied: stats.total_applied ?? 0,
        total_completed: stats.total_completed ?? 0,
        total_awarded: stats.total_awarded ?? 0,
      });
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (project: any) => {
    const { name, project_name } = { ...project };

    if (!currentUser) {
      alert("Authentication Required: Please log in to enroll in projects.");
      return;
    }

    try {
      setEnrolling(name);

      const payload = {
        student: currentUser,
        opportunity_type: "Project",
        opportunity_name: name,
        notes: "Interested in this project.",
      };

      const response = await applyOpportunity(payload);

      if (
        response &&
        (response.status === 200 ||
          response.status === "200" ||
          response.message?.status === 200)
      ) {
        setProjects(prev => prev.map(p => p.name === name ? { ...p, applied_status: "Applied" } : p));

        setFeedback({
          type: "success",
          message: `Successfully enrolled in ${project_name}!`,
        });
      } else {
        const errMsg = response && typeof response.message === 'object'
          ? response.message.message
          : response?.message;
        setFeedback({
          type: "error",
          message: errMsg || "Something went wrong. Please try again.",
        });
      }

      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      console.error("Enrollment error:", err);

      setFeedback({
        type: "error",
        message: err?.message || "Something went wrong. Please try again.",
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
          className={`p-4 rounded-xl border ${feedback.type === 'success'
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Industry Projects & R&D</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 opacity-90 font-outfit">
            Work on real-world challenges from top companies and earn certificates
          </p>
        </div>
        
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus-visible:ring-orange-500 focus-visible:border-orange-500 shadow-sm"
          />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[
          { label: "AVAILABLE PROJECTS", value: statistics.total_projects.toString(), icon: Briefcase, color: "orange" },
          { label: "APPLIED PROJECTS", value: statistics.total_applied.toString(), icon: Target, color: "blue" },
          { label: "COMPLETED", value: statistics.total_completed.toString(), icon: CheckCircle2, color: "emerald" },
          { label: "AWARDED", value: statistics.total_awarded.toString(), icon: Trophy, color: "purple" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className={`bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-all border-t-4 ${stat.color === 'orange' ? 'border-t-orange-400' :
              stat.color === 'blue' ? 'border-t-blue-400' :
                stat.color === 'emerald' ? 'border-t-emerald-400' : 'border-t-purple-400'
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color === 'orange' ? 'bg-orange-50' :
                stat.color === 'blue' ? 'bg-blue-50' :
                  stat.color === 'emerald' ? 'bg-emerald-50' : 'bg-purple-50'
                }`}>
                <stat.icon className={`w-5 h-5 ${stat.color === 'orange' ? 'text-orange-500' :
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
            <BaseCard padding="none" className="h-full flex flex-col justify-between overflow-hidden group hover:border-orange-200 transition-all duration-300">
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                      <Briefcase className="w-6 h-6 text-orange-500" />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <Badge className={`${
                        project.applied_status && project.applied_status !== "Not Applied"
                          ? "hidden"
                          : project.status?.toLowerCase() === "disabled" || project.status?.toLowerCase() === "disable"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        } rounded-full text-[10px] px-3 py-1 font-bold`}>
                        {project.status || "Active"}
                      </Badge>
                       {project.applied_status && project.applied_status !== "Not Applied" && (
                        <Badge className={`rounded-full text-[10px] px-3 py-1 font-bold shadow-sm whitespace-nowrap border ${getStatusConfig(project.applied_status).bg}`}>
                          {getStatusConfig(project.applied_status).label}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {project.project_name.trim()}
                  </h3>

                  <p className="text-[11px] text-slate-900 font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5 opacity-80">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-sm"></span>
                    {project.industry}
                  </p>

                  <p className="text-xs text-slate-900 leading-relaxed font-medium mb-3 line-clamp-2 h-9 opacity-80">
                    {project.description || "Contribute to real-world industrial projects and build your portfolio with top industry mentors."}
                  </p>

                  {/* Skills Tags */}
                  {project.skills && project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.skills.slice(0, 4).map((s: any, si: number) => (
                        <span key={si} className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                          {s.skill}
                        </span>
                      ))}
                      {project.skills.length > 4 && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          +{project.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 group-hover:bg-white transition-colors">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-1">Duration</span>
                          <span className="text-xs font-bold text-slate-900">{project.duration} Days</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 group-hover:bg-white transition-colors">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-1">App Deadline</span>
                          <span className="text-xs font-bold text-slate-900">
                            {project.application_deadline 
                              ? project.application_deadline.split("-").reverse().join("/") 
                              : "Open"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 group-hover:bg-white transition-colors">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-1">Project Period</span>
                        <span className="text-xs font-bold text-slate-900">
                          {project.start_date?.split("-").reverse().join("/") || "TBA"} — {project.end_date?.split("-").reverse().join("/") || "TBA"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleEnroll(project)}
                    disabled={
                      enrolling === project.name ||
                      project.status?.toLowerCase() === "disabled" ||
                      project.status?.toLowerCase() === "disable" ||
                      (project.applied_status && project.applied_status !== "Not Applied")
                    }
                    className={`flex-1 ${project.status?.toLowerCase() === "disabled" || project.status?.toLowerCase() === "disable"
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : (project.applied_status && project.applied_status !== "Not Applied")
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95 translate-y-0 hover:-translate-y-0.5"
                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 translate-y-0 hover:-translate-y-0.5"
                      } font-bold h-10 rounded-xl transition-all text-xs`}
                  >
                    {enrolling === project.name ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (project.applied_status && project.applied_status !== "Not Applied") ? (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    ) : project.status?.toLowerCase() === "disabled" || project.status?.toLowerCase() === "disable" ? null : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    {project.status?.toLowerCase() === "disabled" || project.status?.toLowerCase() === "disable"
                      ? "Disabled"
                      : (project.applied_status && project.applied_status !== "Not Applied")
                        ? String(project.applied_status)
                        : "Apply Now"}
                  </Button>

                  {project.applied_status?.toLowerCase() === "selected" && (
                    <Button 
                      onClick={() => handleViewOfferLetter(project, "Project")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 rounded-xl transition-all text-xs px-4"
                    >
                      View Offer Letter
                    </Button>
                  )}
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
      {/* Offer Letter Modal */}
      <OfferLetterModal 
        isOpen={showOfferModal}
        onClose={() => {
          setShowOfferModal(false);
          if (offerPdfUrl) URL.revokeObjectURL(offerPdfUrl);
        }}
        pdfUrl={offerPdfUrl}
        isLoading={loadingOffer}
        title="Project Offer Letter"
        isAccepting={!!(selectedOfferApp && acceptingOffer === selectedOfferApp.item.name)}
        isRejecting={!!(selectedOfferApp && rejectingOffer === selectedOfferApp.item.name)}
        onAccept={() => selectedOfferApp && handleAcceptOffer(selectedOfferApp.item, selectedOfferApp.type)}
        onReject={() => selectedOfferApp && handleRejectOffer(selectedOfferApp.item, selectedOfferApp.type)}
      />

    </motion.div>
  );
}
