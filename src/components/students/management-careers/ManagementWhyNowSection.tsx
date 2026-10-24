import {
  Building2,
  Compass,
  GraduationCap,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "./Reveal";
import { whyManagementNow } from "./data";

const icons = [Building2, Compass, GraduationCap, TrendingUp, UsersRound];

export default function ManagementWhyNowSection() {
  return (
    <SectionWrapper bgColor="gradient">
      <SectionHeader
        badge="The leadership inflection point"
        badgeColor="accent"
        title="Why explore management now?"
        subtitle="Growing companies need people who can help build the teams, systems, and functions behind sustainable growth."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {whyManagementNow.map((item, index) => {
          const Icon = icons[index];
          return (
            <Reveal
              key={item.title}
              delay={index * 0.06}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <article className="h-full rounded-2xl border border-white bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-8" direction="scale">
        <div className="rounded-3xl bg-primary px-6 py-8 text-white sm:px-10 sm:py-10">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-200">
            For graduates
          </p>
          <p className="mt-3 max-w-4xl text-lg font-semibold leading-8 sm:text-xl">
            Explore early-career management opportunities where graduates can
            build teams, take ownership of business outcomes, and learn from
            experienced leaders.
          </p>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
