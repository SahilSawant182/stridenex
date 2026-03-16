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
  AlertTriangle
} from "lucide-react";

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
    roleName: "Mentor",
    icon: Users,
    gradient: "from-purple-800 to-purple-900",
    accentColor: "purple",
    textColor: "text-purple-200",
    progressBg: "bg-purple-900/50",
    progressBorder: "border-purple-800/50",
    metrics: [
      { key: "mentees", default: 12, label: "Active Mentees", icon: Users },
      { key: "sessions", default: 48, label: "Sessions Done", icon: Calendar },
      { key: "rating", default: "4.8", label: "Avg Rating", icon: Award }
    ],
    defaultTitle: "Dr. Kavya Reddy",
    defaultSubtitle: "Senior Mentor • Computer Science Department",
    defaultProgress: 92
  },
  industry: {
    greeting: "Good Morning",
    roleName: "Industry Partner",
    icon: Briefcase,
    gradient: "from-blue-800 to-blue-900",
    accentColor: "blue",
    textColor: "text-blue-200",
    progressBg: "bg-blue-900/50",
    progressBorder: "border-blue-800/50",
    metrics: [
      { key: "positions", default: 8, label: "Open Positions", icon: Briefcase },
      { key: "applications", default: 124, label: "Applications", icon: Users },
      { key: "shortlisted", default: 24, label: "Shortlisted", icon: Target }
    ],
    defaultTitle: "Rahul Mehta",
    defaultSubtitle: "Talent Acquisition • Tech Corp",
    defaultProgress: 70
  }
};

export default function RoleBannerWidget({ role, customData }: RoleBannerWidgetProps) {
  const { fullName, currentUser } = useAuth();
  const config = roleConfig[role];

  // Get title from customData or fullName or default
  const title = customData?.title ||
    (role === "college" ? config.defaultTitle : fullName || config.defaultTitle);

  // Get subtitle from customData or default
  const subtitle = customData?.subtitle || config.defaultSubtitle;

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
      case "orange": return "text-orange-400";
      case "emerald": return "text-emerald-400";
      case "purple": return "text-purple-400";
      case "blue": return "text-blue-400";
      default: return "text-orange-400";
    }
  };

  const getProgressGradient = () => {
    switch (config.accentColor) {
      case "orange": return "from-orange-400 to-orange-500";
      case "emerald": return "from-emerald-400 to-emerald-500";
      case "purple": return "from-purple-400 to-purple-500";
      case "blue": return "from-blue-400 to-blue-500";
      default: return "from-orange-400 to-orange-500";
    }
  };

  const getMetricBg = () => {
    switch (config.accentColor) {
      case "orange": return "bg-blue-600/40 border-blue-500/30";
      case "emerald": return "bg-emerald-600/40 border-emerald-500/30";
      case "purple": return "bg-purple-600/40 border-purple-500/30";
      case "blue": return "bg-blue-600/40 border-blue-500/30";
      default: return "bg-blue-600/40 border-blue-500/30";
    }
  };

  // Get metrics from customData or use defaults
  const metrics = customData?.metrics || config.metrics.map(m => ({
    key: m.key,
    value: m.default,
    label: m.label,
    icon: m.icon
  }));

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
              {config.greeting} <span>👋</span>
              <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                {config.roleName}
              </span>
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {title}
            </h2>
            <p className={`text-sm ${config.textColor}`}>
              {subtitle}
            </p>
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
    </motion.div>
  );
}