import type { UnitStatus } from "@/data/types";

// Metadatos de cada estado de disponibilidad.
// Accesibilidad: NO se depende solo del color — cada estado tiene etiqueta,
// símbolo/patrón e íconos textuales.
export interface StatusMeta {
  value: UnitStatus;
  label: string;
  short: string;
  /** color sólido para el relleno del masterplan */
  color: string;
  /** color de texto legible sobre el color anterior */
  onColor: string;
  /** clase de badge (Tailwind) para listados */
  badgeClass: string;
  /** patrón SVG opcional para reforzar el estado sin depender del color */
  pattern?: "solid" | "hatch" | "dash" | "dots";
  selectable: boolean;
}

export const STATUS_META: Record<UnitStatus, StatusMeta> = {
  available: {
    value: "available",
    label: "Disponible",
    short: "Disp.",
    color: "#2F9E6E",
    onColor: "#062018",
    badgeClass: "bg-status-available/12 text-status-available ring-1 ring-status-available/30",
    pattern: "solid",
    selectable: true,
  },
  reserved: {
    value: "reserved",
    label: "Reservado",
    short: "Reserv.",
    color: "#D4A03C",
    onColor: "#2A1E06",
    badgeClass: "bg-status-reserved/12 text-status-reserved ring-1 ring-status-reserved/30",
    pattern: "hatch",
    selectable: true,
  },
  sold: {
    value: "sold",
    label: "Vendido",
    short: "Vend.",
    color: "#8A8F98",
    onColor: "#1A1C20",
    badgeClass: "bg-status-sold/15 text-status-sold ring-1 ring-status-sold/30",
    pattern: "solid",
    selectable: false,
  },
  "coming-soon": {
    value: "coming-soon",
    label: "Próximamente",
    short: "Próx.",
    color: "#5C93F2",
    onColor: "#08183A",
    badgeClass: "bg-status-soon/12 text-status-soon ring-1 ring-status-soon/30",
    pattern: "dash",
    selectable: true,
  },
  unavailable: {
    value: "unavailable",
    label: "No disponible",
    short: "N/D",
    color: "#4B4F57",
    onColor: "#C9CCD1",
    badgeClass: "bg-status-unavailable/15 text-slate-400 ring-1 ring-white/10",
    pattern: "solid",
    selectable: false,
  },
};

export const STATUS_ORDER: UnitStatus[] = [
  "available",
  "reserved",
  "coming-soon",
  "sold",
  "unavailable",
];

export function statusMeta(s: UnitStatus): StatusMeta {
  return STATUS_META[s];
}
