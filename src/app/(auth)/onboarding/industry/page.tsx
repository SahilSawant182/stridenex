"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OnboardingData } from "@/types/onboarding.types";
import IndustryOnboarding from "@/components/onboarding/IndustryOnboarding";


export default function IndustryOnboardingPage() {
  const { isAuthenticated, apiKey, apiSecret } = useAuth();
  const router = useRouter();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push("/login");
//     }
//   }, [isAuthenticated, router]);

  const handleSubmit = async (data: OnboardingData) => {
    try {
      // Save college onboarding data
      const response = await fetch("/api/onboarding/industry", {
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
        localStorage.setItem("userType", "industry");

        router.push("/industry/dashboard");
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

  return <IndustryOnboarding onSubmit={handleSubmit} />;
}