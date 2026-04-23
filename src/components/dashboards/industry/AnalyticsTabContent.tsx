"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Eye, Briefcase, Zap, IndianRupee, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatsWidget from "@/components/dashboards/widgets/StatsWidget";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";
import { useIndustry } from "@/context/IndustryContext";
import { getApplicationStatusCount } from "@/services/industry.services";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

const applicationsByRole = [
  { role: "Backend", count: 78 },
  { role: "Analytics", count: 54 },
  { role: "ML", count: 41 },
  { role: "Design", count: 19 },
  { role: "Fintech", count: 55 }
];

const skillDistribution = [
  { skill: "Python", percentage: 78, color: "bg-orange-500" },
  { skill: "SQL", percentage: 65, color: "bg-blue-600" },
  { skill: "Machine Learning", percentage: 42, color: "bg-emerald-500" },
  { skill: "React", percentage: 38, color: "bg-purple-500" },
  { skill: "Go", percentage: 18, color: "bg-red-500" }
];

const collegeROI = [
  { id: 1, college: "IIT Bombay", applications: 32, shortlisted: 18, hired: 5, conversion: "28%", match: "91%", ctc: "₹18.5 LPA", matchColor: "text-orange-500" },
  { id: 2, college: "VJTI Mumbai", applications: 48, shortlisted: 22, hired: 7, conversion: "15%", match: "87%", ctc: "₹12.0 LPA", matchColor: "text-orange-400" },
  { id: 3, college: "COEP Pune", applications: 38, shortlisted: 14, hired: 3, conversion: "8%", match: "84%", ctc: "₹10.5 LPA", matchColor: "text-orange-400" },
  { id: 4, college: "NIT Warangal", applications: 27, shortlisted: 11, hired: 2, conversion: "7%", match: "82%", ctc: "₹15.0 LPA", matchColor: "text-blue-500" },
];

export default function AnalyticsTabContent() {
  const { industryData, loading: industryLoading } = useIndustry();
  const [newApplications, setNewApplications] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyName = industryData?.company_name || "";

  const fetchStats = async () => {
    if (!companyName) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getApplicationStatusCount(companyName);
      const statusCounts = response?.message || {};
      
      // Map "New Applications" to "Applied" status from pipeline
      setNewApplications(statusCounts["Applied"] || 0);
    } catch (err: any) {
      console.error("Error fetching application stats:", err);
      setError(err?.message || "Failed to load application statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [companyName]);

  const analyticsStats = [
    {
      id: 1,
      title: "PROFILE VIEWS / MONTH",
      value: "48.2K",
      change: 18,
      changeLabel: "increase",
      icon: Eye,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "up"
    },
    {
      id: 2,
      title: "APPLICATIONS RECEIVED",
      value: loading ? "..." : newApplications.toString(),
      change: 8,
      changeLabel: "new applicants",
      icon: Briefcase,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      trend: "up"
    },
    {
      id: 3,
      title: "AVG TIME TO SHORTLIST",
      value: "4.2d",
      change: 68,
      changeLabel: "faster",
      icon: Zap,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      trend: "up"
    },
    {
      id: 4,
      title: "RECRUITMENT COST SAVED",
      value: "₹2.4L",
      change: 100,
      changeLabel: "vs agency",
      icon: IndianRupee,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "up"
    }
  ];

  if (industryLoading && !companyName) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="text-sm font-medium italic tracking-widest uppercase opacity-70">Syncing Intelligence...</span>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      
      {/* Error Display */}

      {/* Top Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsStats.map((stat) => (
          <StatsWidget
            key={stat.id}
            title={stat.title}
            data={{
              value: stat.value,
              change: stat.change,
              changeLabel: stat.changeLabel,
              icon: stat.icon,
              iconBg: stat.iconBg,
              iconColor: stat.iconColor,
              trend: stat.trend as "up" | "down" | "neutral"
            }}
          />
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Applications By Role */}
        <motion.div variants={item} className="h-[300px]">
          <BaseCard className="border-slate-200 p-6 h-full flex flex-col">
            <h3 className="font-bold text-slate-800 mb-6 text-base">Applications by Role</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationsByRole} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="role" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#f97316" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={50}
                    activeBar={{ fill: '#ea580c' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </BaseCard>
        </motion.div>

        {/* Skill Distribution */}
        <motion.div variants={item} className="h-full">
          <BaseCard className="border-slate-200 p-6 h-full">
            <h3 className="font-bold text-slate-800 mb-6 text-base">Skill Distribution in Applicant Pool</h3>
            <div className="space-y-5">
              {skillDistribution.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-700">{item.skill}</span>
                    <span className={`text-sm font-bold ${item.color.replace('bg-', 'text-')}`}>{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </motion.div>

      </div>

      {/* Bottom Table: College ROI */}
      <motion.div variants={item}>
        <BaseCard className="border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">College ROI — Where Best Hires Come From</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">College</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Applications</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Shortlisted</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Hired</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Conversion</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Avg Match</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Avg CTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collegeROI.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-700 text-sm whitespace-nowrap">{row.college}</td>
                    <td className="py-4 px-6 text-slate-600 text-sm font-medium">{row.applications}</td>
                    <td className="py-4 px-6 text-blue-600 text-sm font-bold">{row.shortlisted}</td>
                    <td className="py-4 px-6 text-emerald-600 text-sm font-bold">{row.hired}</td>
                    <td className="py-4 px-6 text-slate-600 text-sm font-medium">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md text-xs">{row.conversion}</span>
                    </td>
                    <td className={`py-4 px-6 font-bold text-sm ${row.matchColor}`}>{row.match}</td>
                    <td className="py-4 px-6 text-emerald-600 font-bold text-sm bg-emerald-50/30">{row.ctc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BaseCard>
      </motion.div>

    </motion.div>
  );
}
