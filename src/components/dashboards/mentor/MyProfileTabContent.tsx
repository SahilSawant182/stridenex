"use client";

import { motion } from "framer-motion";
import { 
  Pencil, 
  Shield, 
  CheckCircle,
  Eye
} from "lucide-react";

export default function MyProfileTabContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Edit Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 space-y-4"
      >
        <div className="flex justify-between items-center mb-2 px-1">
          <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
            <Pencil className="w-4 h-4 text-orange-500" /> Edit Profile
          </h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Edit Profile
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-2xl shrink-0 mt-1 relative">
              KR
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">✨</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-800">Kavya Reddy</h2>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <Shield className="w-3 h-3 text-blue-600" /> Verified Mentor
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-3">Senior Data Scientist @ Amazon • 7 years exp</p>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-md border border-orange-100">ML</span>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md border border-green-100">Python</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-100">Career</span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100">Interview Prep</span>
              </div>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                Display Name
              </label>
              <input 
                type="text" 
                defaultValue="Kavya Reddy"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-700 font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                Current Role
              </label>
              <input 
                type="text" 
                defaultValue="Senior Data Scientist @ Amazon"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-700 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                Years of Experience
              </label>
              <input 
                type="text" 
                defaultValue="7"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-700 font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                LinkedIn URL
              </label>
              <input 
                type="text" 
                defaultValue="linkedin.com/in/kavyareddy"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-700 font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                GitHub
              </label>
              <input 
                type="text" 
                defaultValue="github.com/kavyareddy"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-700 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                Bio
              </label>
              <textarea 
                rows={3}
                defaultValue="7+ years in ML & data science at Amazon, Flipkart, and Razorpay. I mentor students on ML careers, Python, and interview prep for product + data science roles at top companies."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-700 font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                Hourly Rate (₹)
              </label>
              <input 
                type="text" 
                defaultValue="1200"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-700 font-medium"
              />
            </div>
          </form>
        </div>
      </motion.div>

      {/* Right Column - Status & Preview */}
      <div className="space-y-6">
        {/* Verification Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" /> Verification Status
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-blue-500 fill-blue-50" />
              </div>
              <h3 className="text-xl font-bold text-blue-600">Verified Mentor</h3>
              <p className="text-xs text-slate-400">Verified on Jan 15, 2025</p>
            </div>

            <div className="space-y-4">
              {[
                "Identity Verified",
                "LinkedIn Matched",
                "Employment Verified",
                "Background Check",
                "4.8+ Rating Maintained",
                "Recent Profile Edit"
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 bg-emerald-50 rounded-full" />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Student-Facing Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-600" /> Student-Facing Public Profile
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
              This is how students see your profile card:
            </p>

            <div className="border border-slate-200 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  KR
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="font-bold text-slate-800 text-lg">Kavya Reddy</h4>
                    <span className="flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      <Shield className="w-2.5 h-2.5 text-blue-600" /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">Senior Data Scientist @ Amazon</p>
                </div>
              </div>

              <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-lg mb-4 border border-slate-100">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5 uppercase">Rating</p>
                  <p className="font-bold text-slate-800 text-sm flex items-center justify-center gap-1">
                    <span className="text-amber-500 text-sm">⭐</span> 4.9
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5 uppercase">Sessions</p>
                  <p className="font-bold text-slate-800 text-sm">120</p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5 uppercase">Per hr</p>
                  <p className="font-bold text-slate-800 text-sm">₹1,200</p>
                </div>
              </div>
              
              <button className="w-full py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                Book Session
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
