"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Handshake,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";

const questions = [
  "What if students could understand industry requirements much earlier?",
  "What if industries could engage with students before they graduated?",
  "What if colleges, industries and training institutes could work together?",
];

const founders = [
  {
    name: "Kishor Shendge",
    role: "Managing Director",
    description:
      "An advocate and IP and patent registration consultant, he brought strong connections across colleges and industries, along with a deep understanding of intellectual property and institutional ecosystems.",
  },
  {
    name: "Rakesh Chougule",
    role: "Technology Leader",
    description:
      "A technology professional and founder of Quantbit, he brought extensive experience in web application development and saw how the idea could become a scalable digital platform.",
  },
  {
    name: "Vinayak Patwardhan",
    role: "Mentor & Industry Connector",
    description:
      "An IIT alumnus and energy auditor, he has worked closely with colleges through career consultation and mentoring, while building strong relationships with industries and training institutes.",
  },
];

const visionStats = [
  { value: "1,00,000+", label: "students connected" },
  { value: "1,000+", label: "industries connected" },
  { value: "30+", label: "training institutes" },
];

const bridgeItems = [
  { title: "Students", description: "bring ambition", icon: GraduationCap },
  { title: "Colleges", description: "provide education", icon: Building2 },
  { title: "Industries", description: "provide context and opportunity", icon: Handshake },
  { title: "Mentors", description: "provide direction", icon: Users },
  { title: "Technology", description: "brings everyone together", icon: Lightbulb },
];

export default function OurStory() {
  return (
    <SectionWrapper bgColor="white" spacing="default" className="overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold uppercase tracking-[0.3em] mb-5">
            Our Story
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-normal">
            It started with a gap we could not ignore.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mt-5">
            StrideNEX was not born in a boardroom with a business plan. It started with a simple observation while working closely with colleges, students and industries.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg mb-6">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Qualifications were not always translating into readiness.
            </h3>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                We repeatedly saw the same challenge: students were graduating with qualifications, but many were not adequately prepared for the skills, expectations and realities of the industry.
              </p>
              <p>
                At the same time, industries were looking for talent that could contribute from day one, people with practical skills, industry awareness, the right mindset and an understanding of how the workplace actually functions.
              </p>
              <p className="font-semibold text-slate-800">
                There was a gap between the two. That question became the beginning of StrideNEX.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {questions.map((question, index) => (
              <div
                key={question}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mt-1 w-8 h-8 shrink-0 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-black">
                  {index + 1}
                </div>
                <p className="text-base md:text-lg font-semibold text-slate-800 leading-snug">
                  {question}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
              Three founders. Three perspectives. One purpose.
            </h3>
            <p className="text-slate-600 text-lg">
              Different professions and different experiences came together with the same conviction: the transition from college to career should not be left to chance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center mb-5">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">{founder.name}</h4>
                <p className="text-sm font-bold text-accent mt-1 mb-4">{founder.role}</p>
                <p className="text-slate-600 leading-relaxed">{founder.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold text-sm uppercase tracking-[0.25em]">
              From observation to platform
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-4 mb-5">
              More than training, placements or another job portal.
            </h3>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Students need exposure, skills, guidance, mentoring, industry interaction and a clear understanding of workplace expectations.
              </p>
              <p>
                Industries need access to students early enough to identify talent, engage with future professionals and help shape industry-relevant capabilities.
              </p>
              <p>
                Colleges need stronger connections with the industries their students will eventually enter. Training institutes, mentors and ecosystem partners also have an important role to play.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-br from-primary via-purple-600 to-accent p-6 md:p-8 text-white shadow-xl"
          >
            <h3 className="text-2xl md:text-3xl font-black mb-5">Our vision for this academic year</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {visionStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/10 border border-white/15 p-4">
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-sm text-white/80 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="text-white/90 leading-relaxed">
              Numbers are only the beginning. Our larger ambition is to create an ecosystem where students continuously learn, explore, interact with industry, develop relevant skills and make informed career decisions.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
            <div>
              <span className="text-accent font-bold text-sm uppercase tracking-[0.25em]">
                Building the bridge
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-3">
                Industry readiness belongs to the ecosystem.
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              Over the next 2-3 years, we want students entering the StrideNEX ecosystem today to become significantly more industry-ready when they graduate.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bridgeItems.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-slate-200 p-4">
                <item.icon className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-white border border-slate-200 p-5">
            <p className="text-lg font-bold text-slate-900">
              StrideNEX exists to build that bridge.
            </p>
            <div className="flex items-center gap-2 text-accent font-black">
              Bridging Students. Industry. Skills. Opportunities.
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
