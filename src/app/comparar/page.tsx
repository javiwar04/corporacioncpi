"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { resolveUnitKey, unitSlug } from "@/data";
import { displayPrice, formatArea } from "@/lib/format";
import { statusMeta } from "@/lib/status";
import { unitWhatsappLink } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";

const ROWS: { label: string; get: (u: any) => string | null }[] = [
  { label: "Proyecto", get: (x) => x.project.name },
  { label: "Estado", get: (x) => statusMeta(x.unit.status).label },
  { label: "Precio", get: (x) => displayPrice(x.unit) ?? "A consultar" },
  { label: "Modelo", get: (x) => x.unit.model ?? "—" },
  { label: "Terreno", get: (x) => formatArea(x.unit.lotArea) ?? "—" },
  { label: "Construcción", get: (x) => formatArea(x.unit.constructionArea) ?? "—" },
  { label: "Oficina", get: (x) => formatArea(x.unit.officeArea) ?? "—" },
  { label: "Habitaciones", get: (x) => (x.unit.bedrooms != null ? String(x.unit.bedrooms) : "—") },
  { label: "Baños", get: (x) => (x.unit.bathrooms != null ? String(x.unit.bathrooms) : "—") },
  { label: "Parqueos", get: (x) => (x.unit.parkingSpaces != null ? String(x.unit.parkingSpaces) : "—") },
  { label: "Niveles", get: (x) => (x.unit.levels != null ? String(x.unit.levels) : "—") },
];

export default function CompararPage() {
  const { compare, toggleCompare, clearCompare, ready } = useFavorites();
  const items = compare.map((k) => ({ key: k, res: resolveUnitKey(k) })).filter((x) => x.res).map((x) => ({ key: x.key, ...x.res! }));

  return (
    <div className="bg-cream min-h-[60vh]">
      <section className="border-b border-navy/8 bg-white">
        <div className="container-cpi py-12">
          <span className="kicker">Comparación</span>
          <h1 className="mt-3 text-4xl font-medium text-navy">Comparar viviendas</h1>
          <p className="mt-2 text-navy/60">Compara hasta 3 unidades lado a lado.</p>
        </div>
      </section>

      <section className="container-cpi py-10">
        {ready && items.length === 0 ? (
          <div className="grid place-items-center gap-3 rounded-xl2 border border-dashed border-navy/15 bg-white py-20 text-center">
            <Icon name="scale" size={32} className="text-navy/30" />
            <p className="text-navy/60">No has agregado viviendas para comparar.</p>
            <Link href="/proyectos" className="btn-primary">Explorar proyectos</Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <button onClick={clearCompare} className="btn-ghost text-sm">
                <Icon name="close" size={16} /> Vaciar comparación
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="w-40 bg-transparent" />
                    {items.map(({ key, project, unit }) => (
                      <th key={key} className="p-2 align-top">
                        <div className="card overflow-hidden text-left">
                          <div className="relative aspect-[4/3] bg-navy/5">
                            {unit.coverImage && <Image src={unit.coverImage} alt={unit.code} fill sizes="240px" className="object-cover" />}
                            <button onClick={() => toggleCompare(key)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-navy" aria-label="Quitar">
                              <Icon name="close" size={16} />
                            </button>
                          </div>
                          <div className="p-3">
                            <p className="font-serif text-lg text-navy">{unit.code}</p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, ri) => (
                    <tr key={row.label} className={ri % 2 ? "bg-white" : ""}>
                      <td className="px-3 py-3 text-sm font-medium text-navy/55">{row.label}</td>
                      {items.map((x) => (
                        <td key={x.key} className="px-3 py-3 text-center text-sm font-medium text-navy">
                          {row.get(x)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td />
                    {items.map(({ key, project, unit }) => (
                      <td key={key} className="px-3 py-3 text-center">
                        <div className="flex flex-col gap-2">
                          <Link href={`/proyectos/${project.slug}/viviendas/${unitSlug(unit)}`} className="btn-ghost justify-center text-sm">Ver</Link>
                          <a href={unitWhatsappLink(project, unit)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp justify-center text-sm">
                            <Icon name="whatsapp" size={16} /> WhatsApp
                          </a>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
