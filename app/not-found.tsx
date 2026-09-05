import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found section-dark">
      <div className="shell">
        <p className="eyebrow eyebrow-light">404 · Wrong turn</p>
        <h1>This page does not exist.</h1>
        <p>The website is working. This address is not.</p>
        <Link className="button" href="/"><ArrowLeft aria-hidden="true" />Back to the homepage</Link>
      </div>
    </main>
  );
}
