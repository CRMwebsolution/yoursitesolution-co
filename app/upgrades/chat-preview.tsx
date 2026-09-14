"use client";

import { useLanguage } from "@/components/language-provider";

export function ChatPreview() {
  const { t } = useLanguage();
  return (
    <div className="chat-preview" aria-label={t("Example website chatbot conversation", "Ejemplo de chat en el sitio")}>
      <div className="chat-row from-visitor">
        <small>{t("Visitor", "Visitante")}</small>
        {t("Do you take Saturday jobs?", "¿Trabajan los sábados?")}
      </div>
      <div className="chat-row from-bot">
        <small>{t("Site assistant", "Asistente")}</small>
        {t(
          "Yes—Saturday appointments are available. I can collect the job details and send them to Cody.",
          "Sí, hay citas los sábados. Puedo tomar los datos y enviárselos a Cody.",
        )}
      </div>
      <div className="chat-row from-visitor">
        <small>{t("Visitor", "Visitante")}</small>
        {t("What does a basic website cost?", "¿Cuánto cuesta un sitio básico?")}
      </div>
      <div className="chat-row from-bot">
        <small>{t("Site assistant", "Asistente")}</small>
        {t(
          "A basic 3–5 page site starts at $750. I can take your name and number so Cody can follow up.",
          "Un sitio básico de 3–5 páginas empieza en $750. Puedo tomar tu nombre y número para que Cody te escriba.",
        )}
      </div>
    </div>
  );
}
