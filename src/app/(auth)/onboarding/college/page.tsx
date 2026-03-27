"use client";

import { Suspense } from "react";
import CollegeOnboarding from "@/components/onboarding/CollegeOnboarding";
import { OnboardingData } from "@/types/onboarding.types";

function CollegeOnboardingContent() {
  const { useAuth } = require("@/context/AuthContext");
  const { useRouter, useSearchParams } = require("next/navigation");

  const { isAuthenticated, apiKey, apiSecret } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isMobileSource = searchParams.get("source") === "mobile";

  const handleSubmit = async (data: OnboardingData) => {
    try {
      const response = await fetch("/api/onboarding/college", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${apiKey}:${apiSecret}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        localStorage.setItem("onboardingCompleted", "true");
        localStorage.setItem("userType", "college");

        if (isMobileSource) {
          window.location.href = "stridenex://login";
        } else {
          router.push("/college/dashboard");
        }
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  return <CollegeOnboarding onSubmit={handleSubmit} />;
}

export default function CollegeOnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollegeOnboardingContent />
    </Suspense>
  );
}