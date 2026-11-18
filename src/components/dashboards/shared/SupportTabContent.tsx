"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Mail,
  MapPin,
  Clock,
  Search,
  ChevronDown,
  Send,
  Compass,
  CheckCircle2,
  Sparkles,
  Ticket,
  PlusCircle,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  User,
  Shield,
  Layers,
  X,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BASE_DOMAIN } from "@/services/api.services";
import {
  ticketService,
  TicketSummary,
  TicketDetail,
  TicketComment,
} from "@/services/ticket.services";

interface SupportTabContentProps {
  role?: "student" | "college" | "mentor" | "industry" | string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Account & Security" | "Platform & Features" | "Billing & Plans";
}

const FAQS_DATA: FaqItem[] = [
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
      "Yes! StrideNex is fully cross-platform. You can access the complete web portal from any modern desktop browser, or install the StrideNex Mobile app on your smartphone for on-the-go notifications, habit updates, course streaming, and mentor requests.",
    category: "General",
  },
  {
    id: "feat-1",
    question: "How does the Employability Score work?",
    answer:
      "The Employability Score is dynamically computed using proprietary algorithms assessing your verified skills, project complexity, habit consistency, psychometric traits, and academic performance.",
    category: "Platform & Features",
  },
  {
    id: "feat-2",
    question: "How do I take or retake the interactive platform tour?",
    answer:
      "Click the 'Launch Guided Tour' button in the quick cards at the top of this Support page, or click the 'Tabs Guide' button located in your dashboard navigation at any time.",
    category: "Platform & Features",
  },
  {
    id: "acc-1",
    question: "How do I update my profile details and verification credentials?",
    answer:
      "Navigate to your Profile or Settings tab from the sidebar. You can update your bio, social links, resume, educational credentials, and contact preferences directly.",
    category: "Account & Security",
  },
  {
    id: "acc-2",
    question: "Is my personal data and document upload secure on StrideNex?",
    answer:
      "All credentials, resumes, transcripts, and financial records are encrypted with end-to-end industry-standard security protocols and role-based permissions.",
    category: "Account & Security",
  },
  {
    id: "bill-1",
    question: "How do subscription plans and unlock permissions work?",
    answer:
      "Students require an active subscription plan to unlock full access across all specialized dashboard tabs. If your plan expires or is pending, access will be locked until an active plan is chosen.",
    category: "Billing & Plans",
  },
];

/**
 * Clean & sanitize untrusted HTML messages from backend.
 * Renders HTML tags (e.g. <p>, <b>, <br>) as proper elements rather than raw text,
 * and transforms <img src="..."> tags into styled interactive image elements.
 */
const sanitizeAndProcessHtml = (html: string, baseDomain: string): string => {
  if (!html) return "";
  if (typeof window === "undefined") {
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  }

  try {
    let doc: Document;
    if (typeof (Document as any).parseHTML === "function") {
      doc = (Document as any).parseHTML(html);
    } else {
      const parser = new DOMParser();
      doc = parser.parseFromString(html, "text/html");
    }

    // Strip unsafe elements
    const dangerousElements = doc.querySelectorAll(
      "script, iframe, object, embed, form, input, button, link, style"
    );
    dangerousElements.forEach((el) => el.remove());

    // Clean inline event handlers and javascript: URLs
    const allNodes = doc.querySelectorAll("*");
    allNodes.forEach((node) => {
      for (let i = node.attributes.length - 1; i >= 0; i--) {
        const attr = node.attributes[i];
        const name = attr.name.toLowerCase();
        const value = attr.value.trim().toLowerCase();
        if (
          name.startsWith("on") ||
          value.startsWith("javascript:") ||
          value.startsWith("vbscript:")
        ) {
          node.removeAttribute(attr.name);
        }
      }
    });

    // Fix relative image urls & add responsive styling
    const imgNodes = doc.querySelectorAll("img");
    imgNodes.forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (
        src &&
        !src.startsWith("http://") &&
        !src.startsWith("https://") &&
        !src.startsWith("data:") &&
        !src.startsWith("blob:")
      ) {
        const cleanPath = src.startsWith("/") ? src : `/${src}`;
        img.setAttribute("src", `${baseDomain}${cleanPath}`);
      }
      img.setAttribute("loading", "lazy");
      img.setAttribute(
        "class",
        "chat-attachment-img max-w-full max-h-80 rounded-xl my-2 border border-slate-200 dark:border-slate-700/80 shadow-xs cursor-pointer hover:opacity-95 transition-all block object-contain"
      );
      img.setAttribute("alt", img.getAttribute("alt") || "Attachment Image");
    });

    return doc.body.innerHTML;
  } catch (err) {
    console.error("HTML sanitize error:", err);
    return html;
  }
};

interface RichMessageContentProps {
  content: string;
  isUser?: boolean;
  onImageClick?: (src: string) => void;
}

const RichMessageContent: React.FC<RichMessageContentProps> = ({
  content,
  isUser = false,
  onImageClick,
}) => {
  const sanitizedHtml = useMemo(() => {
    if (!content) return "";
    return sanitizeAndProcessHtml(content, BASE_DOMAIN);
  }, [content]);

  const hasHtmlTags = useMemo(() => {
    return /<[a-z][\s\S]*>/i.test(content || "");
  }, [content]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName.toLowerCase() === "img") {
      const src = (target as HTMLImageElement).getAttribute("src");
      if (src && onImageClick) {
        onImageClick(src);
      }
    }
  };

  if (!hasHtmlTags) {
    return (
      <div className="whitespace-pre-wrap break-words leading-relaxed text-xs">
        {content}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`rich-chat-content break-words leading-relaxed text-xs ${
        isUser
          ? "text-white [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_a]:text-white [&_a]:underline [&_img]:border-white/30"
          : "text-slate-800 dark:text-slate-100 [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_a]:text-orange-600 dark:[&_a]:text-orange-400 [&_a]:underline"
      }`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export const SupportTabContent: React.FC<SupportTabContentProps> = ({ role = "student" }) => {
  const router = useRouter();
  const { currentUser, role: userRole } = useAuth();

  // Active section: "faqs" | "raise-ticket" | "my-tickets"
  const [activeTab, setActiveTab] = useState<"faqs" | "raise-ticket" | "my-tickets">("faqs");

  // FAQs State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Tickets List State
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketListError, setTicketListError] = useState<string | null>(null);

  // Selected Ticket Conversation State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Raise Ticket Form State
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketPriority, setTicketPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
  const [ticketDescription, setTicketDescription] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [createTicketSuccess, setCreateTicketSuccess] = useState<string | null>(null);
  const [createTicketError, setCreateTicketError] = useState<string | null>(null);

  // Launch Tour Handler
  const [launchingTour, setLaunchingTour] = useState(false);

  const handleLaunchTour = () => {
    if (typeof window !== "undefined") {
      setLaunchingTour(true);
      const targetRole = (role || "student").toLowerCase();

      // Set flag so the target dashboard will immediately auto-start the tour upon arrival
      sessionStorage.setItem("launch_tour_on_mount", "true");

      // Dispatch module-specific event in case the tour component is already mounted
      window.dispatchEvent(new CustomEvent(`open-${targetRole}-tour`));

      // Navigate to the dashboard overview where the tour steps & elements live
      router.push(`/${targetRole}/dashboard?tour=true`);

      setTimeout(() => {
        setLaunchingTour(false);
      }, 1200);
    }
  };

  // Fetch Tickets
  const fetchMyTickets = useCallback(async () => {
    setLoadingTickets(true);
    setTicketListError(null);
    try {
      const res: any = await ticketService.getMyTickets();
      const list = res?.data?.tickets || res?.message?.data?.tickets || res?.message?.tickets || res?.tickets || [];
      setTickets(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.error("Error fetching tickets:", err);
      setTicketListError(err?.message || "Failed to load support tickets. Please try again.");
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  // Fetch Single Ticket Details
  const fetchTicketDetails = useCallback(async (ticketId: string) => {
    setLoadingDetail(true);
    setReplyError(null);
    try {
      const res: any = await ticketService.getTicketDetails(ticketId);
      const detail = res?.data || res?.message?.data || res?.message;
      if (detail && detail.ticket_id) {
        setTicketDetail(detail);
      } else {
        setTicketDetail(null);
      }
    } catch (err: any) {
      console.error("Error fetching ticket details:", err);
      setReplyError(err?.message || "Failed to load ticket conversation.");
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "my-tickets") {
      fetchMyTickets();
    }
  }, [activeTab, fetchMyTickets]);

  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetails(selectedTicketId);
    }
  }, [selectedTicketId, fetchTicketDetails]);

  // Handle Create Ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) {
      setCreateTicketError("Please enter a ticket subject.");
      return;
    }
    if (!ticketDescription.trim()) {
      setCreateTicketError("Please describe your issue or question.");
      return;
    }

    setSubmittingTicket(true);
    setCreateTicketError(null);
    setCreateTicketSuccess(null);

    try {
      const res: any = await ticketService.createTicket({
        subject: ticketSubject.trim(),
        description: ticketDescription.trim(),
        priority: ticketPriority,
      });

      const newTicketId =
        res?.data?.ticket_id ||
        res?.data?.id ||
        res?.message?.data?.ticket_id ||
        res?.message?.ticket_id;

      setCreateTicketSuccess(
        newTicketId
          ? `Ticket #${newTicketId} created successfully! Our support team will assist you shortly.`
          : "Support ticket created successfully!"
      );
      setTicketSubject("");
      setTicketDescription("");
      setTicketPriority("Medium");

      // Refresh tickets list
      fetchMyTickets();
    } catch (err: any) {
      console.error("Error creating ticket:", err);
      setCreateTicketError(err?.message || "Failed to submit ticket. Please try again.");
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Handle Reply to Ticket
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyMessage.trim()) return;

    setSubmittingReply(true);
    setReplyError(null);

    try {
      await ticketService.addTicketComment({
        ticket_id: selectedTicketId,
        message: replyMessage.trim(),
      });
      setReplyMessage("");
      // Refresh conversation
      await fetchTicketDetails(selectedTicketId);
    } catch (err: any) {
      console.error("Error replying to ticket:", err);
      setReplyError(err?.message || "Failed to post reply. Please try again.");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "All" || faq.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "open") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Open
        </span>
      );
    }
    if (s === "replied") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
          <MessageSquare className="w-3 h-3" />
          Replied
        </span>
      );
    }
    if (s === "resolved" || s === "closed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        {status || "In Progress"}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const p = (priority || "").toLowerCase();
    if (p === "urgent") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200 uppercase">
          Urgent
        </span>
      );
    }
    if (p === "high") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase">
          High
        </span>
      );
    }
    if (p === "low") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          Low
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
        Medium
      </span>
    );
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Sleek, Compact Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-md border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>StrideNex Help Desk & Support</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              How can we assist you today?
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              Search frequently asked questions, launch guided platform walkthroughs, or raise and track support tickets directly.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => {
                setSelectedTicketId(null);
                setActiveTab("raise-ticket");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs md:text-sm font-semibold shadow-lg shadow-orange-500/25 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Raise Ticket</span>
            </button>
            <button
              onClick={() => {
                setSelectedTicketId(null);
                setActiveTab("my-tickets");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs md:text-sm font-medium transition-all"
            >
              <Ticket className="w-4 h-4 text-indigo-300" />
              <span>My Tickets</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Quick Cards In A Single Row: Interactive Tour, Email Desk, Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Interactive Tour */}
        <div className="flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Interactive Tour
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Step-by-step walkthrough of dashboard features, metrics, and navigation tabs.
              </p>
            </div>
          </div>
          <button
            onClick={handleLaunchTour}
            disabled={launchingTour}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            {launchingTour ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Launching Tour...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Guided Tour</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Email Desk */}
        <div className="flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Email Desk
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Send inquiries, feedback, or logs. We respond within 24 business hours.
              </p>
            </div>
          </div>
          <a
            href="mailto:info@stridenex.ai"
            className="mt-4 w-full py-2.5 px-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>info@stridenex.ai</span>
          </a>
        </div>

        {/* Card 3: Contact Details (Pune, Maharashtra, India) */}
        <div className="flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Office Location
              </h3>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                Pune, Maharashtra, India
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Mon – Fri • 9:00 AM – 6:00 PM IST</span>
              </div>
            </div>
          </div>
          <Link
            href={`/contact-us?from=/${role || "student"}/dashboard/support`}
            className="mt-4 w-full py-2.5 px-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Contact Details</span>
          </Link>
        </div>
      </div>

      {/* Main Support Sections Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedTicketId(null);
              setActiveTab("faqs");
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "faqs" && !selectedTicketId
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs</span>
          </button>

          <button
            onClick={() => {
              setSelectedTicketId(null);
              setActiveTab("raise-ticket");
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "raise-ticket" && !selectedTicketId
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise a Ticket</span>
          </button>

          <button
            onClick={() => {
              setSelectedTicketId(null);
              setActiveTab("my-tickets");
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "my-tickets" || selectedTicketId
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Tickets</span>
            {tickets.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                {tickets.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "faqs" && (
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or topics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        )}
      </div>

      {/* SECTION 1: FAQs */}
      {activeTab === "faqs" && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "General", "Platform & Features", "Account & Security", "Billing & Plans"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800 font-semibold"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No matching questions found
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try another search query or raise a support ticket directly.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                        <span className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-orange-500" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80"
                        >
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: RAISE A TICKET */}
      {activeTab === "raise-ticket" && (
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-orange-500" />
                <span>Create Support Ticket</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Submit an inquiry or report an issue. Our support team will assist you.
              </p>
            </div>
            <span className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium capitalize">
              Role: {role}
            </span>
          </div>

          {createTicketSuccess && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{createTicketSuccess}</span>
            </div>
          )}

          {createTicketError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{createTicketError}</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g., Unable to book mentorship session or upload certificate"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg">
                {(["Low", "Medium", "High", "Urgent"] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setTicketPriority(p)}
                    className={`py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                      ticketPriority === p
                        ? "bg-orange-500 border-orange-500 text-white font-semibold shadow-xs"
                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Please describe what occurred in detail, including steps to reproduce, relevant tab names, or transaction details..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setTicketSubject("");
                  setTicketDescription("");
                  setCreateTicketError(null);
                  setActiveTab("my-tickets");
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                View Existing Tickets
              </button>
              <button
                type="submit"
                disabled={submittingTicket}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {submittingTicket ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 3: MY TICKETS LIST OR CONVERSATION CHAT VIEW */}
      {activeTab === "my-tickets" && (
        <div>
          {/* TICKET CONVERSATION VIEW */}
          {selectedTicketId ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Conversation Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedTicketId(null);
                      setTicketDetail(null);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Back to Tickets"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        #{ticketDetail?.ticket_id || selectedTicketId}
                      </span>
                      {ticketDetail && getStatusBadge(ticketDetail.status)}
                      {ticketDetail && getPriorityBadge(ticketDetail.priority)}
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {ticketDetail?.subject || "Ticket Details"}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => fetchTicketDetails(selectedTicketId)}
                  disabled={loadingDetail}
                  className="self-end sm:self-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDetail ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Conversation Messages Container */}
              <div className="p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto bg-slate-50/30 dark:bg-slate-900/50">
                {loadingDetail && !ticketDetail ? (
                  <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
                    <p className="text-xs">Loading ticket conversation...</p>
                  </div>
                ) : ticketDetail ? (
                  <>
                    {/* Original Issue Card */}
                    <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Initial Description
                        </span>
                        <span>{ticketDetail.created_at || "Opened"}</span>
                      </div>
                      <RichMessageContent
                        content={ticketDetail.description}
                        isUser={false}
                        onImageClick={setPreviewImage}
                      />
                    </div>

                    {/* Chat Comments Stream */}
                    {ticketDetail.comments && ticketDetail.comments.length > 0 ? (
                      ticketDetail.comments.map((comment: TicketComment, idx: number) => {
                        const isUserMsg = comment.is_user;
                        return (
                          <div
                            key={comment.comment_id || idx}
                            className={`flex flex-col ${
                              isUserMsg ? "items-end" : "items-start"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 px-1">
                              {isUserMsg ? (
                                <>
                                  <User className="w-3 h-3 text-orange-500" />
                                  <span className="font-medium text-slate-700 dark:text-slate-300">
                                    You
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Shield className="w-3 h-3 text-indigo-500" />
                                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                    Support Desk ({comment.comment_by || "Agent"})
                                  </span>
                                </>
                              )}
                              <span>•</span>
                              <span>{comment.created_at || ""}</span>
                            </div>

                            <div
                              className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                                isUserMsg
                                  ? "bg-orange-500 text-white rounded-br-xs shadow-xs"
                                  : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-xs"
                              }`}
                            >
                              <RichMessageContent
                                content={comment.message}
                                isUser={isUserMsg}
                                onImageClick={setPreviewImage}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                        No agent comments yet. Our team will review your ticket and reply here.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-8 text-center text-xs text-rose-500">
                    Failed to load ticket details. Please click Refresh or select another ticket.
                  </div>
                )}
              </div>

              {/* Reply Input Bar */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {replyError && (
                  <div className="mb-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{replyError}</span>
                  </div>
                )}
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply or additional details here..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingReply || !replyMessage.trim()}
                    className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {submittingReply ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* TICKETS LIST VIEW */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    My Raised Tickets
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track status and conversation history with our support team.
                  </p>
                </div>
                <button
                  onClick={fetchMyTickets}
                  disabled={loadingTickets}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingTickets ? "animate-spin" : ""}`} />
                  <span>Refresh List</span>
                </button>
              </div>

              {ticketListError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{ticketListError}</span>
                </div>
              )}

              {loadingTickets ? (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
                  <p className="text-xs">Fetching your support tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Ticket className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No tickets found
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You have not raised any support tickets yet. If you need any assistance, click the button below.
                  </p>
                  <button
                    onClick={() => setActiveTab("raise-ticket")}
                    className="mt-4 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Raise a New Ticket</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {tickets.map((t) => (
                    <div
                      key={t.ticket_id}
                      onClick={() => setSelectedTicketId(t.ticket_id)}
                      className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-800 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            #{t.ticket_id}
                          </span>
                          {getStatusBadge(t.status)}
                          {getPriorityBadge(t.priority)}
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          {t.subject}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>Created: {t.creation || "Recent"}</span>
                          {t.modified && <span>• Updated: {t.modified}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>View Thread</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Image Preview Lightbox Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
            >
              <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  Attachment Image Preview
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={previewImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Open Original in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Close Preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-center overflow-auto max-h-[calc(90vh-60px)]">
                <img
                  src={previewImage}
                  alt="Attachment Preview"
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportTabContent;

