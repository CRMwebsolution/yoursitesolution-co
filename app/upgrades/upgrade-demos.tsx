"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/language-provider";

export function BeforeAfterDemo() {
  const { t } = useLanguage();
  const [pos, setPos] = useState(58);
  return (
    <div className="ba-wrap">
      <div className="ba-stage">
        <div className="ba-pane ba-after">
          <span>{t("After", "Después")}</span>
          <strong>{t("Clear offer. One call.", "Oferta clara. Una llamada.")}</strong>
        </div>
        <div className="ba-pane ba-before" style={{ width: `${pos}%` }}>
          <span>{t("Before", "Antes")}</span>
          <strong>{t("Busy homepage. Hidden phone.", "Inicio lleno. Teléfono escondido.")}</strong>
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

const TRACK_STEPS = [
  ["Received", "Recibido"],
  ["Scheduled", "Agendado"],
  ["On site", "En sitio"],
  ["Done", "Listo"],
] as const;

export function OrderTrackerDemo() {
  const { t } = useLanguage();
  const [step, setStep] = useState(2);
  return (
    <div className="chat-preview tracker">
      <div className="chat-row from-bot">
        <small>{t("Job YS-184", "Trabajo YS-184")}</small>
        {t("Deck repair — Morehead City", "Reparación de deck — Morehead City")}
      </div>
      <div className="track-steps">
        {TRACK_STEPS.map(([en, es], index) => (
          <button
            key={en}
            type="button"
            className={index <= step ? "is-on" : ""}
            onClick={() => setStep(index)}
          >
            {t(en, es)}
          </button>
        ))}
      </div>
      <div className="chat-row from-visitor">
        <small>{t("Customer", "Cliente")}</small>
        {t("Crew is on the way. ETA 1:30.", "El equipo va en camino. Llegada 1:30.")}
      </div>
    </div>
  );
}

export function BookingDemo() {
  const { t } = useLanguage();
  const slots = ["9:00", "11:30", "2:00"];
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="demo-pad">
      <p className="demo-kicker">{t("Thursday", "Jueves")}</p>
      <div className="chip-row">
        {slots.map((slot) => (
          <button key={slot} type="button" className={picked === slot ? "chip is-on" : "chip"} onClick={() => setPicked(slot)}>
            {slot}
          </button>
        ))}
      </div>
      <p className="demo-note">
        {picked
          ? t(`Booked ${picked}. Confirmation text is ready.`, `Reservado a las ${picked}. El texto de confirmación está listo.`)
          : t("Pick a time. You get the booking, they get the text.", "Elige hora. Tú recibes la cita, ellos el texto.")}
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
    <div className="demo-pad">
      {open ? (
        <>
          <p className="demo-kicker">{t("Customer page", "Página del cliente")}</p>
          <p className="demo-note">{t("Invoice 184 is ready. Pay or download the work order.", "La factura 184 está lista. Paga o descarga la orden.")}</p>
          <button type="button" className="chip" onClick={() => setOpen(false)}>
            {t("Lock again", "Cerrar")}
          </button>
        </>
      ) : (
        <>
          <p className="demo-kicker">{t("Password", "Contraseña")}</p>
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
        </>
      )}
    </div>
  );
}

const STARTER_ITEMS = [
  { id: "oil", en: "Oil change", es: "Cambio de aceite", price: 49 },
  { id: "align", en: "Alignment", es: "Alineación", price: 89 },
  { id: "inspect", en: "Inspection", es: "Inspección", price: 25 },
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
              type="number"
              min={0}
              value={item.price}
              onChange={(e) =>
                setItems((current) =>
                  current.map((row) =>
                    row.id === item.id ? { ...row, price: Number(e.target.value) || 0 } : row,
                  ),
                )
              }
            />
          </span>
        </label>
      ))}
      <p className="demo-note">{t("Owner edits stick on the public list.", "El dueño cambia el precio y se ve en el sitio.")}</p>
    </div>
  );
}

type UnitStatus = "open" | "hold" | "out";

export function AvailabilityDemo() {
  const { t } = useLanguage();
  const [units, setUnits] = useState<Record<string, UnitStatus>>({
    "16'": "open",
    "20'": "hold",
    "24'": "out",
  });
  const cycle = (key: string) => {
    setUnits((current) => {
      const next = current[key] === "open" ? "hold" : current[key] === "hold" ? "out" : "open";
      return { ...current, [key]: next };
    });
  };
  const label = (status: UnitStatus) =>
    status === "open"
      ? t("Open", "Libre")
      : status === "hold"
        ? t("Hold", "Apartado")
        : t("Out", "Fuera");
  return (
    <div className="demo-pad">
      {Object.entries(units).map(([name, status]) => (
        <button key={name} type="button" className={`avail ${status}`} onClick={() => cycle(name)}>
          <strong>{name}</strong>
          <span>{label(status)}</span>
        </button>
      ))}
    </div>
  );
}

export function PhotoQuoteDemo() {
  const { t } = useLanguage();
  const [name, setName] = useState<string | null>(null);
  return (
    <div className="demo-pad">
      <label className="chip file-chip">
        {t("Add a photo", "Subir foto")}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => setName(e.target.files?.[0]?.name ?? null)}
        />
      </label>
      <p className="demo-note">
        {name
          ? t(`Got ${name}. Cody can price from the picture.`, `Recibí ${name}. Cody puede cotizar con la foto.`)
          : t("Customer sends a picture. You reply with a price.", "El cliente manda una foto. Tú contestas con el precio.")}
      </p>
    </div>
  );
}

export function PayLinkDemo() {
  const { t } = useLanguage();
  const [paid, setPaid] = useState<number | null>(null);
  return (
    <div className="demo-pad">
      {paid ? (
        <p className="demo-note">{t(`Receipt: $${paid} deposit recorded.`, `Recibo: depósito de $${paid} registrado.`)}</p>
      ) : (
        <div className="chip-row">
          {[50, 100, 250].map((amount) => (
            <button key={amount} type="button" className="chip" onClick={() => setPaid(amount)}>
              ${amount}
            </button>
          ))}
        </div>
      )}
      {paid ? (
        <button type="button" className="chip" onClick={() => setPaid(null)}>
          {t("Reset demo", "Reiniciar")}
        </button>
      ) : (
        <p className="demo-note">{t("No live card processing in this demo.", "Esta demo no cobra de verdad.")}</p>
      )}
    </div>
  );
}

export function ThemeDemo() {
  const { t } = useLanguage();
  const [dark, setDark] = useState(true);
  return (
    <div className={dark ? "theme-stage is-dark" : "theme-stage is-light"}>
      <p>{t("Same shop. Two skins.", "La misma tienda. Dos pieles.")}</p>
      <button type="button" className="chip" onClick={() => setDark((value) => !value)}>
        {dark ? t("Switch to light", "Pasar a claro") : t("Switch to dark", "Pasar a oscuro")}
      </button>
    </div>
  );
}

export function WorkOrderDemo() {
  const { t } = useLanguage();
  const printOrder = () => {
    const page = window.open("", "_blank", "width=640,height=720");
    if (!page) return;
    page.document.write(`<!doctype html><title>YS-184</title><body style="font-family:Georgia,serif;padding:32px">
      <p>YOUR SITE SOLUTION</p><h1>YS-184</h1>
      <p>Deck repair — Morehead City</p><p>Scheduled · On site · $250 deposit</p>
    </body>`);
    page.document.close();
    page.focus();
    page.print();
  };
  return (
    <div className="demo-pad">
      <p className="demo-kicker">YS-184</p>
      <p className="demo-note">{t("Deck repair. $250 deposit on file.", "Reparación de deck. Depósito de $250.")}</p>
      <button type="button" className="chip is-on" onClick={printOrder}>
        {t("Print work order", "Imprimir orden")}
      </button>
    </div>
  );
}

export function JobQrDemo() {
  const { t } = useLanguage();
  const cells = useMemo(() => {
    const out: boolean[] = [];
    for (let i = 0; i < 121; i += 1) out.push(((i * 7 + 13) % 5) > 1);
    return out;
  }, []);
  return (
    <div className="demo-pad qr-pad">
      <div className="qr-grid" aria-hidden="true">
        {cells.map((on, index) => (
          <span key={index} className={on ? "on" : ""} />
        ))}
      </div>
      <p className="demo-note">{t("Scan opens job YS-184 for the customer.", "El escaneo abre el trabajo YS-184.")}</p>
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
        {SHOPS[shop].phone} · {t(SHOPS[shop].hours, SHOPS[shop].hours)}
      </p>
    </div>
  );
}
