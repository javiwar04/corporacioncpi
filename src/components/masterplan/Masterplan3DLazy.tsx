"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Project, PropertyUnit } from "@/data/types";
import { Canvas3DErrorBoundary } from "./Canvas3DErrorBoundary";

// Carga diferida (solo cliente) de la maqueta 3D — evita SSR de three.js y no bloquea la página.
const Masterplan3DInner = dynamic(() => import("./Masterplan3D"), {
  ssr: false,
  loading: () => (
    <div className="skeleton grid h-full min-h-[420px] w-full place-items-center rounded-xl2">
      <span className="text-sm font-medium text-navy/40">Cargando maqueta 3D…</span>
    </div>
  ),
});

interface Props {
  project: Project;
  selectedId?: string;
  matchedIds: Set<string>;
  onSelect: (u: PropertyUnit) => void;
}

// ¿Puede el navegador crear un contexto WebGL ahora mismo?
function canCreateWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    // Libera de inmediato el contexto de prueba.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function WebGLUnavailable() {
  return (
    <div className="grid h-full min-h-[420px] w-full place-items-center rounded-xl2 border border-dashed border-navy/20 bg-white p-6 text-center">
      <div>
        <p className="font-serif text-lg font-medium text-navy">Vista 3D no disponible</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-navy/60">
          Tu navegador se quedó sin contextos de gráficos (WebGL). Cierra y vuelve a abrir el
          navegador para liberarlos. El plano 2D funciona con normalidad mientras tanto.
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-4">
          Reintentar
        </button>
      </div>
    </div>
  );
}

// Detecta WebGL antes de montar R3F (evita lanzar error / overlay de Next).
export function Masterplan3DLazy(props: Props) {
  const [state, setState] = useState<"checking" | "ok" | "no">("checking");

  useEffect(() => {
    setState(canCreateWebGL() ? "ok" : "no");
  }, []);

  if (state === "checking") {
    return (
      <div className="skeleton grid h-full min-h-[420px] w-full place-items-center rounded-xl2">
        <span className="text-sm font-medium text-navy/40">Preparando maqueta 3D…</span>
      </div>
    );
  }
  if (state === "no") return <WebGLUnavailable />;

  return (
    <Canvas3DErrorBoundary>
      <Masterplan3DInner {...props} />
    </Canvas3DErrorBoundary>
  );
}
