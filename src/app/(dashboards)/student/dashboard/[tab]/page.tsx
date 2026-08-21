import CommonTabContent from "@/components/dashboards/shared/CommonTabContent";
import SkillsTabContent from "@/components/dashboards/student/SkillsTabContent";
import PathTabContent from "@/components/dashboards/student/PathTabContent";
import { use } from "react";
import CommunityTabContent from "@/components/dashboards/student/CommunityTabContent";
import InternshipTabContent from "@/components/dashboards/student/InternshipTabContent";
import HabitsTabContent from "@/components/dashboards/student/HabitsTabContent";
import MentorsTabContent from "@/components/dashboards/student/MentorsTabContent";
import EventsTabContent from "@/components/dashboards/student/EventsTabContent";
import StoriesTabContent from "@/components/dashboards/student/StoriesTabContent";
import PlanTabContent from "@/components/dashboards/student/PlanTabContent";
import ShortsTabContent from "@/components/dashboards/student/ShortsTabContent";
import ProjectsTabContent from "@/components/dashboards/student/ProjectsTabContent";
import JobsTabContent from "@/components/dashboards/student/JobsTabContent";
import ResumeTabContent from "@/components/dashboards/student/ResumeTabContent";
import ResumePreviewTabContent from "@/components/dashboards/student/ResumePreviewTabContent";
import CampusDrivesTabContent from "@/components/dashboards/student/CampusDrivesTabContent";
import SuccessStoriesFooter from "@/components/dashboards/student/SuccessStoriesFooter";

export default function DynamicStudentTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const unwrappedParams = use(params);
  const tab = unwrappedParams.tab;

  const renderTab = () => {
    if (tab === "resume") {
      return <ResumeTabContent />;
    }
    if (tab === "resume-preview") {
      return <ResumePreviewTabContent />;
    }
    if (tab === "skills") {
      return <SkillsTabContent />;
    }
    if (tab === "projects") {
      return <ProjectsTabContent />;
    }
    if (tab === "jobs") {
      return <JobsTabContent />;
    }
    if (tab === "path") {
      return <PathTabContent />;
    }
    if (tab === "shorts") {
      return <ShortsTabContent />;
    }
    if (tab === "community") {
      return <CommunityTabContent />;
    }
    if (tab === "campus-drives") {
      return <CampusDrivesTabContent />;
    }
    if (tab === "internships") {
      return <InternshipTabContent />;
    }
    if (tab === "habits") {
      return <HabitsTabContent />;
    }
    if (tab === "mentors") {
      return <MentorsTabContent />;
    }
    if (tab === "events") {
      return <EventsTabContent />;
    }
    if (tab === "stories") {
      return <StoriesTabContent />;
    }
    if (tab === "plans") {
      return <PlanTabContent />;
    }
    return <CommonTabContent title={tab} />;
  };

  const showFooter = tab !== "shorts" && 
                     tab !== "community" && 
                     tab !== "stories" && 
                     tab !== "path" && 
                     tab !== "habits" && 
                     tab !== "mentors";

  return (
    <div className="flex flex-col min-h-full justify-between">
      <div className="flex-1">{renderTab()}</div>
      {showFooter && <SuccessStoriesFooter />}
    </div>
  );
}
