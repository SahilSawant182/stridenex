"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OverviewTabContent from "@/components/dashboards/mentor/OverviewTabContent";
import MentorGuidelineTour from "@/components/dashboards/mentor/MentorGuidelineTour";
import { useAuth } from "@/context/AuthContext";

export default function MentorDashboardPage() {
  const { currentUser } = useAuth();
  const [isFirstLoginUser, setIsFirstLoginUser] = useState<boolean>(false);

  useEffect(() => {
    const emailToCheck = currentUser || (typeof window !== "undefined" ? localStorage.getItem("currentUser") : null);
    if (!emailToCheck) return;

    const userKey = `has_seen_mentor_tour_${emailToCheck}`;
    const hasSeen = typeof window !== "undefined" && (
      localStorage.getItem(userKey) === "true" ||
      sessionStorage.getItem(`completed_mentor_tour_${emailToCheck}`) === "true"
    );

    if (hasSeen) {
      setIsFirstLoginUser(false);
      return;
    }

    const storedFirst = typeof window !== "undefined" && (
      localStorage.getItem(`is_first_login_${emailToCheck}`) === "true" ||
      sessionStorage.getItem(`is_first_login_${emailToCheck}`) === "true" ||
      sessionStorage.getItem("just_signed_up") === "true"
    );

    setIsFirstLoginUser(!!storedFirst);
  }, [currentUser]);

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
      <MentorGuidelineTour mentorEmail={currentUser || undefined} isFirstLogin={isFirstLoginUser} />
    </>
  );
}
