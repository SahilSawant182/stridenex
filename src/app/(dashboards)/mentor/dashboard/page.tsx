"use client";

import { motion } from "framer-motion";
import OverviewTabContent from "@/components/dashboards/mentor/OverviewTabContent";
import MentorGuidelineTour from "@/components/dashboards/mentor/MentorGuidelineTour";
import { useAuth } from "@/context/AuthContext";

export default function MentorDashboardPage() {
  const { currentUser } = useAuth();
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <OverviewTabContent />
      </motion.div>
      <MentorGuidelineTour mentorEmail={currentUser || undefined} />
    </>
  );
}
