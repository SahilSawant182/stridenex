// app/(dashboards)/industry/dashboard/[tab]/page.tsx
"use client";

import { use, Suspense } from "react";
import FindTalentTabContent from "@/components/dashboards/industry/FindTalentTabContent";
import PipelineTabContent from "@/components/dashboards/industry/PipelineTabContent";
import InternshipsTabContent from "@/components/dashboards/industry/InternshipsTabContent";
import AnalyticsTabContent from "@/components/dashboards/industry/AnalyticsTabContent";
import PlansTabContent from "@/components/dashboards/industry/PlansTabContent";
import CompanyProfileTabContent from "@/components/dashboards/industry/CompanyProfileTabContent";
import ProjectsTabContent from "@/components/dashboards/industry/ProjectsTabContent";
import FeedbackTabContent from "@/components/dashboards/industry/FeedbackTabContent";
import SettingsTabContent from "@/components/dashboards/industry/SettingsTabContent";
import JobsTabContent from "@/components/dashboards/industry/JobsTabContent";

export default function IndustryTabContent({
  params
}: {
  params: Promise<{ tab: string }>
}) {
  const resolvedParams = use(params);

  const renderTab = () => {
    switch (resolvedParams.tab) {
      case "company-profile":
        return <CompanyProfileTabContent />;
      case "find-talent":
        return <FindTalentTabContent />;
      case "pipeline":
        return <PipelineTabContent />;
      case "projects":
        return <ProjectsTabContent />;
      case "internships":
        return <InternshipsTabContent />;
      case "jobs":
        return <JobsTabContent />;
      case "feedback":
        return <FeedbackTabContent />;
      case "analytics":
        return <AnalyticsTabContent />;
      case "plan":
        return <PlansTabContent />;
      case "settings":
        return <SettingsTabContent />;
      default:
        return <div className="p-6 text-center text-red-500">Tab not found</div>;
    }
  };

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      {renderTab()}
    </Suspense>
  );
}
