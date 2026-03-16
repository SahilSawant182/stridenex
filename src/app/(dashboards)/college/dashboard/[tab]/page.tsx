import StudentsTabContent from "@/components/dashboards/college/StudentsTabContent";
import PlacementTabContent from "@/components/dashboards/college/PlacementTabContent";
import NepUgcTabContent from "@/components/dashboards/college/NepUgcTabContent";
import InterventionsTabContent from "@/components/dashboards/college/InterventionsTabContent";
import NoticeBoardTabContent from "@/components/dashboards/college/NoticeBoardTabContent";
import CommonTabContent from "@/components/dashboards/shared/CommonTabContent";
import { use } from "react";

export default function DynamicCollegeTabPage({ params }: { params: Promise<{ tab: string }> }) {
    const unwrappedParams = use(params);

    if (unwrappedParams.tab === "students") return <StudentsTabContent />;
    if (unwrappedParams.tab === "placement") return <PlacementTabContent />;
    if (unwrappedParams.tab === "nep-ugc") return <NepUgcTabContent />;
    if (unwrappedParams.tab === "interventions") return <InterventionsTabContent />;
    if (unwrappedParams.tab === "notice-board") return <NoticeBoardTabContent />;

    return <CommonTabContent title={unwrappedParams.tab} />;
}
