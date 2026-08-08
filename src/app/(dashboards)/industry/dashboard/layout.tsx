"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import HorizontalTabs from "@/components/dashboards/shared/HorizontalTabs";
import IndustryBannerWrapper from "@/components/dashboards/widgets/IndustryBannerWrapper";
import { IndustryProvider } from "@/context/IndustryContext";

export default function IndustryDashboardSubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isOverview = pathname === "/industry/dashboard";

    return (
        <IndustryProvider>
            <div className="max-w-7xl mx-auto space-y-6 pb-12">
                {/* Banner */}
                {isOverview && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                        <IndustryBannerWrapper />
                    </motion.div>
                )}

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                >
                    <HorizontalTabs role="industry" />
                </motion.div>

                {/* Dynamic Tab Content injected here */}
                <div className="pt-2">
                    {children}
                </div>
            </div>
        </IndustryProvider>
    );
}
