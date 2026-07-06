// app/dashboards/college/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  BarChart3,
  GraduationCap,
  Building2,
  Target,
  Clock,
  Database,
  Code,
  MessageSquare,
  Award,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import StatsWidget from "@/components/dashboards/widgets/StatsWidget";
import ProgressCard from "@/components/dashboards/shared/ProgressCard";
import ListCard from "@/components/dashboards/shared/ListCard";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";
import { useAuth } from "@/context/AuthContext";
import {
  getCollegeDetails,
  getPlacementStats,
  getBranchWisePerformance,
  getDriveCount,
  getCollegeDrives,
  getDashboardSummary,
  getEmployabilityDistribution,
  getOnboardingGrowth,
  getTopSkillGaps
} from "@/services/college.services";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

// College Dashboard Data - Neutral colors with minimal green accents
const collegeStats = [
  {
    id: 1,
    title: "ACTIVE STUDENTS",
    value: "2,847",
    change: 0,
    changeLabel: "this sem",
    icon: Users,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    trend: "up"
  },
  {
    id: 2,
    title: "AVG EMPLOYABILITY",
    value: "78",
    max: 100,
    change: 0,
    changeLabel: "vs last sem",
    icon: TrendingUp,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    trend: "up"
  },
  {
    id: 3,
    title: "AT-RISK STUDENTS",
    value: "143",
    change: 0,
    changeLabel: "need action",
    icon: AlertTriangle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    trend: "down"
  },
  {
    id: 4,
    title: "INDUSTRY PARTNERS",
    value: "38",
    change: 0,
    changeLabel: "this month",
    icon: Building2,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    trend: "up"
  }
];

// Employability data with neutral colors
const employabilityData = [
  {
    label: "Excellent (85–100)",
    value: 620,
    percentage: 22,
    color: "slate",
    subtitle: "0 (0%)",
    bgColor: "bg-slate-100",
    progressColor: "bg-slate-500"
  },
  {
    label: "Good (70–84)",
    value: 1140,
    percentage: 40,
    color: "slate",
    subtitle: "0 (0%)",
    bgColor: "bg-slate-100",
    progressColor: "bg-slate-500"
  },
  {
    label: "Average (55–69)",
    value: 740,
    percentage: 26,
    color: "slate",
    subtitle: "0 (0%)",
    bgColor: "bg-slate-100",
    progressColor: "bg-slate-500"
  },
  {
    label: "At-Risk (<55)",
    value: 347,
    percentage: 12,
    color: "amber",
    subtitle: "0 (0%)",
    bgColor: "bg-amber-50",
    progressColor: "bg-amber-500"
  }
];

// Branch data with neutral colors
const branchData = [
  { label: "Computer Science", value: 420, percentage: 87, subtitle: "420 students", progressColor: "bg-slate-500" },
  { label: "Electronics", value: 380, percentage: 74, subtitle: "380 students", progressColor: "bg-slate-500" },
  { label: "Mechanical", value: 340, percentage: 62, subtitle: "340 students", progressColor: "bg-slate-500" },
  { label: "Civil", value: 290, percentage: 58, subtitle: "290 students", progressColor: "bg-amber-500", textColor: "text-amber-600" },
  { label: "MBA", value: 180, percentage: 79, subtitle: "180 students", progressColor: "bg-slate-500" },
  { label: "Chemical", value: 240, percentage: 65, subtitle: "240 students", progressColor: "bg-slate-500" }
];


// Action items with appropriate colors
const actionItems = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "red",
    title: "47 students with score <50",
    subtitle: "Graduation risk — immediate intervention"
  },
  {
    id: 2,
    icon: Target,
    iconColor: "amber",
    title: "NEP Internship: 68% (target 80%)",
    subtitle: "342 students need placement by April"
  },
  {
    id: 3,
    icon: Briefcase,
    iconColor: "slate",
    title: "38 new internships posted this week",
    subtitle: "TCS, Infosys, Razorpay, Zepto"
  },
  {
    id: 4,
    icon: Clock,
    iconColor: "red",
    title: "UGC Grievance Response Due",
    subtitle: "2 cases require 24hr committee meeting"
  }
];

const monthlyData = [
  { month: "Apr", value: 45 },
  { month: "May", value: 52 },
  { month: "Jun", value: 58 },
  { month: "Jul", value: 65 },
  { month: "Aug", value: 70 },
  { month: "Sep", value: 68 },
  { month: "Oct", value: 72 },
  { month: "Nov", value: 78 },
  { month: "Dec", value: 82 },
  { month: "Jan", value: 85 },
  { month: "Feb", value: 88 },
  { month: "Mar", value: 92 }
];

interface SkillGapItem {
  id: number;
  name: string;
  percentage: number;
  icon: React.ComponentType<any>;
  color: string;
  badge: string;
}

export default function CollegeDashboardPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [collegeDetails, setCollegeDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placementStats, setPlacementStats] = useState<any>(null);
  const [branchPerformance, setBranchPerformance] = useState<any[] | null>(null);
  const [driveCounts, setDriveCounts] = useState<any>(null);
  const [upcomingDrivesList, setUpcomingDrivesList] = useState<any[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [employabilityDistribution, setEmployabilityDistribution] = useState<any>(null);
  const [onboardingGrowth, setOnboardingGrowth] = useState<any>(null);
  const [topSkillGaps, setTopSkillGaps] = useState<any>(null);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  // Load college details from localStorage or API
  useEffect(() => {
    const loadDetails = async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem("collegeDetails") : null;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCollegeDetails(parsed);
          return;
        } catch (_) { }
      }

      if (currentUser) {
        try {
          const res = await getCollegeDetails(currentUser);
          const data = res?.data || res?.message?.data || res?.message;
          if (data) {
            setCollegeDetails(data);
            if (typeof window !== 'undefined') {
              localStorage.setItem("collegeDetails", JSON.stringify(data));
            }
          }
        } catch (err) {
          console.error("Failed to load college details in Overview:", err);
        }
      }
    };

    if (currentUser) {
      loadDetails();
    }
  }, [currentUser]);

  // Listen for details-fetched event from banner to keep it sync'd
  useEffect(() => {
    const handleDetailsFetched = () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem("collegeDetails") : null;
      if (stored) {
        try {
          setCollegeDetails(JSON.parse(stored));
        } catch (_) { }
      }
    };
    window.addEventListener("college-details-fetched", handleDetailsFetched);
    return () => window.removeEventListener("college-details-fetched", handleDetailsFetched);
  }, []);

  // Fetch placement metrics, branch performance, and drive details
  useEffect(() => {
    const fetchOverviewData = async () => {
      const collegeName = collegeDetails?.name || collegeDetails?.email || currentUser;
      const collegeEmail = collegeDetails?.email || currentUser;
      if (!collegeName) return;

      try {
        setLoading(true);
        setApiErrors({});

        const [statsRes, branchRes, driveCountRes, drivesRes, summaryRes, distributionRes, growthRes, skillGapsRes] = await Promise.allSettled([
          getPlacementStats(collegeName),
          getBranchWisePerformance(collegeName),
          getDriveCount(collegeName),
          getCollegeDrives(collegeName),
          getDashboardSummary(collegeEmail),
          getEmployabilityDistribution(collegeEmail),
          getOnboardingGrowth(collegeEmail),
          getTopSkillGaps(collegeEmail)
        ]);

        const errors: Record<string, string> = {};

        if (statsRes.status === "fulfilled") {
          const raw = statsRes.value?.message ?? statsRes.value;
          if (raw && raw.data) {
            setPlacementStats(raw.data);
          }
        } else {
          errors.placementStats = "Failed to load placement stats";
        }

        if (branchRes.status === "fulfilled") {
          const raw = branchRes.value?.message ?? branchRes.value;
          if (raw && raw.data) {
            setBranchPerformance(raw.data);
          } else {
            setBranchPerformance([]);
          }
        } else {
          setBranchPerformance([]);
          errors.branchPerformance = "Failed to load branch performance";
        }

        if (driveCountRes.status === "fulfilled") {
          const raw = driveCountRes.value?.message ?? driveCountRes.value;
          if (raw && raw.data) {
            setDriveCounts(raw.data);
          }
        } else {
          errors.driveCounts = "Failed to load drive counts";
        }

        if (drivesRes.status === "fulfilled") {
          const raw = drivesRes.value?.data ?? drivesRes.value?.message?.data ?? drivesRes.value?.message ?? drivesRes.value;
          let drivesArray: any[] = [];
          if (raw && typeof raw === 'object') {
            drivesArray = Array.isArray(raw.campus_drives)
              ? raw.campus_drives
              : (Array.isArray(raw) ? raw : []);
          }
          setUpcomingDrivesList(drivesArray);
        } else {
          errors.upcomingDrives = "Failed to load upcoming drives list";
        }

        if (summaryRes.status === "fulfilled") {
          const raw = summaryRes.value?.message ?? summaryRes.value;
          if (raw && raw.data) {
            setDashboardSummary(raw.data);
          }
        } else {
          errors.dashboardSummary = "Failed to load dashboard summary";
        }

        if (distributionRes.status === "fulfilled") {
          const raw = distributionRes.value?.message ?? distributionRes.value;
          if (raw && raw.data) {
            setEmployabilityDistribution(raw.data);
          }
        } else {
          errors.employabilityDistribution = "Failed to load employability distribution";
        }

        if (growthRes.status === "fulfilled") {
          const raw = growthRes.value?.message ?? growthRes.value;
          if (raw && raw.data) {
            setOnboardingGrowth(raw.data);
          }
        } else {
          errors.onboardingGrowth = "Failed to load onboarding growth";
        }

        if (skillGapsRes.status === "fulfilled") {
          const raw = skillGapsRes.value?.message ?? skillGapsRes.value;
          if (raw && raw.data) {
            setTopSkillGaps(raw.data);
          }
        } else {
          errors.topSkillGaps = "Failed to load skill gaps data";
        }

        if (Object.keys(errors).length > 0) {
          setApiErrors(errors);
        }
      } catch (err) {
        console.error("Failed to load overview analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    if (collegeDetails) {
      fetchOverviewData();
    }
  }, [collegeDetails, currentUser]);

  // Format branch data for progress bars
  const displayBranchData = useMemo(() => {
    if (branchPerformance === null) {
      return null;
    }
    return branchPerformance.map((b: any) => {
      const branchName = b.department || "—";
      const placed = b.placed_students ?? 0;
      const total = b.total_students ?? 0;
      const rateNum = b.placement_rate !== undefined ? Number(b.placement_rate) : 0;
      return {
        label: branchName,
        percentage: rateNum,
        placedTotalText: `(${placed}/${total})`
      };
    });
  }, [branchPerformance]);

  // Format employability distribution dynamically
  const displayEmployabilityData = useMemo(() => {
    if (!employabilityDistribution) {
      return employabilityData;
    }
    const data = employabilityDistribution;
    return [
      {
        label: "Excellent (85–100)",
        value: data.excellent?.count ?? 0,
        percentage: data.excellent?.percent !== undefined ? Math.round(Number(data.excellent.percent)) : 0,
        color: "slate",
        subtitle: `${data.excellent?.count ?? 0} (${Math.round(Number(data.excellent?.percent ?? 0))}%)`,
        bgColor: "bg-slate-100",
        progressColor: "bg-slate-500"
      },
      {
        label: "Good (70–84)",
        value: data.good?.count ?? 0,
        percentage: data.good?.percent !== undefined ? Math.round(Number(data.good.percent)) : 0,
        color: "slate",
        subtitle: `${data.good?.count ?? 0} (${Math.round(Number(data.good?.percent ?? 0))}%)`,
        bgColor: "bg-slate-100",
        progressColor: "bg-slate-500"
      },
      {
        label: "Average (55–69)",
        value: data.average?.count ?? 0,
        percentage: data.average?.percent !== undefined ? Math.round(Number(data.average.percent)) : 0,
        color: "slate",
        subtitle: `${data.average?.count ?? 0} (${Math.round(Number(data.average?.percent ?? 0))}%)`,
        bgColor: "bg-slate-100",
        progressColor: "bg-slate-500"
      },
      {
        label: "At-Risk (<55)",
        value: data.at_risk?.count ?? 0,
        percentage: data.at_risk?.percent !== undefined ? Math.round(Number(data.at_risk.percent)) : 0,
        color: "amber",
        subtitle: `${data.at_risk?.count ?? 0} (${Math.round(Number(data.at_risk?.percent ?? 0))}%)`,
        bgColor: "bg-amber-50",
        progressColor: "bg-amber-500"
      }
    ];
  }, [employabilityDistribution]);

  // Format onboarding growth dynamically
  const displayMonthlyData = useMemo(() => {
    if (!onboardingGrowth || !onboardingGrowth.monthly || onboardingGrowth.monthly.length === 0) {
      return [];
    }
    return onboardingGrowth.monthly.map((m: any) => ({
      month: m.month || m.label || "",
      value: m.value !== undefined ? Number(m.value) : (m.count !== undefined ? Number(m.count) : 0)
    }));
  }, [onboardingGrowth]);

  // Compute next drive details
  const nextDriveInfo = useMemo(() => {
    if (!upcomingDrivesList || upcomingDrivesList.length === 0) return "Next: TCS - Mar 15";

    const futureDrives = upcomingDrivesList
      .map((d: any) => {
        const company = d.industry || d.industry_name || (d.name && d.name.includes("-") ? d.name.split("-")[0] : d.name) || "";
        const dateStr = d.drive_date ? d.drive_date.split(" ")[0] : "";
        const parsedDate = dateStr ? new Date(dateStr) : null;
        return { company, dateStr, parsedDate };
      })
      .filter((d: any) => d.parsedDate && d.parsedDate >= new Date())
      .sort((a: any, b: any) => (a.parsedDate?.getTime() || 0) - (b.parsedDate?.getTime() || 0));

    if (futureDrives.length > 0) {
      const next = futureDrives[0];
      let formattedDate = next.dateStr;
      try {
        if (next.parsedDate) {
          formattedDate = next.parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      } catch (_) { }
      return `Next: ${next.company} - ${formattedDate}`;
    }

    return "No upcoming drives scheduled";
  }, [upcomingDrivesList]);

  // Format top skill gaps dynamically
  const displaySkillGaps = useMemo<SkillGapItem[]>(() => {
    if (!topSkillGaps || !topSkillGaps.skill_gaps || topSkillGaps.skill_gaps.length === 0) {
      return [];
    }
    return topSkillGaps.skill_gaps.map((item: any, idx: number): SkillGapItem => {
      const name = item.skill_name || item.skill || item.name || "Unknown Skill";
      const percentage = item.percentage !== undefined ? Number(item.percentage) : (item.gap_percentage !== undefined ? Number(item.gap_percentage) : (item.percent !== undefined ? Number(item.percent) : 0));

      // Map icon dynamically based on name
      let icon = Code;
      const lowerName = name.toLowerCase();
      if (lowerName.includes("data") || lowerName.includes("sql") || lowerName.includes("db")) {
        icon = Database;
      } else if (lowerName.includes("communication") || lowerName.includes("soft") || lowerName.includes("english")) {
        icon = MessageSquare;
      } else if (lowerName.includes("project") || lowerName.includes("management") || lowerName.includes("lead")) {
        icon = Target;
      }

      const color = percentage >= 50 ? "slate" : "amber";
      return {
        id: idx + 1,
        name,
        percentage,
        icon,
        color,
        badge: `${percentage}% lack this`
      };
    });
  }, [topSkillGaps]);

  // Compute the critical skill gap
  const criticalSkillGap = useMemo(() => {
    if (displaySkillGaps.length === 0) return null;
    const sorted = [...displaySkillGaps].sort((a, b) => b.percentage - a.percentage);
    return sorted[0];
  }, [displaySkillGaps]);
  // Dynamically constructed stats widgets using API dashboardSummary
  const dynamicStats = useMemo(() => {
    const formatApiValue = (val: any) => {
      if (val === undefined || val === null) {
        return "0";
      }
      return String(val);
    };

    return [
      {
        id: 1,
        title: "ACTIVE STUDENTS",
        value: dashboardSummary !== null && dashboardSummary !== undefined ? formatApiValue(dashboardSummary.active_students) : "0",
        change: 0,
        changeLabel: "this sem",
        icon: Users,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        trend: "up"
      },
      {
        id: 2,
        title: "AVG EMPLOYABILITY",
        value: dashboardSummary !== null && dashboardSummary !== undefined ? formatApiValue(dashboardSummary.avg_employability) : "0",
        max: 100,
        change: 0,
        changeLabel: "vs last sem",
        icon: TrendingUp,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        trend: "up"
      },
      {
        id: 3,
        title: "AT-RISK STUDENTS",
        value: dashboardSummary !== null && dashboardSummary !== undefined ? formatApiValue(dashboardSummary.at_risk_students) : "0",
        change: 0,
        changeLabel: "need action",
        icon: AlertTriangle,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        trend: "down"
      },
      {
        id: 4,
        title: "NEW THIS SEMESTER",
        value: dashboardSummary !== null && dashboardSummary !== undefined ? formatApiValue(dashboardSummary.new_this_semester) : "0",
        change: 0,
        changeLabel: "this month",
        icon: GraduationCap,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        trend: "up"
      }
    ];
  }, [dashboardSummary]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {Object.keys(apiErrors).length > 0 && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold flex items-center justify-between border border-red-200">
          <span>Some dashboard panels failed to load live metrics. Displaying fallbacks.</span>
          <button onClick={() => {
            const loadDetails = async () => {
              const collegeName = collegeDetails?.name || collegeDetails?.email || currentUser;
              const collegeEmail = collegeDetails?.email || currentUser;
              if (collegeName) {
                try {
                  setLoading(true);
                  setApiErrors({});
                  const [statsRes, branchRes, driveCountRes, drivesRes, summaryRes, distributionRes, growthRes, skillGapsRes] = await Promise.allSettled([
                    getPlacementStats(collegeName),
                    getBranchWisePerformance(collegeName),
                    getDriveCount(collegeName),
                    getCollegeDrives(collegeName),
                    getDashboardSummary(collegeEmail),
                    getEmployabilityDistribution(collegeEmail),
                    getOnboardingGrowth(collegeEmail),
                    getTopSkillGaps(collegeEmail)
                  ]);

                  const errors: Record<string, string> = {};

                  if (statsRes.status === "fulfilled") {
                    const raw = statsRes.value?.message ?? statsRes.value;
                    if (raw && raw.data) setPlacementStats(raw.data);
                  } else errors.placementStats = "Failed to load stats";

                  if (branchRes.status === "fulfilled") {
                    const raw = branchRes.value?.message ?? branchRes.value;
                    if (raw && raw.data) {
                      setBranchPerformance(raw.data);
                    } else {
                      setBranchPerformance([]);
                    }
                  } else {
                    setBranchPerformance([]);
                    errors.branchPerformance = "Failed to load branch";
                  }

                  if (driveCountRes.status === "fulfilled") {
                    const raw = driveCountRes.value?.message ?? driveCountRes.value;
                    if (raw && raw.data) setDriveCounts(raw.data);
                  } else errors.driveCounts = "Failed to load drive count";

                  if (drivesRes.status === "fulfilled") {
                    const raw = drivesRes.value?.data ?? drivesRes.value?.message?.data ?? drivesRes.value?.message ?? drivesRes.value;
                    let drivesArray: any[] = [];
                    if (raw && typeof raw === 'object') {
                      drivesArray = Array.isArray(raw.campus_drives) ? raw.campus_drives : (Array.isArray(raw) ? raw : []);
                    }
                    setUpcomingDrivesList(drivesArray);
                  } else errors.upcomingDrives = "Failed to load drives";

                  if (summaryRes.status === "fulfilled") {
                    const raw = summaryRes.value?.message ?? summaryRes.value;
                    if (raw && raw.data) setDashboardSummary(raw.data);
                  } else errors.dashboardSummary = "Failed to load summary";

                  if (distributionRes.status === "fulfilled") {
                    const raw = distributionRes.value?.message ?? distributionRes.value;
                    if (raw && raw.data) setEmployabilityDistribution(raw.data);
                  } else errors.employabilityDistribution = "Failed to load distribution";

                  if (growthRes.status === "fulfilled") {
                    const raw = growthRes.value?.message ?? growthRes.value;
                    if (raw && raw.data) setOnboardingGrowth(raw.data);
                  } else errors.onboardingGrowth = "Failed to load onboarding";

                  if (skillGapsRes.status === "fulfilled") {
                    const raw = skillGapsRes.value?.message ?? skillGapsRes.value;
                    if (raw && raw.data) setTopSkillGaps(raw.data);
                  } else errors.topSkillGaps = "Failed to load gaps";

                  if (Object.keys(errors).length > 0) setApiErrors(errors);
                } catch (e) {
                  console.error(e);
                } finally {
                  setLoading(false);
                }
              }
            };
            loadDetails();
          }} className="underline hover:no-underline font-bold">Retry</button>
        </div>
      )}

      {/* Stats Grid - Neutral slate backgrounds */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStats.map((stat) => (
          <StatsWidget
            key={stat.id}
            title={stat.title}
            data={{
              value: stat.value,
              max: stat.max,
              change: stat.change,
              changeLabel: stat.changeLabel,
              icon: stat.icon,
              iconBg: stat.iconBg,
              iconColor: stat.iconColor,
              trend: stat.trend
            }}
          />
        ))}
      </motion.div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Employability Distribution */}
        <motion.div variants={item}>
          <ProgressCard
            title="Employability Distribution"
            items={displayEmployabilityData}
            variant="detailed"
            className="h-full border-slate-200"
          />
        </motion.div>

        {/* Middle Column - Branch Performance */}
        <motion.div variants={item}>
          <BaseCard className="border-slate-200 p-5 h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Branch-wise Performance"
                action={{
                  label: "View All",
                  onClick: () => router.push("/college/dashboard/campus-drives?subtab=stats")
                }}
              />

              <div className="space-y-3.5 mt-4">
                {displayBranchData === null ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  </div>
                ) : displayBranchData.length === 0 ? (
                  <p className="text-xs text-slate-400 font-semibold text-center py-4">No branch performance data found</p>
                ) : (
                  displayBranchData.map((item: any, idx: number) => {
                    const rateNum = item.percentage || 0;
                    const color = rateNum >= 50 ? "bg-emerald-500" : "bg-red-500";
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">
                            {item.label}{" "}
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {item.placedTotalText}
                            </span>
                          </span>
                          <span className="font-bold text-slate-800">{rateNum.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(100, Math.max(0, rateNum))}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </BaseCard>
        </motion.div>

        {/* Right Column - Action Required */}
        <motion.div variants={item}>
          <ListCard
            title="Action Required"
            items={actionItems}
            variant="alerts"
            className="h-full border-slate-200"
          />
        </motion.div>
      </div>

      {/* Bottom 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Student Onboarding Growth - Takes 2 columns */}
        <motion.div variants={item} className="lg:col-span-2">
          <BaseCard className="border-slate-200 p-5 h-full">
            <CardHeader
              title="Student Onboarding Growth"
              icon={<TrendingUp className="w-4 h-4 text-slate-600" />}
              action={{ label: "View Details" }}
            />
            {displayMonthlyData.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 font-semibold text-xs border border-dashed border-slate-200 rounded-xl mt-4 bg-slate-50/20">
                No onboarding growth data available
              </div>
            ) : (
              <div className="h-40 flex items-end justify-between gap-1 mt-4">
                {displayMonthlyData.map((data: { month: string; value: number }) => {
                  const maxValue = Math.max(...displayMonthlyData.map((d: { month: string; value: number }) => d.value), 1);
                  const height = (data.value / maxValue) * 120;
                  return (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-slate-400 rounded-t-lg hover:bg-slate-500 transition-all cursor-pointer relative group"
                        style={{ height: `${height}px` }}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.value}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{data.month}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </BaseCard>
        </motion.div>

        {/* Top Skill Gaps - Takes 1 column */}
        <motion.div variants={item}>
          <BaseCard className="border-slate-200 p-5 h-full">
            <CardHeader
              title="Top Skill Gaps"
              icon={<Target className="w-4 h-4 text-slate-600" />}
              action={{ label: "View All" }}
            />
            {displaySkillGaps.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 font-semibold text-xs border border-dashed border-slate-200 rounded-xl mt-4 bg-slate-50/20 px-4 text-center">
                No skill gap data available
              </div>
            ) : (
              <>
                <div className="space-y-4 mt-4">
                  {displaySkillGaps.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${skill.color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-medium text-slate-700">{skill.name}</span>
                          </div>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${skill.color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                            {skill.badge}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.percentage}%` }}
                            transition={{ duration: 1 }}
                            className={`h-full rounded-full ${skill.color === 'amber' ? 'bg-amber-500' : 'bg-slate-500'}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Critical Gap Notice - Subtle amber */}
                {criticalSkillGap && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <span className="font-semibold">Critical Gap:</span> {criticalSkillGap.name} skills impact {criticalSkillGap.percentage}% of placement opportunities
                    </p>
                  </div>
                )}
              </>
            )}
          </BaseCard>
        </motion.div>
      </div>

      {/* Additional Stats Row - Minimal design */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseCard className="border-slate-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Placement Rate</p>
              <p className="text-2xl font-bold text-slate-800">
                {placementStats?.placement_rate !== undefined
                  ? `${Number(placementStats.placement_rate).toFixed(1)}%`
                  : "86%"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="w-3 h-3 text-emerald-600" />
                <p className="text-xs text-emerald-600">
                  {placementStats?.placement_rate !== undefined ? "Live database metric" : "5% vs last year"}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard className="border-slate-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Upcoming Drives</p>
              <p className="text-2xl font-bold text-slate-800">
                {driveCounts?.upcoming_drives !== undefined
                  ? driveCounts.upcoming_drives
                  : upcomingDrivesList.filter((d: any) => d.status === "Registrations Open").length || "12"}
              </p>
              <p className="text-xs text-slate-600 mt-1">{nextDriveInfo}</p>
            </div>
          </div>
        </BaseCard>
      </motion.div>
    </motion.div>
  );
}