export const site = {
  name: "Patitas",
  tagline: "Solidaridad animal",
  description:
    "Plataforma solidaria para apoyar a perros y gatos en situación de calle en Guatemala.",
} as const;

export const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#como-ayudar", label: "Cómo ayudar" },
  { href: "#iniciativas", label: "Iniciativas" },
  { href: "#rifa", label: "Rifa solidaria" },
] as const;

/**
 * Datos de contacto. Déjalos vacíos hasta tener la información real.
 * whatsapp: solo dígitos, con código de país. Ejemplo: "50212345678".
 */
export const contact = {
  whatsapp: "",
  email: "",
  social: [] as { label: string; href: string }[],
  organizers: "",
};

/**
 * Instrucciones de donación. Si quedan vacías, la página no muestra
 * un método de pago ni una dirección de entrega inventados.
 */
export const donations = {
  monetaryInstructions: "",
  monetaryActionLabel: "",
  monetaryActionHref: "",
  inKindInstructions: "",
  inKindActionLabel: "",
  inKindActionHref: "",
  requestedItems: [] as string[],
};

/**
 * Datos del sorteo. Completa solo lo que ya esté definido.
 * La plataforma no elige ganadores por su cuenta.
 */
export const draw = {
  date: "",
  time: "",
  prize: "",
  method: "",
  responsible: "",
  results: "",
};

export function formatQuetzales(amount: number) {
  return `Q${amount.toLocaleString("es-GT")}`;
}

export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}
