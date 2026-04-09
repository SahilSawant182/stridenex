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
  gst_number: string;
  industry_sector: string;
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
  loading: boolean;
  error: string | null;
  refreshIndustryData: () => Promise<void>;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export const IndustryProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isInitialized } = useAuth();
  const [industryData, setIndustryData] = useState<IndustryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIndustryData = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const response = await getIndustryByEmail(email);
      const apiData = response?.message;

      if (apiData && (apiData.status === 200 || apiData.status === "200")) {
        const data = Array.isArray(apiData.data) ? apiData.data[0] : apiData.data;
        setIndustryData(data || null);
        setError(null);
      } else {
        setError(apiData?.message || "Failed to fetch industry details");
      }
    } catch (err: any) {
      console.error("Error in IndustryProvider:", err);
      setError(err?.message || "An error occurred while fetching company profile details");
    } finally {
      setLoading(false);
    }
  }, []);

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

  return (
    <IndustryContext.Provider
      value={{
        industryData,
        loading,
        error,
        refreshIndustryData,
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
