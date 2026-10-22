import { formatQuetzales } from "@/lib/site";

export const rafflePrice = 5;
export const raffleTotalNumbers = 100;

export const rafflePotential = rafflePrice * raffleTotalNumbers;

export type InitiativeStatus = "activa" | "proximamente" | "finalizada";

export type Initiative = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  goalLabel?: string;
  goalNote?: string;
  status: InitiativeStatus;
  participation: string;
  href: string;
  actionLabel: string;
};

export const initiativeStatusLabel: Record<InitiativeStatus, string> = {
  activa: "Activa",
  proximamente: "Próximamente",
  finalizada: "Finalizada",
};

export const initiatives: Initiative[] = [
  {
    id: "rifa-solidaria",
    name: "Rifa solidaria",
    description:
      "Cien números para reunir recursos destinados a perritos y gatitos. Cada número cuesta Q5 y se registra con un código que entrega el voluntario responsable.",
    image: "/photos/perro-collar.jpg",
    imageAlt: "Un perro con collar, de pie en el concreto",
    goalLabel: `Recaudación potencial: ${formatQuetzales(rafflePotential)}`,
    goalNote:
      "Ese monto corresponde a los 100 números. No representa dinero ya recibido.",
    status: "activa",
    participation:
      "Pide un código al voluntario que organiza la rifa, elige un número disponible y registra tu participación.",
    href: "#rifa",
    actionLabel: "Conocer la rifa",
  },
];
