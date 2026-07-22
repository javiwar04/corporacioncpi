"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project, PropertyUnit } from "@/data/types";
import { statusMeta } from "@/lib/status";
import { displayPrice, formatArea } from "@/lib/format";
import { unitWhatsappLink } from "@/lib/whatsapp";
import { unitSlug } from "@/data";
import { Icon, type IconName } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FavoriteToggle, CompareToggle, ShareButton } from "@/components/favorites/UnitActions";

function Spec({ icon, label, value }: { icon: IconName; label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-cream px-3 py-2.5">
      <Icon name={icon} size={18} className="shrink-0 text-gold-deep" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-navy">{value}</p>
        <p className="text-[0.68rem] uppercase tracking-wide text-navy/45">{label}</p>
      </div>
    </div>
  );
}

export function UnitDetailPanel({
  project,
  unit,
  onClose,
}: {
  project: Project;
  unit: PropertyUnit | null;
  onClose: () => void;
}) {
  const [img, setImg] = useState(0);
  useEffect(() => setImg(0), [unit?.id]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (unit) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [unit, onClose]);

  if (!unit) return null;

  const gallery = unit.gallery?.length ? unit.gallery : unit.coverImage ? [unit.coverImage] : [];
  const price = displayPrice(unit);
  const m = statusMeta(unit.status);

  return (
    <div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true" aria-label={`Ficha de ${unit.code}`}>
      <div className="absolute inset-0 animate-fade-in bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md animate-slide-up flex-col overflow-y-auto bg-white shadow-float sm:animate-[slide-up_.35s]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy shadow-card hover:bg-white"
          aria-label="Cerrar ficha"
        >
          <Icon name="close" size={20} />
        </button>

        {/* Galería */}
        {gallery.length > 0 && (
          <div>
            <div className="relative aspect-[4/3] w-full bg-navy/5">
              <Image src={gallery[img]} alt={`${unit.code} — ${project.name}`} fill sizes="480px" className="object-cover" />
              <div className="absolute left-4 top-4">
                <StatusBadge status={unit.status} />
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {gallery.map((g, i) => (
                  <button
                    key={g + i}
                    onClick={() => setImg(i)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 ${i === img ? "ring-gold" : "ring-transparent"}`}
                    aria-label={`Imagen ${i + 1}`}
                  >
                    <Image src={g} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 p-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">{project.name}</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <h3 className="font-serif text-2xl font-medium text-navy">{unit.model ?? unit.code}</h3>
            {unit.model && <span className="text-sm text-navy/50">{unit.code}</span>}
          </div>

          <div className="mt-3 flex items-center gap-2">
            {price ? (
              <span className="font-serif text-xl font-semibold text-navy">{price}</span>
            ) : (
              <span className="text-sm font-medium text-navy/55">Precio a consultar</span>
            )}
            {unit.priceConfirmed === false && unit.price != null && (
              <span className="text-xs text-status-reserved">(preliminar)</span>
            )}
          </div>

          {/* Acciones rápidas */}
          <div className="mt-4 flex items-center gap-2">
            <FavoriteToggle projectSlug={project.slug} unitCode={unit.code} />
            <CompareToggle projectSlug={project.slug} unitCode={unit.code} />
            <ShareButton url={`/proyectos/${project.slug}/viviendas/${unitSlug(unit)}`} />
          </div>

          {/* Especificaciones */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Spec icon="ruler" label="Terreno" value={formatArea(unit.lotArea)} />
            <Spec icon="grid" label="Construcción" value={formatArea(unit.constructionArea)} />
            <Spec icon="building" label="Oficina" value={formatArea(unit.officeArea)} />
            <Spec icon="bed" label="Habitaciones" value={unit.bedrooms} />
            <Spec icon="bath" label="Baños" value={unit.bathrooms} />
            <Spec icon="layers" label="Niveles" value={unit.levels} />
            <Spec icon="car" label="Parqueos" value={unit.parkingSpaces} />
            <Spec icon="pin" label="Fase / sector" value={unit.phase ?? unit.sector} />
          </div>

          {unit.description && (
            <p className="mt-4 text-sm leading-relaxed text-navy/70">{unit.description}</p>
          )}

          {/* Plano de distribución */}
          {unit.floorPlans?.length ? (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-navy">Plano de distribución</p>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-navy/10 bg-white">
                <Image src={unit.floorPlans[0]} alt={`Plano de ${unit.code}`} fill sizes="480px" className="object-contain" />
              </div>
            </div>
          ) : null}
        </div>

        {/* Acciones fijas */}
        <div className="sticky bottom-0 border-t border-navy/10 bg-white/95 p-4 backdrop-blur">
          <div className="flex flex-col gap-2">
            <a href={unitWhatsappLink(project, unit)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
              <Icon name="whatsapp" size={18} /> Solicitar por WhatsApp
            </a>
            <Link href={`/proyectos/${project.slug}/viviendas/${unitSlug(unit)}`} className="btn-ghost w-full">
              Ver detalle completo <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
