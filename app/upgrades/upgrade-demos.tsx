"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { AFTER_IMAGE_URL, BEFORE_IMAGE_URL } from "./field-photos";

export function BeforeAfterDemo() {
  const { t } = useLanguage();
  const [pos, setPos] = useState(52);
  return (
    <div className="ba-wrap">
      <div className="ba-stage">
        <div
          className="ba-pane ba-after"
          style={{ backgroundImage: `url(${AFTER_IMAGE_URL})` }}
        >
          <span className="ba-tag ba-tag-after">{t("After", "Después")}</span>
        </div>
        <div
          className="ba-pane ba-before"
          style={{
            width: `${pos}%`,
            backgroundImage: `url(${BEFORE_IMAGE_URL})`,
          }}
        >
          <span className="ba-tag ba-tag-before">{t("Before", "Antes")}</span>
        </div>
        <input
          className="ba-range"
          type="range"
          min={6}
          max={94}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t("Compare before and after", "Comparar antes y después")}
        />
      </div>
    </div>
  );
}
