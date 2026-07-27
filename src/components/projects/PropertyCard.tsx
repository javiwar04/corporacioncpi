import Image from "next/image";
import Link from "next/link";
import type { Project, PropertyUnit } from "@/data/types";
import { unitSlug, categoryLabels } from "@/data";
import { displayPrice, formatArea } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";

// Tarjeta de PROPIEDAD (vivienda/bodega individual) → enlaza directo a su ficha (1 clic).
export function PropertyCard({
  project,
  unit,
  priority = false,
}: {
  project: Project;
  unit: PropertyUnit;
  priority?: boolean;
}) {
  const href = `/proyectos/${project.slug}/viviendas/${unitSlug(unit)}`;
  const price = displayPrice(unit);
  const cover = unit.coverImage ?? project.coverImage;

  return (
    <Link
      href={href}
      className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
        <Image
          src={cover}
          alt={`${unit.model ?? unit.code} — ${project.name}`}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <StatusBadge status={unit.status} />
          <span className="rounded-full bg-navy/85 px-2.5 py-1 text-[0.68rem] font-medium text-white backdrop-blur">
            {categoryLabels[project.category]}
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
          {project.name}
        </p>
        <div className="mt-1 flex items-start justify-between gap-2">
          <h3 className="font-serif text-xl font-medium text-navy">{unit.model ?? unit.code}</h3>
          <Icon
            name="arrow-right"
            size={18}
            className="mt-1 shrink-0 text-navy/30 transition-transform group-hover:translate-x-1 group-hover:text-gold"
          />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-navy/55">
          <Icon name="pin" size={15} className="text-gold" /> {project.location}
        </p>

        {/* Especificaciones rápidas */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-navy/70">
          {unit.bedrooms != null && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="bed" size={16} className="text-gold-deep" /> {unit.bedrooms} hab.
            </span>
          )}
          {unit.bathrooms != null && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="bath" size={16} className="text-gold-deep" /> {unit.bathrooms} baños
            </span>
          )}
          {unit.constructionArea != null && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="grid" size={16} className="text-gold-deep" /> {formatArea(unit.constructionArea)}
            </span>
          )}
          {unit.lotArea != null && unit.bedrooms == null && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="ruler" size={16} className="text-gold-deep" /> {formatArea(unit.lotArea)}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-navy/8 pt-4">
          {price ? (
            <p className="font-serif text-lg font-semibold text-navy">{price}</p>
          ) : (
            <span className="text-sm font-medium text-navy/50">Consultar precio</span>
          )}
          <span className="text-sm font-semibold text-gold-deep group-hover:underline">
            Ver propiedad
          </span>
        </div>
      </div>
    </Link>
  );
}
