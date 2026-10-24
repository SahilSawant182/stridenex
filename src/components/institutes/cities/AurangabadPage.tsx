import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Clock3,
  Cog,
  GraduationCap,
  Handshake,
  MapPin,
  Network,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/students/management-careers/Reveal";
import AnimatedStatValue from "@/components/students/management-careers/AnimatedStatValue";

const challenges = [
  {
    title: "SEZ opportunities are not visible enough",
    description:
      "The Aurangabad IT SEZ is home to 200+ technology companies, yet students may not know those employers or their openings; SEZ companies do not recruit on campus.",
  },
  {
    title: "Industry and college networks are disconnected",
    description:
      "TPOs often lack SEZ contacts and SEZ companies may not know Aurangabad colleges exist, leaving a gap between colleges and a separate employer ecosystem.",
  },
  {
    title: "Cross-disciplinary skills go unnoticed",
    description:
      "Mechanical, electrical, civil, and IT students can connect engineering fundamentals to robotics, IoT, embedded systems, and smart infrastructure; 60% of students have hands-on skills SEZ companies want.",
  },
  {
    title: "City perceptions can limit discovery",
    description:
      "Students may see Aurangabad as an old industrial city rather than a technology hub and assume they must move to Bangalore, despite local robotics, IoT, automation, and smart-manufacturing roles.",
  },
  {
    title: "Students assume relocation is the only route",
    description:
      "Students may pay ₹15K/month in Bangalore rent without knowing SEZ companies in Aurangabad are hiring freshers for ₹2.2L–₹3L to build robotics technology.",
  },
  {
    title: "Placement teams are disconnected from the SEZ",
    description:
      "College reputations can remain tied to an outdated declining-industry image, alumni networks scatter, and TPO teams lack the contacts needed to show students the local technology employers.",
  },
];

const pillars = [
  {
    icon: Cog,
    title: "Manufacturing-tech talent profiles",
    description:
      "Profile 450+ students across Aurangabad colleges and map mechanical-to-robotics, electrical-to-IoT/embedded, and civil-to-smart-infrastructure potential. 60% of students have hands-on skills valued by SEZ companies.",
  },
  {
    icon: Building2,
    title: "SEZ and regional employer access",
    description:
      "The 60+ partners include IT SEZ robotics, automation, IoT, and smart-manufacturing firms; Bangalore robotics and Mumbai automation employers; L&T, Bajaj, and Godrej plants; and hardware/software startups building drones and edge devices.",
  },
  {
    icon: Target,
    title: "Cross-disciplinary matching",
    description:
      "Match combinations such as mechanical engineering plus robotics projects, electrical engineering plus embedded systems, and civil engineering plus IoT to teams building hybrid hardware/software products.",
  },
  {
    icon: Handshake,
    title: "Mentors with local industry experience",
    description:
      "The 90+ Aurangabad-native mentors include engineers now at SEZ companies, local startup founders, and technology leads at Godrej, L&T, and Bajaj; they coach on interviews, SEZ culture, and hardware/software communication.",
  },
];

const journey = [
  {
    week: "Week 1",
    title: "College partnership",
    description:
      "Integrate with the placement ecosystem, set up the TPO dashboard for profiles, SEZ matches, and tracking, and brief the team on SEZ companies, roles, and salary bands.",
  },
  {
    week: "Week 2",
    title: "Student onboarding",
    description:
      "Students map manufacturing and technology skills—for example, a mechanical engineer with robotics projects interested in automation and IoT—and AI searches the SEZ company database for matches.",
  },
  {
    week: "Week 3",
    title: "Mentor introduction",
    description:
      "A student can meet a BATU graduate from 2020 who is now a robotics-startup tech lead in the SEZ. The mentor explains company culture, products, interview expectations, and hardware/software integration.",
  },
  {
    week: "Week 4",
    title: "SEZ employer introductions",
    description:
      "Hiring managers receive a profile that explains why a student’s projects and discipline fit. Students receive company, technology-stack, culture, and interview context.",
  },
  {
    week: "Week 5",
    title: "Interviews and offers",
    description:
      "Students interview with mentor coaching; fresher offers are typically ₹2.2L–₹2.8L, with guidance on local salary rates, equity potential, and learning opportunities.",
  },
  {
    week: "Week 6",
    title: "Joining and community",
    description:
      "Students start SEZ roles close to home, refer classmates, and help the TPO show that Aurangabad offers technology opportunities.",
  },
];

const outcomes = [
  { value: "450+", label: "Aurangabad students placed in the last 12 months" },
  { value: "22+", label: "Aurangabad colleges integrated or onboarding" },
  { value: "60+", label: "SEZ and manufacturing-tech employers" },
  { value: "58%", label: "placed within 90 days of starting the journey" },
  { value: "₹2.35L", label: "average package reported for Aurangabad placements" },
  { value: "65%", label: "placements valuing hands-on, cross-disciplinary skills" },
];

const stories = [
  {
    name: "Aditya S.",
    college: "BATU",
    role: "Robotics Engineer",
    company: "Drone automation startup · SEZ",
    quote:
      "BATU is solid, but everyone thinks it is old-school manufacturing and no technology companies visit. I wanted to build robots. StrideNex showed me eight Aurangabad SEZ robotics startups. I chose one building drone automation, received ₹2.4L plus equity, and now build cutting-edge technology 10 minutes from home.",
  },
  {
    name: "Priya K.",
    college: "PCCOE Aurangabad",
    role: "Embedded Systems Engineer",
    company: "IoT platform · SEZ",
    quote:
      "Electrical engineering seemed limited to power-systems design, but I wanted IoT and embedded systems. With no technology companies on campus, I was matched to an SEZ IoT platform company and received ₹2.1L. Now I solve real problems in Aurangabad.",
  },
  {
    name: "Rohit M.",
    college: "Aurangabad Institute of Technology",
    role: "Backend Engineer",
    company: "Manufacturing platform · SEZ",
    quote:
      "An IT student in Aurangabad seemed to have only online service-company roles. StrideNex showed me SEZ automation-software companies. I interviewed with a smart-manufacturing startup and received ₹2.3L.",
  },
  {
    name: "Sneha R.",
    college: "Dr. Babasaheb Ambedkar Technological University",
    role: "Vision Systems Engineer",
    company: "Robotics company · SEZ",
    quote:
      "I had a mechanical degree but loved coding; campus had neither manufacturing nor technology companies. StrideNex matched my hybrid skills with an SEZ robotics company building vision systems. I received ₹2.2L.",
  },
  {
    name: "Karan P.",
    college: "Private college, Aurangabad",
    role: "IoT Systems Engineer",
    company: "Smart building startup",
    quote:
      "Civil engineering seemed limited to construction, but I had built IoT projects. StrideNex matched me with a smart-building startup, where I received ₹2.1L and now build IoT infrastructure for smart buildings.",
  },
];

const comparisonRows = [
  ["Local company access", "10–15 service-company visits/year", "No local access", "60+ SEZ and local employers"],
  ["Manufacturing-tech bridge", "No", "No", "Purpose-built"],
  ["SEZ relationships", "None", "None", "Direct partnerships"],
  ["Mentorship", "None", "None", "90+ SEZ-rooted mentors"],
  ["Timeline", "6+ months", "3–6 months", "6 weeks"],
  ["Cost to live", "Not applicable", "High in Bangalore", "Low in Aurangabad"],
  ["Learning", "Service roles, limited scope", "Variable", "Innovation with SEZ startups"],
  ["College integration", "Direct campus process", "No integration", "Full dashboard"],
];

const placementSupport = [
  {
    icon: GraduationCap,
    title: "Include more engineering branches",
    copy: "Help students from mechanical, electrical, IT, civil, and other disciplines explore roles connected to their strengths.",
  },
  {
    icon: Network,
    title: "Connect with the SEZ ecosystem",
    copy: "Give placement teams a structured way to engage local employers and understand their hiring needs.",
  },
  {
    icon: BarChart3,
    title: "Track student progress",
    copy: "Follow profiles, matches, introductions, interviews, and placement outcomes through the TPO dashboard.",
  },
  {
    icon: Clock3,
    title: "Begin with a focused pilot",
    copy: "Start with a small group of interested students, review the experience, and expand based on college priorities.",
  },
];

const spotlight = [
  {
    title: "Robotics startup cluster",
    details: [
      "Three robotics startups are active on StrideNex, connecting mechanical and software engineers for hardware and control-software work.",
      "25 students have been placed in robotics roles, contributing to an emerging Aurangabad robotics identity.",
    ],
  },
  {
    title: "Manufacturing platform collaboration",
    details: [
      "Smart manufacturing and Industry 4.0 companies use StrideNex.",
      "The focus includes IT students and backend engineering roles.",
      "70% of students are placed within 90 days, with an average package of ₹2.4L.",
    ],
  },
];

const faqs = [
  {
    question: "Is the IT SEZ hiring fresh engineers?",
    answer:
      "The SEZ has 60+ active companies, many of which grew between 2022 and 2024. Their lean teams of 15–100 people hire technical roles continually.",
  },
  {
    question: "Will students still want to leave for Bangalore?",
    answer:
      "Some will. 65% stay Aurangabad-based, with the SEZ offering learning opportunities, lower living costs, and proximity to family.",
  },
  {
    question: "Will SEZ manufacturing companies provide real technology experience?",
    answer:
      "Manufacturing and technology work brings students into hardware constraints, real-world edge cases, and deployed systems, in areas including automation, IoT, and smart manufacturing.",
  },
  {
    question: "Does Aurangabad have a startup culture?",
    answer:
      "There are 40+ VC-funded startups in and around the SEZ, positioning Aurangabad as a manufacturing-technology hub.",
  },
  {
    question: "How can we compare an SEZ role with a Bangalore role?",
    answer:
      "Compare learning opportunity, cost of living, family proximity, innovation, and equity potential, then let each student choose.",
  },
  {
    question: "Can StrideNex also help students find Bangalore roles?",
    answer:
      "Yes. StrideNex also has 150+ Bangalore companies. The city pathway encourages students to explore Aurangabad first; one or two years of manufacturing-tech experience can also support a later move.",
  },
  {
    question: "Is the Aurangabad IT SEZ hiring early-career engineers?",
    answer:
      "Technology and manufacturing-tech employers are actively hiring. Specific openings and requirements change, so colleges should confirm current roles during a partnership discussion.",
  },
  {
    question: "Do students need to stay in Aurangabad?",
    answer:
      "No. Students can explore local opportunities as well as roles in other cities. The local advantage is access to nearby employers and the chance to build relevant experience close to home.",
  },
  {
    question: "Will SEZ roles provide relevant technology experience?",
    answer:
      "Roles span areas such as automation, IoT, embedded systems, software, and smart manufacturing. Students should review each role’s responsibilities and team before applying.",
  },
  {
    question: "Is the programme limited to mechanical and electrical students?",
    answer:
      "No. Opportunities are available for IT, civil, and other disciplines where the student’s projects and skills fit the employer’s needs.",
  },
  {
    question: "How can students combine engineering and software interests?",
    answer:
      "Students can present projects and practical work that connect their discipline to technology, then explore roles where employers value that combination.",
  },
  {
    question: "What if our college has not placed students in the SEZ before?",
    answer:
      "A focused pilot can help the college introduce students to relevant employers, understand role requirements, and establish a placement pathway.",
  },
  {
    question: "Can we start with a smaller student group?",
    answer:
      "Yes. The college can discuss a pilot cohort and review progress with StrideNex before deciding whether to expand.",
  },
];

const aurangabadAdvantages = [
  "The IT SEZ grew to 200+ companies between 2019 and 2024, creating 5,000+ technology jobs.",
  "SEZ companies struggle to hire, while colleges produce 1,000+ engineers a year and few students know about the SEZ.",
  "A first-mover college can build its SEZ relationship now, ahead of other colleges expected to copy the approach within 18 months.",
  "Building a local alumni network can establish Aurangabad as an SEZ placement college and create a lasting employer connection.",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700 sm:text-sm">
      {children}
    </p>
  );
}

function DemoLink({ children }: { children: React.ReactNode }) {
  return (
    <Button
      asChild
      variant="accent"
      size="lg"
      className="min-h-12 rounded-xl px-5 py-3 text-sm font-bold shadow-lg shadow-accent/20 transition hover:-translate-y-0.5"
    >
      <Link href="/contact-us?interest=institute-aurangabad">
        {children}
        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function AurangabadPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Engineering College Placements in Aurangabad | StrideNex",
    description:
      "Explore placement pathways for Aurangabad colleges, connecting engineering talent with IT SEZ and manufacturing-tech employers.",
    url: "https://stridenex.ai/institutes/cities/aurangabad/",
    about: {
      "@type": "Place",
      name: "Aurangabad, Maharashtra, India",
    },
  };

  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 px-6 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,#c2410c_1px,transparent_0)] [background-size:40px_40px]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary shadow-sm sm:text-sm">
              <MapPin aria-hidden="true" className="h-4 w-4 text-accent" />
              Institute partnerships · Aurangabad, Maharashtra
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              IT SEZ placements{" "}
              <span className="bg-gradient-to-r from-primary via-orange-700 to-accent bg-clip-text text-transparent">
                start here
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Aurangabad is becoming a manufacturing-tech hub, with companies
              in the IT SEZ building hardware and software. Yet students may
              think their options are Bangalore or unemployment. StrideNex
              connects local talent with 60+ companies in and around the SEZ,
              including robotics, IoT, automation, and smart manufacturing.
              More than 450 Aurangabad students landed roles in the last year.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              These are innovation teams building products and intellectual
              property—not only service-company roles.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DemoLink>Request a college demo</DemoLink>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-12 rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
              >
                <Link href="#aurangabad-stories">
                  See Aurangabad success stories
                  <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Local SEZ employer connections
              </span>
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Engineering and technology roles
              </span>
            </div>
          </div>

          <Reveal
            className="mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"
            delay={0.12}
            direction="right"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white p-6 shadow-2xl shadow-amber-950/10 sm:rounded-[2rem] sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-200/50 blur-3xl"
              />
              <div className="relative">
                <Eyebrow>Aurangabad · engineering meets technology</Eyebrow>
                <h2 className="mt-3 max-w-sm text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                  Connect what students know with what local employers build.
                </h2>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      branch: "Mechanical",
                      pathway: "Automation and robotics",
                      icon: Cog,
                    },
                    {
                      branch: "Electrical",
                      pathway: "IoT and embedded systems",
                      icon: Network,
                    },
                    {
                      branch: "Information technology",
                      pathway: "Platforms and software",
                      icon: Sparkles,
                    },
                    {
                      branch: "Civil",
                      pathway: "Smart infrastructure",
                      icon: Building2,
                    },
                  ].map(({ branch, pathway, icon: Icon }) => (
                    <div
                      key={branch}
                      className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <p className="mt-4 font-bold text-slate-900">{branch}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {pathway}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-600">
                  <Users aria-hidden="true" className="h-5 w-5 text-primary" />
                  A clearer route from college projects to employer needs
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="The Aurangabad opportunity"
          badgeColor="accent"
          title="Strong engineering talent. An ecosystem still to discover."
          subtitle="The region’s industrial experience and growing technology companies can create new pathways when colleges and employers connect."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl">
                <span className="text-sm font-extrabold tracking-widest text-accent">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8" direction="scale">
          <div className="grid gap-5 rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <Eyebrow>For Aurangabad colleges</Eyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Make local technology careers easier to find.
              </h3>
            </div>
            <p className="leading-7 text-slate-600">
              Students may already have relevant projects and practical
              experience, but employers need a way to discover that talent.
              StrideNex helps connect college profiles, local company needs,
              and mentor guidance in one placement pathway.
            </p>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="The Aurangabad impact system"
          title="Bridge engineering fundamentals and technology roles"
          subtitle="Four supports help students show how their discipline and hands-on experience can meet the needs of the IT SEZ and regional employers."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {pillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="flex h-full gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-950">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8" direction="scale">
          <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <Eyebrow>Aurangabad SEZ student journey</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold">
                  From practical project to a role that fits
                </h3>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  "Student shares engineering skills and hands-on projects",
                  "StrideNex identifies matching IT SEZ opportunities",
                  "A local mentor helps the student prepare",
                  "Student meets an employer building technology products",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-xl bg-white/[0.07] p-4 text-sm leading-6 text-slate-200"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-white">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="A six-week pathway"
          badgeColor="accent"
          title="From college onboarding to an SEZ role"
          subtitle="A structured process connects the placement team, students, mentors, and local employers."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((step, index) => (
            <Reveal key={step.week} delay={index * 0.04}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                  {step.week}
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="gradient">
        <SectionHeader
          badge="Aurangabad outcomes"
          title="Engineering talent finding innovation-focused roles"
          subtitle="A snapshot of student reach, employer connections, and placement outcomes in Aurangabad."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.04} direction="scale">
              <article className="h-full rounded-2xl border border-white bg-white/90 p-6 text-center shadow-sm">
                <p className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                  <AnimatedStatValue value={item.value} />
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {item.label}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div id="aurangabad-stories" className="scroll-mt-28 pt-20">
          <SectionHeader
            badge="Student stories"
            badgeColor="accent"
            title="Different disciplines. New technology pathways."
            subtitle="Examples of students connecting their engineering background with opportunities in the region."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story, index) => (
              <Reveal key={story.name} delay={(index % 3) * 0.05}>
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <Sparkles aria-hidden="true" className="h-5 w-5 text-accent" />
                  <blockquote className="mt-4 flex-1 leading-7 text-slate-700">
                    “{story.quote}”
                  </blockquote>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <p className="font-bold text-slate-950">{story.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{story.college}</p>
                    <p className="mt-3 text-sm font-semibold text-primary">
                      {story.role} · {story.company}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="A complementary model"
          badgeColor="accent"
          title="Local innovation roles, alongside campus hiring"
          subtitle="StrideNex can help colleges connect with the local SEZ ecosystem while continuing their existing placement activities."
        />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th scope="col" className="p-4 font-bold">Factor</th>
                <th scope="col" className="p-4 font-bold">Campus drive</th>
                <th scope="col" className="p-4 font-bold">National portals</th>
                <th scope="col" className="p-4 font-bold text-orange-200">StrideNex</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr
                  key={row[0]}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  {row.map((cell, cellIndex) => {
                    const Cell = cellIndex === 0 ? "th" : "td";
                    return (
                      <Cell
                        key={cellIndex}
                        scope={cellIndex === 0 ? "row" : undefined}
                        className={`border-t border-slate-100 p-4 leading-6 ${
                          cellIndex === 0
                            ? "font-bold text-slate-900"
                            : cellIndex === 3
                              ? "font-semibold text-primary"
                              : "text-slate-600"
                        }`}
                      >
                        {cell}
                      </Cell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Help students discover local SEZ opportunities.",
            "Connect engineering projects to employer role requirements.",
            "Offer mentor support for interviews and role context.",
            "Give TPOs visibility into student matching and progress.",
          ].map((item) => (
            <p key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
              <Check
                aria-hidden="true"
                className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
              />
              {item}
            </p>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="For placement teams"
          title="Make the local industry-tech bridge part of your placement plan"
          subtitle="Help students find employers close to home while giving the TPO team tools to coordinate their progress."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {placementSupport.map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 0.05}>
              <article className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="gradient">
        <Reveal direction="scale">
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-amber-950/10 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-14">
            <div>
              <Eyebrow>Why Aurangabad, why now?</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                Connect local engineering talent to a growing technology ecosystem.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                Students, colleges, and local employers can build a stronger
                connection as the region’s IT SEZ and manufacturing-tech
                companies grow.
              </p>
            </div>
            <ul className="grid gap-3">
              {aurangabadAdvantages.map((advantage) => (
                <li
                  key={advantage}
                  className="flex gap-3 rounded-xl bg-white/[0.07] p-4 leading-6 text-slate-200"
                >
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-emerald-400"
                  />
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="white">
        <div id="aurangabad-college-spotlight" className="scroll-mt-28">
          <SectionHeader
            badge="College and employer spotlight"
            badgeColor="accent"
            title="Local industry partnerships creating new pathways"
            subtitle="Examples of how employers and colleges can connect students to technology roles in Aurangabad."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {spotlight.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <Eyebrow>Aurangabad ecosystem example</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                  {item.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {item.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex gap-3 leading-7 text-slate-600"
                    >
                      <Check
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="Common questions"
          badgeColor="accent"
          title="Aurangabad placement objections and FAQs"
          subtitle="Learn how local SEZ roles and manufacturing-tech opportunities can fit into your placement programme."
        />
        <div className="mx-auto max-w-4xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-bold text-slate-900 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {faq.question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-open:rotate-45">
                  <span
                    aria-hidden="true"
                    className="text-xl font-normal leading-none"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="max-w-3xl pt-4 leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        bgColor="primary-gradient"
        className="relative isolate overflow-hidden"
      >
        <div className="grid gap-8 text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-200">
              Build Aurangabad’s SEZ pathway
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Help your students find their place in local innovation.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Start with a 30-minute call, see Aurangabad profiles and SEZ
              matches in the live dashboard, meet the SEZ mentor panel, pilot
              with 15–20 students, and then scale to the full college.
            </p>
          </div>
          <DemoLink>Request a college demo</DemoLink>
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="white" spacing="compact">
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8">
          <div>
            <Eyebrow>Explore more</Eyebrow>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-950">
              Connected pathways
            </h2>
          </div>
          <div className="grid gap-3">
            {[
              {
                label: "How skill assessment works",
                href: "/insights/ai-skill-assessment/",
              },
              {
                label: "Explore engineering career pathways",
                href: "/students/engineering-careers/",
              },
              {
                label: "Talk to StrideNex",
                href: "/contact-us?interest=institute-aurangabad",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 font-semibold text-primary transition hover:bg-primary/[0.06]"
              >
                {item.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
