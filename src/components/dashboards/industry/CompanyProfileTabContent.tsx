"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import {
  Building2,
  Edit3,
  Monitor,
  Star,
  Globe,
  MapPin,
  Layers,
  Target as TargetIcon,
  Users,
  Zap,
  ShieldCheck,
  Factory,
  GraduationCap,
  Plus,
  ArrowUpRight,
  Loader2,
  FileText,
  Briefcase,
  Layout,
  Calendar,
  ListChecks,
  Clock
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";
import { updateIndustry, addRequiredRole, addHiringRound } from "@/services/industry.services";
import { useIndustry, IndustryData, IndustryRole, HiringRound } from "@/context/IndustryContext";
import IndustryDynamicModal, { IndustryField } from "./IndustryDynamicModal";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.3 } },
};

const skillDomains = [
  {
    id: "engineering",
    title: "Engineering",
    color: "text-blue-600",
    dotBg: "bg-blue-600",
    bg: "bg-blue-50/50",
    borderColor: "border-blue-100",
    openings: 24,
    tags: ["Python", "Go", "React", "Kafka", "Docker", "Kubernetes"],
    roles: "Backend Engineer • Frontend Engineer • ML Engineer"
  },
  {
    id: "datascience",
    title: "Data Science",
    color: "text-purple-600",
    dotBg: "bg-purple-600",
    bg: "bg-purple-50/50",
    borderColor: "border-purple-100",
    openings: 8,
    tags: ["Python", "SQL", "Statistics", "TensorFlow"],
    roles: "Data Scientist • ML Researcher • Analytics"
  },
  {
    id: "product",
    title: "Product",
    color: "text-orange-600",
    dotBg: "bg-orange-600",
    bg: "bg-orange-50/50",
    borderColor: "border-orange-100",
    openings: 5,
    tags: ["Strategy", "SQL", "A/B Testing", "Figma"],
    roles: "Product Manager • Analyst • Growth PM"
  }
];

export default function CompanyProfileTabContent() {
  const { 
    industryData: data, 
    roleList,
    loading, 
    roleLoading,
    error, 
    refreshIndustryData,
    refreshRoleList
  } = useIndustry();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"profile" | "role" | "hiring">("profile");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [roleToEdit, setRoleToEdit] = useState<IndustryRole | undefined>(undefined);
  const [roundToEdit, setRoundToEdit] = useState<HiringRound | undefined>(undefined);

  const [businessTypeOptions, setBusinessTypeOptions] = useState<string[]>([]);
  const [industrySectorOptions, setIndustrySectorOptions] = useState<string[]>([]);
  const [hiringProcessOptions, setHiringProcessOptions] = useState<string[]>([]);

  const profileFields: IndustryField[] = useMemo(() => [
    { name: "company_name", label: "Company Name", type: "text", icon: Building2, required: true, colSpan: 2, placeholder: "e.g. Acme Corporation", disabled: true },
    { name: "business_type", label: "Business Type", type: "select", icon: Layout, options: businessTypeOptions.length > 0 ? businessTypeOptions : ["Enterprises", "Consultant and Agency", "Other"], required: true, placeholder: "Select Business Type" },
    { name: "industry_sector", label: "Industry Sector", type: "select", icon: Layers, options: industrySectorOptions.length > 0 ? industrySectorOptions : ["Information Services", "Manufacturing", "Finance", "Healthcare", "Education", "Other"], required: true, placeholder: "Select Industry Sector" },
    { name: "employee_head_count", label: "Employee Count", type: "number", icon: Users, required: true, placeholder: "e.g. 500" },
    { name: "headquarters", label: "Headquarters", type: "text", icon: MapPin, required: true, placeholder: "e.g. Mumbai, Maharashtra" },
    { name: "company_website", label: "Website (URL)", type: "url", icon: Globe, required: true, placeholder: "https://www.company.com" },
    { name: "cin", label: "CIN Number", type: "text", icon: FileText, required: true, placeholder: "Enter Corporate Identification Number" },
    { name: "about", label: "About Company", type: "textarea", icon: FileText, required: true, colSpan: 2, placeholder: "Briefly describe your company's mission and goals..." },
  ], [businessTypeOptions, industrySectorOptions]);

  const roleFields: IndustryField[] = useMemo(() => [
    { name: "role", label: "Job Role", type: "text", icon: Briefcase, required: true, colSpan: 2, placeholder: "e.g. Software Development Engineer" },
    { name: "duration", label: "Duration", type: "text", icon: Calendar, required: true, placeholder: "e.g. 6 Months" },
    { name: "semester", label: "Semester", type: "text", icon: GraduationCap, required: true, placeholder: "e.g. 6th or 8th" },
    { name: "available_positions", label: "Open Positions", type: "number", icon: Users, required: true, placeholder: "e.g. 10" },
    { name: "description", label: "Description", type: "textarea", icon: FileText, required: true, colSpan: 2, placeholder: "List key responsibilities and requirements..." },
  ], []);

  const hiringFields: IndustryField[] = useMemo(() => [
    {
      name: "round",
      label: "Round Name",
      type: "select",
      icon: ListChecks,
      options: hiringProcessOptions.length > 0 ? hiringProcessOptions : ["Technical Interview", "HR Interview", "Aptitude Test", "Other"],
      required: true,
      colSpan: 2,
      placeholder: "Select Round Name"
    },
    { name: "based_on", label: "Based On", type: "text", icon: TargetIcon, required: true, colSpan: 2, placeholder: "e.g. Coding & Data Structures" },
    { name: "duration", label: "Duration (min)", type: "number", icon: Clock, required: true, colSpan: 2, placeholder: "e.g. 45" },
  ], [hiringProcessOptions]);

  const activeFields = useMemo(() => {
    if (modalMode === "profile") return profileFields;
    if (modalMode === "role") return roleFields;
    return hiringFields;
  }, [modalMode, profileFields, roleFields, hiringFields]);

  const modalInitialValues = useMemo(() => {
    if (modalMode === "profile") {
      return {
        company_name: data?.company_name,
        business_type: data?.business_type,
        industry_sector: data?.industry_sector,
        employee_head_count: data?.employee_head_count,
        headquarters: data?.headquarters,
        company_website: data?.company_website,
        cin: data?.cin,
        about: data?.about
      };
    }
    if (modalMode === "role") {
      return roleToEdit ? { ...roleToEdit } : undefined;
    }
    return roundToEdit ? { ...roundToEdit } : undefined;
  }, [modalMode, data, roleToEdit, roundToEdit]);

  const handleModalSubmit = async (formData: any) => {
    setModalLoading(true);
    setModalError(null);
    try {
      if (modalMode === "profile") {
        await updateIndustry(data?.company_name || "", formData);
        await refreshIndustryData();
      } else if (modalMode === "role") {
        const payload = {
          ...formData,
          industry: data?.company_name,
          amended_from: ""
        };
        await addRequiredRole(payload, data?.company_name || "");
        await refreshRoleList();
      } else if (modalMode === "hiring") {
        const payload = {
          ...formData,
          industry_name: data?.company_name,
          ...(roundToEdit?.name ? { name: roundToEdit.name } : {})
        };
        await addHiringRound(payload);
        await refreshIndustryData();
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err?.message || "Failed to save data");
    } finally {
      setModalLoading(false);
    }
  };

  const fetchMasterOptions = async (doctype: string, setter: (val: string[]) => void) => {
    try {
      const response = await fetch(
        `https://devstridenex.quantcloud.in/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctype })
        }
      );
      const dataResponse = await response.json();
      const options = (dataResponse.data || dataResponse).map((item: any) => item.name);
      setter(options);
    } catch (err) {
      console.error(`Error fetching ${doctype} options:`, err);
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    if (fieldName === "business_type" && businessTypeOptions.length === 0) {
      fetchMasterOptions("Business Type", setBusinessTypeOptions);
    } else if (fieldName === "industry_sector" && industrySectorOptions.length === 0) {
      fetchMasterOptions("Industry Sector", setIndustrySectorOptions);
    } else if (fieldName === "round" && hiringProcessOptions.length === 0) {
      fetchMasterOptions("Hiring Process", setHiringProcessOptions);
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleProfileUpdate = () => {
    setModalMode("profile");
    setIsModalOpen(true);
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase tracking-widest">Loading Company Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <Zap className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Connection Error</h2>
        <p className="text-slate-500 font-medium max-w-md">{error || "We couldn't retrieve the company profile at this time."}</p>
        <button
          onClick={() => refreshIndustryData()}
          className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* COMPACT Premium Banner - More Color */}
      <motion.div
        variants={item}
        className="bg-[#0f172a] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center p-5 backdrop-blur-xl shrink-0 shadow-2xl group overflow-hidden">
              <div className="w-full h-5 bg-yellow-400 rounded shadow-lg opacity-90 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">{capitalizeFirstLetter(data?.company_name || "Company Profile")}</h1>
                <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> {data?.status === "Active" ? "VERIFIED" : (data?.status?.toUpperCase() || "PENDING")}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-slate-400 mb-6">
                <span className="flex items-center gap-2 text-blue-400"><Factory className="w-4 h-4" /> {data?.business_type || "N/A"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="flex items-center gap-2 text-emerald-400"><MapPin className="w-4 h-4" /> {data?.headquarters?.split(',')[0] || "Location N/A"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="flex items-center gap-2 text-indigo-400"><Users className="w-4 h-4" /> {data?.employee_head_count ? parseInt(data.employee_head_count).toLocaleString() : "0"}+ Team</span>
              </div>

              {/* Stats Row - High Contrast */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                {[
                  { label: "Open Roles", value: roleList?.reduce((acc, r) => acc + (Number(r.available_positions) || 0), 0)?.toString() || "0", color: "text-blue-400", bg: "bg-blue-500/10" },
                  { label: "Avg CTC", value: "₹18.5L", color: "text-orange-400", bg: "bg-orange-500/10" },
                  { label: "Rating", value: "4.1", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
                  { label: "Hired", value: "247", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                ].map((stat, idx) => (
                  <div key={idx} className={`${stat.bg} border border-white/10 rounded-2xl px-5 py-3 min-w-[110px] backdrop-blur-sm group hover:bg-white/10 transition-all cursor-default`}>
                    <span className={`text-xl md:text-2xl font-bold ${stat.color} block leading-none mb-1 group-hover:scale-105 transition-transform`}>
                      {stat.value}{stat.icon && <stat.icon className="w-4 h-4 inline-block ml-1 mb-1 fill-amber-400" />}
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleProfileUpdate}
            className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 shrink-0"
          >
            <Edit3 className="w-5 h-5" /> Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Dynamic Modal */}
      <IndustryDynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === "profile" ? "Edit Company Profile" :
            modalMode === "role" ? (roleToEdit ? "Edit Role" : "Add New Role") :
              (roundToEdit ? "Edit Hiring Round" : "Add Hiring Round")
        }
        subtitle={capitalizeFirstLetter(data?.company_name || "")}
        headerIcon={
          modalMode === "profile" ? Building2 :
            modalMode === "role" ? Briefcase :
              ListChecks
        }
        iconBgColor={
          modalMode === "profile" ? "bg-blue-600" :
            modalMode === "role" ? "bg-indigo-600" :
              "bg-emerald-600"
        }
        fields={activeFields}
        initialValues={modalInitialValues}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        error={modalError}
        onFieldFocus={handleFieldFocus}
      />

      {/* Main Grid Stories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <BaseCard className="border-slate-200 shadow-sm rounded-3xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Company Overview</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">THE MISSION</h3>
                  <p className="text-base text-slate-700 leading-relaxed font-medium opacity-90">
                    {data?.about || "No overview available for this company."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: "Industry", value: data?.industry_sector || "N/A", icon: Layers, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Size", value: data?.employee_head_count ? `${parseInt(data.employee_head_count).toLocaleString()}+` : "N/A", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
                    { label: "HQ", value: data?.headquarters || "N/A", icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Website", value: data?.company_website || "N/A", icon: Globe, color: "text-indigo-500", bg: "bg-indigo-50" },
                    { label: "CIN", value: data?.cin || "N/A", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: "Stage", value: "Series F Unicorn", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "GST Status", value: data?.gst_number ? "Registered" : "Pending", icon: ShieldCheck, color: "text-slate-600", bg: "bg-slate-100" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all group">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className={`p-2 rounded-xl ${item.bg}`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900 truncate pl-1">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BaseCard>

          {/* Skill Domains - Vibrant */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2 mb-2">
              <TargetIcon className="w-5 h-5 text-red-500" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Skill Domains We Audit</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {skillDomains.map((domain) => (
                <motion.div
                  key={domain.id}
                  variants={item}
                  className={`${domain.bg} border-2 ${domain.borderColor} rounded-3xl p-6 group hover:bg-white hover:border-slate-200 transition-all cursor-default relative overflow-hidden shadow-sm`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-3 h-3 rounded-full ${domain.dotBg} shadow-lg shadow-black/10`} />
                        <h3 className="text-xl font-bold text-slate-900">{domain.title}</h3>
                      </div>

                      <div className="flex flex-wrap gap-2.5 mb-6">
                        {domain.tags.map(tag => (
                          <span key={tag} className="px-4 py-2 bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-100 shadow-sm hover:border-slate-300 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider bg-white/50 px-3 py-1 rounded-lg inline-block border border-slate-100">
                        <span className="text-slate-400">ROLES:</span> {domain.roles}
                      </p>
                    </div>

                    <span className={`px-4 py-2 bg-white ${domain.color} text-[10px] font-bold rounded-xl border-2 ${domain.borderColor} uppercase tracking-[0.1em] shadow-sm`}>
                      {domain.openings} OPENINGS
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <BaseCard className="border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Roles We Offer</h3>
              <button
                onClick={() => {
                  setRoleToEdit(undefined);
                  setModalMode("role");
                  setIsModalOpen(true);
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-blue-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {roleLoading ? (
                <div className="py-10 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Updating Roles...</p>
                </div>
              ) : roleList && roleList.length > 0 ? (
                roleList.map((role, idx) => {
                  const roleIcons: Record<string, any> = {
                    "Full-Time": Building2,
                    "Internship": Monitor,
                    "Research": GraduationCap,
                  };
                  const Icon = roleIcons[role.role] || Building2;

                  return (
                    <div key={idx} className="flex items-center justify-between group cursor-default hover:translate-x-1 transition-transform">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-transparent shadow-sm group-hover:border-inherit transition-all`}>
                          <Icon className={`w-6 h-6 text-blue-500`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-800 leading-tight">{role.role}</h4>
                            <button
                              onClick={() => {
                                setRoleToEdit(role);
                                setModalMode("role");
                                setIsModalOpen(true);
                              }}
                              className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
                            {Number(role.duration) > 0 ? `${role.duration} Months` : role.semester}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-orange-600 leading-none">{role.available_positions}</span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">OPEN</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl group hover:border-blue-200 transition-all">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-6 text-center px-4">No roles listed yet</p>
                  <button
                    onClick={() => {
                      setRoleToEdit(undefined);
                      setModalMode("role");
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                  >
                    <Plus className="w-4 h-4" /> Add Required Role
                  </button>
                </div>
              )}
            </div>
          </BaseCard>

          {/* Hiring Pipeline */}
          <BaseCard className="border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Hiring Pipeline</h3>
              <button
                onClick={() => {
                  setRoundToEdit(undefined);
                  setModalMode("hiring");
                  setIsModalOpen(true);
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-emerald-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-10 relative">
              <div className="absolute left-[2.65rem] top-16 bottom-16 w-1 bg-slate-50 shadow-inner rounded-full" />
              {data?.hiring_process && data.hiring_process.length > 0 ? (
                data.hiring_process.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-6 pl-12 group">
                    <div className="absolute left-[0.25rem] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-xl z-20" />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-bold text-slate-800 leading-none">{step.round}</h4>
                        <button
                          onClick={() => {
                            setRoundToEdit(step);
                            setModalMode("hiring");
                            setIsModalOpen(true);
                          }}
                          className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">Based on: {step.based_on}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                    <TargetIcon className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-6 text-center px-4">No hiring rounds defined</p>
                  <button
                    onClick={() => {
                      setRoundToEdit(undefined);
                      setModalMode("hiring");
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                  >
                    <Plus className="w-4 h-4" /> Add Hiring Round
                  </button>
                </div>
              )}
            </div>
          </BaseCard>

          <BaseCard className="border-slate-200 rounded-3xl overflow-hidden shadow-sm bg-gradient-to-br from-slate-50 to-white">
            <CardHeader title="Campus Partners" />
            <div className="p-6">
              <div className="flex flex-wrap gap-2.5 mb-6">
                {[
                  "IIT Bombay", "IIT Delhi", "NIT Warangal", "VJTI Mumbai", "COEP Pune", "Manipal"
                ].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-4 rounded-2xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="w-5 h-5 text-indigo-500" /> Add Corporate Partner
              </button>
            </div>
          </BaseCard>
        </div>
      </div>
    </motion.div>
  );
}
