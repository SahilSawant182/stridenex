"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function WhoWeAre() {
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
            Who We Are
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 mb-6">
            Bridging the Gap Between Education and Industry
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            StrideNex is a future-focused career development platform created to bridge the long-standing gap between education and real industry expectations. We believe that true success begins when students gain clarity about their direction and develop practical capabilities aligned with the evolving professional world.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our platform connects students, academic institutions, and industry into one collaborative ecosystem where learning is guided, skills are validated, and outcomes are measurable.
          </p>
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
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Students collaborating"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Subtle decorative element */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10"></div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}