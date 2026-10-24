import ManagementHeroSection from "./ManagementHeroSection";
import ManagementOpportunitySection from "./ManagementOpportunitySection";
import ManagementPillarsSection from "./ManagementPillarsSection";
import ManagementJourneySection from "./ManagementJourneySection";
import ManagementProcessSection from "./ManagementProcessSection";
import ManagementOutcomesSection from "./ManagementOutcomesSection";
import ManagementTracksSection from "./ManagementTracksSection";
import ManagementComparisonSection from "./ManagementComparisonSection";
import ManagementWhyNowSection from "./ManagementWhyNowSection";
import ManagementFaqSection from "./ManagementFaqSection";
import ManagementFinalCtaSection from "./ManagementFinalCtaSection";

const pageUrl = "https://stridenex.ai/students/management-careers/";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Management Careers in Product and Operations | StrideNex",
  description:
    "Explore product, operations, strategy, sales, and finance careers. Build teams, lead functions, and help growing companies deliver results.",
  url: pageUrl,
  provider: {
    "@type": "Organization",
    name: "StrideNex",
  },
  keywords: [
    "management careers",
    "product management",
    "operations",
    "strategy",
    "leadership roles",
    "scale companies",
    "startup management",
  ],
};

export default function ManagementCareersPage() {
  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ManagementHeroSection />
      <ManagementOpportunitySection />
      <ManagementPillarsSection />
      <ManagementJourneySection />
      <ManagementProcessSection />
      <ManagementOutcomesSection />
      <ManagementTracksSection />
      <ManagementComparisonSection />
      <ManagementWhyNowSection />
      <ManagementFaqSection />
      <ManagementFinalCtaSection />
    </div>
  );
}
