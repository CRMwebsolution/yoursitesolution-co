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
  BilingualDemo,
  BookingDemo,
  JobQrDemo,
  MultiLocationDemo,
  OrderTrackerDemo,
  PasswordGateDemo,
  PhotoQuoteDemo,
  PriceListDemo,
  ThemeDemo,
  WorkOrderDemo,
} from "./upgrade-demos";

export function UpgradesContent() {
  const { t } = useLanguage();

  const catalog = [
    {
      eyebrow: t("Compare the work", "Comparar el trabajo"),
      title: t("Before / after slider", "Control antes / después"),
      text: t(
        "Show the old page next to the new one. Drop image URLs into the two placeholders when you have real shots.",
        "Muestra la página vieja junto a la nueva. Cuando tengas fotos reales, pegas las URLs en los dos espacios.",
      ),
      demo: <BeforeAfterDemo />,
    },
    {
      eyebrow: t("Job status", "Estado del trabajo"),
      title: t("Order tracker", "Seguimiento de orden"),
      text: t(
        "The customer opens one page and sees where their job sits: request in, date set, crew headed over, finished.",
        "El cliente abre una página y ve dónde va el trabajo: pedido, fecha, equipo en camino, terminado.",
      ),
      demo: <OrderTrackerDemo />,
    },
    {
      eyebrow: t("Language", "Idioma"),
      title: t("Bilingual toggle", "Cambio de idioma"),
      text: t(
        "Header, footer, and this upgrades page switch. Other pages stay English until those pages get their own copy. The card below is a shop homepage that flips with the same control.",
        "El encabezado, el pie y esta página de mejoras cambian. Las otras rutas siguen en inglés hasta que tengan su texto. La tarjeta es una portada de taller que cambia con el mismo control.",
      ),
      demo: <BilingualDemo />,
    },
    {
      eyebrow: t("Scheduling", "Citas"),
      title: t("Click to book", "Reservar con un clic"),
      text: t(
        "A week across the top. Four times under each day. One tap holds the window.",
        "Una semana arriba. Cuatro horas bajo cada día. Un toque aparta la ventana.",
      ),
      demo: <BookingDemo />,
    },
    {
      eyebrow: t("Private pages", "Páginas privadas"),
      title: t("Password page", "Página con clave"),
      text: t(
        "A real customer page sits behind the lock. Demo password is shop.",
        "Una página de cliente queda detrás del candado. En la demo la clave es shop.",
      ),
      demo: <PasswordGateDemo />,
    },
    {
      eyebrow: t("Menus and rates", "Menús y tarifas"),
      title: t("Updateable list", "Lista editable"),
      text: t(
        "The owner changes a rate. The public list follows.",
        "El dueño cambia una tarifa. La lista pública lo muestra.",
      ),
      demo: <PriceListDemo />,
    },
    {
      eyebrow: t("Inventory", "Inventario"),
      title: t("Live availability board", "Tablero en vivo"),
      text: t(
        "Named units with a short status. Tap to cycle open, on hold, or out.",
        "Unidades con nombre y un estado corto. Toca para pasar de libre a apartado o fuera.",
      ),
      demo: <AvailabilityDemo />,
    },
    {
      eyebrow: t("Estimates", "Cotizaciones"),
      title: t("Quote request with photos", "Cotizar con fotos"),
      text: t(
        "Name and job notes first. Photos are optional extras on the same request.",
        "Nombre y notas primero. Las fotos son extras opcionales del mismo pedido.",
      ),
      demo: <PhotoQuoteDemo />,
    },
    {
      eyebrow: t("Look", "Apariencia"),
      title: t("Light / dark shop theme", "Tema claro / oscuro"),
      text: t(
        "Same pages. A day skin and a night skin so after-hours work still reads.",
        "Las mismas páginas. Una piel de día y una de noche para leer después del cierre.",
      ),
      demo: <ThemeDemo />,
    },
    {
      eyebrow: t("Paper trail", "Papel"),
      title: t("Printable work order", "Orden imprimible"),
      text: t(
        "Customer, scope, window, crew, deposit, and balance on one sheet.",
        "Cliente, trabajo, ventana, equipo, depósito y saldo en una hoja.",
      ),
      demo: <WorkOrderDemo />,
    },
    {
      eyebrow: t("On the job", "En el trabajo"),
      title: t("QR for every job", "QR por trabajo"),
      text: t(
        "A code on the invoice or the windshield. Simulate scan to open that job.",
        "Un código en la factura o el parabrisas. Simula el escaneo para abrir el trabajo.",
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
            {t("The extras that make a site", "Los extras que hacen que el sitio")} <em>{t("do more.", "haga más.")}</em>
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
                {t("Examples that stay", "Ejemplos que siguen")} <span>{t("optional.", "opcionales.")}</span>
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
