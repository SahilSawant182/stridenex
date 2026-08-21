// config/dashboardNavigation.ts
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Settings,
  HelpCircle,
  Users,
  BarChart,
  Target,
  Calendar,
  Code,
  Video,
  CheckSquare,
  UserCircle,
  BookOpen,
  TrendingUp,
  Building2,
  MessageSquare,
  Mail,
  UserCheck,
  FolderGit2,
  Award,
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
    { name: "Skill Ledger", href: "/student/dashboard/skills", icon: Code },
    { name: "Skill Path", href: "/student/dashboard/path", icon: Target },
    { name: "Habits", href: "/student/dashboard/habits", icon: CheckSquare },
    { name: "Projects", href: "/student/dashboard/projects", icon: FolderGit2 },
    { name: "Internships", href: "/student/dashboard/internships", icon: Briefcase },
    { name: "Jobs", href: "/student/dashboard/jobs", icon: Award },
    { name: "Campus Drives", href: "/student/dashboard/campus-drives", icon: Building2 },
    { name: "Mentors", href: "/student/dashboard/mentors", icon: UserCircle },
    { name: "Shorts", href: "/student/dashboard/shorts", icon: Video },
    { name: "Community", href: "/student/dashboard/community", icon: Users },
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
    { name: "Community", href: "/college/dashboard/community", icon: Users },
    { name: "Notice Board", href: "/college/dashboard/notice-board", icon: BarChart },
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
    { name: "Community", href: "/mentor/dashboard/community", icon: Users },
    { name: "Requests", href: "/mentor/dashboard/requests", icon: HelpCircle },
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
    { name: "Application Pipeline", href: "/industry/dashboard/pipeline", icon: Mail },
    { name: "Projects & R&D", href: "/industry/dashboard/projects", icon: FolderGit2 },
    { name: "Internship Posts", href: "/industry/dashboard/internships", icon: UserCheck },
    { name: "Job Profiles", href: "/industry/dashboard/jobs", icon: Briefcase },
    { name: "Community", href: "/industry/dashboard/community", icon: Users },
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