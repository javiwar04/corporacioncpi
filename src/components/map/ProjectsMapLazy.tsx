"use client";

import dynamic from "next/dynamic";

// Carga diferida del mapa (solo cliente) — evita SSR de Leaflet y no bloquea la página.
export const ProjectsMapLazy = dynamic(() => import("./ProjectsMap"), {
  ssr: false,
  loading: () => (
    <div className="skeleton grid h-full min-h-[420px] w-full place-items-center rounded-xl2">
      <span className="text-sm font-medium text-navy/40">Cargando mapa…</span>
    </div>
  ),
});
