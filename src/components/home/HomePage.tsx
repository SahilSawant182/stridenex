"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import HeroSection from "./HeroSection";
import JourneySection from "./JourneySection";
import PathwaysSection from "./PathwaysSection";
import HowItWorksSection from "./HowItWorksSection";
import ImpactSection from "./ImpactSection";
import StakeholdersSection from "./StakeholdersSection";
import WhyDifferentSection from "./WhyDifferentSection";
import FinalCTASection from "./FinalCTASection";
import Footer from "../layout/Footer";
import WelcomePopup from "@/components/ui/WelcomePopup";

interface HomePageProps {
  appName?: string;
}

export default function HomePage({ appName = "StrideNex" }: HomePageProps) {
  const { isAuthenticated, currentUser, fullName } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  // Debug logs
  console.log("🔥 HomePage Auth State:", { 
    isAuthenticated, 
    currentUser, 
    fullName,
    showWelcome 
  });

  useEffect(() => {
    // Check if user is authenticated and we haven't shown the popup yet
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    
    console.log("📝 Checking popup conditions:", {
      isAuthenticated,
      hasCurrentUser: !!currentUser,
      hasSeenWelcome,
      fullName
    });
    
    if (isAuthenticated && currentUser && !hasSeenWelcome) {
      console.log("✅ Showing welcome popup for:", currentUser);
      // Show popup after a tiny delay to ensure everything is loaded
      setTimeout(() => {
        setShowWelcome(true);
        sessionStorage.setItem("hasSeenWelcome", "true");
      }, 500);
    }
  }, [isAuthenticated, currentUser, fullName]);

  // Use actual full name if available, otherwise fallback to email username
  const displayName = fullName || (currentUser ? currentUser.split('@')[0] : "User");
  const displayEmail = currentUser || undefined;

  return (
    <>
      <main>
        <HeroSection appName={appName} />
        <JourneySection />
        <PathwaysSection />
        <HowItWorksSection />
        <ImpactSection />
        <StakeholdersSection />
        <WhyDifferentSection />
        <FinalCTASection />
      </main>
      {/* <Footer appName={appName} /> */}

      {/* Welcome Popup */}
      <WelcomePopup
        isOpen={showWelcome}
        onClose={() => {
          console.log("👋 Closing popup");
          setShowWelcome(false);
        }}
        userName={displayName}
        userEmail={displayEmail}
        userType="student"
      />

      {/* Debug button to manually trigger popup */}
      {/* <button
        onClick={() => {
          console.log("🔄 Manual popup trigger");
          setShowWelcome(true);
        }}
        className="fixed bottom-4 right-4 z-50 bg-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
      >
        Show Welcome Popup
      </button> */}
    </>
  );
}