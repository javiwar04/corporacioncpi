import type { PropertyUnit, UnitStatus } from "./types";

// ─────────────────────────────────────────────────────────────
// IMANA — 12 bodegas industriales. Complejo real en Santa Elena, Petén.
// Geometría y disponibilidad tomadas del PLANO OFICIAL (imana.gt → PLANO-IMANA_v2).
// Los polígonos se dibujan sobre la imagen real del plano (viewBox 1332×665).
// Vendidas: 1, 2, 3, 7, 10, 11, 12 · Disponibles: 4, 5, 6, 8, 9.
// (3 y 7 salieron de la oferta en julio 2026 — ver CONTENT_TODO.)
// Bodegas de 500 a 2,000 m² (módulos combinables); medida exacta por bodega: cotizar.
// ─────────────────────────────────────────────────────────────

type Seed = {
  n: number;
  status: UnitStatus;
  points: string;
  cx: number;
  cy: number;
  phase: "norte" | "sur";
  /** m² referenciales (dentro del rango real 500–2,000 m²) — confirmar con CPI. Ver CONTENT_TODO. */
  area: number;
  /** El plano oficial ya trae impresa la banda «VENDIDO» sobre esta bodega. */
  printedSoldBand?: boolean;
};

const seeds: Seed[] = [
  // Frente Norte (fila superior)
  { n: 1, status: "sold", points: "183,45 472,45 472,148 183,148", cx: 327, cy: 96, phase: "norte", area: 650, printedSoldBand: true },
  { n: 2, status: "sold", points: "183,150 472,150 472,235 183,235", cx: 327, cy: 192, phase: "norte", area: 650, printedSoldBand: true },
  { n: 3, status: "sold", points: "480,88 692,88 692,235 480,235", cx: 586, cy: 161, phase: "norte", area: 1200 },
  { n: 4, status: "available", points: "700,88 906,88 906,235 700,235", cx: 803, cy: 161, phase: "norte", area: 1200 },
  { n: 5, status: "available", points: "915,88 1120,88 1120,235 915,235", cx: 1017, cy: 161, phase: "norte", area: 1200 },
  { n: 6, status: "available", points: "1128,88 1216,88 1216,235 1128,235", cx: 1172, cy: 161, phase: "norte", area: 520 },
  { n: 7, status: "sold", points: "1220,88 1322,88 1322,235 1220,235", cx: 1271, cy: 161, phase: "norte", area: 520 },
  // Frente Sur (fila inferior)
  { n: 8, status: "available", points: "1128,430 1322,430 1322,638 1128,638", cx: 1225, cy: 534, phase: "sur", area: 980 },
  { n: 9, status: "available", points: "915,430 1120,430 1120,638 915,638", cx: 1017, cy: 534, phase: "sur", area: 1200 },
  { n: 10, status: "sold", points: "700,430 906,430 906,638 700,638", cx: 803, cy: 534, phase: "sur", area: 1200, printedSoldBand: true },
  { n: 11, status: "sold", points: "480,430 692,430 692,638 480,638", cx: 586, cy: 534, phase: "sur", area: 1200, printedSoldBand: true },
  { n: 12, status: "sold", points: "183,430 472,430 472,638 183,638", cx: 327, cy: 534, phase: "sur", area: 1200, printedSoldBand: true },
];

export const imanaUnits: PropertyUnit[] = seeds.map((s) => {
  const code = `Bodega ${s.n}`;
  return {
    id: `imana-b${s.n}`,
    projectId: "imana",
    code,
    name: code,
    status: s.status,
    phase: s.phase === "norte" ? "Frente Norte" : "Frente Sur",
    // Área referencial (módulos de 500 a 2,000 m², combinables). Medida exacta: cotizar.
    constructionArea: s.area,
    price: undefined,
    currency: "USD",
    priceConfirmed: false,
    featured: s.status === "available",
    description:
      s.status === "available"
        ? "Bodega disponible en el Complejo IMANA. Área referencial; módulos de 500 a 2,000 m² combinables según tu operación. Mezanine con área administrativa, dos baños y portón para camiones."
        : "Bodega vendida.",
    coverImage: "/imana/render-1.webp",
    gallery: ["/imana/render-1.webp", "/imana/interior.webp", "/imana/side.webp"],
    polygonPoints: s.points,
    position: { x: s.cx, y: s.cy },
    printedSoldBand: s.printedSoldBand,
  };
});
