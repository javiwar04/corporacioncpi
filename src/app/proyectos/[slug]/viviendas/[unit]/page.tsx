import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { findUnit, getAllUnitParams, similarUnits, unitSlug } from "@/data";
import { site } from "@/data/site";
import { statusMeta } from "@/lib/status";
import { displayPrice, formatArea, formatCurrency } from "@/lib/format";
import { unitWhatsappLink } from "@/lib/whatsapp";
import { Icon, type IconName } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Gallery } from "@/components/projects/Gallery";
import { InteractiveFloorplan } from "@/components/masterplan/InteractiveFloorplan";
import { MiniMasterplan } from "@/components/masterplan/MiniMasterplan";
import { ContactForm } from "@/components/contact/ContactForm";
import { FavoriteToggle, CompareToggle, ShareButton } from "@/components/favorites/UnitActions";

export function generateStaticParams() {
  return getAllUnitParams();
}

export function generateMetadata({ params }: { params: { slug: string; unit: string } }): Metadata {
  const found = findUnit(params.slug, params.unit);
  if (!found) return {};
  const { project, unit } = found;
  const title =
    unit.model && unit.model !== project.name
      ? `${unit.model} · ${project.name}`
      : `${project.name} — ${unit.code}`;
  const price = displayPrice(unit);
  const desc = `${unit.code} en ${project.name}. ${statusMeta(unit.status).label}.${price ? ` Desde ${price}.` : ""} ${unit.description ?? project.shortDescription}`.slice(0, 180);
  return {
    title,
    description: desc,
    openGraph: {
      title: `${title} · ${site.name}`,
      description: desc,
      images: [{ url: unit.coverImage ?? project.coverImage }],
    },
  };
}

function Spec({ icon, label, value }: { icon: IconName; label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="rounded-xl border border-navy/8 bg-white p-4">
      <Icon name={icon} size={20} className="text-gold-deep" />
      <p className="mt-2 font-serif text-lg font-semibold text-navy">{value}</p>
      <p className="text-[0.68rem] uppercase tracking-wide text-navy/45">{label}</p>
    </div>
  );
}

export default function UnitPage({ params }: { params: { slug: string; unit: string } }) {
  const found = findUnit(params.slug, params.unit);
  if (!found) notFound();
  const { project, unit } = found;
  const price = displayPrice(unit);
  const gallery = unit.gallery?.length ? unit.gallery : project.gallery ?? [];
  const similar = similarUnits(project, unit);
  const context = `la vivienda ${unit.code} del proyecto ${project.name}`;

  return (
    <div className="bg-cream">
      <div className="container-cpi py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-navy/55">
          <Link href="/" className="hover:text-gold">Inicio</Link>
          <Icon name="chevron-right" size={14} />
          <Link href="/proyectos" className="hover:text-gold">Proyectos</Link>
          <Icon name="chevron-right" size={14} />
          <Link href={`/proyectos/${project.slug}`} className="hover:text-gold">{project.name}</Link>
          <Icon name="chevron-right" size={14} />
          <span className="text-navy/90">{unit.code}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Columna principal */}
          <div>
            {gallery[0] && (
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl2 bg-navy/5">
                <Image src={gallery[0]} alt={`${unit.code} — ${project.name}`} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
                <div className="absolute left-4 top-4"><StatusBadge status={unit.status} /></div>
              </div>
            )}

            <div className="mt-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">{project.name}</p>
              <h1 className="mt-1 font-serif text-4xl font-medium text-navy">{unit.model ?? unit.code}</h1>
              {unit.model && <p className="text-sm text-navy/50">Código oficial: {unit.code}</p>}
              {unit.description && <p className="mt-4 leading-relaxed text-navy/75">{unit.description}</p>}
            </div>

            {/* Características */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Spec icon="ruler" label="Terreno" value={formatArea(unit.lotArea)} />
              <Spec icon="grid" label="Construcción" value={formatArea(unit.constructionArea)} />
              <Spec icon="building" label="Oficina" value={formatArea(unit.officeArea)} />
              <Spec icon="bed" label="Habitaciones" value={unit.bedrooms} />
              <Spec icon="bath" label="Baños" value={unit.bathrooms} />
              <Spec icon="layers" label="Niveles" value={unit.levels} />
              <Spec icon="car" label="Parqueos" value={unit.parkingSpaces} />
              <Spec icon="pin" label="Fase / sector" value={unit.phase ?? unit.sector} />
            </div>

            {/* Plano arquitectónico — interactivo si hay datos, imagen si no */}
            {unit.interactiveFloorplan?.length ? (
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-medium text-navy">Plano interactivo</h2>
                  <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold-deep">
                    Explora cada ambiente
                  </span>
                </div>
                <div className="mt-3">
                  <InteractiveFloorplan levels={unit.interactiveFloorplan} />
                </div>
              </div>
            ) : unit.floorPlans?.length ? (
              <div className="mt-8">
                <h2 className="text-xl font-medium text-navy">Plano arquitectónico</h2>
                <div className="mt-3">
                  <Gallery images={unit.floorPlans} title={`Plano de ${unit.code}`} />
                </div>
              </div>
            ) : null}

            {/* Galería */}
            {gallery.length > 1 && (
              <div className="mt-8">
                <h2 className="text-xl font-medium text-navy">Galería</h2>
                <div className="mt-3">
                  <Gallery images={gallery} title={unit.code} />
                </div>
              </div>
            )}

            {/* Ubicación en el masterplan */}
            {project.hasInteractiveMasterplan && unit.polygonPoints && (
              <div className="mt-8">
                <h2 className="text-xl font-medium text-navy">Ubicación en el masterplan</h2>
                <div className="mt-3 rounded-xl2 border border-navy/10 bg-white p-4">
                  <MiniMasterplan project={project} unit={unit} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar sticky */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <StatusBadge status={unit.status} />
                <div className="flex gap-2">
                  <FavoriteToggle projectSlug={project.slug} unitCode={unit.code} />
                  <CompareToggle projectSlug={project.slug} unitCode={unit.code} />
                  <ShareButton url={`/proyectos/${project.slug}/viviendas/${unitSlug(unit)}`} />
                </div>
              </div>
              <div className="mt-4">
                {price ? (
                  <p className="font-serif text-3xl font-semibold text-navy">{price}</p>
                ) : (
                  <p className="text-lg font-medium text-navy/55">Precio a consultar</p>
                )}
                {unit.priceConfirmed === false && unit.price != null && (
                  <p className="text-xs text-status-reserved">Valor preliminar — a confirmar</p>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <a href={unitWhatsappLink(project, unit)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp justify-center">
                  <Icon name="whatsapp" size={18} /> Solicitar por WhatsApp
                </a>
                <a href="#solicitar" className="btn-primary justify-center">Solicitar información</a>
              </div>

              <div className="mt-5 border-t border-navy/8 pt-4 text-sm text-navy/60">
                <p className="flex items-center gap-2"><Icon name="phone" size={16} className="text-gold-deep" /> {site.phone}</p>
                {project.maintenanceFee && (
                  <p className="mt-2 flex items-center gap-2"><Icon name="shield" size={16} className="text-gold-deep" /> Mantenimiento {formatCurrency(project.maintenanceFee.amount, project.maintenanceFee.currency)}/{project.maintenanceFee.period}</p>
                )}
              </div>
            </div>

            {/* Formulario */}
            <div id="solicitar" className="card mt-5 scroll-mt-20 p-6">
              <h2 className="font-serif text-xl font-medium text-navy">Solicitar información</h2>
              <p className="mt-1 text-sm text-navy/60">Déjanos tus datos y te contactamos.</p>
              <div className="mt-4">
                <ContactForm context={context} />
              </div>
            </div>
          </aside>
        </div>

        {/* Unidades similares */}
        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-medium text-navy">Unidades similares</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((u) => {
                const p = displayPrice(u);
                return (
                  <Link key={u.id} href={`/proyectos/${project.slug}/viviendas/${unitSlug(u)}`} className="card group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-float">
                    <div className="relative aspect-[4/3] bg-navy/5">
                      {u.coverImage && <Image src={u.coverImage} alt={u.code} fill sizes="33vw" className="object-cover" />}
                      <div className="absolute left-3 top-3"><StatusBadge status={u.status} short /></div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-serif text-lg text-navy">{u.code}</p>
                        <p className="text-xs text-navy/55">{formatArea(u.constructionArea) ?? "—"}</p>
                      </div>
                      {p && <span className="text-sm font-semibold text-navy">{p}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
