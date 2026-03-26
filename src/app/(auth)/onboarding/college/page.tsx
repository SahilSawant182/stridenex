"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { OnboardingData } from "@/types/onboarding.types";
import CollegeOnboarding from "@/components/onboarding/CollegeOnboarding";

export default function CollegeOnboardingPage() {
  const { isAuthenticated, apiKey, apiSecret } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobileSource = searchParams.get("source") === "mobile";

  //   useEffect(() => {
  //     if (!isAuthenticated) {
  //       router.push("/login");
  //     }
  //   }, [isAuthenticated, router]);

  const handleSubmit = async (data: OnboardingData) => {
    try {
      // Save college onboarding data
      const response = await fetch("/api/onboarding/college", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${apiKey}:${apiSecret}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Mark onboarding as completed
        localStorage.setItem("onboardingCompleted", "true");
        localStorage.setItem("userType", "college");

        if (isMobileSource) {
          window.location.href = "stridenex://login";
        } else {
          router.push("/college/dashboard");
        }
      } else {
        console.error("Failed to save onboarding data");
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  //   if (!isAuthenticated) {
  //     return null;
  //   }

  return <CollegeOnboarding onSubmit={handleSubmit} />;
}