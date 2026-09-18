"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

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

export default function LeadershipSection() {
  return (
    <>
      <SectionWrapper bgColor="hero-image" spacing="default" className="overflow-hidden min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <SectionHeader
              badge="Leadership"
              badgeColor="white"
              title="Three Founders Three Perspectives One Purpose"
              badgeClassName="text-sm md:text-base tracking-[0.2em]"
              titleClassName="!text-white text-3xl md:text-4xl lg:text-5xl leading-tight"
            />
            <p className="text-slate-200 font-medium text-lg md:text-xl mt-6">
              Different professions and different experiences came together with the same conviction: the transition from college to career should not be left to chance.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="slate" spacing="default" className="overflow-hidden pt-24 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            {founders.map((founder, index) => {
              const gradients = [
                'from-blue-600 to-indigo-600',
                'from-emerald-500 to-teal-600',
                'from-purple-600 to-fuchsia-600'
              ];
              const initials = founder.name.split(' ').map(n => n[0]).join('');

              return (
                <motion.div
                  key={founder.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full"
                >
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-125 z-0"></div>

                  <div className="relative z-10 flex-grow">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center mb-8 shadow-xl transform group-hover:-translate-y-2 transition-transform duration-500`}>
                      <span className="text-3xl font-black text-white">{initials}</span>
                    </div>

                    <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      {founder.name}
                    </h4>
                    <div className="mb-6">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-bold tracking-widest uppercase">
                        {founder.role}
                      </span>
                    </div>
                    <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
                      {founder.description}
                    </p>
                  </div>

                  {/* Bottom decorative line */}
                  <div className={`absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r ${gradients[index]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20`}></div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
