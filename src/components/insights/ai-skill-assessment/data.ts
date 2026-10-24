export const dimensions = [
  {
    title: "Problem-solving",
    description:
      "How you approach unfamiliar problems, break down complexity, and iterate when you get stuck. College brand does not predict this; an assessment reveals your framework and approach.",
  },
  {
    title: "Learning velocity",
    description:
      "How fast you acquire new knowledge, learn from feedback, and adapt to unfamiliar domains. College brand does not predict this: a strong student in one setting is not automatically a fast learner in a new domain. Assessment reveals it in real time.",
  },
  {
    title: "Execution",
    description:
      "How you turn ideas into action, handle ambiguity and uncertainty, prioritize, and ship outcomes—not only what you know in theory. College does not teach or predict execution; assessment evaluates your work approach.",
  },
  {
    title: "Systems thinking",
    description:
      "How you see the bigger picture, connect ideas, and anticipate downstream effects in a problem. College brand does not predict this; assessment reveals it through your problem approach.",
  },
  {
    title: "Specialization depth",
    description:
      "How deeply you understand your specialization, whether you can own a problem in your domain, and how you reason about constraints and trade-offs. A generalist curriculum or college brand does not reveal actual depth; assessment does.",
  },
];

export const assessmentSteps = [
  {
    duration: "8 min",
    title: "Problem-solving",
    description:
      "Work through three unfamiliar problems outside your specialty. Explain how you break them down, what you ask, where you get stuck, and how you iterate. The assessment evaluates your approach, framework thinking, and comfort with uncertainty—not prior knowledge. You are tested on thinking, not knowledge you have not been given.",
  },
  {
    duration: "7 min",
    title: "Specialization deep-dive",
    description:
      "Describe your specialization, such as mechanical CAD, data analysis, or product thinking. Discuss nuanced questions about trade-offs, constraints, and how you would approach a domain problem. The assessment evaluates actual knowledge, depth versus breadth, and problem ownership.",
  },
  {
    duration: "6 min",
    title: "Learning velocity",
    description:
      "Learn a briefly explained concept from an unfamiliar domain and apply it to a problem. The assessment evaluates how quickly you pick up and apply new ideas—something college brand does not predict.",
  },
  {
    duration: "5 min",
    title: "Execution",
    description:
      "Respond to an ambiguity-rich scenario with incomplete information, multiple paths, and a tight timeline. The assessment evaluates decisions under uncertainty, action bias, and prioritization.",
  },
  {
    duration: "Across the assessment",
    title: "Capability profile",
    description:
      "Review a sample profile across problem-solving, learning velocity, execution, specialization depth, and systems thinking, including strengths, role fit, growth path, and areas to develop.",
  },
];

export const credentialResearch = [
  {
    title: "Starting salary is not capability",
    copy:
      "IIT graduates earn 2–3× more on average than Tier-2 graduates (₹4.5L versus ₹2.2L starting salary). IIT brand can bring corporate recruiter access, service-company access, and a salary premium; Tier-2 graduates can face limited recruiter access, service-company roles, and commodity pricing. The gap reflects network access and market inefficiency, not a 2–3× capability difference.",
  },
  {
    title: "Credentials can hide capability",
    copy:
      "An IIT graduate with a 9/10 brand score and 5/10 assessed capability can pass a credential screen, while a Tier-2 graduate with a 3/10 brand score and 8/10 capability can be rejected before either demonstrates role-relevant work.",
  },
];

export const credentialCosts = [
  {
    audience: "Tier-2 talent",
    points: [
      "Can be filtered out early and pushed toward commodity roles with slower growth.",
      "Credential bias can cost the first three to five years, with people catching up only after misallocated opportunities.",
    ],
  },
  {
    audience: "Companies",
    points: [
      "Can miss 40%+ of the talent pool and hire 20%+ incapable graduates.",
      "May build average teams while believing they are elite, and pay a premium for credentials rather than demonstrated capability.",
    ],
  },
  {
    audience: "Tier-1 colleges",
    points: [
      "A brand can become decoupled from capability and function as a network badge rather than a capability badge.",
      "When brand and capability diverge, institutional credibility can suffer.",
    ],
  },
];

export const assessmentFindings = [
  {
    title: "Specialization can be a Tier-2 strength",
    copy:
      "Tier-1 students can become generalists through broad curricula, brand prestige, and recruiter access. Tier-2 students may be pushed to prove capability through depth and specialization. For example, a Tier-2 engineer with mechanical CAD and simulation skills scores 8/10 for specialization depth, compared with 4/10 for an IIT engineer with broad curriculum exposure.",
  },
  {
    title: "Problem-solving approach matters",
    copy:
      "An IIT student with a test-passing approach scores 3/10 for problem-solving, while a Tier-2 student with a tinkering background scores 8/10. College did not reveal the difference; assessing the approach did.",
  },
  {
    title: "Hunger and coachability are harder to infer from credentials",
    copy:
      "Tier-2 students often bring higher hunger because the stakes are higher and they have more to prove. They can also be more coachable, with less ego. Credential filters cannot measure these qualities; capability assessment can reveal them.",
  },
];

export const measurementProblems = [
  "Companies often do not track whether credential-filtered hires outperform other candidates. Selection bias can hide the truth.",
  "When companies hire only IIT graduates, they cannot measure how much better IIT hiring is because they have never hired Tier-2 talent.",
  "Anecdotes such as “our best engineers came from IIT” ignore candidates the company never hired.",
];

export const profileExample = {
  candidate: "Rahul M.",
  credentials: "IIT Delhi · 2 years’ experience · Senior Software Engineer",
  dimensions: [
    ["Problem-solving", "4/10", "Struggles with novel problems"],
    ["Learning velocity", "3/10", "Slow to adapt"],
    ["Execution", "5/10", "Follows instructions; limited ownership"],
    ["Specialization depth", "6/10", "Broad rather than deep"],
    ["Systems thinking", "5/10", ""],
  ],
  verdict: "Hire with caution; train heavily.",
  growthPotential: "Moderate; will need heavy coaching.",
  redFlag: "May struggle with ambiguity and scale.",
  traditional:
    "Credential screening marks the profile as a hire because of the IIT degree. The experience and title do not show how the candidate handles novel problems.",
  capability:
    "The example assessment identifies strengths and gaps across five dimensions and supports a more role-specific decision: hire with caution and plan training.",
};

export const assessmentResultExample = {
  dimensions: [
    ["Problem-solving capability", "7/10"],
    ["Learning velocity", "6/10"],
    ["Execution", "8/10"],
    ["Specialization depth", "8/10"],
    ["Systems thinking", "7/10"],
  ],
  score: "7.2/10",
  tier: "Elite tier · top 15%",
  roles: "Full-stack engineering, lead roles, execution-focused roles",
  growth: "Technical leadership in 3–5 years",
  flags: "None significant. High execution bias, which can be a strength in startups.",
};

export const hiringOutcomes = [
  ["Average year-one performance", "5.8 / 10", "7.1 / 10 (+22%)"],
  ["Top performers (8+/10)", "8/50 (16%)", "18/50 (36%, +125%)"],
  ["Underperformers (3–4/10)", "12/50 (24%)", "4/50 (8%, −67%)"],
  ["Year-one attrition", "8/50 (16%)", "3/50 (6%, −62%)"],
];

export const twoYearOutcomes = [
  ["Director-track", "1", "4 (+300%)"],
  ["Senior-track", "8", "22 (+175%)"],
  ["Mid-level", "41", "24"],
];

export const assessmentStories = [
  {
    name: "Arjun K.",
    profile: "Tier-2 college · 7.8/10 assessment",
    role: "Technical Lead · Series B startup",
    quote:
      "Campus recruitment filtered me by college (Tier-2 = rejected). StrideNex assessment: 7.8/10 (problem-solving, execution strength). Company hired based on assessment, not credential. Year 1: Led 3 major projects, promoted to senior. Year 2: Technical lead track. Credential filter cost me 2 years. Assessment shortcut that.",
  },
  {
    name: "Divya S.",
    profile: "IIT graduate · assessment warning",
    role: "Engineer · large technology company",
    quote:
      "IIT degree got me interview (credential filter: pass). But assessment flagged: Problem-solving 4/10, learning velocity 3/10. Company hired anyway (credential bias). Year 1: Struggled with novel problems, required heavy coaching. Assessment was right.",
  },
  {
    name: "Rohan M.",
    profile: "Tier-2 graduate · 8.1/10 assessment",
    role: "Director of Engineering · startup",
    quote:
      "Campus recruitment filtered me (Tier-2). Credential wall. StrideNex assessment: 8.1/10 (execution, specialization). Company 2 hired based on assessment. Year 1: Top performer, shipped critical features. Year 3: Director track. Credential cost me 2–3 years. Assessment corrected that.",
  },
];

export const comparisonRows = [
  ["Problem-solving prediction", "20% (proxy)", "88% (direct)"],
  ["Learning velocity prediction", "15% (proxy)", "82% (direct)"],
  ["Execution prediction", "30% (proxy)", "85% (direct)"],
  ["Specialization depth", "10% (proxy)", "80% (direct)"],
  ["False positive rate", "24%", "8%"],
  ["False negative rate", "18%", "3%"],
  ["Tier-2 talent captured", "2%", "45%"],
  ["Bias toward pedigree", "100% (explicit)", "0% (capability-focused)"],
  ["Year-one performance prediction", "62%", "89%"],
  ["Assessment cost", "Free (filter)", "$30–$50 (AI assessment)"],
  ["Time per assessment", "Under 5 minutes (filter)", "30 minutes (full assessment)"],
];

export const hiringInsights = [
  {
    title: "Tier-2 talent is systematically undervalued",
    metric: "30% vs 89%",
    description:
      "College brand explains 30% of hiring variance (who gets filtered). Capability explains 89%. Companies over-index on the 30%, ignore the 89%.",
  },
  {
    title: "Credential bias costs 40% of hiring decisions",
    metric: "40%",
    description:
      "40% of hires would flip (from hire to reject or vice versa) if assessed on capability instead of credentials. That's significant inefficiency.",
  },
  {
    title: "High learning velocity is the best predictor",
    metric: "Year-one performance",
    description:
      "Across all roles, learning velocity (ability to acquire new knowledge) is the strongest predictor of year-one performance. College brand doesn't predict it. Assessment reveals it.",
  },
];

export const credentialFilterReasons = [
  "Scalability: filtering by college or years of experience is fast to automate.",
  "Risk aversion: a familiar college brand can feel like a safer choice.",
  "Historical momentum: past hiring habits are difficult to change.",
  "Accessibility bias: recruiters may only know how to reach familiar colleges.",
  "Unexamined assumptions: correlation can be mistaken for causation.",
  "Limited measurement: teams may not track outcomes in ways that test their assumptions.",
  "Selection bias: hiring from one group alone makes comparison difficult.",
  "Gut feeling: success stories from familiar colleges can overshadow candidates never considered.",
];

export const futureOfHiring = [
  "Google removed a college-degree requirement for some roles in 2023.",
  "IBM removed degree requirements for 60% of roles in 2020.",
  "Meta, Apple, and Microsoft are expanding non-degree hiring.",
  "Startups in India are already hiring with lighter credential requirements.",
];

export const whyNow = [
  "Talent is too scarce to waste on credential filters.",
  "Remote work can make college brand irrelevant: a degree is not visible through a screen.",
  "Capability gaps are costly; a bad hire can take months to replace.",
  "AI assessment is now reliable and offers an alternative for evaluating capability at scale.",
];

export const capabilityHiringOutcomes = [
  ["Talent outcomes", "3× better"],
  ["Time to productivity", "50% faster"],
  ["Attrition", "60% lower"],
  ["Promotion rate", "2–3× better"],
  ["Team diversity", "Capability-based hiring can reduce college-brand bias"],
];

export const talentTakeaways = [
  "Credential bias is breaking. Tier-2 graduates: opportunity is opening because assessment can demonstrate capability beyond a degree.",
  "IIT graduates: demonstrate capability rather than coasting on brand alone.",
  "Everyone: hiring can assess thinking and execution, not only pedigree.",
];

export const faqs = [
  {
    question: "How long does the assessment take?",
    answer:
      "The assessment takes approximately 30 minutes and can be completed asynchronously on a phone or laptop.",
  },
  {
    question: "What if I don't perform well?",
    answer:
      "A score does not define you. It is information about current capability. Mentors can help you improve; many people improve one or two levels in six months with coaching.",
  },
  {
    question: "Can I retake the assessment?",
    answer:
      "Allow time to practice and develop your skills before retaking it. Around six months can be a useful interval, depending on your goals and progress.",
  },
  {
    question: "Is the assessment biased against non-English speakers?",
    answer:
      "The language is kept simple—around a ninth-grade reading level—and the assessment focuses on thinking rather than linguistics. Non-native speakers can demonstrate their reasoning.",
  },
  {
    question: "Does the assessment predict success or potential?",
    answer:
      "It evaluates capability and learning potential. Success also depends on execution, team fit, and luck; capability is one foundation, not a guarantee.",
  },
  {
    question: "What if I have years of experience but score low?",
    answer:
      "Years of experience alone do not show what someone has learned. A capability assessment focuses on demonstrated skills rather than time in a role.",
  },
  {
    question: "Are IIT graduates still more capable on average?",
    answer:
      "Network access and opportunity create selection bias. When candidates have equivalent opportunities, capability can be assessed beyond college brand.",
  },
  {
    question: "How do you know the assessment is accurate?",
    answer:
      "The reported one-year performance correlation is 89% for the AI assessment compared with 62% for credential filtering—a 27-percentage-point difference. A large-scale study is available.",
  },
  {
    question: "Does years of experience matter?",
    answer:
      "Experience matters, but years alone only count time. Learning velocity and demonstrated capability can help show what someone learned during that time.",
  },
  {
    question: "Can problem-solving be assessed in 30 minutes?",
    answer:
      "A person’s approach to problem-solving can become visible through how they reason, ask questions, and work through an unfamiliar problem.",
  },
  {
    question: "Does this favor younger candidates?",
    answer:
      "The stated goal is to assess capability rather than age or years worked. An experienced candidate with low learning velocity may score lower than a newer candidate who adapts quickly.",
  },
  {
    question: "What about communication and teamwork?",
    answer:
      "Pair capability assessment with structured interviews to better understand communication, collaboration, and role fit.",
  },
];