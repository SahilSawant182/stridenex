import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedStatValue from "../management-careers/AnimatedStatValue";
import Reveal from "../management-careers/Reveal";
import { engineeringStats, engineeringStories } from "./data";

export default function EngineeringOutcomesSection() {
  return (
    <section
      id="engineering-stories"
      className="scroll-mt-20 bg-gradient-to-br from-primary-dark via-[#11183d] to-slate-950 px-6 py-20 text-white sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Engineering outcomes"
          badgeColor="white"
          title="Engineers building products, systems, and expertise"
          titleClassName="text-white"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {engineeringStats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.04} direction="scale">
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm sm:p-6">
                <p className="text-2xl font-extrabold text-white sm:text-3xl">
                  <AnimatedStatValue value={stat.value} />
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {stat.label}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-16">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-light">
              Engineer stories
            </p>
            <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              Different disciplines. Different problems to solve.
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {engineeringStories.map((story, index) => (
              <Reveal
                key={story.name}
                delay={(index % 2) * 0.08}
                direction={index % 2 === 0 ? "left" : "right"}
              >
                <article className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent-light">
                    {story.background}
                  </p>
                  <h4 className="mt-2 text-xl font-bold text-white">
                    {story.name}
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-blue-200">
                    {story.role}
                  </p>
                  <p className="mt-4 leading-7 text-slate-300">
                    {story.quote}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
