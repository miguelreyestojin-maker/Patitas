import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-lime text-ink shadow-[0_10px_24px_-14px_rgba(20,48,68,0.45)] hover:bg-clay",
  secondary:
    "border border-line bg-paper text-ink hover:border-sage hover:bg-cream",
  inverse:
    "border border-paper/30 bg-transparent text-paper hover:bg-paper/10",
} as const;

type ActionVariant = keyof typeof variants;

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ActionVariant;
  className?: string;
  onClick?: () => void;
};

export function ActionLink({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: ActionLinkProps) {
  const external = href.startsWith("http") || href.startsWith("mailto:");

  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep ${variants[variant]} ${className}`}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}
