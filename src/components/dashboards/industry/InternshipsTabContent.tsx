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
  Pen
} from "lucide-react";
import { getInternshipList, createInternship } from "@/services/industry.services";
import { useIndustry } from "@/context/IndustryContext";
import IndustryDynamicModal, { IndustryField } from "./IndustryDynamicModal";

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

  const fetchSkillOptions = async () => {
    try {
      const response = await fetch(
        `https://devstridenex.quantcloud.in/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctype: "Skill" })
        }
      );
      const data = await response.json();
      const apiData = data.data || data.message || [];
      const options = Array.isArray(apiData) ? apiData.map((item: any) => item.name) : [];
      setSkillOptions(options);
    } catch (err) {
      console.error(`Error fetching Skill options:`, err);
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

  const internshipFields: IndustryField[] = useMemo(() => [
    { name: "title", label: "Internship Title", type: "text", icon: Briefcase, required: true, colSpan: 2, placeholder: "e.g. Backend Developer Intern" },
    { name: "type", label: "Category", type: "select", icon: Target, options: ["Technical", "Business", "Design", "Research", "Marketing", "Finance", "Operations"], required: true, placeholder: "Select Category" },
    { name: "industry", label: "Industry", type: "text", icon: Globe, required: true, placeholder: "e.g. Razorpay Technologies", disabled: true },
    { name: "location", label: "Location Type", type: "select", icon: MapPin, options: ["Remote", "On-site", "Hybrid"], required: true, placeholder: "Select Location" },
    { name: "stipend", label: "Stipend (Monthly)", type: "number", icon: IndianRupee, required: true, placeholder: "e.g. 15000" },
    { name: "duration", label: "Duration (Days)", type: "number", icon: Clock, required: true, placeholder: "e.g. 90" },
    { name: "start_date", label: "Start Date", type: "date", icon: Calendar, required: true, placeholder: "DD/MM/YYYY", textTransform: "uppercase" },
    { name: "end_date", label: "End Date", type: "date", icon: Calendar, required: true, placeholder: "DD/MM/YYYY", textTransform: "uppercase" },
    { name: "status", label: "Status", type: "select", icon: Zap, options: ["Active", "Draft", "Closed"], required: true, placeholder: "Select Status" },
    { name: "eligibility", label: "Eligibility", type: "text", icon: Users, required: true, colSpan: 2, placeholder: "e.g. 2025/2026 Batch Students" },
    { 
      name: "required_skills", 
      label: "Required Skills", 
      type: "select", 
      icon: Award, 
      options: skillOptions.length > 0 ? skillOptions : ["Python", "Java", "React", "Other"],
      required: true, 
      colSpan: 2, 
      placeholder: "Select Required Skill" 
    },
    { name: "description", label: "Description", type: "textarea", icon: FileText, required: true, colSpan: 2, placeholder: "Describe the roles and responsibilities..." },
  ], [skillOptions]);

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
    if (companyName) {
      fetchInternships(companyName);
    } else if (!industryLoading) {
      setLoading(false);
    }
  }, [companyName, industryLoading]);

  const handleModalSubmit = async (formData: any) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const payload = {
        ...formData,
        required_skills: [{ skill: formData.required_skills }],
        duration: String(formData.duration),
        stipend: Number(formData.stipend)
      };

      await createInternship(payload);
      await fetchInternships(companyName);
      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err?.message || "Failed to post internship");
    } finally {
      setModalLoading(false);
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    if (fieldName === "required_skills" && skillOptions.length === 0) {
      fetchSkillOptions();
    }
  };

  const formatStipend = (amount: any) => {
    if (!amount) return "N/A";
    const num = Number(amount);
    return `₹${(num / 1000).toFixed(0)}k/mo`;
  };

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
                    <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-800 text-sm">
                      {internship.openings !== undefined && internship.openings !== null ? internship.openings : "0"} 
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-fit uppercase tracking-wider ${
                        internship.status === 'Active' 
                          ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' 
                          : 'text-slate-400 bg-slate-50 border border-slate-100'
                      }`}>
                        <CircleDot className="w-2.5 h-2.5" />
                        {internship.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <button 
                        onClick={() => {
                          setEditingInternship(internship);
                          setIsModalOpen(true);
                        }}
                        className="text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-200 hover:bg-blue-50 bg-white rounded-lg transition-all active:scale-95 flex items-center justify-center w-8 h-8 ml-auto"
                        title="Edit Internship"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center bg-white">
              <Plus className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Internships Found</h3>
              <p className="text-sm text-slate-500 mb-6">Start by posting your first internship opportunity.</p>
              <button 
                onClick={() => {
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

      <IndustryDynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInternship ? "Edit Internship" : "Post Internship"}
        subtitle={editingInternship ? "Update your internship details" : "Manage your talent acquisition pipeline"}
        headerIcon={Briefcase}
        iconBgColor="bg-orange-500"
        fields={internshipFields}
        initialValues={editingInternship ? { ...editingInternship, industry: companyName || editingInternship.industry } : { industry: companyName || "Razorpay Technologies", status: "Active", location: "Remote", type: "Technical" }}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        error={modalError}
        onFieldFocus={handleFieldFocus}
      />
    </motion.div>
  );
}
