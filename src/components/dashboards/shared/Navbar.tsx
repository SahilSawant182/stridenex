"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Bell, Menu, Search, LogOut, CreditCard, ChevronRight, Pen, Mail, Building2, Phone, Globe } from "lucide-react";
import { getStudentByEmail } from "@/services/student.services";
import { getIndustryByEmail } from "@/services/industry.services";

function ProfileDetailsPopover({ role, currentUser, fullName, config, onClose }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        if (role === 'student') {
          const res = await getStudentByEmail(currentUser);
          setData(res?.data || res?.message?.data || res?.message);
        } else if (role === 'industry') {
          const res = await getIndustryByEmail(currentUser);
          setData(res?.data || res?.message?.data || res?.message);
        }
      } catch (err) {
        console.error("Failed to fetch profile details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [role, currentUser]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="absolute top-0 right-full mr-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden cursor-default z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <h3 className="font-semibold text-lg">{fullName || currentUser}</h3>
        <p className="text-blue-100 text-sm">{config.roleName}</p>
      </div>
      
      <div className="p-4 space-y-3 text-slate-800">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">Email</p>
                <p className="font-medium break-all">{currentUser}</p>
              </div>
            </div>
            
            {role === 'student' && data && (
              <>
                {(data.college || data.department) && (
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Education</p>
                      <p className="font-medium">{data.college}</p>
                      <p className="text-slate-600 text-xs mt-0.5">{data.course} {data.department ? `• ${data.department}` : ''}</p>
                    </div>
                  </div>
                )}
                {data.mobile_no && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                      <p className="font-medium">{data.mobile_no}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {role === 'industry' && data && (
              <>
                {data.company_name && (
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Company</p>
                      <p className="font-medium">{data.company_name}</p>
                      {data.industry_sector && <p className="text-slate-600 text-xs mt-0.5">{data.industry_sector}</p>}
                    </div>
                  </div>
                )}
                {data.company_website && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Website</p>
                      <a href={data.company_website} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline">{data.company_website}</a>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {(!data || (role !== 'student' && role !== 'industry')) && (
               <p className="text-xs text-slate-500 italic">Basic profile details shown.</p>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 mt-4">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-update-profile'));
              onClose();
            }}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Pen className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardConfig, type DashboardRole } from "@/config/dashboardNavigation";

interface NavbarProps {
  role: DashboardRole;
}

export default function Navbar({ role }: NavbarProps) {
  const { currentUser, fullName, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfileBox, setShowProfileBox] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
        setShowProfileBox(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [userMenuOpen]);

  const config = dashboardConfig[role];
  const displayName = fullName || currentUser?.split('@')[0] || config?.roleName || "User";

  if (!config) return null;



  const getPlansPath = () => {
    switch (role) {
      case "student": return "/student/dashboard/plans";
      case "college": return "/college/dashboard/plans";
      case "mentor": return "/mentor/dashboard/plans";
      case "industry": return "/industry/dashboard/plan";
      default: return "#";
    }
  };

  return (
    <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={config.searchPlaceholder}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          {role === 'student' && (
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                role === 'student' ? 'bg-gradient-to-tr from-accent to-orange-500' :
                role === 'college' ? 'bg-green-600' :
                role === 'mentor' ? 'bg-violet-600' :
                'bg-purple-600' // industry
              }`}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              {displayName}
            </span>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50"
              >
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{currentUser}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileBox(!showProfileBox);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${showProfileBox ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${showProfileBox ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showProfileBox && (
                      <ProfileDetailsPopover
                        role={role}
                        currentUser={currentUser}
                        fullName={fullName}
                        config={config}
                        onClose={() => {
                          setShowProfileBox(false);
                          setUserMenuOpen(false);
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <Link 
                    href={getPlansPath()}
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" /> Plans
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
