"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Menu, Search, LogOut, CreditCard, ChevronRight, Pen, Mail, Building2, Phone, Globe, MapPin, CheckCircle2, FileText, Target, Clock, Linkedin, Instagram, Map } from "lucide-react";
import { getStudentByEmail } from "@/services/student.services";
import { getIndustryByEmail } from "@/services/industry.services";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

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

  const getAddress = (d: any) => {
    if (d.location && d.location.address_line_1) {
      const { address_line_1, address_line_2, pincode } = d.location;
      return [address_line_1, address_line_2, pincode].filter(Boolean).join(", ");
    }
    const parts = [];
    if (d.city) parts.push(d.city);
    if (d.tahsil && d.tahsil !== d.city) parts.push(d.tahsil);
    if (d.district) parts.push(d.district);
    if (d.state) parts.push(d.state);
    if (d.country) parts.push(d.country);
    return parts.length > 0 ? parts.join(", ") : "Address not provided";
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className="absolute top-0 right-full mr-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden cursor-default z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center items-center h-48">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </motion.div>
    );
  }

  if (role === 'industry' && data) {
    const contactPhone = data.contact_details && data.contact_details.length > 0 ? data.contact_details[0].contact_no : null;
    const contactEmail = data.contact_details && data.contact_details.length > 0 && data.contact_details[0].email ? data.contact_details[0].email : currentUser;

    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className="absolute top-0 right-full mr-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden cursor-default z-50 max-h-[85vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Profile Section */}
        <div className="p-4 border-b border-slate-100 flex gap-4 items-start">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-sm flex-shrink-0">
            {data.company_name ? data.company_name.charAt(0).toUpperCase() : "I"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified Business
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 truncate" title={data.company_name}>
              {data.company_name || "Company Name"}
            </h2>
            <p className="text-sm text-slate-500 truncate mt-0.5" title={data.industry_sector || data.business_type}>
              {data.industry_sector || data.business_type || "Industry Sector"}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* ABOUT */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-900 mb-3 tracking-widest uppercase">About</h3>
            
            {(data.about || data.about_company) && (
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-900">Description: </span>
                  {data.about || data.about_company}
                </div>
              </div>
            )}
            
            {data.specializations && data.specializations.length > 0 ? (
              <div className="flex items-start gap-3">
                <Target className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-900 mb-2 block">Specialisations</span>
                  <div className="flex flex-wrap gap-2">
                    {data.specializations.map((s: any, idx: number) => (
                      <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium">
                        {s.specialization || s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : data.job_function && data.job_function.length > 0 ? (
              <div className="flex items-start gap-3">
                <Target className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-900 mb-2 block">Specialisations</span>
                  <div className="flex flex-wrap gap-2">
                    {data.job_function.map((jf: any, idx: number) => (
                      <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium">
                        {jf.job_function || jf}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* METRICS */}
          <div className="border-t border-slate-100 pt-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company Size</p>
              <p className="text-sm font-bold text-slate-700">{data.employee_head_count || "Not set"} Employees</p>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-900 mb-3 tracking-widest uppercase border-t border-slate-100 pt-3">Contact</h3>
            <div className="space-y-3">
              {(contactPhone || data.mobile_no) && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{contactPhone || data.mobile_no}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <a href={`mailto:${contactEmail}`} className="text-blue-600 font-medium hover:underline truncate">{contactEmail}</a>
              </div>
              {data.company_website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href={data.company_website.startsWith('http') ? data.company_website : `https://${data.company_website}`} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline truncate">
                    {data.company_website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-900 mb-3 tracking-widest uppercase border-t border-slate-100 pt-3">Location</h3>
            <div className="flex items-start gap-3 text-sm mb-4">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <span className="text-slate-700 font-medium leading-relaxed block">{getAddress(data)}</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getAddress(data))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 text-blue-600 rounded-md hover:bg-slate-200 transition-colors text-xs font-semibold shadow-sm"
                >
                  <Map className="w-3.5 h-3.5" /> View on map
                </a>
              </div>
            </div>
          </div>

          {/* OPERATING HOURS */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-900 mb-3 tracking-widest uppercase border-t border-slate-100 pt-3">Operating Hours</h3>
            <div className="flex items-start gap-3 text-sm">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                {data.operating_hours && data.operating_hours.length > 0 ? (
                  data.operating_hours.map((oh: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-medium flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${oh.is_closed ? 'bg-red-400' : 'bg-emerald-400'}`}></span> {oh.day}
                      </span>
                      <span className={`font-semibold ${oh.is_closed ? 'text-red-500' : 'text-slate-800'}`}>
                        {oh.is_closed ? 'Closed' : `${oh.opening_time} - ${oh.closing_time}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* SOCIAL MEDIA */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-900 mb-3 tracking-widest uppercase border-t border-slate-100 pt-3">Social Media</h3>
            <div className="space-y-3">
              {(data.linkedin || data.instagram) ? (
                <>
                  {data.linkedin && (
                    <div className="flex items-center gap-3 text-sm">
                      <Linkedin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-500 font-medium w-20">LinkedIn: </span>
                      <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline truncate flex-1">
                        {data.linkedin.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {data.instagram && (
                    <div className="flex items-center gap-3 text-sm">
                      <Instagram className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-500 font-medium w-20">Instagram: </span>
                      <a href={data.instagram.startsWith('http') ? data.instagram : `https://${data.instagram}`} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline truncate flex-1">
                        {data.instagram.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500 italic">Not provided</p>
              )}
            </div>
          </div>
        </div>

        {/* EDIT PROFILE BUTTON */}
        <div className="p-4 pt-0 border-t border-slate-100 bg-white sticky bottom-0 z-10">
          <div className="pt-3">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-update-profile'));
                onClose();
              }}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              <Pen className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

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

          {(!data || role !== 'student') && (
             <p className="text-xs text-slate-500 italic">Basic profile details shown.</p>
          )}
        </div>

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
        <NotificationDropdown module={role.charAt(0).toUpperCase() + role.slice(1)} />

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
