// components/dashboard/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { dashboardConfig, type DashboardRole } from "@/config/dashboardNavigation";
import { useAuth } from "@/context/AuthContext";
import { buildProfileImageUrl } from "@/services/api.services";
import { LogOut, Settings, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface SidebarProps {
  role: DashboardRole;
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ role, collapsed = false, onToggle, isMobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, fullName, userImage } = useAuth();
  const imageUrl = buildProfileImageUrl(userImage);
  const config = dashboardConfig[role];
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  if (!config) return null;

  const handleLogoClick = () => {
    if (role) {
      router.push(`${config.baseRoute}`);
    } else {
      router.push("/");
    }
    if (isMobile && onClose) {
      onClose();
    }
  };



  const getInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return "U";
  };

  const isShortsPage = pathname.endsWith("/shorts");

  const getActiveTabStyles = () => {
    if (isShortsPage) {
      return "bg-zinc-800 text-white font-semibold shadow-sm";
    }
    switch (role) {
      case 'college':
        return "bg-green-50 text-green-600 font-semibold";
      case 'mentor':
        return "bg-violet-50 text-violet-600 font-semibold";
      case 'industry':
        return "bg-purple-50 text-purple-600 font-semibold";
      case 'student':
      default:
        return "bg-orange-50 text-orange-600 font-semibold";
    }
  };

  const getActiveIconStyles = () => {
    if (isShortsPage) {
      return "text-white";
    }
    switch (role) {
      case 'college':
        return "text-green-600";
      case 'mentor':
        return "text-violet-600";
      case 'industry':
        return "text-purple-600";
      case 'student':
      default:
        return "text-orange-600";
    }
  };

  return (
    <motion.div
      initial={{ width: collapsed ? 80 : 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
      className={`border-r flex flex-col h-screen sticky top-0 z-50 shrink-0 transition-colors duration-300 ${isShortsPage ? 'bg-[#0f0f0f] border-zinc-800' : 'bg-white border-slate-200'
        }`}
    >
      {/* Logo Area */}
      <div className={`h-[72px] shrink-0 flex items-center justify-between px-4 border-b transition-colors duration-300 ${isShortsPage ? 'border-zinc-800' : 'border-slate-100'
        }`}>
        <div onClick={handleLogoClick} className={`flex items-center gap-2 cursor-pointer group ${collapsed ? 'w-full justify-center' : ''}`}>
          <div className="relative">
            <img
              src="/images/Logo.png"
              alt="StrideNex Logo"
              className="w-40 h-40 object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
            />
            <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isShortsPage ? 'bg-white/5' : 'bg-white/20'}`}></div>
          </div>
        </div>

        {!isMobile && onToggle && (
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-full border shadow-sm transition-all duration-300 z-10 ${isShortsPage
                ? 'border-zinc-850 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'
              } ${collapsed ? 'absolute -right-3 top-6' : ''}`}
          >
            {collapsed ? (
              <ChevronRight className="w-[14px] h-[14px]" />
            ) : (
              <ChevronLeft className="w-[14px] h-[14px]" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
        {config.links.map((link) => {
          // Exact match for base dashboard route to prevent it from being active on sub-routes
          const isBaseRoute = link.href === `${config.baseRoute}/dashboard`;
          const isActive = isBaseRoute
            ? pathname === link.href
            : (pathname === link.href || pathname.startsWith(`${link.href}/`));

          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={isMobile ? onClose : undefined}
              onMouseEnter={() => setHoveredItem(link.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-300 group
                ${isActive
                  ? getActiveTabStyles()
                  : isShortsPage
                    ? "text-zinc-400 hover:bg-zinc-800/60 hover:text-white font-medium"
                    : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 font-medium"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon
                className={`w-[20px] h-[20px] transition-colors ${isActive ? getActiveIconStyles() : isShortsPage ? "text-zinc-500 group-hover:text-zinc-300" : "text-slate-400 group-hover:text-slate-600"
                  }`}
              />

              {!collapsed && (
                <span className={`flex-1 text-[14px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>{link.name}</span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && hoveredItem === link.name && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none"
                >
                  {link.name}
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Links & User Profile */}
      <div className={`p-4 space-y-3 transition-colors duration-300 ${isShortsPage ? 'bg-[#0b0b0b]' : 'bg-slate-50/50'}`}>
        {/* User Profile */}
        {!collapsed ? (
          <div className={`pt-4 border-t flex items-center gap-3 transition-colors duration-300 ${isShortsPage ? 'border-zinc-800' : 'border-slate-200/60'}`}>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-slate-800 to-slate-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt={fullName || "User"} className="w-full h-full object-cover" />
              ) : (
                getInitials()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-[13px] tracking-wide truncate ${isShortsPage ? 'text-zinc-200' : 'text-slate-800'}`}>
                {fullName || "User"}
              </div>
              <div className={`text-[11px] font-medium uppercase tracking-widest truncate ${isShortsPage ? 'text-zinc-550 text-zinc-500' : 'text-slate-500'}`}>
                {config.roleName}
              </div>
            </div>
          </div>
        ) : (
          <div className={`pt-4 border-t flex justify-center relative transition-colors duration-300 ${isShortsPage ? 'border-zinc-800' : 'border-slate-200/60'}`}>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-slate-800 to-slate-600 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all"
              onMouseEnter={() => setHoveredItem("profile")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {imageUrl ? (
                <img src={imageUrl} alt={fullName || "User"} className="w-full h-full object-cover" />
              ) : (
                getInitials()
              )}
            </div>
            {hoveredItem === "profile" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none"
              >
                {fullName || "User"} • {config.roleName}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}