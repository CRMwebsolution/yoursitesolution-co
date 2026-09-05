import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, description, aside }: PageHeroProps) {
  return (
    <section className="page-hero section-dark">
      <div className="shell page-hero-grid">
        <div>
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lede lede-light">{description}</p>
        </div>
        {aside ? <aside className="page-hero-aside">{aside}</aside> : null}
      </div>
    </section>
  );
}
