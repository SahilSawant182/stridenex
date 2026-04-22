// components/dashboards/widgets/RoleBannerWidget.tsx
"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Flame,
  Check,
  Briefcase,
  Users,
  Building2,
  GraduationCap,
  Target,
  Award,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Pen,
  Mail,
  Phone,
  Shield,
  Layers,
  Globe,
  Github,
  Linkedin
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { getStudentByEmail, updateStudent } from "@/services/student.services";
import DashboardDynamicModal, { DynamicField } from "@/components/dashboards/shared/DashboardDynamicModal";

interface BannerMetric {
  key: string;
  value: string | number;
  label: string;
  icon?: any;
  color?: string;
}

interface RoleBannerWidgetProps {
  role: "student" | "college" | "mentor" | "industry";
  customData?: {
    title?: string;
    subtitle?: string;
    metrics?: BannerMetric[];
    profileProgress?: number;
  };
}

const roleConfig = {
  student: {
    greeting: "Good Morning",
    roleName: "Student",
    icon: GraduationCap,
    gradient: "from-[#1e3a8a] to-[#0a1929]",
    accentColor: "orange",
    textColor: "text-blue-200",
    progressBg: "bg-blue-900/50",
    progressBorder: "border-blue-800/50",
    metrics: [
      { key: "employability", default: 73, label: "Employability", icon: TrendingUp },
      { key: "streak", default: 18, label: "Day Streak", icon: Flame },
      { key: "verified", default: 6, label: "Verified Skills", icon: Check }
    ],
    defaultTitle: "Student",
    defaultSubtitle: "B.Tech CSE • 3rd Year • VJTI Mumbai",
    defaultProgress: 78
  },
  college: {
    greeting: "Good Morning",
    roleName: "College Admin",
    icon: Building2,
    gradient: "from-[#0d4f30] to-[#10b981]", // A deep vibrant green gradient
    accentColor: "emerald",
    textColor: "text-emerald-100", // Soft text on the green gradient
    progressBg: "bg-emerald-900/50",
    progressBorder: "border-emerald-800/50",
    metrics: [
      { key: "students", default: "2,847", label: "Active Students", icon: Users },
      { key: "placements", default: "94%", label: "Placement Rate", icon: Briefcase }, // Updated default value based on new screenshot
      { key: "partners", default: "78%", label: "Avg Employability", icon: TrendingUp } // Updated generic metric based on new screenshot
    ],
    defaultTitle: "Veermata Jijabai Technological Institute",
    defaultSubtitle: "Mumbai University Affiliate • NAAC A++ • Estd. 1887",
    defaultProgress: 68
  },
  mentor: {
    greeting: "Good Morning",
    roleName: "Verified Mentor",
    icon: Users,
    gradient: "from-[#2e1065] to-[#4c1d95]", // Deep violet
    accentColor: "violet",
    textColor: "text-violet-200",
    progressBg: "bg-violet-900/50",
    progressBorder: "border-violet-800/50",
    metrics: [
      { key: "students", default: 247, label: "Total Students", icon: Users },
      { key: "sessions", default: 18, label: "Sessions Done", icon: Calendar },
      { key: "rating", default: "4.9", label: "Avg Rating", icon: Award }
    ],
    defaultTitle: "Kavya Reddy",
    defaultSubtitle: "Senior Data Scientist @ Amazon - ML, Python, Career Counselling",
    defaultProgress: 100
  },
  industry: {
    greeting: "Industry Portal",
    roleName: "Recruiter",
    icon: Building2,
    gradient: "from-[#1e1b4b] to-[#312e81]", // Deep purplish blue
    accentColor: "purple",
    textColor: "text-blue-200",
    progressBg: "bg-purple-900/50",
    progressBorder: "border-purple-800/50",
    metrics: [
      { key: "positions", default: 8, label: "Open Roles", icon: Briefcase },
      { key: "applications", default: 247, label: "Applications", icon: Users },
      { key: "match", default: "94%", label: "Match Quality", icon: Target }
    ],
    defaultTitle: "Razorpay Technologies",
    defaultSubtitle: "Fintech • Bengaluru • 2000+ employees • Industry Pro Plan",
    defaultProgress: 100
  }
};

export default function RoleBannerWidget({ role, customData }: RoleBannerWidgetProps) {
  const { fullName, currentUser } = useAuth();
  const config = roleConfig[role];

  // Student specific state
  const [studentData, setStudentData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchStudentData = async () => {
    if (role !== "student" || !currentUser) return;
    try {
      const response = await getStudentByEmail(currentUser);
      // Handle the nested structure: response.message.data
      const data = response?.data || response?.message?.data || response?.message;
      if (data && typeof data === 'object') {
        setStudentData(data);
      }
    } catch (error) {
      console.error("Error fetching student data in banner:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [role, currentUser]);

  const studentFields: DynamicField[] = useMemo(() => [
    { name: "first_name", label: "First Name", type: "text", icon: Users, required: true, disabled: true },
    { name: "last_name", label: "Last Name", type: "text", icon: Users, required: true, disabled: true },
    { name: "email_id", label: "Email ID", type: "email", icon: Mail, required: true, disabled: true, colSpan: 2 },
    { name: "mobile_no", label: "Mobile No", type: "text", icon: Phone, required: true },
    { name: "college", label: "College", type: "text", icon: Building2, required: true, disabled: true, colSpan: 2 },
    { name: "department", label: "Department", type: "text", icon: Shield, required: true },
    { name: "stream", label: "Stream", type: "text", icon: Layers, required: true },
    { name: "course", label: "Course", type: "text", icon: GraduationCap, required: true },
    { name: "semester", label: "Semester", type: "text", icon: Calendar, required: true },
    { name: "academic_year", label: "Academic Year", type: "text", icon: Target, required: true },
    { name: "date_of_birth", label: "Date of Birth", type: "date", icon: Calendar, required: true },
    { name: "gender", label: "Gender", type: "select", icon: Users, options: ["Male", "Female", "Other"], required: true, disabled: true },
    { name: "linkedin", label: "LinkedIn URL", type: "url", icon: Linkedin },
    { name: "github", label: "GitHub URL", type: "url", icon: Github },
  ], []);

  const handleUpdateProfile = async (formData: any) => {
    if (!currentUser) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await updateStudent(currentUser, formData);
      await fetchStudentData();
      setIsModalOpen(false);
    } catch (error: any) {
      setModalError(error?.message || "Failed to update profile");
    } finally {
      setModalLoading(false);
    }
  };

  // Compute initial values for the modal
  const computedInitialValues = useMemo(() => {
    if (!studentData && !fullName) return {};
    
    // Split fullName from local storage for first/last name
    const [firstName = "", ...lastNameParts] = (fullName || "").split(" ");
    const lastName = lastNameParts.join(" ");

    return {
      // API Data
      department: studentData?.department || "",
      stream: studentData?.stream || "",
      course: studentData?.course || "",
      semester: studentData?.semester || "",
      academic_year: studentData?.academic_year || "",
      date_of_birth: studentData?.date_of_birth || "",
      mobile_no: studentData?.mobile_no || "",
      college: studentData?.college || "",
      linkedin: studentData?.linkedin || "",
      github: studentData?.github || "",
      gender: studentData?.gender || "",
      
      // Local Storage priority
      first_name: firstName || studentData?.first_name || "",
      last_name: lastName || studentData?.last_name || "",
      email_id: currentUser || studentData?.email_id || "",
    };
  }, [studentData, fullName, currentUser]);

  // Get title from customData or fullName or default
  const title = customData?.title || fullName || config.defaultTitle;

  // Get subtitle from customData or default
  const subtitle = customData?.subtitle || 
    (role === "student" && studentData ? (
      <div className="space-y-0.5">
        <p className="font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-300" />
          {studentData.college || "College Not Specified"}
        </p>
        <p className={`text-xs ${config.textColor} opacity-80`}>
          {studentData.course} • {studentData.department || ""} • Stream {studentData.stream || "N/A"}
        </p>
      </div>
    ) : config.defaultSubtitle);

  // Get progress value
  const progressValue = customData?.profileProgress ?? config.defaultProgress;

  // Get initials
  const getInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (currentUser) {
      return currentUser[0].toUpperCase();
    }
    return role === "college" ? "VJ" : role === "student" ? "AP" : "U";
  };

  // Get accent color classes
  const getIconColor = () => {
    switch (config.accentColor) {
      case "violet": return "text-violet-400";
      case "orange": return "text-orange-400";
      case "emerald": return "text-emerald-400";
      case "purple": return "text-purple-400";
      case "blue": return "text-blue-400";
      default: return "text-orange-400";
    }
  };

  const getProgressGradient = () => {
    switch (config.accentColor) {
      case "violet": return "from-violet-400 to-violet-500";
      case "orange": return "from-orange-400 to-orange-500";
      case "emerald": return "from-emerald-400 to-emerald-500";
      case "purple": return "from-purple-400 to-purple-500";
      case "blue": return "from-blue-400 to-blue-500";
      default: return "from-orange-400 to-orange-500";
    }
  };

  const getMetricBg = () => {
    switch (config.accentColor) {
      case "violet": return "bg-violet-600/40 border-violet-500/30";
      case "orange": return "bg-blue-600/40 border-blue-500/30";
      case "emerald": return "bg-emerald-600/40 border-emerald-500/30";
      case "purple": return "bg-purple-600/40 border-purple-500/30";
      case "blue": return "bg-blue-600/40 border-blue-500/30";
      default: return "bg-blue-600/40 border-blue-500/30";
    }
  };

  // Get metrics from customData or use defaults
  const metrics = customData?.metrics || (
    role === "student" && studentData ? [
      { key: "employability", value: 73, label: "Employability", icon: TrendingUp },
      { key: "cgpa", value: studentData.cgpa || 0, label: "Current CGPA", icon: Award },
      { key: "semester", value: studentData.semester || "N/A", label: "Semester", icon: Calendar }
    ] : config.metrics.map(m => ({
      key: m.key,
      value: m.default,
      label: m.label,
      icon: m.icon
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-6 md:p-8 text-white relative overflow-hidden`}
    >
      {/* Background shapes for aesthetics */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getProgressGradient()} flex items-center justify-center shadow-lg border-2 border-white/20`}>
            <span className="text-2xl font-bold text-white">{getInitials()}</span>
          </div>
          <div>
            <p className={`text-sm ${config.textColor} font-medium uppercase tracking-wider mb-1 flex items-center gap-1`}>
              {config.greeting} {role !== "industry" && <span>👋</span>}
              <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                {config.roleName}
              </span>
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-3">
              {title}
              {role === "student" && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group/edit"
                >
                  <Pen className="w-4 h-4 text-white/50 group-hover/edit:text-white transition-colors" />
                </button>
              )}
            </h2>
            <div className={`text-sm ${config.textColor}`}>
              {subtitle}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.key}
              className={`${getMetricBg()} backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center min-w-[100px] cursor-pointer hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-2xl font-bold text-white">
                  {metric.value}
                </span>
                {metric.icon && (
                  <metric.icon className={`w-5 h-5 ${getIconColor()}`} />
                )}
              </div>
              <span className={`text-[10px] ${config.textColor} uppercase tracking-wide`}>
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar - Only for student and college */}
      {(role === "student" || role === "college") && (
        <div className="relative z-10 mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs ${config.textColor} font-medium`}>
              {role === "student" ? "Profile Completeness" : "Placement Target Progress"}
            </span>
            <span className="text-xs font-bold text-white">
              {progressValue}%
            </span>
          </div>
          <div className={`h-2 ${config.progressBg} rounded-full overflow-hidden backdrop-blur-sm border ${config.progressBorder}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${getProgressGradient()} relative`}
            >
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 blur-sm translate-x-4 mix-blend-overlay"></div>
            </motion.div>
          </div>
        </div>
      )}

      {role === "student" && (
        <DashboardDynamicModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Update Profile"
          subtitle="Keep your academic details up to date"
          headerIcon={Pen}
          iconBgColor="bg-orange-500"
          fields={studentFields}
          initialValues={computedInitialValues}
          onSubmit={handleUpdateProfile}
          loading={modalLoading}
          error={modalError}
        />
      )}
    </motion.div>
  );
}