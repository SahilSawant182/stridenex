"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import { getStudentApplicationList, getStudentByEmail, updateApplicationStatus } from "@/services/industry.services";
import { useIndustry } from "@/context/IndustryContext";
import { useToast } from "@/context/ToastContext";
import { Loader2, Zap, Target } from "lucide-react";

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
  owner: string;
  status: string;
  studentEmail: string;
  internship: string;
  college: string;
  skills: string[];
  match: number;
}

export default function PipelineTabContent() {
  const { industryData, loading: industryLoading, error: industryError } = useIndustry();
  const { showToast } = useToast();
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
  const companyName = industryData?.company_name || "";

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);

  const handleCardClick = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSelectedStatus(candidate.status);
    setSelectedStudentEmail(candidate.studentEmail);
    setIsModalOpen(true);
    setLoadingDetails(true);
    setStudentDetails(null);
    try {
      const response = await getStudentByEmail(candidate.studentEmail);
      if (response && response.message && response.message.data) {
        setStudentDetails(response.message.data);
      } else {
        setStudentDetails(null);
      }
    } catch (err) {
      console.error("Failed to fetch student details", err);
    } finally {
      setLoadingDetails(false);
    }
  };


  const handleChangeStatus = async () => {
    if (!selectedCandidate) return;
    try {
      setUpdateStatusLoading(true);
      await updateApplicationStatus(selectedCandidate.id, selectedStatus);
      await fetchApplications(companyName);
      setSelectedCandidate(prev => prev ? { ...prev, status: selectedStatus } : null);
      showToast(`Status updated to ${selectedStatus}`, "success");
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err?.message || "Failed to update status", "error");
      console.error(err);
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const fetchApplications = useCallback(async (companyName: string) => {
    try {
      setLoading(true);
      const response = await getStudentApplicationList(companyName);

      // Resilient data extraction to ensure all items are listed
      const apiData =
        response?.data?.data ||
        response?.message?.data ||
        (Array.isArray(response?.data) ? response.data : []) ||
        [];

      if (Array.isArray(apiData)) {
        console.log(`Pipeline: Fetched ${apiData.length} applications for ${companyName}`);
        
        const newCandidates: Record<string, Candidate[]> = {
          "Applied": [],
          "Shortlisted": [],
          "Tech Interview": [],
          "HR": [],
          "Rejected": [],
          "Selected": [],
        };
        
        apiData.forEach((app: any) => {
          const email = app.student || "Student";
          const initials = email.charAt(0).toUpperCase();
          const bgColors = ["bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-indigo-500", "bg-orange-500", "bg-purple-500"];
          const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

          const candidate: Candidate = {
            id: app.name || Math.random().toString(),
            name: app.name || email.split('@')[0],
            owner: app.owner || app.modified_by || "Unknown",
            status: app.status || "Applied",
            studentEmail: app.student,
            internship: app.internship || "Unknown",
            initials: initials,
            bgColor: randomColor,
            college: app.college || "N/A",
            skills: app.applied_on ? [new Date(app.applied_on).toLocaleDateString()] : [],
            match: Math.round(app.match_score) || 0
          };
          
          if (newCandidates[candidate.status]) {
            newCandidates[candidate.status].push(candidate);
          } else {
            newCandidates["Applied"].push(candidate);
          }
        });
        
        setCandidates(newCandidates);
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
    // if (industryData?.company_name) {
    fetchApplications(companyName);
    // }
  }, [companyName, fetchApplications]);

  if (industryLoading || (loading && Object.values(candidates).every(arr => arr.length === 0))) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Syncing Pipeline Data...</p>
      </div>
    );
  }

  // Only show error if we have NO data to show
  if ((industryError || error) && Object.values(candidates).every(arr => arr.length === 0)) {
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
                  <div 
                    key={candidate.id} 
                    onClick={() => handleCardClick(candidate)}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full ${candidate.bgColor} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                        {candidate.initials}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h4 className="font-bold text-slate-800 text-sm truncate" title={candidate.name}>{candidate.name}</h4>
                        <p className="text-xs text-slate-500 font-semibold truncate" title={candidate.owner}>Owner: {candidate.owner}</p>
                        <p className="text-xs text-slate-500 font-semibold truncate flex items-center gap-1 mt-0.5" title={candidate.status}>
                          <span className={`w-2 h-2 rounded-full ${candidate.status === 'Applied' ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                          {candidate.status}
                        </p>
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

      {/* Student Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="bg-slate-900 border-b border-slate-100 flex items-center justify-between p-6 relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
               <div className="relative z-10 flex items-center gap-4">
                 <div className={`w-14 h-14 rounded-2xl ${selectedCandidate?.bgColor || 'bg-white/10'} border border-white/20 text-white flex items-center justify-center text-xl font-bold shadow-2xl`}>
                    {selectedCandidate?.initials || "S"}
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-white leading-tight">{selectedCandidate?.name || "Student Details"}</h2>
                   <p className="text-xs font-semibold text-slate-400 mt-1">{selectedCandidate?.college || "Application Record"}</p>
                 </div>
               </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="relative z-10 text-white/50 hover:text-white p-2.5 rounded-full hover:bg-white/10 transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50/50">
               {loadingDetails ? (
                <div className="flex justify-center items-center py-10">
                   <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                </div>
               ) : studentDetails ? (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                     {[
                       { label: "Email", value: studentDetails.name },
                       { label: "First Name", value: studentDetails.first_name },
                       { label: "Last Name", value: studentDetails.last_name },
                       { label: "College", value: studentDetails.college },
                       { label: "Stream", value: studentDetails.stream },
                       { label: "Course", value: studentDetails.course },
                     ].map((item, idx) => (
                       <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-1 last:border-0 last:mb-0 last:pb-0">
                         <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                         <span className="text-sm font-bold text-slate-800 text-right break-all sm:max-w-[200px]">{item.value || "N/A"}</span>
                       </div>
                     ))}
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mt-4">
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest text-left flex items-center gap-2 mb-4">
                      <Target className="w-4 h-4 text-orange-500" /> Update Pipeline Status
                    </h3>
                    <div className="flex flex-col gap-3 w-full">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <Zap className="h-4 w-4 text-slate-400" />
                        </div>
                        <select 
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none transition-all hover:bg-white hover:border-orange-200 cursor-pointer"
                        >
                           {pipelineColumns.map(col => (
                             <option key={col.id} value={col.id}>{col.title}</option>
                           ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                           <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                           </svg>
                        </div>
                      </div>
                      
                      {selectedStatus !== selectedCandidate?.status && (
                         <div className="pt-1">
                           <button 
                             onClick={handleChangeStatus}
                             disabled={updateStatusLoading}
                             className="w-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 active:scale-[0.98]"
                           >
                              {updateStatusLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : "Confirm Status Change"}
                           </button>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 font-medium">
                  No details found for this student.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
