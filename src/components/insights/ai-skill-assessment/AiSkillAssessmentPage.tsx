import AssessmentStepsSection from "./AssessmentStepsSection";
import AudienceSection from "./AudienceSection";
import CapabilitySection from "./CapabilitySection";
import ComparisonSection from "./ComparisonSection";
import FaqSection from "./FaqSection";
import FinalCtaSection from "./FinalCtaSection";
import FutureOfHiringSection from "./FutureOfHiringSection";
import HiringOutcomesSection from "./HiringEvidenceSection";
import HeroSection from "./HeroSection";
import InsightsCalloutSection from "./InsightsCalloutSection";
import ProblemSection from "./ProblemSection";
import RelatedLinks from "./RelatedLinks";

const pageUrl = "https://stridenex.ai/insights/ai-skill-assessment/";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AI Skill Assessment: Beyond Job Titles",
  description:
    "Why college brands predict opportunity, not capability. How AI assesses actual talent and can help address credential bias in hiring.",
  image: "https://stridenex.ai/images/Logo.png",
  author: {
    "@type": "Organization",
    name: "StrideNex",
  },
  publisher: {
    "@type": "Organization",
    name: "StrideNex",
    logo: {
      "@type": "ImageObject",
      url: "https://stridenex.ai/images/Logo.png",
    },
  },
  datePublished: "2024-09-01",
  mainEntityOfPage: pageUrl,
  url: pageUrl,
  keywords: [
    "AI assessment",
    "hiring",
    "capability assessment",
    "credential bias",
    "talent evaluation",
  ],
};

export default function AiSkillAssessmentPage() {
  return (
    <main className="bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <HeroSection />
      <ProblemSection />
      <CapabilitySection />
      <AssessmentStepsSection />
      <HiringOutcomesSection />
      <ComparisonSection />
      <AudienceSection />
      <FaqSection />
      <FutureOfHiringSection />
      <InsightsCalloutSection />
      <FinalCtaSection />
      <RelatedLinks />
    </main>
  );
}