import type { Project, PropertyUnit, UnitCounters } from "./types";
import { projects, getProjectBySlug, getAllProjectSlugs } from "./projects";

export { projects, getProjectBySlug, getAllProjectSlugs };
export type { Project, PropertyUnit, UnitCounters };

// ── Contadores automáticos (nunca escritos a mano) ──────────────
export function computeCounters(units: PropertyUnit[]): UnitCounters {
  const total = units.length;
  const by = (s: PropertyUnit["status"]) => units.filter((u) => u.status === s).length;
  const available = by("available");
  return {
    total,
    available,
    reserved: by("reserved"),
    sold: by("sold"),
    comingSoon: by("coming-soon"),
    unavailable: by("unavailable"),
    availabilityPct: total > 0 ? Math.round((available / total) * 100) : 0,
  };
}

export function projectCounters(project: Project): UnitCounters {
  return computeCounters(project.units);
}

// ── Búsqueda de unidad global ───────────────────────────────────
export function findUnit(
  projectSlug: string,
  unitCode: string
): { project: Project; unit: PropertyUnit } | undefined {
  const project = getProjectBySlug(projectSlug);
  if (!project) return undefined;
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
  const unit = project.units.find((u) => norm(u.code) === norm(unitCode) || u.id === unitCode);
  if (!unit) return undefined;
  return { project, unit };
}

export function unitSlug(unit: PropertyUnit): string {
  return unit.code.toLowerCase().replace(/\s+/g, "-");
}

/** Resuelve una clave "slug/code-normalizado" (favoritos/comparación) a proyecto+unidad. */
export function resolveUnitKey(
  key: string
): { project: Project; unit: PropertyUnit } | undefined {
  const idx = key.indexOf("/");
  if (idx === -1) return undefined;
  return findUnit(key.slice(0, idx), key.slice(idx + 1));
}

/** Todas las rutas de vivienda individuales (para generateStaticParams). */
export function getAllUnitParams(): { slug: string; unit: string }[] {
  return projects.flatMap((p) =>
    p.units.map((u) => ({ slug: p.slug, unit: unitSlug(u) }))
  );
}

/** Unidades similares dentro del mismo proyecto (mismo estado o rango). */
export function similarUnits(project: Project, unit: PropertyUnit, limit = 3): PropertyUnit[] {
  return project.units
    .filter((u) => u.id !== unit.id)
    .sort((a, b) => {
      const sa = a.status === unit.status ? 0 : 1;
      const sb = b.status === unit.status ? 0 : 1;
      return sa - sb;
    })
    .slice(0, limit);
}

export function projectsForMap(): Project[] {
  return projects.filter((p) => p.coordinates);
}

export const categoryLabels: Record<Project["category"], string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  industrial: "Industrial",
  hotel: "Hotelería",
};

export const projectStatusLabels: Record<Project["status"], string> = {
  "en-venta": "En venta",
  "en-construccion": "En construcción",
  "en-preventa": "En preventa",
  entregado: "Entregado",
  proximamente: "Próximamente",
};
