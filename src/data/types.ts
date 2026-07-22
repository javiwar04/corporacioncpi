// ─────────────────────────────────────────────────────────────
// Modelos de datos — Corporación CPI
// Diseñados para escalar a una base de datos / CMS / API futura.
// Regla de contenido: no se inventan datos. Campos sin dato confirmado
// quedan `undefined` (ver CONTENT_TODO.md).
// ─────────────────────────────────────────────────────────────

export type UnitStatus =
  | "available" // Disponible
  | "reserved" // Reservado
  | "sold" // Vendido
  | "coming-soon" // Próximamente disponible
  | "unavailable"; // No disponible

export type ProjectCategory = "residencial" | "comercial" | "industrial" | "hotel";

export type ProjectStatus =
  | "en-venta"
  | "en-construccion"
  | "en-preventa"
  | "entregado"
  | "proximamente";

export interface Coordinates {
  latitude: number;
  longitude: number;
  /** true = coordenada aproximada (a nivel de localidad), no confirmada. Ver CONTENT_TODO. */
  approximate?: boolean;
}

export interface ProjectPhase {
  id: string;
  name: string;
  status?: ProjectStatus;
}

/** Punto de interés dibujable sobre el masterplan (áreas verdes, amenidades, accesos). */
export interface MasterplanFeature {
  id: string;
  kind: "green" | "amenity" | "access" | "street" | "label";
  label?: string;
  polygonPoints?: string; // "x,y x,y ..."
  position?: { x: number; y: number };
  icon?: string;
}

export interface Amenity {
  label: string;
  icon?: string;
  description?: string;
}

/** Un ambiente (cuarto) dibujable sobre el plano interactivo. */
export interface FloorplanRoom {
  id: string;
  name: string;
  kind?: "bedroom" | "bath" | "social" | "kitchen" | "service" | "garage" | "outdoor" | "circulation";
  area?: number; // m² (solo si está confirmado)
  polygonPoints: string; // "x,y x,y ..." en coordenadas del viewBox del nivel
}

/** Un nivel/planta con su imagen de plano y sus ambientes interactivos. */
export interface FloorplanLevel {
  id: string;
  name: string; // "Planta baja", "Planta alta", ...
  image: string;
  width: number; // viewBox del plano
  height: number;
  rooms: FloorplanRoom[];
}

export interface PropertyUnit {
  id: string;
  projectId: string;
  code: string; // Código/nomenclatura OFICIAL del documento. Nunca se altera.
  name?: string;
  model?: string;
  status: UnitStatus;

  phase?: string;
  sector?: string;
  block?: string; // manzana
  lotNumber?: string;

  lotArea?: number; // m² terreno
  constructionArea?: number; // m² construcción
  officeArea?: number; // m² oficina (uso comercial/industrial)
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  levels?: number;

  price?: number;
  currency?: string;
  /** false = el precio existe pero NO está confirmado; no se muestra como definitivo. */
  priceConfirmed?: boolean;

  description?: string;
  coverImage?: string;
  gallery?: string[];
  floorPlans?: string[];
  /** Plano(s) interactivo(s) con ambientes seleccionables. Fallback: floorPlans (imagen). */
  interactiveFloorplan?: FloorplanLevel[];
  amenities?: string[];
  featured?: boolean;

  // Geometría en el masterplan SVG (viewBox del proyecto).
  svgPath?: string; // path "d"
  polygonPoints?: string; // "x,y x,y ..."
  position?: { x: number; y: number }; // centro/etiqueta (fallback hotspot)

  /** Mensaje de WhatsApp precompuesto (si no, se genera automáticamente). */
  whatsappMessage?: string;

  /** Datos preliminares (p. ej. IMANA proviene de un mockup, no de doc oficial). */
  preliminary?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  location: string;
  city?: string;
  coordinates?: Coordinates;
  status: ProjectStatus;
  category: ProjectCategory;

  shortDescription: string;
  description?: string;
  highlights?: string[];

  coverImage: string;
  gallery?: string[];
  /** Logotipo propio del proyecto (p. ej. IMANA), si tiene marca independiente. */
  logo?: string;

  // Masterplan (Nivel 2)
  masterplanImage?: string;
  aerialImage?: string;
  masterplanWidth?: number; // ancho del viewBox SVG
  masterplanHeight?: number; // alto del viewBox SVG
  /** true = usar masterplan SVG interactivo; false/undefined = fichas + "próximamente". */
  hasInteractiveMasterplan?: boolean;
  masterplanFeatures?: MasterplanFeature[];

  amenities?: Amenity[];
  phases?: ProjectPhase[];
  units: PropertyUnit[];

  maintenanceFee?: { amount: number; currency: string; period: string };
  priceFrom?: number;
  currency?: string;
  /** Nota de precio a mostrar cuando el precio no es por unidad (p. ej. "Desde $675 / m²"). */
  priceNote?: string;
  /** Ficha técnica (bullets de especificaciones constructivas). */
  technicalSpecs?: string[];

  /** Todo el proyecto es preliminar (datos sin confirmar). */
  preliminary?: boolean;
  /** Documento(s) fuente de referencia. */
  sourceDocuments?: string[];
}

export interface UnitCounters {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  comingSoon: number;
  unavailable: number;
  availabilityPct: number; // % disponibles sobre el total
}
