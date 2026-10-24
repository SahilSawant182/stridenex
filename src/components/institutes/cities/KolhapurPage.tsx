import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  Globe2,
  GraduationCap,
  Handshake,
  Languages,
  MapPin,
  Monitor,
  Network,
  Plane,
  Rocket,
  Target,
  Users,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/button";
import AnimatedStatValue from "@/components/students/management-careers/AnimatedStatValue";
import Reveal from "@/components/students/management-careers/Reveal";

const challenges = [
  {
    title: "Campus hiring often looks only within India",
    description:
      "Placement drives can focus on familiar domestic roles, leaving international startups and distributed teams outside the usual search.",
  },
  {
    title: "Global opportunities are difficult to find",
    description:
      "Students may not know that international companies hire remotely in India or how to assess those roles and their requirements.",
  },
  {
    title: "Global pay and local costs are rarely compared",
    description:
      "Without clear information on compensation, benefits, and work arrangements, students can miss options that fit their priorities.",
  },
  {
    title: "Global alumni are hard to reach",
    description:
      "Kolhapur graduates working with international teams can be valuable mentors, but their experience may not connect back to current cohorts.",
  },
  {
    title: "Export heritage has not reached campus narratives",
    description:
      "Kolhapur has a long history of exporting goods. Students can also build careers with global reach while staying connected to the city.",
  },
  {
    title: "The domestic-only choice leaves value behind",
    description:
      "Students may compare a ₹2.2L Bangalore service-company offer with global remote roles reported at ₹3.5L–₹4.5L, while assuming that international careers require moving overseas and paying to relocate.",
  },
];

const pillars = [
  {
    icon: GraduationCap,
    title: "Showcase globally ready skills",
    description:
      "Profile 420+ KIT, TKIET, and other engineering students for technical fundamentals, global readiness, English proficiency, and cross-cultural adaptability. Their practical, no-nonsense fundamentals are attractive to global employers.",
  },
  {
    icon: Globe2,
    title: "Open access to global-scale employers",
    description:
      "The 50+ global-scale employer network includes multinational technology companies such as Microsoft, Google, and Amazon; US/EU VC-funded startups; global-first SaaS firms such as Figma, Stripe, and Notion; India teams expanding globally; and financial or consulting firms opening India centres.",
  },
  {
    icon: Target,
    title: "Match talent without a location penalty",
    description:
      "Match strong fundamentals, communication, and cultural adaptability with distributed global roles, without a location penalty or a requirement to emigrate.",
  },
  {
    icon: Handshake,
    title: "Learn from Kolhapur’s global professionals",
    description:
      "The 75+ Kolhapur-native global mentors include engineers at Google, Microsoft, Amazon, and international startups; founders building global companies; alumni in Singapore, the USA, and the UK; and professionals who returned or stayed connected to Kolhapur.",
  },
];

const journey = [
  {
    week: "Week 1",
    title: "College partnership",
    description:
      "Partner with KIT, TKIET, or another college, connect the placement team to the dashboard, and select a cohort for global opportunities.",
  },
  {
    week: "Week 2",
    title: "Student onboarding",
    description:
      "Students map export-quality fundamentals, global readiness, communication, and preferences. The onboarding positions global opportunity as accessible from Kolhapur, with global compensation and the option to remain at home.",
  },
  {
    week: "Week 3",
    title: "Global mentor introduction",
    description:
      "A KIT 2018 graduate now a senior engineer at Google and working remotely from India can explain global teams, Tier-2 fundamentals, and how to stay connected to Kolhapur.",
  },
  {
    week: "Week 4",
    title: "Company introductions",
    description:
      "Hiring teams receive a profile that explains why the student fits a distributed team; students learn about role structures, global work culture, and interviews.",
  },
  {
    week: "Week 5",
    title: "Interviews and offers",
    description:
      "Global-company offers are typically ₹3.2L–₹4L. Mentors help students consider compensation, equity, learning, and any visa sponsorship where applicable.",
  },
  {
    week: "Week 6",
    title: "Joining a global team",
    description:
      "Students begin remote roles from Kolhapur or pursue an optional Singapore/USA visa path, become ambassadors, and connect classmates to global hiring teams.",
  },
];

const outcomes = [
  { value: "420+", label: "Kolhapur students placed in global-scale companies in the last 18 months" },
  { value: "24+", label: "Kolhapur colleges integrated or onboarding" },
  { value: "50+", label: "global-scale companies hiring Kolhapur talent" },
  { value: "62%", label: "placed within 90 days of starting the journey" },
  { value: "₹3.48L", label: "average starting package reported" },
  { value: "35%", label: "with visa sponsorship or regional roles reported" },
  { value: "65%", label: "of placements reported as fully remote" },
];

const stories = [
  {
    name: "Aditya R.",
    college: "KIT Kolhapur",
    role: "Cloud Engineer",
    company: "Multinational technology team",
    quote:
      "KIT is solid, but global companies did not have Kolhapur on their radar and campus brought service companies. StrideNex showed me MNCs hiring globally. Microsoft offered ₹3.6L plus benefits for a remote role on an India-based team expanding globally. I work from Kolhapur on a global product without relocation stress.",
  },
  {
    name: "Priya M.",
    college: "TKIET Kolhapur",
    role: "Product Engineer",
    company: "International SaaS startup",
    quote:
      "The story at TKIET was “Bangalore or bust.” StrideNex matched me with a US-based SaaS company hiring globally remote. I received ₹3.8L plus equity and joined a team across the USA, UK, Germany, and India. The salary and learning are global; my location is Kolhapur.",
  },
  {
    name: "Rohit K.",
    college: "Engineering college, Kolhapur",
    role: "IoT Systems Engineer",
    company: "Global infrastructure startup",
    quote:
      "Mechanical engineering from Kolhapur seemed to mean a slow, regional manufacturing job. StrideNex showed me global IoT companies hiring distributed engineers. A Series B smart-infrastructure startup offered ₹3.4L; my team spans the USA, India, and Singapore.",
  },
  {
    name: "Sneha S.",
    college: "TKIET Kolhapur",
    role: "Backend Engineer",
    company: "International fintech team",
    quote:
      "IT from Kolhapur seemed to mean a service-company default. StrideNex connected me with an international fintech. I received ₹3.9L plus equity, work remotely from Kolhapur, and learn from engineers around the world.",
  },
  {
    name: "Karan S.",
    college: "Private college, Kolhapur",
    role: "Full-Stack Engineer",
    company: "Singapore-based technology company",
    quote:
      "My private college had no global brand and I thought an international career required a US visa. StrideNex showed me remote-first companies hiring globally. A Singapore technology company offered ₹3.5L and a remote-first year from Kolhapur, with an optional Singapore office move in year two. I chose to stay near family and lower-cost living.",
  },
];

const comparisonRows = [
  ["Global company access", "0; domestic only", "5–10 roles, often buried", "50+ global-scale employers"],
  ["Global compensation", "₹2.2L domestic", "₹2L–₹2.5L", "₹3.4L+ global"],
  ["Remote work", "5%", "15%", "65% work from Kolhapur"],
  ["Visa sponsorship", "0", "0", "35% Singapore/USA path"],
  ["Global team exposure", "None", "None", "100% distributed teams"],
  ["Mentorship", "None", "None", "75+ international mentors"],
  ["Export narrative", "No", "No", "Kolhapur talent exports globally"],
  ["Student stay rate", "100% Bangalore", "70% in India", "50% Kolhapur and 50% global distributed"],
];

const placementSupport = [
  {
    icon: BriefcaseBusiness,
    title: "Make global employers visible",
    copy: "Help students discover multinational teams, international startups, global SaaS companies, and remote-first employers.",
  },
  {
    icon: Languages,
    title: "Prepare students for distributed work",
    copy: "Help students present technical strengths and communication skills for asynchronous, cross-cultural collaboration.",
  },
  {
    icon: BarChart3,
    title: "Track global placement progress",
    copy: "Give TPOs visibility into student profiles, employer matches, interviews, offers, and placement outcomes.",
  },
  {
    icon: Users,
    title: "Connect students with global mentors",
    copy: "Build a channel between Kolhapur students and professionals who can share experience working with global teams.",
  },
];

const advantages = [
  "Remote work normalization makes location less relevant; Kolhapur can connect students to global employers without requiring relocation.",
  "Global companies are actively seeking Tier-2 India talent for strong fundamentals, lower brand-driven ego, and competitive costs.",
  "Kolhapur businesses have exported goods for 150+ years; graduates can extend that story by building globally connected careers.",
  "The first college to position Kolhapur as a global talent-export hub can become a default feeder for MNCs and international startups.",
];

const spotlight = [
  {
    icon: Globe2,
    eyebrow: "Multinational technology teams",
    title: "Global products, distributed hiring",
    details: [
      "15 multinational technology companies with India teams hire for global roles.",
      "Students can explore opportunities on international products and distributed engineering teams.",
      "65 Kolhapur students have been placed in multinational global roles.",
      "The stated hiring focus is Tier-2 India talent for global roles, avoiding the Bangalore brand premium.",
    ],
  },
  {
    icon: Rocket,
    eyebrow: "International startups",
    title: "Remote-first companies and global teams",
    details: [
      "More than 20 US- and Europe-funded startups are described as hiring distributed teams.",
      "Employers offer remote roles and, for some positions, optional international pathways.",
      "The reported placement rate is 68% within 90 days, with salaries of ₹3.4L–₹4.2L. 40% offer an optional Singapore/USA visa path.",
    ],
  },
];

const faqs = [
  {
    question: "Will global companies hire from Kolhapur Tier-2 colleges?",
    answer:
      "Global employers value fundamentals and attitude over brand and actively recruit from Tier-2 India. Each company still has its own role criteria.",
  },
  {
    question: "Do students need perfect English for global roles?",
    answer:
      "Clear technical communication is usually more important than accent, and global teams often include non-native English speakers. Requirements vary by role.",
  },
  {
    question: "Will global companies sponsor visas or only hire remotely?",
    answer:
      "Both paths are described: multinational companies may sponsor Singapore or USA visas, while some SaaS firms and startups hire fully remotely. Students can choose based on the role and their goals.",
  },
  {
    question: "Is a ₹3.4L global salary realistic?",
    answer:
      "India-based junior roles pay ₹3L–₹4L, while visa-sponsored roles pay ₹5L–₹7L. Actual compensation depends on the employer, role, and written offer.",
  },
  {
    question: "Will global hiring from Kolhapur last?",
    answer:
      "Distributed hiring is structural. Kolhapur need not become a technology hub city for Kolhapur-trained talent to work globally.",
  },
  {
    question: "Can a college shift from domestic to global positioning in a year?",
    answer:
      "Start with 15–20 students in global roles and use those outcomes to build the college’s global-placement narrative.",
  },
  {
    question: "Will global companies hire graduates from Kolhapur colleges?",
    answer:
      "Hiring criteria vary by company and role. StrideNex helps students discover global opportunities and present relevant fundamentals, project experience, and communication skills to employers.",
  },
  {
    question: "Do students need to relocate to work for an international company?",
    answer:
      "Not necessarily. Some employers offer remote roles that can be performed from India. Other roles may require relocation or a particular work arrangement, so students should confirm the details with each employer.",
  },
  {
    question: "Do students need a visa for a remote role with an overseas company?",
    answer:
      "Visa requirements depend on where the employee is based and how the employer structures the role. Students should confirm employment, tax, and work authorization requirements directly with the employer before accepting.",
  },
  {
    question: "Is perfect English required for global roles?",
    answer:
      "Requirements differ across employers. Clear written and spoken communication can help distributed teams collaborate, but students should review the specific role criteria rather than assume a particular accent or fluency level is required.",
  },
  {
    question: "Are global salary figures guaranteed?",
    answer:
      "No. Compensation depends on the employer, role, experience, location, and contract terms. Figures are indicative, not a guarantee of an individual offer.",
  },
  {
    question: "Can a student start remotely and relocate later?",
    answer:
      "Some employers may offer that possibility, while others do not. Students should discuss any future relocation or sponsorship path with the hiring team and check it in writing.",
  },
  {
    question: "How can students work effectively with a distributed team?",
    answer:
      "Distributed work often relies on clear written updates, reliable collaboration tools, and agreed working hours. Mentors and employers can help students understand what a particular team expects.",
  },
  {
    question: "What does a college pilot involve?",
    answer:
      "A college can discuss placement priorities with StrideNex, review the dashboard, and plan a focused student cohort before deciding whether to extend the programme.",
  },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-800 sm:text-sm">
      {children}
    </p>
  );
}

function DemoLink({ children }: { children: ReactNode }) {
  return (
    <Button
      asChild
      variant="accent"
      size="lg"
      className="min-h-12 rounded-xl px-5 py-3 text-sm font-bold shadow-lg shadow-cyan-950/15 transition hover:-translate-y-0.5"
    >
      <Link href="/contact-us?interest=institute-kolhapur">
        {children}
        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function KolhapurPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Engineering College Placements in Kolhapur | StrideNex",
    description:
      "Kolhapur engineering colleges connect students with global companies, international startups, and remote-first teams through StrideNex.",
    url: "https://stridenex.ai/institutes/cities/kolhapur/",
    about: {
      "@type": "Place",
      name: "Kolhapur, Maharashtra, India",
    },
  };

  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-indigo-50 px-6 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,#4338ca_1px,transparent_0)] [background-size:40px_40px]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary shadow-sm sm:text-sm">
              <MapPin aria-hidden="true" className="h-4 w-4 text-cyan-700" />
              Institute partnerships · Kolhapur, Maharashtra
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              Kolhapur: Tier-2 excellence.{" "}
              <span className="bg-gradient-to-r from-cyan-700 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
                Global opportunities.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Kolhapur businesses have exported textiles, engineering goods,
              and agricultural products for more than 150 years. Students may still
              assume engineering careers are limited to India. StrideNex
              connects Kolhapur graduates with 50+ global-scale companies,
              including MNCs, international startups, and remote-first teams.
              More than 420 Kolhapur students built global-platform careers in
              the last year.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Work globally, earn globally, and grow globally—while choosing
              whether to stay rooted in Kolhapur.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DemoLink>Request a college demo</DemoLink>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-12 rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
              >
                <Link href="#kolhapur-stories">
                  See Kolhapur success stories
                  <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Global teams, flexible location
              </span>
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Talent beyond city labels
              </span>
            </div>
          </div>

          <Reveal
            className="mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"
            delay={0.12}
            direction="right"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-cyan-100 bg-white p-6 shadow-2xl shadow-indigo-950/10 sm:rounded-[2rem] sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-200/50 blur-3xl"
              />
              <div className="relative">
                <Eyebrow>Kolhapur · global career pathway</Eyebrow>
                <h2 className="mt-3 max-w-sm text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                  Work with the world. Choose where you grow.
                </h2>
                <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { icon: GraduationCap, title: "Local talent", text: "Skills and potential" },
                    { icon: Network, title: "Global team", text: "Distributed collaboration" },
                    { icon: Monitor, title: "Flexible work", text: "Remote or relocation path" },
                  ].map(({ icon: Icon, title, text }, index) => (
                    <div key={title} className="relative">
                      <div
                        className={`min-h-36 rounded-2xl border p-3 sm:p-4 ${
                          index === 2
                            ? "border-cyan-200 bg-cyan-50"
                            : "border-slate-100 bg-slate-50/80"
                        }`}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-sm">
                          <Icon aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <p className="mt-4 text-xs font-extrabold text-slate-900 sm:text-sm">
                          {title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {text}
                        </p>
                      </div>
                      {index < 2 && (
                        <ArrowRight
                          aria-hidden="true"
                          className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1 text-cyan-700 sm:block"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">
                    Kolhapur to global opportunity
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <span>Skills</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-cyan-300" />
                    <span>Connection</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-cyan-300" />
                    <span>Global work</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="The Kolhapur opportunity"
          badgeColor="accent"
          title="Export heritage. Global talent. A wider career horizon."
          subtitle="Kolhapur’s colleges develop practical engineering talent, but traditional placement channels can make international and remote roles harder to see."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl">
                <span className="text-sm font-extrabold tracking-widest text-cyan-800">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8" direction="scale">
          <div className="grid gap-5 rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-indigo-50 p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <Eyebrow>For Kolhapur colleges</Eyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Broaden the placement conversation.
              </h3>
            </div>
            <p className="leading-7 text-slate-600">
              Global careers can take different forms: remote work from
              Kolhapur, distributed teams, or relocation where the role and
              student’s goals align. StrideNex helps colleges make those
              pathways easier to explore.
            </p>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="The Kolhapur global system"
          title="Connect student capability to international teams"
          subtitle="A focused process helps students understand global roles and gives employers a clearer view of talent beyond familiar hiring locations."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {pillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="flex h-full gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800">
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
                <Eyebrow>Kolhapur global trajectory</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold">
                  From local fundamentals to global collaboration
                </h3>
                <p className="mt-3 leading-7 text-slate-300">
                  Students develop their technical story and explore
                  international roles with support along the way.
                </p>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  "Student shares skills, projects, and work preferences",
                  "StrideNex matches profiles to relevant global roles",
                  "A global mentor supports preparation and confidence",
                  "Student joins a distributed team from a chosen location",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-xl bg-white/[0.07] p-4 text-sm leading-6 text-slate-200"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-700 text-xs font-extrabold text-white">
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
          title="From college partnership to a global career"
          subtitle="A clear sequence connects the placement team, students, mentors, and international hiring teams."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((step, index) => (
            <Reveal key={step.week} delay={index * 0.04}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-900">
                  {step.week}
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="gradient">
        <SectionHeader
          badge="Kolhapur outcomes"
          title="Global opportunities. Flexible pathways."
          subtitle="A snapshot of student reach, international employer access, remote work, and placement outcomes."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.04}>
              <article className="h-full rounded-2xl border border-white bg-white p-5 text-center shadow-sm sm:p-6">
                <p className="text-3xl font-black tracking-tight text-indigo-800 sm:text-4xl">
                  <AnimatedStatValue value={item.value} />
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {item.label}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div id="kolhapur-stories" className="scroll-mt-28 pt-20">
          <SectionHeader
            badge="Student stories"
            badgeColor="accent"
            title="Kolhapur talent working with global teams"
            subtitle="Examples of graduates finding roles with international teams while choosing a location and pathway that fit their goals."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <Reveal key={story.name} delay={index * 0.04}>
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-800">
                      <GraduationCap aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-950">{story.name}</h3>
                      <p className="text-sm leading-5 text-slate-500">
                        {story.college}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 flex-1 leading-7 text-slate-600">
                    “{story.quote}”
                  </p>
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="font-bold text-indigo-800">{story.role}</p>
                    <p className="mt-1 text-sm text-slate-500">{story.company}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="A wider choice"
          badgeColor="accent"
          title="Compare domestic hiring with global pathways"
          subtitle="Help students consider employer reach, work location, compensation, and international exposure together."
        />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Consideration</th>
                <th scope="col" className="p-4 font-bold">Campus hiring</th>
                <th scope="col" className="p-4 font-bold">General job portals</th>
                <th scope="col" className="p-4 font-bold text-cyan-200">StrideNex global path</th>
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
                              ? "font-semibold text-indigo-800"
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
            "Introduce students to international employers and distributed teams.",
            "Help students understand remote, local, and relocation-based role options.",
            "Prepare students to explain their skills in a global hiring process.",
            "Build a college reputation for connecting talent with wider opportunities.",
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
          title="Make global opportunity part of the placement strategy"
          subtitle="Give TPOs a structured way to help students explore international employers and remote work."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {placementSupport.map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 0.05}>
              <article className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-800">
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
              <Eyebrow>Why Kolhapur, why now?</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                Bring the city’s export story to global careers.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                As distributed teams become more common, colleges can help
                students explore a global role without assuming that
                international work must begin with relocation.
              </p>
            </div>
            <ul className="grid gap-3">
              {advantages.map((advantage) => (
                <li
                  key={advantage}
                  className="flex gap-3 rounded-xl bg-white/[0.07] p-4 leading-6 text-slate-200"
                >
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-cyan-300"
                  />
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="white">
        <div id="kolhapur-global-spotlight" className="scroll-mt-28">
          <SectionHeader
            badge="Global company spotlight"
            badgeColor="accent"
            title="International teams hiring across locations"
            subtitle="Multinational technology employers and international startups create pathways for Kolhapur talent."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {spotlight.map(({ icon: Icon, title, eyebrow, details }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-800">
                  {eyebrow}
                </p>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                  {title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {details.map((detail) => (
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
          title="Kolhapur placement objections and FAQs"
          subtitle="Explore global roles, remote work, compensation, and what students should verify with employers."
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
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
              Build Kolhapur’s global pathway
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Connect your students with teams around the world.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Start with a 30-minute call, review Kolhapur profiles and global
              matches in the live dashboard, meet global mentors, pilot with
              15–20 students, and then scale to the full college.
            </p>
          </div>
          <DemoLink>Request a college demo</DemoLink>
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="white" spacing="compact">
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-800">
              For students
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
              Explore engineering careers with global reach.
            </h2>
            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Learn how engineering skills can open opportunities across
              industries, teams, and locations.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-h-12 rounded-xl border-cyan-800/20 text-cyan-900 hover:bg-cyan-800 hover:text-white"
          >
            <Link href="/students/engineering-careers/">
              Explore engineering careers
              <Plane aria-hidden="true" className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SectionWrapper>
    </div>
  );
}
