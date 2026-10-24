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
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/students/management-careers/Reveal";
import AnimatedStatValue from "@/components/students/management-careers/AnimatedStatValue";

const placementChallenges = [
  {
    number: "01",
    title: "A wide gap in campus access",
    description:
      "COEP and top private colleges can host 200+ companies and report placement rates above 95%. Tier-2 and Tier-3 colleges may see only 30–50 companies, with placement rates around 40–60%.",
  },
  {
    number: "02",
    title: "Specialty gaps leave skills unmatched",
    description:
      "Mechanical and civil engineering students may see few or no technology employers on campus, even when they want product or specialist roles.",
  },
  {
    number: "03",
    title: "Recruitment calendars miss student readiness",
    description:
      "Companies often visit in January and February, while some students are not ready until March. The next campus hiring window may not arrive until July or August, around the monsoon break.",
  },
  {
    number: "04",
    title: "Placement teams have limited capacity",
    description:
      "A TPO may manage 500+ students and process around 10 applications a day, while also handling employer outreach, preparation, interviews, and reporting.",
  },
  {
    number: "05",
    title: "Local talent can be overlooked",
    description:
      "Students may assume Pune employers hire only local candidates and may not know how to demonstrate their fit. College, grades, or resume keywords can overshadow practical skills and potential.",
  },
  {
    number: "06",
    title: "Placement pressure affects students and colleges",
    description:
      "Colleges are judged on placement numbers more than learning outcomes, while capable students can miss opportunities because they lack the right connection. Students compare ₹2.5L offers with classmates’ ₹5L+ offers, and alumni moving away can weaken the feedback loop.",
  },
];

const impactPillars = [
  {
    icon: Users,
    title: "Pune talent intelligence",
    description:
      "Profile 1,200+ students from COEP, MIT, VIT, Symbiosis, and other Pune colleges, mapping capability, learning goals, and timelines—including mechanical students moving toward AI.",
  },
  {
    icon: Building2,
    title: "Local employer access",
    description:
      "The network includes 150+ Pune-based and Pune-friendly employers: TCS, Infosys, Persistent Systems, Zebu, Mphasis, L&T Infotech; product firms Blackbuck, Kayako, Lendingkart, YieldMore; 100+ high-growth startups; and Deloitte, Accenture, EY, and KPMG Pune centres. Employers brief StrideNex on live roles, skills, and culture fit.",
  },
  {
    icon: Target,
    title: "Capability-led matching",
    description:
      "Matching looks beyond resume keywords and CGPA cutoffs to ask whether a student can do and grow in a role. Traditional screening can reject capable Tier-2 students with 6.5–7.0 CGPAs.",
  },
  {
    icon: Handshake,
    title: "Mentor-led preparation",
    description:
      "The 200+ Pune-based mentors include engineers, product managers, founders, and HR leaders who coach on Pune-market interviews, salary expectations, role fit, company culture, and negotiation.",
  },
];

const journeySteps = [
  {
    week: "Week 1",
    title: "College partnership",
    description:
      "The college signs an MOU, integrates StrideNex alongside campus drives, and gives the TPO a dashboard for student profiles, company matches, and placement tracking.",
  },
  {
    week: "Week 2",
    title: "Student onboarding",
    description:
      "Students share skills, goals, and timelines. For example: a Pune-based mechanical engineer seeking an automation or robotics role and available immediately; AI then surfaces relevant Pune startups and technology companies.",
  },
  {
    week: "Week 3",
    title: "Employer introductions",
    description:
      "StrideNex introduces matched students to Pune employers with a clear explanation of fit. Students receive company context, mentor briefing, and Pune-company-specific interview tips.",
  },
  {
    week: "Week 4",
    title: "Interview and next steps",
    description:
      "Students interview with a Pune company, receive mentor coaching before and after, discuss Pune salary benchmarks and benefits, negotiate start dates, and begin building a local career and portfolio.",
  },
];

const outcomes = [
  { value: "1,200+", label: "Pune students placed through StrideNex in two years" },
  { value: "50+", label: "Pune colleges integrated or onboarding" },
  { value: "150+", label: "Pune employers using StrideNex for hiring" },
  { value: "65%", label: "placed within 60 days of starting the journey" },
  { value: "₹2.1L", label: "average package for Pune placements" },
  { value: "60%", label: "placements from Tier-2 and Tier-3 colleges" },
];

const studentStories = [
  {
    name: "Arjun K.",
    college: "COEP",
    discipline: "Mechanical Engineering",
    role: "Automation Engineer",
    company: "DroneScape Robotics",
    quote:
      "COEP’s placement cell is fantastic, but 500 students compete and I did not make the top-30 cutoff. StrideNex matched me with a startup doing drone automation. The interview was real and mentor preparation was sharp. I received ₹2.2L plus equity and now work on technology I love in Pune, building a career.",
  },
  {
    name: "Priya M.",
    college: "Pune Institute of Computer Technology",
    discipline: "Information Technology",
    role: "Junior Backend Engineer",
    company: "FinFlow Startup",
    quote:
      "My college has only three or four technology-company visits, so options were limited. StrideNex showed me eight Pune product companies I had never heard of. I chose an early-stage fintech for ₹2.4L. I am learning 10 times faster than I would have in a service-company role.",
  },
  {
    name: "Rahul S.",
    college: "MIT Pune",
    discipline: "Electronics",
    role: "ML Engineer, Edge Computing",
    company: "EdgeAI Labs",
    quote:
      "I was interested in AI and machine learning, but my college did not have those companies visiting. StrideNex’s AI saw my IoT projects and matched me with an AI startup working on edge devices. They wanted exactly my skill set. I received ₹2L and a learning opportunity; everyone at the Pune startup is hungry to build.",
  },
  {
    name: "Zara P.",
    college: "Vishwakarma Institute",
    discipline: "Mechanical Engineering",
    role: "Design Engineer, Automation",
    company: "L&T Infotech",
    quote:
      "My Tier-2 college had good talent but zero company visits for my stream, and my parents were worried. StrideNex showed me Pune automation companies I did not know existed. A mentor prepared me for an interview with L&T Infotech’s automation division. I received a ₹1.95L offer and was due to start the next month.",
  },
  {
    name: "Karan V.",
    college: "Pune University, affiliated college",
    discipline: "Computer Science",
    role: "Full-Stack Developer",
    company: "HRTech Startup",
    quote:
      "I was at an affiliated Pune University college with an average 6.8 CGPA and no callbacks from the campus cell. StrideNex looked past my CGPA, saw that I could code, and matched me with five startups. I chose a Pune HRTech startup for ₹1.8L—my first job—where I am learning full-stack development and can go home on weekends.",
  },
];

const comparisonRows = [
  ["Pune employer access", "30–50 companies visiting", "Generic, nationwide listings", "No employer network", "150+ active Pune companies"],
  ["Personalization", "Quota-based, often first-come", "Resume-algorithm screening", "Generic batches", "AI matching plus Pune mentor"],
  ["Student support", "TPO manages from a distance", "Self-directed", "Interview tips", "1:1 Pune mentor coaching"],
  ["Pune context", "Local, but limited capacity", "No local market context", "No local market context", "Pune salaries, culture, and companies"],
  ["Timeline", "Six months, if lucky", "3–6 months", "2–3 months", "4–8 weeks"],
  ["College integration", "Direct campus process", "No integration", "No integration", "Full dashboard and TPO access"],
  ["Cost to college", "Already included in college fees", "Free student initiative", "₹20K–₹50K per student", "Scalable licensing model"],
];

const faqs = [
  {
    question: "Will StrideNex cannibalize campus drives?",
    answer:
      "No. Campus drives and StrideNex operate in parallel. Campus drives retain their existing format; StrideNex adds options for students who were not selected or want more opportunities. Placement rates rise rather than campus hiring being replaced.",
  },
  {
    question: "Do Pune companies use StrideNex for real hiring?",
    answer:
      "TCS, Infosys, Persistent, and 50+ Pune companies have active StrideNex job briefs, including specialized product, design, and startup roles. These employers hired 200+ StrideNex students in the last year.",
  },
  {
    question: "Will students leave Pune for Bangalore or Mumbai?",
    answer:
      "Some students will. The platform also includes 60+ Bangalore and Mumbai companies, while 70% of Pune placements are Pune-based. Students often prefer proximity to home, lower living costs, and the local startup ecosystem.",
  },
  {
    question: "How much time does integration require from the TPO?",
    answer:
      "StrideNex provides a dedicated dashboard, pre-matched student lists, automated notifications, and placement tracking. The TPO conducts interviews and final placement logistics, estimated at 30 minutes per student.",
  },
  {
    question: "Does the college lose student data?",
    answer:
      "Students opt in to transparent data sharing. The college remains the primary relationship, and StrideNex is a tool used by the TPO rather than a replacement for that relationship.",
  },
  {
    question: "How can students assess Pune salary offers?",
    answer:
      "Freshers’ offers range from ₹1.8L–₹2.8L depending on role and company. Pune mentors help students assess whether an offer is fair, including when a lower offer comes with a strong learning opportunity or when negotiation is appropriate.",
  },
  {
    question: "Can students use StrideNex without a formal college partnership?",
    answer:
      "Students can start individually. An institutional partnership adds placement-team tools, coordinated onboarding, and visibility into student progress.",
  },
  {
    question: "How is the licensing cost determined?",
    answer:
      "Typical licensing is ₹3L–₹8L/year for a 500-student engineering college. One or two placements can justify the cost; partner colleges commonly see 20–30 additional placements in the first year.",
  },
  {
    question: "Do Pune employers use StrideNex to hire?",
    answer:
      "60+ Pune startups, including Blackbuck, Kayako, Lendingkart, YieldMore, and others, use StrideNex for pre-screened talent, warm mentor introductions, and faster hiring.",
  },
  {
    question: "Can non-engineering colleges participate?",
    answer:
      "Yes. 30% of Pune placements are BBA, B.Com, and B.Sc students working in operations, sales, marketing, and data roles.",
  },
  {
    question: "How is student information handled?",
    answer:
      "Students control whether their profiles are shared for employer introductions. Colleges and students should agree on the data-sharing scope as part of onboarding.",
  },
  {
    question: "Can placements through StrideNex count in college reporting?",
    answer:
      "These placements count as institutional placements: StrideNex provides infrastructure and the college remains the placement owner.",
  },
];

const puneAdvantages = [
  "IT SEZ growth: more than 50,000 technology jobs were created in the last five years.",
  "Startup influx: more than 300 VC-funded startups are described as arriving amid Bangalore overflow.",
  "Students want to stay in Pune for lower living costs, proximity to home, and a vibrant ecosystem.",
  "Pune fresher salaries are reported at ₹2L–₹2.5L, described as the same level Bangalore had three years earlier.",
  "For colleges, this is a moment to build a Pune talent pipeline before more students leave for Bangalore and compete on outcomes as well as reputation.",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700 sm:text-sm">
      {children}
    </p>
  );
}

function PrimaryLink({
  children,
  href = "/contact-us?interest=institute-pune",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <Button
      asChild
      variant="accent"
      size="lg"
      className="min-h-12 rounded-xl px-5 py-3 text-sm font-bold shadow-lg shadow-accent/20 transition hover:-translate-y-0.5"
    >
      <Link href={href}>
        {children}
        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function PunePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pune Engineering College Placements | StrideNex",
    description:
      "StrideNex helps Pune engineering colleges connect students with local employers through skill-based matching, mentoring, internships, and placement support.",
    url: "https://stridenex.ai/institutes/cities/pune/",
    about: {
      "@type": "Place",
      name: "Pune, Maharashtra, India",
    },
  };

  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/70 px-6 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,#0f0fbd_1px,transparent_0)] [background-size:40px_40px]"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary shadow-sm sm:text-sm">
              <MapPin aria-hidden="true" className="h-4 w-4 text-orange-700" />
              Institute partnerships · Pune, Maharashtra
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              50+ Pune engineering colleges{" "}
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                trust StrideNex
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Pune is India’s tech heartland, yet placement outcomes remain
              unequal: the top 20% of students get premium roles while the
              other 80% compete for what is left. StrideNex combines AI-powered
              skill matching with human mentorship. More than 1,200 Pune
              students landed internships and placements in the last year.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              See how Pune colleges are achieving a 40%+ placement lift and
              build a pathway where every student can access an opportunity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PrimaryLink>Request a StrideNex demo</PrimaryLink>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-12 rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
              >
                <Link href="#pune-stories">
                  See Pune success stories
                  <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Works alongside campus drives
              </span>
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Student-first skill visibility
              </span>
            </div>
          </div>

          <Reveal
            className="mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"
            delay={0.12}
            direction="right"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:rounded-[2rem] sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
                      Pune talent, connected
                    </p>
                    <h2 className="mt-3 max-w-sm text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                      More visibility for students. More reach for employers.
                    </h2>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MapPin aria-hidden="true" className="h-6 w-6" />
                  </span>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    { label: "College talent", detail: "Skills, interests, readiness", icon: GraduationCap },
                    { label: "StrideNex matching", detail: "Profiles meet role needs", icon: Sparkles },
                    { label: "Pune employers", detail: "Relevant introductions", icon: Building2 },
                  ].map(({ label, detail, icon: Icon }, index) => (
                    <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">{label}</p>
                        <p className="mt-1 text-sm text-slate-500">{detail}</p>
                      </div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-orange-700">
                        0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-600">
                  <Users aria-hidden="true" className="h-5 w-5 text-primary" />
                  A coordinated pathway for colleges, students, and employers
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="The opportunity"
          badgeColor="accent"
          title="Pune has the talent. The placement ecosystem can connect it better."
          subtitle="A strong local industry base creates opportunity, but students and employers still need clear, practical ways to find each other."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {placementChallenges.map((challenge, index) => (
            <Reveal key={challenge.number} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl">
                <span className="text-sm font-extrabold tracking-widest text-orange-700">
                  {challenge.number}
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-950">
                  {challenge.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {challenge.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8" direction="scale">
          <div className="grid gap-5 rounded-3xl border border-primary/10 bg-gradient-to-r from-primary/[0.05] via-white to-accent/[0.07] p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <Eyebrow>The student experience</Eyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Talent should not get lost between campus and opportunity.
              </h3>
            </div>
            <p className="leading-7 text-slate-600">
              Students can have the skills and motivation employers need, yet
              still miss out when they lack access, visibility, or preparation.
              StrideNex brings those parts of the journey closer together.
            </p>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="The StrideNex approach"
          title="A talent bridge built around Pune’s colleges and employers"
          subtitle="Connect student capability, local hiring needs, and practical mentorship in one coordinated placement pathway."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {impactPillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="flex h-full gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-950">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8" direction="scale">
          <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <Eyebrow>Pune student journey</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold">
                  From student profile to employer conversation
                </h3>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  "Student shares skills, goals, and availability",
                  "StrideNex identifies relevant Pune roles",
                  "A mentor helps the student prepare",
                  "Student meets the employer and explores next steps",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-xl bg-white/[0.07] p-4 text-sm leading-6 text-slate-200">
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
          badge="A clear process"
          badgeColor="accent"
          title="A four-week path from college onboarding to interviews"
          subtitle="A practical sequence helps the placement team, students, mentors, and employers know what happens next."
        />
        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {journeySteps.map((step, index) => (
            <Reveal key={step.week} delay={index * 0.06}>
              <article className="relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                  {step.week}
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>
                {index < journeySteps.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute -right-4 top-8 z-10 hidden h-7 w-7 rounded-full border border-slate-200 bg-white p-1 text-orange-700 lg:block"
                  />
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="gradient">
        <SectionHeader
          badge="Pune outcomes"
          title="Students and colleges building new connections"
          subtitle="Placement reach, local employers, and student outcomes across Pune."
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
        <div id="pune-stories" className="scroll-mt-28 pt-20">
          <SectionHeader
            badge="Student stories"
            badgeColor="accent"
            title="Different colleges. Different skills. Real role pathways."
            subtitle="Examples of students connecting their interests and experience with opportunities in Pune."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {studentStories.map((story, index) => (
              <Reveal key={story.name} delay={(index % 3) * 0.05}>
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <Sparkles
                    aria-hidden="true"
                    className="h-5 w-5 text-orange-700"
                  />
                  <blockquote className="mt-4 flex-1 leading-7 text-slate-700">
                    “{story.quote}”
                  </blockquote>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <p className="font-bold text-slate-950">{story.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {story.discipline} · {story.college}
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
          title="More placement support, alongside campus hiring"
          subtitle="StrideNex is designed to complement a college’s placement activity with additional employer connections, matching, and student preparation."
        />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th scope="col" className="p-4 font-bold">Factor</th>
                <th scope="col" className="p-4 font-bold">Campus cell</th>
                <th scope="col" className="p-4 font-bold">Job platforms</th>
                <th scope="col" className="p-4 font-bold">Coaching</th>
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
                        className={`border-t border-slate-100 p-4 leading-6 ${cellIndex === 0
                            ? "font-bold text-slate-900"
                            : cellIndex === 4
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
            "StrideNex runs alongside campus drives and gives students who were not selected another pathway.",
            "Partner colleges report a 30–40% placement-metric lift.",
            "StrideNex handles matching and outreach; TPOs focus on interviews and final placement logistics.",
            "A Pune mentor network supports role-specific preparation, salary context, and company culture.",
          ].map((item) => (
            <p key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
              <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
              {item}
            </p>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="For placement teams"
          title="Designed to work with your college—not around it"
          subtitle="A college partnership can give the TPO team a coordinated view of student readiness, employer opportunities, and next steps."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: GraduationCap,
              title: "Keep campus recruitment in place",
              copy: "Use StrideNex as an additional pathway for students who want more opportunities or need further preparation.",
            },
            {
              icon: BarChart3,
              title: "Track progress in one place",
              copy: "Give placement teams visibility into student profiles, role matches, introductions, and placement progress.",
            },
            {
              icon: Clock3,
              title: "Start with a focused pilot",
              copy: "Onboard a small group, learn what works for your students and team, and expand the programme based on your goals.",
            },
            {
              icon: Handshake,
              title: "Build employer relationships",
              copy: "Help students meet employers with clearer role context and support from people who understand the local ecosystem.",
            },
          ].map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 0.05}>
              <article className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-orange-700">
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
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-primary/10 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-14">
            <div>
              <Eyebrow>Why Pune, why now?</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                Pune’s next advantage is connecting local talent to local opportunity.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                Pune’s technology, startup, and education ecosystems give
                colleges a strong foundation to help students build relevant
                careers close to home.
              </p>
            </div>
            <ul className="grid gap-3">
              {puneAdvantages.map((advantage) => (
                <li key={advantage} className="flex gap-3 rounded-xl bg-white/[0.07] p-4 leading-6 text-slate-200">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="white">
        <div id="pune-college-spotlight" className="scroll-mt-28">
          <SectionHeader
            badge="College spotlight"
            badgeColor="accent"
            title="How colleges add another path alongside campus drives"
            subtitle="Examples of institutional collaboration that extend student opportunities alongside campus drives."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                college: "COEP partnership",
                details: [
                  "StrideNex integration began in 2023.",
                  "An additional pathway ran alongside campus drives for students without campus offers.",
                  "40 students who did not receive campus offers were placed.",
                  "COEP’s TPO uses StrideNex as a safety net and skill-development platform.",
                ],
              },
              {
                college: "Symbiosis collaboration",
                details: [
                  "60 students onboarded.",
                  "Focus areas included product management, design, and operations.",
                  "70% were placed within 90 days, at an average package of ₹2.3L—above the campus average for non-core branches.",
                ],
              },
            ].map((spotlight) => (
              <article
                key={spotlight.college}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <Eyebrow>Pune</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                  {spotlight.college}
                </h3>
                <ul className="mt-5 space-y-3">
                  {spotlight.details.map((detail) => (
                    <li key={detail} className="flex gap-3 leading-7 text-slate-600">
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
          title="Pune placement objections and FAQs"
          subtitle="Learn what a StrideNex partnership can look like for your placement team and students."
        />
        <div className="mx-auto max-w-4xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-bold text-slate-900 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {faq.question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-open:rotate-45">
                  <span aria-hidden="true" className="text-xl font-normal leading-none">+</span>
                </span>
              </summary>
              <p className="max-w-3xl pt-4 leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="primary-gradient" className="relative isolate overflow-hidden">
        <div className="grid gap-8 text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-200">
              Build your Pune placement pathway
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Let’s connect your students with Pune’s opportunities.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Start with a 30-minute call about your college’s challenges, see
              the live dashboard and Pune matches, meet the local mentor panel,
              then pilot with 20–30 students before scaling across the college.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <PrimaryLink>Request a college demo</PrimaryLink>
          </div>
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
                href: "/contact-us?interest=institute-pune",
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
