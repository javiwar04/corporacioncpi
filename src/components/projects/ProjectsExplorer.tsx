"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import type { Project, ProjectCategory } from "@/data/types";
import type { ExecutedProject, ProximoProject } from "@/data/executed";
import { categoryLabels, projectCounters, projectStatusLabels } from "@/data";
import { ProjectCard } from "./ProjectCard";
import { ProjectsMapLazy } from "@/components/map/ProjectsMapLazy";
import { Icon } from "@/components/ui/Icon";

type Estado = "disponibles" | "proximos" | "ejecutados";
const CATEGORIES: (ProjectCategory | "all")[] = ["all", "residencial", "comercial", "industrial"];

export function ProjectsExplorer({
  projects,
  executed,
  proximos = [],
}: {
  projects: Project[];
  executed: ExecutedProject[];
  proximos?: ProximoProject[];
}) {
  const [estado, setEstado] = useState<Estado>("disponibles");
  const [view, setView] = useState<"map" | "grid">("map");
  const [cat, setCat] = useState<ProjectCategory | "all">("all");
  const [activeSlug, setActiveSlug] = useState<string | undefined>();
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (cat === "all" ? projects : projects.filter((p) => p.category === cat)),
    [projects, cat]
  );

  const selectFromMap = (slug: string) => {
    setActiveSlug(slug);
    document.getElementById(`proj-row-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div>
      {/* Filtro principal: Disponibles / Ejecutados */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-navy/12">
          {([
            ["disponibles", "Disponibles", projects.length],
            ["proximos", "Próximos", proximos.length],
            ["ejecutados", "Ejecutados", executed.length],
          ] as [Estado, string, number][]).filter(([, , n]) => n > 0).map(([val, label, count]) => (
            <button
              key={val}
              onClick={() => setEstado(val)}
              aria-pressed={estado === val}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                estado === val ? "bg-navy text-white" : "text-navy/60 hover:text-navy"
              )}
            >
              {label} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>

        {estado === "disponibles" && (
          <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-navy/12">
            {(["map", "grid"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  view === v ? "bg-navy text-white" : "text-navy/60 hover:text-navy"
                )}
              >
                <Icon name={v === "map" ? "map" : "grid"} size={16} />
                {v === "map" ? "Mapa" : "Cuadrícula"}
              </button>
            ))}
          </div>
        )}
      </div>

      {estado === "ejecutados" ? (
        <>
          <p className="mb-4 text-sm text-navy/60">
            Obra terminada con el sello de Corporación CPI. Toca una casa para ver su ficha completa y galería.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {executed.map((p) => (
              <Link key={p.slug} href={`/proyectos-ejecutados/${p.slug}`} className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
                  <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-status-available/90 px-2.5 py-1 text-[0.68rem] font-semibold text-white">Ejecutado</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-medium text-navy">{p.name}</h3>
                    <Icon name="arrow-right" size={18} className="mt-1 shrink-0 text-navy/30 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-navy/55">
                    <Icon name="pin" size={14} className="text-gold" /> {p.location}
                  </p>
                  {p.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy/70">{p.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : estado === "proximos" ? (
        <>
          <p className="mb-4 text-sm text-navy/60">
            Un adelanto de lo que estamos preparando. Toca un proyecto para ver su ficha y galería.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proximos.map((p) => (
              <Link key={p.slug} href={`/proximos/${p.slug}`} className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
                  <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className={clsx("absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold text-white", p.status === "Vendida" ? "bg-status-sold/90" : "bg-status-soon/90")}>
                    {p.status}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-medium text-navy">{p.name}</h3>
                    <Icon name="arrow-right" size={18} className="mt-1 shrink-0 text-navy/30 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-navy/55">
                    <Icon name="pin" size={14} className="text-gold" /> {p.location}
                  </p>
                  {p.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy/70">{p.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Sub-filtro por categoría */}
          <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoría">
            {CATEGORIES.map((c) => {
              const count = c === "all" ? projects.length : projects.filter((p) => p.category === c).length;
              if (c !== "all" && count === 0) return null;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={cat === c}
                  onClick={() => setCat(c)}
                  className={clsx(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    cat === c ? "bg-gold text-navy" : "bg-white text-navy/60 ring-1 ring-navy/12 hover:text-navy"
                  )}
                >
                  {c === "all" ? "Todos" : categoryLabels[c]}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {view === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_1fr]">
              <div ref={listRef} className="order-2 flex max-h-[640px] flex-col gap-3 overflow-y-auto pr-1 lg:order-1">
                {filtered.map((p) => {
                  const c = projectCounters(p);
                  const active = activeSlug === p.slug;
                  return (
                    <button
                      key={p.id}
                      id={`proj-row-${p.slug}`}
                      onClick={() => setActiveSlug(p.slug)}
                      className={clsx(
                        "group flex gap-3 rounded-xl border bg-white p-3 text-left transition-all",
                        active ? "border-gold ring-2 ring-gold/30" : "border-navy/8 hover:border-navy/20"
                      )}
                    >
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-navy/5">
                        <Image src={p.coverImage} alt={p.name} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-wide text-gold-deep">
                          {categoryLabels[p.category]} · <span className="text-navy/45">{projectStatusLabels[p.status]}</span>
                        </div>
                        <p className="mt-0.5 truncate font-serif text-lg text-navy">{p.name}</p>
                        <p className="flex items-center gap-1 truncate text-xs text-navy/55">
                          <Icon name="pin" size={13} className="text-gold" /> {p.location}
                        </p>
                        {c.total > 1 && <p className="mt-1 text-xs font-medium text-status-available">{c.available}/{c.total} disponibles</p>}
                      </div>
                      <Link href={`/proyectos/${p.slug}`} onClick={(e) => e.stopPropagation()} className="self-center rounded-full p-1.5 text-navy/40 hover:bg-navy/5 hover:text-gold" aria-label={`Ver ${p.name}`}>
                        <Icon name="arrow-right" size={18} />
                      </Link>
                    </button>
                  );
                })}
              </div>
              <div className="order-1 h-[420px] overflow-hidden rounded-xl2 border border-navy/10 lg:order-2 lg:h-[640px]">
                <ProjectsMapLazy projects={filtered} activeSlug={activeSlug} onSelect={selectFromMap} className="h-full w-full" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
