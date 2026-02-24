"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StudentOnboarding from "@/components/onboarding/StudentOnboarding";
import { OnboardingData } from "@/types/onboarding.types";

export default function StudentOnboardingPage() {
  const { isAuthenticated, apiKey, apiSecret } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: OnboardingData) => {
    try {
      // Save student onboarding data
      const response = await fetch("/api/onboarding/student", {
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
        localStorage.setItem("userType", "student");

        router.push("/portal/dashboard");
      } else {
        console.error("Failed to save onboarding data");
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
            Complete Your Profile
          </h1>
          <p className="text-slate-500">
            Tell us more about yourself to personalize your learning journey
          </p>
        </div>
      </div> */}
        <StudentOnboarding onSubmit={handleSubmit} />
    </div>
  );
}