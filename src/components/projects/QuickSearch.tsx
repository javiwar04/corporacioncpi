"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";
import { projects, unitSlug } from "@/data";

type Tipo = "todos" | "residencial" | "industrial";

const TIPOS: { value: Tipo; label: string }[] = [
  { value: "todos", label: "Todo" },
  { value: "residencial", label: "Vivienda" },
  { value: "industrial", label: "Bodega" },
];

// Índice plano proyecto+unidad para el autocomplete (se arma una sola vez, en build).
const searchIndex = projects.flatMap((project) =>
  project.units.map((unit) => ({
    id: unit.id,
    category: project.category,
    href: `/proyectos/${project.slug}/viviendas/${unitSlug(unit)}`,
    label: unit.model ?? unit.code,
    subtitle: `${project.name} · ${project.location}`,
    coverImage: unit.coverImage ?? project.coverImage,
    haystack: `${project.name} ${project.location} ${project.city ?? ""} ${unit.model ?? ""} ${unit.code}`.toLowerCase(),
  }))
);

// Buscador rápido del hero: con coincidencias, el clic lleva directo a la ficha (1 clic).
// Sin selección, "Ver propiedades" cae al listado filtrado en /proyectos.
export function QuickSearch() {
  const router = useRouter();
  const [tipo, setTipo] = useState<Tipo>("todos");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    return searchIndex
      .filter((r) => (tipo === "todos" || r.category === tipo) && r.haystack.includes(query))
      .slice(0, 6);
  }, [q, tipo]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goToList = () => {
    const params = new URLSearchParams();
    if (tipo !== "todos") params.set("tipo", tipo);
    if (q.trim()) params.set("q", q.trim());
    const qs = params.toString();
    setOpen(false);
    router.push(`/proyectos${qs ? `?${qs}` : ""}`);
  };

  const goToResult = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleEnter = () => {
    if (results.length > 0) goToResult(results[0].href);
    else goToList();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl rounded-xl2 border border-white/15 bg-white/10 p-3 backdrop-blur-md">
      {/* Tipo */}
      <div className="flex flex-wrap gap-1.5">
        {TIPOS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTipo(t.value)}
            aria-pressed={tipo === t.value}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              tipo === t.value ? "bg-gold text-navy" : "bg-white/10 text-white/80 hover:bg-white/20"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Búsqueda + CTA */}
      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy/40"
          />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            placeholder="Busca por proyecto o zona (ej. Antigua)"
            aria-label="Buscar propiedad"
            role="combobox"
            aria-expanded={open && results.length > 0}
            autoComplete="off"
            className="w-full rounded-lg border border-white/20 bg-white py-3 pl-10 pr-3 text-sm text-navy outline-none placeholder:text-navy/40 focus:border-gold"
          />

          {open && results.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-lg border border-navy/10 bg-white text-left shadow-float">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => goToResult(r.href)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-cream"
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-navy/5">
                      <Image src={r.coverImage} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-navy">{r.label}</span>
                      <span className="block truncate text-xs text-navy/55">{r.subtitle}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={handleEnter} className="btn-gold justify-center whitespace-nowrap py-3">
          Ver propiedades <Icon name="arrow-right" size={18} />
        </button>
      </div>
    </div>
  );
}
