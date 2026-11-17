"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Search,
  ChevronDown,
  Send,
  Compass,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Building2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SupportTabContentProps {
  role?: "student" | "college" | "mentor" | "industry" | string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Account & Security" | "Platform & Features" | "Billing & Plans";
  roles?: string[];
}

const FAQS_DATA: FaqItem[] = [
  // General FAQs
  {
    id: "gen-1",
    question: "What is StrideNex and how does it empower my journey?",
    answer:
      "StrideNex is an intelligent career acceleration platform connecting Students, Colleges, Industry recruiters, and Mentors into a single unified ecosystem. It combines skill verification, personalized habit tracking, AI-powered employability scoring, LMS learning modules, and direct campus recruitment to build clear pathways from education to career success.",
    category: "General",
  },
  {
    id: "gen-2",
    question: "Can I access StrideNex on both Web and Mobile devices?",
    answer:
      "Yes! StrideNex is fully cross-platform. You can access the complete web portal from any modern desktop browser, or install the StrideNex Mobile app on your Android or iOS smartphone for on-the-go notifications, habit updates, course streaming, and mentor requests.",
    category: "General",
  },
  {
    id: "gen-3",
    question: "How do I take the interactive platform tour again?",
    answer:
      "You can launch the guided tour at any time by clicking the 'Launch Guided Tour' button in the Quick Resources section below, or by clicking the floating 'Tabs Guide' button located in the bottom-right corner of your dashboard.",
    category: "General",
  },

  // Student specific FAQs
  {
    id: "stu-1",
    question: "How is my Employability Score calculated?",
    answer:
      "Your Employability Score is dynamically computed based on four pillars: verified technical skills in your Skill Ledger, consistency in your daily Habit Tracker, completion of LMS courses and real-world projects, and your academic CGPA. Consistently adding verified skills and maintaining habit streaks increases your score.",
    category: "Platform & Features",
    roles: ["student"],
  },
  {
    id: "stu-2",
    question: "Why are some dashboard tabs locked with a plan badge?",
    answer:
      "Certain advanced features (such as applying to premium Jobs & Internships, direct Mentor bookings, and unlimited LMS certifications) require an active student subscription plan. You can view all available plans, student discounts, and unlock access instantly in the Plans tab.",
    category: "Billing & Plans",
    roles: ["student"],
  },
  {
    id: "stu-3",
    question: "How do I participate in Campus Placement Drives?",
    answer:
      "Navigate to the 'Campus Drives' tab to see active and upcoming recruitment drives posted by partner companies and your college placement cell. Check the eligibility criteria, complete your profile to at least 80%, and click 'Apply Now' to submit your verified resume.",
    category: "Platform & Features",
    roles: ["student"],
  },

  // College specific FAQs
  {
    id: "col-1",
    question: "How does the College Placement Cell schedule campus recruitment drives?",
    answer:
      "Colleges can create and invite verified industry partners to virtual or on-campus drives from the 'Campus Drives' tab. You can set minimum eligibility thresholds (CGPA, backlogs, required skills), track student opt-ins in real-time, and download consolidated shortlisted batches with one click.",
    category: "Platform & Features",
    roles: ["college"],
  },
  {
    id: "col-2",
    question: "How can faculty track cohort skill readiness and NEP 2020 compliance?",
    answer:
      "The 'Student Analytics' and 'Interventions' tabs offer real-time cohort distribution charts, skill gap analyses, and automated alerts for students needing academic support, aligned with National Education Policy (NEP) outcome metrics.",
    category: "Platform & Features",
    roles: ["college"],
  },

  // Industry specific FAQs
  {
    id: "ind-1",
    question: "How does Industry post new internship or job vacancies?",
    answer:
      "Navigate to the 'Internship Posts' or 'Job Profiles' tabs and click 'Create New Opening'. Specify required tech stack proficiencies, stipend/salary, job location (remote/onsite), and automatic screening criteria to receive pre-evaluated candidates.",
    category: "Platform & Features",
    roles: ["industry"],
  },
  {
    id: "ind-2",
    question: "How does the Application Pipeline work?",
    answer:
      "The 'Application Pipeline' provides an automated Kanban board to review student applications, inspect verified Skill Ledger achievements, schedule interviews, and issue offer letters with transparent status tracking.",
    category: "Platform & Features",
    roles: ["industry"],
  },

  // Mentor specific FAQs
  {
    id: "men-1",
    question: "How do mentors set their schedule and 1:1 availability?",
    answer:
      "Head to the 'Schedule' tab to define your weekly calendar slots, available meeting durations (30 min or 60 min), and session topics. Incoming student requests will automatically reflect in your 'Requests' dashboard for confirmation.",
    category: "Platform & Features",
    roles: ["mentor"],
  },
  {
    id: "men-2",
    question: "When and how are mentor session payouts processed?",
    answer:
      "Session earnings are tracked in the 'Payouts & Commission' tab. Once a mentorship call is marked as completed by both parties, your verified balance is credited and disbursed to your linked bank account on a bi-weekly cycle.",
    category: "Billing & Plans",
    roles: ["mentor"],
  },

  // Account & Security
  {
    id: "sec-1",
    question: "How do I reset or update my account password?",
    answer:
      "You can update your password from your Profile Settings. If you have forgotten your password, click the 'Forgot Password' link on the login page to receive a secure OTP verification on your registered email address.",
    category: "Account & Security",
  },
  {
    id: "sec-2",
    question: "Is my personal, academic, and payment data secure?",
    answer:
      "Absolutely. StrideNex employs industry-grade 256-bit SSL encryption, tokenized authentication, and strict role-based access controls. We never store raw payment card data, and all transactions are processed through certified PCI-DSS compliant payment gateways.",
    category: "Account & Security",
  },
];

export default function SupportTabContent({ role = "student" }: SupportTabContentProps) {
  const { currentUser, fullName } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("gen-1");

  // Contact form state
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("General Inquiry");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filtered FAQs based on user role, category, and search query
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      // Role filter: if FAQ has specific roles, only show if current role matches
      if (faq.roles && !faq.roles.includes(role)) {
        return false;
      }
      // Category filter
      if (activeCategory !== "All" && faq.category !== activeCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = faq.question.toLowerCase().includes(query);
        const matchesAnswer = faq.answer.toLowerCase().includes(query);
        return matchesQuestion || matchesAnswer;
      }
      return true;
    });
  }, [role, activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    setIsSubmitting(true);
    // Simulate support ticket dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTicketSubject("");
      setTicketMessage("");
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 800);
  };

  const launchTourGuide = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(`open-${role}-tour`));
    }
  };

  // Role Accent Styles
  const getRoleAccent = () => {
    switch (role) {
      case "college":
        return {
          gradient: "from-emerald-500 to-green-600",
          bgLight: "bg-emerald-50",
          borderLight: "border-emerald-200",
          text: "text-emerald-600",
          btn: "bg-emerald-600 hover:bg-emerald-700",
          pill: "bg-emerald-100 text-emerald-800",
        };
      case "industry":
        return {
          gradient: "from-purple-600 to-indigo-600",
          bgLight: "bg-purple-50",
          borderLight: "border-purple-200",
          text: "text-purple-600",
          btn: "bg-purple-600 hover:bg-purple-700",
          pill: "bg-purple-100 text-purple-800",
        };
      case "mentor":
        return {
          gradient: "from-violet-600 to-purple-600",
          bgLight: "bg-violet-50",
          borderLight: "border-violet-200",
          text: "text-violet-600",
          btn: "bg-violet-600 hover:bg-violet-700",
          pill: "bg-violet-100 text-violet-800",
        };
      case "student":
      default:
        return {
          gradient: "from-orange-500 to-amber-600",
          bgLight: "bg-orange-50",
          borderLight: "border-orange-200",
          text: "text-orange-600",
          btn: "bg-orange-600 hover:bg-orange-700",
          pill: "bg-orange-100 text-orange-800",
        };
    }
  };

  const accent = getRoleAccent();

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* ─── Compact Header ─────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${accent.bgLight} ${accent.borderLight} border flex items-center justify-center shrink-0 shadow-xs`}>
            <HelpCircle className={`w-6 h-6 ${accent.text}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${accent.pill}`}>
                Support & Help Center
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              How can we help you?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explore frequently asked questions, platform guidelines, or reach out to our team.
            </p>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs & topics..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ─── Quick Actions & Resources ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Interactive Tour */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className={`w-11 h-11 rounded-xl ${accent.bgLight} ${accent.text} flex items-center justify-center mb-4`}>
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Interactive Tour</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Need a step-by-step walkthrough of all dashboard features and navigation tabs?
            </p>
          </div>
          <button
            onClick={launchTourGuide}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white ${accent.btn} shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-2`}
          >
            <span>Launch Guided Tour</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Contact Hotline */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Direct Hotline</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Speak with a support representative directly during business hours (Mon-Fri, 9am-6pm IST).
            </p>
          </div>
          <a
            href="tel:+919225297767"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Call (+91) 9225297767</span>
          </a>
        </div>

        {/* Card 3: Email Support */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Email Desk</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Send us detailed inquiries, feedback, or screenshots. We respond within 24 business hours.
            </p>
          </div>
          <a
            href="mailto:info@stridenex.ai"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Email info@stridenex.ai</span>
          </a>
        </div>
      </div>

      {/* ─── Two-Column Layout: FAQs & Contact Us Form ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Column: FAQs (7 Cols) ───────────────────────── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick answers to common questions about {role} workflows and platform tools.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Platform & Features", "Billing & Plans", "Account & Security"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? `${accent.btn} text-white shadow-sm`
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-orange-500" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No matching questions found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search terms or select "All" categories.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Official Contact & Ticket Form (5 Cols) ─ */}
        <div className="lg:col-span-5 space-y-6">
          {/* Official Contact Details Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>Official Contact Details</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Phone Support</div>
                  <a href="tel:+919225297767" className="text-slate-600 hover:text-orange-600 font-medium">
                    (+91) 9225297767
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Email Address</div>
                  <a href="mailto:info@stridenex.ai" className="text-slate-600 hover:text-blue-600 font-medium">
                    info@stridenex.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Headquarters</div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    B2/20, Saudamini Co-Operative Housing Society, Paud Road, Kothrud, Pune, (MH) India 411038
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Working Hours</div>
                  <p className="text-slate-600 text-xs">Monday – Friday: 9:00 AM – 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Query / Ticket Form */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                <span>Send Us a Message</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Have a specific question or issue? Leave your message and we'll reply directly to {currentUser || "your registered email"}.
              </p>
            </div>

            {submitSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Thank you! Your message has been received. Our team will get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Query Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
                >
                  <option value="General Inquiry" className="text-slate-900">General Inquiry</option>
                  <option value="Technical Issue" className="text-slate-900">Technical Issue / Bug</option>
                  <option value="Billing & Subscription" className="text-slate-900">Billing & Subscription</option>
                  <option value="Courses & LMS" className="text-slate-900">Courses & LMS Studio</option>
                  <option value="Placement Drives" className="text-slate-900">Placement & Drives</option>
                  <option value="Feedback" className="text-slate-900">Feature Request / Feedback</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief summary of your question..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe what you need help with..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Submit Query</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
