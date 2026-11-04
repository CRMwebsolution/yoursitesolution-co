"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, ExternalLink, LoaderCircle, Mail, Search } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import type { ReplyPreview as Preview, ReplyPreviewScenario } from "@/lib/reply-preview";
import { findReplyPreset, getReplyPreset, REPLY_PRESETS, type PresetScenario } from "@/lib/reply-presets";

const exampleScenarios = ["auto_repair", "plumber", "lawn_care"] as const;

export function ReplyPreview() {
  const { t, lang } = useLanguage();
  const [scenario, setScenario] = useState<ReplyPreviewScenario | PresetScenario>("general");
  const [inventoryLinked, setInventoryLinked] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [business, setBusiness] = useState("");
  const [message, setMessage] = useState("");
  const [companySite, setCompanySite] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  const preset = findReplyPreset({ scenario, business, message, language: lang });

  function selectExample(value: ReplyPreviewScenario | PresetScenario) {
    setScenario(value);
    setInventoryLinked(false);
    setPreview(null);
    setError("");
    if (value === "auto_repair" || value === "plumber" || value === "lawn_care") {
      const example = REPLY_PRESETS[value][lang];
      setBusiness(example.business);
      setMessage(example.message);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(""); setPreview(null);
    if (preset) {
      setPreview(getReplyPreset(preset, lang, inventoryLinked));
      setPrepared(true);
      requestAnimationFrame(() => resultHeading.current?.focus());
      return;
    }
    setPrepared(false);
    setPending(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55_000);
    try {
      const response = await fetch("/api/upgrades/reply-preview", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenario: scenario === "plumber" ? "general" : scenario, business, message, language: lang, company_site: companySite }),
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
        <span className="reply-preview-live"><span aria-hidden="true" />{t("Try an email example", "Prueba un ejemplo de correo")}</span>
        <p>{t("Choose a prepared example, or write a custom question for a live reply. Compare the customer’s email with the owner’s private briefing.", "Elige un ejemplo preparado o escribe una pregunta propia para una respuesta en vivo. Compara el correo del cliente con el informe privado del dueño.")}</p>
      </div>
      <form className="reply-preview-form" onSubmit={submit} aria-busy={pending}>
        <fieldset disabled={pending}>
          <legend>{t("Start with an example, or write your own", "Elige un ejemplo o escribe el tuyo")}</legend>
          <div className="reply-preview-examples">
            {exampleScenarios.map(value => <button type="button" key={value} aria-pressed={preset === value} onClick={() => selectExample(value)}>{REPLY_PRESETS[value][lang].label}</button>)}
          </div>
          <label htmlFor="reply-preview-scenario">{t("Example or custom question", "Ejemplo o pregunta propia")}</label>
          <select id="reply-preview-scenario" value={scenario} onChange={event => selectExample(event.target.value as ReplyPreviewScenario | PresetScenario)} aria-describedby="reply-preview-sample-data">
            <option value="general">{t("Custom question — live reply", "Pregunta propia — respuesta en vivo")}</option>
            {exampleScenarios.map(value => <option key={value} value={value}>{REPLY_PRESETS[value][lang].label}</option>)}
          </select>
          <p id="reply-preview-sample-data" className="reply-preview-demo-note">{t("Prepared examples use sample records. Edit the message or business name to try a live custom reply.", "Los ejemplos preparados usan registros de muestra. Edita el mensaje o el nombre del negocio para probar una respuesta propia en vivo.")}</p>
          {preset === "plumber" ? <>
            <label className="reply-preview-inventory" htmlFor="reply-preview-inventory">
              <input id="reply-preview-inventory" type="checkbox" checked={inventoryLinked} onChange={event => {
                const linked = event.target.checked;
                setInventoryLinked(linked);
                if (preview && prepared) setPreview(getReplyPreset("plumber", lang, linked));
              }} aria-describedby="reply-preview-inventory-help" />
              {t("Linked to inventory", "Vinculado al inventario")}
            </label>
            <p id="reply-preview-inventory-help" className="reply-preview-demo-note">{t("Sample inventory only. Adds a parts-to-order note to the owner’s briefing.", "Solo inventario de ejemplo. Agrega una nota de piezas por pedir al informe del dueño.")}</p>
          </> : null}
          <label htmlFor="reply-preview-business">{t("Business receiving the request (optional)", "Negocio que recibe la solicitud (opcional)")}</label>
          <input id="reply-preview-business" value={business} maxLength={100} onChange={event => { setBusiness(event.target.value); setPreview(null); }} placeholder={t("Example: Coastal Auto Repair", "Ejemplo: Taller Mecánico Costero")} />
          <label htmlFor="reply-preview-message">{t("Customer’s message to the business", "Mensaje del cliente al negocio")}</label>
          <textarea id="reply-preview-message" value={message} onChange={event => { setMessage(event.target.value); setPreview(null); }} minLength={20} maxLength={1600} required rows={5} aria-describedby="reply-preview-help" placeholder={t("Example: Can you install this part on my truck, and do you have an appointment next week?", "Ejemplo: ¿Pueden instalar esta pieza en mi camioneta y tienen una cita la próxima semana?")} />
          <div className="honeypot" aria-hidden="true"><label htmlFor="reply-preview-company-site">Leave empty</label><input id="reply-preview-company-site" tabIndex={-1} autoComplete="off" value={companySite} onChange={event => setCompanySite(event.target.value)} /></div>
          <div className="reply-preview-submit">
            <p id="reply-preview-help">{t("Use sample information, not private customer details. No email is sent. Prepared examples are instant; custom questions allow three tries every fifteen minutes.", "Usa información de ejemplo sin datos privados. No se envían correos. Los ejemplos son inmediatos; las preguntas propias permiten tres intentos cada quince minutos.")}</p>
            <button className="button" type="submit" disabled={message.trim().length < 20}>{pending ? <LoaderCircle className="reply-preview-spin" aria-hidden="true" /> : <Mail aria-hidden="true" />}{pending ? t("Preparing your preview…", "Preparando la muestra…") : t("Preview the reply", "Ver la respuesta")}</button>
          </div>
        </fieldset>
        {pending ? <p className="reply-preview-status" role="status">{t("Checking the request, researching where useful, and drafting a reply. This may take a little time.", "Revisando la solicitud, investigando cuando sea útil y redactando la respuesta. Puede tardar un momento.")}</p> : null}
        {error ? <p className="reply-preview-error" role="alert">{error}</p> : null}
      </form>
      {preview ? <section className="reply-preview-results" aria-labelledby="reply-preview-result-title">
        <div className="reply-preview-result-header"><h4 id="reply-preview-result-title" tabIndex={-1} ref={resultHeading}>{t("Here is a sneak peek", "Una vista previa")}</h4><span><Check aria-hidden="true" />{prepared ? t("Prepared example — sample data", "Ejemplo preparado — datos de muestra") : preview.research.status === "completed" ? t("Public sources checked", "Fuentes públicas consultadas") : t("No outside lookup needed", "No hizo falta investigar")}</span></div>
        <div className="reply-preview-inboxes">
          <article className="reply-preview-email"><p className="reply-preview-label"><Mail aria-hidden="true" />{t("Customer reply", "Respuesta al cliente")}</p><div className="reply-preview-paper">{preview.customer_reply.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<p className="reply-preview-signature">{business.trim() || t("The team", "El equipo")}</p></div></article>
          <article className="reply-preview-owner"><p className="reply-preview-label"><Search aria-hidden="true" />{t("Owner-only briefing", "Informe solo para el dueño")}</p><div className="reply-preview-paper"><p>{preview.owner_summary}</p>{preview.findings.length ? <ul>{preview.findings.map((finding, index) => <li key={index}>{finding.text}</li>)}</ul> : null}<p><strong>{t("Next step", "Siguiente paso")}</strong><br />{preview.next_step}</p><p><strong>{t("With your schedule and inventory connected", "Con tu agenda e inventario conectados")}</strong><br />{t("The customer can receive a useful suggestion based on schedule or job details, using phrases such as “It looks like…” and “I’ll confirm and get back to you.” The owner gets the supporting checks, stock details, and purchasing tasks. This preview uses sample records; no appointment is booked.", "El cliente puede recibir una sugerencia útil según horarios o detalles del trabajo, con frases como «Parece que…» y «Lo confirmaré y te avisaré». El dueño recibe las verificaciones, existencias y tareas de compra. Esta muestra usa registros de ejemplo; no reserva citas.")}</p></div></article>
        </div>
        {preview.research.sources.length ? <div className="reply-preview-sources"><p>{t("Sources checked", "Fuentes consultadas")}</p><ul>{preview.research.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink aria-hidden="true" /></a></li>)}</ul></div> : null}
        <div className="reply-preview-foot"><p>{t("Both views are shown here for the demo. In your business, the customer gets the reply and you get the private briefing, using your services, voice, and rules.", "Aquí se muestran ambas vistas como demo. En tu negocio, el cliente recibe la respuesta y tú el informe privado, con tus servicios, estilo y reglas.")}</p><Link href="/contact">{t("Ask about this upgrade", "Preguntar por esta mejora")}<ArrowRight aria-hidden="true" /></Link></div>
      </section> : null}
    </div>
  );
}
