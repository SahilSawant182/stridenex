"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Clock,
  Plus,
  Search,
  Users,
  Trophy,
  ArrowLeft,
  Download,
  CheckCircle2,
  ChevronRight,
  Mail,
  Send,
  Bell,
  FileText,
  DollarSign,
  Star,
  Hourglass,
  Check,
  ChevronDown,
  TrendingUp
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { useToast } from "@/context/ToastContext";
import DashboardDynamicModal, { DynamicField } from "@/components/dashboards/shared/DashboardDynamicModal";
import PlacementTabContent from "./PlacementTabContent";

// Rich student dataset for the tracker and eligibility checks
const initialStudents = [
  { id: "s1", name: "Priya Sharma", branch: "CSE", cgpa: 8.7, backlogs: 0, drivesApplied: 2, shortlisted: 1, selectedId: "2394", package: "₹22 LPA", status: "Placed" },
  { id: "s2", name: "Rahul Mehta", branch: "ECE", cgpa: 7.2, backlogs: 0, drivesApplied: 2, shortlisted: 0, selectedId: "", package: "", status: "In Process" },
  { id: "s3", name: "Aisha Khan", branch: "MBA", cgpa: 8.1, backlogs: 0, drivesApplied: 1, shortlisted: 0, selectedId: "", package: "", status: "In Process" },
  { id: "s4", name: "Vikram Singh", branch: "ME", cgpa: 6.8, backlogs: 0, drivesApplied: 3, shortlisted: 1, selectedId: "", package: "", status: "Shortlisted" },
  { id: "s5", name: "Sneha Patil", branch: "CSE", cgpa: 9.1, backlogs: 0, drivesApplied: 2, shortlisted: 1, selectedId: "", package: "", status: "Shortlisted" },
  { id: "s6", name: "Arjun Nair", branch: "CSE", cgpa: 8.4, backlogs: 0, drivesApplied: 1, shortlisted: 1, selectedId: "2401", package: "₹9 LPA", status: "Placed" },
  { id: "s7", name: "Kiran Reddy", branch: "ECE", cgpa: 7.8, backlogs: 0, drivesApplied: 1, shortlisted: 0, selectedId: "", package: "", status: "In Process" },
  { id: "s8", name: "Tanya Gupta", branch: "CSE", cgpa: 6.9, backlogs: 1, drivesApplied: 0, shortlisted: 0, selectedId: "", package: "", status: "Not Applied" }
];

// Active drives data
const initialDrives = [
  {
    id: "tcs-2025",
    company: "TCS",
    role: "Software Engineer · Systems Engineer",
    driveDate: "2026-03-15",
    regDeadline: "2026-03-10",
    package: "₹7-11 LPA",
    type: "Full-Time",
    criteria: {
      minCgpa: 6,
      backlogs: 0,
      branches: ["CSE", "ECE", "IT", "ME"],
      passingYear: 2025
    },
    stats: {
      eligible: 6,
      registered: 4,
      shortlisted: 2,
      selected: 1
    },
    status: "Registrations Open",
    students: [
      { id: "s1", name: "Priya Sharma", branch: "CSE", cgpa: 8.7, backlogs: 0, status: "Registered", placementStatus: "Placed" },
      { id: "s2", name: "Rahul Mehta", branch: "ECE", cgpa: 7.2, backlogs: 0, status: "Registered", placementStatus: "" },
      { id: "s4", name: "Arjun Nair", branch: "CSE", cgpa: 8.4, backlogs: 0, status: "Registered", placementStatus: "Placed" },
      { id: "s5", name: "Sneha Patil", branch: "CSE", cgpa: 9.1, backlogs: 0, status: "Shortlisted", placementStatus: "" },
      { id: "s6", name: "Arjun Nair", branch: "CSE", cgpa: 8.4, backlogs: 0, status: "Selected", placementStatus: "Placed" },
      { id: "s7", name: "Kiran Reddy", branch: "ECE", cgpa: 7.8, backlogs: 0, status: "Eligible", placementStatus: "" }
    ]
  },
  {
    id: "infosys-2025",
    company: "Infosys",
    role: "Systems Engineer · Process Executive",
    driveDate: "2026-03-18",
    regDeadline: "2026-03-12",
    package: "₹6.5 LPA",
    type: "Full-Time",
    criteria: {
      minCgpa: 5.5,
      backlogs: 0,
      branches: ["CSE", "ECE", "ME"],
      passingYear: 2025
    },
    stats: {
      eligible: 5,
      registered: 2,
      shortlisted: 1,
      selected: 0
    },
    status: "Registrations Open",
    students: [
      { id: "s1", name: "Priya Sharma", branch: "CSE", cgpa: 8.7, backlogs: 0, status: "Registered", placementStatus: "Placed" },
      { id: "s2", name: "Rahul Mehta", branch: "ECE", cgpa: 7.2, backlogs: 0, status: "Registered", placementStatus: "" }
    ]
  },
  {
    id: "razorpay-2025",
    company: "Razorpay",
    role: "Backend Engineer · Data Scientist · PM",
    driveDate: "2026-03-25",
    regDeadline: "2026-03-18",
    package: "₹18-24 LPA",
    type: "Full-Time + PPO",
    criteria: {
      minCgpa: 7.5,
      backlogs: 0,
      branches: ["CSE", "IT", "ECE"],
      passingYear: 2025
    },
    stats: {
      eligible: 4,
      registered: 2,
      shortlisted: 1,
      selected: 0
    },
    status: "Registrations Open",
    students: [
      { id: "s1", name: "Priya Sharma", branch: "CSE", cgpa: 8.7, backlogs: 0, status: "Registered", placementStatus: "Placed" },
      { id: "s5", name: "Sneha Patil", branch: "CSE", cgpa: 9.1, backlogs: 0, status: "Registered", placementStatus: "" }
    ]
  }
];

export default function CampusDrivesTabContent() {
  const { showToast } = useToast();
  const [drivesList, setDrivesList] = useState<any[]>(initialDrives);
  const [studentsList, setStudentsList] = useState<any[]>(initialStudents);
  const [selectedDrive, setSelectedDrive] = useState<any | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"drives" | "placement" | "tracker" | "eligibility" | "stats">("drives");

  // Eligibility view active drive selection state
  const [eligibilityDriveId, setEligibilityDriveId] = useState(initialDrives[0].id);

  // Student table filter inside details view
  const [selectedStudentStatusFilter, setSelectedStudentStatusFilter] = useState<"Eligible" | "Registered" | "Shortlisted" | "Selected">("Registered");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDriveModalOpen, setIsAddDriveModalOpen] = useState(false);
  const [isSubmittingDrive, setIsSubmittingDrive] = useState(false);

  // Filter drives list based on search query
  const filteredDrives = useMemo(() => {
    return drivesList.filter(drive =>
      drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [drivesList, searchQuery]);

  // Compute drives metrics banner
  const drivesMetrics = useMemo(() => {
    const totalDrives = drivesList.length + 3; // total 6 matching mockup
    const regOpenNow = drivesList.filter(d => d.status === "Registrations Open").length;
    const studentsRegistered = 826;
    const offersConfirmed = 2;

    return { totalDrives, regOpenNow, studentsRegistered, offersConfirmed };
  }, [drivesList]);

  // Compute Student Tracker metrics
  const trackerMetrics = useMemo(() => {
    const placed = studentsList.filter(s => s.status === "Placed").length;
    const shortlisted = studentsList.filter(s => s.status === "Shortlisted").length;
    const applied = studentsList.filter(s => s.drivesApplied > 0).length;
    const notApplied = studentsList.filter(s => s.drivesApplied === 0).length;

    return { placed, shortlisted, applied, notApplied };
  }, [studentsList]);

  // Resolve active eligibility drive details
  const activeEligibilityDrive = useMemo(() => {
    return drivesList.find(d => d.id === eligibilityDriveId) || drivesList[0];
  }, [drivesList, eligibilityDriveId]);

  // Calculate dynamic eligibility lists based on selected drive criteria
  const eligibilityLists = useMemo(() => {
    if (!activeEligibilityDrive) return { eligible: [], notEligible: [] };
    const criteria = activeEligibilityDrive.criteria;
    const eligible: any[] = [];
    const notEligible: any[] = [];

    studentsList.forEach(student => {
      const failsCgpa = student.cgpa < criteria.minCgpa;
      const failsBacklog = student.backlogs > criteria.backlogs;
      const failsBranch = !criteria.branches.includes(student.branch);

      if (failsCgpa || failsBacklog || failsBranch) {
        let reason = "Branch not eligible";
        if (failsBacklog) reason = "Has backlogs";
        else if (failsCgpa) reason = "Low CGPA";

        notEligible.push({ ...student, reason });
      } else {
        eligible.push(student);
      }
    });

    return { eligible, notEligible };
  }, [activeEligibilityDrive, studentsList]);

  // Add Drive Modal setup
  const addDriveFields: DynamicField[] = useMemo(() => [
    { name: "company", label: "Company Name", type: "text", required: true, placeholder: "e.g., Google" },
    { name: "role", label: "Job Role / Title", type: "text", required: true, colSpan: 2, placeholder: "e.g., Software Engineer" },
    { name: "driveDate", label: "Drive Date", type: "date", required: true },
    { name: "regDeadline", label: "Registration Deadline", type: "date", required: true },
    { name: "package", label: "CTC Package Offered", type: "text", required: true, placeholder: "e.g., ₹12-15 LPA" },
    {
      name: "type",
      label: "Job Type",
      type: "select",
      options: ["Full-Time", "Full-Time + PPO", "Internship"],
      required: true
    },
    { name: "minCgpa", label: "Minimum CGPA Criteria", type: "number", required: true, placeholder: "e.g. 6.0" },
    { name: "backlogs", label: "Max Allowed Backlogs", type: "number", required: true, placeholder: "e.g. 0" },
    { name: "branches", label: "Eligible Branches (comma separated)", type: "text", required: true, colSpan: 2, placeholder: "CSE, ECE, IT" }
  ], []);

  const handleAddDriveSubmit = async (formData: any) => {
    setIsSubmittingDrive(true);
    try {
      const branchesArray = formData.branches
        ? formData.branches.split(",").map((s: string) => s.trim().toUpperCase())
        : ["CSE"];

      const newDrive = {
        id: `drive-${Date.now()}`,
        company: formData.company,
        role: formData.role,
        driveDate: formData.driveDate,
        regDeadline: formData.regDeadline,
        package: formData.package,
        type: formData.type,
        criteria: {
          minCgpa: Number(formData.minCgpa) || 6,
          backlogs: Number(formData.backlogs) || 0,
          branches: branchesArray,
          passingYear: 2025
        },
        stats: {
          eligible: 150,
          registered: 0,
          shortlisted: 0,
          selected: 0
        },
        status: "Registrations Open",
        students: [
          { id: "n1", name: "Kunal Shah", branch: "CSE", cgpa: 8.5, backlogs: 0, status: "Eligible", placementStatus: "" },
          { id: "n2", name: "Meera Sen", branch: "IT", cgpa: 7.9, backlogs: 0, status: "Eligible", placementStatus: "" }
        ]
      };

      setDrivesList(prev => [newDrive, ...prev]);
      showToast("Campus Drive created successfully", "success");
      setIsAddDriveModalOpen(false);
    } catch (err: any) {
      showToast("Failed to create Campus Drive", "error");
    } finally {
      setIsSubmittingDrive(false);
    }
  };

  // Student list filtering within individual drive details panel
  const filteredStudents = useMemo(() => {
    if (!selectedDrive) return [];
    return selectedDrive.students.filter((student: any) => {
      if (selectedStudentStatusFilter === "Eligible") {
        return student.status === "Eligible" || student.status === "Registered" || student.status === "Shortlisted" || student.status === "Selected";
      }
      return student.status === selectedStudentStatusFilter;
    });
  }, [selectedDrive, selectedStudentStatusFilter]);

  // Handle student shortlisting action inside details panel
  const handleStudentAction = (studentId: string, currentStatus: string) => {
    if (!selectedDrive) return;

    let nextStatus = "Registered";
    let toastMessage = "";

    if (currentStatus === "Registered") {
      nextStatus = "Shortlisted";
      toastMessage = "Student shortlisted successfully";
    } else if (currentStatus === "Shortlisted") {
      nextStatus = "Selected";
      toastMessage = "Student selected successfully";
    } else if (currentStatus === "Selected") {
      nextStatus = "Registered";
      toastMessage = "Student status reset to registered";
    }

    const updatedStudents = selectedDrive.students.map((student: any) => {
      if (student.id === studentId) {
        return { ...student, status: nextStatus };
      }
      return student;
    });

    const stats = {
      eligible: updatedStudents.length,
      registered: updatedStudents.filter((s: any) => s.status === "Registered").length,
      shortlisted: updatedStudents.filter((s: any) => s.status === "Shortlisted").length,
      selected: updatedStudents.filter((s: any) => s.status === "Selected").length
    };

    const updatedDrive = {
      ...selectedDrive,
      students: updatedStudents,
      stats
    };

    setDrivesList(prev => prev.map(d => d.id === selectedDrive.id ? updatedDrive : d));
    setSelectedDrive(updatedDrive);
    showToast(toastMessage, "success");
  };

  // Notification buttons toast triggers
  const triggerNotification = (type: string) => {
    switch (type) {
      case 'eligible':
        showToast(`Notification sent to all eligible students!`, "success");
        break;
      case 'remind':
        showToast(`Registration reminder sent to registered students!`, "success");
        break;
      case 'notice':
        showToast("Campus drive details successfully posted to College Notice Board!", "success");
        break;
      case 'shortlist':
        showToast(`Shortlist results dispatched to candidates!`, "success");
        break;
      default:
        break;
    }
  };

  // CSV download notification
  const handleExportCSV = () => {
    showToast("Preparing CSV export... Student list downloaded successfully.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Placement Management Title & Header (Visible across all main sub-tabs except individual drive details) */}
      {!selectedDrive && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Placement Management</h2>
            <p className="text-sm font-semibold text-slate-500">Manage campus drives, eligibility, shortlisting, and offer tracking — end to end</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => showToast("Redirecting to Company import pipeline...", "info")}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 h-11 rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Import Companies
            </button>
            <button
              onClick={() => setIsAddDriveModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2 h-11 rounded-xl flex items-center gap-2 text-sm shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Campus Drive
            </button>
          </div>
        </div>
      )}

      {/* Inner Sub Tabs bar (Hidden on individual drive details panel) */}
      {!selectedDrive && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveSubTab("drives")}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeSubTab === "drives"
              ? "border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-lg font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 font-semibold"
              }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Campus Drives
          </button>
          <button
            onClick={() => setActiveSubTab("placement")}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeSubTab === "placement"
              ? "border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-lg font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 font-semibold"
              }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Placement
          </button>
          <button
            onClick={() => setActiveSubTab("tracker")}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeSubTab === "tracker"
              ? "border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-lg font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 font-semibold"
              }`}
          >
            <Users className="w-3.5 h-3.5" />
            Student Tracker
          </button>
          <button
            onClick={() => setActiveSubTab("eligibility")}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeSubTab === "eligibility"
              ? "border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-lg font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 font-semibold"
              }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Eligibility Check
          </button>
          <button
            onClick={() => setActiveSubTab("stats")}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeSubTab === "stats"
              ? "border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-lg font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 font-semibold"
              }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Placement Stats
          </button>
        </div>
      )}

      {/* Main Switcher Content Container */}
      <AnimatePresence mode="wait">
        {selectedDrive ? (
          // ==================== 0. INDIVIDUAL DRIVE MANAGE PANELS ====================
          <motion.div
            key="details-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Back Link */}
            <button
              onClick={() => setSelectedDrive(null)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Drives
            </button>

            {/* Gradient Drive Banner Header */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white p-8 shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-inner shrink-0">
                    {selectedDrive.company.charAt(0)}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight">{selectedDrive.company} — Campus Drive 2025</h2>
                    <p className="text-slate-200 text-sm font-semibold">{selectedDrive.role}</p>

                    <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-slate-100">
                      <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                        <Calendar className="w-3.5 h-3.5 text-blue-300" />
                        Drive: {new Date(selectedDrive.driveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-orange-300" />
                        Reg closes: {new Date(selectedDrive.regDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-amber-300">
                        <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                        {selectedDrive.package}
                      </span>
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-full uppercase text-[10px] tracking-wider font-bold flex items-center gap-1">
                        ● {selectedDrive.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-tab Filtering Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                onClick={() => setSelectedStudentStatusFilter("Eligible")}
                className={`p-5 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between border-t-4 border-t-blue-500 ${selectedStudentStatusFilter === "Eligible" ? "ring-2 ring-blue-500/25 border-blue-500 shadow-md" : "border-slate-200"
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Eligible</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <h4 className="text-xl font-bold text-slate-800">{selectedDrive.stats.eligible} <span className="text-xs font-semibold text-slate-400">Students</span></h4>
              </div>

              <div
                onClick={() => setSelectedStudentStatusFilter("Registered")}
                className={`p-5 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between border-t-4 border-t-orange-500 ${selectedStudentStatusFilter === "Registered" ? "ring-2 ring-orange-500/25 border-orange-500 shadow-md" : "border-slate-200"
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered</span>
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                </div>
                <h4 className="text-xl font-bold text-slate-800">{selectedDrive.stats.registered} <span className="text-xs font-semibold text-slate-400">Students</span></h4>
              </div>

              <div
                onClick={() => setSelectedStudentStatusFilter("Shortlisted")}
                className={`p-5 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between border-t-4 border-t-amber-500 ${selectedStudentStatusFilter === "Shortlisted" ? "ring-2 ring-amber-500/25 border-amber-500 shadow-md" : "border-slate-200"
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shortlisted</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <h4 className="text-xl font-bold text-slate-800">{selectedDrive.stats.shortlisted} <span className="text-xs font-semibold text-slate-400">Students</span></h4>
              </div>

              <div
                onClick={() => setSelectedStudentStatusFilter("Selected")}
                className={`p-5 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between border-t-4 border-t-emerald-500 ${selectedStudentStatusFilter === "Selected" ? "ring-2 ring-emerald-500/25 border-emerald-500 shadow-md" : "border-slate-200"
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <h4 className="text-xl font-bold text-slate-800">{selectedDrive.stats.selected} <span className="text-xs font-semibold text-slate-400">Students</span></h4>
              </div>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

              {/* Left Column: Student Table */}
              <div className="lg:col-span-2 space-y-4">
                <BaseCard className="bg-white border-slate-200/60 shadow-sm p-0 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                    <h3 className="text-sm font-bold text-slate-800 tracking-wide">
                      {selectedStudentStatusFilter} Students ({filteredStudents.length})
                    </h3>
                    <button onClick={handleExportCSV} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-5">Student</th>
                          <th className="py-3 px-4">Branch</th>
                          <th className="py-3 px-4">CGPA</th>
                          <th className="py-3 px-4">Backlogs</th>
                          <th className="py-3 px-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-10 text-center">
                              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs text-slate-400 font-semibold">No students in this list</p>
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student: any) => (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                                    {student.name.split(' ').map((n: string) => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                      {student.name}
                                      {student.placementStatus && (
                                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                          ✓ {student.placementStatus}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                  {student.branch}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-xs text-emerald-600">
                                {student.cgpa}
                              </td>
                              <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">
                                {student.backlogs === 0 ? (
                                  <span className="text-emerald-600 font-bold">✓ 0</span>
                                ) : (
                                  <span className="text-red-500 font-bold">{student.backlogs}</span>
                                )}
                              </td>
                              <td className="py-3.5 px-5 text-right">
                                <button
                                  onClick={() => handleStudentAction(student.id, student.status)}
                                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all border ${student.status === "Registered"
                                    ? "bg-orange-500 hover:bg-orange-600 border-orange-500 text-white hover:border-orange-600"
                                    : student.status === "Shortlisted"
                                      ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
                                      : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                                    }`}
                                >
                                  {student.status === "Registered" && "Shortlist"}
                                  {student.status === "Shortlisted" && "Select"}
                                  {student.status === "Selected" && "Reset"}
                                  {student.status === "Eligible" && "Register"}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </BaseCard>
              </div>

              {/* Right Column: Criteria & Notifications Panel */}
              <div className="space-y-6">
                <BaseCard className="bg-white border-slate-200/60 shadow-sm p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500" /> Drive Criteria
                  </h3>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold">Min CGPA</span>
                      <span className="font-bold text-slate-800 text-sm">{selectedDrive.criteria.minCgpa}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold">Active Backlogs</span>
                      <span className="font-bold text-slate-800 text-sm">{selectedDrive.criteria.backlogs}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold">Year of Passing</span>
                      <span className="font-bold text-slate-800 text-sm">{selectedDrive.criteria.passingYear}</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <span className="text-slate-500 font-semibold block">Eligible Branches</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDrive.criteria.branches.map((b: string) => (
                          <span key={b} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </BaseCard>

                <BaseCard className="bg-white border-slate-200/60 shadow-sm p-5 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-slate-500" /> Notify Students
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      Send drive notifications to eligible or registered students via app, email, and notice board.
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => triggerNotification('eligible')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl w-full text-[10px] uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3 h-3" /> Notify All Eligible ({selectedDrive.stats.eligible})
                    </button>
                    <button
                      onClick={() => triggerNotification('remind')}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl w-full text-[10px] uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3 h-3" /> Remind Registered ({selectedDrive.stats.registered})
                    </button>
                    <button
                      onClick={() => triggerNotification('notice')}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl w-full text-[10px] uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3 h-3 text-slate-400" /> Post to Notice Board
                    </button>
                    <button
                      onClick={() => triggerNotification('shortlist')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl w-full text-[10px] uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Send Shortlist Results
                    </button>
                  </div>
                </BaseCard>
              </div>
            </div>
          </motion.div>
        ) : activeSubTab === "tracker" ? (
          // ==================== 1. STUDENT TRACKER VIEW ====================
          <motion.div
            key="tracker-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Tracker Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Placed</p>
                  <h4 className="text-2xl font-bold text-slate-800">{trackerMetrics.placed}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
                  <Trophy className="w-5 h-5" />
                </div>
              </BaseCard>
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Shortlisted</p>
                  <h4 className="text-2xl font-bold text-slate-800">{trackerMetrics.shortlisted}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm shadow-orange-100">
                  <Star className="w-5 h-5" />
                </div>
              </BaseCard>
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Applied to Drives</p>
                  <h4 className="text-2xl font-bold text-slate-800">{trackerMetrics.applied}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                  <FileText className="w-5 h-5" />
                </div>
              </BaseCard>
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Not Applied Yet</p>
                  <h4 className="text-2xl font-bold text-slate-800">{trackerMetrics.notApplied}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm shadow-amber-100">
                  <Hourglass className="w-5 h-5" />
                </div>
              </BaseCard>
            </div>

            {/* Tracker Student Table */}
            <BaseCard className="bg-white border-slate-200/60 shadow-sm p-0 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <h3 className="text-sm font-bold text-slate-800 tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  All Final Year Students — Placement Tracker
                </h3>
                <button onClick={handleExportCSV} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-5">Student</th>
                      <th className="py-3 px-4">Branch</th>
                      <th className="py-3 px-4">CGPA</th>
                      <th className="py-3 px-4">Drives Applied</th>
                      <th className="py-3 px-4">Shortlisted</th>
                      <th className="py-3 px-4">Selected</th>
                      <th className="py-3 px-4">Package</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {studentsList.map((student: any) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                              {student.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <span className="text-xs font-bold text-slate-800">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">{student.branch}</td>
                        <td className="py-3.5 px-4 text-xs font-bold text-emerald-600">{student.cgpa}</td>
                        <td className="py-3.5 px-4 text-xs font-bold text-slate-700 pl-8">{student.drivesApplied}</td>
                        <td className="py-3.5 px-4 text-xs font-bold pl-8 text-orange-600">{student.shortlisted}</td>
                        <td className="py-3.5 px-4 text-xs">
                          {student.selectedId ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5 w-fit">
                              ✓{student.selectedId}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-bold text-amber-700">{student.package || <span className="text-slate-400 font-normal">—</span>}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${student.status === "Placed"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                            : student.status === "Shortlisted"
                              ? "bg-orange-50 text-orange-600 border border-orange-200/50"
                              : student.status === "In Process"
                                ? "bg-blue-50 text-blue-600 border border-blue-200/50"
                                : "bg-slate-50 text-slate-500 border border-slate-200/50"
                            }`}>
                            {student.status === "Placed" && "✓ Placed"}
                            {student.status === "Shortlisted" && "Shortlisted"}
                            {student.status === "In Process" && "In Process"}
                            {student.status === "Not Applied" && "Not Applied"}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => showToast(`Opening profile of ${student.name}`, "info")}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider shadow-sm transition-all"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BaseCard>
          </motion.div>
        ) : activeSubTab === "eligibility" ? (
          // ==================== 2. ELIGIBILITY CHECK VIEW ====================
          <motion.div
            key="eligibility-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Top Selection Row */}
            <BaseCard className="p-5 bg-white border-slate-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:max-w-md">
                <span className="text-xs font-bold text-slate-500 shrink-0">Check eligibility for:</span>
                <div className="relative flex-1">
                  <select
                    value={eligibilityDriveId}
                    onChange={(e) => setEligibilityDriveId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 appearance-none pr-8 cursor-pointer"
                  >
                    {drivesList.map(drive => (
                      <option key={drive.id} value={drive.id}>
                        {drive.company} — {new Date(drive.driveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end md:self-auto">
                <button
                  onClick={() => triggerNotification('eligible')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Notify Eligible
                </button>
                <button
                  onClick={handleExportCSV}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  Export List
                </button>
              </div>
            </BaseCard>

            {/* Criteria Banner and Count */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Drive Criteria</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
                  <span>Min CGPA: <strong className="text-blue-600 text-sm font-bold">{activeEligibilityDrive.criteria.minCgpa}</strong></span>
                  <span>Max Backlogs: <strong className="text-blue-600 text-sm font-bold">{activeEligibilityDrive.criteria.backlogs}</strong></span>
                  <span>Year: <strong className="text-blue-600 text-sm font-bold">{activeEligibilityDrive.criteria.passingYear}</strong></span>
                  <span className="flex items-center gap-1">
                    Eligible Branches:
                    <strong className="text-orange-600 font-bold">{activeEligibilityDrive.criteria.branches.join(", ")}</strong>
                  </span>
                </div>
              </div>

              <div className="text-center shrink-0 bg-white border border-slate-200/50 p-4 rounded-xl shadow-sm flex items-center gap-4">
                <div className="text-right">
                  <h4 className="text-xl font-bold text-emerald-600 leading-none">{eligibilityLists.eligible.length} Eligible</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">out of {studentsList.length} total</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm font-bold border border-emerald-100">
                  {eligibilityLists.eligible.length}
                </div>
              </div>
            </div>

            {/* Eligible / Non Eligible Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Eligible Column */}
              <BaseCard className="bg-white border-slate-200/60 shadow-sm p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-emerald-50/20 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Eligible Students ({eligibilityLists.eligible.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-4">Student</th>
                        <th className="py-2.5 px-4">Branch</th>
                        <th className="py-2.5 px-4">CGPA</th>
                        <th className="py-2.5 px-4">Backlogs</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                      {eligibilityLists.eligible.map((student: any) => (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800">{student.name}</td>
                          <td className="py-3 px-4"><span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{student.branch}</span></td>
                          <td className="py-3 px-4 font-bold text-emerald-600">{student.cgpa}</td>
                          <td className="py-3 px-4">
                            {student.backlogs === 0 ? <span className="text-emerald-600 font-bold">✓</span> : student.backlogs}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => showToast(`Notified ${student.name} about ${activeEligibilityDrive.company} drive eligibility!`, "success")}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider transition-colors shadow-sm"
                            >
                              Notify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </BaseCard>

              {/* Not Eligible Column */}
              <BaseCard className="bg-white border-slate-200/60 shadow-sm p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-red-50/20 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-red-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-red-600" />
                    Not Eligible ({eligibilityLists.notEligible.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-4">Student</th>
                        <th className="py-2.5 px-4">CGPA</th>
                        <th className="py-2.5 px-4">Branch</th>
                        <th className="py-2.5 px-4">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                      {eligibilityLists.notEligible.map((student: any) => (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800">{student.name}</td>
                          <td className="py-3 px-4 font-bold text-slate-500">{student.cgpa}</td>
                          <td className="py-3 px-4"><span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{student.branch}</span></td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                              {student.reason}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </BaseCard>

            </div>
          </motion.div>
        ) : activeSubTab === "stats" ? (
          // ==================== 3. PLACEMENT STATS VIEW ====================
          <motion.div
            key="stats-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Stats Metrics banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Placement Rate</p>
                  <h4 className="text-2xl font-bold text-slate-800">82%</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                  <FileText className="w-5 h-5" />
                </div>
              </BaseCard>
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Average CTC</p>
                  <h4 className="text-2xl font-bold text-slate-800">₹11.2L</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm shadow-amber-100">
                  <DollarSign className="w-5 h-5" />
                </div>
              </BaseCard>
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Highest CTC</p>
                  <h4 className="text-2xl font-bold text-slate-800">₹55 LPA</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm shadow-purple-100">
                  <Trophy className="w-5 h-5" />
                </div>
              </BaseCard>
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Companies Visited</p>
                  <h4 className="text-2xl font-bold text-slate-800">24</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm shadow-slate-100">
                  <Briefcase className="w-5 h-5" />
                </div>
              </BaseCard>
            </div>

            {/* Split Panel: Company-wise selections and Branch-wise rates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Company Selections Panel */}
              <BaseCard className="bg-white border-slate-200/60 shadow-sm p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company-wise Selections</h3>
                <div className="space-y-4">
                  {[
                    { company: "TCS", range: "₹7-11 LPA", color: "bg-blue-600" },
                    { company: "Infosys", range: "₹6.5 LPA", color: "bg-emerald-600" },
                    { company: "Razorpay", range: "₹18-24 LPA", color: "bg-orange-600" },
                    { company: "Wipro", range: "₹6.5-8 LPA", color: "bg-indigo-600" },
                    { company: "Accenture", range: "₹7-10 LPA", color: "bg-purple-600" }
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                          {c.company.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{c.company}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{c.range}</p>
                        </div>
                      </div>
                      <span className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden relative">
                        <span className={`absolute top-0 bottom-0 left-0 ${c.color}`} style={{ width: `${80 - i * 15}%` }}></span>
                      </span>
                    </div>
                  ))}
                </div>
              </BaseCard>

              {/* Branch Placements Panel */}
              <BaseCard className="bg-white border-slate-200/60 shadow-sm p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Branch-wise Placement Rate</h3>
                <div className="space-y-3.5">
                  {[
                    { branch: "CSE", ratio: "38/42", rate: 90, color: "bg-emerald-500" },
                    { branch: "ECE", ratio: "28/36", rate: 78, color: "bg-emerald-500" },
                    { branch: "IT", ratio: "22/28", rate: 79, color: "bg-emerald-500" },
                    { branch: "MBA", ratio: "14/18", rate: 78, color: "bg-emerald-500" },
                    { branch: "ME", ratio: "18/34", rate: 53, color: "bg-red-500" },
                    { branch: "Civil", ratio: "8/22", rate: 36, color: "bg-red-500" }
                  ].map((b, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{b.branch} <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">({b.ratio})</span></span>
                        <span className="font-bold text-slate-800">{b.rate}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.rate}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </BaseCard>

            </div>

            {/* CTC Distribution Panel (CSS bar graph) */}
            <BaseCard className="bg-white border-slate-200/60 shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">CTC Distribution</h3>
              <div className="h-64 flex items-end justify-between pt-6 px-4 md:px-12 border-b border-slate-100 pb-2 gap-4">
                {[
                  { range: "<5L", height: "30%", val: "3.5 LPA", desc: "Min CTC" },
                  { range: "5-8L", height: "50%", val: "10.2 LPA", desc: "Median CTC" },
                  { range: "8-12L", height: "90%", val: "11.2 LPA", desc: "Mean CTC" },
                  { range: "12-18L", height: "80%", val: "55 LPA", desc: "Max CTC" },
                  { range: "18-25L", height: "40%", val: "", desc: "" },
                  { range: "25L+", height: "20%", val: "", desc: "" }
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Hover tooltip for CTC distribution values */}
                    {item.val && (
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-850 bg-slate-800 text-white rounded-lg p-2 text-[10px] font-bold text-center shadow-lg pointer-events-none z-10 w-24">
                        <p className="text-orange-400">{item.val}</p>
                        <p className="text-slate-300 uppercase tracking-widest text-[8px]">{item.desc}</p>
                      </div>
                    )}

                    {/* Animated vertical bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: item.height }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="w-full bg-orange-100 group-hover:bg-orange-500 rounded-t-lg transition-colors cursor-pointer relative"
                    >
                      {/* Highlight core metrics bar with a darker tone */}
                      {item.val && (
                        <div className="absolute inset-0 bg-orange-500/20 rounded-t-lg group-hover:bg-transparent"></div>
                      )}
                    </motion.div>

                    <span className="text-[10px] font-bold text-slate-500 mt-2">{item.range}</span>
                    {item.val && (
                      <span className="text-[9px] font-extrabold text-orange-600 mt-0.5 whitespace-nowrap">{item.val}</span>
                    )}
                  </div>
                ))}
              </div>
            </BaseCard>
          </motion.div>
        ) : activeSubTab === "placement" ? (
          // ==================== 4. PLACEMENT OVERVIEW VIEW ====================
          <motion.div
            key="placement-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <PlacementTabContent />
          </motion.div>
        ) : (
          // ==================== 5. GENERAL CAMPUS DRIVES LIST (Image 1) ====================
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Metrics cards banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Total Drives (2025)</p>
                  <h4 className="text-2xl font-bold text-slate-800">{drivesMetrics.totalDrives}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                  <Briefcase className="w-5 h-5" />
                </div>
              </BaseCard>
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Reg Open Now</p>
                  <h4 className="text-2xl font-bold text-slate-800">{drivesMetrics.regOpenNow}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm shadow-orange-100">
                  <Calendar className="w-5 h-5" />
                </div>
              </BaseCard>
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Students Registered</p>
                  <h4 className="text-2xl font-bold text-slate-800">{drivesMetrics.studentsRegistered}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
                  <Users className="w-5 h-5" />
                </div>
              </BaseCard>
              <BaseCard className="p-5 border-slate-200/60 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Offers Confirmed</p>
                  <h4 className="text-2xl font-bold text-slate-800">{drivesMetrics.offersConfirmed}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm shadow-purple-100">
                  <Trophy className="w-5 h-5" />
                </div>
              </BaseCard>
            </div>

            {/* Drives List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Campus Drives</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search drives, companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {filteredDrives.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-700">No drives match your search</h4>
                  <p className="text-xs text-slate-400 mt-1">Try refining your search keyword</p>
                </div>
              ) : (
                filteredDrives.map(drive => (
                  <BaseCard key={drive.id} className="p-5 bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow transition-all relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                    <div className={`absolute top-0 bottom-0 left-0 w-1 ${drive.company === 'TCS' ? 'bg-blue-600' : drive.company === 'Infosys' ? 'bg-emerald-600' : 'bg-orange-600'
                      }`}></div>

                    <div className="flex items-start gap-4 pl-2 max-w-xl">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm ${drive.company === 'TCS' ? 'bg-blue-600' : drive.company === 'Infosys' ? 'bg-emerald-600' : 'bg-orange-600'
                        }`}>
                        {drive.company.charAt(0)}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{drive.company}</h4>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {drive.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500">{drive.role}</p>

                        <div className="flex flex-wrap gap-2.5 pt-1 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Drive: {new Date(drive.driveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Reg Deadline: {new Date(drive.regDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg text-amber-700 font-semibold">
                            <DollarSign className="w-3 h-3 text-amber-500" />
                            {drive.package}
                          </span>
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                            {drive.type}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-semibold pt-1">
                          Criteria: <strong className="text-slate-600 font-bold">Min CGPA: {drive.criteria.minCgpa}</strong> | <strong className="text-slate-600 font-bold">Backlogs: {drive.criteria.backlogs}</strong> | {drive.criteria.branches.join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
                      <div className="flex items-center gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-slate-700">{drive.stats.eligible}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Eligible</p>
                        </div>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <div>
                          <p className="text-lg font-bold text-orange-600">{drive.stats.registered}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered</p>
                        </div>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <div>
                          <p className="text-lg font-bold text-emerald-600">{drive.stats.selected}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedDrive(drive);
                          setSelectedStudentStatusFilter("Registered");
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all uppercase tracking-wider shrink-0"
                      >
                        Manage <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </BaseCard>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Drive Modal */}
      <DashboardDynamicModal
        isOpen={isAddDriveModalOpen}
        onClose={() => setIsAddDriveModalOpen(false)}
        title="Add Campus Drive"
        subtitle="Configure criteria and publish a new campus recruitment drive"
        headerIcon={Briefcase}
        iconBgColor="bg-orange-500"
        fields={addDriveFields}
        onSubmit={handleAddDriveSubmit}
        loading={isSubmittingDrive}
      />
    </div>
  );
}
