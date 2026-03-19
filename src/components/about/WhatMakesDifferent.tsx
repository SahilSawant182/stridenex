"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";

const differences = [
  "Personalized development journeys instead of generic learning paths",
  "Execution-based exposure rather than theory-only training",
  "Continuous mentorship and feedback",
  "Industry-connected progression from early stages",
  "Measurable skill validation supporting real opportunities"
];

export default function WhatMakesDifferent() {
  return (
    <SectionWrapper bgColor="white" spacing="default">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-accent font-bold text-sm uppercase tracking-[0.3em] bg-accent/10 px-4 py-2 rounded-full">
            What Makes Us Different
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 mb-6">
            Not Another Learning Platform — A Career Development Ecosystem
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Unlike traditional learning platforms focused only on courses, StrideNex focuses on career outcomes.
          </p>
          
          <div className="space-y-4">
            {differences.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1659080925920-1683d25f772a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Innovation and collaboration"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10"></div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}