"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

import { 
  Briefcase, 
  Send, 
  CheckCircle2, 
  Calendar,

  MapPin, 
  Clock, 
  IndianRupee,
  Loader2,
  Info,
  Building2,
  Globe,
  Zap,
  Target,
  GraduationCap,
  X,
  Search
} from "lucide-react";
import StatsWidget from "@/components/dashboards/widgets/StatsWidget";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getStudentInternshipList, createStudentApplication, getStudentByEmail } from "@/services/student.services";
import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/components/ui/use-toast"; // use-toast not available


const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};


export default function InternshipTabContent() {
  const { currentUser } = useAuth();
  // const { toast } = useToast();
  const [internships, setInternships] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({ total_internships: 0, scheduled_interview_count: 0 });
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [successfullyApplied, setSuccessfullyApplied] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInternships();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      let course = null;
      let department = null;
      let academicYear = null;

      if (currentUser) {
        try {
          const studentRes = await getStudentByEmail(currentUser);
          const profile = studentRes?.message?.data || studentRes?.data || {};
          course = profile.course || null;
          department = profile.department || null;
          academicYear = profile.current_year || profile.academic_year || null;
        } catch (err) {
          console.error("Error fetching student profile:", err);
        }
      }

      const response = await getStudentInternshipList(currentUser || undefined, course, department, academicYear, search);
      const dataContainer = (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) ? response : (response?.message && typeof response.message === 'object' ? response.message : response);
      const internshipData = dataContainer?.data?.internships || dataContainer?.internships || [];
      const stats = dataContainer?.data?.statistics || dataContainer?.statistics || {};
      setInternships(Array.isArray(internshipData) ? internshipData : []);
      setStatistics({
        total_internships: stats.total_internships ?? internshipData.length,
        scheduled_interview_count: stats.scheduled_interview_count ?? 0,
      });
    } catch (err) {
      console.error("Error fetching internships:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internship: any) => {
    if (!currentUser) {
      alert("Authentication Required: Please log in to apply for internships.");
      return;
    }


    try {
      setApplying(internship.name);
      const payload = {
        student: currentUser,
        internship: internship.name,
        industry: internship.industry,
        status: "Applied",
        applied_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
        match_score: 100.0,
      };

      const response = await createStudentApplication(payload);

      if (response && (response.status === 200 || response.status === "200")) {
        setSuccessfullyApplied(prev => [...prev, internship.name]);
        setFeedback({
          type: 'success',
          message: `Application sent successfully for ${internship.role_name || internship.title || 'the internship'}!`
        });
        // Refresh the list to update statuses from the server
        fetchInternships();
      } else {
        // Handle non-200 responses (e.g., 409 Conflict)
        setFeedback({
          type: 'error',
          message: response?.message || "Something went wrong. Please try again."
        });
      }
      
      setTimeout(() => setFeedback(null), 5000);

    } catch (err: any) {
      console.error("Application error:", err);
      setFeedback({
        type: 'error',
        message: err?.message || "Something went wrong. Please try again."
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setApplying(null);
    }

  };

  // Helper for status styling
  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'applied':
        return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", label: "Applied" };
      case 'shortlisted':
        return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", label: "Shortlisted" };
      case 'interview scheduled':
        return { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", label: "Interview Scheduled" };
      case 'tech interview':
        return { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", label: "Tech Interview" };
      case 'rejected':
        return { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", label: "Rejected" };
      case 'selected':
        return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", label: "Selected" };
      default:
        return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100", label: status || "N/A" };
    }
  };

  // Stats data - from API statistics
  const statsData = [
    {
      id: 1,
      title: "APPLIED",
      value: internships.filter(i => i.applied_status === "Applied").length.toString(),
      icon: Send,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: 2,
      title: "SHORTLISTED",
      value: internships.filter(i => i.applied_status === "Shortlisted").length.toString(),
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      id: 3,
      title: "INTERVIEWS",
      value: statistics.scheduled_interview_count.toString(),
      icon: Calendar,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: 4,
      title: "MATCHING OPENINGS",
      value: (statistics.total_internships || internships.length).toString(),
      icon: Briefcase,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  if (loading && internships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-medium">Fetching best internship opportunities...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Internship Openings</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 opacity-90 font-outfit">
            Apply to top-tier internship opportunities matching your career track
          </p>
        </div>
        
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search internships..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus-visible:ring-orange-500 focus-visible:border-orange-500 shadow-sm"
          />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <StatsWidget
            key={stat.id}
            title={stat.title}
            data={{
              value: stat.value,
              icon: stat.icon,
              iconBg: stat.iconBg,
              iconColor: stat.iconColor
            }}
          />
        ))}
      </motion.div>

      {/* Internships Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {internships.map((internship, idx) => (
          <BaseCard key={internship.name || idx} padding="none" className="h-full flex flex-col justify-between overflow-hidden border-slate-200 hover:shadow-lg transition-all group">
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Header with Logo and Match */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg font-bold text-orange-600 group-hover:scale-105 transition-transform shadow-sm`}>
                      {(internship.role_name || internship.title || "I")[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 line-clamp-1">{internship.role_name || internship.title || "Internship Role"}</h3>
                      <p className="text-xs text-slate-500 font-medium">{internship.industry || "Industry Partner"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 mt-1">
                    <div className={`text-lg font-bold text-emerald-600`}>
                      {internship.match_score || 100}%
                    </div>
                    <Badge className={`${
                      internship.status?.toLowerCase() === "closed"
                        ? "bg-red-50 text-red-600 border-red-100" 
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    } rounded-full text-[9px] px-2 py-0.5 font-bold border`}>
                      {internship.status || "Active"}
                    </Badge>
                    {internship.applied_status && internship.applied_status !== "Not Applied" && (
                      <Badge className={`${getStatusConfig(internship.applied_status).bg} ${getStatusConfig(internship.applied_status).text} ${getStatusConfig(internship.applied_status).border} rounded-full text-[9px] px-2 py-0.5 font-bold border animate-pulse`}>
                        {internship.applied_status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Details Row */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1 text-[10px] font-bold">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {internship.work_mode || internship.location || "Remote"}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1 text-[10px] font-bold">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {internship.duration ? `${internship.duration} Days` : "3 Months"}
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-[10px] font-bold">
                    <IndianRupee className="w-3 h-3" />
                    {internship.stipend ? `₹${internship.stipend.toLocaleString('en-IN')}` : "Best in Industry"}
                  </Badge>
                  {internship.openings && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 text-[10px] font-bold">
                      {internship.openings} Opening{internship.openings !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3 line-clamp-2 h-9 opacity-85">
                  {internship.description || "Explore exciting internship opportunities and grow your career with industry partners."}
                </p>

                {/* Skills Tags */}
                {internship.skills && internship.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {internship.skills.slice(0, 4).map((s: any, si: number) => (
                      <span key={si} className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                        {s.skill}
                      </span>
                    ))}
                    {internship.skills.length > 4 && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        +{internship.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <Button 
                  onClick={() => handleApply(internship)}
                  disabled={
                    applying === internship.name || 
                    internship.status?.toLowerCase() === "closed" || 
                    successfullyApplied.includes(internship.name) ||
                    (internship.applied_status && internship.applied_status !== "Not Applied")
                  }
                  className={`flex-1 ${
                    internship.status?.toLowerCase() === "closed"
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : (internship.applied_status && internship.applied_status !== "Not Applied") || successfullyApplied.includes(internship.name)
                      ? `${getStatusConfig(internship.applied_status || "Applied").bg} ${getStatusConfig(internship.applied_status || "Applied").text} border ${getStatusConfig(internship.applied_status || "Applied").border} shadow-sm`
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/10 active:scale-95"
                  } font-bold rounded-xl h-10 transition-all`}
                >
                  {applying === internship.name ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (successfullyApplied.includes(internship.name) || (internship.applied_status && internship.applied_status !== "Not Applied")) ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  ) : null}
                  {successfullyApplied.includes(internship.name) || (internship.applied_status && internship.applied_status !== "Not Applied") 
                    ? (internship.applied_status && internship.applied_status !== "Not Applied" ? internship.applied_status : "Applied") 
                    : "Apply Now"}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedInternship(internship);
                    setShowDetails(true);
                  }}
                  className="px-4 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-10 font-bold text-xs"
                >
                  Details
                </Button>
              </div>
            </div>
          </BaseCard>
        ))}
      </motion.div>

      {/* Details Modal */}
      {showDetails && selectedInternship && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100"
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedInternship.title || "Internship Details"}</h2>
                  <p className="text-sm text-slate-500 font-semibold">{selectedInternship.industry || "Industry Partner"}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Core Info */}
                <div className="space-y-6">
                  <section>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Info className="w-3 h-3" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
                            <p className="text-sm font-bold text-slate-700">{selectedInternship.location || "Remote"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <IndianRupee className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Stipend</p>
                            <p className="text-sm font-bold text-slate-700">₹{selectedInternship.stipend || "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
                            <p className="text-sm font-bold text-slate-700">{selectedInternship.duration ? `${selectedInternship.duration} Days` : "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Target className="w-3 h-3" /> Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedInternship.skills) && selectedInternship.skills.length > 0 ? (
                        selectedInternship.skills.map((s: any, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-white border-slate-200 text-slate-700 px-3 py-1 text-[11px] font-bold rounded-lg">
                            {s.skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No specific skills listed</p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right Column: Descriptions */}
                <div className="space-y-6">
                  <section>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> About the Internship
                    </h3>
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {selectedInternship.description || "No description provided by the industry partner."}
                      </p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <GraduationCap className="w-3 h-3" /> Eligibility
                    </h3>
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                      <p className="text-sm text-slate-600 font-bold">
                        {selectedInternship.eligibility || "Open to all relevant backgrounds."}
                      </p>
                    </div>
                  </section>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                      <p className="text-[10px] font-bold text-orange-400 uppercase">Openings</p>
                      <p className="text-lg font-bold text-orange-600">{selectedInternship.openings || 0}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Start Date</p>
                      <p className="text-sm font-bold text-blue-600">{selectedInternship.start_date || "TBD"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-50 flex items-center justify-end gap-3 bg-slate-50/50">
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(false)}
                className="px-8 h-12 rounded-xl text-sm font-bold border-slate-200 text-slate-600 hover:bg-white transition-all"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  handleApply(selectedInternship);
                  setShowDetails(false);
                }}
                disabled={
                  applying === selectedInternship.name || 
                  selectedInternship.status?.toLowerCase() === "closed" || 
                  successfullyApplied.includes(selectedInternship.name) ||
                  (selectedInternship.applied_status && selectedInternship.applied_status !== "Not Applied")
                }
                className={`px-10 h-12 rounded-xl text-sm font-bold ${
                  selectedInternship.status?.toLowerCase() === "closed"
                    ? "bg-slate-100 text-slate-400 border-slate-200"
                    : (selectedInternship.applied_status && selectedInternship.applied_status !== "Not Applied") || successfullyApplied.includes(selectedInternship.name)
                    ? `${getStatusConfig(selectedInternship.applied_status || "Applied").bg} ${getStatusConfig(selectedInternship.applied_status || "Applied").text} border ${getStatusConfig(selectedInternship.applied_status || "Applied").border}`
                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/10"
                } transition-all`}
              >
                {successfullyApplied.includes(selectedInternship.name) || (selectedInternship.applied_status && selectedInternship.applied_status !== "Not Applied") 
                  ? (selectedInternship.applied_status && selectedInternship.applied_status !== "Not Applied" ? selectedInternship.applied_status : "Applied") 
                  : "Apply Now"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {internships.length === 0 && !loading && (
        <div className="py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-3xl">
          <Briefcase className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Openings Found</h3>
          <p className="text-sm text-slate-500 max-w-xs text-center mt-2">
            We couldn't find any internships matching your profile right now. Check back later!
          </p>
        </div>
      )}
    </motion.div>
  );
}