import { 
  Home, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Users, 
  Newspaper,
  Phone,
  Info,
  Briefcase,
  Shield,
  Sparkles,
  Zap,
  Globe,
  Code,
  Rocket,
  Award,
  Heart,
  Mail,
  GraduationCap,
  Building2,
  Handshake,
  Lightbulb,
  Star,
  type LucideIcon
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  badge?: string;
  badgeColor?: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavCategory {
  label: string;
  href?: string; // Add this for the main category link
  icon: LucideIcon;
  sections: NavSection[];
}

export const navigationConfig: Record<string, NavCategory> = {
  solutions: {
    label: "Solutions",
    icon: Target,
    sections: [
      {
        title: "For Students",
        items: [
          { 
            label: "Skill Facilitating", 
            href: "/solutions/skill-facilitating", 
            icon: Code,
            description: "Become industry-ready before you graduate",
            badge: "Popular",
            badgeColor: "accent"
          },
          { 
            label: "Entrepreneur Development", 
            href: "/solutions/entrepreneur", 
            icon: Rocket,
            description: "Transform ideas into scalable ventures",
          },
          { 
            label: "Higher Education", 
            href: "/solutions/higher-education", 
            icon: GraduationCap,
            description: "Prepare for advanced academic excellence",
          },
        ]
      },
      {
        title: "For Institutes",
        items: [
          { 
            label: "Industry Integration", 
            href: "/institutes/integration", 
            icon: Building2,
            description: "Enhance placement success",
          },
          { 
            label: "Skill Analytics", 
            href: "/institutes/analytics", 
            icon: TrendingUp,
            description: "Track student performance insights",
          },
        ]
      },
      {
        title: "For Industry",
        items: [
          { 
            label: "Talent Pipeline", 
            href: "/industry/talent", 
            icon: Users,
            description: "Access pre-evaluated candidate pools",
          },
          { 
            label: "Partnership Programs", 
            href: "/industry/partnerships", 
            icon: Handshake,
            description: "Collaborate on curriculum and projects",
          },
        ]
      },
    ]
  },
  
  pathways: {
    label: "Pathways",
    icon: TrendingUp,
    sections: [
      {
        title: "Development Tracks",
        items: [
          { 
            label: "Skill Facilitating Program", 
            href: "/pathways/skill-facilitating", 
            icon: Code,
            description: "Job-ready capabilities through applied learning",
          },
          { 
            label: "Entrepreneur Development", 
            href: "/pathways/entrepreneur", 
            icon: Rocket,
            description: "From idea validation to venture readiness",
          },
          { 
            label: "Higher Education Pathway", 
            href: "/pathways/higher-education", 
            icon: GraduationCap,
            description: "Guided specialization and profile strengthening",
          },
        ]
      },
    ]
  },
  
  outcomes: {
    label: "Outcomes",
    icon: Award,
    sections: [
      {
        title: "Impact",
        items: [
          { 
            label: "Student Success", 
            href: "/outcomes/students", 
            icon: Users,
            description: "Real stories of career transformation",
          },
          { 
            label: "Institute Outcomes", 
            href: "/outcomes/institutes", 
            icon: Building2,
            description: "Enhanced placement and reputation",
          },
          { 
            label: "Industry Impact", 
            href: "/outcomes/industry", 
            icon: Briefcase,
            description: "Reduced hiring risk, better talent",
          },
        ]
      },
      {
        title: "Metrics",
        items: [
          { 
            label: "Impact Report", 
            href: "/outcomes/report", 
            icon: TrendingUp,
            description: "Measurable career transformation",
          },
          { 
            label: "Case Studies", 
            href: "/outcomes/case-studies", 
            icon: BookOpen,
            description: "Success stories from our ecosystem",
          },
        ]
      },
    ]
  },
  
  about: {
    label: "About",
    href: "/about", // Main category link
    icon: Info,
    sections: [
      {
        title: "Company",
        items: [
          { 
            label: "Our Story", 
            href: "/about", 
            icon: Heart,
            description: "Why StrideNex was created",
          },
          { 
            label: "Capabilities", 
            href: "/about/capabilities", 
            icon: Sparkles,
            description: "Building a connected talent ecosystem",
          },
          { 
            label: "Core Solutions", 
            href: "/about/solutions", 
            icon: Target,
            description: "Three pathways. One structured journey",
          },
          { 
            label: "Leadership", 
            href: "/about/leadership", 
            icon: Users,
            description: "Guided by experience, driven by purpose",
          },
        ]
      },
      {
        title: "Community",
        items: [
          { 
            label: "Mentors", 
            href: "/about/mentors", 
            icon: Award,
            description: "Industry experts shaping future professionals",
          },
          { 
            label: "Experts & Advisors", 
            href: "/about/experts", 
            icon: Lightbulb,
            description: "Strategic expertise supporting innovation",
          },
          { 
            label: "Testimonials", 
            href: "/about/testimonials", 
            icon: Star,
            description: "Real stories. Real transformation",
          },
        ]
      },
      {
        title: "Connect",
        items: [
          { 
            label: "Contact Us", 
            href: "/about/contact", 
            icon: Phone,
            description: "Get in touch with our team",
          },
          { 
            label: "Partner With Us", 
            href: "/partners", 
            icon: Handshake,
            description: "Join our ecosystem",
            badge: "Join Us",
            badgeColor: "accent"
          },
        ]
      },
    ]
  },
  
  join: {
    label: "Join Us",
    href: "/signup",
    icon: Rocket,
    sections: [
      {
        title: "Roles",
        items: [
          {
            label: "Student",
            href: "/signup?role=student",
            icon: GraduationCap,
            description: "Start your career journey",
          },
          {
            label: "Institute",
            href: "/signup?role=college",
            icon: Building2,
            description: "Enhance placement success",
          },
          {
            label: "Mentor",
            href: "/signup?role=mentor",
            icon: Lightbulb,
            description: "Guide the next generation",
          },
          {
            label: "Industry",
            href: "/signup?role=industry",
            icon: Briefcase,
            description: "Access skilled talent",
          }
        ]
      }
    ]
  }
};

// Helper function to get badge color classes
export const getBadgeColorClasses = (color: string = 'primary') => {
  const colorMap: Record<string, { bg: string, text: string }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    accent: { bg: 'bg-accent/10', text: 'text-accent' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
  };
  return colorMap[color] || colorMap.primary;
};