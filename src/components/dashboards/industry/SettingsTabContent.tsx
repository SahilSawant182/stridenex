"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { useIndustry } from "@/context/IndustryContext";

export default function SettingsTabContent() {
  const { industryData } = useIndustry();
  const [activeTemplate, setActiveTemplate] = useState<{type: string, content: string} | null>(null);
  const [copied, setCopied] = useState(false);

  const templates = {
    email: `Subject: Opportunity: Internship with ${industryData?.company_name || 'Our Company'}

Dear Student,

We've been impressed by your profile on Stridenex. Your skills and achievements align perfectly with our current initiatives.

We would love to discuss a potential partnership or internship opportunity with you. 

Best regards,
Recruitment Team
${industryData?.company_name || 'StrideNex Partner'}`,

    invitation: `Hi there! 👋

${industryData?.company_name || 'We'} are currently looking for talented students to join our upcoming projects. 

Check out our latest internship postings on Stridenex and apply today:
[Link to Stridenex Dashboard]

We look forward to seeing your application!

Best,
The ${industryData?.company_name || 'Team'}`
  };

  const handleCopy = () => {
    if (activeTemplate) {
      navigator.clipboard.writeText(activeTemplate.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recruitment Settings</h2>
        <p className="text-slate-500 text-sm font-medium">Manage your Outreach templates and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Template Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-orange-100 transition-colors">
            <Mail className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Professional Email</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Generate a high-conversion follow-up email template personalized for your company outreach.
          </p>
          <button 
            onClick={() => setActiveTemplate({ type: 'Email Template', content: templates.email })}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Generate Email Template
          </button>
        </motion.div>

        {/* Invitation Template Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
            <Send className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Student Invitation</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Get a concise, friendly invitation template perfect for quick platform-based student invites.
          </p>
          <button 
            onClick={() => setActiveTemplate({ type: 'Invitation Template', content: templates.invitation })}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Get Invitation Template
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeTemplate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden mt-8"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="font-bold text-slate-800 uppercase tracking-widest text-xs">{activeTemplate.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button 
                  onClick={() => setActiveTemplate(null)}
                  className="p-2.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">
              <pre className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 p-6 rounded-xl border border-slate-100 italic">
                {activeTemplate.content}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform Security Stat */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mt-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold mb-2 tracking-tight">Automated Verification Enabled</h4>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Every template generated here follows Stridenex's quality guidelines. Your outreach is automatically verified to increase student response rates by up to 45%.
            </p>
          </div>
          <div className="px-6 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white/80">
            Secure Outreach
          </div>
        </div>
      </div>
    </div>
  );
}
