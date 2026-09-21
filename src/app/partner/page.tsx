"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, Building2, User, Mail, Phone, Briefcase, MapPin, Users, Copy, CheckCircle2, TrendingUp } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { BASE_URL } from "@/services/api.services";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

interface PartnerData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  organisation: string;
  job_title: string;
  company_size: string | number;
  partner_type?: string;
  country?: string;
  state: string;
  referal_code?: string;
}

interface ReferralData {
  success: boolean;
  referral_code: string;
  referrer: string;
  referrer_name: string;
  counts: {
    Student: number;
    College: number;
    Mentor: number;
    Industry: number;
  };
  total: number;
}

export default function PartnerPage() {
  const { currentUser, logout, isAuthenticated, isInitialized, role } = useAuth();
  const router = useRouter();
  
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || role !== "partner")) {
      router.push("/login");
    }
  }, [isAuthenticated, role, isInitialized, router]);

  useEffect(() => {
    if (currentUser && role === "partner") {
      fetchPartnerData();
    }
  }, [currentUser, role]);

  const fetchPartnerData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await axios.get(`${BASE_URL}method/stridenex_app.stridenex_app.doctype.stridenex_partner.stridenex_partner.get_partner`, {
        params: { email: currentUser }
      });
      
      if (res.data && res.data.message?.status === "success" && res.data.message?.data?.partner) {
        const pData = res.data.message.data.partner;
        const refCode = res.data.message.data.user?.referal_code;
        
        setPartnerData({ ...pData, referal_code: refCode });
        
        if (refCode) {
          await fetchReferralStats(refCode);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Failed to fetch partner data", err);
      setError("Failed to load partner details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralStats = async (code: string) => {
    try {
      // Assuming it's a POST request since it has a JSON body in the requirement
      const res = await axios.post(`${BASE_URL}method/stridenex_app.stridenex_app.doctype.referal_details.referal_details.get_referral_module_count`, {
        referral_code: code
      });
      if (res.data && res.data.data) {
        setReferralData(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch referral stats", e);
    }
  };

  const handleLogout = () => {
    logout("/login");
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const copyToClipboard = () => {
    if (partnerData?.referal_code) {
      navigator.clipboard.writeText(partnerData.referal_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading partner details...</p>
        </div>
      </div>
    );
  }

  const chartData = referralData ? [
    { name: 'Students', value: referralData.counts.Student, color: '#3b82f6' }, // Blue
    { name: 'Colleges', value: referralData.counts.College, color: '#8b5cf6' }, // Purple
    { name: 'Mentors', value: referralData.counts.Mentor, color: '#f59e0b' }, // Amber
    { name: 'Industries', value: referralData.counts.Industry, color: '#10b981' }, // Emerald
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="StrideNex Logo"
              width={140}
              height={40}
              className="object-contain"
            />
            <span className="hidden sm:inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded uppercase tracking-wider ml-4 border border-blue-100">
              Partner Portal
            </span>
          </div>
          <button
            onClick={confirmLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Welcome back, {partnerData?.first_name || 'Partner'}
            </h1>
            <p className="text-slate-500 text-lg">
              Manage your partner profile and organizational details.
            </p>
          </div>
          
          {/* Referral Code Prominent Display */}
          {partnerData?.referal_code && (
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm shadow-blue-100 flex items-center gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Referral Code</p>
                <p className="text-2xl font-black text-blue-600 tracking-widest">{partnerData.referal_code}</p>
              </div>
              <button 
                onClick={copyToClipboard}
                className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shrink-0 border border-blue-100"
                title="Copy Code"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 animate-in zoom-in-95">
            {error}
          </div>
        ) : partnerData ? (
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              {/* Cover / Top Section */}
              <div className="h-24 bg-gradient-to-r from-blue-600 to-sky-400 relative"></div>
              
              <div className="px-6 sm:px-10 pb-10 relative">
                {/* Avatar Profile */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 uppercase -mt-10 sm:-mt-14 mb-6">
                  {partnerData.first_name?.[0]}{partnerData.last_name?.[0]}
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
                      Personal Information
                    </h3>
                    
                    <div className="space-y-5">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide">Full Name</p>
                          <p className="text-slate-900 font-medium">{partnerData.first_name} {partnerData.last_name}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide">Email Address</p>
                          <p className="text-slate-900 font-medium">{partnerData.email}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide">Phone Number</p>
                          <p className="text-slate-900 font-medium">{partnerData.phone_number}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
                      Professional Information
                    </h3>
                    
                    <div className="space-y-5">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide">Organization</p>
                          <p className="text-slate-900 font-medium">{partnerData.organisation}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide">Job Title & Type</p>
                          <p className="text-slate-900 font-medium">
                            {partnerData.job_title} 
                            {partnerData.partner_type && <span className="text-slate-400 font-normal ml-1">({partnerData.partner_type})</span>}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide">Company Size</p>
                          <p className="text-slate-900 font-medium">{partnerData.company_size || "Not specified"}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide">Location</p>
                          <p className="text-slate-900 font-medium">
                            {partnerData.state}{partnerData.country ? `, ${partnerData.country}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Stats Section */}
            {referralData && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Referral Performance</h2>
                </div>
                
                <div className="p-6 sm:p-10">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Summary Total */}
                    <div className="md:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col justify-center shadow-lg">
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Signups</p>
                      <h3 className="text-6xl font-black mb-4">{referralData.total}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Total users who have successfully registered using your referral code 
                        <span className="font-bold text-white ml-1">"{referralData.referral_code}"</span>.
                      </p>
                    </div>

                    {/* Chart Area */}
                    <div className="md:col-span-2 h-[300px]">
                      {referralData.total > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#64748b', fontSize: 12 }} 
                            />
                            <RechartsTooltip 
                              cursor={{ fill: '#f1f5f9' }}
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-slate-600 font-medium mb-1">No referrals yet</p>
                          <p className="text-slate-400 text-sm">Share your code to start seeing statistics here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sign Out</h3>
              <p className="text-slate-500 text-sm">
                Are you sure you want to sign out of your partner account?
              </p>
            </div>
            <div className="p-4 flex items-center gap-3 border-t border-slate-100">
              <button
                onClick={cancelLogout}
                className="flex-1 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 text-sm font-medium text-white hover:bg-red-700 bg-red-600 rounded-xl transition-colors shadow-sm"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
