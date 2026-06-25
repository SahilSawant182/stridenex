"use client";

import { motion, Variants } from "framer-motion";
import StudentBannerWidget from "@/components/dashboards/widgets/RoleBannerWidget";
import HorizontalTabs from "@/components/dashboards/shared/HorizontalTabs";
import StatsWidget from "@/components/dashboards/widgets/StatsWidget";
import LearningActivityGraph from "@/components/dashboards/widgets/LearningActivityGraph";
import CoachWidget from "@/components/dashboards/widgets/CoachWidget";
import SkillsWidget from "@/components/dashboards/widgets/SkillsWidget";
import AlertsWidget from "@/components/dashboards/widgets/AlertsWidget";
import InternshipsWidget from "@/components/dashboards/widgets/InternshipsWidget";

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
          data={{ value: 73, max: 100, change: 8, changeLabel: "this month" }}
        />
        <StatsWidget
          title="Path Completion"
          data={{ value: "58%", change: 12, changeLabel: "this week" }}
        />
        <StatsWidget
          title="Applications Sent"
          data={{ value: "3", sent: 3, shortlisted: 1 }}
        />
        <StatsWidget
          title="AI Sessions / Month"
          data={{ value: 12, change: 4, changeLabel: "assessments" }}
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
          data={[
            { name: "Python", percentage: 78 },
            { name: "Machine Learning", percentage: 61 },
            { name: "SQL", percentage: 85 },
            { name: "Data Viz", percentage: 55 },
            { name: "Communication", percentage: 72 },
            { name: "Problem Solving", percentage: 80 }
          ]}
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
