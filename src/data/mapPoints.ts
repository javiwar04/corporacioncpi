import { projects } from "./projects";
import { executedProjects, moreExecutedProjects, type ExecutedProject } from "./executed";
import { hotels } from "./hotels";
import { projectCounters } from "./index";

// ─────────────────────────────────────────────────────────────
// Puntos unificados para el MAPA MAESTRO (home): proyectos disponibles,
// IMANA (industrial), obra ejecutada (agrupada por condominio) y hoteles.
// Coordenadas de condominios/Flores son APROXIMADAS (ver CONTENT_TODO.md).
// ─────────────────────────────────────────────────────────────

export type MapPointType = "disponible" | "industrial" | "ejecutado" | "hotel";

export interface MapPointItem {
  name: string;
  sub?: string;
  href?: string;
  thumb?: string;
}

export interface MasterPoint {
  id: string;
  type: MapPointType;
  lat: number;
  lng: number;
  approximate?: boolean;
  title: string;
  subtitle?: string;
  href?: string; // enlace principal (cuando aplica)
  items: MapPointItem[]; // 1 = tarjeta simple; varios = lista desplegable
}

export const MAP_TYPE_META: Record<
  MapPointType,
  { label: string; plural: string; color: string; glyph: string }
> = {
  disponible: {
    label: "Disponible",
    plural: "Disponibles",
    color: "#C8A961",
    glyph: "M4 21V9l8-6 8 6v12h-6v-6h-4v6z",
  },
  industrial: {
    label: "Industrial",
    plural: "Industrial",
    color: "#1F6FEB",
    glyph: "M3 21V10l5 3V10l5 3V6l8 4v11z",
  },
  ejecutado: {
    label: "Ejecutado",
    plural: "Ejecutados",
    color: "#2F9E6E",
    glyph: "m5 12 4.5 4.5L19 7",
  },
  hotel: {
    label: "Hotel",
    plural: "Hoteles",
    color: "#9A4FB3",
    glyph: "M4 21V5h9a4 4 0 0 1 4 4v3h3v9M8 9h4",
  },
};

// Coordenadas aproximadas por condominio / zona (Antigua y alrededores).
const ZONE_COORDS: Record<string, { lat: number; lng: number }> = {
  "Antigua Gardens": { lat: 14.5418, lng: -90.7642 },
  "Casco del Cerro": { lat: 14.5556, lng: -90.746 },
  "Los Franciscanos": { lat: 14.545, lng: -90.755 },
  "Paseo Antigua": { lat: 14.5605, lng: -90.7405 },
  "La Serenísima": { lat: 14.5625, lng: -90.735 },
  "Refugio del Ángel": { lat: 14.548, lng: -90.749 },
  "Hacienda del Comendador": { lat: 14.543, lng: -90.76 },
  "Portales de Antigua": { lat: 14.562, lng: -90.733 },
};

const FLORES = { lat: 16.9285, lng: -89.892 };

function zoneOf(p: ExecutedProject): string {
  const s = `${p.name} ${p.location}`.toLowerCase();
  if (s.includes("antigua gardens")) return "Antigua Gardens";
  if (s.includes("casco del cerro")) return "Casco del Cerro";
  if (s.includes("franciscanos")) return "Los Franciscanos";
  if (s.includes("paseo antigua")) return "Paseo Antigua";
  if (s.includes("serenísima") || s.includes("serenisima")) return "La Serenísima";
  if (s.includes("refugio del ángel") || s.includes("refugio del angel")) return "Refugio del Ángel";
  if (s.includes("comendador")) return "Hacienda del Comendador";
  if (s.includes("portales de antigua")) return "Portales de Antigua";
  return "Otros";
}

export function buildMasterPoints(): MasterPoint[] {
  const points: MasterPoint[] = [];

  // 1) Proyectos con coordenadas (disponibles + IMANA industrial)
  for (const p of projects) {
    if (!p.coordinates) continue;
    const c = projectCounters(p);
    const isIndustrial = p.category === "industrial";
    points.push({
      id: `proj-${p.slug}`,
      type: isIndustrial ? "industrial" : "disponible",
      lat: p.coordinates.latitude,
      lng: p.coordinates.longitude,
      approximate: p.coordinates.approximate,
      title: p.name,
      subtitle:
        c.total > 1 ? `${c.available} de ${c.total} disponibles` : p.location,
      href: `/proyectos/${p.slug}`,
      items: [
        { name: p.name, sub: p.location, href: `/proyectos/${p.slug}`, thumb: p.coverImage },
      ],
    });
  }

  // 2) Ejecutados agrupados por condominio
  const all = [...executedProjects, ...moreExecutedProjects];
  const byZone = new Map<string, ExecutedProject[]>();
  for (const e of all) {
    const z = zoneOf(e);
    if (!byZone.has(z)) byZone.set(z, []);
    byZone.get(z)!.push(e);
  }
  for (const [zone, list] of byZone) {
    const coords = ZONE_COORDS[zone];
    if (!coords) continue;
    points.push({
      id: `ejec-${zone}`,
      type: "ejecutado",
      lat: coords.lat,
      lng: coords.lng,
      approximate: true,
      title: zone,
      subtitle: `${list.length} ${list.length === 1 ? "proyecto ejecutado" : "proyectos ejecutados"}`,
      href: "/proyectos",
      items: list.map((e) => ({ name: e.name, sub: e.location, thumb: e.image })),
    });
  }

  // 3) Hoteles agrupados en Isla de Flores
  points.push({
    id: "hoteles-flores",
    type: "hotel",
    lat: FLORES.lat,
    lng: FLORES.lng,
    approximate: true,
    title: "Hoteles de Petén",
    subtitle: `${hotels.length} hoteles y alojamientos`,
    href: "/hoteleria",
    items: hotels.map((h) => ({ name: h.name, sub: h.location, href: "/hoteleria", thumb: h.image })),
  });

  return points;
}

export function masterPointCounts(points: MasterPoint[]) {
  const byType = (t: MapPointType) =>
    points.filter((p) => p.type === t).reduce((n, p) => n + p.items.length, 0);
  return {
    disponible: byType("disponible"),
    industrial: byType("industrial"),
    ejecutado: byType("ejecutado"),
    hotel: byType("hotel"),
    total:
      byType("disponible") + byType("industrial") + byType("ejecutado") + byType("hotel"),
  };
}
