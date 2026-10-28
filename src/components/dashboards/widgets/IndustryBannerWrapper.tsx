"use client";

import { useState, useEffect, useCallback } from "react";
import { useIndustry } from "@/context/IndustryContext";
import RoleBannerWidget from "./RoleBannerWidget";
import { Briefcase, Users, Target, Star, Building2, Globe, FileText, Layout, Layers, MapPin, Factory } from "lucide-react";
import { OperatingHoursTable } from "@/components/dashboards/shared/OperatingHoursTable";
import ReferralSectionField from "@/components/dashboards/widgets/ReferralSectionField";
import {
  getJobProfiles,
  getApplications,
  getApplicationsCount,
  getApplicationStatusCount,
  getInternshipList
} from "@/services/industry.services";

// Module-level component so it's not re-created on every render
function IndustryReferralCodeBox({ referal_code }: { referal_code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm p-5 mt-2">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">🎁 Refer &amp; Earn</span>
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">Expand your talent network! 🚀</h4>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Share your code with students, mentors, colleges, or industry partners. For every referral that joins, earn <span className="font-bold text-emerald-600">500 Points</span>!
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
            <span className="text-lg font-black text-emerald-600 tracking-widest font-mono">{referal_code}</span>
          </div>
          <button
            type="button"
            onClick={() => { navigator.clipboard.writeText(referal_code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className={`flex items-center justify-center h-10 px-3 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
            title="Copy Code"
          >
            {copied ? <span className="text-xs font-bold">Copied!</span> : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function IndustryBannerWrapper() {
  const { industryData, roleList, loading, refreshIndustryData } = useIndustry();
  const [businessTypeOptions, setBusinessTypeOptions] = useState<string[]>([]);
  const [industrySectorOptions, setIndustrySectorOptions] = useState<string[]>([]);
  const [bannerMetrics, setBannerMetrics] = useState({
    openRoles: 0,
    applications: 0,
    hired: 0
  });

  const fetchBannerMetrics = useCallback(async (companyName: string) => {
    if (!companyName) return;
    try {
      const [
        jobsRes,
        jobAppsCountRes,
        internAppsCountRes,
        projAppsCountRes,
        generalAppsCountRes,
        statusCountRes,
        appsListRes
      ] = await Promise.allSettled([
        getJobProfiles(companyName),
        getApplicationsCount({ industry: companyName, opportunity_type: "Job" }),
        getApplicationsCount({ industry: companyName, opportunity_type: "Internship" }),
        getApplicationsCount({ industry: companyName, opportunity_type: "Project" }),
        getApplicationsCount({ industry: companyName } as any),
        getApplicationStatusCount(companyName),
        getApplications({ industry: companyName } as any)
      ]);

      // 1. Calculate Open Roles from Job Profiles
      let openRolesCount = 0;
      if (jobsRes.status === "fulfilled" && jobsRes.value) {
        const dataObj = jobsRes.value?.data || jobsRes.value?.message?.data || jobsRes.value?.message || {};
        let list: any[] = [];
        if (Array.isArray(dataObj)) {
          list = dataObj;
        } else if (Array.isArray(dataObj?.data)) {
          list = dataObj.data;
        }
        const compLower = companyName.trim().toLowerCase();
        const filteredJobs = list.filter((job: any) =>
          !job.industry || job.industry.trim().toLowerCase() === compLower
        );
        const openJobs = filteredJobs.filter((job: any) =>
          (job.status || "open").trim().toLowerCase() === "open"
        );
        openRolesCount = openJobs.length;
      }

      // Include any legacy roles from roleList
      if (roleList && roleList.length > 0) {
        if (openRolesCount === 0) {
          openRolesCount = roleList.length;
        } else {
          openRolesCount += roleList.length;
        }
      }

      // If still 0, check active internships
      if (openRolesCount === 0) {
        try {
          const internRes = await getInternshipList(companyName, 1, 100);
          const internData = internRes?.data || internRes?.message?.data || internRes?.message || {};
          let internList: any[] = [];
          if (Array.isArray(internData)) {
            internList = internData;
          } else if (Array.isArray(internData?.internships)) {
            internList = internData.internships;
          } else if (Array.isArray(internData?.data)) {
            internList = internData.data;
          }
          const openInterns = internList.filter((i: any) =>
            (i.status || "open").trim().toLowerCase() === "open"
          );
          if (openInterns.length > 0) {
            openRolesCount = openInterns.length;
          }
        } catch (_) {}
      }

      // 2. Extract Application Counts
      const extractCounts = (settledRes: PromiseSettledResult<any>): Record<string, number> => {
        if (settledRes.status !== "fulfilled" || !settledRes.value) return {};
        const val = settledRes.value;
        const data = val?.data?.data || val?.message?.data || val?.data || val?.message || val;
        if (data && typeof data === "object" && !Array.isArray(data)) {
          const res: Record<string, number> = {};
          for (const [k, v] of Object.entries(data)) {
            const num = Number(v);
            if (!isNaN(num)) {
              res[k] = num;
            }
          }
          return res;
        }
        return {};
      };

      const jobCounts = extractCounts(jobAppsCountRes);
      const internCounts = extractCounts(internAppsCountRes);
      const projCounts = extractCounts(projAppsCountRes);
      const generalCounts = extractCounts(generalAppsCountRes);
      const statusCounts = extractCounts(statusCountRes);

      const aggregatedStatusMap: Record<string, number> = {};
      const addCountsToMap = (counts: Record<string, number>) => {
        for (const [status, count] of Object.entries(counts)) {
          const normKey = status.trim();
          aggregatedStatusMap[normKey] = (aggregatedStatusMap[normKey] || 0) + count;
        }
      };

      const oppTypeTotal =
        Object.values(jobCounts).reduce((a, b) => a + b, 0) +
        Object.values(internCounts).reduce((a, b) => a + b, 0) +
        Object.values(projCounts).reduce((a, b) => a + b, 0);

      if (oppTypeTotal > 0) {
        addCountsToMap(jobCounts);
        addCountsToMap(internCounts);
        addCountsToMap(projCounts);
      } else if (Object.keys(generalCounts).length > 0) {
        addCountsToMap(generalCounts);
      } else if (Object.keys(statusCounts).length > 0) {
        addCountsToMap(statusCounts);
      }

      // Extract raw applications list if returned
      let rawAppsList: any[] = [];
      if (appsListRes.status === "fulfilled" && appsListRes.value) {
        const val = appsListRes.value;
        const data = val?.data?.data || val?.message?.data || val?.data || val?.message || val;
        if (Array.isArray(data)) {
          rawAppsList = data;
        } else if (data && typeof data === "object" && Array.isArray(data.data)) {
          rawAppsList = data.data;
        }
      }

      const totalApplications = Math.max(
        Object.values(aggregatedStatusMap).reduce((a, b) => a + b, 0),
        rawAppsList.length
      );

      // 3. Calculate Hired (Selected, Accepted, Hired)
      let hiredFromStatus = 0;
      for (const [k, v] of Object.entries(aggregatedStatusMap)) {
        const lower = k.toLowerCase().trim();
        if (lower === "selected" || lower === "accepted" || lower === "hired") {
          hiredFromStatus += v;
        }
      }

      const hiredFromList = rawAppsList.filter((app: any) => {
        const s = (app.status || "").toLowerCase().trim();
        return s === "selected" || s === "accepted" || s === "hired";
      }).length;

      const totalHired = Math.max(hiredFromStatus, hiredFromList);

      setBannerMetrics({
        openRoles: openRolesCount,
        applications: totalApplications,
        hired: totalHired
      });
    } catch (err) {
      console.error("Error fetching industry banner metrics:", err);
    }
  }, [roleList]);

  useEffect(() => {
    if (industryData?.company_name) {
      fetchBannerMetrics(industryData.company_name);
    }
  }, [industryData?.company_name, fetchBannerMetrics]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { getMasterData } = await import("@/services/industry.services");
        const btData = await getMasterData("Business Type");
        setBusinessTypeOptions((btData.data || btData.message || []).map((i: any) => i.name));
        const isData = await getMasterData("Industry Sector");
        setIndustrySectorOptions((isData.data || isData.message || []).map((i: any) => i.name));
      } catch (err) {
        console.error("Error fetching banner options:", err);
      }
    };
    fetchOptions();
  }, []);

  if (loading && !industryData) {
    return (
      <div className="w-full h-[180px] bg-indigo-950 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-indigo-300 font-bold tracking-widest text-xs uppercase">Loading Industry Portal...</div>
      </div>
    );
  }

  // Construct dynamic colorful subtitle badges
  const subtitle = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
      {(industryData?.industry_sector || industryData?.other_industry_sector) && (
        <span className="flex items-center gap-1 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
          <Layers className="w-3 h-3 opacity-80" /> {industryData.industry_sector || industryData.other_industry_sector}
        </span>
      )}
      {(industryData?.business_type || industryData?.other_business_type) && (
        <span className="flex items-center gap-1 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
          <Factory className="w-3 h-3 opacity-80" /> {industryData.business_type || industryData.other_business_type}
        </span>
      )}
      {industryData?.headquarters && (
        <span className="flex items-center gap-1 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
          <MapPin className="w-3 h-3 opacity-80" /> {industryData.headquarters.split(',')[0]}
        </span>
      )}
      {industryData?.employee_head_count && (
        <span className="flex items-center gap-1 text-orange-300 text-[10px] font-bold uppercase tracking-wider">
          <Users className="w-3 h-3 opacity-80" /> {industryData.employee_head_count ? parseInt(industryData.employee_head_count).toLocaleString() : "0"}+
        </span>
      )}
    </div>
  );

  // Construct dynamic metrics
  const customMetrics = [
    {
      key: "positions",
      value: bannerMetrics.openRoles,
      label: "Open Roles",
      icon: Briefcase
    },
    {
      key: "applications",
      value: bannerMetrics.applications,
      label: "Applications",
      icon: Users
    },
    {
      key: "hired",
      value: bannerMetrics.hired,
      label: "Hired",
      icon: Users
    }
  ];

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const industryFields: any[] = [
    { name: "company_name", label: "Company Name", type: "text", icon: Building2, required: true, colSpan: 2, placeholder: "e.g. Acme Corporation", disabled: true },
    { name: "business_type", label: "Company Type", type: "select", icon: Layout, options: businessTypeOptions.length > 0 ? businessTypeOptions : ["Enterprises", "Consultant and Agency", "Other"], required: false, placeholder: "Select Company Type" },
    { name: "gst_number", label: "GST Number", type: "text", icon: FileText, required: false, placeholder: "Enter GSTIN" },
  ];

  if (industryData?.other_business_type) {
    industryFields.push({ name: "other_business_type", label: "Other Company Type", type: "text", icon: Layout, required: false, placeholder: "Enter other business type" });
  }

  industryFields.push(
    { name: "industry_sector", label: "Industry Sector", type: "select", icon: Layers, options: industrySectorOptions.length > 0 ? industrySectorOptions : ["Information Services", "Manufacturing", "Finance", "Healthcare", "Education", "Other"], required: false, placeholder: "Select Industry Sector" },
    { name: "headquarters", label: "Headquarters", type: "text", icon: MapPin, required: false, placeholder: "e.g. Jaipur" }
  );

  if (industryData?.other_industry_sector) {
    industryFields.push({ name: "other_industry_sector", label: "Other Industry Sector", type: "text", icon: Layers, required: false, placeholder: "Enter other industry sector" });
  }

  industryFields.push(
    { name: "company_website", label: "Website (URL)", type: "url", icon: Globe, required: true, placeholder: "https://www.company.com" },
    { name: "employee_head_count", label: "Employee Count", type: "number", icon: Users, required: true, placeholder: "e.g. 500" },
    { name: "cin", label: "CIN Number", type: "text", icon: FileText, required: false, placeholder: "Enter Corporate Identification Number" },
    { name: "about", label: "About Company", type: "textarea", icon: FileText, required: true, colSpan: 2, placeholder: "Briefly describe your company's mission and goals..." },
    {
      name: "specializations",
      label: "Specializations",
      type: "select",
      multiple: true,
      icon: Target,
      colSpan: 2,
      apiEndpoint: "method/stridenex_app.api_stridenex_app.college.master.get_master_data",
      apiParams: { doctype: "Specialization" },
      allowCustom: true,
      customPlaceholder: "Enter custom specialization...",
      onCreateCustomValue: async (val: string) => {
        try {
          const { createSpecialization } = await import("@/services/industry.services");
          await createSpecialization(val);
        } catch (err) {
          console.error("Failed to create specialization:", err);
          throw err;
        }
      }
    },
    {
      name: "operating_hours",
      label: "Operating Hours",
      type: "custom",
      colSpan: 2,
      customRender: (formData: any, onChange: any) => (
        <OperatingHoursTable
          value={formData.operating_hours || []}
          onChange={onChange}
        />
      )
    },
    {
      name: "location",
      label: "Business Location",
      type: "custom",
      colSpan: 2,
      customRender: (formData: any, onChange: any) => {
        const { LocationPicker } = require("@/components/dashboards/shared/LocationPicker");
        return (
          <LocationPicker
            value={formData.location || {
              address_line_1: formData.address_line_1 || "",
              address_line_2: formData.address_line_2 || "",
              pincode: formData.pincode || "",
              latitude: formData.latitude,
              longitude: formData.longitude,
              map_link: formData.map_link
            }}
            onChange={onChange}
          />
        );
      }
    },
  );

  // Add referral code + performance graph if available
  const refCode = (industryData as any)?.user_details?.referal_code || (industryData as any)?.referal_code;
  if (refCode) {
    industryFields.push({
      name: "referral_section",
      label: "Referral Performance",
      type: "custom",
      colSpan: 2,
      customRender: () => <ReferralSectionField role="industry" referralCode={refCode} />
    });
  }

  return (
    <RoleBannerWidget
      role="industry"
      customData={{
        title: capitalize(industryData?.company_name || ""),
        subtitle: subtitle,
        metrics: customMetrics,
        rawIndustryData: industryData,
        onUpdateSuccess: async () => {
          await refreshIndustryData();
          if (industryData?.company_name) {
            await fetchBannerMetrics(industryData.company_name);
          }
        },
        fields: industryFields
      }}
    />
  );
}
