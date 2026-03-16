import StudentsTabContent from "@/components/dashboards/college/StudentsTabContent";
import PlacementTabContent from "@/components/dashboards/college/PlacementTabContent";
import NepUgcTabContent from "@/components/dashboards/college/NepUgcTabContent";
import InterventionsTabContent from "@/components/dashboards/college/InterventionsTabContent";
import NoticeBoardTabContent from "@/components/dashboards/college/NoticeBoardTabContent";
import ReportsTabContent from "@/components/dashboards/college/ReportsTabContent";
import PlansTabContent from "@/components/dashboards/college/PlansTabContent";
import CommonTabContent from "@/components/dashboards/shared/CommonTabContent";
import { use } from "react";

export default function DynamicCollegeTabPage({ params }: { params: Promise<{ tab: string }> }) {
    const unwrappedParams = use(params);

    if (unwrappedParams.tab === "students") return <StudentsTabContent />;
    if (unwrappedParams.tab === "placement") return <PlacementTabContent />;
    if (unwrappedParams.tab === "nep-ugc") return <NepUgcTabContent />;
    if (unwrappedParams.tab === "interventions") return <InterventionsTabContent />;
    if (unwrappedParams.tab === "notice-board") return <NoticeBoardTabContent />;
    if (unwrappedParams.tab === "reports") return <ReportsTabContent />;
    if (unwrappedParams.tab === "plans") return <PlansTabContent />;

    return <CommonTabContent title={unwrappedParams.tab} />;
}
