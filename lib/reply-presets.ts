import type { ReplyPreview, ReplyPreviewInput } from "./reply-preview";

export type PresetScenario = "auto_repair" | "plumber" | "lawn_care";

type LocalizedPreset = {
  label: string;
  business: string;
  message: string;
  customer_reply: string[];
  owner_summary: string;
  next_step: string;
};

export const REPLY_PRESETS: Record<PresetScenario, Record<"en" | "es", LocalizedPreset>> = {
  auto_repair: {
    en: {
      label: "Auto repair",
      business: "Example Auto Repair",
      message: "Can you install a REDARC Tow-Pro Liberty brake controller on my 2021 Ford F-150? I tow a trailer with electric brakes and would like to come in next week.",
      customer_reply: [
        "Thanks for asking about a REDARC Tow-Pro Liberty brake controller for your 2021 Ford F-150. We can start by checking your truck’s setup and the installation requirements for towing your trailer.",
        "It looks like we have an opening Tuesday after lunch to look at your truck and confirm what the installation would involve. I’ll confirm the time and let you know.",
        "Does your truck already have a factory trailer brake controller, and would Tuesday after lunch work for you?",
      ],
      owner_summary: "The customer wants a REDARC Tow-Pro Liberty installed in a 2021 Ford F-150. The sample calendar shows a possible inspection opening Tuesday after lunch; fitment, wiring, and required parts still need checking.",
      next_step: "Confirm the calendar opening and the truck’s existing brake-controller setup before offering an installation or ordering parts.",
    },
    es: {
      label: "Taller mecánico",
      business: "Taller de Ejemplo",
      message: "¿Pueden instalar un controlador de frenos REDARC Tow-Pro Liberty en mi Ford F-150 2021? Remolco un tráiler con frenos eléctricos y quisiera ir la próxima semana.",
      customer_reply: [
        "Gracias por preguntar por un controlador REDARC Tow-Pro Liberty para tu Ford F-150 2021. Podemos empezar por revisar la configuración de la camioneta y los requisitos de instalación para remolcar tu tráiler.",
        "Parece que tenemos un espacio el martes después del almuerzo para revisar la camioneta y confirmar qué requiere la instalación. Confirmaré la hora y te avisaré.",
        "¿La camioneta ya tiene un controlador de frenos de fábrica y te serviría el martes después del almuerzo?",
      ],
      owner_summary: "El cliente quiere instalar un REDARC Tow-Pro Liberty en una Ford F-150 2021. La agenda de ejemplo indica una posible revisión el martes después del almuerzo; falta verificar compatibilidad, cableado y piezas.",
      next_step: "Confirma el horario y el controlador actual de la camioneta antes de ofrecer una instalación o pedir piezas.",
    },
  },
  plumber: {
    en: {
      label: "Plumber",
      business: "Example Plumbing",
      message: "Can you replace my leaking 50-gallon electric water heater in Newport? I would like to have it replaced next week. What would you need to get started?",
      customer_reply: [
        "Thanks for reaching out about the leaking 50-gallon electric water heater at your home in Newport. It looks like a replacement may be the right next step, once we’ve checked the existing unit and connections.",
        "A photo of the heater’s label and the surrounding connections would help us check the replacement requirements. We’ll also need to review our schedule for next week before offering a time.",
        "Can you send those photos and let us know whether the heater is in a garage, closet, or another space? I’ll confirm and get back to you.",
      ],
      owner_summary: "The customer wants a leaking 50-gallon electric water heater replaced in Newport next week. Confirm the unit specifications, connections, access, and schedule before quoting or accepting the job.",
      next_step: "Request photos of the label and connections, review access, and confirm the replacement requirements and appointment availability.",
    },
    es: {
      label: "Plomero",
      business: "Plomería de Ejemplo",
      message: "¿Pueden reemplazar mi calentador de agua eléctrico de 50 galones que tiene una fuga en Newport? Quisiera cambiarlo la próxima semana. ¿Qué necesitan para empezar?",
      customer_reply: [
        "Gracias por escribirnos sobre el calentador eléctrico de 50 galones con fuga en tu casa en Newport. Parece que reemplazarlo podría ser el siguiente paso, después de revisar el equipo y sus conexiones.",
        "Una foto de la etiqueta y de las conexiones nos ayudaría a revisar los requisitos del reemplazo. También tenemos que consultar la agenda de la próxima semana antes de ofrecer un horario.",
        "¿Puedes enviar esas fotos y decirnos si está en un garaje, armario u otro lugar? Lo confirmaré y te avisaré.",
      ],
      owner_summary: "El cliente quiere reemplazar un calentador eléctrico de 50 galones con fuga en Newport la próxima semana. Confirma las especificaciones, conexiones, acceso y agenda antes de cotizar o aceptar el trabajo.",
      next_step: "Pide fotos de la etiqueta y las conexiones, revisa el acceso y confirma los requisitos del reemplazo y la disponibilidad de citas.",
    },
  },
  lawn_care: {
    en: {
      label: "Lawn care",
      business: "Example Lawn Care",
      message: "Can you mow and edge my yard in Newport next week? It is about half an acre. I would like to set up regular service after the first visit.",
      customer_reply: [
        "Thanks for asking about mowing and edging your half-acre yard in Newport. It looks like we have recurring openings Monday mornings for weekly service or Thursday afternoons for service every other week.",
        "I’ll confirm when I get the calendar in front of me and get back to you. We’ll also need to check the yard’s access and condition before confirming the first visit and a price.",
        "Which recurring option would work better for you, and what address would we be servicing?",
      ],
      owner_summary: "The customer wants mowing and edging for a half-acre yard in Newport, followed by regular service. Sample openings are weekly Monday mornings or every other Thursday afternoon; verify the route and yard details.",
      next_step: "Confirm the preferred frequency, service address, yard condition, and calendar before quoting or scheduling the first visit.",
    },
    es: {
      label: "Jardinería",
      business: "Jardinería de Ejemplo",
      message: "¿Pueden cortar el césped y perfilar los bordes de mi jardín en Newport la próxima semana? Tiene aproximadamente medio acre. Me gustaría contratar un servicio regular después de la primera visita.",
      customer_reply: [
        "Gracias por preguntar por el corte de césped y los bordes de tu jardín de medio acre en Newport. Parece que tenemos espacios los lunes por la mañana para servicio semanal o los jueves por la tarde cada dos semanas.",
        "Lo confirmaré al revisar la agenda y te avisaré. También necesitamos revisar el acceso y el estado del jardín antes de confirmar la primera visita y el precio.",
        "¿Cuál de las dos opciones prefieres y cuál sería la dirección del servicio?",
      ],
      owner_summary: "El cliente pide corte de césped y bordes para medio acre en Newport, con servicio regular después. Los horarios de ejemplo son cada lunes por la mañana o jueves por la tarde cada dos semanas; verifica la ruta y el jardín.",
      next_step: "Confirma la frecuencia, dirección, estado del jardín y agenda antes de cotizar o programar la primera visita.",
    },
  },
};

// Exact matching keeps edited questions on the existing live workflow.
export function findReplyPreset(input: {
  scenario: string;
  business: string;
  message: string;
  language: ReplyPreviewInput["language"];
}): PresetScenario | null {
  if (!Object.prototype.hasOwnProperty.call(REPLY_PRESETS, input.scenario)) return null;
  const scenario = input.scenario as PresetScenario;
  const preset = REPLY_PRESETS[scenario][input.language];
  return preset.business === input.business.trim() && preset.message === input.message.trim() ? scenario : null;
}

export function getReplyPreset(scenario: PresetScenario, language: "en" | "es", inventoryLinked: boolean): ReplyPreview {
  const preset = REPLY_PRESETS[scenario][language];
  const inventoryNote = language === "es"
    ? "El inventario actual indica que la única pieza que hay que pedir para este trabajo es el calentador de agua. Confírmalo antes de responder."
    : "Current inventory shows the only part that needs to be ordered for this job is the water heater. Confirm before replying.";
  return {
    customer_reply: [...preset.customer_reply],
    owner_summary: preset.owner_summary + (scenario === "plumber" && inventoryLinked ? `\n\n${inventoryNote}` : ""),
    findings: [],
    next_step: preset.next_step,
    research: { status: "not_needed", sources: [] },
  };
}
