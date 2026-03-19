import OverviewTabContent from "@/components/dashboards/mentor/OverviewTabContent";
import ScheduleTabContent from "@/components/dashboards/mentor/ScheduleTabContent";
import OfferingsTabContent from "@/components/dashboards/mentor/OfferingsTabContent";
import RequestsTabContent from "@/components/dashboards/mentor/RequestsTabContent";
import SessionHistoryTabContent from "@/components/dashboards/mentor/SessionHistoryTabContent";
import PayoutsTabContent from "@/components/dashboards/mentor/PayoutsTabContent";
import MyProfileTabContent from "@/components/dashboards/mentor/MyProfileTabContent";
import CommonTabContent from "@/components/dashboards/shared/CommonTabContent";
import { use } from "react";


export default function DynamicMentorTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const unwrappedParams = use(params);
  const tab = unwrappedParams.tab;
  
  switch(tab) {
    case "schedule":
      return <ScheduleTabContent />;
    case "offerings":
      return <OfferingsTabContent />;
    case "requests":
      return <RequestsTabContent />;
    case "session-history":
      return <SessionHistoryTabContent />;
    case "payouts":
      return <PayoutsTabContent />;
    case "profile":
      return <MyProfileTabContent />;
    case "overview":
      return <OverviewTabContent />;
    default:
      return <CommonTabContent title={tab} />;
  }
}
