"use client";

import { motion } from "framer-motion";
import { Users, Building2, Briefcase } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/ui/FeatureCard";

const items = [
  {
    title: "Students",
    description: "Gain clarity and direction about their career paths",
    icon: Users,
    color: "from-primary to-purple-600"
  },
  {
    title: "Institutes",
    description: "Achieve stronger placement outcomes",
    icon: Building2,
    color: "from-accent to-orange-600"
  },
  {
    title: "Industry",
    description: "Access capable talent with validated skills",
    icon: Briefcase,
    color: "from-emerald-600 to-emerald-500"
  }
];

export default function WhyCreated() {
  return (
    <SectionWrapper bgColor="slate" spacing="default">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
          Our Origin
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
          Why StrideNex Was Created
        </h2>
        <p className="text-lg text-slate-600 mb-4">
          Across education systems, students invest years in learning yet often struggle to translate knowledge into career confidence. Organizations seek capable talent, institutions aim for stronger outcomes, and students look for direction — but these three ecosystems traditionally operate in isolation.
        </p>
        <p className="text-lg text-slate-600">
          StrideNex was built to bring them together. By integrating structured evaluation, guided development, and industry participation, we enable learners to move from uncertainty to purposeful growth.
        </p>
      </div>

       <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mb-2`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">{item.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}