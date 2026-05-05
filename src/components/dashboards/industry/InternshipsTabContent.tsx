"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import {
  Plus,
  MapPin,
  Loader2,
  Briefcase,
  Calendar,
  ChevronRight,
  Target,
  Users,
  Clock,
  IndianRupee,
  FileText,
  Zap,
  Globe,
  Award,
  CircleDot,
  Pen,
  Trash2
} from "lucide-react";
import { getInternshipList, createInternship, updateInternship, deleteInternship, getMasterData, createSkill } from "@/services/industry.services";
import { useIndustry } from "@/context/IndustryContext";
import DashboardDynamicModal, { DynamicField } from "@/components/dashboards/shared/DashboardDynamicModal";
import { calculateEndDate } from "@/utils/date.utils";
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

export default function InternshipsTabContent() {
  const { industryData, loading: industryLoading } = useIndustry();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyName = industryData?.company_name || "";

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [editingInternship, setEditingInternship] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [modalValues, setModalValues] = useState<Record<string, any>>({});

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "post-new") {
      setEditingInternship(null);
      setIsModalOpen(true);
    }
  }, [searchParams]);



  const fetchOptions = async (doctype: string, setter: (val: string[]) => void, extraPayload?: any) => {
    try {
      const data = await getMasterData(doctype, extraPayload);
      const apiData = data.data || data.message || [];
      const mapField = extraPayload?.fields || "name";
      const options = Array.isArray(apiData) ? apiData.map((item: any) => item[mapField] || item.name) : [];
      setter(options);
    } catch (err) {
      console.error(`Error fetching ${doctype} options:`, err);
    }
  };

  useEffect(() => {
    // Initial fetch for common fields if needed
  }, []);

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

  const internshipFields: DynamicField[] = useMemo(() => [
    { name: "title", label: "Internship Title", type: "text", icon: Briefcase, required: true, colSpan: 2, placeholder: "e.g. Backend Developer Intern" },
    { name: "type", label: "Domain", type: "select", icon: Target, options: categoryOptions, required: false, placeholder: "Select Category" },
    { name: "industry", label: "Industry", type: "text", icon: Globe, required: true, placeholder: "e.g. Razorpay Technologies", disabled: true },
    { name: "location", label: "Location Type", type: "select", icon: MapPin, options: ["Remote", "On-site", "Hybrid"], required: true, placeholder: "Select Location" },
    { name: "payment_mode", label: "Payment", type: "select", icon: IndianRupee, options: ["Paid", "Unpaid"], required: true, placeholder: "Select Payment Mode" },
    { name: "stipend", label: "Stipend (Monthly)", type: "number", icon: IndianRupee, required: modalValues.payment_mode === "Paid", placeholder: "e.g. 15000", disabled: modalValues.payment_mode === "Unpaid" },
    { name: "duration", label: "Duration (Days)", type: "number", icon: Clock, required: true, placeholder: "e.g. 90" },
    { name: "start_date", label: "Start Date", type: "date", icon: Calendar, required: true, placeholder: "DD/MM/YYYY", textTransform: "uppercase", min: new Date().toISOString().split('T')[0] },
    { name: "end_date", label: "End Date", type: "date", icon: Calendar, placeholder: "DD/MM/YYYY", textTransform: "uppercase" },
    { name: "openings", label: "Openings", type: "number", icon: Users, required: true, placeholder: "e.g. 10" },
    { name: "status", label: "Status", type: "select", icon: Zap, options: ["Active", "Draft", "Closed"], required: true, placeholder: "Select Status" },
    { name: "course", label: "Course", type: "select", icon: Briefcase, options: courseOptions, required: true, placeholder: "Select Course" },
    { name: "department", label: "Department", type: "select", icon: Briefcase, options: departmentOptions, required: true, placeholder: "Select Department" },
    { name: "academic_year", label: "Academic Year", type: "select", icon: Calendar, options: ["2", "3", "4"], required: true, placeholder: "Select Year" },
    {
      name: "required_skills",
      label: "Required Skills",
      type: "select",
      icon: Award,
      options: skillOptions,
      required: true,
      colSpan: 2,
      placeholder: "Select Required Skills",
      multiple: true,
      allowCustom: true,
      customPlaceholder: "Enter custom skill...",
      onCreateCustomValue: async (val: string) => {
        try {
          await createSkill(val);
          fetchOptions("Skill", setSkillOptions);
        } catch (err) {
          console.error("Failed to create skill record:", err);
          throw err;
        }
      }
    },
    { name: "description", label: "Description", type: "textarea", icon: FileText, required: true, colSpan: 2, placeholder: "Describe the roles and responsibilities..." },
  ], [skillOptions, categoryOptions, courseOptions, departmentOptions, modalValues.payment_mode]);

  const fetchInternships = async (industry: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getInternshipList(industry);

      const projectData = response?.data || response?.message?.data || response?.message || [];
      setInternships(Array.isArray(projectData) ? projectData : []);
    } catch (err: any) {
      console.error("Error fetching internships:", err);
      const isNotFound = err?.status === 404 || err?.message?.includes("not found");
      if (isNotFound) {
        setInternships([]);
      } else {
        setError("Failed to load internships. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (companyName) {
    //   fetchInternships(companyName);
    // } else if (!industryLoading) {
    //   setLoading(false);
    // }
    fetchInternships(companyName)
  }, [companyName, industryLoading]);

  const handleModalSubmit = async (formData: any) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const payload = {
        ...formData,
        industry: companyName,
        internship_name: formData.title,
        title: formData.title,
        name: editingInternship?.name, // Add name for updates
        required_skills: Array.isArray(formData.required_skills)
          ? formData.required_skills.map((s: string) => ({ skill: s }))
          : []
      };

      if (editingInternship) {
        await updateInternship(editingInternship.name, payload);
      } else {
        await createInternship(payload);
      }

      await fetchInternships(companyName);
      showToast(`Internship ${editingInternship ? 'updated' : 'posted'} successfully`, "success");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving internship:", err);
      const msg = err?.message || `Failed to ${editingInternship ? 'update' : 'post'} internship`;
      setModalError(msg);
      showToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteInternship = async (name: string) => {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;

    try {
      setIsDeleting(name);
      await deleteInternship(name);
      await fetchInternships(companyName);
      showToast("Internship deleted successfully", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete internship", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    if (fieldName === "required_skills" && skillOptions.length === 0) {
      fetchOptions("Skill", setSkillOptions);
    } else if (fieldName === "type" && categoryOptions.length === 0) {
      fetchOptions("Industry Skill Domain", setCategoryOptions, {
        fields: "domain",
        filters: {
          industry: companyName
        }
      });
    } else if (fieldName === "course" && courseOptions.length === 0) {
      fetchOptions("Courses", setCourseOptions);
    } else if (fieldName === "department" && departmentOptions.length === 0) {
      const filters = modalValues.course ? { courses: modalValues.course } : {};
      fetchOptions("College Department", setDepartmentOptions, { filters });
    }
  };

  const handleValuesChange = (values: Record<string, any>, changedFieldName: string) => {
    setModalValues(values);
    if (changedFieldName === "course") {
      setDepartmentOptions([]);
      return { department: "" };
    }
    if (changedFieldName === "payment_mode" && values.payment_mode === "Unpaid") {
      return { stipend: 0 };
    }
    if (changedFieldName === "start_date" || changedFieldName === "duration") {
      const newEndDate = calculateEndDate(values.start_date, values.duration);
      if (newEndDate) {
        return { end_date: newEndDate };
      }
    }
  };

  const formatStipend = (amount: any) => {
    if (!amount) return "N/A";
    const num = Number(amount);
    return num >= 1000 ? `₹${(num / 1000).toFixed(0)}k/mo` : `₹${num}/mo`;
  };

  const modalInitialValues = useMemo(() => {
    if (editingInternship) {
      return {
        ...editingInternship,
        industry: companyName || editingInternship.industry,
        required_skills: Array.isArray(editingInternship.skills)
          ? editingInternship.skills.map((s: any) => s.skill || s.skills)
          : Array.isArray(editingInternship.required_skills)
            ? editingInternship.required_skills.map((s: any) => s.skill || s.skills)
            : []
      };
    }
    return {
      industry: companyName || "Razorpay Technologies",
      status: "Active",
      location: "Remote",
      payment_mode: "Paid",
      type: "",
      required_skills: []
    };
  }, [editingInternship, companyName]);

  useEffect(() => {
    if (isModalOpen) {
      setModalValues(modalInitialValues);
    }
  }, [isModalOpen, modalInitialValues]);

  if ((loading || industryLoading) && internships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading internships...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Internship Postings</h2>
          <p className="text-sm text-slate-500">Manage active and draft internship opportunities</p>
        </div>
        <button
          onClick={() => {
            setEditingInternship(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" /> Post Internship
        </button>
      </div>

      {/* Error Display */}

      <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto hide-scrollbar">
          {internships.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50/50">
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stipend</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Skills</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Openings</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {internships.map((internship, idx) => (
                  <tr key={internship.name || idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-800 text-sm">
                      {internship.title}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                        {internship.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        {internship.location}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-700 text-sm">
                      {formatStipend(internship.stipend)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {(internship.skills || internship.required_skills)?.slice(0, 2).map((s: any, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md border border-indigo-100">
                            {s.skill || s.skills}
                          </span>
                        ))}
                        {(internship.skills || internship.required_skills)?.length > 2 && (
                          <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-md border border-slate-100">
                            +{(internship.skills || internship.required_skills).length - 2}
                          </span>
                        )}
                        {!(internship.skills || internship.required_skills)?.length && (
                          <span className="text-[10px] text-slate-400 font-mediumitalic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-800 text-sm">
                      {internship.openings !== undefined && internship.openings !== null ? internship.openings : "0"}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-fit uppercase tracking-wider ${internship.status === 'Active'
                        ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                        : 'text-slate-400 bg-slate-50 border border-slate-100'
                        }`}>
                        <CircleDot className="w-2.5 h-2.5" />
                        {internship.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDeleteInternship(internship.name)}
                        disabled={isDeleting === internship.name || internship.status === "Closed" || internship.status === "Disable"}
                        className={`text-slate-500 border border-slate-200 bg-white rounded-lg transition-all active:scale-95 flex items-center justify-center w-8 h-8 disabled:opacity-30 disabled:cursor-not-allowed ${internship.status === 'Closed' || internship.status === 'Disable' ? '' : 'hover:text-red-500 hover:border-red-200 hover:bg-red-50'}`}
                        title={internship.status === "Closed" || internship.status === "Disable" ? "Internship is closed/disabled" : "Delete Internship"}
                      >
                        {isDeleting === internship.name ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingInternship(internship);
                          setIsModalOpen(true);
                        }}
                        disabled={internship.status === "Closed" || internship.status === "Disable"}
                        className={`text-slate-500 border border-slate-200 bg-white rounded-lg transition-all active:scale-95 flex items-center justify-center w-8 h-8 disabled:opacity-30 disabled:cursor-not-allowed ${internship.status === 'Closed' || internship.status === 'Disable' ? '' : 'hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50'}`}
                        title={internship.status === "Closed" || internship.status === "Disable" ? "Internship is closed/disabled" : "Edit Internship"}
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
              <h3 className="text-lg font-bold text-slate-800">No Internships Found</h3>
              <p className="text-sm text-slate-500 mb-6">Start by posting your first internship opportunity.</p>
              <button
                onClick={() => {
                  setEditingInternship(null);
                  setIsModalOpen(true);
                }}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
              >
                Post Internship
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <DashboardDynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInternship ? "Edit Internship" : "Post Internship"}
        subtitle={editingInternship ? "Update your internship details" : "Manage your talent acquisition pipeline"}
        headerIcon={Briefcase}
        iconBgColor="bg-orange-500"
        fields={internshipFields}
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
