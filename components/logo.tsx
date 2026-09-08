import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Your Site Solution home">
      <span className="brand-mark" aria-hidden="true">
        YS
      </span>
      <span className="brand-name">Your Site Solution</span>
    </Link>
  );
}
