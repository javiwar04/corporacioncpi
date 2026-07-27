"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";

type Tipo = "todos" | "residencial" | "industrial";

const TIPOS: { value: Tipo; label: string }[] = [
  { value: "todos", label: "Todo" },
  { value: "residencial", label: "Vivienda" },
  { value: "industrial", label: "Bodega" },
];

// Buscador rápido del hero: lleva directo a /proyectos ya filtrado (1 clic).
export function QuickSearch() {
  const router = useRouter();
  const [tipo, setTipo] = useState<Tipo>("todos");
  const [q, setQ] = useState("");

  const go = () => {
    const params = new URLSearchParams();
    if (tipo !== "todos") params.set("tipo", tipo);
    if (q.trim()) params.set("q", q.trim());
    const qs = params.toString();
    router.push(`/proyectos${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="w-full max-w-2xl rounded-xl2 border border-white/15 bg-white/10 p-3 backdrop-blur-md">
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
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Busca por proyecto o zona (ej. Antigua)"
            aria-label="Buscar propiedad"
            className="w-full rounded-lg border border-white/20 bg-white py-3 pl-10 pr-3 text-sm text-navy outline-none placeholder:text-navy/40 focus:border-gold"
          />
        </div>
        <button onClick={go} className="btn-gold justify-center whitespace-nowrap py-3">
          Ver propiedades <Icon name="arrow-right" size={18} />
        </button>
      </div>
    </div>
  );
}
