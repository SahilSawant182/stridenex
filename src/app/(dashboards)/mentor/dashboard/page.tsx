"use client";

import { motion } from "framer-motion";
import OverviewTabContent from "@/components/dashboards/mentor/OverviewTabContent";

export default function MentorDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <OverviewTabContent />
    </motion.div>
  );
}
