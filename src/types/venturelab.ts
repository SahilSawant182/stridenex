// types/venturelab.ts
// Type definitions for the StrideNex VentureLab (Entrepreneurship) module — Stage 1 Foundation.

/* ------------------------------------------------------------------ */
/* Ventures                                                            */
/* ------------------------------------------------------------------ */

/** Stage names are owned by the backend (e.g. "Discovery"), so this is an open string. */
export type VentureStage = string;

export type VentureStageFilter = string; // "All" or a stage name

export interface Venture {
  id: string;
  name: string;
  sector: string;
  stage: VentureStage;
  /** Tagline shown on venture cards. */
  description: string;
  /** Backend overall_progress (0-100); falls back to roadmap maths when absent. */
  overallProgress?: number;
  /** Step 0 of Idea Discovery — the founder's raw thought. */
  rawIdea: string;
  archived: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  canvas: BusinessModelCanvas;
  execution: ExecutionPlan;
  team: TeamMember[];
}

/* ------------------------------------------------------------------ */
/* Business Model Canvas                                               */
/* ------------------------------------------------------------------ */

/** Osterwalder block ids — also used as CSS grid-area names. */
export type BmcBlockId = "kp" | "ka" | "kr" | "vp" | "cr" | "ch" | "cs" | "co" | "rs";

export interface CanvasItem {
  id: string;
  text: string;
  /** Flagged items still need real-world customer testing. */
  isAssumption: boolean;
}

export type CanvasBlocks = Record<BmcBlockId, CanvasItem[]>;

export interface CanvasVersion {
  id: string;
  label: string; // "v1.0"
  note: string;
  savedAt: string; // ISO
  blocks: CanvasBlocks;
}

export interface BusinessModelCanvas {
  /** Working copy — what the grid and the discovery wizard edit. */
  blocks: CanvasBlocks;
  /** Saved snapshots, newest first. */
  versions: CanvasVersion[];
  lastSavedAt: string | null; // ISO
  /** True when the working copy differs from the latest saved version. */
  dirty: boolean;
}

export interface BmcBlockMeta {
  id: BmcBlockId;
  /** Position in the classic numbered canvas (1 = Customer Segments). */
  number: number;
  name: string;
  shortName: string;
  description: string;
  guidingQuestions: string[];
  suggestions: string[];
  /** Conversational question used by the Idea Discovery wizard. */
  wizardQuestion: string;
  wizardHint: string;
  placeholder: string;
}

/* ------------------------------------------------------------------ */
/* Execution Hub                                                       */
/* ------------------------------------------------------------------ */

export const TASK_STATUSES = ["To Do", "In Progress", "Completed"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface RoadmapTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  startDate: string; // ISO date (yyyy-mm-dd)
  endDate: string; // ISO date (yyyy-mm-dd)
  /** Id of a task that must finish before this one starts. */
  dependsOn: string | null;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  /** 1-based, inclusive week range relative to the roadmap start date. */
  startWeek: number;
  endWeek: number;
  tasks: RoadmapTask[];
}

export type RoadmapTemplateId = "mvp-launch" | "validation-sprint" | "gtm-launch" | "fundraising";

export interface RoadmapTemplateMeta {
  id: RoadmapTemplateId;
  name: string;
  description: string;
  durationWeeks: number;
}

export interface ExecutionPlan {
  activeTemplate: RoadmapTemplateId;
  /** Monday the roadmap starts on (ISO date). Week 1 begins here. */
  startDate: string;
  roadmaps: Record<RoadmapTemplateId, Milestone[]>;
}

/* ------------------------------------------------------------------ */
/* Team & Collaboration                                                */
/* ------------------------------------------------------------------ */

export const MEMBER_CATEGORIES = [
  "Founder",
  "Co-founder",
  "Research Lead",
  "Product & Tech",
  "Finance Lead",
  "Marketing & Outreach",
  "Advisor / Mentor",
] as const;
export type MemberCategory = (typeof MEMBER_CATEGORIES)[number];

export type MemberStatus = "Active" | "Invited";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  title: string;
  category: MemberCategory;
  status: MemberStatus;
  isOwner: boolean;
  canRead: boolean;
  canWrite: boolean;
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

export interface VentureNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string; // ISO
  read: boolean;
  href?: string;
}

export type JourneyStepStatus = "Completed" | "In Progress" | "Upcoming";

export interface JourneyStep {
  key: "discover" | "model" | "execution" | "team";
  title: string;
  description: string;
  href: string;
  status: JourneyStepStatus;
}
