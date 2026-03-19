// components/layout/PublicNavbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Sparkles,
  GraduationCap,
  Building2,
  Briefcase,
} from "lucide-react";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaYoutube
} from "react-icons/fa";
import { navigationConfig, getBadgeColorClasses } from "@/config/navigation";

interface NavbarProps {
  appName?: string;
}

// Animation variants
const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const megaMenuVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.03
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function PublicNavbar({ appName = "StrideNex" }: NavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMegaMenuEnter = (key: string) => {
    const item = navItems.find(item => item.key === key);
    if (item?.sections && item.sections.length > 0) {
      setActiveMegaMenu(key);
    }
  };

  const handleMegaMenuLeave = () => {
    setTimeout(() => {
      if (!megaMenuRef.current?.matches(':hover')) {
        setActiveMegaMenu(null);
      }
    }, 100);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setSearchOpen(false);
  };

  const navItems = Object.entries(navigationConfig).map(([key, value]) => ({
    key,
    ...value
  }));

  const quickActions = [
    { label: "LinkedIn", icon: FaLinkedin, color: "from-blue-600 to-blue-700", href: "https://linkedin.com/company/stridenex" },
    { label: "Instagram", icon: FaInstagram, color: "from-pink-500 to-purple-600", href: "https://instagram.com/stridenex" },
    { label: "Facebook", icon: FaFacebook, color: "from-blue-600 to-blue-700", href: "https://facebook.com/stridenex" },
    { label: "YouTube", icon: FaYoutube, color: "from-red-600 to-red-700", href: "https://youtube.com/@stridenex" },
  ];


  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg'
          : 'bg-white/80 backdrop-blur-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* TOP ROW - Logo and Right Side Actions */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center cursor-pointer">
              <img
                src="/images/Logo.png"
                alt="StrideNex Logo"
                className="w-[170px] h-[170px] object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Role Switcher */}
              <div className="hidden lg:flex items-center gap-1 mr-1">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => window.open(action.href, '_blank')}
                    className="text-xs px-2 py-1 h-7 rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-1"
                  >
                    <action.icon
                      className={`w-3.5 h-3.5 ${action.label === 'LinkedIn' ? 'text-[#0077B5]' :
                        action.label === 'Instagram' ? 'text-[#E4405F]' :
                          action.label === 'Facebook' ? 'text-[#1877F2]' :
                            action.label === 'YouTube' ? 'text-[#FF0000]' : ''
                        }`}
                    />
                    <span className="hidden lg:inline text-slate-700">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 rounded-lg text-slate-700 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {/* Public Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => window.open('/login', '_blank')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Login
                </button>
                {/* <button
                  onClick={() => handleNavigation('/signup')}
                  className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-accent to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Join Now
                </button> */}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* SEPARATOR LINE */}
          <div className="w-full h-px bg-primary/10"></div>

          {/* BOTTOM ROW - Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center py-2">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const hasSections = item.sections && item.sections.length > 0;

                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => handleMegaMenuEnter(item.key)}
                    onMouseLeave={hasSections ? handleMegaMenuLeave : undefined}
                  >
                    {item.href ? (
                      <button
                        onClick={() => {
                          if (item.key === 'join') {
                            window.open(item.href, '_blank');
                          } else {
                            handleNavigation(item.href!);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-1 group ${activeMegaMenu === item.key
                          ? 'text-primary bg-primary/10'
                          : 'text-slate-700 hover:text-primary hover:bg-primary/5'
                          }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                        {hasSections && (
                          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMegaMenu === item.key ? 'rotate-180' : ''
                            }`} />
                        )}
                      </button>
                    ) : (
                      <button
                        className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-1 group ${activeMegaMenu === item.key
                          ? 'text-primary bg-primary/10'
                          : 'text-slate-700 hover:text-primary hover:bg-primary/5'
                          }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                        {hasSections && (
                          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMegaMenu === item.key ? 'rotate-180' : ''
                            }`} />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Additional Join Now Button in Navbar Row */}
              {/* <button
                onClick={() => handleNavigation('/signup')}
                className="px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-1 group text-accent hover:bg-accent/10"
              >
                <Sparkles className="w-4 h-4" />
                Join Now
              </button> */}
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              ref={megaMenuRef}
              variants={megaMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onMouseLeave={handleMegaMenuLeave}
              className="absolute left-0 right-0 top-[110px] bg-white shadow-2xl border-t border-primary/10 overflow-hidden"
              style={{ originY: 0 }}
            >
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className={`flex flex-col md:flex-row flex-wrap gap-8 md:gap-12 lg:gap-16 ${
                  (navItems.find(item => item.key === activeMegaMenu)?.sections?.length || 0) === 1 
                    ? 'justify-start' 
                    : 'justify-center'
                }`}>
                  {navItems.find(item => item.key === activeMegaMenu)?.sections.map((section, idx) => (
                    <motion.div
                      key={section.title}
                      variants={sectionVariants}
                      className="space-y-4 w-full md:w-[280px]"
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gradient-orange">
                        {section.title}
                      </h4>
                      <div className="space-y-2">
                        {section.items.map((item, itemIdx) => (
                          <motion.div
                            key={item.label}
                            variants={itemVariants}
                            whileHover={{ x: 5 }}
                            className="group"
                          >
                            <button
                              onClick={() => handleNavigation(item.href)}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors w-full text-left"
                            >
                              {item.icon && (
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                  <item.icon className="w-4 h-4" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${getBadgeColorClasses(item.badgeColor).bg
                                      } ${getBadgeColorClasses(item.badgeColor).text
                                      }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Featured CTA - Role-based */}
                <motion.div
                  variants={sectionVariants}
                  className="mt-8 pt-8 border-t border-slate-100"
                >
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleNavigation('/signup?role=student')}
                      className="group text-left"
                    >
                      <div className="bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900">For Students</h5>
                            <p className="text-xs text-slate-500">Start your career journey</p>
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavigation('/signup?role=college')}
                      className="group text-left"
                    >
                      <div className="bg-gradient-to-r from-accent/5 to-orange-600/5 rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-accent to-orange-600 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900">For Institutes</h5>
                            <p className="text-xs text-slate-500">Enhance placement success</p>
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavigation('/signup?role=industry')}
                      className="group text-left"
                    >
                      <div className="bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900">For Industry</h5>
                            <p className="text-xs text-slate-500">Access skilled talent</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 right-0 top-16 bg-white shadow-2xl border-t border-primary/10 p-6"
            >
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search for programs, pathways, opportunities..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-primary/10 focus:border-primary outline-none transition-colors"
                    autoFocus
                  />
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span>Popular:</span>
                  <button className="hover:text-primary transition-colors">Skill Facilitating</button>
                  <button className="hover:text-primary transition-colors">Entrepreneurship</button>
                  <button className="hover:text-primary transition-colors">Higher Education</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden absolute left-0 right-0 top-16 bg-white shadow-2xl border-t border-primary/10 max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Mobile Role Switcher */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleNavigation('/students')}
                    className="text-center p-2 rounded-lg bg-primary/5"
                  >
                    <GraduationCap className="w-5 h-5 mx-auto text-primary mb-1" />
                    <span className="text-xs font-medium">Students</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/institutes')}
                    className="text-center p-2 rounded-lg bg-accent/5"
                  >
                    <Building2 className="w-5 h-5 mx-auto text-accent mb-1" />
                    <span className="text-xs font-medium">Institutes</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/industry')}
                    className="text-center p-2 rounded-lg bg-emerald-500/5"
                  >
                    <Briefcase className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                    <span className="text-xs font-medium">Industry</span>
                  </button>
                </div>

                {/* Mobile Navigation Items */}
                {navItems.map((item) => {
                  const hasSections = item.sections && item.sections.length > 0;

                  return (
                    <motion.div key={item.key} variants={itemVariants} className="space-y-3">
                      {item.href ? (
                        <button
                          onClick={() => handleNavigation(item.href!)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <span className="text-lg font-bold text-slate-900">{item.label}</span>
                          {hasSections && (
                            <ChevronDown className="w-5 h-5 text-accent" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveMegaMenu(activeMegaMenu === item.key ? null : item.key)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <span className="text-lg font-bold text-slate-900">{item.label}</span>
                          {hasSections && (
                            <ChevronDown className={`w-5 h-5 text-accent transition-transform ${activeMegaMenu === item.key ? 'rotate-180' : ''
                              }`} />
                          )}
                        </button>
                      )}

                      {hasSections && activeMegaMenu === item.key && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          {item.sections.map((section: any) => (
                            <div key={section.title} className="space-y-2">
                              <h5 className="text-xs font-bold uppercase text-primary tracking-wider">
                                {section.title}
                              </h5>
                              <div className="space-y-1">
                                {section.items.map((subItem: any) => (
                                  <button
                                    key={subItem.label}
                                    onClick={() => handleNavigation(subItem.href)}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors w-full text-left"
                                  >
                                    {subItem.icon && (
                                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <subItem.icon className="w-4 h-4" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-sm font-semibold text-slate-900">
                                        {subItem.label}
                                      </div>
                                      {subItem.description && (
                                        <p className="text-xs text-slate-500">{subItem.description}</p>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}

                <hr className="border-slate-200" />

                {/* Auth buttons for public users */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="w-full px-4 py-2 text-center text-primary font-semibold hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="w-full px-4 py-2 text-center bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >

                    Join Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}