"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, ExternalLink, LoaderCircle, Mail, Search } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import type { ReplyPreview as Preview, ReplyPreviewScenario } from "@/lib/reply-preview";

const examples = [
  { scenario: "auto_repair", en: "Auto repair", es: "Taller mecánico", business: "Example Auto Repair", translatedBusiness: "Taller de Ejemplo", message: "Can you install a REDARC Tow-Pro Liberty brake controller on my 2021 Ford F-150? I tow a trailer with electric brakes and would like to come in next week.", translated: "¿Pueden instalar un controlador de frenos REDARC Tow-Pro Liberty en mi Ford F-150 2021? Remolco un tráiler con frenos eléctricos y quisiera ir la próxima semana." },
  { scenario: "equipment_rental", en: "Equipment rental", es: "Alquiler de equipo", business: "Example Equipment Rental", translatedBusiness: "Alquiler de Equipo de Ejemplo", message: "I need a mini excavator for a backyard trench this Saturday. The access gate is 42 inches wide. Do you have a machine that will fit, and can you deliver it?", translated: "Necesito una miniexcavadora para una zanja este sábado. El portón mide 42 pulgadas de ancho. ¿Tienen una máquina que quepa y pueden entregarla?" },
  { scenario: "lawn_care", en: "Lawn care", es: "Jardinería", business: "Example Lawn Care", translatedBusiness: "Jardinería de Ejemplo", message: "Can you mow and edge my yard in Newport next week? It is about half an acre. I would like to set up regular service after the first visit.", translated: "¿Pueden cortar el césped y perfilar los bordes de mi jardín en Newport la próxima semana? Tiene aproximadamente medio acre. Me gustaría contratar un servicio regular después de la primera visita." },
] as const;

export function ReplyPreview() {
  const { t, lang } = useLanguage();
  const [scenario, setScenario] = useState<ReplyPreviewScenario>("general");
  const [business, setBusiness] = useState("");
  const [message, setMessage] = useState("");
  const [companySite, setCompanySite] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError(""); setPreview(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55_000);
    try {
      const response = await fetch("/api/upgrades/reply-preview", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenario, business, message, language: lang, company_site: companySite }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok || !data.preview) throw new Error(data.error || t("The preview could not finish. Please try again.", "No se pudo completar. Inténtalo otra vez."));
      setPreview(data.preview);
      requestAnimationFrame(() => resultHeading.current?.focus());
    } catch (error) {
      setError(error instanceof Error && error.name === "AbortError"
        ? t("This preview took too long. Try a shorter sample.", "La muestra tardó demasiado. Prueba un mensaje más corto.")
        : error instanceof Error ? error.message : t("Please try again.", "Inténtalo otra vez."));
    } finally { clearTimeout(timeout); setPending(false); }
  }

  return (
    <div className="reply-preview" id="reply-preview">
      <div className="reply-preview-intro">
        <span className="reply-preview-live"><span aria-hidden="true" />{t("Try a live example", "Prueba un ejemplo en vivo")}</span>
        <p>{t("Try a customer message to a local business. Compare the reply the customer gets with the private briefing the owner receives.", "Prueba un mensaje de un cliente a un negocio local. Compara la respuesta al cliente con el informe privado que recibe el dueño.")}</p>
      </div>
      <form className="reply-preview-form" onSubmit={submit} aria-busy={pending}>
        <fieldset disabled={pending}>
          <legend>{t("Start with an example, or write your own", "Elige un ejemplo o escribe el tuyo")}</legend>
          <div className="reply-preview-examples">
            {examples.map(example => <button type="button" key={example.en} onClick={() => { setScenario(example.scenario); setBusiness(lang === "es" ? example.translatedBusiness : example.business); setMessage(lang === "es" ? example.translated : example.message); setPreview(null); setError(""); }}>{t(example.en, example.es)}</button>)}
          </div>
          <label htmlFor="reply-preview-scenario">{t("Sample business setup", "Datos de ejemplo del negocio")}</label>
          <select id="reply-preview-scenario" value={scenario} onChange={event => { setScenario(event.target.value as ReplyPreviewScenario); setPreview(null); setError(""); }} aria-describedby="reply-preview-sample-data">
            <option value="general">{t("General business — no sample records", "Negocio general — sin registros de ejemplo")}</option>
            <option value="auto_repair">{t("Auto repair — sample schedule", "Taller mecánico — agenda de ejemplo")}</option>
            <option value="equipment_rental">{t("Equipment rental — sample inventory", "Alquiler de equipo — inventario de ejemplo")}</option>
            <option value="lawn_care">{t("Lawn care — sample recurring openings", "Jardinería — horarios recurrentes de ejemplo")}</option>
          </select>
          <p id="reply-preview-sample-data" className="reply-preview-demo-note">{t("Uses sample schedule and inventory data, not live business records.", "Usa datos de agenda e inventario de ejemplo, no registros reales de un negocio.")}{" "}{scenario === "auto_repair" ? t("Sample opening: Tuesday after lunch.", "Horario de ejemplo: martes después del almuerzo.") : scenario === "equipment_rental" ? t("Sample inventory: a 38-inch-wide mini excavator. Rental dates and delivery still need checking.", "Inventario de ejemplo: una miniexcavadora de 38 pulgadas de ancho. Las fechas y la entrega aún requieren confirmación.") : scenario === "lawn_care" ? t("Sample recurring options: weekly Monday mornings or every other Thursday afternoon.", "Opciones de ejemplo: cada lunes por la mañana o jueves por la tarde cada dos semanas.") : t("Choose a sample setup to include its records in the reply.", "Elige un negocio de ejemplo para incluir sus registros en la respuesta.")}</p>
          <label htmlFor="reply-preview-business">{t("Business receiving the request (optional)", "Negocio que recibe la solicitud (opcional)")}</label>
          <input id="reply-preview-business" value={business} maxLength={100} onChange={event => { setBusiness(event.target.value); setPreview(null); }} placeholder={t("Example: Coastal Auto Repair", "Ejemplo: Taller Mecánico Costero")} />
          <label htmlFor="reply-preview-message">{t("Customer’s message to the business", "Mensaje del cliente al negocio")}</label>
          <textarea id="reply-preview-message" value={message} onChange={event => { setMessage(event.target.value); setPreview(null); }} minLength={20} maxLength={1600} required rows={5} aria-describedby="reply-preview-help" placeholder={t("Example: Can you install this part on my truck, and do you have an appointment next week?", "Ejemplo: ¿Pueden instalar esta pieza en mi camioneta y tienen una cita la próxima semana?")} />
          <div className="honeypot" aria-hidden="true"><label htmlFor="reply-preview-company-site">Leave empty</label><input id="reply-preview-company-site" tabIndex={-1} autoComplete="off" value={companySite} onChange={event => setCompanySite(event.target.value)} /></div>
          <div className="reply-preview-submit">
            <p id="reply-preview-help">{t("Use an example, not private customer details. No email is sent. Three tries every fifteen minutes.", "Usa un ejemplo sin datos privados. No se envía ningún correo. Tres intentos cada quince minutos.")}</p>
            <button className="button" type="submit" disabled={message.trim().length < 20}>{pending ? <LoaderCircle className="reply-preview-spin" aria-hidden="true" /> : <Mail aria-hidden="true" />}{pending ? t("Preparing your preview…", "Preparando la muestra…") : t("Preview the reply", "Ver la respuesta")}</button>
          </div>
        </fieldset>
        {pending ? <p className="reply-preview-status" role="status">{t("Checking the request, researching where useful, and drafting a reply. This may take a little time.", "Revisando la solicitud, investigando cuando sea útil y redactando la respuesta. Puede tardar un momento.")}</p> : null}
        {error ? <p className="reply-preview-error" role="alert">{error}</p> : null}
      </form>
      {preview ? <section className="reply-preview-results" aria-labelledby="reply-preview-result-title">
        <div className="reply-preview-result-header"><h4 id="reply-preview-result-title" tabIndex={-1} ref={resultHeading}>{t("Here is a sneak peek", "Una vista previa")}</h4><span><Check aria-hidden="true" />{preview.research.status === "completed" ? t("Public sources checked", "Fuentes públicas consultadas") : t("No outside lookup needed", "No hizo falta investigar")}</span></div>
        <div className="reply-preview-inboxes">
          <article className="reply-preview-email"><p className="reply-preview-label"><Mail aria-hidden="true" />{t("Customer reply", "Respuesta al cliente")}</p><div className="reply-preview-paper">{preview.customer_reply.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<p className="reply-preview-signature">{business.trim() || t("The team", "El equipo")}</p></div></article>
          <article className="reply-preview-owner"><p className="reply-preview-label"><Search aria-hidden="true" />{t("Owner-only briefing", "Informe solo para el dueño")}</p><div className="reply-preview-paper"><p>{preview.owner_summary}</p>{preview.findings.length ? <ul>{preview.findings.map((finding, index) => <li key={index}>{finding.text}</li>)}</ul> : null}<p><strong>{t("Next step", "Siguiente paso")}</strong><br />{preview.next_step}</p><p><strong>{t("With your schedule and inventory connected", "Con tu agenda e inventario conectados")}</strong><br />{t("The customer can receive a useful suggestion based on availability or equipment details, using phrases such as “It looks like…” and “I’ll confirm and get back to you.” The owner gets the supporting checks, stock details, and purchasing tasks. This preview uses sample records; no appointment or rental is booked.", "El cliente puede recibir una sugerencia útil según horarios o equipo, con frases como «Parece que…» y «Lo confirmaré y te avisaré». El dueño recibe las verificaciones, existencias y tareas de compra. Esta muestra usa registros de ejemplo; no reserva citas ni alquileres.")}</p></div></article>
        </div>
        {preview.research.sources.length ? <div className="reply-preview-sources"><p>{t("Sources checked", "Fuentes consultadas")}</p><ul>{preview.research.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink aria-hidden="true" /></a></li>)}</ul></div> : null}
        <div className="reply-preview-foot"><p>{t("Both views are shown here for the demo. In your business, the customer gets the reply and you get the private briefing, using your services, voice, and rules.", "Aquí se muestran ambas vistas como demo. En tu negocio, el cliente recibe la respuesta y tú el informe privado, con tus servicios, estilo y reglas.")}</p><Link href="/contact">{t("Ask about this upgrade", "Preguntar por esta mejora")}<ArrowRight aria-hidden="true" /></Link></div>
      </section> : null}
    </div>
  );
}
