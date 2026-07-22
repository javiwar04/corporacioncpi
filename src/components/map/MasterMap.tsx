"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  buildMasterPoints,
  masterPointCounts,
  MAP_TYPE_META,
  type MapPointType,
} from "@/data/mapPoints";
import { CpiMapLazy } from "./CpiMapLazy";

const TYPES: MapPointType[] = ["disponible", "industrial", "ejecutado", "hotel"];

export function MasterMap() {
  const points = useMemo(() => buildMasterPoints(), []);
  const counts = useMemo(() => masterPointCounts(points), [points]);
  const [active, setActive] = useState<Set<MapPointType>>(new Set(TYPES));

  const toggle = (t: MapPointType) =>
    setActive((prev) => {
      const next = new Set(prev);
      // si está todo activo y toco uno, aíslo ese; si no, alterno
      if (next.size === TYPES.length) {
        return new Set([t]);
      }
      next.has(t) ? next.delete(t) : next.add(t);
      if (next.size === 0) return new Set(TYPES);
      return next;
    });

  const allActive = active.size === TYPES.length;

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* Panel de control */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setActive(new Set(TYPES))}
          className={clsx(
            "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
            allActive ? "border-navy bg-navy text-white" : "border-navy/12 bg-white text-navy hover:border-navy/30"
          )}
        >
          <span className="font-medium">Todo Corporación CPI</span>
          <span className={clsx("font-serif text-xl font-semibold", allActive ? "text-gold" : "text-navy")}>
            {counts.total}
          </span>
        </button>

        {TYPES.map((t) => {
          const meta = MAP_TYPE_META[t];
          const on = active.has(t);
          const n = counts[t];
          if (n === 0) return null;
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              aria-pressed={on}
              className={clsx(
                "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all",
                on ? "border-navy/20 bg-white shadow-card" : "border-navy/8 bg-white/40 opacity-55 hover:opacity-100"
              )}
            >
              <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white" style={{ background: meta.color }} />
              <span className="flex-1 text-sm font-medium text-navy">{meta.plural}</span>
              <span className="font-serif text-lg font-semibold text-navy">{n}</span>
            </button>
          );
        })}

        <p className="mt-1 text-xs leading-relaxed text-navy/45">
          Toca un tipo para aislarlo. Los marcadores con número agrupan varios proyectos de una misma
          zona: ábrelos para ver la lista.
        </p>
      </div>

      {/* Mapa */}
      <div className="h-[440px] overflow-hidden rounded-xl2 border border-navy/10 lg:h-[560px]">
        <CpiMapLazy points={points} activeTypes={Array.from(active)} className="h-full w-full" />
      </div>
    </div>
  );
}
