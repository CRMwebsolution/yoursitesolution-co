"use client";

import Link from "next/link";
import { ArrowRight, Box, MessageSquareText, Sparkles } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { useLanguage } from "@/components/language-provider";
import { ChatPreview } from "./chat-preview";
import { ThreePreview } from "./three-preview";
import {
  AvailabilityDemo,
  BeforeAfterDemo,
  BookingDemo,
  JobQrDemo,
  MultiLocationDemo,
  OrderTrackerDemo,
  PasswordGateDemo,
  PayLinkDemo,
  PhotoQuoteDemo,
  PriceListDemo,
  ThemeDemo,
  WorkOrderDemo,
} from "./upgrade-demos";

export function UpgradesContent() {
  const { t, lang, setLang } = useLanguage();

  const catalog = [
    {
      eyebrow: t("Compare the work", "Comparar el trabajo"),
      title: t("Before / after slider", "Control antes / después"),
      text: t(
        "Show the old page next to the new one. Customers drag the handle.",
        "Muestra la página vieja junto a la nueva. El cliente mueve la barra.",
      ),
      demo: <BeforeAfterDemo />,
    },
    {
      eyebrow: t("Job status", "Estado del trabajo"),
      title: t("Order tracker", "Seguimiento de orden"),
      text: t(
        "Same card style as the chat. The customer sees received, scheduled, on site, done.",
        "El mismo estilo del chat. El cliente ve recibido, agendado, en sitio, listo.",
      ),
      demo: <OrderTrackerDemo />,
    },
    {
      eyebrow: t("Language", "Idioma"),
      title: t("Bilingual toggle", "Cambio de idioma"),
      text: t(
        "English / Spanish for the chrome of this site and this page. Use the ES control in the header, or the one here.",
        "Inglés / español en la barra del sitio y en esta página. Usa ES en el encabezado o el control de aquí.",
      ),
      demo: (
        <div className="demo-pad">
          <button type="button" className="chip is-on" onClick={() => setLang(lang === "en" ? "es" : "en")}>
            {lang === "en" ? "Español" : "English"}
          </button>
          <p className="demo-note">
            {t("Header, footer, and this page change together.", "El encabezado, el pie y esta página cambian juntos.")}
          </p>
        </div>
      ),
    },
    {
      eyebrow: t("Scheduling", "Citas"),
      title: t("Click to book", "Reservar con un clic"),
      text: t(
        "A few open slots. Confirmation text ready. No calendar maze.",
        "Unos horarios libres. Texto de confirmación listo. Sin laberinto.",
      ),
      demo: <BookingDemo />,
    },
    {
      eyebrow: t("Private pages", "Páginas privadas"),
      title: t("Password page", "Página con clave"),
      text: t(
        "Invoices, photos, or job notes behind a simple password. Demo password is shop.",
        "Facturas, fotos o notas detrás de una clave. En la demo la clave es shop.",
      ),
      demo: <PasswordGateDemo />,
    },
    {
      eyebrow: t("Menus and rates", "Menús y tarifas"),
      title: t("Updateable list", "Lista editable"),
      text: t(
        "The owner changes a price. The public list follows.",
        "El dueño cambia un precio. La lista pública lo muestra.",
      ),
      demo: <PriceListDemo />,
    },
    {
      eyebrow: t("Inventory", "Inventario"),
      title: t("Live availability board", "Tablero en vivo"),
      text: t(
        "Open, hold, or out. Tap a unit to cycle the status.",
        "Libre, apartado o fuera. Toca una unidad para cambiar el estado.",
      ),
      demo: <AvailabilityDemo />,
    },
    {
      eyebrow: t("Estimates", "Cotizaciones"),
      title: t("Photo quote", "Cotizar con foto"),
      text: t(
        "Customer attaches a picture. You answer with a number.",
        "El cliente adjunta una foto. Tú contestas con un número.",
      ),
      demo: <PhotoQuoteDemo />,
    },
    {
      eyebrow: t("Payments", "Pagos"),
      title: t("Pay link", "Enlace de pago"),
      text: t(
        "Deposit buttons and a receipt screen. Live card processing is quoted separately.",
        "Botones de depósito y un recibo. Cobrar de verdad se cotiza aparte.",
      ),
      demo: <PayLinkDemo />,
    },
    {
      eyebrow: t("Look", "Apariencia"),
      title: t("Light / dark shop theme", "Tema claro / oscuro"),
      text: t(
        "Same layout, two skins. Useful when a shop works days and nights.",
        "La misma plantilla, dos pieles. Útil si el negocio trabaja de día y de noche.",
      ),
      demo: <ThemeDemo />,
    },
    {
      eyebrow: t("Paper trail", "Papel"),
      title: t("Printable work order", "Orden imprimible"),
      text: t(
        "Job details on a clean sheet the customer or crew can print.",
        "Datos del trabajo en una hoja que el cliente o el equipo puede imprimir.",
      ),
      demo: <WorkOrderDemo />,
    },
    {
      eyebrow: t("On the job", "En el trabajo"),
      title: t("QR for every job", "QR por trabajo"),
      text: t(
        "A code on the invoice or the windshield opens that job’s tracker.",
        "Un código en la factura o el parabrisas abre el seguimiento.",
      ),
      demo: <JobQrDemo />,
    },
    {
      eyebrow: t("More than one shop", "Más de un local"),
      title: t("Multi-location", "Varias sucursales"),
      text: t(
        "One site, different phone and hours per shop or jobsite.",
        "Un sitio, teléfono y horario distintos por local u obra.",
      ),
      demo: <MultiLocationDemo />,
    },
  ];

  return (
    <main id="main-content">
      <PageHero
        eyebrow={t("Optional upgrades", "Mejoras opcionales")}
        title={
          <>
            {t("The extras that make a site", "Los extras que hacen que el sitio") } <em>{t("do more.", "haga más.")}</em>
          </>
        }
        description={t(
          "A basic website does not need a chatbot or a 3D scene. When one of those pieces would actually help customers—or help you look like the business they should call—I can add it and quote it separately.",
          "Un sitio básico no necesita un chat ni una escena 3D. Si esa pieza ayuda a tus clientes—o te hace ver como el negocio al que deben llamar—la agrego y la cotizo aparte.",
        )}
        aside={
          <div className="workflow-mark" aria-hidden="true">
            <span>WEBSITE</span>
            <Sparkles />
            <strong>UPGRADE</strong>
          </div>
        }
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow={t("See it, then decide", "Míralo y decide")}
            title={
              <>
                {t("Examples that stay", "Ejemplos que siguen") } <span>{t("optional.", "opcionales.")}</span>
              </>
            }
            description={t(
              "These are add-ons, not part of the $300 or $750 starting websites. If they are useful, we scope them. If they are decoration, we'll let you know.",
              "Son extras, no parte de los sitios de $300 o $750. Si sirven, los acotamos. Si son adorno, te lo decimos.",
            )}
          />

          <div className="upgrade-showcase">
            <article className="upgrade-card">
              <p className="eyebrow">{t("Customer questions", "Preguntas")}</p>
              <h3>
                <MessageSquareText aria-hidden="true" /> {t("AI chat assistant", "Asistente de chat")}
              </h3>
              <p>
                {t(
                  "A small assistant on the site can answer hours, pricing ranges, and service-area questions after you close. Real jobs still come to you.",
                  "Un asistente en el sitio puede responder horario, precios y zona cuando ya cerraste. Los trabajos de verdad siguen llegando a ti.",
                )}
              </p>
              <div className="upgrade-stage">
                <ChatPreview />
              </div>
            </article>

            <article className="upgrade-card">
              <p className="eyebrow">{t("Interactive 3D", "3D interactivo")}</p>
              <h3>
                <Box aria-hidden="true" /> {t("Three.js scenes", "Escenas Three.js")}
              </h3>
              <p>
                {t(
                  "Product viewers, a brand mark, or a homepage piece that moves. Drag the YS plate to turn it.",
                  "Visores de producto, una marca o una pieza en la portada. Arrastra la placa YS para girarla.",
                )}
              </p>
              <div className="upgrade-stage">
                <ThreePreview />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="shell">
          <SectionHeading
            eyebrow={t("More extras", "Más extras")}
            title={
              <>
                {t("Each one is a line item you can", "Cada uno es una partida que puedes")} <span>{t("sell.", "vender.")}</span>
              </>
            }
          />
          <div className="upgrade-showcase">
            {catalog.map((item) => (
              <article className="upgrade-card" key={item.title}>
                <p className="eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="upgrade-stage">{item.demo}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell system-callout">
          <Sparkles aria-hidden="true" />
          <div>
            <p className="eyebrow eyebrow-light">{t("No menu of mystery fees", "Sin tarifas escondidas")}</p>
            <h2>{t("You describe the result. I tell you if it is worth building.", "Tú dices el resultado. Yo te digo si conviene construirlo.")}</h2>
            <p>
              {t(
                "Upgrades are quoted as their own job. If a paid service is required to run the chatbot, take cards, or host a 3D model, that cost is written down before work starts.",
                "Las mejoras se cotizan como trabajo aparte. Si hace falta un servicio de pago para el chat, las tarjetas o el modelo 3D, ese costo se escribe antes de empezar.",
              )}
            </p>
          </div>
          <Link className="button" href="/contact">
            {t("Ask about an upgrade", "Preguntar por una mejora")} <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CtaBanner
        eyebrow={t("Want one of these on a site?", "¿Quieres uno de estos en un sitio?")}
        title={t("Tell me what it should do.", "Dime qué tiene que hacer.")}
        text={t(
          "A chatbot, a 3D product view, a booking flow, or something I have not listed. Plain English is enough.",
          "Un chat, una vista 3D, reservas o algo que no esté en la lista. El español claro también sirve.",
        )}
      />
    </main>
  );
}
