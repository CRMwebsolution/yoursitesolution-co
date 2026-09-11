"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/language-provider";

const BEFORE_IMAGE_URL = "";
const AFTER_IMAGE_URL = "/upgrades/after.jpg";

export function BeforeAfterDemo() {
  const { t } = useLanguage();
  const [pos, setPos] = useState(58);
  return (
    <div className="ba-wrap">
      <div className="ba-stage">
        <div
          className="ba-pane ba-after"
          style={AFTER_IMAGE_URL ? { backgroundImage: `url(${AFTER_IMAGE_URL})` } : undefined}
        >
          <span>{t("After", "Después")}</span>
          <strong>{AFTER_IMAGE_URL ? "" : t("Clear offer. Phone on the page.", "Oferta clara. Teléfono a la vista.")}</strong>
        </div>
        <div
          className="ba-pane ba-before"
          style={{
            width: `${pos}%`,
            ...(BEFORE_IMAGE_URL ? { backgroundImage: `url(${BEFORE_IMAGE_URL})` } : {}),
          }}
        >
          <span>{t("Before", "Antes")}</span>
          <strong>{BEFORE_IMAGE_URL ? "" : t("Busy homepage. Hidden number.", "Inicio lleno. Número escondido.")}</strong>
        </div>
        <input
          className="ba-range"
          type="range"
          min={8}
          max={92}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t("Compare before and after", "Comparar antes y después")}
        />
      </div>
    </div>
  );
}
