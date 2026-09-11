import type { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";

type BrowserToolHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  note?: string;
};

export function BrowserToolHeader({
  eyebrow,
  title,
  description,
  note = "Runs on this device. Nothing you enter is submitted or saved.",
}: BrowserToolHeaderProps) {
  return (
    <header className="utility-intro tool-page-hero">
      <div className="tool-page-hero-copy">
        <p className="eyebrow eyebrow-light">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede lede-light tool-page-hero-lede">{description}</p>
      </div>
      <p className="browser-only-note">
        <LockKeyhole aria-hidden="true" /> {note}
      </p>
    </header>
  );
}
