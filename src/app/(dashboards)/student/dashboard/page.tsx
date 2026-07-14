"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import StudentBannerWidget from "@/components/dashboards/widgets/RoleBannerWidget";
import HorizontalTabs from "@/components/dashboards/shared/HorizontalTabs";
import StatsWidget from "@/components/dashboards/widgets/StatsWidget";
import LearningActivityGraph from "@/components/dashboards/widgets/LearningActivityGraph";
import CoachWidget from "@/components/dashboards/widgets/CoachWidget";
import SkillsWidget from "@/components/dashboards/widgets/SkillsWidget";
import AlertsWidget from "@/components/dashboards/widgets/AlertsWidget";
import InternshipsWidget from "@/components/dashboards/widgets/InternshipsWidget";
import { useAuth } from "@/context/AuthContext";
import { getStudentSkills, getDashboardStats } from "@/services/student.services";

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

export default function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats(currentUser);
        console.log("Student stats API response:", res);
        const data = res?.data || res?.message;
        if (data) {
          setStatsData(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchSkills = async () => {
      try {
        const res = await getStudentSkills(currentUser);
        console.log("Student skills API response:", res);
        
        let rawSkills = [];
        if (res && res.message && Array.isArray(res.message.skills)) {
          rawSkills = res.message.skills;
        } else if (res && Array.isArray(res.message)) {
          rawSkills = res.message;
        }

        const mapLevelToPercentage = (level?: string): number => {
          if (!level) return 0;
          switch (level.toLowerCase()) {
            case "beginner": return 35;
            case "intermediate": return 65;
            case "advanced": return 85;
            case "expert": return 100;
            default: return 50;
          }
        };

        const mapped = rawSkills.map((item: any) => ({
          name: item.skill,
          level: item.level || "Beginner",
          percentage: mapLevelToPercentage(item.level)
        }));
        
        setSkillsData(mapped);
      } catch (error) {
        console.error("Error fetching skills snapshot:", error);
      }
    };
    fetchSkills();
  }, [currentUser]);

  const fallbackSkills = [
    { name: "Python", percentage: 78 },
    { name: "Machine Learning", percentage: 61 },
    { name: "SQL", percentage: 85 },
    { name: "Data Viz", percentage: 55 },
    { name: "Communication", percentage: 72 },
    { name: "Problem Solving", percentage: 80 }
  ];
  
  const displayedSkills = skillsData.length > 0 ? skillsData : fallbackSkills;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsWidget
          title="Employability Score"
          data={{ 
            value: statsData?.employability_score !== undefined ? statsData.employability_score : 73, 
            max: 100, 
            change: 8, 
            changeLabel: "this month" 
          }}
        />
        <StatsWidget
          title="Profile Completeness"
          data={{ 
            value: statsData?.profile_completeness !== undefined ? `${statsData.profile_completeness}%` : "78%", 
            change: 12, 
            changeLabel: "this week" 
          }}
        />
        <StatsWidget
          title="Total Skills"
          data={{ 
            value: statsData?.total_skills !== undefined ? statsData.total_skills : 3 
          }}
        />
        <StatsWidget
          title="CGPA"
          data={{ 
            value: statsData?.cgpa !== undefined ? statsData.cgpa : 0, 
            change: statsData?.backlog !== undefined ? statsData.backlog : 0, 
            changeLabel: "Backlogs", 
            trend: statsData?.backlog > 0 ? "down" : "up" 
          }}
        />
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2">
          {/* Learning Activity Heatmap */}
          <div className="h-full">
            <LearningActivityGraph data={{ lessons: 42, problems: 87, studyTime: 68 }} />
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div>
          {/* AI Coach */}
          <div className="h-full">
            <CoachWidget
              data={{
                message: "Great SQL progress! 🚀 You are top 15% in your cohort. Start your ML module next — 3 resources picked for your style.",
                task: "Sklearn Ch.2 (45 min) + solve 2 classification problems."
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <SkillsWidget
          data={displayedSkills}
        />

        <AlertsWidget
          data={{
            blocks: [
              { type: "warning", message: "Razorpay deadline in 3 days", detail: "Your match: 76% — apply now" },
              { type: "success", message: "Shortlisted at TCS iON!", detail: "Interview: Feb 28, 3:00 PM" },
              { type: "danger", message: "Habit Risk: LinkedIn", detail: "2 consecutive misses — streak at risk!" }
            ],
            agenda: [
              { icon: "education", text: "ML Module Ch.2 — due Feb 25" },
              { icon: "call", text: "Mentor: Kavya Reddy — Feb 27 4PM" },
              { icon: "write", text: "AI Assessment: ML — Feb 28" }
            ]
          }}
        />
      </motion.div>

      {/* Internships Row */}
      <motion.div variants={item}>
        <InternshipsWidget />
      </motion.div>
    </motion.div>
  );
}
