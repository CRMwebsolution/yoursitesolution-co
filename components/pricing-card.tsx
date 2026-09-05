import Link from "next/link";
import { Check } from "lucide-react";

type PricingCardProps = {
  name: string;
  price: number;
  description: string;
  payments: string[];
  features: string[];
  featured?: boolean;
};

export function PricingCard({
  name,
  price,
  description,
  payments,
  features,
  featured = false,
}: PricingCardProps) {
  return (
    <article className={`price-card${featured ? " price-card-featured" : ""}`}>
      <div className="price-card-topline">
        <p>{name}</p>
        {featured ? <span>Most common</span> : null}
      </div>
      <div className="price-amount">
        <span>from</span>
        <strong>${price}</strong>
      </div>
      <p className="price-description">{description}</p>
      <div className="payment-options">
        {payments.map((payment) => (
          <span key={payment}>{payment}</span>
        ))}
      </div>
      <ul className="check-list compact-list">
        {features.map((feature) => (
          <li key={feature}>
            <Check aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <Link className="button button-outline" href="/contact">
        Talk about your site
      </Link>
    </article>
  );
}
