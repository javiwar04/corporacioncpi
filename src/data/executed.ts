// ─────────────────────────────────────────────────────────────
// PROYECTOS EJECUTADOS y PRÓXIMOS.
// Fuente: corporacioncpi.com (ejecutados.php / casas.php / proximos.php / futuros.php).
// Nombres, descripciones, desglose de áreas y galerías tomados del sitio oficial.
// ─────────────────────────────────────────────────────────────

export interface ExecutedProject {
  slug: string;
  name: string;
  location: string;
  description?: string;
  details?: string[]; // desglose de áreas / características
  image: string; // portada
  galleryCount?: number; // nº de imágenes en /ejecutados/<slug>/g-NN.webp
}

export interface ProximoProject extends ExecutedProject {
  status: "Vendida" | "Próximamente";
}

const COLONIAL =
  "Residencia en el condominio Casco del Cerro que fusiona lo antiguo y lo moderno: detalles arquitectónicos históricos y comodidades contemporáneas, con espacios amplios y luminosos enmarcados por el encanto colonial de Antigua Guatemala.";
const SERENISIMA =
  "Hermosa residencia con espacios incomparables y acabados que reflejan la esencia única y el encanto histórico de Antigua Guatemala.";

export const executedProjects: ExecutedProject[] = [
  {
    slug: "casa-1-antigua-gardens",
    name: "Casa No. 1 en Antigua Gardens",
    location: "Antigua Gardens · a 15 min de Antigua Guatemala",
    description:
      "Preciosa casa de esquina con 180 m² de construcción y vistas a los volcanes, en el condominio Antigua Gardens.",
    details: ["Equipada con 4 habitaciones", "180 m² de construcción", "Casa de esquina con vistas a los volcanes"],
    image: "/ejecutados/casa-1-antigua-gardens.webp",
    galleryCount: 9,
  },
  {
    slug: "casa-56-casco-del-cerro",
    name: "Casa No. 56 Casco del Cerro",
    location: "Casco del Cerro · a 5 min de Antigua Guatemala",
    description: COLONIAL,
    image: "/ejecutados/casa-56-casco-del-cerro.webp",
  },
  {
    slug: "casa-36-casco-del-cerro",
    name: "Casa No. 36 en Casco del Cerro",
    location: "Casco del Cerro · a 5 min de Antigua Guatemala",
    description:
      "Hermosa casa en condominio Casco del Cerro, con acabados coloniales mezclados con minimalismo y un toque moderno.",
    details: [
      "200 m² de área total del terreno",
      "169 m² de construcción planta baja",
      "41 m² de construcción de mezzanine",
      "18 m² de terraza utilizable",
      "Total: 228 m² de construcción",
      "31 m² de jardines",
    ],
    image: "/ejecutados/casa-36-casco-del-cerro.webp",
    galleryCount: 8,
  },
  {
    slug: "paseo-antigua-63",
    name: "Paseo Antigua No. 63",
    location: "Paseo Antigua · a 3 min del ingreso a Antigua Guatemala",
    description: "Precioso terreno de esquina con 450 m² de área total de terreno.",
    details: [
      "450 m² de área total del terreno",
      "373 m² de construcción (incluye área de piscina)",
      "Mezzanine sobre dormitorio doble: 25 m²",
      "77 m² de área libre",
    ],
    image: "/ejecutados/paseo-antigua-63.webp",
    galleryCount: 8,
  },
  {
    slug: "franciscanos-83",
    name: "Los Franciscanos No. 83",
    location: "Club Residencial Los Franciscanos · a 15 min de Antigua Guatemala",
    description: COLONIAL,
    details: ["Tres habitaciones con baño privado cada una", "Baño de visitas", "Baño y área de servicio"],
    image: "/ejecutados/franciscanos-83.webp",
    galleryCount: 9,
  },
  {
    slug: "franciscanos-7",
    name: "Los Franciscanos No. 7",
    location: "Club Residencial Los Franciscanos · a 15 min de Antigua Guatemala",
    description: COLONIAL,
    details: ["Tres habitaciones con baño privado cada una", "Baño de visitas", "Baño y área de servicio"],
    image: "/ejecutados/franciscanos-7.webp",
    galleryCount: 8,
  },
  {
    slug: "franciscanos-6",
    name: "Los Franciscanos No. 6",
    location: "Club Residencial Los Franciscanos · a 15 min de Antigua Guatemala",
    description: COLONIAL,
    details: ["Tres habitaciones con baño privado cada una", "Baño de visitas", "Baño y área de servicio"],
    image: "/ejecutados/franciscanos-7.webp",
    galleryCount: 5,
  },
  {
    slug: "casco-del-cerro-58",
    name: "Casco del Cerro No. 58",
    location: "Casco del Cerro · a 5 min de Antigua Guatemala",
    description:
      "Residencia en el Casco del Cerro, a tan sólo 5 minutos del ingreso a la ciudad de Antigua Guatemala.",
    details: [
      "4 habitaciones con baño privado",
      "Terraza y jardín central",
      "Baño de visitas y área de servicio",
      "200 m² de área total de terreno",
      "221 m² de construcción",
      "33 m² de jardín",
    ],
    image: "/ejecutados/casco-del-cerro-58.webp",
    galleryCount: 6,
  },
  {
    slug: "casco-del-cerro-60",
    name: "Casco del Cerro No. 60",
    location: "Casco del Cerro · a 5 min de Antigua Guatemala",
    description: COLONIAL,
    details: ["3 habitaciones con baño privado cada una", "Patio / jardín con fuente", "Baño de visitas y área de servicio"],
    image: "/ejecutados/casco-del-cerro-60.webp",
    galleryCount: 7,
  },
  {
    slug: "casco-del-cerro-28",
    name: "Casco del Cerro No. 28",
    location: "Casco del Cerro · a 3 min de Antigua Guatemala",
    description: COLONIAL,
    details: [
      "3 habitaciones con baño privado cada una",
      "Patio con jardín decorativo",
      "Terraza",
      "Área de servicio con baño",
      "Baño de visitas",
    ],
    image: "/ejecutados/casco-del-cerro-28.webp",
    galleryCount: 7,
  },
  {
    slug: "casco-del-cerro-30",
    name: "Casco del Cerro No. 30",
    location: "Casco del Cerro · a 3 min de Antigua Guatemala",
    description: COLONIAL,
    details: ["4 habitaciones con baño privado cada una", "Sala, cocina, comedor, patios internos y terraza"],
    image: "/ejecutados/casco-del-cerro-30.webp",
    galleryCount: 7,
  },
  {
    slug: "casco-del-cerro-66",
    name: "Casco del Cerro No. 66",
    location: "Casco del Cerro · a 5 min de Antigua Guatemala",
    description: COLONIAL,
    details: ["3 habitaciones con baño privado cada una"],
    image: "/ejecutados/casco-del-cerro-66.webp",
    galleryCount: 8,
  },
  {
    slug: "serenisima-17",
    name: "La Serenísima No. 17",
    location: "Antigua Guatemala",
    description: SERENISIMA,
    details: ["4 habitaciones con baño privado cada una", "Cocina, sala, comedor, terraza y patio"],
    image: "/ejecutados/serenisima-17.webp",
    galleryCount: 8,
  },
  {
    slug: "casco-del-cerro-62",
    name: "Casco del Cerro No. 62",
    location: "Casco del Cerro · Antigua Guatemala",
    description: SERENISIMA,
    details: ["3 habitaciones con baño privado cada una", "Sala y cocina", "Terraza y jacuzzi"],
    image: "/ejecutados/casco-del-cerro-62.webp",
    galleryCount: 9,
  },
];

// Sección "Más proyectos" (nombre + ubicación + foto, sin ficha de detalle)
export const moreExecutedProjects: ExecutedProject[] = [
  { slug: "refugio-del-angel-1", name: "Refugio del Ángel No. 1", location: "San Cristóbal El Bajo", image: "/ejecutados/refugio-del-angel-1.webp" },
  { slug: "serenisima-17b", name: "La Serenísima No. 17", location: "Ciudad Vieja", image: "/ejecutados/serenisima-17b.webp" },
  { slug: "franciscanos-81", name: "Los Franciscanos Club Residencial No. 81", location: "Ciudad Vieja", image: "/ejecutados/franciscanos-81.webp" },
  { slug: "portales-de-antigua-12", name: "Portales de Antigua No. 12", location: "Antigua Guatemala", image: "/ejecutados/portales-de-antigua-12.webp" },
  { slug: "hacienda-del-comendador-1", name: "Hacienda del Comendador No. 1", location: "Ciudad Vieja", image: "/ejecutados/hacienda-del-comendador-1.webp" },
  { slug: "serenisima-25", name: "La Serenísima No. 25", location: "Antigua Guatemala", image: "/ejecutados/serenisima-25.webp" },
];

// ── PRÓXIMOS PROYECTOS ──────────────────────────────────────
export const proximosProjects: ProximoProject[] = [
  {
    slug: "paseo-antigua-3",
    name: "Casa No. 3 Paseo Antigua",
    location: "Condominio Paseo Antigua · a 3 min del ingreso a Antigua Guatemala",
    status: "Vendida",
    description:
      "En el exclusivo condominio Paseo Antigua, una magnífica oportunidad de casa en planos en uno de los desarrollos más exclusivos de la zona.",
    details: [
      "4 amplios dormitorios con baño privado y walk-in closet",
      "Baños de visitas",
      "Terraza con vistas impresionantes",
      "450 m² de área total del terreno",
      "401 m² de área total de construcción",
      "157 m² de área libre (jardines y piscina)",
    ],
    image: "/proximos/paseo-antigua-3/g-01.webp",
    galleryCount: 9,
  },
  {
    slug: "apostoles-1",
    name: "Casa No. 1 Los Apóstoles",
    location: "Residencial Los Apóstoles · a 8 min de Antigua Guatemala",
    status: "Vendida",
    description:
      "Inspirada en la combinación de los elementos arquitectónicos tradicionales de Antigua Guatemala con las nuevas tendencias modernas. Personalizable en los espacios interiores: pisos, cocina, colores e instalaciones de luz.",
    details: ["255 m² de construcción + 33.27 m² de área libre", "4 habitaciones con baño privado, 2 con WC"],
    image: "/proximos/apostoles-1/g-01.webp",
    galleryCount: 8,
  },
  {
    slug: "antigua-gardens-2",
    name: "Casa No. 2 en Antigua Gardens",
    location: "Residencial Antigua Gardens · a 20 min de Antigua Guatemala",
    status: "Próximamente",
    description:
      "Casa de esquina en Residencial Antigua Gardens, inspirada en la combinación de los elementos arquitectónicos tradicionales de Antigua con las nuevas tendencias de la arquitectura moderna.",
    details: [
      "180 m² de construcción",
      "3 cuartos con baño privado cada uno",
      "Dormitorio máster con walk-in closet",
      "Dormitorio de visitas o estudio con baño privado",
      "Baño de visitas",
    ],
    image: "/proximos/antigua-gardens-2/g-01.webp",
    galleryCount: 8,
  },
  {
    slug: "comendador-4",
    name: "Casa No. 4 en Hacienda del Comendador",
    location: "Hacienda del Comendador · Ciudad Vieja",
    status: "Próximamente",
    description:
      "Un espacio pensado para disfrutar en familia, rodeado de tranquilidad y estilo. Esta casa de 210 m² combina elegancia colonial y comodidad moderna.",
    details: [
      "Casa de 210 m²",
      "4 habitaciones con excelente iluminación natural",
      "4.5 baños distribuidos estratégicamente",
      "Jardín de 43 m²",
      "Terraza de 54 m² con vista ideal para atardeceres y reuniones",
    ],
    image: "/proximos/comendador-4/g-01.webp",
    galleryCount: 8,
  },
];

// ── Helpers ─────────────────────────────────────────────────
function galleryFor(kind: "ejecutados" | "proximos", slug: string, count?: number): string[] {
  if (!count) return [];
  return Array.from({ length: count }, (_, i) => `/${kind}/${slug}/g-${String(i + 1).padStart(2, "0")}.webp`);
}

export function executedGallery(p: ExecutedProject): string[] {
  return galleryFor("ejecutados", p.slug, p.galleryCount);
}
export function proximoGallery(p: ProximoProject): string[] {
  return galleryFor("proximos", p.slug, p.galleryCount);
}

export function getExecutedBySlug(slug: string): ExecutedProject | undefined {
  return executedProjects.find((p) => p.slug === slug);
}
export function getProximoBySlug(slug: string): ProximoProject | undefined {
  return proximosProjects.find((p) => p.slug === slug);
}

export const executedCount = executedProjects.length + moreExecutedProjects.length;
export const proximosCount = proximosProjects.length;
