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

export default function DynamicStudentTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const unwrappedParams = use(params);
  // `unwrappedParams.tab` comes from the URL, e.g., `/student/dashboard/skills` -> `tab` = "skills"

  if (unwrappedParams.tab === "resume") {
    return <ResumeTabContent />;
  }

  if (unwrappedParams.tab === "resume-preview") {
    return <ResumePreviewTabContent />;
  }

  if (unwrappedParams.tab === "skills") {
    return <SkillsTabContent />;
  }

  if (unwrappedParams.tab === "projects") {
    return <ProjectsTabContent />;
  }

  if (unwrappedParams.tab === "jobs") {
    return <JobsTabContent />;
  }

  if (unwrappedParams.tab === "path") {
    return <PathTabContent />;
  }
  if (unwrappedParams.tab === "shorts") {
    return <ShortsTabContent />;
  }
  if (unwrappedParams.tab === "community") {
    return <CommunityTabContent />;
  }
  if (unwrappedParams.tab === "internships") {
    return <InternshipTabContent />;
  }
  if (unwrappedParams.tab === "habits") {
    return <HabitsTabContent />;
  }
  if (unwrappedParams.tab === "mentors") {
    return <MentorsTabContent />;
  }
  if (unwrappedParams.tab === "events") {
    return <EventsTabContent />;
  }
  if (unwrappedParams.tab === "stories") {
    return <StoriesTabContent />;
  }
  if (unwrappedParams.tab === "plans") {
    return <PlanTabContent />;
  }

  return <CommonTabContent title={unwrappedParams.tab} />;
}
