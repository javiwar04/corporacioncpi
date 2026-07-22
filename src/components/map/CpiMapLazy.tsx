"use client";

import dynamic from "next/dynamic";

export const CpiMapLazy = dynamic(() => import("./CpiMap"), {
  ssr: false,
  loading: () => (
    <div className="skeleton grid h-full min-h-[420px] w-full place-items-center rounded-xl2">
      <span className="text-sm font-medium text-navy/40">Cargando mapa…</span>
    </div>
  ),
});
