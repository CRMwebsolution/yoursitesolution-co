import type { Metadata } from "next";
import { UpgradesContent } from "./upgrades-content";

export const metadata: Metadata = {
  title: "Optional Upgrades",
  description:
    "Optional website upgrades such as AI chat assistants, Three.js 3D scenes, booking tools, trackers, and bilingual pages—quoted only when they help the business.",
};

export default function UpgradesPage() {
  return <UpgradesContent />;
}
