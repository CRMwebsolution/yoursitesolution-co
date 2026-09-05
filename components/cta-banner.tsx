import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CtaBannerProps = {
  eyebrow?: string;
  title?: string;
  text?: string;
};

export function CtaBanner({
  eyebrow = "Not sure where to start?",
  title = "Tell me what you need.",
  text = "Give me the problem in plain English. I’ll tell you what I can build, what it costs, and what happens next.",
}: CtaBannerProps) {
  return (
    <section className="section section-orange">
      <div className="shell cta-banner">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link className="button button-dark" href="/contact">
          Start the conversation <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
