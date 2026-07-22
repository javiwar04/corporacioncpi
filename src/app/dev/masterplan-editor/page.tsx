"use client";

import { useMemo, useRef, useState } from "react";
import { projects } from "@/data";
import { STATUS_META, STATUS_ORDER, statusMeta } from "@/lib/status";
import type { UnitStatus } from "@/data/types";
import { Icon } from "@/components/ui/Icon";

// ─────────────────────────────────────────────────────────────
// Herramienta INTERNA de desarrollo para posicionar polígonos sobre un
// masterplan. NO debe exponerse en producción (ver guard abajo).
// Uso documentado en README.md → "Editor de masterplan".
// ─────────────────────────────────────────────────────────────

type Pt = { x: number; y: number };

export default function MasterplanEditorPage() {
  // Protección: bloquear en producción salvo override explícito.
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_ENABLE_DEV_TOOLS !== "true") {
    return (
      <div className="container-cpi grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-navy">Herramienta no disponible</h1>
          <p className="mt-2 text-navy/60">El editor de masterplan solo está habilitado en entornos de desarrollo.</p>
        </div>
      </div>
    );
  }

  return <Editor />;
}

function Editor() {
  const [w, setW] = useState(1000);
  const [h, setH] = useState(640);
  const [img, setImg] = useState("/imana/imana-11.webp");
  const [code, setCode] = useState("Bodega 1");
  const [status, setStatus] = useState<UnitStatus>("available");
  const [points, setPoints] = useState<Pt[]>([]);
  const [saved, setSaved] = useState<{ code: string; points: Pt[]; status: UnitStatus }[]>([]);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const toSvg = (e: React.MouseEvent): Pt => {
    const svg = svgRef.current!;
    const r = svg.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * w);
    const y = Math.round(((e.clientY - r.top) / r.height) * h);
    return { x, y };
  };

  const pointsStr = (pts: Pt[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
  const currentStr = useMemo(() => pointsStr(points), [points]);

  const snippet = useMemo(() => {
    const all = [...saved];
    if (points.length >= 3) all.push({ code, points, status });
    return all
      .map(
        (u) =>
          `  {\n    code: ${JSON.stringify(u.code)},\n    status: ${JSON.stringify(u.status)},\n    polygonPoints: ${JSON.stringify(pointsStr(u.points))},\n    position: { x: ${Math.round(u.points.reduce((a, p) => a + p.x, 0) / u.points.length)}, y: ${Math.round(u.points.reduce((a, p) => a + p.y, 0) / u.points.length)} },\n  },`
      )
      .join("\n");
  }, [saved, points, code, status]);

  return (
    <div className="bg-cream">
      <div className="container-cpi py-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-status-reserved/15 px-3 py-1 text-xs font-medium text-status-reserved">
          <Icon name="bolt" size={14} /> Herramienta de desarrollo — no pública
        </div>
        <h1 className="font-serif text-3xl font-medium text-navy">Editor de masterplan</h1>
        <p className="mt-1 max-w-2xl text-sm text-navy/60">
          Carga un plano, dibuja el polígono de cada unidad haciendo clic, y copia los puntos SVG generados a
          <code className="mx-1 rounded bg-navy/5 px-1">data/units.ts</code>.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Lienzo */}
          <div>
            <div className="relative overflow-hidden rounded-xl2 border border-navy/10 bg-white">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${w} ${h}`}
                className="block h-auto w-full cursor-crosshair"
                onClick={(e) => setPoints((p) => [...p, toSvg(e)])}
              >
                <image href={img} x={0} y={0} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
                {/* Polígonos guardados */}
                {saved.map((u, i) => (
                  <g key={i}>
                    <polygon points={pointsStr(u.points)} fill={statusMeta(u.status).color} fillOpacity={0.55} stroke="#fff" strokeWidth={2} />
                  </g>
                ))}
                {/* Polígono en edición */}
                {points.length > 0 && (
                  <polygon points={currentStr} fill={statusMeta(status).color} fillOpacity={0.5} stroke="#C8A961" strokeWidth={2.5} />
                )}
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={5} fill="#C8A961" stroke="#fff" strokeWidth={1.5} />
                ))}
              </svg>
            </div>
            <p className="mt-2 text-xs text-navy/50">Clic para agregar puntos. Mínimo 3 para formar un polígono.</p>
          </div>

          {/* Controles */}
          <div className="space-y-4">
            <div className="card p-4">
              <label className="text-xs font-medium text-navy/60">Imagen del plano (URL en /public)</label>
              <input value={img} onChange={(e) => setImg(e.target.value)} className="mt-1 w-full rounded-lg border border-navy/12 px-3 py-2 text-sm" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-navy/60">viewBox ancho</label>
                  <input type="number" value={w} onChange={(e) => setW(Number(e.target.value) || 1000)} className="mt-1 w-full rounded-lg border border-navy/12 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-navy/60">viewBox alto</label>
                  <input type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 640)} className="mt-1 w-full rounded-lg border border-navy/12 px-3 py-2 text-sm" />
                </div>
              </div>
            </div>

            <div className="card p-4">
              <label className="text-xs font-medium text-navy/60">Código de la unidad</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 w-full rounded-lg border border-navy/12 px-3 py-2 text-sm" />
              <label className="mt-3 block text-xs font-medium text-navy/60">Estado (previsualización)</label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {STATUS_ORDER.map((s) => (
                  <button key={s} onClick={() => setStatus(s)} className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${status === s ? "ring-2 ring-gold" : "ring-navy/12"}`}>
                    <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: STATUS_META[s].color }} />
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setPoints((p) => p.slice(0, -1))} className="btn-ghost text-sm" disabled={!points.length}>Deshacer punto</button>
                <button onClick={() => setPoints([])} className="btn-ghost text-sm" disabled={!points.length}>Limpiar</button>
                <button
                  onClick={() => {
                    if (points.length >= 3) {
                      setSaved((s) => [...s, { code, points, status }]);
                      setPoints([]);
                    }
                  }}
                  className="btn-primary text-sm"
                  disabled={points.length < 3}
                >
                  Guardar unidad
                </button>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-navy/60">Puntos actuales</label>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentStr);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="text-xs font-medium text-gold-deep"
                  disabled={!currentStr}
                >
                  {copied ? "¡Copiado!" : "Copiar puntos"}
                </button>
              </div>
              <textarea readOnly value={currentStr} rows={2} className="mt-1 w-full rounded-lg border border-navy/12 bg-cream px-3 py-2 font-mono text-xs" />

              <label className="mt-3 block text-xs font-medium text-navy/60">Snippet para data/units.ts ({saved.length + (points.length >= 3 ? 1 : 0)} unidades)</label>
              <textarea readOnly value={snippet} rows={8} className="mt-1 w-full rounded-lg border border-navy/12 bg-navy px-3 py-2 font-mono text-[11px] text-white/90" />
              <button onClick={() => navigator.clipboard.writeText(snippet)} className="btn-ghost mt-2 w-full justify-center text-sm" disabled={!snippet}>Copiar snippet completo</button>
            </div>

            <div className="card p-4">
              <label className="text-xs font-medium text-navy/60">Cargar plano de un proyecto</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setImg(p.aerialImage ?? p.masterplanImage ?? p.coverImage);
                      if (p.masterplanWidth) setW(p.masterplanWidth);
                      if (p.masterplanHeight) setH(p.masterplanHeight);
                    }}
                    className="rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-navy ring-1 ring-navy/12 hover:ring-navy/30"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
