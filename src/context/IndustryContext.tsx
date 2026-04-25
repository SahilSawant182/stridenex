"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getIndustryByEmail } from "@/services/industry.services";
import { useAuth } from "./AuthContext";

export interface IndustryRole {
  name?: string;
  role: string;
  duration: number;
  semester: string;
  description: string | null;
  available_positions: number;
}

export interface HiringRound {
  name?: string;
  round: string;
  based_on: string;
  duration: number;
}

export interface IndustryData {
  company_name: string;
  about: string | null;
  business_type: string;
  other_business_type: string;
  gst_number: string;
  industry_sector: string;
  other_industry_sector: string;
  headquarters: string | null;
  employee_head_count: string;
  cin: string | null;
  turn_over_in_cr: string | number | null;

  company_website: string | null;
  status: string;
  required_roles: IndustryRole[];
  hiring_process: HiringRound[];
}

interface IndustryContextType {
  industryData: IndustryData | null;
  roleList: IndustryRole[];
  loading: boolean;
  roleLoading: boolean;
  error: string | null;
  refreshIndustryData: () => Promise<void>;
  refreshRoleList: () => Promise<void>;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export const IndustryProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isInitialized } = useAuth();
  const [industryData, setIndustryData] = useState<IndustryData | null>(null);
  const [roleList, setRoleList] = useState<IndustryRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [roleLoading, setRoleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoleList = useCallback(async (industryName: string) => {
    try {
      setRoleLoading(true);
      const { getIndustryRoleList } = await import("@/services/industry.services");
      const response = await getIndustryRoleList(industryName);

      // Standardize response handling for empty/blank results
      const apiData = response?.message?.data || response?.data || response?.message || [];
      setRoleList(Array.isArray(apiData) ? apiData : []);
    } catch (err) {
      console.error("Error fetching role list:", err);
    } finally {
      setRoleLoading(false);
    }
  }, []);

  const fetchIndustryData = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const response = await getIndustryByEmail(email);
      const apiData = response?.message;

      if (apiData && (apiData.status === 200 || apiData.status === "200")) {
        const data = Array.isArray(apiData.data) ? apiData.data[0] : apiData.data;
        
        // Standardize keys (e.g., CIN to cin)
        if (data && data.CIN && !data.cin) {
          data.cin = data.CIN;
        }
        
        setIndustryData(data || null);

        setError(null);

        // Fetch separate role list if company name exists
        if (data?.company_name) {
          fetchRoleList(data.company_name);
        }
      } else {
        setError(apiData?.message || "Failed to fetch industry details");
      }
    } catch (err: any) {
      console.error("Error in IndustryProvider:", err);
      setError(err?.message || "An error occurred while fetching company profile details");
    } finally {
      setLoading(false);
    }
  }, [fetchRoleList]);

  useEffect(() => {
    if (isInitialized && currentUser) {
      fetchIndustryData(currentUser);
    } else if (isInitialized && !currentUser) {
      setLoading(false);
    }
  }, [currentUser, isInitialized, fetchIndustryData]);

  const refreshIndustryData = async () => {
    if (currentUser) {
      await fetchIndustryData(currentUser);
    }
  };

  const refreshRoleList = async () => {
    if (industryData?.company_name) {
      await fetchRoleList(industryData.company_name);
    }
  };

  return (
    <IndustryContext.Provider
      value={{
        industryData,
        roleList,
        loading,
        roleLoading,
        error,
        refreshIndustryData,
        refreshRoleList,
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
};

export const useIndustry = () => {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error("useIndustry must be used within an IndustryProvider");
  }
  return context;
};
