"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

export default function JoinMovement() {
  return (
    <SectionWrapper bgColor="slate" spacing="default">
      <div className="max-w-4xl mx-auto text-center">
        <SectionHeader
          title="Join the StrideNex Movement"
          subtitle="Whether you are a student exploring your future, an institution strengthening outcomes, or an organization seeking capable talent — StrideNex enables growth through collaboration."
          alignment="center"
        />
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button variant="accent" size="lg" className="btn-cta">
            Start as Student
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="btn-outline-cta">
            Partner as Institute
          </Button>
          <Button variant="outline" size="lg" className="btn-outline-cta">
            Collaborate as Industry
          </Button>
        </div>
        
        <p className="text-sm text-slate-500 mt-8">
          Start your journey with StrideNex today.
        </p>
      </div>
    </SectionWrapper>
  );
}