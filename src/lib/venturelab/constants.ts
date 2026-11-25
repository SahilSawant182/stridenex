// lib/venturelab/constants.ts
import {
  Users,
  Gift,
  Megaphone,
  HeartHandshake,
  IndianRupee,
  Boxes,
  Wrench,
  Handshake,
  Receipt,
  LayoutDashboard,
  Folder,
  Lightbulb,
  Grid3x3,
  CheckCircle2,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type {
  BmcBlockId,
  BmcBlockMeta,
  MemberCategory,
  RoadmapTemplateId,
  RoadmapTemplateMeta,
  TaskPriority,
  TaskStatus,
  VentureStage,
} from "@/types/venturelab";

export const VENTURELAB_BASE = "/venturelab";
/** Where "Back to StrideNex" sends the student. */
export const STRIDENEX_HOME = "/student/dashboard";

export interface VentureNavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const VENTURE_NAV: VentureNavItem[] = [
  { key: "overview", label: "Overview", href: `${VENTURELAB_BASE}/overview`, icon: LayoutDashboard },
  { key: "ventures", label: "My Ventures", href: `${VENTURELAB_BASE}/ventures`, icon: Folder },
  { key: "discovery", label: "Idea Discovery", href: `${VENTURELAB_BASE}/discovery`, icon: Lightbulb },
  { key: "canvas", label: "Business Model Canvas", href: `${VENTURELAB_BASE}/canvas`, icon: Grid3x3 },
  { key: "execution", label: "Execution Hub", href: `${VENTURELAB_BASE}/execution`, icon: CheckCircle2 },
  { key: "team", label: "Team & Collaboration", href: `${VENTURELAB_BASE}/team`, icon: UsersRound },
];

/* ------------------------------------------------------------------ */
/* Business Model Canvas blocks                                        */
/* ------------------------------------------------------------------ */

export const BMC_BLOCKS: Record<BmcBlockId, BmcBlockMeta> = {
  cs: {
    id: "cs",
    number: 1,
    name: "Customer Segments",
    shortName: "Customers",
    description: "The groups of people or organisations you aim to reach and serve.",
    guidingQuestions: [
      "For whom are we creating value?",
      "Who are our most important early adopters?",
      "Is this a mass market, niche, or multi-sided platform?",
    ],
    suggestions: ["College students", "Small business owners", "Rural households", "Working parents", "First-time founders"],
    wizardQuestion: "Who would be the first people to use your product?",
    wizardHint: "Be specific. “Everyone” is not a customer — picture one real person.",
    placeholder: "e.g. Small dairy farmers with 5–20 cattle",
  },
  vp: {
    id: "vp",
    number: 2,
    name: "Value Propositions",
    shortName: "Value",
    description: "The bundle of products and services that create value for each segment.",
    guidingQuestions: [
      "What problem are we solving for the customer?",
      "Which customer needs are we satisfying?",
      "Why would they choose us over the alternative they use today?",
    ],
    suggestions: ["Saves time", "Reduces cost", "Works offline", "Local language support", "Fewer manual errors"],
    wizardQuestion: "What changes for them once they use your solution?",
    wizardHint: "Describe the outcome, not the feature list.",
    placeholder: "e.g. Never miss a vaccination date again",
  },
  ch: {
    id: "ch",
    number: 3,
    name: "Channels",
    shortName: "Channels",
    description: "How you communicate with and reach your customers to deliver value.",
    guidingQuestions: [
      "Through which channels do our customers want to be reached?",
      "Which channels are most cost-efficient for us?",
      "How do we deliver the product after purchase?",
    ],
    suggestions: ["WhatsApp groups", "Campus ambassadors", "Instagram", "Local partner shops", "Play Store"],
    wizardQuestion: "Where will your first customers hear about you?",
    wizardHint: "Think about where they already spend time.",
    placeholder: "e.g. Village dairy cooperative meetings",
  },
  cr: {
    id: "cr",
    number: 4,
    name: "Customer Relationships",
    shortName: "Relationships",
    description: "The type of relationship you establish with each customer segment.",
    guidingQuestions: [
      "What relationship does each segment expect from us?",
      "Is it self-service, personal assistance, or a community?",
      "How do we keep customers coming back?",
    ],
    suggestions: ["Self-service app", "Personal onboarding", "Community forum", "WhatsApp support", "Monthly check-ins"],
    wizardQuestion: "How will you keep them coming back?",
    wizardHint: "Retention beats acquisition for an early venture.",
    placeholder: "e.g. Weekly SMS reminders with a human helpline",
  },
  rs: {
    id: "rs",
    number: 5,
    name: "Revenue Streams",
    shortName: "Revenue",
    description: "The cash your venture generates from each customer segment.",
    guidingQuestions: [
      "For what value are customers really willing to pay?",
      "How do they pay today for the alternative?",
      "Subscription, one-time, commission, or freemium?",
    ],
    suggestions: ["Monthly subscription", "Freemium upgrade", "Commission per sale", "One-time licence", "Sponsorships"],
    wizardQuestion: "How will your venture earn money?",
    wizardHint: "Start with one stream you can test this month.",
    placeholder: "e.g. ₹99/month per farm",
  },
  kr: {
    id: "kr",
    number: 6,
    name: "Key Resources",
    shortName: "Resources",
    description: "The most important assets required to make the business model work.",
    guidingQuestions: [
      "What assets do our value propositions require?",
      "Which are physical, intellectual, human, or financial?",
      "What do we already have vs. need to acquire?",
    ],
    suggestions: ["Mobile app", "Domain expertise", "Founding team", "Seed funding", "Customer data"],
    wizardQuestion: "What do you absolutely need to make this work?",
    wizardHint: "People, tech, money, data — list the essentials only.",
    placeholder: "e.g. Offline-first Android app",
  },
  ka: {
    id: "ka",
    number: 7,
    name: "Key Activities",
    shortName: "Activities",
    description: "The most important things your venture must do to deliver value.",
    guidingQuestions: [
      "What key activities do our value propositions require?",
      "What must we do every week to serve customers?",
      "Is it production, problem solving, or platform management?",
    ],
    suggestions: ["Product development", "Customer onboarding", "Field visits", "Content creation", "Partner management"],
    wizardQuestion: "What will your team spend most of its time doing?",
    wizardHint: "These are the verbs of your business.",
    placeholder: "e.g. Onboarding farmers in person",
  },
  kp: {
    id: "kp",
    number: 8,
    name: "Key Partners",
    shortName: "Partners",
    description: "The network of suppliers and partners that make the business model work.",
    guidingQuestions: [
      "Who are our key partners and suppliers?",
      "Which key resources do we get from partners?",
      "Which activities do partners perform for us?",
    ],
    suggestions: ["College incubator", "NGOs", "Government schemes", "Cloud provider", "Distribution partners"],
    wizardQuestion: "Who could help you get there faster?",
    wizardHint: "Partners reduce risk or give you access you don’t have.",
    placeholder: "e.g. District veterinary office",
  },
  co: {
    id: "co",
    number: 9,
    name: "Cost Structure",
    shortName: "Costs",
    description: "All the costs incurred to operate the business model.",
    guidingQuestions: [
      "What are the most important costs in our model?",
      "Which key resources and activities are most expensive?",
      "Are we cost-driven or value-driven?",
    ],
    suggestions: ["Cloud hosting", "Salaries", "Marketing spend", "Field travel", "Legal & compliance"],
    wizardQuestion: "What will it cost to keep this running?",
    wizardHint: "Rough monthly numbers are fine at this stage.",
    placeholder: "e.g. ₹8,000/month cloud + SMS",
  },
};

/** Storytelling order used by the wizard and the "Replay Reveal" animation. */
export const BMC_STORY_ORDER: BmcBlockId[] = ["cs", "vp", "ch", "cr", "rs", "kr", "ka", "kp", "co"];

export const BMC_ICONS: Record<BmcBlockId, LucideIcon> = {
  cs: Users,
  vp: Gift,
  ch: Megaphone,
  cr: HeartHandshake,
  rs: IndianRupee,
  kr: Boxes,
  ka: Wrench,
  kp: Handshake,
  co: Receipt,
};

/** Tint per block so the grid reads as zones (left = efficiency, right = value). */
export const BMC_ACCENTS: Record<BmcBlockId, { icon: string; ring: string; soft: string }> = {
  kp: { icon: "text-indigo-700 bg-indigo-50", ring: "ring-indigo-200", soft: "bg-indigo-600" },
  ka: { icon: "text-indigo-700 bg-indigo-50", ring: "ring-indigo-200", soft: "bg-indigo-600" },
  kr: { icon: "text-indigo-700 bg-indigo-50", ring: "ring-indigo-200", soft: "bg-indigo-600" },
  vp: { icon: "text-orange-700 bg-orange-50", ring: "ring-orange-200", soft: "bg-orange-700" },
  cr: { icon: "text-emerald-700 bg-emerald-50", ring: "ring-emerald-200", soft: "bg-emerald-700" },
  ch: { icon: "text-emerald-700 bg-emerald-50", ring: "ring-emerald-200", soft: "bg-emerald-700" },
  cs: { icon: "text-emerald-700 bg-emerald-50", ring: "ring-emerald-200", soft: "bg-emerald-700" },
  co: { icon: "text-slate-700 bg-slate-100", ring: "ring-slate-200", soft: "bg-slate-600" },
  rs: { icon: "text-[#0f0fbd] bg-blue-50", ring: "ring-blue-200", soft: "bg-[#0f0fbd]" },
};

/* ------------------------------------------------------------------ */
/* Roadmap templates                                                   */
/* ------------------------------------------------------------------ */

export const ROADMAP_TEMPLATES: Record<RoadmapTemplateId, RoadmapTemplateMeta> = {
  "mvp-launch": {
    id: "mvp-launch",
    name: "MVP Launch",
    description: "From validated problem to a working first version in users’ hands.",
    durationWeeks: 9,
  },
  "validation-sprint": {
    id: "validation-sprint",
    name: "Idea Validation Sprint",
    description: "Test your riskiest assumptions with real customers before you build.",
    durationWeeks: 4,
  },
  "gtm-launch": {
    id: "gtm-launch",
    name: "Go-to-Market Launch",
    description: "Pick a beachhead, craft the message, and land your first 100 users.",
    durationWeeks: 6,
  },
  fundraising: {
    id: "fundraising",
    name: "Fundraising Readiness",
    description: "Pitch deck, metrics, and an investor pipeline for your first round.",
    durationWeeks: 8,
  },
};

export const ROADMAP_TEMPLATE_ORDER: RoadmapTemplateId[] = ["mvp-launch", "validation-sprint", "gtm-launch", "fundraising"];

/* ------------------------------------------------------------------ */
/* Badge styles (high-contrast pairs)                                  */
/* ------------------------------------------------------------------ */

export const STAGE_BADGE: Record<VentureStage, string> = {
  Ideation: "bg-violet-50 text-violet-800 ring-violet-200",
  Validation: "bg-amber-50 text-amber-800 ring-amber-200",
  Development: "bg-blue-50 text-[#0f0fbd] ring-blue-200",
  "Launch Ready": "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const STATUS_BADGE: Record<TaskStatus, string> = {
  "To Do": "bg-slate-100 text-slate-700 ring-slate-200",
  "In Progress": "bg-amber-50 text-amber-800 ring-amber-200",
  Completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const PRIORITY_BADGE: Record<TaskPriority, string> = {
  Low: "bg-slate-100 text-slate-700 ring-slate-200",
  Medium: "bg-blue-50 text-[#0f0fbd] ring-blue-200",
  High: "bg-orange-50 text-orange-800 ring-orange-200",
  Urgent: "bg-red-50 text-red-700 ring-red-200",
};

export const CATEGORY_BADGE: Record<MemberCategory, string> = {
  Founder: "bg-[#0f0fbd] text-white ring-[#0f0fbd]",
  "Co-founder": "bg-indigo-50 text-indigo-800 ring-indigo-200",
  "Finance Lead": "bg-sky-50 text-sky-800 ring-sky-200",
  "Product & Tech": "bg-blue-50 text-[#0f0fbd] ring-blue-200",
  "Marketing & Outreach": "bg-orange-50 text-orange-800 ring-orange-200",
  "Research Lead": "bg-violet-50 text-violet-800 ring-violet-200",
  "Advisor / Mentor": "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

/** Gantt bar fills per status. */
export const STATUS_FILL: Record<TaskStatus, string> = {
  "To Do": "#94a3b8",
  "In Progress": "#f59e0b",
  Completed: "#10b981",
};

/** One-line description shown in the invite dialog (from the prototype). */
export const CATEGORY_HINT: Record<MemberCategory, string> = {
  Founder: "Owns the venture and manages access.",
  "Co-founder": "Shares ownership and full day-to-day work.",
  "Research Lead": "Owns customer and market research.",
  "Product & Tech": "Builds the MVP and manages execution tasks.",
  "Finance Lead": "Owns budgets, pricing and projections.",
  "Marketing & Outreach": "Runs outreach, interviews and campaigns.",
  "Advisor / Mentor": "Gives guidance and feedback — read only by default.",
};

/** "Load DairyConnect example" content for Idea Discovery (from the prototype). */
export const DISCOVERY_EXAMPLE: { rawIdea: string; blocks: Record<BmcBlockId, string[]> } = {
  rawIdea:
    "Small dairy farmers lose money because they track livestock records, milk production, and vaccination dates manually on paper.",
  blocks: {
    cs: ["Small dairy farmers", "Medium-scale dairy farms", "Dairy cooperatives"],
    vp: ["Simplified dairy farm management", "Automated vaccination reminders", "Milk production tracking"],
    ch: ["Android mobile application", "Dairy cooperatives", "Farmer communities"],
    cr: ["In-app support", "Farmer onboarding", "WhatsApp assistance"],
    rs: ["Monthly subscription", "Annual subscription", "Cooperative partnerships"],
    kr: ["Mobile application", "Cloud infrastructure", "Veterinary knowledge base"],
    ka: ["Develop animal management software", "Provide vaccination reminders", "Generate milk production reports"],
    kp: ["Local dairy cooperatives", "Veterinary clinics", "Animal feed suppliers"],
    co: ["Application development", "Cloud hosting", "Customer support"],
  },
};

/** sessionStorage flag: Discovery's "Build canvas" asks the canvas page to play the reveal. */
export const REVEAL_FLAG_KEY = "stridenex:venturelab:play-reveal";
