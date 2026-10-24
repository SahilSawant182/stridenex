import Link from "next/link";

export default function RelatedLinks() {
  return (
    <nav
      aria-label="Related links"
      className="border-t border-slate-200 bg-slate-50 px-6 py-8 sm:py-10"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
        <Link className="transition-colors hover:text-primary hover:underline" href="/blogs">
          All insights
        </Link>
        <Link className="transition-colors hover:text-primary hover:underline" href="/about">
          About StrideNex
        </Link>
        <Link className="transition-colors hover:text-primary hover:underline" href="/contact-us">
          Contact for hiring
        </Link>
      </div>
    </nav>
  );
}