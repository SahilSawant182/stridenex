"use client";

import { Suspense } from "react";
import IndustryOnboarding from "@/components/onboarding/IndustryOnboarding";
import { OnboardingData } from "@/types/onboarding.types";

function IndustryOnboardingContent() {
  const { useAuth } = require("@/context/AuthContext");
  const { useRouter, useSearchParams } = require("next/navigation");

  const { isAuthenticated, apiKey, apiSecret } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isMobileSource = searchParams.get("source") === "mobile";

  const handleSubmit = async (data: OnboardingData) => {
    try {
      const response = await fetch("/api/onboarding/industry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${apiKey}:${apiSecret}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        localStorage.setItem("onboardingCompleted", "true");
        localStorage.setItem("userType", "industry");

        if (isMobileSource) {
          window.location.href = "stridenex://login";
        } else {
          router.push("/industry/dashboard");
        }
      } else {
        console.error("Failed to save onboarding data");
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  return <IndustryOnboarding onSubmit={handleSubmit} />;
}

export default function IndustryOnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IndustryOnboardingContent />
    </Suspense>
  );
}