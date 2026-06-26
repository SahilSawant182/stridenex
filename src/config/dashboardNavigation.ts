// config/dashboardNavigation.ts
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Settings,
  HelpCircle,
  FileText,
  Users,
  BarChart,
  Target,
  Calendar,
  Code,
  Video,
  CheckSquare,
  UserCircle,
  BookOpen,
  Compass,
  TrendingUp,
  Award,
  Building2,
  School,
  MessageSquare,
  Mail,
  UserCheck,
  Star,
  FolderGit2,
  type LucideIcon
} from "lucide-react";

export type DashboardRole = "student" | "college" | "mentor" | "industry";

export interface DashboardNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface RoleConfig {
  roleName: string;
  baseRoute: string; // e.g., "student/dashboard" (shows overview)
  badgeStyle: string;
  links: DashboardNavItem[];
  bottomLinks: DashboardNavItem[];
  searchPlaceholder: string;
}

// Student Configuration
export const studentConfig: RoleConfig = {
  roleName: "Student",
  baseRoute: "/student/dashboard",
  badgeStyle: "bg-orange-100 text-orange-600",
  searchPlaceholder: "Search resources, skills, internships...",
  links: [
    { name: "Overview", href: "/student/dashboard", icon: LayoutDashboard }, // Base route
    { name: "Skills", href: "/student/dashboard/skills", icon: Code },
    { name: "Path", href: "/student/dashboard/path", icon: Target },
    { name: "Shorts", href: "/student/dashboard/shorts", icon: Video },
    { name: "Community", href: "/student/dashboard/community", icon: Users },
    { name: "Projects", href: "/student/dashboard/projects", icon: FolderGit2 },
    { name: "Internships", href: "/student/dashboard/internships", icon: Briefcase },
    { name: "Habits", href: "/student/dashboard/habits", icon: CheckSquare },
    { name: "Mentors", href: "/student/dashboard/mentors", icon: UserCircle },
    { name: "Events", href: "/student/dashboard/events", icon: Calendar },
    { name: "Stories", href: "/student/dashboard/stories", icon: BookOpen },
  ],
  bottomLinks: [
    { name: "Settings", href: "/student/settings", icon: Settings },
    { name: "Support", href: "/support", icon: HelpCircle },
  ],
};

// College Configuration
export const collegeConfig: RoleConfig = {
  roleName: "College",
  baseRoute: "/college/dashboard",
  badgeStyle: "bg-blue-100 text-blue-600",
  searchPlaceholder: "Search students, placements, companies...",
  links: [
    { name: "Overview", href: "/college/dashboard", icon: LayoutDashboard },
    { name: "Student Analytics", href: "/college/dashboard/students", icon: GraduationCap },
    { name: "Campus Drives", href: "/college/dashboard/campus-drives", icon: Briefcase },
    // { name: "NEP & UGC 2026", href: "/college/dashboard/nepUgc", icon: Users },
    { name: "Interventions", href: "/college/dashboard/interventions", icon: Building2 },
    { name: "Notice Board", href: "/college/dashboard/noticeBoard", icon: BarChart },
    // { name: "Reports", href: "/college/dashboard/reports", icon: Calendar },
  ],
  bottomLinks: [
    { name: "Settings", href: "/college/settings", icon: Settings },
    { name: "Support", href: "/support", icon: HelpCircle },
  ],
};

// Mentor Configuration
export const mentorConfig: RoleConfig = {
  roleName: "Mentor",
  baseRoute: "/mentor/dashboard",
  badgeStyle: "bg-emerald-100 text-emerald-600",
  searchPlaceholder: "Search mentees, sessions, resources...",
  links: [
    { name: "Overview", href: "/mentor/dashboard", icon: LayoutDashboard },
    { name: "Schedule", href: "/mentor/dashboard/schedule", icon: Calendar },
    { name: "Offerings", href: "/mentor/dashboard/offerings", icon: Video },
    { name: "Requests", href: "/mentor/dashboard/requests", icon: Calendar },
    { name: "Session History", href: "/mentor/dashboard/session-history", icon: BookOpen },
    { name: "Payouts & Commission", href: "/mentor/dashboard/payouts", icon: MessageSquare },
    { name: "My Profile", href: "/mentor/dashboard/profile", icon: TrendingUp },
  ],
  bottomLinks: [
    { name: "Settings", href: "/mentor/settings", icon: Settings },
    { name: "Support", href: "/support", icon: HelpCircle },
  ],
};

// Industry Configuration
export const industryConfig: RoleConfig = {
  roleName: "Industry",
  baseRoute: "/industry/dashboard",
  badgeStyle: "bg-purple-100 text-purple-600",
  searchPlaceholder: "Search candidates, applications, partners...",
  links: [
    { name: "Overview", href: "/industry/dashboard", icon: LayoutDashboard },
    { name: "Company Profile", href: "/industry/dashboard/company-profile", icon: Building2 },
    { name: "Find Talent", href: "/industry/dashboard/find-talent", icon: Briefcase },
    { name: "Internships Pipeline", href: "/industry/dashboard/pipeline", icon: Mail },
    { name: "Projects & R&D", href: "/industry/dashboard/projects", icon: FolderGit2 },
    { name: "Internship Posts", href: "/industry/dashboard/internships", icon: UserCheck },
    // { name: "Student Feedback", href: "/industry/dashboard/feedback", icon: Star },
    // { name: "Analytics", href: "/industry/dashboard/analytics", icon: Calendar },
    { name: "Settings", href: "/industry/dashboard/settings", icon: Settings },
  ],
  bottomLinks: [
    { name: "Settings", href: "/industry/settings", icon: Settings },
    { name: "Support", href: "/support", icon: HelpCircle },
  ],
};

// Export all configs
export const dashboardConfig: Record<DashboardRole, RoleConfig> = {
  student: studentConfig,
  college: collegeConfig,
  mentor: mentorConfig,
  industry: industryConfig,
};