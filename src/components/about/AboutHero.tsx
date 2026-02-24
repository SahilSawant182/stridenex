"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

export default function AboutHero() {
  return (
    <SectionWrapper bgColor="gradient" spacing="default" className="relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0f0fbd 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      <div className="relative z-10">
        <SectionHeader
          title={
            <>
              Advancing Career-Focused <span className="text-accent">Skill Development</span>
            </>
          }
          subtitle="StrideNex is a next-generation career development ecosystem designed to align education with real industry expectations."
          alignment="center"
          titleClassName="text-slate-900"
        />
        
        <p className="text-lg text-slate-500 max-w-3xl mx-auto text-center mt-4">
          Our platform connects students, academic institutions, mentors, and industry partners to create structured pathways that transform learning into measurable outcomes.
        </p>
        
        <div className="mt-10 text-center">
          <Button variant="accent" size="lg" className="btn-cta">
            Explore Our Ecosystem
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}