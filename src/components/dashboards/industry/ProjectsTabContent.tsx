"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Plus,
  Briefcase,
  Target,
  Trophy,
  Users,
  Clock,
  ArrowRight,
  FileText,
  Calendar,
  Layers,
  Zap,
  Loader2,
  Trash2
} from "lucide-react";
import { getProjectList, createProject, updateProject, deleteProject, getMasterData, getProjectApplicationCount, createSkill, getDepartmentsByCourse } from "@/services/industry.services";
import { useIndustry } from "@/context/IndustryContext";
import DashboardDynamicModal, { DynamicField } from "@/components/dashboards/shared/DashboardDynamicModal";
import { Pagination } from "@/components/ui/Pagination";
import ApplicationsPipelineModal from "./ApplicationsPipelineModal";
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

export default function ProjectsTabContent() {
  const { industryData, loading: industryLoading, refreshIndustryData } = useIndustry();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>({
    total: 0,
    page: 1,
    page_size: 5,
    total_pages: 1,
  });
  const PAGE_SIZE = 5;
  const [isServerPaged, setIsServerPaged] = useState(false);

  const displayedProjects = useMemo(() => {
    if (isServerPaged) {
      return projects;
    }
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return projects.slice(startIndex, startIndex + PAGE_SIZE);
  }, [projects, isServerPaged, currentPage]);

  const companyName = industryData?.company_name || "";

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [projectToEdit, setProjectToEdit] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [applicationCount, setApplicationCount] = useState<number>(0);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [modalValues, setModalValues] = useState<Record<string, any>>({});

  // Applications modal states
  const [applicationsModalOpen, setApplicationsModalOpen] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsData, setApplicationsData] = useState<any[]>([]);
  const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "post-new") {
      setProjectToEdit(null);
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
      let options = Array.isArray(apiData) ? apiData.map((item: any) => item.name || item.department_name || item.department || item) : [];
      if (doctype === "Courses") {
        options = ["All", ...options];
      }
      setter(options);
    } catch (err) {
      console.error(`Error fetching ${doctype} options:`, err);
    }
  };

  const projectFields: DynamicField[] = useMemo(() => [
    { name: "project_name", label: "Project Name", type: "text", icon: Briefcase, required: true, colSpan: 2, placeholder: "e.g. AI Resume Screening System", disabled: !!projectToEdit },
    { name: "project_code", label: "Project Code", type: "text", icon: FileText, required: true, placeholder: "e.g. AI-001" },
    { name: "industry", label: "Industry", type: "text", icon: Layers, required: true, placeholder: "e.g. Razorpay Technologies", disabled: true },
    { name: "status", label: "Status", type: "select", icon: Zap, options: ["Active", "Completed", "Disable"], required: true, placeholder: "Select Status" },
    { name: "duration", label: "Duration (Days)", type: "number", icon: Clock, required: true, placeholder: "e.g. 30" },
    { name: "start_date", label: "Start Date", type: "date", icon: Calendar, required: true, placeholder: "DD/MM/YYYY", textTransform: "uppercase", min: new Date().toISOString().split('T')[0] },
    { name: "end_date", label: "End Date", type: "date", icon: Calendar, placeholder: "DD/MM/YYYY", textTransform: "uppercase" },
    { name: "application_deadline", label: "Application Deadline", type: "date", icon: Calendar, required: true, placeholder: "DD/MM/YYYY", textTransform: "uppercase", max: modalValues.start_date },
    { name: "course", label: "Course", type: "select", icon: Briefcase, options: courseOptions, required: true, placeholder: "Select Courses", multiple: true },
    { name: "department", label: "Department", type: "select", icon: Briefcase, options: departmentOptions, required: true, placeholder: "Select Departments", multiple: true },
    { name: "academic_year", label: "Academic Year", type: "select", icon: Calendar, options: ["2", "3", "4"], required: true, placeholder: "Select Years", multiple: true },
    {
      name: "required_skills",
      label: "Required Skills",
      type: "select",
      icon: Target,
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
    { name: "description", label: "Description", type: "textarea", icon: FileText, required: true, colSpan: 2, placeholder: "Describe the project objective and tasks..." },
  ], [skillOptions, courseOptions, departmentOptions, projectToEdit, modalValues.start_date, modalValues.course]);

  const fetchProjects = async (industry: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjectList(industry);

      const dataObj = response?.data || response?.message?.data || response?.message || {};
      
      let projectList = [];
      let serverPaged = false;
      let totalPages = 1;
      let totalCount = 0;

      if (dataObj?.pagination) {
        serverPaged = true;
        projectList = dataObj.projects || [];
        totalPages = dataObj.pagination.total_pages || 1;
        totalCount = dataObj.pagination.total || projectList.length;
        setPagination(dataObj.pagination);
      } else {
        // Fallback to array check
        let rawData = [];
        if (Array.isArray(dataObj)) {
          rawData = dataObj;
        } else if (Array.isArray(dataObj?.projects)) {
          rawData = dataObj.projects;
        } else if (Array.isArray(response?.data)) {
          rawData = response.data;
        } else if (Array.isArray(response?.message)) {
          rawData = response.message;
        } else if (Array.isArray(response?.message?.data)) {
          rawData = response.message.data;
        }
        projectList = rawData;
        totalCount = rawData.length;
        totalPages = Math.ceil(rawData.length / PAGE_SIZE) || 1;
        
        setPagination({
          total: totalCount,
          page: currentPage,
          page_size: PAGE_SIZE,
          total_pages: totalPages,
        });
      }

      setProjects(projectList);
      setIsServerPaged(serverPaged);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      const isNotFound = err?.status === 404 || err?.message?.includes("not found");
      if (isNotFound) {
        setProjects([]);
      } else {
        setError("Failed to load projects. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationCount = async (industry: string) => {
    try {
      const response = await getProjectApplicationCount(industry);
      // Accessing data.total_applications as per the provided API response structure
      setApplicationCount(response?.data?.total_applications || 0);
    } catch (err) {
      console.error("Error fetching application count:", err);
    }
  };

  const handleTotalApplicationsClick = async () => {
    setSelectedProjectName(null);
    setApplicationsModalOpen(true);
    setApplicationsLoading(true);
    try {
      const response = await getMasterData("Student Project Enrollment", {
        filters: { industry: companyName },
        fields: ["name", "student", "project", "industry", "status", "applied_on", "resume"]
      });
      let data = [];
      if (Array.isArray(response?.message?.data)) {
        data = response.message.data;
      } else if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray(response?.message)) {
        data = response.message;
      }
      setApplicationsData(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      showToast("Failed to fetch applications", "error");
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleProjectClick = async (project: any) => {
    setSelectedProjectName(project.project_name || project.name);
    setApplicationsModalOpen(true);
    setApplicationsLoading(true);
    try {
      const response = await getMasterData("Student Project Enrollment", {
        filters: { industry: companyName, project: project.name },
        fields: ["name", "student", "project", "industry", "status", "applied_on", "resume"]
      });
      let data = [];
      if (Array.isArray(response?.message?.data)) {
        data = response.message.data;
      } else if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray(response?.message)) {
        data = response.message;
      }
      setApplicationsData(data);
    } catch (err) {
      console.error("Error fetching project applications:", err);
      showToast("Failed to fetch applications for project", "error");
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [companyName]);

  useEffect(() => {
    if (companyName) {
      fetchProjects(companyName);
    }
  }, [companyName, currentPage]);

  useEffect(() => {
    if (companyName) {
      fetchApplicationCount(companyName);
    } else if (!industryLoading) {
      setLoading(false);
    }
  }, [companyName, industryLoading]);

  const handleModalSubmit = async (formData: any) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const skillsArray = Array.isArray(formData.required_skills)
        ? formData.required_skills.map((s: string) => ({ skill: s }))
        : (typeof formData.required_skills === 'string' ? [{ skill: formData.required_skills }] : []);

      const payload = {
        ...formData,
        required_skills: skillsArray,
        duration: String(formData.duration),
        application_deadline: formData.application_deadline,
        name: projectToEdit?.name || "",
        course: Array.isArray(formData.course) ? formData.course : (formData.course ? [formData.course] : []),
        department: Array.isArray(formData.department) ? formData.department : (formData.department ? [formData.department] : []),
        academic_year: Array.isArray(formData.academic_year) ? formData.academic_year : (formData.academic_year ? [formData.academic_year] : [])
      };

      if (projectToEdit) {
        await updateProject(projectToEdit.name, payload);
      } else {
        await createProject(payload);
      }

      await fetchProjects(companyName);
      showToast(`Project ${projectToEdit ? 'updated' : 'created'} successfully`, "success");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving project:", err);
      const msg = err?.message || `Failed to ${projectToEdit ? 'update' : 'create'} project`;
      setModalError(msg);
      showToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProject = async (projectName: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      setIsDeleting(projectName);
      await deleteProject(projectName);
      await fetchProjects(companyName);
      showToast("Project deleted successfully", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete project", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    if (fieldName === "required_skills" && skillOptions.length === 0) {
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
    if (changedFieldName === "start_date" || changedFieldName === "duration") {
      const newEndDate = calculateEndDate(values.start_date, values.duration);
      if (newEndDate) {
        return { end_date: newEndDate };
      }
    }
  };

  const handlePostNewProject = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleManageProject = (project: any) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const modalInitialValues = useMemo(() => {
    if (projectToEdit) {
      return {
        ...projectToEdit,
        required_skills: Array.isArray(projectToEdit.skills)
          ? projectToEdit.skills.map((s: any) => s.skill || s.skills)
          : Array.isArray(projectToEdit.required_skills)
            ? projectToEdit.required_skills.map((s: any) => s.skill || s.skills)
            : []
      };
    }
    return {
      industry: companyName || "Razorpay Technologies",
      status: "Active",
      required_skills: [],
      application_deadline: ""
    };
  }, [projectToEdit, companyName]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
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

  if ((loading || industryLoading) && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading projects...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row items-center justify-between gap-6 px-1">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Live Projects & R&D Offerings</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Post real projects for students — best submissions get awarded, top performers get internship offers</p>
        </div>
        <button
          onClick={handlePostNewProject}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-500/10"
        >
          <Plus className="w-4 h-4" /> Post New Project
        </button>
      </motion.div>

      {/* Error Display */}

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "ACTIVE PROJECTS", value: projects.filter(p => p.status === "Active").length.toString(), icon: Briefcase, border: "border-t-purple-400", bg: "bg-purple-50/50", iconBg: "bg-purple-50" },
          { label: "TOTAL APPLICATIONS", value: applicationCount.toString(), icon: Users, border: "border-t-blue-400", bg: "bg-blue-50/50", iconBg: "bg-blue-50", onClick: handleTotalApplicationsClick },
          { label: "STUDENTS AWARDED", value: "0", icon: Trophy, border: "border-t-emerald-400", bg: "bg-emerald-50/50", iconBg: "bg-emerald-50" },
          { label: "CONVERTED TO PPO", value: "0", icon: Target, border: "border-t-orange-400", bg: "bg-orange-50/50", iconBg: "bg-orange-50" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            onClick={stat.onClick}
            className={`bg-white rounded-xl border border-slate-200 ${stat.border} border-t-2 p-5 shadow-sm flex items-start justify-between group ${stat.onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''}`}
          >
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
            <div className={`p-3 ${stat.iconBg} rounded-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100`}>
              <stat.icon className="w-5 h-5 text-slate-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Projects Portfolio */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {projects.length > 0 ? (
            displayedProjects.map((project, idx) => (
              <motion.div
                key={project.name || `project-${idx}`}
                variants={item}
                initial="hidden"
                animate="show"
                exit="hidden"
                layout
                onClick={() => handleProjectClick(project)}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex flex-col gap-5">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-105 transition-transform">
                        <Briefcase className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{project.project_name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{project.industry} • {project.project_code}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${project.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Text & Tags */}
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-4xl opacity-80">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.required_skills?.map((skillObj: any, sIdx: number) => (
                        <span key={sIdx} className="px-3 py-1 bg-indigo-50 text-indigo-500 text-[10px] font-bold rounded-lg border border-indigo-100">
                          {skillObj.skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* High Fidelity Footer Row */}
                  <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-8">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-orange-500 leading-none">{project.applied_count || 0}</span>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Applied</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-blue-500 leading-none">{project.shortlisted_count || 0}</span>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Shortlisted</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-600 leading-none">{project.duration} Days</span>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Duration</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-600 leading-none">{formatDate(project.start_date)}</span>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Starts</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-600 leading-none">{formatDate(project.end_date)}</span>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Ends</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project?.name);
                        }}
                        disabled={isDeleting === project?.name || project?.status === "Disable"}
                        className={`p-2.5 rounded-xl border border-slate-200 text-slate-400 transition-all flex items-center justify-center active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${project?.status === 'Disable' ? '' : 'hover:text-red-500 hover:border-red-100 hover:bg-red-50'}`}
                        title={project.status === "Disable" ? "Project is disabled" : "Delete Project"}
                      >
                        {isDeleting === project.project_name ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManageProject(project);
                        }}
                        disabled={project.status === "Disable"}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${project.status === 'Disable' ? 'bg-slate-200 text-slate-400 shadow-none' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/10'}`}
                      >
                        Manage <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-3xl mx-6 mb-6">
              <Briefcase className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Projects Found</h3>
              <p className="text-sm text-slate-500 mb-6">Start by posting your first industry project.</p>
              <button
                onClick={handlePostNewProject}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
              >
                Post New Project
              </button>
            </div>
          )}
        </AnimatePresence>

        {pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        )}
      </div>

      <DashboardDynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={projectToEdit ? "Manage Project" : "Post New Project"}
        subtitle={projectToEdit ? `Updating: ${projectToEdit.project_name}` : "Shared with all registered colleges"}
        headerIcon={Briefcase}
        iconBgColor="bg-orange-500"
        fields={projectFields}
        initialValues={modalInitialValues}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        error={modalError}
        onFieldFocus={handleFieldFocus}
        onValuesChange={handleValuesChange}
      />

      <ApplicationsPipelineModal
        isOpen={applicationsModalOpen}
        onClose={() => {
          setApplicationsModalOpen(false);
          fetchProjects(companyName);
        }}
        applicationsData={applicationsData}
        applicationsLoading={applicationsLoading}
        companyName={companyName}
        projectName={selectedProjectName || undefined}
        onStatusUpdated={(updatedData) => setApplicationsData(updatedData)}
      />
    </motion.div>
  );
}
