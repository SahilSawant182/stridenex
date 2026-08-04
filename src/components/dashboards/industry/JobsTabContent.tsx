"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, Variants } from "framer-motion";
import {
  Plus,
  MapPin,
  Loader2,
  Briefcase,
  Calendar,
  Target,
  Users,
  Clock,
  IndianRupee,
  FileText,
  Zap,
  Globe,
  Award,
  CircleDot,
  Mail,
  Phone,
  User,
  Pen
} from "lucide-react";
import { getJobProfiles, createJobProfile, updateJobProfile, getMasterData, createSkill, getDepartmentsByCourse, uploadFile } from "@/services/industry.services";
import { useIndustry } from "@/context/IndustryContext";
import DashboardDynamicModal, { DynamicField } from "@/components/dashboards/shared/DashboardDynamicModal";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/context/ToastContext";
import { useSearchParams } from "next/navigation";



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
  const { industryData, loading: industryLoading } = useIndustry();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>({
    total: 0,
    page: 1,
    page_size: 7,
    total_pages: 1,
  });
  const PAGE_SIZE = 7;

  const companyName = industryData?.company_name || "";

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [modalValues, setModalValues] = useState<Record<string, any>>({});
  const [editingJob, setEditingJob] = useState<any>(null);

  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "post-new-job") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const fetchOptions = async (doctype: string, setter: (val: string[]) => void, extraPayload?: any) => {
    try {
      let data;
      if (extraPayload?.customUrl) {
        data = await getDepartmentsByCourse(extraPayload.customUrl.split('?courses=')[1]);
      } else {
        data = await getMasterData(doctype, extraPayload);
      }
      const apiData = data.message?.data || data.data || data.message || [];
      let mapField = "name";
      if (extraPayload?.fields) {
        mapField = Array.isArray(extraPayload.fields) ? extraPayload.fields[0] : extraPayload.fields;
      }
      let options = Array.isArray(apiData) ? apiData.map((item: any) => item[mapField] || item.name || item.department_name || item.department || item) : [];
      if (doctype === "Courses") {
        options = ["All", ...options];
      }
      setter(options);
    } catch (err) {
      console.error(`Error fetching ${doctype} options:`, err);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    } catch (e) {
      return dateString;
    }
    return dateString;
  };

  const jobFields: DynamicField[] = useMemo(() => [
    { name: "job_title", label: "Job Title", type: "text", icon: Briefcase, required: true, colSpan: 2, placeholder: "e.g. Python Developer" },
    { name: "industry", label: "Industry", type: "text", icon: Globe, required: true, placeholder: "e.g. CodeWorks Inc", disabled: true },
    { name: "experience", label: "Experience Required", type: "select", icon: Target, options: ["Fresher", "0-1 Years", "1-2 Years", "2-4 Years", "3-5 Years", "5+ Years"], required: true, placeholder: "Select Experience level" },
    { name: "employment_type", label: "Employment Type", type: "select", icon: Clock, options: ["Full Time", "Part Time", "Contract", "Internship", "Freelance"], required: true, placeholder: "Select Employment Type" },
    { name: "location", label: "Location", type: "text", icon: MapPin, required: true, placeholder: "e.g. Pune" },
    { name: "salary_from", label: "Salary From (LPA)", type: "number", icon: IndianRupee, required: true, placeholder: "e.g. 400000" },
    { name: "salary_to", label: "Salary To (LPA)", type: "number", icon: IndianRupee, required: true, placeholder: "e.g. 700000" },
    { name: "openings", label: "Openings", type: "number", icon: Users, required: true, placeholder: "e.g. 3" },
    { name: "last_date", label: "Last Date to Apply", type: "date", icon: Calendar, required: true, placeholder: "YYYY-MM-DD", textTransform: "uppercase", min: new Date().toISOString().split('T')[0] },
    { name: "contact_person", label: "Contact Person", type: "text", icon: User, required: false, placeholder: "e.g. John Doe" },
    { name: "contact_email", label: "Contact Email", type: "email", icon: Mail, required: false, placeholder: "e.g. john@example.com" },
    { name: "contact_phone", label: "Contact Phone", type: "text", icon: Phone, required: false, placeholder: "e.g. 9876543210" },

    { name: "status", label: "Status", type: "select", icon: Zap, options: ["Open", "Closed"], required: true, placeholder: "Select Status" },
    { name: "course", label: "Eligible Courses", type: "select", icon: Briefcase, options: courseOptions, required: true, placeholder: "Select Courses", multiple: true },
    { name: "department", label: "Eligible Departments", type: "select", icon: Briefcase, options: departmentOptions, required: true, placeholder: "Select Departments", multiple: true },
    {
      name: "skills_required",
      label: "Required Skills",
      type: "select",
      icon: Award,
      apiEndpoint: "method/stridenex_app.api_stridenex_app.college.master.get_master_data",
      apiParams: { doctype: "Skill" },
      required: true,
      colSpan: 2,
      placeholder: "Select Required Skills",
      multiple: true,
      allowCustom: true,
      customPlaceholder: "Enter custom skill...",
      onCreateCustomValue: async (val: string) => {
        try {
          await createSkill(val);
        } catch (err) {
          console.error("Failed to create skill record:", err);
          throw err;
        }
      }
    },
    { name: "job_description", label: "Job Description", type: "textarea", icon: FileText, required: true, colSpan: 2, placeholder: "Describe the roles and responsibilities..." },
  ], [courseOptions, departmentOptions]);

  const fetchJobs = async (industry: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJobProfiles(industry);
      const dataObj = response?.data || response?.message?.data || response?.message || {};

      let list = [];
      if (Array.isArray(dataObj)) {
        list = dataObj;
      } else if (Array.isArray(dataObj?.data)) {
        list = dataObj.data;
      }

      // Filter by company name just to be safe
      const filtered = list.filter((job: any) => job.industry === industry);

      setJobs(filtered);
      setPagination({
        total: filtered.length,
        page: currentPage,
        page_size: PAGE_SIZE,
        total_pages: Math.ceil(filtered.length / PAGE_SIZE) || 1,
      });
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      const isNotFound = err?.status === 404 || err?.message?.includes("not found");
      if (isNotFound) {
        setJobs([]);
      } else {
        setError("Failed to load job profiles. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyName) {
      fetchJobs(companyName);
    } else if (!industryLoading) {
      setLoading(false);
    }
  }, [companyName, industryLoading]);

  const displayedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return jobs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [jobs, currentPage]);

  const handleModalSubmit = async (formData: any) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const payload = {
        name: editingJob?.name || undefined,
        job_title: formData.job_title,
        industry: companyName,
        experience: formData.experience,
        job_description: formData.job_description,
        employment_type: formData.employment_type,
        location: formData.location,
        salary_from: Number(formData.salary_from),
        salary_to: Number(formData.salary_to),
        openings: Number(formData.openings),
        last_date: formData.last_date,
        contact_person: formData.contact_person,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        status: formData.status,
        is_active: 1,
        course: Array.isArray(formData.course) ? formData.course : (formData.course ? [formData.course] : []),
        department: Array.isArray(formData.department) ? formData.department : (formData.department ? [formData.department] : []),
        skills_required: Array.isArray(formData.skills_required)
          ? formData.skills_required.map((s: string) => ({ skill: s }))
          : []
      };

      if (editingJob) {
        await updateJobProfile(payload);
      } else {
        await createJobProfile(payload);
      }
      await fetchJobs(companyName);
      alert(`Job Profile ${editingJob ? 'Updated' : 'Created'} Successfully`);
      showToast(`Job Profile ${editingJob ? 'updated' : 'posted'} successfully`, "success");
      setIsModalOpen(false);
      setEditingJob(null);
    } catch (err: any) {
      console.error("Error saving job profile:", err);
      const msg = err?.message || `Failed to ${editingJob ? 'update' : 'post'} job profile`;
      setModalError(msg);
      showToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    if (fieldName === "skills_required" && skillOptions.length === 0) {
      fetchOptions("Skill", setSkillOptions);
    } else if (fieldName === "course" && courseOptions.length === 0) {
      fetchOptions("Courses", setCourseOptions);
    } else if (fieldName === "department" && departmentOptions.length === 0) {
      const courses = Array.isArray(modalValues.course) ? modalValues.course.join(',') : modalValues.course;
      if (courses) {
        fetchOptions("College Department", setDepartmentOptions, {
          customUrl: `method/stridenex_app.stridenex_app.doctype.college_department.college_department.get_departments_by_course?courses=${courses}`
        });
      }
    }
  };

  const handleValuesChange = (values: Record<string, any>, changedFieldName: string) => {
    setModalValues(values);
    if (changedFieldName === "course") {
      setDepartmentOptions([]);
    }
  };

  const formatSalary = (from: any, to: any) => {
    if (!from && !to) return "N/A";
    const formatVal = (val: any) => {
      const num = Number(val);
      if (num >= 100000) {
        return `${(num / 100000).toFixed(1)}L`;
      }
      return `${num}`;
    };
    return `₹${formatVal(from)} - ${formatVal(to)} LPA`;
  };

  const modalInitialValues = useMemo(() => {
    if (editingJob) {
      return {
        ...editingJob,
        industry: companyName || editingJob.industry || "",
        skills_required: Array.isArray(editingJob.skills_required)
          ? editingJob.skills_required.map((s: any) => s.skill || s)
          : [],
        course: Array.isArray(editingJob.course)
          ? editingJob.course.map((c: any) => c.course || c)
          : [],
        department: Array.isArray(editingJob.department)
          ? editingJob.department.map((d: any) => d.department || d)
          : []
      };
    }
    return {
      industry: companyName || "",
      status: "Open",
      experience: "Fresher",
      employment_type: "Full Time",
      skills_required: [],
      course: [],
      department: [],
      last_date: ""
    };
  }, [companyName, editingJob]);

  useEffect(() => {
    if (isModalOpen) {
      setModalValues(modalInitialValues);
    }
  }, [isModalOpen, modalInitialValues]);

  if ((loading || industryLoading) && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading job profiles...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Job Profiles</h2>
          <p className="text-sm text-slate-500">Manage active job openings and recruitment requirements</p>
        </div>
        <button
          onClick={() => {
            setEditingJob(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" /> Post Job Profile
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[480px] hide-scrollbar">
          {jobs.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50/50">
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-50 z-10 border-b border-slate-200/60">Job Title</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-50 z-10 border-b border-slate-200/60">Employment Type</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-50 z-10 border-b border-slate-200/60">Location</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-50 z-10 border-b border-slate-200/60">Experience</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-50 z-10 border-b border-slate-200/60">Salary (LPA)</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-50 z-10 border-b border-slate-200/60">Required Skills</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-50 z-10 border-b border-slate-200/60">Openings</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-50 z-10 border-b border-slate-200/60">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-50 z-10 border-b border-slate-200/60 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedJobs.map((job, idx) => (
                  <tr key={job.name || idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-800 text-sm">
                      {job.job_title}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                        {job.employment_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        {job.location || "Remote"}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-700 text-sm">
                      {job.experience}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-700 text-sm">
                      {formatSalary(job.salary_from, job.salary_to)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {(job.skills_required)?.slice(0, 2).map((s: any, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md border border-indigo-100">
                            {s.skill}
                          </span>
                        ))}
                        {(job.skills_required)?.length > 2 && (
                          <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-md border border-slate-100">
                            +{(job.skills_required).length - 2}
                          </span>
                        )}
                        {!(job.skills_required)?.length && (
                          <span className="text-[10px] text-slate-400 font-medium italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-800 text-sm">
                      {job.openings !== undefined && job.openings !== null ? job.openings : "0"}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-fit uppercase tracking-wider ${job.status === 'Open'
                        ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                        : 'text-slate-400 bg-slate-50 border border-slate-100'
                        }`}>
                        <CircleDot className="w-2.5 h-2.5" />
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => {
                          setEditingJob(job);
                          setIsModalOpen(true);
                        }}
                        className="text-slate-500 border border-slate-200 bg-white rounded-lg transition-all active:scale-95 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center w-8 h-8 ml-auto"
                        title="Edit Job Profile"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-3xl mx-6 mb-6">
              <Plus className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Job Profiles Found</h3>
              <p className="text-sm text-slate-500 mb-6">Start by posting your first job profile.</p>
              <button
                onClick={() => {
                  setEditingJob(null);
                  setIsModalOpen(true);
                }}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
              >
                Post Job Profile
              </button>
            </div>
          )}
        </div>
        {pagination.total_pages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </motion.div>

      <DashboardDynamicModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJob(null);
        }}
        title={editingJob ? "Edit Job Profile" : "Post Job Profile"}
        subtitle={editingJob ? "Update your recruitment requirements" : "Manage your recruitment requirements"}
        headerIcon={Briefcase}
        iconBgColor="bg-orange-500"
        fields={jobFields}
        initialValues={modalInitialValues}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        error={modalError}
        onFieldFocus={handleFieldFocus}
        onValuesChange={handleValuesChange}
      />
    </motion.div>
  );
}
