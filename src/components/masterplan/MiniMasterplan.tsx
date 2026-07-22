import type { Project, PropertyUnit } from "@/data/types";
import { statusMeta } from "@/lib/status";

// Versión reducida y estática del masterplan con la unidad resaltada.
// Sin interacción (uso en la página individual de vivienda).
export function MiniMasterplan({ project, unit }: { project: Project; unit: PropertyUnit }) {
  const W = project.masterplanWidth ?? 1000;
  const H = project.masterplanHeight ?? 640;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-xl bg-[#EEF1EC]" role="img" aria-label={`Ubicación de ${unit.code} dentro del masterplan de ${project.name}`}>
      <rect x="0" y="0" width={W} height={H} fill="#EEF1EC" />
      {project.masterplanFeatures?.map((f) =>
        f.polygonPoints ? (
          <polygon key={f.id} points={f.polygonPoints} fill={f.kind === "green" ? "#CBE0C4" : "#E2E1DA"} />
        ) : null
      )}
      {project.units.map((u) => {
        const isTarget = u.id === unit.id;
        const m = statusMeta(u.status);
        return (
          <g key={u.id} opacity={isTarget ? 1 : 0.35}>
            {u.polygonPoints && (
              <polygon
                points={u.polygonPoints}
                fill={u.status === "reserved" ? "#D4A03C" : m.color}
                stroke={isTarget ? "#C8A961" : "rgba(255,255,255,0.7)"}
                strokeWidth={isTarget ? 6 : 1.5}
              />
            )}
            {u.position && (
              <text x={u.position.x} y={u.position.y + 5} fontSize={16} fill={m.onColor} textAnchor="middle" fontWeight={600}>
                {u.code.replace("Bodega ", "B")}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
