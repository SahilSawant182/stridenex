"use client";

import { motion } from "framer-motion";
import { Sparkles, Target } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function VisionMission() {
  return (
    <SectionWrapper bgColor="slate" spacing="default">
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
        >
          <Sparkles className="w-12 h-12 text-accent mb-6" />
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            To build a reliable talent ecosystem where industries can consistently find and trust job-ready, future-ready, and entrepreneurial individuals, enabled through structured pathways that align students with real industry needs and drive outcomes in careers, ventures, and higher education.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
        >
          <Target className="w-12 h-12 text-accent mb-6" />
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            For students and industries, StrideNEX builds a reliable talent ecosystem by preparing individuals for jobs, entrepreneurship, and higher education through industry-aligned learning, real-world exposure, and validated skill assessment using artificial intelligence agents.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}