import CommonTabContent from "@/components/dashboards/shared/CommonTabContent";
import SkillsTabContent from "@/components/dashboards/student/SkillsTabContent";
import PathTabContent from "@/components/dashboards/student/PathTabContent";
import { use } from "react";

export default function DynamicStudentTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const unwrappedParams = use(params);
  // `unwrappedParams.tab` comes from the URL, e.g., `/student/dashboard/skills` -> `tab` = "skills"
  
  if (unwrappedParams.tab === "skills") {
    return <SkillsTabContent />;
  }
  
  if (unwrappedParams.tab === "path") {
    return <PathTabContent />;
  }
  
  return <CommonTabContent title={unwrappedParams.tab} />;
}
