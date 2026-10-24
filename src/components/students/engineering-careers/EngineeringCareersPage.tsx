import EngineeringHeroSection from "./EngineeringHeroSection";
import EngineeringOpportunitySection from "./EngineeringOpportunitySection";
import EngineeringPillarsSection from "./EngineeringPillarsSection";
import EngineeringJourneySection from "./EngineeringJourneySection";
import EngineeringProcessSection from "./EngineeringProcessSection";
import EngineeringOutcomesSection from "./EngineeringOutcomesSection";
import EngineeringTracksSection from "./EngineeringTracksSection";
import EngineeringComparisonSection from "./EngineeringComparisonSection";
import EngineeringWhyNowSection from "./EngineeringWhyNowSection";
import EngineeringFaqSection from "./EngineeringFaqSection";
import EngineeringFinalCtaSection from "./EngineeringFinalCtaSection";

const pageUrl = "https://stridenex.ai/students/engineering-careers/";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Engineering Careers in Technology and Industry | StrideNex",
  description:
    "Explore software, electronics, manufacturing, civil technology, and emerging engineering careers. Find roles where your skills solve real problems.",
  url: pageUrl,
  provider: {
    "@type": "Organization",
    name: "StrideNex",
  },
  keywords: [
    "engineering careers",
    "mechanical engineering",
    "electronics",
    "computer science",
    "civil engineering",
    "technical leadership",
  ],
};

export default function EngineeringCareersPage() {
  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <EngineeringHeroSection />
      <EngineeringOpportunitySection />
      <EngineeringPillarsSection />
      <EngineeringJourneySection />
      <EngineeringProcessSection />
      <EngineeringOutcomesSection />
      <EngineeringTracksSection />
      <EngineeringComparisonSection />
      <EngineeringWhyNowSection />
      <EngineeringFaqSection />
      <EngineeringFinalCtaSection />
    </div>
  );
}
