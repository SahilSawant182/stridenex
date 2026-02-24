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
      <SectionHeader
        badge="Our Origin"
        title="Why StrideNex Was Created"
        subtitle="Across education systems, students invest years in learning yet often struggle to translate knowledge into career confidence. Organizations seek capable talent, institutions aim for stronger outcomes, and students look for direction — but these three ecosystems traditionally operate in isolation."
        alignment="center"
      />

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<item.icon className="w-8 h-8 text-white" />}
              iconBgColor={item.color}
              title={item.title}
              description={item.description}
              className="text-center"
              hoverEffect="lift"
            />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center text-lg text-slate-600 mt-12 max-w-3xl mx-auto"
      >
        StrideNex was built to bring them together. By integrating structured evaluation, guided development, and industry participation, we enable learners to move from uncertainty to purposeful growth.
      </motion.p>
    </SectionWrapper>
  );
}