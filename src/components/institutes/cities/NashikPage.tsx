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
  ShieldCheck,
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
    title: "Fewer campus visits",
    description:
      "Tier-1 colleges can host 150+ company visits while Nashik colleges may see only 15–25. Students can wait six months for a hiring team to visit.",
  },
  {
    title: "A Tier-2 perception gap",
    description:
      "College location or brand can influence who gets noticed, even when a student’s skills and readiness fit the role.",
  },
  {
    title: "Distance from hiring hubs",
    description:
      "Nashik is about three hours from Pune and Mumbai, yet employers may not make the trip to recruit on campus.",
  },
  {
    title: "A growing but less visible startup scene",
    description:
      "Local startups and companies in areas such as manufacturing technology and agritech may not have established campus recruitment channels.",
  },
  {
    title: "Pressure to relocate",
    description:
      "Students may feel they must choose between accepting a local role and moving to a larger city for a wider range of opportunities.",
  },
  {
    title: "Placement teams and students feel the cost",
    description:
      "A Nashik TPO may manage 400+ students while receiving only 10–15 company requests a year. Graduates may accept a mediocre local offer or move to Bangalore or Pune, where living costs rise.",
  },
];

const pillars = [
  {
    icon: Users,
    title: "Unbiased talent profiles",
    description:
      "StrideNex profiles 800+ Nashik engineering students across colleges and maps what they can do beyond college labels. Average CGPAs are 7.2–7.8, and recruiters may miss the rigour behind those results.",
  },
  {
    icon: Building2,
    title: "Tier-2-friendly employers",
    description:
      "The 80+ hiring companies include Nashik centres of TCS, Infosys, Cognizant, and Wipro; product companies recruiting remotely; Nashik technology, manufacturing-tech, and agritech firms; and startups and scaleups that intentionally hire Tier-2 talent.",
  },
  {
    icon: Target,
    title: "Skills-based matching",
    description:
      "Match demonstrated skills and role requirements rather than screening only for a CGPA above 7.5 or a famous college. Nashik students with 7.0–7.3 CGPAs can have capability comparable to Tier-1 students with 8.0+ under different grading practices.",
  },
  {
    icon: Handshake,
    title: "Mentors who understand the journey",
    description:
      "The 120+ Nashik-native mentor network includes Nashik graduates now working at Bangalore and Mumbai companies, Nashik startup founders, and HR leaders who hire Tier-2 talent. They coach students on interviews, salary expectations, and role fit.",
  },
];

const journey = [
  {
    week: "Week 1",
    title: "College partnership",
    description:
      "Integrate StrideNex with the placement ecosystem and give the TPO a dashboard for student profiles, company matches, and real-time tracking.",
  },
  {
    week: "Week 2",
    title: "Student onboarding",
    description:
      "Students complete a skill-based, not CGPA-based, assessment and share skills, goals, and availability. A profile might read: “IT student, wants backend development, available immediately.” AI then surfaces matches with companies hiring Tier-2 talent.",
  },
  {
    week: "Week 3",
    title: "Mentor introduction",
    description:
      "A Nashik-native mentor helps the student understand role expectations, present their experience, prepare for interviews, and set salary expectations.",
  },
  {
    week: "Week 4",
    title: "Employer introductions",
    description:
      "StrideNex introduces matched students to hiring teams, sharing why their skills fit; students receive company context and interview tips.",
  },
  {
    week: "Week 5",
    title: "Interviews and offers",
    description:
      "Students interview with mentor coaching before and after conversations, review offer details, and receive support with negotiation and next steps.",
  },
  {
    week: "Week 6",
    title: "Joining and network",
    description:
      "Students start roles in Bangalore, Pune, Nashik, or remotely, refer classmates, and help the TPO track outcomes and build a stronger college network.",
  },
];

const outcomes = [
  { value: "800+", label: "Nashik students placed in the last 18 months" },
  { value: "25+", label: "Nashik colleges integrated or onboarding" },
  { value: "80+", label: "companies hiring Nashik talent through StrideNex" },
  { value: "60%", label: "placed within 90 days of starting the journey" },
  { value: "₹1.95L", label: "average package reported for Nashik placements" },
  { value: "95%", label: "placements from Tier-2 colleges" },
];

const stories = [
  {
    name: "Akshay R.",
    college: "JNTU-H Nashik",
    role: "Backend Engineer",
    company: "EdTech startup",
    quote:
      "JNTU is a good college, but nobody outside Nashik knows it. Campus placement was pathetic—15 companies, mostly service. StrideNex showed me product companies in Bangalore actively hiring JNTU students. I interviewed with an edtech company, received ₹2.1L, and now build real products in Bangalore.",
  },
  {
    name: "Sneha M.",
    college: "MIT-WPU",
    role: "Embedded Systems Engineer",
    company: "IoT startup",
    quote:
      "MIT-WPU is excellent, but the Tier-2 label stuck. My 7.4 CGPA was rejected by campus companies that wanted 8+. StrideNex’s AI looked at what I could do—my embedded-systems projects, not my CGPA—and matched me with an IoT-device startup. I received ₹1.9L plus a learning opportunity. Tier-2 is a location, not a capability.",
  },
  {
    name: "Nikhil K.",
    college: "Nashik Institute of Technology",
    role: "Automation Engineer",
    company: "Automation startup",
    quote:
      "Mechanical engineering in Nashik seemed to mean nobody was hiring; the campus cell had just two manufacturing companies. I wanted product engineering. StrideNex matched me with a Bangalore automation startup, and mentors helped me position my skills. I received ₹2L.",
  },
  {
    name: "Priya D.",
    college: "Pune University, Nashik centre",
    role: "Software Engineer",
    company: "Fintech company",
    quote:
      "I was from an affiliated college with an average 6.9 CGPA and no campus callbacks. A Nashik graduate at Google mentored me through interviews. I received a ₹2.2L offer from a Pune company.",
  },
  {
    name: "Harsh P.",
    college: "Nashik Engineering Institute",
    role: "Full-Stack Developer",
    company: "HRTech startup",
    quote:
      "My small private college had no brand recognition and only five campus companies. StrideNex matched me with startups that focused on skills, not brand. I chose a Mumbai HRTech startup for ₹1.8L.",
  },
];

const comparisonRows = [
  ["Company access", "15–25 visits/year", "Nationwide, Tier-1-heavy", "80+ Tier-2-friendly companies"],
  ["Bias against Tier-2", "High", "High; CGPA cutoffs common", "Skills-based AI matching"],
  ["Mentorship", "None", "None", "120+ Nashik mentors"],
  ["Timeline", "6+ months", "2–6 months", "6 weeks"],
  ["College integration", "Direct campus process", "No integration", "Full dashboard"],
  ["Tier-2 focus", "Not purpose-built", "Minimal", "Purpose-built"],
];

const placementSupport = [
  {
    icon: GraduationCap,
    title: "Support across branches",
    copy: "Help students from IT, electronics, mechanical, civil, and other disciplines explore relevant roles.",
  },
  {
    icon: BarChart3,
    title: "Visibility for the TPO",
    copy: "Track profiles, employer matches, interviews, and placement progress through a coordinated dashboard.",
  },
  {
    icon: Clock3,
    title: "A focused pilot",
    copy: "Start with a small group of students, learn from the process, then decide how to scale with the college.",
  },
  {
    icon: ShieldCheck,
    title: "An additional pathway",
    copy: "Keep campus recruitment in place while giving students another way to meet employers and prepare.",
  },
];

const spotlight = [
  {
    college: "MIT-WPU partnership",
    details: [
      "StrideNex integration began in 2024.",
      "The collaboration focused on making student capability more visible beyond Tier-2 assumptions.",
      "35 students were placed outside campus drives, and the placement rate increased from 65% to 82%.",
    ],
  },
  {
    college: "JNTU-H Nashik collaboration",
    details: [
      "More than 60 students onboarded.",
      "The focus was supporting transitions from service roles toward product-company opportunities.",
      "68% of students are placed within 90 days; the reported average package is ₹2.05L.",
    ],
  },
];

const faqs = [
  {
    question: "Will StrideNex just send Nashik students to Bangalore?",
    answer:
      "Some students will move, while the programme also connects students with 30+ Nashik-based and remote companies. 50% of Nashik placements stay in Nashik or are remote.",
  },
  {
    question: "Do companies really hire from Tier-2 colleges?",
    answer:
      "More than 80 companies actively use StrideNex for Tier-2 hiring, valuing attitude, lower salary expectations, and equivalent skills.",
  },
  {
    question: "Are Nashik salaries low, and can students earn more?",
    answer:
      "StrideNex roles range from ₹1.8L–₹2.5L, while some Bangalore roles offer ₹2.2L–₹3.5L. Mentors help students compare offers and choose according to their goals.",
  },
  {
    question: "How does StrideNex work with an overloaded TPO?",
    answer:
      "StrideNex handles matching and outreach while the TPO focuses on interviews and final logistics, estimated at no more than 15 minutes per student.",
  },
  {
    question: "What if the programme does not work?",
    answer:
      "Colleges can run a three-month pilot with 20–30 students and no commitment beyond the pilot; most colleges see placements in two months.",
  },
  {
    question: "Why choose StrideNex over other platforms?",
    answer:
      "The Tier-2-first model brings together employers that hire Tier-2 talent, mentors with Tier-2 experience, and role matching designed around student skills rather than college labels.",
  },
  {
    question: "Is StrideNex only for IT and CSE students?",
    answer:
      "No. The Nashik programme is intended for students across disciplines, including electronics, mechanical, civil, and chemical engineering, based on available role requirements.",
  },
  {
    question: "Do students have to relocate?",
    answer:
      "Relocation is a student choice. Opportunities include local, regional, and remote roles, with mentors helping students consider the options.",
  },
  {
    question: "Can a small college participate?",
    answer:
      "Yes. Colleges can discuss a suitable onboarding or pilot plan with the StrideNex team, including the size of the student cohort.",
  },
  {
    question: "Are Nashik startups part of the employer network?",
    answer:
      "Local startups and growing companies are part of the Nashik employer ecosystem. Specific openings depend on current hiring needs.",
  },
  {
    question: "How is partnership pricing decided?",
    answer:
      "Pricing depends on college size and the agreed partnership scope. Contact StrideNex to discuss options for your institution.",
  },
  {
    question: "Can we begin with a pilot?",
    answer:
      "Yes. A college can start with a focused student cohort, review progress with the placement team, and then consider a broader integration.",
  },
  {
    question: "How are placements reflected in college reporting?",
    answer:
      "The institution should apply its own placement criteria and documentation requirements. StrideNex can support tracking relevant student outcomes.",
  },
];

const nashikAdvantages = [
  "Tier-2 cities produce 10,000+ engineering graduates a year, with quality increasing.",
  "Nashik rent is ₹8K/month compared with ₹15K in Bangalore, and many students want to stay.",
  "Startups are expanding into Tier-2 cities for lower operating costs, while remote work makes location less restrictive.",
  "Nashik colleges can build placement infrastructure now and demonstrate that their students are world-class.",
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
      <Link href="/contact-us?interest=institute-nashik">
        {children}
        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function NashikPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Engineering College Placements in Nashik | StrideNex",
    description:
      "Explore placement pathways for Nashik colleges, with skill-based matching, Tier-2-friendly employers, and mentorship.",
    url: "https://stridenex.ai/institutes/cities/nashik/",
    about: {
      "@type": "Place",
      name: "Nashik, Maharashtra, India",
    },
  };

  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-orange-50 px-6 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,#4338ca_1px,transparent_0)] [background-size:40px_40px]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary shadow-sm sm:text-sm">
              <MapPin aria-hidden="true" className="h-4 w-4 text-accent" />
              Institute partnerships · Nashik, Maharashtra
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              Nashik placement solutions{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-accent bg-clip-text text-transparent">
                beyond the Tier-1 bubble
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Nashik is India’s wine country and a rising tech hub, yet students
              still hear that Tier-2 colleges do not get good placements.
              StrideNex connects Nashik talent with 80+ companies that actively
              hire here. More than 800 Nashik students have landed roles in the
              last 18 months.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              No waiting for campus drives that never come: real internships,
              placements, and salaries, with a pathway beyond the Tier-1 bubble.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DemoLink>Request a college demo</DemoLink>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-12 rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
              >
                <Link href="#nashik-stories">
                  See Nashik success stories
                  <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Built for Tier-2 talent visibility
              </span>
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Works alongside campus drives
              </span>
            </div>
          </div>

          <Reveal
            className="mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"
            delay={0.12}
            direction="right"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white p-6 shadow-2xl shadow-indigo-950/10 sm:rounded-[2rem] sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-200/50 blur-3xl"
              />
              <div className="relative">
                <Eyebrow>Capability over location</Eyebrow>
                <h2 className="mt-3 max-w-sm text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                  Give Nashik talent a fair chance to be seen.
                </h2>
                <div className="mt-7 space-y-3">
                  {[
                    {
                      title: "Assess capability",
                      detail: "Skills, projects, interests",
                      icon: GraduationCap,
                    },
                    {
                      title: "Match with opportunity",
                      detail: "Nashik, remote, and pan-India roles",
                      icon: Target,
                    },
                    {
                      title: "Prepare with a mentor",
                      detail: "Role context and interview guidance",
                      icon: Handshake,
                    },
                  ].map(({ title, detail, icon: Icon }, index) => (
                    <div
                      key={title}
                      className="flex items-center gap-4 rounded-2xl border border-indigo-50 bg-indigo-50/50 p-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">{title}</p>
                        <p className="mt-1 text-sm text-slate-500">{detail}</p>
                      </div>
                      <span className="text-xs font-extrabold tracking-wider text-orange-700">
                        0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-600">
                  <Users aria-hidden="true" className="h-5 w-5 text-primary" />
                  A pathway from Nashik classrooms to real employer conversations
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="The Nashik opportunity"
          badgeColor="accent"
          title="Smart students. A placement ecosystem ready to grow."
          subtitle="Nashik has strong engineering colleges and rising employers. Better connections can help students and companies find each other."
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
          <div className="grid gap-5 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-orange-50 p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <Eyebrow>For Nashik colleges</Eyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Make student capability visible beyond campus boundaries.
              </h3>
            </div>
            <p className="leading-7 text-slate-600">
              Placement teams can have limited time for employer outreach and
              individual student support. StrideNex adds a structured way to
              surface student skills, connect with hiring teams, and prepare
              students for relevant roles.
            </p>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="The Nashik impact system"
          title="A practical bridge from talent to opportunity"
          subtitle="Four connected supports help students present their strengths and meet employers who are open to Tier-2 talent."
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
                <Eyebrow>Nashik student journey</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold">
                  From capability assessment to a role that fits
                </h3>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  "Student completes a skills-focused assessment",
                  "AI surfaces relevant roles with inclusive criteria",
                  "A Nashik-connected mentor helps the student prepare",
                  "Student interviews and chooses the next step",
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
          title="A clear route from college onboarding to a real role"
          subtitle="The six-week process brings college teams, students, mentors, and employers into a coordinated sequence."
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
          badge="Nashik outcomes"
          title="Tier-2 students building careers across locations"
          subtitle="Students can explore opportunities in Nashik, larger cities, and remote teams based on their goals."
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

        <div id="nashik-stories" className="scroll-mt-28 pt-20">
          <SectionHeader
            badge="Student stories"
            badgeColor="accent"
            title="Skill and drive can open more than one route"
            subtitle="Examples of Nashik students finding roles that fit their strengths and interests."
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
                    <p className="mt-1 text-sm text-slate-500">
                      {story.college}
                    </p>
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
          title="Built for Tier-2 hiring, alongside campus drives"
          subtitle="StrideNex adds employer connections and student support without replacing the college’s existing placement process."
        />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th scope="col" className="p-4 font-bold">Factor</th>
                <th scope="col" className="p-4 font-bold">Campus drive</th>
                <th scope="col" className="p-4 font-bold">Other portals</th>
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
            "A purpose-built pathway for students from Tier-2 colleges.",
            "Employers and roles beyond the campus recruitment calendar.",
            "Mentors who can help students prepare for specific roles.",
            "TPO dashboard access and placement progress tracking.",
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
          title="More capacity for student and employer connections"
          subtitle="A college partnership gives the TPO team additional structure for matching and outreach while keeping campus hiring in place."
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
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-indigo-950/10 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-14">
            <div>
              <Eyebrow>Why Nashik, why now?</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                The Tier-2 advantage is ready to be seen.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                Growing companies, distributed teams, and Nashik’s engineering
                talent create new ways to build a career. Colleges can help
                students prepare for those opportunities now.
              </p>
            </div>
            <ul className="grid gap-3">
              {nashikAdvantages.map((advantage) => (
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
        <div id="nashik-college-spotlight" className="scroll-mt-28">
          <SectionHeader
            badge="College spotlight"
            badgeColor="accent"
            title="Institutional collaborations in Nashik"
            subtitle="Examples of how colleges can create additional pathways for students alongside campus recruitment."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {spotlight.map((item) => (
              <article
                key={item.college}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <Eyebrow>Nashik institute example</Eyebrow>
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
          title="Nashik placement objections and FAQs"
          subtitle="Learn how a StrideNex partnership can support your placement team and students."
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
              Build Nashik’s placement pathway
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Help your students break through the Tier-2 ceiling.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Start with a 20-minute call, review Nashik profiles and matches
              in the live dashboard, meet the mentor panel, pilot with 20–30
              students, and scale to full college integration.
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
                href: "/contact-us?interest=institute-nashik",
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
