"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, ExternalLink, LoaderCircle, Mail, Search } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import type { ReplyPreview as Preview } from "@/lib/reply-preview";

const examples = [
  { en: "Equipment maintenance", es: "Mantenimiento", message: "I rent out trailers and equipment. I want automatic maintenance reminders based on mileage. I use Optimus GPS trackers. Can you connect them to a maintenance tracker?", translated: "Alquilo remolques y equipo. Quiero recordatorios de mantenimiento según el kilometraje. Uso rastreadores GPS Optimus. ¿Se pueden conectar a un registro de mantenimiento?" },
  { en: "Booking updates", es: "Avisos de reservas", message: "I use Square for payments and Google Calendar for appointments. Can you automatically add a booking to my calendar when the customer pays and send a confirmation?", translated: "Uso Square para pagos y Google Calendar para citas. ¿Se puede agregar una reserva al calendario cuando el cliente paga y enviar una confirmación?" },
  { en: "A new website", es: "Un sitio nuevo", message: "I run a small lawn care business. I need a simple website with photos of our work, our service area, and a form where customers can ask for a quote.", translated: "Tengo un negocio pequeño de jardinería. Necesito un sitio con fotos, la zona de servicio y un formulario para pedir cotizaciones." },
];

export function ReplyPreview() {
  const { t, lang } = useLanguage();
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
        body: JSON.stringify({ business, message, language: lang, company_site: companySite }),
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
        <p>{t("Write a sample inquiry. See the customer reply and the useful notes a business owner could receive.", "Escribe una consulta de ejemplo. Mira la respuesta al cliente y las notas que podría recibir el dueño.")}</p>
      </div>
      <form className="reply-preview-form" onSubmit={submit} aria-busy={pending}>
        <fieldset disabled={pending}>
          <legend>{t("Start with an example, or write your own", "Elige un ejemplo o escribe el tuyo")}</legend>
          <div className="reply-preview-examples">
            {examples.map(example => <button type="button" key={example.en} onClick={() => { setMessage(lang === "es" ? example.translated : example.message); setPreview(null); setError(""); }}>{t(example.en, example.es)}</button>)}
          </div>
          <label htmlFor="reply-preview-business">{t("Business requesting the work (optional)", "Negocio que solicita el trabajo (opcional)")}</label>
          <input id="reply-preview-business" value={business} maxLength={100} onChange={event => setBusiness(event.target.value)} placeholder={t("Example: Coastal Equipment Rental", "Ejemplo: Alquiler de Equipo Costero")} />
          <label htmlFor="reply-preview-message">{t("What would the customer ask?", "¿Qué preguntaría el cliente?")}</label>
          <textarea id="reply-preview-message" value={message} onChange={event => { setMessage(event.target.value); setPreview(null); }} minLength={20} maxLength={1600} required rows={5} aria-describedby="reply-preview-help" placeholder={t("Describe a website or automation request, including any software it needs to work with…", "Describe una solicitud de sitio o automatización y el software que debe conectar…")} />
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
          <article className="reply-preview-email"><p className="reply-preview-label"><Mail aria-hidden="true" />{t("Customer reply", "Respuesta al cliente")}</p><div className="reply-preview-paper">{preview.customer_reply.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<p className="reply-preview-signature">Cody<br />Your Site Solution</p></div></article>
          <article className="reply-preview-owner"><p className="reply-preview-label"><Search aria-hidden="true" />{t("What the owner sees", "Lo que ve el dueño")}</p><div className="reply-preview-paper"><p>{preview.owner_summary}</p>{preview.findings.length ? <ul>{preview.findings.map((finding, index) => <li key={index}>{finding.text}</li>)}</ul> : null}<p><strong>{t("Next step", "Siguiente paso")}</strong><br />{preview.next_step}</p></div></article>
        </div>
        {preview.research.sources.length ? <div className="reply-preview-sources"><p>{t("Sources checked", "Fuentes consultadas")}</p><ul>{preview.research.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink aria-hidden="true" /></a></li>)}</ul></div> : null}
        <div className="reply-preview-foot"><p>{t("A short automated example. A system built for your business would use your services, voice, and rules.", "Un ejemplo automatizado breve. Un sistema para tu negocio usaría tus servicios, estilo y reglas.")}</p><Link href="/contact">{t("Ask about this upgrade", "Preguntar por esta mejora")}<ArrowRight aria-hidden="true" /></Link></div>
      </section> : null}
    </div>
  );
}
