export type RaffleNumberStatus =
  | "disponible"
  | "seleccionado"
  | "reservado"
  | "confirmado"
  | "bloqueado";

export const raffleStatusLabel: Record<RaffleNumberStatus, string> = {
  disponible: "Disponible",
  seleccionado: "Seleccionado",
  reservado: "Reservado",
  confirmado: "Participación confirmada",
  bloqueado: "Bloqueado",
};

export const raffleStatusClass: Record<RaffleNumberStatus, string> = {
  disponible:
    "border-line bg-paper text-ink hover:border-ink hover:bg-lime/40",
  seleccionado: "border-ink bg-lime text-ink",
  reservado: "border-transparent bg-cream-deep text-earth",
  confirmado: "border-transparent bg-ink/10 text-muted",
  bloqueado: "border-dashed border-line bg-cream text-muted/60",
};
