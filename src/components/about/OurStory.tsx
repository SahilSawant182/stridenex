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
    <>
    <SectionWrapper bgColor="hero-image" spacing="default" className="overflow-hidden min-h-[85vh] flex items-center">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto px-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-4">
            Our Story
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-normal leading-tight mt-4">
            It started with a gap we could not ignore.
          </h2>
          <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-4xl mx-auto mt-6">
            StrideNEX was not born in a boardroom with a business plan. It started with a simple observation while working closely with colleges, students and industries.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
    <SectionWrapper bgColor="slate" spacing="default" className="overflow-hidden pt-24 pb-32">
      <div className="max-w-6xl mx-auto space-y-32">
        
        {/* Block 1: The Gap */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden"
          >
            {/* abstract background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg mb-8">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-6 leading-tight">
                  Qualifications weren't always translating into readiness.
                </h3>
                <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                  <p>
                    We saw the same challenge: students graduating with degrees, but not adequately prepared for the skills and realities of the industry.
                  </p>
                  <p>
                    Industries sought talent that could contribute from day one—people with practical skills, awareness, and the right mindset.
                  </p>
                  <p className="font-bold text-white text-xl">
                    There was a gap between the two. That became the beginning of StrideNEX.
                  </p>
                </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-700 text-sm font-bold uppercase tracking-[0.2em] mb-2">
              The Questions
            </div>
            {questions.map((question, index) => (
              <div
                key={question}
                className="group flex gap-5 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="mt-1 w-10 h-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <p className="text-lg font-bold text-slate-800 leading-snug">
                  {question}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Block 2: Platform Vision */}
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 space-y-8"
          >
            <div>
                <span className="text-accent font-bold text-sm uppercase tracking-[0.25em]">
                  From observation to platform
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 mb-6 leading-tight">
                  More than just training or another job portal.
                </h3>
            </div>
            
            <div className="space-y-6">
                <div className="flex gap-5 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-xl">For Students</h4>
                        <p className="text-slate-600 mt-2 text-lg">Exposure, skills, guidance, mentoring, and a clear understanding of workplace expectations.</p>
                    </div>
                </div>
                <div className="flex gap-5 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
                        <Handshake className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-xl">For Industries</h4>
                        <p className="text-slate-600 mt-2 text-lg">Access to students early enough to identify talent and shape industry-relevant capabilities.</p>
                    </div>
                </div>
                <div className="flex gap-5 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-xl">For Colleges</h4>
                        <p className="text-slate-600 mt-2 text-lg">Stronger connections with the industries their students will eventually enter.</p>
                    </div>
                </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 rounded-3xl bg-slate-50 border border-slate-200 p-8 md:p-12 text-slate-900 shadow-xl relative overflow-hidden"
          >
            {/* abstract bg */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

            <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-black mb-10">Our vision for this academic year</h3>
                <div className="space-y-4 mb-10">
                  {visionStats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white border border-slate-100 p-6 flex items-center justify-between shadow-sm">
                      <div className="text-slate-600 font-medium text-lg">{stat.label}</div>
                      <div className="text-3xl font-black text-primary">{stat.value}</div>
                    </div>
                  ))}
                </div>
                <p className="text-slate-700 text-xl leading-relaxed font-medium bg-white/60 p-5 rounded-2xl backdrop-blur-md border border-slate-100">
                  Numbers are only the beginning. We're creating an ecosystem where students continuously learn, explore, and make informed career decisions.
                </p>
            </div>
          </motion.div>
        </div>

        {/* Block 3: Building the bridge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">
                Building the Bridge
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 mt-2 mb-6">
                Industry readiness belongs to the ecosystem.
              </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Over the next 2-3 years, we want students entering the StrideNEX ecosystem today to become significantly more industry-ready when they graduate.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {bridgeItems.map((item, i) => {
              const colors = ['text-blue-600 bg-blue-50', 'text-emerald-600 bg-emerald-50', 'text-indigo-600 bg-indigo-50', 'text-purple-600 bg-purple-50', 'text-pink-600 bg-pink-50'];
              return (
              <div key={item.title} className="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${colors[i % colors.length]} flex items-center justify-center mb-5`}>
                    <item.icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                <p className="text-sm text-slate-500 mt-2 font-medium">{item.description}</p>
              </div>
            )})}
          </div>

          <div className="mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-10 shadow-2xl">
            <p className="text-2xl md:text-3xl font-black text-white">
              StrideNEX exists to build that bridge.
            </p>
            <div className="flex items-center gap-3 text-accent font-black text-lg bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm border border-white/10">
              Bridging Students. Industry. Skills.
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

      </div>
    </SectionWrapper>
    </>
  );
}
