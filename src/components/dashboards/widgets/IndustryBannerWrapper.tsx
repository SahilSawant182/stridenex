"use client";

import { useIndustry } from "@/context/IndustryContext";
import RoleBannerWidget from "./RoleBannerWidget";
import { Briefcase, Users, Target } from "lucide-react";

export default function IndustryBannerWrapper() {
  const { industryData, roleList, loading, roleLoading } = useIndustry();

  if (loading && !industryData) {
    return (
      <div className="w-full h-[180px] bg-indigo-950 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-indigo-300 font-bold tracking-widest text-xs uppercase">Loading Industry Portal...</div>
      </div>
    );
  }

  // Construct dynamic subtitle
  const subtitleParts = [];
  if (industryData?.industry_sector) subtitleParts.push(industryData.industry_sector);
  if (industryData?.headquarters) subtitleParts.push(industryData.headquarters);
  if (industryData?.employee_head_count) subtitleParts.push(`${industryData.employee_head_count} employees`);
  
  const subtitle = subtitleParts.length > 0 ? subtitleParts.join(" • ") : "Industry Professional Plan";

  const openPositions = roleList?.reduce((acc, r) => acc + (Number(r.available_positions) || 0), 0) || 0;

  // Construct dynamic metrics
  const customMetrics = [
    { 
      key: "positions", 
      value: openPositions, 
      label: "Open Roles", 
      icon: Briefcase 
    },
    { 
      key: "applications", 
      value: "247", // High-fidelity placeholder consistent with profile tab stats
      label: "Applications", 
      icon: Users 
    },
    { 
      key: "match", 
      value: "94%", 
      label: "Match Quality", 
      icon: Target 
    }
  ];

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <RoleBannerWidget 
      role="industry" 
      customData={{
        title: capitalize(industryData?.company_name || ""),
        subtitle: subtitle,
        metrics: customMetrics
      }}
    />
  );
}
