// lib/venturelab/mockData.ts
// Seed data for instant preview. Dates are generated relative to "now" so the
// showcase roadmap always has today sitting inside Week 6 (MVP Planning).
import { subDays, subHours, subMinutes } from "date-fns";
import type {
  CanvasBlocks,
  CanvasItem,
  ExecutionPlan,
  Milestone,
  RoadmapTask,
  RoadmapTemplateId,
  TaskPriority,
  TaskStatus,
  TeamMember,
  Venture,
  VentureNotification,
} from "@/types/venturelab";
import { cloneBlocks, emptyCanvas, mondayOf, toISODate, uid, weekRange } from "./utils";
import { ROADMAP_TEMPLATES } from "./constants";

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

const item = (text: string, isAssumption = false): CanvasItem => ({ id: uid("ci"), text, isAssumption });

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
/* Showcase: DairyConnect                                              */
/* ------------------------------------------------------------------ */

function dairyConnect(now: Date): Venture {
  const start = toISODate(subDays(mondayOf(now), 35)); // today ⇒ week 6

  const aarav = ownerMember("Aarav Kulkarni", "aarav.kulkarni@stridenex.edu");
  const sneha: TeamMember = {
    id: uid("tm"),
    name: "Sneha Nair",
    email: "sneha.nair@stridenex.edu",
    title: "Tech Lead",
    category: "Product & Tech",
    status: "Active",
    isOwner: false,
    canRead: true,
    canWrite: true,
  };
  const rohan: TeamMember = {
    id: uid("tm"),
    name: "Rohan Patil",
    email: "rohan.patil@stridenex.edu",
    title: "Marketing & Operations",
    category: "Marketing & Outreach",
    status: "Active",
    isOwner: false,
    canRead: true,
    canWrite: true,
  };
  const meera: TeamMember = {
    id: uid("tm"),
    name: "Dr. Meera Joshi",
    email: "meera.joshi@agri-incubator.in",
    title: "Advisor — Veterinary Science",
    category: "Advisor / Mentor",
    status: "Invited",
    isOwner: false,
    canRead: true,
    canWrite: false,
  };

  const T = (title: string, w: [number, number], status: TaskStatus, priority: TaskPriority, who: TeamMember, dependsOn: string | null = null, id?: string) =>
    task(start, title, w, { status, priority, assigneeId: who.id, dependsOn, id });

  const interviewId = uid("t");
  const scopeId = uid("t");
  const stackId = uid("t");
  const recordsId = uid("t");

  const mvp: Milestone[] = [
    milestone("Problem Research", "Validate that manual record keeping is costing farmers money.", [1, 2], [
      T("Interview 20 dairy farmers in Nashik district", [1, 1], "Completed", "High", aarav, null, interviewId),
      T("Map current paper-based record keeping", [1, 2], "Completed", "Medium", rohan),
      T("Quantify losses from missed vaccinations", [2, 2], "Completed", "High", aarav, interviewId),
    ]),
    milestone("Business Model Finalization", "Lock the canvas and pricing with real farmer feedback.", [3, 4], [
      T("Draft Business Model Canvas v0.9", [3, 3], "Completed", "High", aarav),
      T("Test ₹99/month pricing with 10 farmers", [3, 4], "Completed", "Medium", rohan),
      T("Advisor review & finalize canvas v1.0", [4, 4], "Completed", "Medium", meera),
    ]),
    milestone("MVP Planning", "Decide the smallest app farmers will actually use daily.", [5, 6], [
      T("Define MVP feature scope", [5, 5], "Completed", "High", sneha, null, scopeId),
      T("Design low-fidelity wireframes in Marathi", [5, 6], "In Progress", "Medium", sneha, scopeId),
      T("Choose offline-first tech stack", [6, 6], "In Progress", "High", sneha, scopeId, stackId),
      T("Line up 2 cooperatives for the pilot", [6, 6], "To Do", "Medium", rohan),
    ]),
    milestone("MVP Development", "Build the core app and pilot it with real farms.", [7, 9], [
      T("Build livestock records module", [7, 8], "To Do", "High", sneha, stackId, recordsId),
      T("Build daily milk production log", [7, 8], "To Do", "High", sneha, stackId),
      T("SMS vaccination reminders", [8, 9], "To Do", "Urgent", sneha, recordsId),
      T("Pilot with 15 farmers across 2 villages", [9, 9], "To Do", "High", rohan),
    ]),
  ];

  const blocks: CanvasBlocks = {
    cs: [
      item("Small dairy farmers with 5–20 cattle in Maharashtra"),
      item("Village dairy cooperative societies"),
      item("Para-veterinary workers serving clusters of villages", true),
    ],
    vp: [
      item("Digital livestock & milk records on any phone"),
      item("Automatic vaccination & breeding reminders"),
      item("Works offline in low-connectivity villages"),
      item("Marathi and Hindi interface"),
    ],
    ch: [
      item("Cooperative society meetings"),
      item("WhatsApp farmer groups"),
      item("Field agents at milk collection centres", true),
    ],
    cr: [
      item("Assisted onboarding at the collection centre"),
      item("Marathi voice helpline"),
      item("Monthly yield report via SMS"),
    ],
    rs: [
      item("₹99/month per-farm subscription", true),
      item("Cooperative bulk licence — ₹4,999/year"),
      item("Commission on vet appointment bookings", true),
    ],
    kr: [item("Offline-first Android app"), item("Founding tech team"), item("Network of cooperative contacts")],
    ka: [item("App development & maintenance"), item("Farmer onboarding & training"), item("Cooperative partnerships")],
    kp: [
      item("District cooperative milk unions"),
      item("State animal husbandry department"),
      item("College incubation centre"),
    ],
    co: [
      item("Cloud hosting & SMS gateway (~₹6,000/month)"),
      item("Field agent stipends"),
      item("Local-language marketing material"),
    ],
  };

  const v09 = cloneBlocks(blocks);
  v09.vp = v09.vp.slice(0, 2);
  v09.rs = v09.rs.slice(0, 1);
  v09.cr = v09.cr.slice(0, 1);

  return {
    id: "v_dairyconnect",
    name: "DairyConnect",
    sector: "AgriTech",
    stage: "Validation",
    description: "A simple mobile app that helps small dairy farmers track livestock, milk yield and vaccinations.",
    rawIdea:
      "Small dairy farmers lose money because they track livestock records, milk production, and vaccination dates manually on paper.",
    archived: false,
    createdAt: subDays(now, 40).toISOString(),
    updatedAt: subMinutes(now, 12).toISOString(),
    canvas: {
      blocks,
      versions: [
        { id: uid("cv"), label: "v1.0", note: "Advisor-reviewed pricing and relationships", savedAt: subDays(now, 9).toISOString(), blocks: cloneBlocks(blocks) },
        { id: uid("cv"), label: "v0.9", note: "First full draft after farmer interviews", savedAt: subDays(now, 16).toISOString(), blocks: v09 },
      ],
      lastSavedAt: subDays(now, 9).toISOString(),
      dirty: false,
    },
    execution: executionPlan(start, "mvp-launch", aarav.id, { "mvp-launch": mvp }),
    team: [aarav, sneha, rohan, meera],
  };
}

/* ------------------------------------------------------------------ */
/* Supporting ventures                                                 */
/* ------------------------------------------------------------------ */

function mediTrack(now: Date): Venture {
  const start = toISODate(subDays(mondayOf(now), 49));
  const owner = ownerMember("Aarav Kulkarni", "aarav.kulkarni@stridenex.edu");
  const plan = executionPlan(start, "mvp-launch", owner.id);
  // Mark the first ~60% of tasks complete so the card has believable progress.
  plan.roadmaps["mvp-launch"].forEach((m, mi) =>
    m.tasks.forEach((t, ti) => {
      if (mi < 2) t.status = "Completed";
      else if (mi === 2) t.status = ti === 0 ? "Completed" : "In Progress";
    }),
  );
  const blocks = emptyCanvas();
  blocks.cs = [item("Elderly parents living alone"), item("Adult children working in other cities")];
  blocks.vp = [item("Medicine reminders with family alerts"), item("Auto refill reorder from local pharmacy", true)];
  blocks.ch = [item("Pharmacy counter QR codes"), item("Housing society notice boards")];
  blocks.cr = [item("Family dashboard"), item("Monthly health summary")];
  blocks.rs = [item("₹149/month family plan", true)];
  blocks.kr = [item("Pharmacy partner network")];
  blocks.ka = [item("Pharmacy onboarding")];
  blocks.kp = [item("Neighbourhood pharmacies")];

  return {
    id: "v_meditrack",
    name: "MediTrack Lite",
    sector: "HealthTech",
    stage: "Development",
    description: "Medicine reminders and refill tracking for elderly parents, with alerts for family.",
    rawIdea: "Elderly parents miss doses and run out of medicines when their children live far away.",
    archived: false,
    createdAt: subDays(now, 60).toISOString(),
    updatedAt: subHours(now, 26).toISOString(),
    canvas: {
      blocks,
      versions: [{ id: uid("cv"), label: "v1.0", note: "Initial canvas", savedAt: subDays(now, 20).toISOString(), blocks: cloneBlocks(blocks) }],
      lastSavedAt: subDays(now, 20).toISOString(),
      dirty: false,
    },
    execution: plan,
    team: [
      owner,
      {
        id: uid("tm"),
        name: "Ishita Deshmukh",
        email: "ishita.d@stridenex.edu",
        title: "Product Designer",
        category: "Product & Tech",
        status: "Active",
        isOwner: false,
        canRead: true,
        canWrite: true,
      },
    ],
  };
}

function campusKart(now: Date): Venture {
  const start = toISODate(mondayOf(now));
  const owner = ownerMember("Aarav Kulkarni", "aarav.kulkarni@stridenex.edu");
  const plan = executionPlan(start, "validation-sprint", owner.id);
  plan.roadmaps["validation-sprint"][0].tasks[0].status = "In Progress";
  const blocks = emptyCanvas();
  blocks.cs = [item("First-year hostel students", true)];
  blocks.vp = [item("Buy used textbooks at half price")];
  return {
    id: "v_campuskart",
    name: "CampusKart",
    sector: "E-commerce",
    stage: "Ideation",
    description: "Peer-to-peer marketplace for used textbooks and hostel essentials on campus.",
    rawIdea: "Seniors throw away books and hostel gear that juniors buy new every year.",
    archived: false,
    createdAt: subDays(now, 6).toISOString(),
    updatedAt: subDays(now, 3).toISOString(),
    canvas: { blocks, versions: [], lastSavedAt: null, dirty: true },
    execution: plan,
    team: [owner],
  };
}

function ecoPack(now: Date): Venture {
  const start = toISODate(subDays(mondayOf(now), 120));
  const owner = ownerMember("Aarav Kulkarni", "aarav.kulkarni@stridenex.edu");
  return {
    id: "v_ecopack",
    name: "EcoPack",
    sector: "CleanTech",
    stage: "Ideation",
    description: "Compostable food packaging made from agricultural waste for campus canteens.",
    rawIdea: "Canteens use plastic containers that end up in campus drains.",
    archived: true,
    createdAt: subDays(now, 130).toISOString(),
    updatedAt: subDays(now, 95).toISOString(),
    canvas: { blocks: emptyCanvas(), versions: [], lastSavedAt: null, dirty: false },
    execution: executionPlan(start, "validation-sprint", owner.id),
    team: [owner],
  };
}

/* ------------------------------------------------------------------ */
/* Public seed                                                         */
/* ------------------------------------------------------------------ */

export function createSeedVentures(now = new Date()): Venture[] {
  return [dairyConnect(now), mediTrack(now), campusKart(now), ecoPack(now)];
}

export function createSeedNotifications(now = new Date()): VentureNotification[] {
  return [
    {
      id: uid("n"),
      title: "Sneha moved a task to In Progress",
      body: "“Choose offline-first tech stack” — DairyConnect",
      createdAt: subMinutes(now, 18).toISOString(),
      read: false,
      href: "/venturelab/execution",
    },
    {
      id: uid("n"),
      title: "Invite pending",
      body: "Dr. Meera Joshi hasn’t accepted your invite yet.",
      createdAt: subHours(now, 5).toISOString(),
      read: false,
      href: "/venturelab/team",
    },
    {
      id: uid("n"),
      title: "Milestone completed 🎉",
      body: "Business Model Finalization is done for DairyConnect.",
      createdAt: subDays(now, 2).toISOString(),
      read: true,
      href: "/venturelab/execution",
    },
  ];
}

/** Blank venture used by "+ Create New Venture". */
export function createBlankVenture(input: { name: string; sector: string; description: string }, ownerName: string, ownerEmail: string): Venture {
  const now = new Date();
  const start = toISODate(mondayOf(now)); // roadmap starts this week
  const owner = ownerMember(ownerName, ownerEmail);
  return {
    id: uid("v"),
    name: input.name,
    sector: input.sector,
    stage: "Ideation",
    description: input.description,
    rawIdea: "",
    archived: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    canvas: { blocks: emptyCanvas(), versions: [], lastSavedAt: null, dirty: false },
    execution: executionPlan(start, "validation-sprint", owner.id),
    team: [owner],
  };
}
