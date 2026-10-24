import ScienceHeroSection from "./ScienceHeroSection";
import ScienceOpportunitySection from "./ScienceOpportunitySection";
import SciencePillarsSection from "./SciencePillarsSection";
import ScienceJourneySection from "./ScienceJourneySection";
import ScienceProcessSection from "./ScienceProcessSection";
import ScienceOutcomesSection from "./ScienceOutcomesSection";
import ScienceTracksSection from "./ScienceTracksSection";
import ScienceComparisonSection from "./ScienceComparisonSection";
import ScienceWhyNowSection from "./ScienceWhyNowSection";
import ScienceFaqSection from "./ScienceFaqSection";
import ScienceFinalCtaSection from "./ScienceFinalCtaSection";

const pageUrl = "https://stridenex.ai/students/science-careers/";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Science and Research Careers in Biotech, AI, and Climate | StrideNex",
  description:
    "Explore applied research careers in biotech, materials science, climate technology, AI, and agriculture—from discovery to real-world impact.",
  url: pageUrl,
  provider: {
    "@type": "Organization",
    name: "StrideNex",
  },
  keywords: [
    "science careers",
    "research careers",
    "biotechnology",
    "materials science",
    "climate technology",
    "AI research",
    "agricultural science",
  ],
};

export default function ScienceCareersPage() {
  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ScienceHeroSection />
      <ScienceOpportunitySection />
      <SciencePillarsSection />
      <ScienceJourneySection />
      <ScienceProcessSection />
      <ScienceOutcomesSection />
      <ScienceTracksSection />
      <ScienceComparisonSection />
      <ScienceWhyNowSection />
      <ScienceFaqSection />
      <ScienceFinalCtaSection />
    </div>
  );
}
