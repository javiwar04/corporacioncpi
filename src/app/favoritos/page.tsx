"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { resolveUnitKey, unitSlug } from "@/data";
import { displayPrice, formatArea } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function FavoritosPage() {
  const { favorites, toggleFavorite, ready } = useFavorites();
  const items = favorites.map((k) => ({ key: k, res: resolveUnitKey(k) })).filter((x) => x.res);

  return (
    <div className="bg-cream min-h-[60vh]">
      <section className="border-b border-navy/8 bg-white">
        <div className="container-cpi py-12">
          <span className="kicker">Tu selección</span>
          <h1 className="mt-3 text-4xl font-medium text-navy">Favoritos</h1>
          <p className="mt-2 text-navy/60">Viviendas y unidades que guardaste. Se conservan en este dispositivo.</p>
        </div>
      </section>

      <section className="container-cpi py-10">
        {ready && items.length === 0 && (
          <div className="grid place-items-center gap-3 rounded-xl2 border border-dashed border-navy/15 bg-white py-20 text-center">
            <Icon name="heart" size={32} className="text-navy/30" />
            <p className="text-navy/60">Aún no has guardado ninguna vivienda.</p>
            <Link href="/proyectos" className="btn-primary">Explorar proyectos</Link>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ key, res }) => {
            const { project, unit } = res!;
            const price = displayPrice(unit);
            return (
              <div key={key} className="card overflow-hidden">
                <Link href={`/proyectos/${project.slug}/viviendas/${unitSlug(unit)}`} className="relative block aspect-[4/3] bg-navy/5">
                  {unit.coverImage && <Image src={unit.coverImage} alt={unit.code} fill sizes="33vw" className="object-cover" />}
                  <div className="absolute left-3 top-3"><StatusBadge status={unit.status} short /></div>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-gold-deep">{project.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-lg text-navy">{unit.model ?? unit.code}</p>
                    {price && <span className="text-sm font-semibold text-navy">{price}</span>}
                  </div>
                  <p className="mt-1 text-xs text-navy/55">{formatArea(unit.constructionArea) ?? "—"}</p>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/proyectos/${project.slug}/viviendas/${unitSlug(unit)}`} className="btn-ghost flex-1">Ver</Link>
                    <button onClick={() => toggleFavorite(key)} className="btn-ghost !text-red-500" aria-label="Quitar de favoritos">
                      <Icon name="heart" size={18} className="fill-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <div className="mt-8">
            <Link href="/comparar" className="btn-primary">
              <Icon name="scale" size={18} /> Comparar viviendas
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
