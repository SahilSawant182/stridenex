import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  Cpu,
  Factory,
  GraduationCap,
  Handshake,
  Lightbulb,
  MapPin,
  Network,
  Settings2,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/button";
import AnimatedStatValue from "@/components/students/management-careers/AnimatedStatValue";
import Reveal from "@/components/students/management-careers/Reveal";

const challenges = [
  {
    title: "Ambition seems to require leaving",
    description:
      "Students can see relocation as the only route to career momentum, even when Sangli employers are transforming their industries.",
  },
  {
    title: "Local roles are mistaken for limited roles",
    description:
      "Manufacturing and engineering employers are investing in automation, IoT, and software, but those opportunities can be difficult to spot.",
  },
  {
    title: "Industry context is overlooked",
    description:
      "Growing up around precision, production, and quality gives Sangli students useful practical context that a conventional CV may not show.",
  },
  {
    title: "Alumni connections are scattered",
    description:
      "Graduates working across companies and regions can be hard for current students to reach as mentors and professional contacts.",
  },
  {
    title: "Placement teams need a stronger bridge",
    description:
      "Colleges want to retain talent without narrowing students’ ambitions, and employers need a clearer way to meet those graduates.",
  },
  {
    title: "The brain-drain story limits both sides",
    description:
      "Colleges can be labelled regional rather than ambitious, students may pay twice Sangli’s cost of living after moving to Bangalore, and local employers lose engineers who understand their industrial context.",
  },
];

const pillars = [
  {
    icon: GraduationCap,
    title: "Profile Sangli-rooted talent",
    description:
      "Profile 380+ Sangli students from WCE and other colleges for technical fundamentals, industrial context, ambition, and community roots. Practical experience with precision, production constraints, and quality is an asset for industry-scale roles.",
  },
  {
    icon: Factory,
    title: "Open doors to industry-scale companies",
    description:
      "The 35+ partner network includes Sangli manufacturers scaling textiles, foundries, and precision engineering; regional industrial leaders across Maharashtra and South India; Industry 4.0 and IoT teams; and companies moving from traditional production into tech-enabled businesses.",
  },
  {
    icon: Target,
    title: "Match practical context to modern roles",
    description:
      "Match students who understand manufacturing and want to grow with companies scaling to global standards, including automation, IoT, precision technology, and software-enabled production.",
  },
  {
    icon: Handshake,
    title: "Learn from rooted professionals",
    description:
      "The 65+ Sangli-rooted mentors include engineers who scaled local companies, founders who grew regionally or nationally while staying rooted, professionals who left and returned, and textile, foundry, and manufacturing leaders investing in local talent.",
  },
];

const journey = [
  {
    week: "Week 1",
    title: "College partnership",
    description:
      "Integrate the TPO dashboard and brief the placement team on 35+ employers, community-scale opportunities, and the balance of ambition and rootedness.",
  },
  {
    week: "Week 2",
    title: "Student onboarding",
    description:
      "Students map practical projects, technical strengths, interests, and career goals. The assessment reframes the choice: students need not choose between Sangli and ambition.",
  },
  {
    week: "Week 3",
    title: "Mentor introduction",
    description:
      "A WCE 2015 graduate who became VP Engineering at a Sangli manufacturer after helping scale it from 50 to 500 engineers can show students an industry-scale career rooted at home.",
  },
  {
    week: "Week 4",
    title: "Company introductions",
    description:
      "Companies receive student fundamentals, manufacturing context, and growth readiness; students learn the company roadmap, role ownership, growth path, and why Sangli roots matter.",
  },
  {
    week: "Week 5",
    title: "Interviews and offers",
    description:
      "Students interview with mentor support. Offers are typically ₹2.3L–₹2.6L; mentors discuss leadership tracks, learning, local cost-of-living advantages, and equity or ownership paths.",
  },
  {
    week: "Week 6",
    title: "Joining and community",
    description:
      "Students start in Sangli or regional roles, refer classmates, and become ambassadors for ambitious careers at home. More than 50 Sangli alumni at major companies mentor classmates.",
  },
];

const outcomes = [
  { value: "380+", label: "Sangli students placed in industry-scale roles in the last 18 months" },
  { value: "20+", label: "Sangli colleges integrated or onboarding" },
  { value: "35+", label: "industry-scale companies hiring Sangli talent" },
  { value: "65%", label: "placed within 90 days of starting the journey" },
  { value: "₹2.45L", label: "average starting package reported" },
  { value: "₹3.8L", label: "average package reported after three years" },
  { value: "78%", label: "staying in Sangli or Western Maharashtra" },
  { value: "60%", label: "promoted to engineering lead or manager in three years" },
];

const stories = [
  {
    name: "Aditya P.",
    college: "Walchand College of Engineering",
    role: "Engineering Manager",
    company: "Precision engineering company",
    quote:
      "The narrative was that Sangli meant local-only work, so I thought I had to leave to grow. A precision-engineering company with ₹200 crore turnover was building automation and IoT. I received ₹2.3L and a five-year path to VP Engineering: ₹2.9L and managing eight engineers in year two, then ₹3.5L and leading a technology transformation in year three. I am still in Sangli, building at global speed.",
  },
  {
    name: "Priya D.",
    college: "Engineering college, Sangli",
    role: "Product Engineer",
    company: "Textile-tech startup",
    quote:
      "I attended a small Sangli engineering college and assumed I would join a Bangalore service company. A Sangli Series A textile-tech startup building IoT looms needed someone who understood textiles and modern technology. I received ₹2.4L plus equity, led product work by year two at ₹3.2L, and reached ₹3.8L with equity vesting by year three.",
  },
  {
    name: "Rohit S.",
    college: "Engineering college, Sangli",
    role: "Automation Engineer",
    company: "Foundry transformation team",
    quote:
      "I assumed mechanical engineering meant slow, traditional manufacturing. A 100-year-old foundry was transforming into a precision-tech operation and needed engineers who could bridge manufacturing and automation. I received ₹2.2L, reached ₹2.8L while leading automation projects in year two, and ₹3.6L while heading the manufacturing-tech centre in year three.",
  },
  {
    name: "Sneha M.",
    college: "Sangli engineering college",
    role: "Product Manager",
    company: "Manufacturing software company",
    quote:
      "IT from Sangli seemed to mean a service-company trap or leaving for Bangalore. I joined a company entering software-enabled manufacturing with ERP, quality, and supply-chain products. I received ₹2.5L, reached ₹3.1L while leading a product team in year two, and ₹3.9L in year three with a VP Product trajectory.",
  },
  {
    name: "Karan K.",
    college: "Private engineering college, Sangli",
    role: "IoT Systems Engineer",
    company: "Manufacturing-focused IoT startup",
    quote:
      "My private college had no brand, and I thought I would need to move for a career. A Sangli manufacturing-focused IoT company intentionally hired emerging talent. I received ₹2.3L, reached ₹2.9L and tech-lead responsibility in year two, and ₹3.7L while leading a distributed team in year three.",
  },
];

const comparisonRows = [
  ["Company access", "Pan-India, little Sangli context", "Local roles can be hard to find", "35+ Sangli/regional industry-scale companies"],
  ["Career ambition", "Unlimited, with relocation", "Often perceived as regional-only", "Industry-scale career with local roots"],
  ["Rootedness", "Lost through relocation", "High, but may feel stagnant", "High: stay and build ambitiously"],
  ["Cost of living", "2× Sangli in Bangalore", "1× Sangli", "1× Sangli"],
  ["Mentorship", "Distant or disconnected", "None", "65+ rooted professionals"],
  ["Family proximity", "500km+ away", "Nearby", "Nearby"],
  ["Three-year salary growth", "₹2.2L → ₹2.8L (27%)", "₹1.8L → ₹2.2L (22%)", "₹2.45L → ₹3.8L (55%)"],
  ["Three-year promotion", "20–30%", "10–15%", "60% to lead"],
  ["Stay rate", "5% leave permanently", "100%, but stagnant", "78% in Sangli/Western Maharashtra"],
];

const placementSupport = [
  {
    icon: BriefcaseBusiness,
    title: "Make industrial opportunities visible",
    copy: "Help students discover manufacturers and technology teams working across automation, precision engineering, IoT, and software.",
  },
  {
    icon: Lightbulb,
    title: "Show the value of practical context",
    copy: "Present students’ projects, engineering fundamentals, quality mindset, and understanding of production environments.",
  },
  {
    icon: BarChart3,
    title: "Track the full placement journey",
    copy: "Give TPOs visibility into student profiles, employer matches, interviews, offers, and placement progress.",
  },
  {
    icon: Users,
    title: "Build a rooted mentor network",
    copy: "Connect students with professionals who understand Sangli and have built careers across its changing industrial ecosystem.",
  },
];

const advantages = [
  "Sangli’s textiles, foundries, and precision-engineering sectors are moving toward Industry 4.0 and need engineers who understand both technology and manufacturing.",
  "Startups are building ERP, quality, supply-chain, and manufacturing-execution software for a large Indian manufacturing market.",
  "A 100+ year industrial heritage can support the identity of Sangli professionals leading modern manufacturing innovation.",
  "This is a rooted-ambition window: colleges can become the default feeder for local and regional industry leaders as companies transform.",
];

const spotlight = [
  {
    icon: Settings2,
    title: "Precision manufacturing and Industry 4.0",
    eyebrow: "Local industry transformation",
    details: [
      "More than 18 Sangli-rooted manufacturers work across textiles, foundries, automotive supply, and precision engineering.",
      "Employers are investing in automation, IoT, and software-enabled manufacturing.",
      "65 Sangli students have been placed in technology-transformation roles.",
      "Roles connect mechanical engineering with automation, production with digital operations, and traditional manufacturing with IoT-enabled systems.",
    ],
  },
  {
    icon: Cpu,
    title: "Manufacturing software and emerging ventures",
    eyebrow: "Software for the industrial economy",
    details: [
      "More than 12 startups and new ventures in Sangli and nearby areas are described as building software for manufacturers.",
      "Focus areas include ERP, quality, supply chain, and manufacturing execution systems.",
      "50+ Sangli students have been placed in software, product, and implementation roles.",
      "Reported salaries are ₹2.4L–₹2.8L, with potential equity upside as startups scale.",
    ],
  },
];

const faqs = [
  {
    question: "Can students stay in Sangli and still keep up with peers who leave?",
    answer:
      "After three years, rooted students at industry-scale companies are reported at ₹3.8L and lead roles, with family nearby. Bangalore peers may earn a similar amount while paying twice the cost of living and living far from family.",
  },
  {
    question: "What if Sangli does not have the role a student wants?",
    answer:
      "Students can move to Bangalore or Pune after building two or more years of experience, a local network, and career momentum. That makes relocation a choice rather than a default.",
  },
  {
    question: "Is staying in Sangli risky if one company fails?",
    answer:
      "Company risk exists everywhere. Sangli has 35+ companies and emerging employers; after two years, students can explore other local opportunities with relevant experience.",
  },
  {
    question: "Will students feel isolated from Bangalore’s technology community?",
    answer:
      "Sangli’s manufacturing and emerging-technology community is growing. Students can take part in its industrial transformation and pursue remote work with Bangalore companies where available.",
  },
  {
    question: "Can a student work remotely for a Bangalore employer from Sangli?",
    answer:
      "Yes. Remote paths are available alongside local roles; locally rooted opportunities can offer closer mentorship and community.",
  },
  {
    question: "Will experience at a Sangli company help with future job changes?",
    answer:
      "Sangli manufacturing leadership and technology transformation can make experience scaling a local company a strong resume story for later opportunities.",
  },
  {
    question: "Will industry-scale companies hire from Sangli, or only local employers?",
    answer:
      "Sangli manufacturers scaling their technology, regional industrial leaders, and emerging manufacturing-tech companies offer a range of opportunities. Students can explore roles based on their skills and the employer’s needs.",
  },
  {
    question: "Does staying in Sangli limit a student’s career?",
    answer:
      "Staying in a role with little room to grow can feel limiting. StrideNex helps students discover employers investing in technology and understand each role’s responsibilities and growth path before making a decision.",
  },
  {
    question: "What if a student wants to move to another city later?",
    answer:
      "Students can build experience in Sangli and make future career decisions from a position of experience. Opportunities are also available with regional and remote employers.",
  },
  {
    question: "What if a company does not grow as expected?",
    answer:
      "Company growth can vary. Students should evaluate the team, role, and learning opportunity carefully. StrideNex’s employer network and mentor support can help them explore relevant next steps as their goals change.",
  },
  {
    question: "Is manufacturing experience useful for future technology roles?",
    answer:
      "Manufacturing context can complement engineering and software skills, particularly in automation, IoT, precision technology, and software-enabled manufacturing.",
  },
  {
    question: "Does college brand matter more than fundamentals?",
    answer:
      "Employer requirements differ, but technical fundamentals, practical context, projects, and ambition can all matter alongside college background. Students should review the criteria for each role.",
  },
  {
    question: "What does a college pilot involve?",
    answer:
      "A college can discuss its placement goals with StrideNex, review the dashboard, and plan a focused student cohort before deciding whether to expand the partnership.",
  },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 sm:text-sm">
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
      className="min-h-12 rounded-xl px-5 py-3 text-sm font-bold shadow-lg shadow-amber-900/15 transition hover:-translate-y-0.5"
    >
      <Link href="/contact-us?interest=institute-sangli">
        {children}
        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function SangliPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Engineering College Placements in Sangli | StrideNex",
    description:
      "Sangli engineering colleges connect students with ambitious careers in manufacturing, industrial technology, and Industry 4.0 through StrideNex.",
    url: "https://stridenex.ai/institutes/cities/sangli/",
    about: {
      "@type": "Place",
      name: "Sangli, Maharashtra, India",
    },
  };

  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 px-6 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-amber-300/25 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,#047857_1px,transparent_0)] [background-size:40px_40px]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary shadow-sm sm:text-sm">
              <MapPin aria-hidden="true" className="h-4 w-4 text-amber-700" />
              Institute partnerships · Sangli, Maharashtra
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              Sangli: local roots.{" "}
              <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-emerald-700 bg-clip-text text-transparent">
                Industry wings.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Sangli has a 100+ year legacy of industrial innovation in
              textiles, foundries, manufacturing, and precision engineering.
              Students can feel that staying local limits ambition. StrideNex
              connects them to 35+ industry-scale companies that need engineers
              who understand Sangli’s industrial roots and modern technology.
              More than 380 Sangli students built careers in the last year.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Build a career rooted at home with the ambition to contribute to
              industry at scale.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DemoLink>Request a college demo</DemoLink>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-12 rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
              >
                <Link href="#sangli-stories">
                  See Sangli success stories
                  <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Manufacturing context matters
              </span>
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Ambition can stay rooted
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
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/50 blur-3xl"
              />
              <div className="relative">
                <Eyebrow>Sangli · rooted career pathway</Eyebrow>
                <h2 className="mt-3 max-w-sm text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                  Build industry-scale careers from local strengths.
                </h2>
                <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { icon: Wrench, title: "Industrial roots", text: "Practical context" },
                    { icon: Cpu, title: "Modern capability", text: "Technology in action" },
                    { icon: TrendingUp, title: "Wider impact", text: "Industry-scale growth" },
                  ].map(({ icon: Icon, title, text }, index) => (
                    <div key={title} className="relative">
                      <div
                        className={`min-h-36 rounded-2xl border p-3 sm:p-4 ${
                          index === 2
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-slate-100 bg-slate-50/80"
                        }`}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
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
                          className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1 text-amber-700 sm:block"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-200">
                    Local roots · industry wings
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <span>Context</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-emerald-300" />
                    <span>Capability</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-emerald-300" />
                    <span>Impact</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="The Sangli opportunity"
          badgeColor="accent"
          title="Industrial heritage. Ambitious students. A missing bridge."
          subtitle="Sangli’s manufacturing strengths can connect students to modern engineering work, but local opportunity and career ambition are not always seen together."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl">
                <span className="text-sm font-extrabold tracking-widest text-amber-700">
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
          <div className="grid gap-5 rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <Eyebrow>For Sangli colleges</Eyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Rooted in home. Ready for industry-scale work.
              </h3>
            </div>
            <p className="leading-7 text-slate-600">
              StrideNex connects student capability with companies modernizing
              manufacturing and engineering. Students can explore ambitious
              roles without treating relocation as the only measure of success.
            </p>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="The Sangli community system"
          title="Connect industrial understanding with modern engineering"
          subtitle="A community-rooted approach helps students show what they can do and helps employers meet talent with relevant technical and practical strengths."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {pillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="flex h-full gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
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
                <Eyebrow>Sangli career trajectory</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold">
                  From local context to industrial innovation
                </h3>
                <p className="mt-3 leading-7 text-slate-300">
                  Students bring engineering fundamentals and practical
                  understanding to companies transforming how industry works.
                </p>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  "Student shares skills, projects, and industrial interests",
                  "StrideNex matches capability to relevant roles",
                  "A rooted mentor helps prepare for the opportunity",
                  "Student grows into ownership and wider impact",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-xl bg-white/[0.07] p-4 text-sm leading-6 text-slate-200"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-extrabold text-white">
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
          title="From college partnership to an industry-scale career"
          subtitle="A clear sequence connects the placement team, students, rooted mentors, and employers."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((step, index) => (
            <Reveal key={step.week} delay={index * 0.04}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
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
          badge="Sangli outcomes"
          title="Local roots. Industry wings."
          subtitle="A snapshot of student reach, employer access, career progression, and regional retention."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.04}>
              <article className="h-full rounded-2xl border border-white bg-white p-5 text-center shadow-sm sm:p-6">
                <p className="text-3xl font-black tracking-tight text-emerald-800 sm:text-4xl">
                  <AnimatedStatValue value={item.value} />
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {item.label}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div id="sangli-stories" className="scroll-mt-28 pt-20">
          <SectionHeader
            badge="Student stories"
            badgeColor="accent"
            title="Engineering careers built with Sangli roots"
            subtitle="Examples of students connecting their backgrounds with changing industrial and technology roles."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <Reveal key={story.name} delay={index * 0.04}>
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
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
                    <p className="font-bold text-emerald-800">{story.role}</p>
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
          badge="A different path"
          badgeColor="accent"
          title="Compare relocation, default local roles, and rooted ambition"
          subtitle="Help students consider opportunity, growth, and community together—not just the location of the first job."
        />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Consideration</th>
                <th scope="col" className="p-4 font-bold">Relocation-first</th>
                <th scope="col" className="p-4 font-bold">Local by default</th>
                <th scope="col" className="p-4 font-bold text-amber-200">StrideNex rooted path</th>
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
                              ? "font-semibold text-emerald-800"
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
            "Make industry-scale opportunities easier to discover.",
            "Show how manufacturing knowledge transfers to modern technology.",
            "Help students understand role scope and potential career growth.",
            "Build a college reputation around local industrial innovation.",
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
          title="Position your college as a bridge to industrial innovation"
          subtitle="Give the TPO team a structured way to connect students’ capabilities with employers modernizing manufacturing and engineering."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {placementSupport.map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 0.05}>
              <article className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
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
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-emerald-950/10 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-14">
            <div>
              <Eyebrow>Why Sangli, why now?</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                Industrial heritage meets a new wave of technology.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                Sangli’s manufacturing base and the shift toward automation,
                IoT, and software-enabled operations create a compelling
                opportunity for colleges and students.
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
        <div id="sangli-industry-spotlight" className="scroll-mt-28">
          <SectionHeader
            badge="Industry spotlight"
            badgeColor="accent"
            title="Sangli’s industrial strengths are evolving"
            subtitle="Established manufacturers and emerging ventures are creating opportunities at the intersection of engineering and technology."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {spotlight.map(({ icon: Icon, title, eyebrow, details }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
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
          title="Sangli placement objections and FAQs"
          subtitle="Explore how local industry, student goals, and career growth can fit into a placement journey."
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
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-200">
              Build Sangli’s rooted, ambitious pathway
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Connect your students with industry in transformation.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Start with a 30-minute call, see Sangli profiles and industry
              matches in the dashboard, meet rooted mentors, pilot with a
              student cohort, and scale to the full college.
            </p>
          </div>
          <DemoLink>Request a college demo</DemoLink>
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="white" spacing="compact">
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
              For students
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
              Explore engineering careers rooted in community.
            </h2>
            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Learn how engineering skills can connect to meaningful work and
              evolving industries.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-h-12 rounded-xl border-emerald-800/20 text-emerald-900 hover:bg-emerald-800 hover:text-white"
          >
            <Link href="/students/engineering-careers/">
              Explore engineering careers
              <Network aria-hidden="true" className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SectionWrapper>
    </div>
  );
}
