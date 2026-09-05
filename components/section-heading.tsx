import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <p className={`eyebrow${light ? " eyebrow-light" : ""}`}>{eyebrow}</p>
      <h2>{title}</h2>
      {description ? (
        <p className={light ? "text-light" : "text-muted"}>{description}</p>
      ) : null}
    </div>
  );
}
