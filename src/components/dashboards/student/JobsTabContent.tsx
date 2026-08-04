"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import {
  Briefcase,
  Target,
  Users,
  Clock,
  MapPin,
  Loader2,
  Calendar,
  Search,
  IndianRupee,
  CheckCircle2,
  FileText
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getJobProfiles, applyForJob } from "@/services/student.services";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

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

export default function JobsTabContent() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [applying, setApplying] = useState<string | null>(null);
  const [successfullyApplied, setSuccessfullyApplied] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [coverLetter, setCoverLetter] = useState("I am interested in this position.");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applyModalError, setApplyModalError] = useState<string | null>(null);

  useEffect(() => {
    // Load local storage applied jobs
    try {
      const stored = localStorage.getItem("applied_job_profiles");
      if (stored) {
        setSuccessfullyApplied(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading applied jobs from localStorage:", e);
    }
    fetchJobs();
  }, [currentUser]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobProfiles(currentUser || undefined);
      const dataObj = response?.data || response?.message?.data || response?.message || {};
      let list = [];
      if (Array.isArray(dataObj)) {
        list = dataObj;
      } else if (Array.isArray(dataObj?.data)) {
        list = dataObj.data;
      }
      // Filter out only active/open jobs if any status exists, or keep all
      setJobs(list);
    } catch (err) {
      console.error("Error fetching job profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    if (!search.trim()) return jobs;
    const s = search.toLowerCase();
    return jobs.filter(
      (job) =>
        (job.job_title && job.job_title.toLowerCase().includes(s)) ||
        (job.industry && job.industry.toLowerCase().includes(s)) ||
        (job.location && job.location.toLowerCase().includes(s))
    );
  }, [jobs, search]);

  const handleApply = (job: any) => {
    if (!currentUser) {
      alert("Authentication Required: Please log in to apply for jobs.");
      return;
    }
    setSelectedJob(job);
    setExpectedSalary("");
    setAvailableFrom("");
    setCoverLetter("I am interested in this position.");
    setResumeFile(null);
    setApplyModalError(null);
    setShowApplyModal(true);
  };

  const formatSalary = (from: any, to: any) => {
    if (!from && !to) return "Best in Industry";
    const formatVal = (val: any) => {
      const num = Number(val);
      if (num >= 100000) {
        return `${(num / 100000).toFixed(1)}L`;
      }
      return `${num}`;
    };
    return `₹${formatVal(from)} - ${formatVal(to)} LPA`;
  };

  const statsData = useMemo(() => {
    return [
      { id: "total", title: "Total Job Openings", value: filteredJobs.length, icon: Briefcase, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
      { id: "applied", title: "Applied Jobs", value: successfullyApplied.length, icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" }
    ];
  }, [filteredJobs.length, successfullyApplied.length]);

  if (loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading job opportunities...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Job Opportunities
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 opacity-90">
            Apply to full-time or part-time job openings matching your career path
          </p>
        </div>
        
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search jobs by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus-visible:ring-orange-500 focus-visible:border-orange-500 shadow-sm"
          />
        </div>
      </motion.div>

      {/* Stats Widgets */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statsData.map((stat) => (
          <div key={stat.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1 font-outfit">{stat.value}</h3>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Jobs Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job, idx) => {
          const isApplied = successfullyApplied.includes(job.name);
          return (
            <BaseCard key={job.name || idx} padding="none" className="h-full flex flex-col justify-between overflow-hidden border-slate-200 hover:shadow-lg transition-all group">
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg font-bold text-orange-600 group-hover:scale-105 transition-transform shadow-sm">
                        {(job.job_title || "J")[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 line-clamp-1">{job.job_title}</h3>
                        <p className="text-xs text-slate-500 font-medium">{job.industry}</p>
                      </div>
                    </div>
                    <div>
                      {isApplied && (
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-full text-[9px] px-2 py-0.5 font-bold border">
                          Applied
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1 text-[10px] font-bold">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location || "Pune"}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1 text-[10px] font-bold">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {job.employment_type || "Full Time"}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1 text-[10px] font-bold">
                      {job.experience || "Fresher"}
                    </Badge>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-[10px] font-bold">
                      {formatSalary(job.salary_from, job.salary_to)}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-600 leading-relaxed font-medium mb-3 line-clamp-2 h-9 opacity-85"
                       dangerouslySetInnerHTML={{ __html: job.job_description || "No description provided." }}>
                  </div>

                  {/* Skills required */}
                  {job.skills_required && job.skills_required.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills_required.slice(0, 3).map((s: any, si: number) => (
                        <span key={si} className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                          {s.skill}
                        </span>
                      ))}
                      {job.skills_required.length > 3 && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                          +{job.skills_required.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowDetails(true);
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
                  >
                    View Details
                  </button>
                  <Button
                    onClick={() => handleApply(job)}
                    disabled={isApplied || applying === job.name}
                    className={`h-9 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isApplied
                        ? "bg-slate-100 border border-slate-200 text-slate-400 hover:bg-slate-100 cursor-not-allowed shadow-none"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                  >
                    {applying === job.name ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isApplied ? (
                      "Applied"
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </div>
              </div>
            </BaseCard>
          );
        })}
        {filteredJobs.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-3xl">
            <Briefcase className="w-12 h-12 text-slate-200 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Job Openings</h3>
            <p className="text-xs text-slate-400 mt-1">Check back later for new job postings.</p>
          </div>
        )}
      </motion.div>

      {/* Details modal overlay */}
      {showDetails && selectedJob && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col border border-slate-100"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg font-bold text-orange-600">
                  {(selectedJob.job_title || "J")[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 leading-tight">{selectedJob.job_title}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{selectedJob.industry}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-600 transition-all active:scale-95"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[400px] space-y-5 hide-scrollbar">
              {/* Job Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary Range</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{formatSalary(selectedJob.salary_from, selectedJob.salary_to)}</p>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{selectedJob.location || "Pune"}</p>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{selectedJob.experience || "Fresher"}</p>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Openings</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{selectedJob.openings} positions</p>
                </div>
              </div>

              {/* Skills required */}
              {selectedJob.skills_required && selectedJob.skills_required.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skills_required.map((s: any, si: number) => (
                      <span key={si} className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg">
                        {s.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Description</h4>
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 leading-relaxed max-h-48 overflow-y-auto"
                     dangerouslySetInnerHTML={{ __html: selectedJob.job_description || "No description provided." }}>
                </div>
              </div>

              {/* Contact Information */}
              {(selectedJob.contact_person || selectedJob.contact_email || selectedJob.contact_phone) && (
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Details</h4>
                  <div className="space-y-1 text-xs font-semibold text-slate-600">
                    {selectedJob.contact_person && <p>Name: {selectedJob.contact_person}</p>}
                    {selectedJob.contact_email && <p>Email: {selectedJob.contact_email}</p>}
                    {selectedJob.contact_phone && <p>Phone: {selectedJob.contact_phone}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button
                onClick={() => setShowDetails(false)}
                className="h-10 px-5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                Close
              </button>
              <Button
                onClick={() => {
                  handleApply(selectedJob);
                  setShowDetails(false);
                }}
                disabled={successfullyApplied.includes(selectedJob.name) || applying === selectedJob.name}
                className="h-10 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl"
              >
                {successfullyApplied.includes(selectedJob.name) ? "Applied" : "Apply Now"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col border border-slate-100"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-md font-bold text-orange-600">
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 leading-tight">Apply for Job</h3>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{selectedJob.job_title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-600 transition-all active:scale-95"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!expectedSalary) {
                  setApplyModalError("Expected salary is required.");
                  return;
                }
                if (!availableFrom) {
                  setApplyModalError("Availability date is required.");
                  return;
                }
                if (!resumeFile) {
                  setApplyModalError("Please upload your resume.");
                  return;
                }

                setApplyModalError(null);
                setApplying(selectedJob.name);

                try {
                  const fd = new FormData();
                  fd.append("student", currentUser || "");
                  fd.append("job_profile", selectedJob.name);
                  fd.append("cover_letter", coverLetter);
                  fd.append("expected_salary", expectedSalary);
                  fd.append("available_from", availableFrom);
                  fd.append("resume", resumeFile);

                  await applyForJob(fd);

                  const updatedApplied = [...successfullyApplied, selectedJob.name];
                  setSuccessfullyApplied(updatedApplied);
                  localStorage.setItem("applied_job_profiles", JSON.stringify(updatedApplied));

                  alert("Applied Successfully!");
                  showToast(`Applied successfully for ${selectedJob.job_title}!`, "success");
                  setShowApplyModal(false);
                  setShowDetails(false);
                } catch (err: any) {
                  console.error("Apply error:", err);
                  setApplyModalError(err?.message || "Failed to submit application. Please try again.");
                } finally {
                  setApplying(null);
                }
              }}
              className="p-6 space-y-4"
            >
              {applyModalError && (
                <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold">
                  {applyModalError}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Expected Salary (Annual INR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 600000"
                  required
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Available From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm uppercase"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Cover Letter
                </label>
                <textarea
                  placeholder="Tell the employer why you're a great fit..."
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Resume (PDF / DOC / DOCX) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-orange-400/80 rounded-2xl p-4 transition-all relative flex flex-col items-center justify-center bg-slate-50/30">
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <FileText className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-500 text-center font-sans">
                    {resumeFile ? resumeFile.name : "Click to select or drag resume file"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="h-10 px-5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={applying !== null}
                  className="h-10 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/10"
                >
                  {applying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
