"use client";

import { Heart } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const beliefs = [
  "Every student has potential when guided in the right direction",
  "Skills become valuable only when applied in real environments",
  "Career readiness is a journey, not a single certification",
  "Collaboration between academia and industry creates sustainable talent ecosystems"
];

export default function Philosophy() {
  return (
    <SectionWrapper bgColor="white" spacing="default">
      <SectionHeader
        badge="Our Philosophy"
        title="What We Believe"
        alignment="center"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {beliefs.map((belief, index) => (
          <div
            key={index}
            className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-accent/20 transition-all"
          >
            <Heart className="w-8 h-8 text-accent mb-4" />
            <p className="text-slate-700">{belief}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}