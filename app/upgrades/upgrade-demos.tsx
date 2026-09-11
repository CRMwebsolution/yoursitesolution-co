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

const JOB = {
  id: "YS-184",
  customer: "Rivera",
  titleEn: "Deck boards and two stair treads",
  titleEs: "Tablas del deck y dos peldaños",
  placeEn: "Morehead City",
  placeEs: "Morehead City",
};

export function OrderTrackerDemo() {
  const { t } = useLanguage();
  const steps = [
    {
      key: "in",
      en: "Request in",
      es: "Pedido recibido",
      noteEn: "Form arrived Tuesday 4:12 p.m.",
      noteEs: "El formulario llegó el martes a las 4:12 p.m.",
    },
    {
      key: "set",
      en: "Date set",
      es: "Fecha fijada",
      noteEn: "Thursday window, 1:00–3:00.",
      noteEs: "Ventana del jueves, 1:00–3:00.",
    },
    {
      key: "way",
      en: "Crew headed over",
      es: "Equipo en camino",
      noteEn: "Left the shop at 12:40. On site by 1:30.",
      noteEs: "Salieron a las 12:40. En sitio a la 1:30.",
    },
    {
      key: "done",
      en: "Finished",
      es: "Terminado",
      noteEn: "Photos and the invoice go out after the job.",
      noteEs: "Fotos y factura salen al terminar.",
    },
  ];
  const [step, setStep] = useState(2);
  return (
    <div className="demo-pad status-pad">
      <p className="demo-kicker">{JOB.id} · {JOB.customer}</p>
      <p className="demo-note">
        <strong>{t(JOB.titleEn, JOB.titleEs)}</strong>
        <br />
        {t(JOB.placeEn, JOB.placeEs)}
      </p>
      <ol className="status-list">
        {steps.map((item, index) => (
          <li key={item.key}>
            <button
              type="button"
              className={index === step ? "is-on" : index < step ? "is-done" : ""}
              onClick={() => setStep(index)}
            >
              <span>{t(item.en, item.es)}</span>
              {index === step ? <small>{t(item.noteEn, item.noteEs)}</small> : null}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function BilingualDemo() {
  const { t, lang, setLang } = useLanguage();
  return (
    <div className="mini-page">
      <div className="mini-bar">
        <strong>Coastal Hardwood</strong>
        <button type="button" className="chip" onClick={() => setLang(lang === "en" ? "es" : "en")}>
          {lang === "en" ? "ES" : "EN"}
        </button>
      </div>
      <p className="mini-title">{t("Deck repair in Carteret County", "Reparación de decks en el condado Carteret")}</p>
      <p className="demo-note">
        {t(
          "Saturday work is open. Text the shop for a window.",
          "Hay trabajo los sábados. Escribe al taller para una ventana.",
        )}
      </p>
      <p className="demo-kicker">{t("(252) 622-7921 · Text preferred", "(252) 622-7921 · Mejor por texto")}</p>
    </div>
  );
}

const WEEK = [
  ["Mon", "Lun"],
  ["Tue", "Mar"],
  ["Wed", "Mié"],
  ["Thu", "Jue"],
  ["Fri", "Vie"],
  ["Sat", "Sáb"],
] as const;
const TIMES = ["8:00", "10:30", "1:00", "3:30"];

export function BookingDemo() {
  const { t } = useLanguage();
  const [picked, setPicked] = useState<string | null>("Thu-1:00");
  return (
    <div className="demo-pad book-pad">
      <div className="week-grid">
        {WEEK.map(([en, es]) => (
          <div key={en} className="week-col">
            <p>{t(en, es)}</p>
            {TIMES.map((time) => {
              const id = `${en}-${time}`;
              return (
                <button
                  key={id}
                  type="button"
                  className={picked === id ? "chip is-on" : "chip"}
                  onClick={() => setPicked(id)}
                >
                  {time}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="demo-note">
        {picked
          ? t(
              `${picked.replace("-", " ")} is held. Customer gets a confirmation text.`,
              `${picked.replace("-", " ")} queda apartado. El cliente recibe un texto.`,
            )
          : t("Pick a day and a time.", "Elige día y hora.")}
      </p>
    </div>
  );
}

export function PasswordGateDemo() {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className="mini-page private-page">
      <div className="mini-bar">
        <strong>{t("Customer page", "Página del cliente")}</strong>
        <span>YS-184</span>
      </div>
      <p className="mini-title">{t("Rivera · Deck repair", "Rivera · Reparación de deck")}</p>
      <ul className="mini-list">
        <li>{t("Invoice $1,240 · $250 deposit paid", "Factura $1,240 · Depósito $250 pagado")}</li>
        <li>{t("Thursday 1:00–3:00 window", "Ventana del jueves 1:00–3:00")}</li>
        <li>{t("Photos after the job", "Fotos al terminar")}</li>
      </ul>
      {!open ? (
        <div className="gate-cover">
          <p className="demo-kicker">{t("Private page", "Página privada")}</p>
          <p className="demo-note">{t("Customers see invoices and notes after a password.", "El cliente ve facturas y notas con una clave.")}</p>
          <form
            className="gate-form"
            onSubmit={(e) => {
              e.preventDefault();
              const ok = value.trim().toLowerCase() === "shop";
              setOpen(ok);
              setError(!ok);
            }}
          >
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("Try: shop", "Prueba: shop")}
              aria-label={t("Customer password", "Contraseña del cliente")}
            />
            <button type="submit" className="chip is-on">
              {t("Open", "Abrir")}
            </button>
          </form>
          {error ? <p className="demo-note">{t("Use shop for this demo.", "Usa shop en esta demo.")}</p> : null}
        </div>
      ) : (
        <button type="button" className="chip" onClick={() => setOpen(false)}>
          {t("Lock page", "Cerrar página")}
        </button>
      )}
    </div>
  );
}

const STARTER_ITEMS = [
  { id: "oil", en: "Oil change", es: "Cambio de aceite", price: "49" },
  { id: "align", en: "Alignment", es: "Alineación", price: "89" },
  { id: "inspect", en: "State inspection", es: "Inspección", price: "25" },
];

export function PriceListDemo() {
  const { t } = useLanguage();
  const [items, setItems] = useState(STARTER_ITEMS);
  return (
    <div className="demo-pad">
      {items.map((item) => (
        <label key={item.id} className="list-row">
          <span>{t(item.en, item.es)}</span>
          <span>
            $
            <input
              type="text"
              inputMode="decimal"
              value={item.price}
              onChange={(e) =>
                setItems((current) =>
                  current.map((row) => (row.id === item.id ? { ...row, price: e.target.value } : row)),
                )
              }
            />
          </span>
        </label>
      ))}
      <p className="demo-note">{t("Owner edits the rate. The public list follows.", "El dueño cambia la tarifa. La lista pública lo muestra.")}</p>
    </div>
  );
}

type UnitStatus = "open" | "hold" | "out";

const UNITS: Array<{ id: string; en: string; es: string; detailEn: string; detailEs: string; start: UnitStatus }> = [
  {
    id: "16",
    en: "16' utility trailer",
    es: "Remolque utilitario 16'",
    detailEn: "Ready on the lot today.",
    detailEs: "Listo en el lote hoy.",
    start: "open",
  },
  {
    id: "20",
    en: "20' dump trailer",
    es: "Remolque de volteo 20'",
    detailEn: "Hold for a Saturday job.",
    detailEs: "Apartado para un trabajo del sábado.",
    start: "hold",
  },
  {
    id: "24",
    en: "24' equipment trailer",
    es: "Remolque de equipo 24'",
    detailEn: "Out until Tuesday morning.",
    detailEs: "Fuera hasta el martes por la mañana.",
    start: "out",
  },
];

export function AvailabilityDemo() {
  const { t } = useLanguage();
  const [units, setUnits] = useState<Record<string, UnitStatus>>(
    Object.fromEntries(UNITS.map((unit) => [unit.id, unit.start])),
  );
  const cycle = (id: string) => {
    setUnits((current) => {
      const next = current[id] === "open" ? "hold" : current[id] === "hold" ? "out" : "open";
      return { ...current, [id]: next };
    });
  };
  const label = (status: UnitStatus) =>
    status === "open" ? t("Open", "Libre") : status === "hold" ? t("On hold", "Apartado") : t("Out", "Fuera");
  return (
    <div className="demo-pad">
      {UNITS.map((unit) => (
        <button key={unit.id} type="button" className={`avail ${units[unit.id]}`} onClick={() => cycle(unit.id)}>
          <span>
            <strong>{t(unit.en, unit.es)}</strong>
            <small>{t(unit.detailEn, unit.detailEs)}</small>
          </span>
          <em>{label(units[unit.id])}</em>
        </button>
      ))}
    </div>
  );
}

export function PhotoQuoteDemo() {
  const { t } = useLanguage();
  const [files, setFiles] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  return (
    <div className="demo-pad">
      {sent ? (
        <p className="demo-note">
          {t(
            `Quote request in. Name, job notes, and ${files.length || 1} photo(s) go to the shop.`,
            `Pedido de cotización listo. Nombre, notas y ${files.length || 1} foto(s) llegan al taller.`,
          )}
        </p>
      ) : (
        <>
          <p className="demo-kicker">{t("Quote request", "Pedido de cotización")}</p>
          <p className="demo-note">
            {t(
              "Name, what needs work, and optional photos. The picture is extra, not the whole request.",
              "Nombre, qué hay que hacer y fotos opcionales. La foto es un extra, no todo el pedido.",
            )}
          </p>
          <div className="chip-row">
            <label className="chip file-chip">
              {t("Add photos", "Agregar fotos")}
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) =>
                  setFiles(Array.from(e.target.files ?? []).map((file) => file.name))
                }
              />
            </label>
            <button type="button" className="chip is-on" onClick={() => setSent(true)}>
              {t("Send request", "Enviar pedido")}
            </button>
          </div>
          {files.length ? (
            <p className="demo-kicker">{files.join(", ")}</p>
          ) : (
            <p className="demo-kicker">{t("No photos yet — still a valid request.", "Sin fotos aún — el pedido vale igual.")}</p>
          )}
        </>
      )}
    </div>
  );
}

export function ThemeDemo() {
  const { t } = useLanguage();
  const [dark, setDark] = useState(true);
  return (
    <div className={dark ? "theme-stage is-dark" : "theme-stage is-light"}>
      <p className="demo-kicker">{t("Shop theme", "Tema del taller")}</p>
      <p className="mini-title">{t("Same pages. Day skin or night skin.", "Las mismas páginas. Piel de día o de noche.")}</p>
      <p className="demo-note">
        {t(
          "Hours, prices, and the phone stay put. Only the background and type color change so a shop that works after dark is still readable.",
          "Horario, precios y teléfono se quedan. Solo cambian el fondo y el texto para que un taller de noche se lea igual.",
        )}
      </p>
      <button type="button" className="chip" onClick={() => setDark((value) => !value)}>
        {dark ? t("Preview light", "Ver claro") : t("Preview dark", "Ver oscuro")}
      </button>
    </div>
  );
}

export function WorkOrderDemo() {
  const { t } = useLanguage();
  const printOrder = () => {
    const page = window.open("", "_blank", "width=640,height=800");
    if (!page) return;
    page.document.write(`<!doctype html><title>Work order YS-184</title>
      <body style="font-family:Georgia,serif;padding:36px;color:#16382c">
        <p>YOUR SITE SOLUTION · WORK ORDER</p>
        <h1>YS-184</h1>
        <p><strong>Customer:</strong> Rivera</p>
        <p><strong>Job:</strong> Replace deck boards and two stair treads</p>
        <p><strong>Site:</strong> Morehead City</p>
        <p><strong>Window:</strong> Thursday 1:00–3:00</p>
        <p><strong>Crew:</strong> Two on site</p>
        <p><strong>Deposit:</strong> $250 received</p>
        <p><strong>Balance due after photos:</strong> $990</p>
      </body>`);
    page.document.close();
    page.focus();
    page.print();
  };
  return (
    <div className="demo-pad">
      <p className="demo-kicker">{t("Work order YS-184", "Orden YS-184")}</p>
      <p className="demo-note">
        {t(
          "Rivera · Deck boards and two stair treads · Morehead City. Thursday 1:00–3:00. Two on the crew. $250 deposit in, $990 after photos.",
          "Rivera · Tablas del deck y dos peldaños · Morehead City. Jueves 1:00–3:00. Dos en el equipo. $250 de depósito, $990 después de las fotos.",
        )}
      </p>
      <button type="button" className="chip is-on" onClick={printOrder}>
        {t("Print this order", "Imprimir esta orden")}
      </button>
    </div>
  );
}

export function JobQrDemo() {
  const { t } = useLanguage();
  const [scanned, setScanned] = useState(false);
  const cells = useMemo(() => {
    const out: boolean[] = [];
    for (let i = 0; i < 121; i += 1) out.push(((i * 7 + 13) % 5) > 1);
    return out;
  }, []);
  return (
    <div className="demo-pad qr-pad">
      {scanned ? (
        <>
          <p className="demo-kicker">{t("Scanned YS-184", "Escaneado YS-184")}</p>
          <p className="demo-note">
            {t(
              "Rivera · Deck repair · Crew headed over. Left the shop at 12:40. On site by 1:30.",
              "Rivera · Reparación de deck · Equipo en camino. Salieron a las 12:40. En sitio a la 1:30.",
            )}
          </p>
          <button type="button" className="chip" onClick={() => setScanned(false)}>
            {t("Back to code", "Volver al código")}
          </button>
        </>
      ) : (
        <>
          <div className="qr-grid" aria-hidden="true">
            {cells.map((on, index) => (
              <span key={index} className={on ? "on" : ""} />
            ))}
          </div>
          <p className="demo-note">{t("Tape this on the invoice or the windshield.", "Pégalo en la factura o el parabrisas.")}</p>
          <button type="button" className="chip is-on" onClick={() => setScanned(true)}>
            {t("Simulate scan", "Simular escaneo")}
          </button>
        </>
      )}
    </div>
  );
}

const SHOPS = {
  Newport: { phone: "(252) 622-7921", hours: "Mon–Fri 8–5" },
  Morehead: { phone: "(252) 555-0144", hours: "Tue–Sat 9–4" },
  Jobsite: { phone: "(252) 622-7921", hours: "By appointment" },
} as const;

export function MultiLocationDemo() {
  const { t } = useLanguage();
  const [shop, setShop] = useState<keyof typeof SHOPS>("Newport");
  const names: Record<keyof typeof SHOPS, [string, string]> = {
    Newport: ["Newport", "Newport"],
    Morehead: ["Morehead", "Morehead"],
    Jobsite: ["Jobsite", "Obra"],
  };
  return (
    <div className="demo-pad">
      <div className="chip-row">
        {(Object.keys(SHOPS) as Array<keyof typeof SHOPS>).map((key) => (
          <button key={key} type="button" className={shop === key ? "chip is-on" : "chip"} onClick={() => setShop(key)}>
            {t(...names[key])}
          </button>
        ))}
      </div>
      <p className="demo-note">
        {SHOPS[shop].phone} · {SHOPS[shop].hours}
      </p>
    </div>
  );
}
