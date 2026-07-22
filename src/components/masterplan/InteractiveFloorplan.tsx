"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import type { FloorplanLevel, FloorplanRoom } from "@/data/types";
import { formatArea } from "@/lib/format";
import { Icon, type IconName } from "@/components/ui/Icon";

const KIND_STYLE: Record<
  NonNullable<FloorplanRoom["kind"]> | "default",
  { color: string; icon: IconName }
> = {
  bedroom: { color: "#C8A961", icon: "bed" },
  bath: { color: "#5C93F2", icon: "bath" },
  kitchen: { color: "#2F9E6E", icon: "grid" },
  social: { color: "#9A7C3C", icon: "star" },
  service: { color: "#8A8F98", icon: "water" },
  garage: { color: "#4B4F57", icon: "car" },
  outdoor: { color: "#2F9E6E", icon: "tree" },
  circulation: { color: "#B9B4A6", icon: "arrow-right" },
  default: { color: "#C8A961", icon: "pin" },
};

function roomStyle(r: FloorplanRoom) {
  return KIND_STYLE[r.kind ?? "default"] ?? KIND_STYLE.default;
}

export function InteractiveFloorplan({ levels }: { levels: FloorplanLevel[] }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [selected, setSelected] = useState<FloorplanRoom | null>(null);
  const [hover, setHover] = useState<{ room: FloorplanRoom; x: number; y: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const level = levels[levelIdx];

  const onMove = (room: FloorplanRoom, e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setHover({ room, x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div>
      {/* Tabs de nivel */}
      {levels.length > 1 && (
        <div className="mb-3 inline-flex rounded-full bg-white p-1 ring-1 ring-navy/12">
          {levels.map((l, i) => (
            <button
              key={l.id}
              onClick={() => {
                setLevelIdx(i);
                setSelected(null);
              }}
              aria-pressed={i === levelIdx}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                i === levelIdx ? "bg-navy text-white" : "text-navy/60 hover:text-navy"
              )}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        {/* Plano */}
        <div ref={wrapRef} className="relative overflow-hidden rounded-xl2 border border-navy/10 bg-[#EDECE6]">
          <svg
            viewBox={`0 0 ${level.width} ${level.height}`}
            className="block h-auto w-full"
            role="group"
            aria-label={`Plano interactivo — ${level.name}`}
          >
            <image href={level.image} x={0} y={0} width={level.width} height={level.height} />
            {level.rooms.map((room) => {
              const st = roomStyle(room);
              const isSel = selected?.id === room.id;
              const isHov = hover?.room.id === room.id;
              return (
                <polygon
                  key={room.id}
                  points={room.polygonPoints}
                  role="button"
                  tabIndex={0}
                  aria-label={`${room.name}${room.area ? `, ${formatArea(room.area)}` : ""}`}
                  aria-pressed={isSel}
                  className="cursor-pointer outline-none transition-all"
                  fill={st.color}
                  fillOpacity={isSel ? 0.42 : isHov ? 0.32 : 0.001}
                  stroke={st.color}
                  strokeOpacity={isSel || isHov ? 0.95 : 0}
                  strokeWidth={isSel ? 5 : 3}
                  onClick={() => setSelected(room)}
                  onMouseMove={(e) => onMove(room, e)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setSelected(room)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(room);
                    }
                  }}
                />
              );
            })}
          </svg>

          {/* Tooltip */}
          {hover && (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg border border-navy/10 bg-white px-3 py-1.5 shadow-float"
              style={{ left: hover.x, top: hover.y - 10 }}
              role="tooltip"
            >
              <span className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                <Icon name={roomStyle(hover.room).icon} size={15} className="text-gold-deep" />
                {hover.room.name}
              </span>
              {hover.room.area != null && (
                <span className="text-xs text-navy/55">{formatArea(hover.room.area)}</span>
              )}
            </div>
          )}
        </div>

        {/* Lista de ambientes (alternativa accesible + leyenda) */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-navy/45">
            Ambientes · {level.name}
          </p>
          <ul className="flex flex-wrap gap-1.5 lg:flex-col">
            {level.rooms.map((room) => {
              const st = roomStyle(room);
              const isSel = selected?.id === room.id;
              return (
                <li key={room.id}>
                  <button
                    onClick={() => setSelected(room)}
                    onMouseEnter={() =>
                      setHover({ room, x: -999, y: -999 }) /* resalta en plano sin tooltip visible */
                    }
                    onMouseLeave={() => setHover(null)}
                    className={clsx(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                      isSel ? "bg-navy text-white" : "bg-white text-navy/75 ring-1 ring-navy/8 hover:ring-navy/25"
                    )}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: st.color }} />
                    <span className="flex-1 truncate">{room.name}</span>
                    {room.area != null && (
                      <span className={clsx("text-xs", isSel ? "text-white/70" : "text-navy/45")}>
                        {formatArea(room.area)}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-navy/45">Pasa el cursor o toca un ambiente para resaltarlo.</p>
        </div>
      </div>
    </div>
  );
}
