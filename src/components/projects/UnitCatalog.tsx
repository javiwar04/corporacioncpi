"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project, PropertyUnit } from "@/data/types";
import { displayPrice, formatArea } from "@/lib/format";
import { unitSlug } from "@/data";
import { unitWhatsappLink } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UnitDetailPanel } from "@/components/masterplan/UnitDetailPanel";
import { FavoriteToggle, CompareToggle } from "@/components/favorites/UnitActions";

// Catálogo premium de viviendas (usado cuando no hay masterplan interactivo).
export function UnitCatalog({ project }: { project: Project }) {
  const [selected, setSelected] = useState<PropertyUnit | null>(null);

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {project.units.map((u) => {
          const price = displayPrice(u);
          return (
            <article key={u.id} className="card overflow-hidden">
              {/* Contenedor, no <button>: los toggles son botones y no pueden anidarse. */}
              <div className="group relative aspect-[16/10] w-full overflow-hidden bg-navy/5">
                {u.coverImage && (
                  <Image src={u.coverImage} alt={u.model ?? u.code} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <button
                  onClick={() => setSelected(u)}
                  className="absolute inset-0 z-10 h-full w-full"
                  aria-label={`Ver ficha de ${u.model ?? u.code}`}
                />
                <div className="pointer-events-none absolute left-4 top-4 z-20">
                  <StatusBadge status={u.status} />
                </div>
                <div className="absolute right-3 top-3 z-20 flex gap-2">
                  <FavoriteToggle projectSlug={project.slug} unitCode={u.code} />
                  <CompareToggle projectSlug={project.slug} unitCode={u.code} />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-navy">{u.model ?? u.code}</h3>
                    {u.model && <p className="text-xs text-navy/50">Código {u.code}</p>}
                  </div>
                  {price ? (
                    <span className="font-serif text-lg font-semibold text-navy">{price}</span>
                  ) : (
                    <span className="text-sm text-navy/50">Consultar</span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-navy/65">
                  {formatArea(u.lotArea) && <span className="inline-flex items-center gap-1.5"><Icon name="ruler" size={16} className="text-gold-deep" />{formatArea(u.lotArea)} terreno</span>}
                  {formatArea(u.constructionArea) && <span className="inline-flex items-center gap-1.5"><Icon name="grid" size={16} className="text-gold-deep" />{formatArea(u.constructionArea)}</span>}
                  {u.bedrooms != null && <span className="inline-flex items-center gap-1.5"><Icon name="bed" size={16} className="text-gold-deep" />{u.bedrooms} hab.</span>}
                  {u.bathrooms != null && <span className="inline-flex items-center gap-1.5"><Icon name="bath" size={16} className="text-gold-deep" />{u.bathrooms} baños</span>}
                </div>

                <div className="mt-5 flex gap-2">
                  <Link href={`/proyectos/${project.slug}/viviendas/${unitSlug(u)}`} className="btn-primary flex-1">
                    Ver detalle
                  </Link>
                  <a href={unitWhatsappLink(project, u)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" aria-label="WhatsApp">
                    <Icon name="whatsapp" size={18} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <UnitDetailPanel project={project} unit={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
