import Link from "next/link";
import { ArrowRight, GraduationCap, Rocket, Sparkles } from "lucide-react";

type ComingSoonPageProps = {
  title: string;
  description: string;
  audience: "entrepreneurship" | "higher education";
};

export default function ComingSoonPage({
  title,
  description,
  audience,
}: ComingSoonPageProps) {
  const Icon = audience === "entrepreneurship" ? Rocket : GraduationCap;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16 sm:px-6 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl sm:h-[26rem] sm:w-[26rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-24 -z-10 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl sm:h-[26rem] sm:w-[26rem]"
      />

      <div className="mx-auto w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 px-6 py-12 text-center shadow-xl shadow-slate-900/5 backdrop-blur sm:px-12 sm:py-16 lg:px-20">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-400" />

          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 sm:h-20 sm:w-20">
            <Icon aria-hidden="true" className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Coming soon
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-sm">
            StrideNex Student Pathways
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            {description}
          </p>

          <div className="mt-9 flex justify-center">
            <Link
              href="/students/engineering-careers"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:text-base"
            >
              Explore career pathways
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
