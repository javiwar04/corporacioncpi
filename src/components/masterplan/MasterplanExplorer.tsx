"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Project, PropertyUnit, UnitStatus } from "@/data/types";
import { computeCounters } from "@/data";
import { statusMeta, STATUS_ORDER } from "@/lib/status";
import { displayPrice, formatArea } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Masterplan } from "./Masterplan";
import { Masterplan3DLazy } from "./Masterplan3DLazy";
import { Legend } from "./Legend";
import { Counters } from "./Counters";
import { UnitDetailPanel } from "./UnitDetailPanel";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "");

interface FilterState {
  q: string;
  onlyAvailable: boolean;
  statuses: Set<UnitStatus>;
  model?: string;
  minBedrooms?: number;
  minArea?: number;
  maxPrice?: number;
}

export function MasterplanExplorer({ project }: { project: Project }) {
  const units = project.units;
  const [selected, setSelected] = useState<PropertyUnit | null>(null);
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const has3D = Boolean(project.masterplanImage);
  const [filters, setFilters] = useState<FilterState>({
    q: "",
    onlyAvailable: false,
    statuses: new Set(),
  });

  // Detección de campos disponibles (solo se muestran filtros con datos)
  const meta = useMemo(() => {
    const models = Array.from(new Set(units.map((u) => u.model).filter(Boolean))) as string[];
    const statuses = STATUS_ORDER.filter((s) => units.some((u) => u.status === s));
    const bedrooms = Array.from(new Set(units.map((u) => u.bedrooms).filter((b): b is number => b != null))).sort((a, b) => a - b);
    const hasArea = units.some((u) => u.constructionArea != null);
    const prices = units.filter((u) => u.price != null && u.priceConfirmed !== false).map((u) => u.price!) as number[];
    const areas = units.map((u) => u.constructionArea).filter((a): a is number => a != null);
    return {
      models,
      statuses,
      bedrooms,
      hasArea,
      hasPrice: prices.length > 0,
      maxPriceVal: prices.length ? Math.max(...prices) : 0,
      minPriceVal: prices.length ? Math.min(...prices) : 0,
      maxAreaVal: areas.length ? Math.max(...areas) : 0,
      minAreaVal: areas.length ? Math.min(...areas) : 0,
    };
  }, [units]);

  const matched = useMemo(() => {
    const q = norm(filters.q);
    const ids = new Set<string>();
    for (const u of units) {
      if (filters.onlyAvailable && u.status !== "available") continue;
      if (filters.statuses.size && !filters.statuses.has(u.status)) continue;
      if (filters.model && u.model !== filters.model) continue;
      if (filters.minBedrooms != null && (u.bedrooms ?? -1) < filters.minBedrooms) continue;
      if (filters.minArea != null && (u.constructionArea ?? 0) < filters.minArea) continue;
      if (filters.maxPrice != null && u.price != null && u.price > filters.maxPrice) continue;
      if (q && !(norm(u.code).includes(q) || (u.model && norm(u.model).includes(q)))) continue;
      ids.add(u.id);
    }
    return ids;
  }, [units, filters]);

  const counters = computeCounters(units);
  const matchedUnits = units.filter((u) => matched.has(u.id));

  const select = (u: PropertyUnit) => {
    setSelected(u);
    document.getElementById(`unit-row-${u.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const toggleStatus = (s: UnitStatus) =>
    setFilters((f) => {
      const st = new Set(f.statuses);
      st.has(s) ? st.delete(s) : st.add(s);
      return { ...f, statuses: st };
    });

  const activeFilterCount =
    (filters.onlyAvailable ? 1 : 0) +
    filters.statuses.size +
    (filters.model ? 1 : 0) +
    (filters.minBedrooms != null ? 1 : 0) +
    (filters.minArea != null ? 1 : 0) +
    (filters.maxPrice != null ? 1 : 0);

  return (
    <div>
      <Counters c={counters} preliminary={project.preliminary} />

      {/* Controles */}
      <div className="mt-5 rounded-xl2 border border-navy/10 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Búsqueda directa por código */}
          <div className="relative min-w-[220px] flex-1">
            <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
            <input
              type="search"
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && matchedUnits[0]) select(matchedUnits[0]);
              }}
              placeholder={`Buscar unidad (ej. ${units[0]?.code ?? "A-01"})`}
              className="w-full rounded-lg border border-navy/12 bg-cream/60 py-2.5 pl-10 pr-3 text-sm text-navy outline-none focus:border-gold"
              aria-label="Buscar vivienda por código"
            />
          </div>

          <button
            onClick={() => setFilters((f) => ({ ...f, onlyAvailable: !f.onlyAvailable }))}
            aria-pressed={filters.onlyAvailable}
            className={clsx(
              "inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
              filters.onlyAvailable ? "bg-status-available text-white" : "bg-cream text-navy ring-1 ring-navy/12 hover:ring-navy/30"
            )}
          >
            <Icon name="check" size={16} /> Ver solo disponibles
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters({ q: filters.q, onlyAvailable: false, statuses: new Set() })}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-navy/60 hover:text-navy"
            >
              <Icon name="close" size={15} /> Limpiar ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Filtros por dato disponible */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {meta.statuses.map((s) => {
            const on = filters.statuses.has(s);
            return (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                aria-pressed={on}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition",
                  on ? "ring-2 ring-gold" : "ring-navy/12 hover:ring-navy/30"
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: statusMeta(s).color }} />
                {statusMeta(s).label}
              </button>
            );
          })}

          {meta.models.length > 1 && (
            <select
              value={filters.model ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value || undefined }))}
              className="rounded-full border border-navy/12 bg-white px-3 py-1.5 text-xs font-medium text-navy"
              aria-label="Modelo de vivienda"
            >
              <option value="">Todos los modelos</option>
              {meta.models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          )}

          {meta.bedrooms.length > 0 && (
            <select
              value={filters.minBedrooms ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, minBedrooms: e.target.value ? Number(e.target.value) : undefined }))}
              className="rounded-full border border-navy/12 bg-white px-3 py-1.5 text-xs font-medium text-navy"
              aria-label="Habitaciones mínimas"
            >
              <option value="">Habitaciones</option>
              {meta.bedrooms.map((b) => (
                <option key={b} value={b}>{b}+ hab.</option>
              ))}
            </select>
          )}

          {meta.hasArea && meta.maxAreaVal > meta.minAreaVal && (
            <label className="inline-flex items-center gap-2 rounded-full border border-navy/12 bg-white px-3 py-1.5 text-xs font-medium text-navy">
              Área mín.
              <input
                type="range"
                min={Math.floor(meta.minAreaVal)}
                max={Math.ceil(meta.maxAreaVal)}
                value={filters.minArea ?? Math.floor(meta.minAreaVal)}
                onChange={(e) => setFilters((f) => ({ ...f, minArea: Number(e.target.value) }))}
                className="accent-gold"
              />
              <span className="tabular-nums text-navy/60">{filters.minArea ?? Math.floor(meta.minAreaVal)} m²</span>
            </label>
          )}

          {meta.hasPrice && meta.maxPriceVal > meta.minPriceVal && (
            <label className="inline-flex items-center gap-2 rounded-full border border-navy/12 bg-white px-3 py-1.5 text-xs font-medium text-navy">
              Precio máx.
              <input
                type="range"
                min={Math.floor(meta.minPriceVal)}
                max={Math.ceil(meta.maxPriceVal)}
                step={5000}
                value={filters.maxPrice ?? Math.ceil(meta.maxPriceVal)}
                onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
                className="accent-gold"
              />
              <span className="tabular-nums text-navy/60">${((filters.maxPrice ?? meta.maxPriceVal) / 1000).toFixed(0)}k</span>
            </label>
          )}
        </div>
      </div>

      {/* Vista dividida: listado + masterplan */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* Listado sincronizado */}
        <div className="order-2 flex max-h-[560px] flex-col gap-2 overflow-y-auto pr-1 lg:order-1">
          <p className="px-1 text-xs font-medium uppercase tracking-wide text-navy/45">
            {matchedUnits.length} de {units.length} unidades
          </p>
          {matchedUnits.length === 0 && (
            <p className="rounded-lg bg-cream p-4 text-sm text-navy/60">
              Ninguna unidad coincide con los filtros.
            </p>
          )}
          {matchedUnits.map((u) => {
            const price = displayPrice(u);
            const active = selected?.id === u.id;
            return (
              <button
                key={u.id}
                id={`unit-row-${u.id}`}
                onClick={() => select(u)}
                className={clsx(
                  "flex items-center gap-3 rounded-xl border bg-white p-2.5 text-left transition-all",
                  active ? "border-gold ring-2 ring-gold/30" : "border-navy/8 hover:border-navy/25"
                )}
              >
                {u.coverImage && (
                  <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-navy/5">
                    <Image src={u.coverImage} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif text-base font-semibold text-navy">{u.code}</span>
                    <StatusBadge status={u.status} short />
                  </div>
                  <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-navy/55">
                    {formatArea(u.constructionArea) && <span>{formatArea(u.constructionArea)}</span>}
                    {u.bedrooms != null && <span>{u.bedrooms} hab.</span>}
                    {u.bathrooms != null && <span>{u.bathrooms} baños</span>}
                  </p>
                  {price && <p className="mt-0.5 text-sm font-semibold text-navy">{price}</p>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Masterplan */}
        <div className="order-1 lg:order-2">
          {has3D && (
            <div className="mb-3 flex justify-end">
              <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-navy/12">
                {(["2d", "3d"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setMode(v)}
                    aria-pressed={mode === v}
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                      mode === v ? "bg-navy text-white" : "text-navy/60 hover:text-navy"
                    )}
                  >
                    <Icon name={v === "2d" ? "map" : "layers"} size={16} />
                    {v === "2d" ? "Plano 2D" : "Maqueta 3D"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {has3D && mode === "3d" ? (
            <div className="h-[420px] overflow-hidden rounded-xl2 border border-navy/10 sm:h-[520px]">
              <Masterplan3DLazy
                project={project}
                selectedId={selected?.id}
                matchedIds={matched}
                onSelect={select}
              />
            </div>
          ) : (
            <div className="rounded-xl2 border border-navy/10 bg-white p-3 sm:p-4">
              <Masterplan
                project={project}
                selectedId={selected?.id}
                matchedIds={matched}
                onSelect={select}
              />
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
            <Legend />
            <p className="text-xs text-navy/45">
              {mode === "3d" ? "Arrastra para rotar, rueda para zoom. Clic en una bodega para su ficha." : "Pasa el cursor o toca una unidad para ver su ficha."}
            </p>
          </div>
        </div>
      </div>

      <UnitDetailPanel project={project} unit={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
