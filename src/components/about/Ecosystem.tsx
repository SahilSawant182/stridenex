"use client";

import { motion } from "framer-motion";
import { Users, Building2, Briefcase } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const ecosystem = [
  {
    title: "Students",
    description: "Gain direction and confidence",
    icon: Users,
    color: "from-primary to-purple-600",
    stats: "10k+ Active"
  },
  {
    title: "Institutes",
    description: "Enhance academic outcomes",
    icon: Building2,
    color: "from-accent to-orange-600",
    stats: "500+ Partners"
  },
  {
    title: "Industry",
    description: "Access prepared talent",
    icon: Briefcase,
    color: "from-emerald-600 to-emerald-500",
    stats: "200+ Connected"
  }
];

export default function Ecosystem() {
  return (
    <SectionWrapper bgColor="white" spacing="default">
      <SectionHeader
        badge="The Ecosystem"
        title="What We're Building"
        subtitle="StrideNex is not just a platform — it is a collaborative movement toward transforming how careers are built."
        alignment="center"
      />

      <div className="grid md:grid-cols-3 gap-8">
        {ecosystem.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-200 hover:border-accent/20 transition-all"
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
              <item.icon className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-2">{item.stats}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-600">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <p className="text-lg text-slate-600">
          Together, we are shaping a future where learning leads seamlessly to meaningful opportunities.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}