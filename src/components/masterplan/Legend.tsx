import { STATUS_ORDER, statusMeta } from "@/lib/status";

// Leyenda siempre visible. Refuerza el estado con texto + muestra de patrón.
export function Legend({ className }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${className ?? ""}`}>
      {STATUS_ORDER.map((s) => {
        const m = statusMeta(s);
        return (
          <li key={s} className="flex items-center gap-2 text-navy/70">
            <span
              className="h-3.5 w-3.5 rounded-[3px] ring-1 ring-black/5"
              style={{
                background:
                  s === "reserved"
                    ? "repeating-linear-gradient(45deg,#D4A03C,#D4A03C 3px,#B98826 3px,#B98826 6px)"
                    : m.color,
                border: s === "coming-soon" ? "1.5px dashed #2f61c4" : undefined,
              }}
              aria-hidden
            />
            {m.label}
          </li>
        );
      })}
    </ul>
  );
}
