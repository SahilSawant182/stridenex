import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "dark" | "light";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "dark",
}: SectionHeadingProps) {
  const isLight = tone === "light";

  return (
    <Reveal className="mb-10 max-w-3xl" animation="left">
      <p
        className={`mb-3 text-sm font-bold uppercase tracking-[0.18em] ${
          isLight ? "text-accent-light" : "text-accent"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          isLight ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={`mt-5 max-w-3xl text-base leading-7 sm:text-lg sm:leading-8 ${
            isLight ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}