"use client";

import { motion, Variants } from "framer-motion";
import { 
  Building2, 
  Edit3,
  Monitor,
  Star,
  Globe,
  MapPin,
  Layers,
  Target,
  Users,
  Zap,
  ShieldCheck,
  Factory,
  GraduationCap,
  Plus,
  ArrowUpRight
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.3 } },
};

const skillDomains = [
  {
    id: "engineering",
    title: "Engineering",
    color: "text-blue-600",
    dotBg: "bg-blue-600",
    bg: "bg-blue-50/50",
    borderColor: "border-blue-100",
    openings: 24,
    tags: ["Python", "Go", "React", "Kafka", "Docker", "Kubernetes"],
    roles: "Backend Engineer • Frontend Engineer • ML Engineer"
  },
  {
    id: "datascience",
    title: "Data Science",
    color: "text-purple-600",
    dotBg: "bg-purple-600",
    bg: "bg-purple-50/50",
    borderColor: "border-purple-100",
    openings: 8,
    tags: ["Python", "SQL", "Statistics", "TensorFlow"],
    roles: "Data Scientist • ML Researcher • Analytics"
  },
  {
    id: "product",
    title: "Product",
    color: "text-orange-600",
    dotBg: "bg-orange-600",
    bg: "bg-orange-50/50",
    borderColor: "border-orange-100",
    openings: 5,
    tags: ["Strategy", "SQL", "A/B Testing", "Figma"],
    roles: "Product Manager • Analyst • Growth PM"
  }
];

export default function CompanyProfileTabContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* COMPACT Premium Banner - More Color */}
      <motion.div 
        variants={item} 
        className="bg-[#0f172a] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center p-5 backdrop-blur-xl shrink-0 shadow-2xl group overflow-hidden">
               <div className="w-full h-5 bg-yellow-400 rounded shadow-lg opacity-90 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">Razorpay Technologies Pvt. Ltd.</h1>
                <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                   <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-slate-400 mb-6">
                <span className="flex items-center gap-2 text-blue-400"><Factory className="w-4 h-4" /> Fintech</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="flex items-center gap-2 text-emerald-400"><MapPin className="w-4 h-4" /> Bengaluru</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="flex items-center gap-2 text-indigo-400"><Users className="w-4 h-4" /> 2,000+ Team</span>
              </div>

              {/* Stats Row - High Contrast */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 {[
                   { label: "Open Roles", value: "44", color: "text-blue-400", bg: "bg-blue-500/10" },
                   { label: "Avg CTC", value: "₹18.5L", color: "text-orange-400", bg: "bg-orange-500/10" },
                   { label: "Rating", value: "4.1", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
                   { label: "Hired", value: "247", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                 ].map((stat, idx) => (
                   <div key={idx} className={`${stat.bg} border border-white/10 rounded-2xl px-5 py-3 min-w-[110px] backdrop-blur-sm group hover:bg-white/10 transition-all cursor-default`}>
                      <span className={`text-xl md:text-2xl font-black ${stat.color} block leading-none mb-1 group-hover:scale-105 transition-transform`}>
                        {stat.value}{stat.icon && <stat.icon className="w-4 h-4 inline-block ml-1 mb-1 fill-amber-400" />}
                      </span>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">{stat.label}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
          
          <button className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-3.5 rounded-2xl text-sm font-black transition-all flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 shrink-0">
            <Edit3 className="w-5 h-5" /> Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <BaseCard className="border-slate-200 shadow-sm rounded-3xl">
             <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                   </div>
                   <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Company Overview</h2>
                </div>

                <div className="space-y-8">
                   <div>
                      <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">THE MISSION</h3>
                      <p className="text-base text-slate-700 leading-relaxed font-semibold opacity-90">
                        Razorpay is India's leading payments infrastructure platform, enabling businesses of all sizes to accept, process, and disburse payments. We are building the financial ecosystem for Internet businesses.
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { label: "Industry", value: "Fintech", icon: Layers, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Size", value: "2,000-5,000", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
                        { label: "HQ", value: "Bengaluru, India", icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { label: "Website", value: "razorpay.com", icon: Globe, color: "text-indigo-500", bg: "bg-indigo-50" },
                        { label: "Stage", value: "Series F Unicorn", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                        { label: "CIN", value: "U74999KA2013PTC", icon: ShieldCheck, color: "text-slate-600", bg: "bg-slate-100" },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all group">
                           <div className="flex items-center gap-3 mb-2.5">
                              <div className={`p-2 rounded-xl ${item.bg}`}>
                                 <item.icon className={`w-4 h-4 ${item.color}`} />
                              </div>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.label}</p>
                           </div>
                           <p className="text-sm font-black text-slate-900 truncate pl-1">{item.value}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </BaseCard>

          {/* Skill Domains - Vibrant */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 px-2 mb-2">
                <Target className="w-5 h-5 text-red-500" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Skill Domains We Audit</h2>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {skillDomains.map((domain) => (
                   <motion.div 
                     key={domain.id} 
                     variants={item}
                     className={`${domain.bg} border-2 ${domain.borderColor} rounded-3xl p-8 group hover:bg-white hover:border-slate-200 transition-all cursor-default relative overflow-hidden shadow-sm`}
                   >
                      <div className="flex items-start justify-between relative z-10">
                         <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                               <div className={`w-3 h-3 rounded-full ${domain.dotBg} shadow-lg shadow-black/10`} />
                               <h3 className="text-xl font-black text-slate-900">{domain.title}</h3>
                            </div>
                            
                            <div className="flex flex-wrap gap-2.5 mb-6">
                               {domain.tags.map(tag => (
                                  <span key={tag} className="px-4 py-2 bg-white text-slate-700 text-xs font-black rounded-xl border border-slate-100 shadow-sm hover:border-slate-300 transition-colors">
                                     {tag}
                                  </span>
                               ))}
                            </div>
                            
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider bg-white/50 px-3 py-1 rounded-lg inline-block border border-slate-100">
                               <span className="text-slate-400">ROLES:</span> {domain.roles}
                            </p>
                         </div>

                         <span className={`px-4 py-2 bg-white ${domain.color} text-[10px] font-black rounded-xl border-2 ${domain.borderColor} uppercase tracking-[0.1em] shadow-sm`}>
                            {domain.openings} OPENINGS
                         </span>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <BaseCard className="border-slate-200 rounded-3xl overflow-hidden shadow-sm">
             <CardHeader title="Roles We Offer" />
             <div className="p-8 space-y-6">
                {[
                  { title: "Full-Time", sub: "Min CGPA 7.0", count: 16, icon: Building2, color: "text-blue-500", bg: "bg-blue-50" },
                  { title: "Internship", sub: "All branches", count: 22, icon: Monitor, color: "text-orange-500", bg: "bg-orange-50" },
                  { title: "Research / R&D", sub: "Final Year / PG", count: 4, icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-50" },
                  { title: "Live Projects", sub: "Open to all years", count: 5, icon: Target, color: "text-red-500", bg: "bg-red-50" },
                  { title: "PPO via Internship", sub: "Top 20% interns", count: 6, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                ].map((role, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-default hover:translate-x-1 transition-transform">
                     <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl ${role.bg} flex items-center justify-center shrink-0 border border-transparent shadow-sm group-hover:border-inherit transition-all`}>
                           <role.icon className={`w-6 h-6 ${role.color}`} />
                        </div>
                        <div>
                           <h4 className="text-base font-black text-slate-800 leading-tight">{role.title}</h4>
                           <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">{role.sub}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-xl font-black text-orange-600 leading-none">{role.count}</span>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">OPEN</p>
                     </div>
                  </div>
                ))}
             </div>
          </BaseCard>

          {/* Hiring Pipeline - Larger fonts */}
          <BaseCard className="border-slate-200 rounded-3xl overflow-hidden shadow-sm">
             <CardHeader title="Hiring Pipeline" />
             <div className="p-8 space-y-10 relative">
                <div className="absolute left-[3.15rem] top-16 bottom-16 w-1 bg-slate-50 shadow-inner rounded-full" />
                {[
                  { title: "Online Assessment", sub: "DSA + Aptitude" },
                  { title: "Technical Round 1", sub: "Coding + CS basics" },
                  { title: "Technical Round 2", sub: "System Design" },
                  { title: "Bar Raiser Round", sub: "Culture & Values" },
                  { title: "HR & Offer", sub: "Compensation" },
                ].map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-6 pl-12">
                     <div className="absolute left-[0.25rem] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-xl z-20" />
                     <div>
                        <h4 className="text-sm font-black text-slate-800 leading-none mb-2">{step.title}</h4>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{step.sub}</p>
                     </div>
                  </div>
                ))}
             </div>
          </BaseCard>

          <BaseCard className="border-slate-200 rounded-3xl overflow-hidden shadow-sm bg-gradient-to-br from-slate-50 to-white">
             <CardHeader title="Campus Partners" />
             <div className="p-8">
                <div className="flex flex-wrap gap-2.5 mb-8">
                   {[
                     "IIT Bombay", "IIT Delhi", "NIT Warangal", "VJTI Mumbai", "COEP Pune", "Manipal"
                   ].map(tag => (
                      <span key={tag} className="px-4 py-2 bg-white text-slate-600 text-[11px] font-black rounded-xl border border-slate-100 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm cursor-default">
                         {tag}
                      </span>
                   ))}
                </div>
                <button className="w-full bg-white hover:bg-slate-50 text-slate-900 font-black py-4 rounded-2xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                   <Plus className="w-5 h-5 text-indigo-500" /> Add Corporate Partner
                </button>
             </div>
          </BaseCard>
        </div>
      </div>
    </motion.div>
  );
}
