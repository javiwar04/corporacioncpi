"use client";

import { useRef, useState } from "react";
import type { Project, PropertyUnit } from "@/data/types";
import { statusMeta } from "@/lib/status";
import { formatArea } from "@/lib/format";

// Naranja de las bandas «VENDIDO» impresas en el plano oficial de IMANA.
// Las bandas que dibujamos aquí deben verse idénticas a esas.
const SOLD_BAND = "#E9A05B";

/** Caja envolvente de un polígono "x,y x,y ...". */
function bbox(points: string) {
  const nums = points.trim().split(/[\s,]+/).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

interface Props {
  project: Project;
  selectedId?: string;
  matchedIds: Set<string>; // unidades que cumplen filtros/búsqueda
  onSelect: (unit: PropertyUnit) => void;
  onHover?: (unit: PropertyUnit | null) => void;
}

export function Masterplan({ project, selectedId, matchedIds, onSelect, onHover }: Props) {
  const W = project.masterplanWidth ?? 1000;
  const H = project.masterplanHeight ?? 640;
  const bg = project.masterplanImage; // plano oficial como fondo (si existe)
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ unit: PropertyUnit; x: number; y: number } | null>(null);

  const setHoverUnit = (unit: PropertyUnit | null, e?: React.MouseEvent) => {
    if (unit && e && wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect();
      setHover({ unit, x: e.clientX - r.left, y: e.clientY - r.top });
    } else {
      setHover(null);
    }
    onHover?.(unit);
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full select-none rounded-xl bg-[#EEF1EC]"
        role="group"
        aria-label={`Masterplan interactivo de ${project.name}`}
      >
        <defs>
          <pattern id="mp-hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#D4A03C" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#B98826" strokeWidth="3" />
          </pattern>
          <linearGradient id="mp-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F1F4EE" />
            <stop offset="1" stopColor="#E7ECE4" />
          </linearGradient>
        </defs>

        {bg ? (
          <image href={bg} x={0} y={0} width={W} height={H} preserveAspectRatio="xMidYMid meet" />
        ) : (
          <rect x="0" y="0" width={W} height={H} fill="url(#mp-bg)" />
        )}

        {/* Features: calles, áreas verdes, accesos (solo en el esquema, no sobre plano real) */}
        {!bg && project.masterplanFeatures?.map((f) => {
          if (f.polygonPoints) {
            const fill =
              f.kind === "green" ? "#CBE0C4" : f.kind === "street" ? "#E2E1DA" : "#DADFD6";
            return (
              <polygon
                key={f.id}
                points={f.polygonPoints}
                fill={fill}
                stroke="#CFD6CB"
                strokeWidth={1}
              />
            );
          }
          if (f.position && f.label) {
            return (
              <text
                key={f.id}
                x={f.position.x}
                y={f.position.y}
                fontSize={13}
                fill="#6B7268"
                textAnchor="middle"
                fontWeight={600}
              >
                {f.label}
              </text>
            );
          }
          return null;
        })}

        {/* Etiqueta del pasillo central (solo en el esquema) */}
        {!bg && (
          <text x={W / 2} y={H / 2 + 5} fontSize={13} fill="#9AA396" textAnchor="middle" letterSpacing="2">
            PASILLO CENTRAL
          </text>
        )}

        {/* Unidades */}
        {project.units.map((u) => {
          const m = statusMeta(u.status);
          const isMatch = matchedIds.has(u.id);
          const isSelected = selectedId === u.id;
          const isHovered = hover?.unit.id === u.id;
          const fill = u.status === "reserved" ? "url(#mp-hatch)" : m.color;
          const dashed = u.status === "coming-soon";
          const cx = u.position?.x ?? 0;
          const cy = u.position?.y ?? 0;
          const areaText = formatArea(u.constructionArea);
          return (
            <g
              key={u.id}
              role="button"
              tabIndex={m.selectable ? 0 : -1}
              aria-label={`${u.code}, ${m.label}${areaText ? `, ${areaText}` : ""}`}
              aria-pressed={isSelected}
              className={m.selectable ? "cursor-pointer outline-none" : "cursor-default"}
              style={{ opacity: isMatch ? 1 : 0.22, transition: "opacity .25s" }}
              onClick={() => onSelect(u)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(u);
                }
              }}
              onMouseMove={(e) => setHoverUnit(u, e)}
              onMouseLeave={() => setHoverUnit(null)}
              onFocus={(e) => {
                if (wrapRef.current) {
                  setHover({ unit: u, x: cx, y: cy });
                }
              }}
              onBlur={() => setHover(null)}
            >
              {u.polygonPoints && (
                <polygon
                  points={u.polygonPoints}
                  fill={bg ? m.color : fill}
                  fillOpacity={bg ? (isSelected ? 0.5 : isHovered ? 0.42 : isMatch ? 0.26 : 0.12) : 1}
                  stroke={isSelected ? "#C8A961" : bg ? m.color : "rgba(255,255,255,0.85)"}
                  strokeOpacity={bg && !isSelected ? 0.85 : 1}
                  strokeWidth={isSelected ? 5 : bg ? 2.5 : 2}
                  strokeDasharray={dashed ? "8 6" : undefined}
                  style={{ transition: "stroke .2s, stroke-width .2s, fill-opacity .2s" }}
                />
              )}
              {u.svgPath && (
                <path
                  d={u.svgPath}
                  fill={fill}
                  stroke={isSelected ? "#C8A961" : "rgba(255,255,255,0.85)"}
                  strokeWidth={isSelected ? 5 : 2}
                />
              )}
              {/* Banda «VENDIDO» para las unidades que el plano impreso todavía no marca
                  (p. ej. bodegas vendidas después de la última versión del plano). */}
              {bg && u.status === "sold" && !u.printedSoldBand && u.polygonPoints && (() => {
                const b = bbox(u.polygonPoints);
                const h = 26;
                return (
                  <g pointerEvents="none">
                    <rect x={b.x + 1} y={b.y + 1} width={b.w - 2} height={h} fill={SOLD_BAND} />
                    <text
                      x={b.x + b.w / 2}
                      y={b.y + 1 + h / 2 + 5}
                      fontSize={14}
                      fill="#FFFFFF"
                      textAnchor="middle"
                      fontWeight={700}
                      letterSpacing="1.5"
                    >
                      VENDIDO
                    </text>
                  </g>
                );
              })()}

              {/* Código/área: solo en el esquema. Sobre el plano real, las etiquetas ya vienen impresas. */}
              {!bg && (
                <>
                  <text
                    x={cx}
                    y={cy - 2}
                    fontSize={17}
                    fill={m.onColor}
                    textAnchor="middle"
                    fontWeight={600}
                    pointerEvents="none"
                    className="font-serif"
                  >
                    {u.code.replace("Bodega ", "B")}
                  </text>
                  {areaText && (
                    <text x={cx} y={cy + 18} fontSize={12} fill={m.onColor} textAnchor="middle" pointerEvents="none" opacity={0.85}>
                      {areaText}
                    </text>
                  )}
                </>
              )}
              {isSelected && u.position && (
                <circle cx={cx} cy={cy - 34} r={4} fill="#C8A961" />
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip rápido (hover en desktop) */}
      {hover && (
        <div
          className="pointer-events-none absolute z-20 w-56 -translate-x-1/2 -translate-y-full rounded-lg border border-navy/10 bg-white p-3 shadow-float"
          style={{ left: hover.x, top: hover.y - 12 }}
          role="tooltip"
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-base font-semibold text-navy">{hover.unit.code}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[0.65rem] font-semibold"
              style={{ background: statusMeta(hover.unit.status).color, color: statusMeta(hover.unit.status).onColor }}
            >
              {statusMeta(hover.unit.status).label}
            </span>
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[0.72rem] text-navy/70">
            {hover.unit.constructionArea != null && (
              <div><dt className="inline text-navy/45">Área </dt><dd className="inline font-medium">{formatArea(hover.unit.constructionArea)}</dd></div>
            )}
            {hover.unit.officeArea != null && (
              <div><dt className="inline text-navy/45">Oficina </dt><dd className="inline font-medium">{formatArea(hover.unit.officeArea)}</dd></div>
            )}
            {hover.unit.bedrooms != null && (
              <div><dt className="inline text-navy/45">Hab. </dt><dd className="inline font-medium">{hover.unit.bedrooms}</dd></div>
            )}
            {hover.unit.bathrooms != null && (
              <div><dt className="inline text-navy/45">Baños </dt><dd className="inline font-medium">{hover.unit.bathrooms}</dd></div>
            )}
          </dl>
          {statusMeta(hover.unit.status).selectable && (
            <p className="mt-2 text-[0.7rem] font-medium text-gold-deep">Clic para ver la ficha →</p>
          )}
        </div>
      )}
    </div>
  );
}
