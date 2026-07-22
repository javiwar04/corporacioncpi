import type { UnitCounters } from "@/data/types";

// Contadores calculados automáticamente a partir de las unidades.
export function Counters({ c, preliminary }: { c: UnitCounters; preliminary?: boolean }) {
  const items = [
    { label: "Total", value: c.total, tone: "text-navy" },
    { label: "Disponibles", value: c.available, tone: "text-status-available" },
    { label: "Reservadas", value: c.reserved, tone: "text-status-reserved" },
    { label: "Vendidas", value: c.sold, tone: "text-status-sold" },
    { label: "Disponibilidad", value: `${c.availabilityPct}%`, tone: "text-gold-deep" },
  ];
  return (
    <div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-navy/10 bg-navy/10 sm:grid-cols-5">
        {items.map((it) => (
          <div key={it.label} className="bg-white px-4 py-3">
            <dd className={`font-serif text-2xl font-semibold ${it.tone}`}>{it.value}</dd>
            <dt className="mt-0.5 text-[0.68rem] uppercase tracking-wide text-navy/45">{it.label}</dt>
          </div>
        ))}
      </dl>
      {preliminary && (
        <p className="mt-2 text-xs text-status-reserved">
          Disponibilidad preliminar — sujeta a confirmación con Corporación CPI.
        </p>
      )}
    </div>
  );
}
