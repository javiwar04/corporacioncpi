import { Icon } from "@/components/ui/Icon";

// Fallback cuidado para proyectos que aún no tienen plano de lotificación.
export function MasterplanComingSoon({ note }: { note?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl2 border border-dashed border-navy/20 bg-white">
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(#08053E10 1px,transparent 1px),linear-gradient(90deg,#08053E10 1px,transparent 1px)",
          backgroundSize: "34px 34px",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col items-center gap-3 px-6 py-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy/5 text-gold-deep">
          <Icon name="map" size={28} />
        </span>
        <h3 className="font-serif text-2xl font-medium text-navy">Masterplan próximamente</h3>
        <p className="max-w-md text-sm leading-relaxed text-navy/60">
          {note ??
            "El plano interactivo de lotificación de este proyecto estará disponible pronto. Mientras tanto, explora las viviendas en el catálogo y consulta cada ficha."}
        </p>
      </div>
    </div>
  );
}
