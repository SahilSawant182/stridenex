import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Clock3,
  GraduationCap,
  Handshake,
  MapPin,
  Monitor,
  Sparkles,
  Target,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/students/management-careers/Reveal";
import AnimatedStatValue from "@/components/students/management-careers/AnimatedStatValue";

const challenges = [
  {
    title: "The crossroads can be overlooked",
    description:
      "Nagpur sits about 450km from Bangalore, 450km from Pune, and 500km from Mumbai. Companies running single-city recruitment drives can skip it, leaving students outside the usual hiring loop.",
  },
  {
    title: "A hub mindset is still emerging",
    description:
      "Students and colleges can see Nagpur as being outside the opportunity network rather than a strategic centre for distributed work.",
  },
  {
    title: "Recruitment is concentrated in metros",
    description:
      "Many employers focus campus activity on larger technology centres, leaving capable students in Nagpur with fewer direct introductions.",
  },
  {
    title: "Alumni connections are dispersed",
    description:
      "Graduates who move to other cities can be difficult to connect with, limiting mentorship and employer introductions for the next cohort.",
  },
  {
    title: "Remote roles are not always visible",
    description:
      "Distributed teams can hire beyond a single city, but students may not know which employers or roles support that way of working.",
  },
  {
    title: "The gap shapes colleges and students",
    description:
      "Placement teams are under-resourced and compete with larger-city TPOs; colleges can be known for good technical education in a supposedly non-tech city. Students may move to Bangalore, take on higher costs, and miss Nagpur-based or remote work.",
  },
];

const pillars = [
  {
    icon: GraduationCap,
    title: "Technical talent profiles",
    description:
      "Profile 650+ students from VNIT, RCOEM, and other Nagpur colleges for technical depth, problem-solving, and readiness. VNIT students bring board-level technical skills that recruiters can undervalue because of geography.",
  },
  {
    icon: Building2,
    title: "Pan-India employer access",
    description:
      "The 100+ hiring companies include Bangalore product companies hiring remotely, Pune technology employers recruiting in Nagpur, Mumbai finance and startups, pan-India remote-first firms such as Slack, Figma, Stripe, and Notion, and growing Nagpur companies.",
  },
  {
    icon: Target,
    title: "Matching without a location penalty",
    description:
      "Match elite technical capability and willingness to work remotely with distributed roles, reducing geography as a filter and positioning Nagpur graduates alongside Bangalore and Pune candidates.",
  },
  {
    icon: Handshake,
    title: "Mentors across India",
    description:
      "The 150+ Nagpur-native mentors include VNIT and RCOEM alumni at companies in Bangalore, Mumbai, Pune, and Hyderabad; Nagpur startup founders; and technology leads at growing local companies.",
  },
];

const journey = [
  {
    week: "Week 1",
    title: "College partnership",
    description:
      "Integrate with the placement ecosystem, give the TPO a dashboard for profiles, pan-India matches, and tracking, and explain the distributed-work opportunity.",
  },
  {
    week: "Week 2",
    title: "Student onboarding",
    description:
      "Students take an elite-tier technical assessment. The onboarding reframes the choice: strong capability can compete globally, and geography need not decide the outcome.",
  },
  {
    week: "Week 3",
    title: "Mentor introduction",
    description:
      "A Nagpur-connected mentor explains how remote work changes geography, briefs the student on distributed-team expectations, and helps them present their strengths.",
  },
  {
    week: "Week 4",
    title: "Employer introductions",
    description:
      "Hiring teams receive the student profile and why it fits; students learn about the company, distributed work culture, and interview.",
  },
  {
    week: "Week 5",
    title: "Interviews and offers",
    description:
      "Students interview with mentor support; elite-tier fresher offers are typically ₹2.4L–₹3.2L, with guidance on remote-market rates, benefits, and growth.",
  },
  {
    week: "Week 6",
    title: "Joining and network",
    description:
      "Students start in Bangalore, Mumbai, Pune, remote, or Nagpur-hybrid roles, refer classmates, and build an alumni pipeline; 50+ Nagpur students across India can create that network.",
  },
];

const outcomes = [
  { value: "650+", label: "Nagpur students placed in the last 18 months" },
  { value: "35+", label: "Nagpur colleges integrated or onboarding" },
  { value: "100+", label: "pan-India and distributed employers" },
  { value: "62%", label: "placed within 90 days of starting the journey" },
  { value: "₹2.52L", label: "average package reported for Nagpur placements" },
  { value: "70%", label: "of the Nagpur cohort from VNIT and RCOEM" },
  { value: "55%", label: "of placements include remote or flexible options" },
];

const stories = [
  {
    name: "Arjun N.",
    college: "VNIT Nagpur",
    role: "Senior Software Engineer",
    company: "Bangalore startup · Remote from Nagpur",
    quote:
      "VNIT is elite, but students assume they must move to Bangalore. I wanted to stay in Nagpur. StrideNex showed me that elite talent plus remote work is valuable to 100+ companies. I joined a Bangalore startup in a fully remote role for ₹2.8L, building world-class technology without rent pressure.",
  },
  {
    name: "Priya R.",
    college: "RCOEM Nagpur",
    role: "Backend Engineer",
    company: "Mumbai fintech · Distributed",
    quote:
      "RCOEM is excellent, but the story was that Nagpur is not a tech city. StrideNex reframed my profile and matched me with a distributed Mumbai fintech. I received ₹2.5L and now build payment systems from Nagpur.",
  },
  {
    name: "Rohit M.",
    college: "NIT-H Nagpur extension",
    role: "Robotics Engineer",
    company: "Bangalore startup · Distributed",
    quote:
      "My NIT-extension education was perceived as regional, despite being NIT-level. StrideNex positioned me as NIT-calibre for Bangalore automation companies. A robotics startup offered ₹2.3L, and I now solve robotics problems from Nagpur.",
  },
  {
    name: "Sneha S.",
    college: "Nagpur-based college",
    role: "Product Engineer",
    company: "Pune company · Hybrid from Nagpur",
    quote:
      "Nagpur’s location felt limiting and I thought I had to move. StrideNex matched me with a Pune company offering a hybrid schedule: two days in Pune and three in Nagpur. I received ₹2.4L, can stay close to family, and avoid the cost-of-living pressure.",
  },
  {
    name: "Karan P.",
    college: "Private engineering college, Nagpur",
    role: "Software Engineer",
    company: "Distributed developer-tools startup",
    quote:
      "My private college offered a good education but had no brand recognition, so I assumed I would join a service company. StrideNex matched me with a Slack-adjacent distributed developer-tools startup. I received ₹2.6L plus options; my role is fully remote and my team is global.",
  },
];

const comparisonRows = [
  ["Geographic bias", "High: Nagpur treated as an outlier", "Medium: location filters", "None; elite-tier focus"],
  ["Company access", "20–30 visits/year", "Nationwide listings", "100+ pan-India and remote"],
  ["Distributed work", "0", "10%", "55% of placements"],
  ["Elite-tier positioning", "No", "No", "Yes"],
  ["Mentorship", "None", "None", "150+ pan-India mentors"],
  ["Timeline", "6+ months", "2–6 months", "6 weeks"],
  ["Remote-work leverage", "No", "No", "Core positioning"],
];

const placementSupport = [
  {
    icon: GraduationCap,
    title: "Position talent beyond geography",
    copy: "Help students explain their technical strengths and readiness to employers across India.",
  },
  {
    icon: Monitor,
    title: "Make distributed roles understandable",
    copy: "Give students context about remote and hybrid teams, communication, and expectations before interviews.",
  },
  {
    icon: BarChart3,
    title: "Track a wider opportunity set",
    copy: "Give TPOs visibility into student profiles, pan-India matches, introductions, and placement progress.",
  },
  {
    icon: Clock3,
    title: "Start with a focused pilot",
    copy: "Begin with a student cohort, review outcomes with the placement team, and scale based on college priorities.",
  },
];

const spotlight = [
  {
    college: "VNIT partnership",
    details: [
      "StrideNex integration began in 2024.",
      "The focus was positioning VNIT students for pan-India and distributed opportunities.",
      "80+ students were placed with pan-India or remote companies, and the placement rate increased from 72% to 88%.",
      "Placement quality also increased, with more elite roles and higher salaries.",
    ],
  },
  {
    college: "RCOEM collaboration",
    details: [
      "More than 65 students onboarded.",
      "The focus included technical and management roles that draw on RCOEM’s cross-disciplinary strengths.",
      "75% of students are placed within 90 days, at a reported average package of ₹2.45L. RCOEM graduates are positioned for technical-business roles such as product and founder pathways.",
    ],
  },
];

const faqs = [
  {
    question: "Will StrideNex send every Nagpur student to Bangalore?",
    answer:
      "No. 55% of placements are remote or Nagpur-based, so students can work for companies elsewhere while remaining in Nagpur.",
  },
  {
    question: "Do Bangalore and Mumbai companies hire from Nagpur?",
    answer:
      "Yes. More than 100 companies use StrideNex to hire from Nagpur, and distributed work makes location less of a barrier.",
  },
  {
    question: "Is remote work only a pandemic trend?",
    answer:
      "Remote work is described as structural, with remote-first companies such as Slack, Figma, and Stripe and distributed teams as an ongoing model.",
  },
  {
    question: "Can Nagpur students command elite salaries in remote roles?",
    answer:
      "Elite-tier remote roles range from ₹2.4L–₹3.5L, and elite capability plus remote work can outpace Tier-2 salaries in Bangalore.",
  },
  {
    question: "Can a college move from regional to elite-tier positioning?",
    answer:
      "The college can position its students as technically strong and strategically central, shifting its reputation through pan-India outcomes in a year.",
  },
  {
    question: "What if remote work becomes office-based again?",
    answer:
      "Nagpur’s central location and technical talent remain attractive to distributed teams even if work arrangements change.",
  },
  {
    question: "Can students outside VNIT and RCOEM benefit?",
    answer:
      "Yes. Students are matched according to their skills, experience, and role fit. The college name is only one part of a wider profile.",
  },
  {
    question: "What is the difference between remote and hybrid work?",
    answer:
      "Remote roles are performed away from a central office, while hybrid roles combine remote work with agreed in-person time. The exact arrangement depends on each employer.",
  },
  {
    question: "Will students feel isolated working remotely?",
    answer:
      "Distributed teams use different approaches to stay connected, such as regular team meetings, shared collaboration tools, and planned check-ins. Students should discuss each employer’s working style during the hiring process.",
  },
  {
    question: "Can students move to another city later?",
    answer:
      "Yes. Students can choose roles based on their goals and revisit location preferences as their careers develop.",
  },
  {
    question: "Can a college begin with remote opportunities?",
    answer:
      "A college can start with a focused set of remote or distributed roles and expand to hybrid and office-based options as student interest and employer needs become clearer.",
  },
  {
    question: "How is student data handled?",
    answer:
      "Students control whether their profiles are shared for employer introductions. The college and StrideNex should agree on the data-sharing scope during onboarding.",
  },
];

const nagpurAdvantages = [
  "Nagpur is described as equidistant from Bangalore, Pune, Mumbai, and Hyderabad, a strategic position for distributed teams.",
  "Remote-work normalization makes geography less relevant and turns Nagpur’s central location into an asset.",
  "VNIT, RCOEM, and 40+ colleges contribute to an elite technical talent pool, while many students still assume they need to leave.",
  "The first college to embrace pan-India positioning can become a hub college; within two years employers can recognize Nagpur graduates as elite and remote-ready.",
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
      <Link href="/contact-us?interest=institute-nagpur">
        {children}
        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function NagpurPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Engineering College Placements in Nagpur | StrideNex",
    description:
      "Explore pan-India and distributed placement pathways for Nagpur colleges, with skills-based matching and mentorship.",
    url: "https://stridenex.ai/institutes/cities/nagpur/",
    about: {
      "@type": "Place",
      name: "Nagpur, Maharashtra, India",
    },
  };

  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-sky-50 via-white to-orange-50 px-6 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,#0369a1_1px,transparent_0)] [background-size:40px_40px]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary shadow-sm sm:text-sm">
              <MapPin aria-hidden="true" className="h-4 w-4 text-accent" />
              Institute partnerships · Nagpur, Maharashtra
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              Nagpur, a central hub for{" "}
              <span className="bg-gradient-to-r from-primary via-sky-700 to-accent bg-clip-text text-transparent">
                career transformation
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Nagpur is central India’s beating heart, equidistant from Pune,
              Mumbai, Bangalore, and Hyderabad. Students can still feel
              geographically abandoned—far from every tech hub. StrideNex
              positions Nagpur as the natural talent bridge and connects
              students to 100+ companies, including distributed teams.
              More than 650 Nagpur students landed roles in the last year.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Your college can become the central hub every employer knows,
              rather than a satellite waiting for opportunities elsewhere.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DemoLink>Request a college demo</DemoLink>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-12 rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
              >
                <Link href="#nagpur-stories">
                  See Nagpur success stories
                  <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Pan-India opportunities
              </span>
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Remote and hybrid pathways
              </span>
            </div>
          </div>

          <Reveal
            className="mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"
            delay={0.12}
            direction="right"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white p-6 shadow-2xl shadow-sky-950/10 sm:rounded-[2rem] sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl"
              />
              <div className="relative">
                <Eyebrow>Nagpur · a connected talent ecosystem</Eyebrow>
                <h2 className="mt-3 max-w-sm text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                  Strong local talent. A wider reach.
                </h2>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  {[
                    { name: "VNIT", detail: "Technical depth" },
                    { name: "RCOEM", detail: "Engineering talent" },
                    { name: "Local employers", detail: "Growing opportunities" },
                    { name: "Distributed teams", detail: "Flexible work options" },
                  ].map((item, index) => (
                    <div
                      key={item.name}
                      className={`rounded-2xl border p-4 ${
                        index === 3
                          ? "border-sky-200 bg-sky-50"
                          : "border-slate-100 bg-slate-50/80"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-slate-900">
                          {item.name}
                        </p>
                        <span className="h-2 w-2 rounded-full bg-accent" />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-200">
                    Nagpur talent journey
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <span>College strengths</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-orange-300" />
                    <span>Skill match</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-orange-300" />
                    <span>Career pathway</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="The Nagpur opportunity"
          badgeColor="accent"
          title="Geographic heart. Opportunity paradox."
          subtitle="Nagpur has a strong technical talent pool and a strategic location. Better connections can help students and employers make use of both."
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
          <div className="grid gap-5 rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-orange-50 p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <Eyebrow>For Nagpur colleges</Eyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Turn central location into a connection advantage.
              </h3>
            </div>
            <p className="leading-7 text-slate-600">
              Students can build careers with teams based elsewhere while
              choosing a work arrangement that fits their goals. StrideNex
              helps colleges make those roles visible and prepare students to
              take part in distributed hiring.
            </p>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="The Nagpur hub system"
          title="Technical talent with a pan-India reach"
          subtitle="A connected approach helps students explain their strengths, find relevant roles, and prepare for distributed teams."
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
                <Eyebrow>Nagpur central hub journey</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold">
                  From technical profile to distributed role
                </h3>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  "Student shares technical skills and work preferences",
                  "StrideNex matches the profile to pan-India opportunities",
                  "A mentor prepares the student for distributed work",
                  "Student meets the company remotely or in person",
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
          title="From college onboarding to pan-India opportunities"
          subtitle="A structured process helps colleges, students, mentors, and employers understand each step."
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
          badge="Nagpur outcomes"
          title="Nagpur talent, working across locations"
          subtitle="A snapshot of placement reach, employer access, and flexible work arrangements described in the Nagpur programme."
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

        <div id="nagpur-stories" className="scroll-mt-28 pt-20">
          <SectionHeader
            badge="Student stories"
            badgeColor="accent"
            title="Build a career across India, from Nagpur"
            subtitle="Examples of students exploring remote and hybrid roles while choosing where they want to work."
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
          title="Pan-India hiring, without a location penalty"
          subtitle="StrideNex complements campus drives with employer access, remote-work context, and preparation for distributed teams."
        />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th scope="col" className="p-4 font-bold">Factor</th>
                <th scope="col" className="p-4 font-bold">Campus drive</th>
                <th scope="col" className="p-4 font-bold">Pan-India portals</th>
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
            "Give students access to employers beyond local campus visits.",
            "Help students understand remote and hybrid work expectations.",
            "Prepare students for interviews with pan-India employers.",
            "Give placement teams a dashboard for matching and progress.",
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
          title="Make distributed opportunities part of the placement mix"
          subtitle="Give students new routes to employers while helping TPOs track profiles, matches, and progress."
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
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-sky-950/10 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-14">
            <div>
              <Eyebrow>Why Nagpur, why now?</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                Central India’s talent hub is ready to connect.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                Remote work and distributed teams are creating more ways for
                employers to work with capable people across India. Nagpur
                colleges can help students prepare to take part.
              </p>
            </div>
            <ul className="grid gap-3">
              {nagpurAdvantages.map((advantage) => (
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
        <div id="nagpur-college-spotlight" className="scroll-mt-28">
          <SectionHeader
            badge="College spotlight"
            badgeColor="accent"
            title="College partnerships with a pan-India outlook"
            subtitle="Examples of positioning Nagpur students for distributed and cross-city opportunities."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {spotlight.map((item) => (
              <article
                key={item.college}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <Eyebrow>Nagpur institute example</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                  {item.college}
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
          title="Nagpur placement objections and FAQs"
          subtitle="Learn how pan-India and distributed opportunities can fit into your college’s placement programme."
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
              Build Nagpur’s placement pathway
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Connect your students to opportunities across India.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Start with a 30-minute call, see Nagpur profiles and pan-India
              matches in the live dashboard, meet the mentor panel, pilot with
              20–25 students, then scale to the full college.
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
                href: "/contact-us?interest=institute-nagpur",
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
