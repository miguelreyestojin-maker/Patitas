import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  tone?: "default" | "inverse";
};

export function SectionHeading({
  eyebrow,
  title,
  children,
  tone = "default",
}: SectionHeadingProps) {
  const inverse = tone === "inverse";

  return (
    <div className="max-w-2xl">
      <p
        className={`text-sm font-bold tracking-[0.14em] uppercase ${inverse ? "text-paper/80" : "text-sage-deep"}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-2 font-display text-3xl leading-tight sm:text-4xl ${inverse ? "text-paper" : "text-ink"}`}
      >
        {title}
      </h2>
      {children ? (
        <p
          className={`mt-3 text-base leading-relaxed sm:text-lg ${inverse ? "text-paper/85" : "text-muted"}`}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}
