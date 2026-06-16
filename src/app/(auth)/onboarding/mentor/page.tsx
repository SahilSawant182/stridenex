"use client";

import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import MentorOnboarding from "@/components/onboarding/MentorOnboarding";
import { OnboardingData } from "@/types/onboarding.types";

function MentorOnboardingContent() {
  const { isAuthenticated, apiKey, apiSecret } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isMobileSource = searchParams.get("source") === "mobile";

  const handleSubmit = async (data: OnboardingData) => {
    try {
      const response = await fetch("/api/onboarding/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${apiKey}:${apiSecret}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        localStorage.setItem("onboardingCompleted", "true");
        localStorage.setItem("userType", "mentor");

        if (isMobileSource) {
          window.location.href = "https://testwebstridenex.quantcloud.in/login";
        } else {
          router.push("/mentor/dashboard");
        }
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  return <MentorOnboarding onSubmit={handleSubmit} />;
}

export default function MentorOnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MentorOnboardingContent />
    </Suspense>
  );
}