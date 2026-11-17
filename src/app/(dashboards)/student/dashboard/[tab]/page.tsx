"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStudentPlan } from "@/utils/studentPlan";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommonTabContent from "@/components/dashboards/shared/CommonTabContent";
import SkillsTabContent from "@/components/dashboards/student/SkillsTabContent";
import PathTabContent from "@/components/dashboards/student/PathTabContent";
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
import SupportTabContent from "@/components/dashboards/shared/SupportTabContent";

export default function DynamicStudentTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const unwrappedParams = use(params);
  const tab = unwrappedParams.tab;
  const router = useRouter();
  const { hasActivePlan, loading } = useStudentPlan();

  const isPlanTab = tab === "plans" || tab === "plan";
  const isSupportTab = tab === "support";

  // Redirect locked tabs to plans page (Support and Plans remain unlocked)
  useEffect(() => {
    if (!loading && hasActivePlan === false && !isPlanTab && !isSupportTab) {
      router.replace("/student/dashboard/plans");
    }
  }, [loading, hasActivePlan, isPlanTab, isSupportTab, router]);

  const renderTab = () => {
    if (isPlanTab) {
      return <PlanTabContent />;
    }
    if (isSupportTab) {
      return <SupportTabContent role="student" />;
    }

    if (!loading && hasActivePlan === false) {
      return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Plan Required</h2>
          <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
            All dashboard tabs are locked until an active plan is purchased. Please choose a subscription plan to unlock full access.
          </p>
          <Button
            onClick={() => router.push("/student/dashboard/plans")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md inline-flex items-center gap-2"
          >
            <span>View Subscription Plans</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (tab === "resume" || tab === "profile") {
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
    return <CommonTabContent title={tab} />;
  };

  const showFooter =
    tab !== "shorts" &&
    tab !== "community" &&
    tab !== "stories" &&
    tab !== "path" &&
    tab !== "habits" &&
    tab !== "mentors" &&
    tab !== "resume" &&
    tab !== "profile";

  return (
    <div className="flex flex-col min-h-full justify-between">
      <div className="flex-1">{renderTab()}</div>
      {showFooter && <SuccessStoriesFooter />}
    </div>
  );
}
