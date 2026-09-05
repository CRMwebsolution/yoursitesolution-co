import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Your Site Solution home">
      <span className="brand-mark" aria-hidden="true">
        <span>Y</span>
        <span>S</span>
      </span>
      <span className="brand-name">
        <strong>Your Site</strong>
        <span>Solution</span>
      </span>
    </Link>
  );
}
