// lib/venturelab/mockData.ts
// Roadmap templates, blank-venture scaffolding and seed notifications.
// Ventures themselves now come from the backend (see services/venture.services.ts).
import type {
  ExecutionPlan,
  Milestone,
  RoadmapTask,
  RoadmapTemplateId,
  TaskPriority,
  TaskStatus,
  TeamMember,
  Venture,
} from "@/types/venturelab";
import { emptyCanvas, mondayOf, toISODate, uid, weekRange } from "./utils";
import { ROADMAP_TEMPLATES } from "./constants";

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */


function task(
  start: string,
  title: string,
  weeks: [number, number],
  opts: { status?: TaskStatus; priority?: TaskPriority; assigneeId?: string | null; dependsOn?: string | null; id?: string } = {},
): RoadmapTask {
  const { startDate, endDate } = weekRange(start, weeks[0], weeks[1]);
  return {
    id: opts.id ?? uid("t"),
    title,
    status: opts.status ?? "To Do",
    priority: opts.priority ?? "Medium",
    assigneeId: opts.assigneeId ?? null,
    startDate,
    endDate,
    dependsOn: opts.dependsOn ?? null,
  };
}

function milestone(title: string, description: string, weeks: [number, number], tasks: RoadmapTask[]): Milestone {
  return { id: uid("m"), title, description, startWeek: weeks[0], endWeek: weeks[1], tasks };
}

/** Generic starter milestones for a template (all To Do). */
export function templateMilestones(id: RoadmapTemplateId, start: string, ownerId: string | null): Milestone[] {
  const t = (title: string, w: [number, number], priority: TaskPriority = "Medium") =>
    task(start, title, w, { priority, assigneeId: ownerId });

  switch (id) {
    case "mvp-launch":
      return [
        milestone("Problem Research", "Confirm the problem is real and painful.", [1, 2], [
          t("Interview 15 target customers", [1, 1], "High"),
          t("Document current workarounds", [1, 2]),
          t("Write a one-line problem statement", [2, 2]),
        ]),
        milestone("Business Model Finalization", "Lock v1.0 of the canvas.", [3, 4], [
          t("Complete all 9 canvas blocks", [3, 3], "High"),
          t("Test pricing with 10 customers", [3, 4]),
          t("Review canvas with a mentor", [4, 4]),
        ]),
        milestone("MVP Planning", "Decide the smallest thing worth building.", [5, 6], [
          t("Define MVP feature scope", [5, 5], "High"),
          t("Sketch wireframes", [5, 6]),
          t("Choose tech stack", [6, 6]),
        ]),
        milestone("MVP Development", "Build, test, and put it in front of users.", [7, 9], [
          t("Build core feature", [7, 8], "High"),
          t("Internal testing", [8, 8]),
          t("Pilot with first users", [9, 9], "High"),
        ]),
      ];
    case "validation-sprint":
      return [
        milestone("Assumption Mapping", "List and rank what must be true.", [1, 1], [
          t("List top 10 assumptions from canvas", [1, 1], "High"),
          t("Rank by risk vs. evidence", [1, 1]),
        ]),
        milestone("Customer Discovery", "Talk to real people, not friends.", [2, 3], [
          t("Recruit 20 interviewees", [2, 2], "High"),
          t("Run problem interviews", [2, 3], "High"),
          t("Build a landing page smoke test", [3, 3]),
        ]),
        milestone("Synthesis & Decision", "Persevere, pivot, or pause.", [4, 4], [
          t("Summarise interview evidence", [4, 4]),
          t("Update canvas with learnings", [4, 4]),
          t("Go / no-go decision", [4, 4], "Urgent"),
        ]),
      ];
    case "gtm-launch":
      return [
        milestone("Positioning", "Who it’s for and why it wins.", [1, 2], [
          t("Choose a beachhead segment", [1, 1], "High"),
          t("Write positioning statement", [1, 2]),
        ]),
        milestone("Channel Experiments", "Find one channel that works.", [3, 4], [
          t("Run 3 low-cost channel tests", [3, 4], "High"),
          t("Track cost per signup", [3, 4]),
        ]),
        milestone("Launch", "Ship it publicly and learn fast.", [5, 6], [
          t("Prepare launch assets", [5, 5]),
          t("Public launch", [6, 6], "Urgent"),
          t("Reach first 100 users", [6, 6], "High"),
        ]),
      ];
    case "fundraising":
      return [
        milestone("Traction Story", "Know your numbers cold.", [1, 2], [
          t("Define 3 core metrics", [1, 1], "High"),
          t("Build a simple metrics dashboard", [1, 2]),
        ]),
        milestone("Pitch Materials", "Deck, one-pager, and demo.", [3, 5], [
          t("Draft 12-slide pitch deck", [3, 4], "High"),
          t("Record 2-minute demo video", [4, 5]),
          t("Mock pitch with mentors", [5, 5]),
        ]),
        milestone("Investor Pipeline", "Warm intros beat cold emails.", [6, 8], [
          t("Shortlist 30 relevant investors", [6, 6]),
          t("Secure 10 warm introductions", [6, 7], "High"),
          t("Run first-round meetings", [7, 8], "High"),
        ]),
      ];
  }
}

function executionPlan(
  start: string,
  active: RoadmapTemplateId,
  ownerId: string | null,
  overrides: Partial<Record<RoadmapTemplateId, Milestone[]>> = {},
): ExecutionPlan {
  const roadmaps = {} as Record<RoadmapTemplateId, Milestone[]>;
  (Object.keys(ROADMAP_TEMPLATES) as RoadmapTemplateId[]).forEach((id) => {
    roadmaps[id] = overrides[id] ?? templateMilestones(id, start, ownerId);
  });
  return { activeTemplate: active, startDate: start, roadmaps };
}

function ownerMember(name: string, email: string): TeamMember {
  return {
    id: uid("tm"),
    name,
    email,
    title: "Founder & CEO",
    category: "Founder",
    status: "Active",
    isOwner: true,
    canRead: true,
    canWrite: true,
  };
}

/* ------------------------------------------------------------------ */
/* Blank venture scaffold                                              */
/* ------------------------------------------------------------------ */

/**
 * Local scaffold for a venture whose summary comes from the backend. Canvas,
 * roadmap and team stay local until those tabs get their own APIs.
 */
export function createBlankVenture(
  input: { id?: string; name: string; sector: string; stage: string; description: string; archived?: boolean; createdAt?: string; updatedAt?: string },
  ownerName: string,
  ownerEmail: string,
): Venture {
  const now = new Date();
  const start = toISODate(mondayOf(now)); // roadmap starts this week
  const owner = ownerMember(ownerName, ownerEmail);
  return {
    id: input.id ?? uid("v"),
    name: input.name,
    sector: input.sector,
    stage: input.stage,
    description: input.description,
    rawIdea: "",
    archived: input.archived ?? false,
    createdAt: input.createdAt ?? now.toISOString(),
    updatedAt: input.updatedAt ?? now.toISOString(),
    canvas: { blocks: emptyCanvas(), versions: [], lastSavedAt: null, dirty: false },
    execution: executionPlan(start, "validation-sprint", owner.id),
    team: [owner],
  };
}
