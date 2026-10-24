import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Handshake,
  Lightbulb,
  MapPin,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/students/management-careers/Reveal";
import AnimatedStatValue from "@/components/students/management-careers/AnimatedStatValue";

const challenges = [
  {
    title: "Potential is overlooked",
    description:
      "Campus recruiters may allocate 50 slots to COEP and five to AAIT Amravati—not because student talent differs, but because hiring budgets prioritize famous-brand cities.",
  },
  {
    title: "Growth companies are hard to discover",
    description:
      "Startups and scaleups may be actively looking for adaptable engineers, but students do not always know which teams are hiring.",
  },
  {
    title: "Student ambitions and campus roles can diverge",
    description:
      "Students who want ownership, fast learning, and a chance to build may see mostly conventional campus roles.",
  },
  {
    title: "Career paths feel geographically distant",
    description:
      "Students may believe that startup opportunities exist only in well-known technology centres, even when distributed and regional employers are hiring.",
  },
  {
    title: "Placement teams carry the outreach load",
    description:
      "TPOs need time and connections to introduce students to employers that may not yet know the college or its graduates.",
  },
  {
    title: "The wrong first role can slow growth",
    description:
      "TPOs compete for metro campus drives while companies may not know AAIT Amravati exists. Graduates can be funnelled into service-company maintenance work while growth companies seek emerging engineers.",
  },
];

const pillars = [
  {
    icon: GraduationCap,
    title: "High-potential talent profiles",
    description:
      "Profile 400+ students from SGBAU, AAIT, and other colleges for technical fundamentals, learning velocity, growth appetite, and entrepreneurial signals—high-potential emerging talent rather than Tier-2 commodity.",
  },
  {
    icon: Rocket,
    title: "Growth-mode company access",
    description:
      "The 40+ partners include regional leaders scaling to 500–2,000 people at Series B/C, VC-funded early-stage startups, Pune and Bangalore companies hiring remote or distributed talent, growth sectors such as manufacturing, agritech, fintech, and edtech, and founder-led teams.",
  },
  {
    icon: Target,
    title: "Matching for potential and role fit",
    description:
      "Match learning velocity and growth appetite to a company scaling quickly, rather than filtering only by college brand, experience, or CGPA. Emerging-college students can demonstrate ability instead of relying on brand recognition.",
  },
  {
    icon: Handshake,
    title: "Mentors who can explain the trajectory",
    description:
      "The 70+ Amravati-native mentors include engineers who advanced to technology leads or managers, founders who scaled from Amravati to Series B/C, and regional company leaders who hire emerging-college graduates.",
  },
];

const journey = [
  {
    week: "Week 1",
    title: "College partnership",
    description:
      "Integrate with placement, set up the dashboard for profiles, growth-company matches, and tracking, and brief the TPO on 40+ employers and demand for emerging talent.",
  },
  {
    week: "Week 2",
    title: "Student onboarding",
    description:
      "Students map high potential and appetite for growth. The assessment reframes emerging talent as an advantage rather than competing with COEP brands, then surfaces startup, scaleup, and rapid-growth matches.",
  },
  {
    week: "Week 3",
    title: "Mentor introduction",
    description:
      "A mentor can share a trajectory from an AAIT 2019 graduate joining a startup at ₹1.8L to becoming a senior engineer at ₹5.2L in three years, and explain how skills and salary can compound in a growth company.",
  },
  {
    week: "Week 4",
    title: "Company introductions",
    description:
      "Hiring teams receive student fundamentals, learning velocity, and readiness for startup or scaleup work; students learn about the company roadmap, role ownership, learning potential, and interview.",
  },
  {
    week: "Week 5",
    title: "Interviews and offers",
    description:
      "Students interview with mentor coaching. Typical offers are ₹2.2L–₹2.8L, with a stated trajectory of ₹3.5L–₹5L within three years; mentors discuss equity, learning, and culture fit.",
  },
  {
    week: "Week 6",
    title: "Joining and growth",
    description:
      "Students start with startups, scaleups, or Amravati companies, refer classmates, and help make the college known as an emerging-talent pipeline. More than 50 Amravati alumni at growth companies can refer peers.",
  },
];

const outcomes = [
  { value: "400+", label: "Amravati students placed in growth-mode companies in the last 18 months" },
  { value: "22+", label: "Amravati colleges integrated or onboarding" },
  { value: "40+", label: "growth-mode companies hiring Amravati talent" },
  { value: "60%", label: "placed within 90 days of starting the journey" },
  { value: "₹2.35L", label: "average starting package reported" },
  { value: "₹4.2L", label: "average package reported after three years" },
  { value: "65%", label: "promoted to team lead or manager within three years" },
];

const stories = [
  {
    name: "Arjun D.",
    college: "SGBAU Amravati",
    role: "Controls Engineer",
    company: "IoT startup · Growth stage",
    quote:
      "SGBAU is good but unknown, and campus brought service companies. StrideNex showed me Bangalore growth startups, including a Series B IoT control-systems company hiring 10 engineers a month. I received ₹2.2L; in year two I earned ₹3.1L after promotion, and in year three I reached ₹4.5L plus equity vesting.",
  },
  {
    name: "Priya M.",
    college: "AAIT Amravati",
    role: "Backend Engineer",
    company: "Fintech · Growth stage",
    quote:
      "AAIT is emerging, not COEP, and I assumed I would code for a service company forever. StrideNex connected me with a Series A Pune fintech growing from 50 to 200 engineers in two years. I received ₹2.4L plus equity; by year two I had ₹3.3L and a promotion to Senior.",
  },
  {
    name: "Rohit K.",
    college: "Engineering college, Amravati",
    role: "Robotics Engineer",
    company: "Robotics startup",
    quote:
      "I assumed a mechanical degree from an emerging college meant slow, stable manufacturing or PSU work. StrideNex matched me with a Series B robotics startup. I received ₹2.1L; by year three I earned ₹4L and led a team of five, a path I thought would take 10 years at a PSU.",
  },
  {
    name: "Sneha R.",
    college: "Amravati-based college",
    role: "Machine Learning Engineer",
    company: "EdTech startup",
    quote:
      "I thought an IT degree from an unknown college meant a service-company trap. StrideNex introduced me to a founder-led Series B edtech company building an AI tutoring platform. I received ₹2.3L, worked on ML models from day one, and by year two earned ₹3.2L and led a data team.",
  },
  {
    name: "Karan S.",
    college: "Private engineering college, Amravati",
    role: "Full-Stack Engineer",
    company: "Manufacturing software startup",
    quote:
      "My private college had no brand, so I thought I would always be an also-ran. StrideNex matched me with a Series A manufacturing-software startup growing 2x a year. I received ₹2.4L; my pay reached ₹3.4L plus equity in year two and ₹4.8L with a tech-lead role in year three.",
  },
];

const comparisonRows = [
  ["Growth-mode access", "0; service-only", "5–10, often buried", "40+ prioritized"],
  ["Emerging talent positioning", "No; commodity hiring", "No; brand filters", "Emerging talent is preferred"],
  ["Salary growth in 3 years", "₹2.2L → ₹2.5L (13%)", "Variable", "₹2.35L → ₹4.2L (79%)"],
  ["Promotion in 3 years", "10–15% to team lead", "Variable", "65% to team lead"],
  ["Mentor network", "None", "None", "70+ growth-company leaders"],
  ["Student enthusiasm", "Low; service fatigue", "Medium", "High; growth opportunity"],
  ["College reputation", "Minimal lift", "Minimal lift", "Emerging-talent pipeline"],
];

const placementSupport = [
  {
    icon: BriefcaseBusiness,
    title: "Make growth employers visible",
    copy: "Help students discover startups, scaleups, and regional companies looking for adaptable early-career talent.",
  },
  {
    icon: Lightbulb,
    title: "Showcase learning potential",
    copy: "Present student projects, fundamentals, curiosity, and readiness in ways hiring teams can understand.",
  },
  {
    icon: BarChart3,
    title: "Track more than a campus drive",
    copy: "Give TPOs visibility into student profiles, employer matches, interviews, and placement progress.",
  },
  {
    icon: Users,
    title: "Build a mentor network",
    copy: "Connect students with professionals who can explain growth-company roles and support career decisions.",
  },
];

const spotlight = [
  {
    title: "Growth-stage startup cluster",
    details: [
      "More than 15 funded startups are hiring for engineering and technology teams.",
      "Focus areas include hardware and software, edtech, fintech, and manufacturing software.",
      "These 50–200-person Series A/B teams intentionally recruit emerging talent for adaptability and retention. 85 Amravati students have been placed with the cluster, and 60% of the Amravati cohort is in growth-mode roles compared with 10% typically in service companies.",
    ],
  },
  {
    title: "Regional technology leaders",
    details: [
      "More than 10 established companies are described as expanding regional teams.",
      "These teams seek engineers who understand local needs and can contribute to growing operations.",
      "70% of students on this pathway are placed within 90 days; the reported salary range is ₹2.2L–₹2.6L, with a visible path from engineer to team lead.",
    ],
  },
];

const faqs = [
  {
    question: "Are startups better than service companies for career growth?",
    answer:
      "The reported three-year averages are ₹2.35L to ₹4.2L (79% growth) in startups and ₹2.2L to ₹2.5L (13%) in service companies. Startup roles can offer feature ownership, visible impact, and faster learning.",
  },
  {
    question: "Will startups hire emerging talent?",
    answer:
      "Early-stage startups can value emerging talent for learning appetite, adaptability, and potential. They may hire for potential rather than pedigree.",
  },
  {
    question: "What happens if a startup fails?",
    answer:
      "Startup experience can demonstrate problem-solving to Bangalore employers. Students should assess the company, role, and risk before joining.",
  },
  {
    question: "Are startup salaries lower than service-company salaries?",
    answer:
      "Starting salaries are similar at ₹2.2L–₹2.5L. By year three, startup roles can reach ₹4L–₹5L plus potential equity, compared with ₹2.5L–₹2.8L in service companies.",
  },
  {
    question: "Will emerging-talent positioning hurt the college’s reputation?",
    answer:
      "The positioning ties the college’s identity to measurable growth-company outcomes, promotions, and career progression rather than an unknown-college label.",
  },
  {
    question: "Do growth companies offer equity?",
    answer:
      "Most VC-funded startups offer ESOPs. Early employees may receive 0.5%–1%, potentially worth ₹20L–₹1Cr after a Series B/C exit; equity value and vesting are not guaranteed.",
  },
  {
    question: "What if a student prefers a stable employer?",
    answer:
      "Students can choose a more established company first, while considering that early-career experience compounds and growth companies can offer faster responsibility.",
  },
  {
    question: "Will growth companies mentor emerging talent?",
    answer:
      "Mentorship varies. Some growth companies mentor closely, while others expect employees to learn on the job. StrideNex mentors can help students understand a team’s working style before joining.",
  },
  {
    question: "Do growth companies hire graduates from emerging colleges?",
    answer:
      "Hiring needs vary by company and role. StrideNex helps students present their skills, projects, and learning potential to employers whose requirements match their profiles.",
  },
  {
    question: "Can students move from a startup to an established company later?",
    answer:
      "Yes. Students can build experience in a startup or scaleup and make later career moves based on their skills, goals, and opportunities.",
  },
  {
    question: "Are stock options part of every startup offer?",
    answer:
      "No. Compensation and benefits differ across employers. Students should review any equity terms carefully, including vesting schedules and conditions, before accepting an offer.",
  },
  {
    question: "What if a student prefers a more established employer?",
    answer:
      "Students can explore different company stages and choose roles that match their preferences for stability, pace, responsibility, and learning.",
  },
  {
    question: "Will growth companies provide mentorship?",
    answer:
      "Mentorship practices vary by employer. StrideNex can help students understand team expectations and connect with mentors as they evaluate a role.",
  },
  {
    question: "Do students need to relocate?",
    answer:
      "Not always. Opportunities can include Amravati-based, regional, and distributed roles. Students can review the work arrangement and decide what suits them.",
  },
];

const amravatiAdvantages = [
  "Startups and scaleups are actively seeking talent based on potential rather than pedigree; Amravati students are described as having strong fundamentals.",
  "Amravati students accept ₹2.2L salaries as high for the local market, with lower living costs and more room to learn.",
  "The college that positions its students as growth-ready can become a default pipeline for growth companies; proactive employer targeting can build that network over three years.",
  "First-mover positioning can turn an emerging-college reputation into a visible record of high-growth company placements.",
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
      <Link href="/contact-us?interest=institute-amravati">
        {children}
        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function AmravatiPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Engineering College Placements in Amravati | StrideNex",
    description:
      "Explore growth-company placement pathways for Amravati colleges through skill-based matching, mentorship, and career development.",
    url: "https://stridenex.ai/institutes/cities/amravati/",
    about: {
      "@type": "Place",
      name: "Amravati, Maharashtra, India",
    },
  };

  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-violet-50 via-white to-cyan-50 px-6 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,#6d28d9_1px,transparent_0)] [background-size:40px_40px]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary shadow-sm sm:text-sm">
              <MapPin aria-hidden="true" className="h-4 w-4 text-accent" />
              Institute partnerships · Amravati, Maharashtra
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              Amravati’s emerging talent.{" "}
              <span className="bg-gradient-to-r from-violet-700 via-primary to-cyan-600 bg-clip-text text-transparent">
                Proven outcomes.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Amravati’s young, hungry talent is still largely undiscovered.
              Instead of competing with Pune and Bangalore college brands for
              the same jobs, StrideNex connects students with 40+ growth-mode
              companies building in central India. More than 400 Amravati
              students launched high-trajectory careers in the last year.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Startups, scaleups, and regional leaders need engineers who can
              grow with them—your college can become their talent pipeline.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DemoLink>Request a college demo</DemoLink>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-12 rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
              >
                <Link href="#amravati-stories">
                  See Amravati success stories
                  <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Potential beyond college labels
              </span>
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Built for growth-minded careers
              </span>
            </div>
          </div>

          <Reveal
            className="mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"
            delay={0.12}
            direction="right"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-violet-100 bg-white p-6 shadow-2xl shadow-violet-950/10 sm:rounded-[2rem] sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-200/50 blur-3xl"
              />
              <div className="relative">
                <Eyebrow>Amravati · growth trajectory</Eyebrow>
                <h2 className="mt-3 max-w-sm text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                  Start with potential. Grow into ownership.
                </h2>
                <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: "Emerging", detail: "Build fundamentals" },
                    { label: "Growing", detail: "Own meaningful work" },
                    { label: "Leading", detail: "Guide a team" },
                  ].map((stage, index) => (
                    <div key={stage.label} className="relative">
                      <div
                        className={`min-h-32 rounded-2xl border p-3 sm:p-4 ${
                          index === 2
                            ? "border-violet-200 bg-violet-50"
                            : "border-slate-100 bg-slate-50/80"
                        }`}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
                          {index === 0 ? (
                            <GraduationCap aria-hidden="true" className="h-5 w-5" />
                          ) : index === 1 ? (
                            <Rocket aria-hidden="true" className="h-5 w-5" />
                          ) : (
                            <TrendingUp aria-hidden="true" className="h-5 w-5" />
                          )}
                        </span>
                        <p className="mt-4 text-sm font-extrabold text-slate-900 sm:text-base">
                          {stage.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {stage.detail}
                        </p>
                      </div>
                      {index < 2 && (
                        <ArrowRight
                          aria-hidden="true"
                          className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1 text-accent sm:block"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-200">
                    Growth-company pathway
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <span>Potential</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-cyan-300" />
                    <span>Opportunity</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-cyan-300" />
                    <span>Ownership</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="The Amravati opportunity"
          badgeColor="accent"
          title="Emerging talent. Untapped potential. A market mismatch."
          subtitle="Amravati colleges prepare strong graduates, but employer access and college-brand filters can make it harder for students to reach growth companies."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl">
                <span className="text-sm font-extrabold tracking-widest text-orange-700">
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
          <div className="grid gap-5 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-cyan-50 p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <Eyebrow>For Amravati colleges</Eyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Reframe emerging talent as a growth advantage.
              </h3>
            </div>
            <p className="leading-7 text-slate-600">
              Growth companies often need adaptable people who can learn,
              contribute, and take on new challenges as teams expand. StrideNex
              helps colleges make students’ capabilities visible to employers
              hiring for that kind of potential.
            </p>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="The Amravati growth system"
          title="Connect emerging engineers with growth-mode companies"
          subtitle="A focused approach helps students show their potential and find teams where their skills can develop with the business."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {pillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="flex h-full gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-800">
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
                <Eyebrow>Amravati growth trajectory</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold">
                  From emerging talent to team leadership
                </h3>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  "Student shows skills, projects, and learning goals",
                  "StrideNex matches potential to growth-company roles",
                  "A mentor supports preparation and role fit",
                  "Student grows with the team and takes on ownership",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-xl bg-white/[0.07] p-4 text-sm leading-6 text-slate-200"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-extrabold text-white">
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
          title="From college partnership to a growth trajectory"
          subtitle="A clear sequence connects the placement team, students, growth-company mentors, and hiring teams."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((step, index) => (
            <Reveal key={step.week} delay={index * 0.04}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-800">
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
          badge="Amravati outcomes"
          title="Growth-minded students. Growing company careers."
          subtitle="A snapshot of student reach, growth-company access, and reported career progression."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.04} direction="scale">
              <article className="h-full rounded-2xl border border-white bg-white/90 p-6 text-center shadow-sm">
                <p className="text-3xl font-black tracking-tight text-violet-800 sm:text-4xl">
                  <AnimatedStatValue value={item.value} />
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {item.label}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div id="amravati-stories" className="scroll-mt-28 pt-20">
          <SectionHeader
            badge="Student stories"
            badgeColor="accent"
            title="Emerging backgrounds. Room to grow."
            subtitle="Examples of Amravati graduates building skills and responsibility with growth-focused teams."
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
                    <p className="mt-3 text-sm font-semibold text-violet-800">
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
          title="Beyond the service-company campus pipeline"
          subtitle="StrideNex can complement campus hiring by helping students reach employers that prioritize learning potential and role fit."
        />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th scope="col" className="p-4 font-bold">Factor</th>
                <th scope="col" className="p-4 font-bold">Service-company campus</th>
                <th scope="col" className="p-4 font-bold">Pan-India portals</th>
                <th scope="col" className="p-4 font-bold text-violet-200">StrideNex growth</th>
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
                              ? "font-semibold text-violet-800"
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
            "Introduce students to growth-mode employers.",
            "Showcase potential and learning agility alongside credentials.",
            "Help students understand company stage and role ownership.",
            "Build a college reputation around graduates who grow quickly.",
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
          title="Position your college as a source of growth-ready talent"
          subtitle="Give the TPO team a structured way to connect students with companies looking for adaptable engineers and future leaders."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {placementSupport.map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 0.05}>
              <article className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-800">
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
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-violet-950/10 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-14">
            <div>
              <Eyebrow>Why Amravati, why now?</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                The emerging-talent inflection point.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                Growth companies need people ready to learn and take on
                responsibility. Amravati colleges can help students meet that
                demand and become known for graduates who grow with their teams.
              </p>
            </div>
            <ul className="grid gap-3">
              {amravatiAdvantages.map((advantage) => (
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
        <div id="amravati-college-spotlight" className="scroll-mt-28">
          <SectionHeader
            badge="Company spotlight"
            badgeColor="accent"
            title="Growth employers building their next teams"
            subtitle="Examples of company groups creating opportunities for emerging engineers."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {spotlight.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <Eyebrow>Amravati employer pathway</Eyebrow>
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
          title="Amravati placement objections and FAQs"
          subtitle="Learn how growth-company roles and student development can fit into your placement programme."
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
              Build Amravati’s emerging-talent pathway
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Connect your students with companies ready to grow.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Start with a 30-minute call, review Amravati profiles and
              growth-company matches in the dashboard, meet the mentor panel,
              pilot with 20–30 students, and scale across the college.
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
                href: "/contact-us?interest=institute-amravati",
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
