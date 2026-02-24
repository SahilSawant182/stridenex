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
            To create a globally connected talent ecosystem where education naturally evolves into employability, innovation, and lifelong professional growth.
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
            To empower students with clarity, capability, and confidence by aligning learning pathways with real-world opportunities through collaboration between institutions and industry.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}