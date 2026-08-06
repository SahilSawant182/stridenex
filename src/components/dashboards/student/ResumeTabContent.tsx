// components/dashboards/student/ResumeTabContent.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  GraduationCap, 
  Award, 
  Briefcase, 
  FolderGit2, 
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardDynamicModal, { DynamicField } from "@/components/dashboards/shared/DashboardDynamicModal";
import { useToast } from "@/context/ToastContext";
import { getStudentByEmail, updateStudent } from "@/services/student.services";

// Interfaces
interface Education {
  education_level: string;
  institution_name: string;
  board_university: string;
  specialization: string;
  passing_year: number;
  percentage_cgpa: string;
  grade: string;
}

interface Certificate {
  certificate_name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string;
  certificate_file: string;
}

interface Internship {
  company_name: string;
  job_title: string;
  employment_type: string;
  location: string;
  start_date: string;
  end_date: string;
  technologies_used: string;
}

interface Project {
  project_name: string;
  company_name: string;
  start_date: string;
  end_date: string;
  project_description: string;
  project_link?: string;
}

export default function ResumeTabContent() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  // Local state representing filled data
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [certificatesList, setCertificatesList] = useState<Certificate[]>([]);
  const [internshipList, setInternshipList] = useState<Internship[]>([]);
  const [projectList, setProjectList] = useState<Project[]>([]);

  useEffect(() => {
    const fetchStudentResumeData = async () => {
      const email = typeof window !== "undefined" ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail")) : "";
      if (!email) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getStudentByEmail(email);
        const data = res?.data || res?.message?.data || res?.message;
        if (data) {
          const educationData = data.resume_details || data.table_apwt;
          if (educationData && Array.isArray(educationData)) {
            setEducationList(educationData);
          }
          if (data.certificates && Array.isArray(data.certificates)) {
            setCertificatesList(data.certificates);
          }
          if (data.internship && Array.isArray(data.internship)) {
            const mappedInternships = data.internship.map((item: any) => ({
              ...item,
              technologies_used: item.technologies || item.technologies_used || ""
            }));
            setInternshipList(mappedInternships);
          }
          if (data.project && Array.isArray(data.project)) {
            setProjectList(data.project);
          }
        }
      } catch (err) {
        console.error("Error fetching student details for resume web:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentResumeData();
  }, []);

  const saveResumeToServer = async (
    updatedEducation: Education[],
    updatedCertificates: Certificate[],
    updatedInternships: Internship[],
    updatedProjects: Project[]
  ) => {
    const email = typeof window !== "undefined" ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail")) : "";
    if (!email) return;
    try {
      // 1. Fetch fresh student details to avoid overwriting profile fields
      const res = await getStudentByEmail(email);
      const studentProfile = res?.data || res?.message?.data || res?.message;
      if (!studentProfile) {
        alert("Error: Failed to fetch profile details for update");
        return;
      }

      // 2. Build the updated payload matching the specified JSON format
      const payload = {
        ...studentProfile,
        table_apwt: updatedEducation,
        certificates: updatedCertificates,
        internship: updatedInternships.map(item => ({
          company_name: item.company_name,
          job_title: item.job_title,
          employment_type: item.employment_type,
          location: item.location,
          start_date: item.start_date,
          end_date: item.end_date,
          technologies: item.technologies_used || (item as any).technologies || ""
        })),
        project: updatedProjects
      };

      // 3. Call updateStudent
      await updateStudent(email, payload);
      alert("Resume details updated successfully!");
    } catch (err: any) {
      console.error("Failed to sync resume with server:", err);
      const errMsg = err?.response?.data?.message || err?.message?.message || err?.message || "Failed to sync resume details";
      alert("Error: " + errMsg);
    }
  };

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<"education" | "certificate" | "internship" | "project">("education");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalInitialValues, setModalInitialValues] = useState<Record<string, string | number | undefined> | undefined>(undefined);

  // Dynamic Fields Definitions
  const educationFields: DynamicField[] = [
    { name: "education_level", label: "Education Level", type: "select", options: ["SSC", "HSC", "Diploma", "UG", "PG", "PhD"], required: true },
    { name: "institution_name", label: "Institution Name", type: "text", placeholder: "e.g., VJTI Mumbai", required: true },
    { name: "board_university", label: "Board / University", type: "text", placeholder: "e.g., Mumbai University", required: true },
    { name: "specialization", label: "Specialization / Stream", type: "text", placeholder: "e.g., Computer Engineering", required: true },
    { name: "passing_year", label: "Passing Year", type: "number", placeholder: "e.g., 2026", required: true },
    { name: "percentage_cgpa", label: "Percentage / CGPA", type: "text", placeholder: "e.g., 9.2 CGPA or 88%", required: true },
    { name: "grade", label: "Grade", type: "text", placeholder: "e.g., A+ or Outstanding", required: true }
  ];

  const certificateFields: DynamicField[] = [
    { name: "certificate_name", label: "Certificate Name", type: "text", placeholder: "e.g., AWS Certified Solutions Architect", required: true },
    { name: "issuing_organization", label: "Issuing Organization", type: "text", placeholder: "e.g., Amazon Web Services", required: true },
    { name: "issue_date", label: "Issue Date", type: "date", required: true, textTransform: "uppercase", testTransform: "uppercase" },
    { name: "expiry_date", label: "Expiry Date", type: "date", required: false, textTransform: "uppercase", testTransform: "uppercase" },
    { name: "certificate_file", label: "Certificate File / URL", type: "url", placeholder: "e.g., https://credential-url.com", required: false }
  ];

  const internshipFields: DynamicField[] = [
    { name: "company_name", label: "Company Name", type: "text", placeholder: "e.g., Razorpay", required: true },
    { name: "job_title", label: "Job Title", type: "text", placeholder: "e.g., Frontend Developer Intern", required: true },
    { name: "employment_type", label: "Employment Type", type: "select", options: ["Internship", "Industrial Training", "Apprenticeship", "Part Time", "Full Time"], required: true },
    { name: "location", label: "Location", type: "text", placeholder: "e.g., Remote / Mumbai, India", required: true },
    { name: "start_date", label: "Start Date", type: "date", required: true, textTransform: "uppercase", testTransform: "uppercase" },
    { name: "end_date", label: "End Date", type: "date", required: true, textTransform: "uppercase", testTransform: "uppercase" },
    { name: "technologies_used", label: "Technologies Used (comma separated)", type: "text", placeholder: "e.g., React, TypeScript, Tailwind", required: true }
  ];

  const projectFields: DynamicField[] = [
    { name: "project_name", label: "Project Name", type: "text", placeholder: "e.g., AI Resume Parser", required: true },
    { name: "company_name", label: "Company / Client Name (Optional)", type: "text", placeholder: "e.g., Self Project", required: false },
    { name: "start_date", label: "Start Date", type: "date", required: true, textTransform: "uppercase", testTransform: "uppercase" },
    { name: "end_date", label: "End Date", type: "date", required: true, textTransform: "uppercase", testTransform: "uppercase" },
    { name: "project_link", label: "Project Link (Optional)", type: "url", placeholder: "e.g., https://github.com/...", required: false },
    { name: "project_description", label: "Project Description", type: "textarea", placeholder: "Describe what you built and how you achieved it...", required: true, colSpan: 2 }
  ];

  // Handlers for Add / Edit Modals
  const openAddModal = (section: typeof modalSection) => {
    setModalSection(section);
    setEditingIndex(null);
    setModalInitialValues({});
    setIsModalOpen(true);
  };

  const openEditModal = (section: typeof modalSection, index: number) => {
    setModalSection(section);
    setEditingIndex(index);
    let values = {};
    if (section === "education") values = educationList[index];
    else if (section === "certificate") values = certificatesList[index];
    else if (section === "internship") values = internshipList[index];
    else if (section === "project") values = projectList[index];
    setModalInitialValues(values);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (section: typeof modalSection, index: number) => {
    let newEducation = [...educationList];
    let newCertificates = [...certificatesList];
    let newInternships = [...internshipList];
    let newProjects = [...projectList];

    if (section === "education") {
      newEducation = educationList.filter((_, i) => i !== index);
      setEducationList(newEducation);
    } else if (section === "certificate") {
      newCertificates = certificatesList.filter((_, i) => i !== index);
      setCertificatesList(newCertificates);
    } else if (section === "internship") {
      newInternships = internshipList.filter((_, i) => i !== index);
      setInternshipList(newInternships);
    } else if (section === "project") {
      newProjects = projectList.filter((_, i) => i !== index);
      setProjectList(newProjects);
    }
    showToast("Item deleted successfully", "success");
  };

  const handleFormSubmit = async (data: Record<string, string>) => {
    let newEducation = [...educationList];
    let newCertificates = [...certificatesList];
    let newInternships = [...internshipList];
    let newProjects = [...projectList];

    // Process form values
    if (modalSection === "education") {
      const ed: Education = {
        education_level: data.education_level,
        institution_name: data.institution_name,
        board_university: data.board_university,
        specialization: data.specialization,
        passing_year: Number(data.passing_year),
        percentage_cgpa: data.percentage_cgpa,
        grade: data.grade
      };
      if (editingIndex !== null) {
        newEducation = educationList.map((item, idx) => idx === editingIndex ? ed : item);
        setEducationList(newEducation);
        showToast("Education details updated", "success");
      } else {
        newEducation = [...educationList, ed];
        setEducationList(newEducation);
        showToast("Education details added", "success");
      }
    } else if (modalSection === "certificate") {
      const cert: Certificate = {
        certificate_name: data.certificate_name,
        issuing_organization: data.issuing_organization,
        issue_date: data.issue_date,
        expiry_date: data.expiry_date || "",
        certificate_file: data.certificate_file || ""
      };
      if (editingIndex !== null) {
        newCertificates = certificatesList.map((item, idx) => idx === editingIndex ? cert : item);
        setCertificatesList(newCertificates);
        showToast("Certificate details updated", "success");
      } else {
        newCertificates = [...certificatesList, cert];
        setCertificatesList(newCertificates);
        showToast("Certificate details added", "success");
      }
    } else if (modalSection === "internship") {
      const intern: Internship = {
        company_name: data.company_name,
        job_title: data.job_title,
        employment_type: data.employment_type,
        location: data.location,
        start_date: data.start_date,
        end_date: data.end_date,
        technologies_used: data.technologies_used
      };
      if (editingIndex !== null) {
        newInternships = internshipList.map((item, idx) => idx === editingIndex ? intern : item);
        setInternshipList(newInternships);
        showToast("Internship details updated", "success");
      } else {
        newInternships = [...internshipList, intern];
        setInternshipList(newInternships);
        showToast("Internship details added", "success");
      }
    } else if (modalSection === "project") {
      const proj: Project = {
        project_name: data.project_name,
        company_name: data.company_name || "Self Project",
        start_date: data.start_date,
        end_date: data.end_date,
        project_description: data.project_description,
        project_link: data.project_link || ""
      };
      if (editingIndex !== null) {
        newProjects = projectList.map((item, idx) => idx === editingIndex ? proj : item);
        setProjectList(newProjects);
        showToast("Project details updated", "success");
      } else {
        newProjects = [...projectList, proj];
        setProjectList(newProjects);
        showToast("Project details added", "success");
      }
    }
    setIsModalOpen(false);
  };

  const getSectionConfig = () => {
    switch (modalSection) {
      case "education":
        return {
          title: editingIndex !== null ? "Edit Education" : "Add Education",
          subtitle: "Fill in academic details",
          icon: GraduationCap,
          fields: educationFields
        };
      case "certificate":
        return {
          title: editingIndex !== null ? "Edit Certificate" : "Add Certificate",
          subtitle: "Fill in professional certificate credentials",
          icon: Award,
          fields: certificateFields
        };
      case "internship":
        return {
          title: editingIndex !== null ? "Edit Internship" : "Add Internship",
          subtitle: "Fill in work experience details",
          icon: Briefcase,
          fields: internshipFields
        };
      case "project":
        return {
          title: editingIndex !== null ? "Edit Project" : "Add Project",
          subtitle: "Fill in engineering project details",
          icon: FolderGit2,
          fields: projectFields
        };
    }
  };

  const modalConfig = getSectionConfig();

  // Helper function for Empty Table State
  const renderEmptyState = (section: typeof modalSection, label: string) => (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <FileText className="w-6 h-6" />
      </div>
      <p className="text-slate-500 text-sm font-semibold mb-1">No Data Available</p>
      <p className="text-slate-400 text-xs mb-4">No {label.toLowerCase()} entries have been added to your resume yet.</p>
      <Button
        onClick={() => openAddModal(section)}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold gap-2 px-4 shadow-sm shadow-orange-500/10 active:scale-95 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add {label}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="text-sm font-medium italic tracking-widest uppercase opacity-70">Syncing Resume Details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-200/60 shadow-sm rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Resume Builder</h2>
            <p className="text-xs text-slate-500">Manage and preview your academic and professional credentials</p>
          </div>
        </div>

        <Button
          onClick={() => saveResumeToServer(educationList, certificatesList, internshipList, projectList)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold gap-2 px-6 shadow-sm active:scale-95 transition-all w-full sm:w-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          Update Resume
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
            {/* 1. Education Details */}
            <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">Education Details</h3>
                </div>
                <Button
                  onClick={() => openAddModal("education")}
                  className="bg-slate-950 text-white hover:bg-slate-900 rounded-xl text-xs h-8 font-bold gap-1 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </Button>
              </div>

              <div className="p-4">
                {educationList.length === 0 ? (
                  renderEmptyState("education", "Education")
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="py-3 px-4">No.</th>
                          <th className="py-3 px-4">Education Level</th>
                          <th className="py-3 px-4">Institution Name</th>
                          <th className="py-3 px-4">Board / University</th>
                          <th className="py-3 px-4">Specialization</th>
                          <th className="py-3 px-4">Passing Year</th>
                          <th className="py-3 px-4">Percentage / CGPA</th>
                          <th className="py-3 px-4">Grade</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                        {educationList.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                            <td className="py-4 px-4 text-slate-400 font-bold">{idx + 1}</td>
                            <td className="py-4 px-4 font-bold text-slate-800">{row.education_level}</td>
                            <td className="py-4 px-4">{row.institution_name}</td>
                            <td className="py-4 px-4">{row.board_university}</td>
                            <td className="py-4 px-4">{row.specialization}</td>
                            <td className="py-4 px-4">{row.passing_year}</td>
                            <td className="py-4 px-4 font-bold text-orange-600">{row.percentage_cgpa}</td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">{row.grade}</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <button 
                                  onClick={() => openEditModal("education", idx)}
                                  className="p-1 text-slate-400 hover:text-orange-500 transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem("education", idx)}
                                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Certificates */}
            <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">Certificates</h3>
                </div>
                <Button
                  onClick={() => openAddModal("certificate")}
                  className="bg-slate-950 text-white hover:bg-slate-900 rounded-xl text-xs h-8 font-bold gap-1 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Certificate
                </Button>
              </div>

              <div className="p-4">
                {certificatesList.length === 0 ? (
                  renderEmptyState("certificate", "Certificate")
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="py-3 px-4">No.</th>
                          <th className="py-3 px-4">Certificate Name</th>
                          <th className="py-3 px-4">Issuing Organization</th>
                          <th className="py-3 px-4">Issue Date</th>
                          <th className="py-3 px-4">Expiry Date</th>
                          <th className="py-3 px-4">Certificate File</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                        {certificatesList.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                            <td className="py-4 px-4 text-slate-400 font-bold">{idx + 1}</td>
                            <td className="py-4 px-4 font-bold text-slate-800">{row.certificate_name}</td>
                            <td className="py-4 px-4">{row.issuing_organization}</td>
                            <td className="py-4 px-4">{row.issue_date}</td>
                            <td className="py-4 px-4">{row.expiry_date || "No Expiry"}</td>
                            <td className="py-4 px-4">
                              {row.certificate_file ? (
                                <a 
                                  href={row.certificate_file} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-orange-500 hover:underline flex items-center gap-1.5"
                                >
                                  Credential Link <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 italic">None Provided</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <button 
                                  onClick={() => openEditModal("certificate", idx)}
                                  className="p-1 text-slate-400 hover:text-orange-500 transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem("certificate", idx)}
                                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Internship */}
            <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">Internship</h3>
                </div>
                <Button
                  onClick={() => openAddModal("internship")}
                  className="bg-slate-950 text-white hover:bg-slate-900 rounded-xl text-xs h-8 font-bold gap-1 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Internship
                </Button>
              </div>

              <div className="p-4">
                {internshipList.length === 0 ? (
                  renderEmptyState("internship", "Internship")
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="py-3 px-4">No.</th>
                          <th className="py-3 px-4">Company Name</th>
                          <th className="py-3 px-4">Job Title</th>
                          <th className="py-3 px-4">Employment Type</th>
                          <th className="py-3 px-4">Location</th>
                          <th className="py-3 px-4">Start Date</th>
                          <th className="py-3 px-4">End Date</th>
                          <th className="py-3 px-4">Technologies Used</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                        {internshipList.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                            <td className="py-4 px-4 text-slate-400 font-bold">{idx + 1}</td>
                            <td className="py-4 px-4 font-bold text-slate-800">{row.company_name}</td>
                            <td className="py-4 px-4">{row.job_title}</td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">{row.employment_type}</span>
                            </td>
                            <td className="py-4 px-4">{row.location}</td>
                            <td className="py-4 px-4">{row.start_date}</td>
                            <td className="py-4 px-4">{row.end_date}</td>
                            <td className="py-4 px-4">
                              <div className="flex flex-wrap gap-1">
                                {row.technologies_used.split(",").map((tech, tIdx) => (
                                  <span key={tIdx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                    {tech.trim()}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <button 
                                  onClick={() => openEditModal("internship", idx)}
                                  className="p-1 text-slate-400 hover:text-orange-500 transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem("internship", idx)}
                                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Project */}
            <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">Project</h3>
                </div>
                <Button
                  onClick={() => openAddModal("project")}
                  className="bg-slate-950 text-white hover:bg-slate-900 rounded-xl text-xs h-8 font-bold gap-1 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </Button>
              </div>

              <div className="p-4">
                {projectList.length === 0 ? (
                  renderEmptyState("project", "Project")
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="py-3 px-4">No.</th>
                          <th className="py-3 px-4">Project Name</th>
                          <th className="py-3 px-4">Company Name</th>
                          <th className="py-3 px-4">Start Date</th>
                          <th className="py-3 px-4">End Date</th>
                          <th className="py-3 px-4">Project Link</th>
                          <th className="py-3 px-4">Project Description</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                        {projectList.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                            <td className="py-4 px-4 text-slate-400 font-bold">{idx + 1}</td>
                            <td className="py-4 px-4 font-bold text-slate-800">{row.project_name}</td>
                            <td className="py-4 px-4 text-slate-500">{row.company_name}</td>
                            <td className="py-4 px-4">{row.start_date}</td>
                            <td className="py-4 px-4">{row.end_date}</td>
                            <td className="py-4 px-4">
                              {row.project_link ? (
                                <a 
                                  href={row.project_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-orange-500 hover:text-orange-600 flex items-center gap-1 font-bold"
                                >
                                  Link <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 font-medium">-</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-slate-600 max-w-xs truncate" title={row.project_description}>
                              {row.project_description}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <button 
                                  onClick={() => openEditModal("project", idx)}
                                  className="p-1 text-slate-400 hover:text-orange-500 transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem("project", idx)}
                                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
      </motion.div>

      {/* Reusable Form Modal */}
      {isModalOpen && modalConfig && (
        <DashboardDynamicModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalConfig.title}
          subtitle={modalConfig.subtitle}
          headerIcon={modalConfig.icon}
          iconBgColor="bg-orange-500"
          fields={modalConfig.fields}
          initialValues={modalInitialValues}
          onSubmit={handleFormSubmit}
          loading={false}
          submitText="Save Details"
        />
      )}
    </div>
  );
}
