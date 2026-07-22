import clsx from "clsx";
import type { UnitStatus } from "@/data/types";
import { statusMeta } from "@/lib/status";

// Badge de estado accesible: color + etiqueta de texto (no depende solo del color).
export function StatusBadge({
  status,
  short = false,
  className,
}: {
  status: UnitStatus;
  short?: boolean;
  className?: string;
}) {
  const m = statusMeta(status);
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        m.badgeClass,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} aria-hidden />
      {short ? m.short : m.label}
    </span>
  );
}
