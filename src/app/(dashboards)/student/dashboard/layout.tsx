"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import HorizontalTabs from "@/components/dashboards/shared/HorizontalTabs";
import RoleBannerWidget from "@/components/dashboards/widgets/RoleBannerWidget";

export default function StudentDashboardSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOverview = pathname === "/student/dashboard" || pathname === "/student/dashboard/";
  const isShortsPage = pathname.endsWith("/shorts");

  if (isShortsPage) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <RoleBannerWidget role="student" onlyModal={!isOverview} />

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
      >
        <HorizontalTabs role="student" />
      </motion.div>

      {/* Dynamic Tab Content injected here */}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
