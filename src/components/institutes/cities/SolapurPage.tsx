import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Check,
  Factory,
  GraduationCap,
  Handshake,
  MapPin,
  Network,
  Sparkles,
  Sprout,
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
    title: "Leaving is treated as the default",
    description:
      "Students can assume that building an ambitious career means moving away, even as local companies modernize and hire engineers.",
  },
  {
    title: "Local technology employers are hard to discover",
    description:
      "Textile, manufacturing, and agri-tech companies may be hiring, but they are not always visible through traditional campus drives.",
  },
  {
    title: "The city’s technology story is underrepresented",
    description:
      "Solapur’s industrial experience can be a strength for technology roles, yet students may not see how those skills transfer.",
  },
  {
    title: "Alumni connections are dispersed",
    description:
      "When graduates leave, colleges can lose access to mentors and local professional networks that could support future cohorts.",
  },
  {
    title: "Local companies need a clearer talent connection",
    description:
      "Employers digitizing factories and supply chains need engineers, while students may not know these roles exist nearby.",
  },
  {
    title: "The placement story reinforces the exodus",
    description:
      "TPOs are pushed to place students anywhere rather than build Solapur’s ecosystem; colleges risk a loss narrative, students split their identity between home and Bangalore, and local employers struggle to hire.",
  },
];

const pillars = [
  {
    icon: Users,
    title: "Community-rooted talent profiles",
    description:
      "Profile 500+ engineering students, including BAMU and SIEM students, for practical skills, manufacturing knowledge, and regional engineering strengths. Students’ lab experience, nearby textile work, and factory exposure complement software skills.",
  },
  {
    icon: Factory,
    title: "Solapur employer connections",
    description:
      "The 70+ Solapur and regional company network includes textile-tech startups digitizing looms, manufacturing and industrial firms across auto, sugar, chemicals, and textiles, agri-tech and food processing, manufacturing software, and automation ventures founded by Solapur entrepreneurs.",
  },
  {
    icon: Target,
    title: "Matching for manufacturing-aware technology",
    description:
      "Match practical context—such as robotics and textile projects—with digitizing textile and manufacturing teams. This industrial knowledge is a differentiator for roles where software, engineering, and factory-floor experience meet.",
  },
  {
    icon: Handshake,
    title: "Mentors who know the local ecosystem",
    description:
      "The 80+ Solapur-native mentors include engineers leading local technology teams, textile-tech founders, engineers who returned from Bangalore or Pune, and business owners digitizing factories. They help students consider growth, community, and staying as a choice.",
  },
];

const journey = [
  {
    week: "Week 1",
    title: "College partnership",
    description:
      "Partner with the college, connect the placement team to the dashboard, and brief the TPO on 70+ employers, the textile-tech ecosystem, and the stay-and-build pathway.",
  },
  {
    week: "Week 2",
    title: "Student onboarding",
    description:
      "Students map practical skills, projects, interests, and preferred roles. The assessment reframes their factory and manufacturing experience as a strength and surfaces textile-tech, industrial-startup, and agri-tech matches.",
  },
  {
    week: "Week 3",
    title: "Mentor introduction",
    description:
      "A local mentor can be a BAMU graduate from 2018 who is now CTO of a Solapur textile-tech startup. Mentors discuss why they stayed, what companies are building, and role expectations.",
  },
  {
    week: "Week 4",
    title: "Local company introductions",
    description:
      "StrideNex introduces students to textile startups, manufacturers, industrial automation, and agri-tech teams, with employers receiving context on projects and fit.",
  },
  {
    week: "Week 5",
    title: "Interviews and offers",
    description:
      "Students interview with mentor coaching before and after interviews. Typical offers are ₹2.2L–₹2.4L; mentors discuss local market rates, equity potential, and learning in a growth company.",
  },
  {
    week: "Week 6",
    title: "Joining and community",
    description:
      "Students begin Solapur roles, refer classmates, and help the TPO shift the story from an outbound placement pipeline to local technology careers. More than 50 local students across companies create an alumni network.",
  },
];

const outcomes = [
  { value: "500+", label: "Solapur students placed in the last 18 months" },
  { value: "28+", label: "Solapur colleges integrated or onboarding" },
  { value: "70+", label: "Solapur and regional employers hiring through StrideNex" },
  { value: "64%", label: "placed within 90 days of starting the journey" },
  { value: "₹2.32L", label: "average package reported for Solapur placements" },
  { value: "72%", label: "of placed students staying in Solapur" },
  { value: "60%", label: "of local employers returning to hire 5+ students yearly" },
];

const stories = [
  {
    name: "Aditya K.",
    college: "BAMU Solapur",
    role: "Software Engineer",
    company: "Textile-tech startup",
    quote:
      "BAMU is solid, but my dad wanted me in Bangalore for status. Solapur textile companies are modernizing, and I interned with one. StrideNex connected me with a Series A textile startup scaling its operations. I received ₹2.3L plus equity and am 25 minutes from home, building the future of Solapur textiles. Dad is proud now.",
  },
  {
    name: "Priya M.",
    college: "SIEM Solapur",
    role: "Automation Engineer",
    company: "Industrial IoT startup",
    quote:
      "Electrical engineers in Solapur seemed limited to power-systems maintenance, but I wanted automation. StrideNex introduced me to local industrial-automation startups, including a team building IoT for the region’s 50+ sugar plants. I received ₹2.2L and am solving a major problem for Solapur industry.",
  },
  {
    name: "Rohit S.",
    college: "Engineering college, Solapur",
    role: "Infrastructure Engineer",
    company: "Manufacturing company",
    quote:
      "Civil engineering in Solapur seemed limited to construction, but manufacturing plants need infrastructure technology—sensors, automation, and smart buildings. StrideNex matched me with a manufacturing company digitizing its campus. I received ₹2.1L and work 10 minutes from home.",
  },
  {
    name: "Sneha R.",
    college: "BAMU Solapur",
    role: "Backend Engineer",
    company: "Agri-tech startup",
    quote:
      "My parents assumed I would go to Bangalore for two years and return. StrideNex showed me agri-tech startups scaling in rural Maharashtra, including an IoT team serving cotton farms. I received ₹2.4L and now solve farmer problems from my city, with better quality of life and deep roots.",
  },
  {
    name: "Karan P.",
    college: "Private engineering college, Solapur",
    role: "Full-Stack Engineer",
    company: "Manufacturing software startup",
    quote:
      "I went to a private college with no brand recognition and assumed I would join a service company. StrideNex matched me with a manufacturing-software startup building SaaS for textile mills. I received ₹2.5L plus options. The team is partly Solapur-based and partly remote; my code runs in 500+ factories across India.",
  },
];

const comparisonRows = [
  ["Local company access", "No local network", "5–10 local jobs, often buried", "70+ Solapur companies prioritized"],
  ["Manufacturing-tech bridge", "Not highlighted", "Generic role categories", "Core positioning"],
  ["City narrative", "Brain drain", "Commodity hiring", "Community building"],
  ["Mentor network", "None", "None", "80+ Solapur-rooted mentors"],
  ["Timeline", "6+ months", "3–6 months", "6 weeks"],
  ["Student stay rate", "5% (Bangalore is the goal)", "20% return", "72% stay in Solapur"],
  ["Repeat hiring", "20%", "30%", "60% of employers hire 5+ students/year"],
  ["College narrative", "Brain-drain loss", "Neutral", "Students build Solapur"],
];

const placementSupport = [
  {
    icon: Factory,
    title: "Make local employers visible",
    copy: "Help students discover companies modernizing textiles, factories, supply chains, and agriculture.",
  },
  {
    icon: GraduationCap,
    title: "Recognize applied engineering skills",
    copy: "Give students’ practical projects and industry context a clear place in their profiles.",
  },
  {
    icon: BarChart3,
    title: "Track outcomes for the TPO",
    copy: "Follow student profiles, employer matches, interviews, and placement progress in one coordinated process.",
  },
  {
    icon: Network,
    title: "Grow the local alumni network",
    copy: "Connect students with local professionals and graduates who can support new cohorts and employer relationships.",
  },
];

const spotlight = [
  {
    title: "Textile-tech ecosystem",
    details: [
      "Eight textile-tech startups are active on StrideNex.",
      "Roles focus on software and automation for looms, supply chains, and quality processes.",
      "35 students have been placed in textile-tech roles, supporting a shift led by local engineers rather than outsourced teams.",
    ],
  },
  {
    title: "Manufacturing automation cluster",
    details: [
      "More than 15 companies are described as automating factories across local industries.",
      "The focus includes practical engineers with factory-floor and IoT understanding.",
      "68% of students are placed within 90 days, and the salary premium is 15% above the service-company average.",
    ],
  },
];

const faqs = [
  {
    question: "Will StrideNex send students to Bangalore anyway?",
    answer:
      "72% stay in Solapur by choice, supported by local company growth opportunities, equity, and a community-rooted career path.",
  },
  {
    question: "Do Solapur companies pay competitive salaries?",
    answer:
      "Manufacturing-tech startups pay ₹2.2L–₹2.6L. Housing, food, and transport cost less than in Bangalore, so students can save more despite lower nominal pay.",
  },
  {
    question: "Is the textile industry dying?",
    answer:
      "Manual textile work is declining while mills automate and supply chains digitize, creating a five-year period of opportunity for engineers in textile technology.",
  },
  {
    question: "Can a college change its placement narrative to staying?",
    answer:
      "Start with 20–30 students who want to stay, measure retention and satisfaction, and build a new college narrative over one to two years.",
  },
  {
    question: "Do Solapur companies offer equity?",
    answer:
      "Most VC-funded startups offer employee stock options, potentially worth ₹5L–₹15L if a company exits. Students should review each offer’s terms.",
  },
  {
    question: "Is textile-tech a bubble?",
    answer:
      "India’s textile industry is worth ₹200B+, and global automation creates a 10-year runway for technology work in this sector.",
  },
  {
    question: "Will alumni remain connected if they work locally?",
    answer:
      "Local professional networks support frequent interaction and investment in the city, unlike the more fragmented and transient Bangalore alumni network.",
  },
  {
    question: "Will students be limited if they start their careers in Solapur?",
    answer:
      "A local role can help students build practical manufacturing-tech experience. Students can reassess their goals and location preferences as their careers develop.",
  },
  {
    question: "Can women engineers find opportunities in Solapur’s technology ecosystem?",
    answer:
      "Opportunities span software, supply chain, quality, and other roles. Students should review each employer’s role, working environment, and policies when considering an opportunity.",
  },
  {
    question: "Do local companies offer equity?",
    answer:
      "Compensation and benefits vary by employer. Students should review the full offer, including any equity terms, with clear information about vesting and conditions.",
  },
  {
    question: "Is textile technology a viable career area?",
    answer:
      "Technology roles can support automation, digitized supply chains, quality systems, and manufacturing software. Students should assess individual companies and roles based on their goals.",
  },
  {
    question: "Can a college change its placement narrative?",
    answer:
      "A college can start by connecting interested students with local employers, tracking their experience, and sharing outcomes with future cohorts.",
  },
  {
    question: "Can students move to another city later?",
    answer:
      "Yes. Students can gain experience locally and make future career and location decisions based on their priorities.",
  },
];

const solapurAdvantages = [
  "Textile businesses are moving from manual work to automation, with a five-year window and urgent demand for engineers.",
  "More than 20 VC-funded textile-tech, agri-tech, and manufacturing-automation startups are described as having launched in the past three years.",
  "BAMU, SIEM, and 35+ colleges produce 2,000+ engineers each year, but Solapur graduates are currently funnelled to Bangalore.",
  "Colleges can establish a stay-and-build pathway now; the next 18 months are a first-mover window to build a network of 200+ alumni in local companies.",
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
      <Link href="/contact-us?interest=institute-solapur">
        {children}
        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function SolapurPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Engineering College Placements in Solapur | StrideNex",
    description:
      "Explore textile-tech, manufacturing, and local career pathways for Solapur colleges through skill matching and mentorship.",
    url: "https://stridenex.ai/institutes/cities/solapur/",
    about: {
      "@type": "Place",
      name: "Solapur, Maharashtra, India",
    },
  };

  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,#047857_1px,transparent_0)] [background-size:40px_40px]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary shadow-sm sm:text-sm">
              <MapPin aria-hidden="true" className="h-4 w-4 text-accent" />
              Institute partnerships · Solapur, Maharashtra
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              Solapur engineering careers: your city. Your future.{" "}
              <span className="bg-gradient-to-r from-emerald-700 via-primary to-accent bg-clip-text text-transparent">
                Your platform.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Solapur is India’s textile and sugar heart, but for decades
              “career” meant leaving for Bangalore. Manufacturing-tech
              companies are growing, textile startups are digitizing, and
              engineers are staying and building. StrideNex connects Solapur
              talent to 70+ companies in textile tech, automation, industrial
              IoT, and agri-tech. More than 500 students built local careers
              in the last year.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Your college can become a foundation for Solapur’s technology
              ecosystem—a platform in the city, not a pipeline out.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DemoLink>Request a college demo</DemoLink>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-12 rounded-xl border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white"
              >
                <Link href="#solapur-stories">
                  See Solapur success stories
                  <ArrowDown aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Built around Solapur’s industries
              </span>
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                Stay rooted. Stay ambitious.
              </span>
            </div>
          </div>

          <Reveal
            className="mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end"
            delay={0.12}
            direction="right"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white p-6 shadow-2xl shadow-emerald-950/10 sm:rounded-[2rem] sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/50 blur-3xl"
              />
              <div className="relative">
                <Eyebrow>Solapur · industry roots, technology futures</Eyebrow>
                <h2 className="mt-3 max-w-sm text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                  Practical engineering. Local impact.
                </h2>
                <div className="mt-7 space-y-3">
                  {[
                    {
                      name: "Textile technology",
                      detail: "Smart looms and digital supply chains",
                      icon: Network,
                    },
                    {
                      name: "Manufacturing",
                      detail: "Automation and connected factories",
                      icon: Factory,
                    },
                    {
                      name: "Agri-tech",
                      detail: "Technology for regional agriculture",
                      icon: Sprout,
                    },
                  ].map(({ name, detail, icon: Icon }, index) => (
                    <div
                      key={name}
                      className="flex items-center gap-4 rounded-2xl border border-emerald-50 bg-emerald-50/60 p-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">{name}</p>
                        <p className="mt-1 text-sm text-slate-500">{detail}</p>
                      </div>
                      <span className="text-xs font-extrabold tracking-wider text-orange-700">
                        0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">
                    Stay and build
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <span>Local skills</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-orange-300" />
                    <span>Local opportunity</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-orange-300" />
                    <span>Community growth</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionWrapper bgColor="white">
        <SectionHeader
          badge="The Solapur opportunity"
          badgeColor="accent"
          title="City pride. Career pathways still to connect."
          subtitle="Solapur has practical engineering talent and a deep industrial base. Connecting colleges with local employers can create more visible pathways to build careers here."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
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
          <div className="grid gap-5 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-amber-50 p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <Eyebrow>For Solapur colleges</Eyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                From a pipeline out to a platform for local growth.
              </h3>
            </div>
            <p className="leading-7 text-slate-600">
              Students can apply practical engineering skills to industries
              already rooted in Solapur. StrideNex helps make those employers
              and roles easier to discover while supporting colleges in growing
              lasting local relationships.
            </p>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper bgColor="slate">
        <SectionHeader
          badge="The Solapur impact system"
          title="A local talent bridge for industry and technology"
          subtitle="Connect practical student skills with employers modernizing textiles, factories, and agriculture."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {pillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="flex h-full gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
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
                <Eyebrow>Solapur local pride journey</Eyebrow>
                <h3 className="mt-3 text-2xl font-extrabold">
                  From hands-on skills to building close to home
                </h3>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  "Student shares practical engineering experience",
                  "StrideNex identifies local roles that fit",
                  "A Solapur mentor helps the student prepare",
                  "Student meets an employer building in the region",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-xl bg-white/[0.07] p-4 text-sm leading-6 text-slate-200"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white">
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
          title="From college partnership to local impact career"
          subtitle="A clear sequence brings placement teams, students, local mentors, and employers together."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((step, index) => (
            <Reveal key={step.week} delay={index * 0.04}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800">
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
          badge="Solapur outcomes"
          title="Students staying rooted and building locally"
          subtitle="A snapshot of student reach, local employer connections, and career outcomes described for Solapur."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.04} direction="scale">
              <article className="h-full rounded-2xl border border-white bg-white/90 p-6 text-center shadow-sm">
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

        <div id="solapur-stories" className="scroll-mt-28 pt-20">
          <SectionHeader
            badge="Student stories"
            badgeColor="accent"
            title="Stay rooted. Build work that reaches further."
            subtitle="Examples of students applying engineering and technology skills to local industry needs."
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
                    <p className="mt-3 text-sm font-semibold text-emerald-800">
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
          title="Local careers beyond the Bangalore pipeline"
          subtitle="StrideNex can complement campus drives by making Solapur employers and manufacturing-tech roles easier to discover."
        />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th scope="col" className="p-4 font-bold">Factor</th>
                <th scope="col" className="p-4 font-bold">Bangalore pipeline</th>
                <th scope="col" className="p-4 font-bold">Pan-India portals</th>
                <th scope="col" className="p-4 font-bold text-emerald-200">StrideNex local</th>
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
            "Make Solapur and regional employers more visible to students.",
            "Position practical engineering experience for technology roles.",
            "Give students a local pathway without framing it as settling.",
            "Build relationships among colleges, employers, and local mentors.",
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
          title="Turn local industry relationships into student pathways"
          subtitle="Support TPOs in building a stronger connection between students, employers, and Solapur’s evolving technology ecosystem."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {placementSupport.map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 0.05}>
              <article className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
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
              <Eyebrow>Why Solapur, why now?</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                The textile-tech inflection point is here.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                As local industries modernize, Solapur’s colleges can help
                prepare engineers to build the next generation of manufacturing
                and technology businesses in their own community.
              </p>
            </div>
            <ul className="grid gap-3">
              {solapurAdvantages.map((advantage) => (
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
        <div id="solapur-college-spotlight" className="scroll-mt-28">
          <SectionHeader
            badge="Company spotlight"
            badgeColor="accent"
            title="Technology pathways in Solapur’s industrial ecosystem"
            subtitle="Examples of employer clusters creating opportunities for engineers and technology graduates."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {spotlight.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <Eyebrow>Solapur ecosystem example</Eyebrow>
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
          title="Solapur placement objections and FAQs"
          subtitle="Explore how local careers and community-rooted growth can fit into your college’s placement programme."
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
              Build Solapur’s technology ecosystem
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Help your students build ambitious careers close to home.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Start with a 30-minute call, review Solapur profiles and local
              matches in the live dashboard, meet rooted mentors, pilot with
              20–30 students, and scale to the full college.
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
                href: "/contact-us?interest=institute-solapur",
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
