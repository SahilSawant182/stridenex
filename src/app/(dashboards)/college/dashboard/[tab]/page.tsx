import StudentsTabContent from "@/components/dashboards/college/StudentsTabContent";
import CommonTabContent from "@/components/dashboards/shared/CommonTabContent";
import { use } from "react";

export default function DynamicCollegeTabPage({ params }: { params: Promise<{ tab: string }> }) {
    const unwrappedParams = use(params);
    // `unwrappedParams.tab` comes from the URL, e.g., `/student/dashboard/skills` -> `tab` = "skills"

    if (unwrappedParams.tab === "students") {
        return <StudentsTabContent />;
    }


    return <CommonTabContent title={unwrappedParams.tab} />;
}
