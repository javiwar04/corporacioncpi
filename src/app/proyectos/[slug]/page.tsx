import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug, getAllProjectSlugs, projectCounters, categoryLabels, projectStatusLabels } from "@/data";
import { site } from "@/data/site";
import { formatCurrency } from "@/lib/format";
import { projectWhatsappLink } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";
import { MasterplanExplorer } from "@/components/masterplan/MasterplanExplorer";
import { MasterplanComingSoon } from "@/components/masterplan/MasterplanComingSoon";
import { UnitCatalog } from "@/components/projects/UnitCatalog";
import { Amenities } from "@/components/projects/Amenities";
import { Gallery } from "@/components/projects/Gallery";
import { ProjectsMapLazy } from "@/components/map/ProjectsMapLazy";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.shortDescription,
    openGraph: {
      title: `${project.name} · ${site.name}`,
      description: project.shortDescription,
      images: [{ url: project.coverImage }],
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const counters = projectCounters(project);
  const priceFrom = project.units
    .filter((u) => u.price != null && u.priceConfirmed !== false)
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative bg-navy text-white">
        <div className="absolute inset-0">
          <Image src={project.coverImage} alt="" fill priority className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
        </div>
        <div className="container-cpi relative z-10 pb-12 pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="hover:text-gold">Inicio</Link>
            <Icon name="chevron-right" size={14} />
            <Link href="/proyectos" className="hover:text-gold">Proyectos</Link>
            <Icon name="chevron-right" size={14} />
            <span className="text-white/90">{project.name}</span>
          </nav>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium backdrop-blur">{categoryLabels[project.category]}</span>
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">{projectStatusLabels[project.status]}</span>
            {project.preliminary && <span className="rounded-full bg-status-reserved/90 px-3 py-1 text-xs font-medium">Datos preliminares</span>}
          </div>

          {project.logo ? (
            <h1 className="mt-4">
              <Image
                src={project.logo}
                alt={project.name}
                width={140}
                height={140}
                className="h-24 w-24 rounded-2xl object-cover shadow-float ring-1 ring-white/15 sm:h-28 sm:w-28"
              />
            </h1>
          ) : (
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-normal leading-tight sm:text-6xl">{project.name}</h1>
          )}
          {project.tagline && <p className="mt-3 text-lg text-gold-soft">{project.tagline}</p>}
          <p className="mt-3 flex items-center gap-2 text-white/70">
            <Icon name="pin" size={18} className="text-gold" /> {project.location}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {priceFrom ? (
              <div className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur">
                <span className="text-xs uppercase tracking-wide text-white/55">Desde</span>
                <p className="font-serif text-2xl font-semibold text-gold">{formatCurrency(priceFrom.price, priceFrom.currency)}</p>
              </div>
            ) : project.priceNote ? (
              <div className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur">
                <span className="text-xs uppercase tracking-wide text-white/55">Precio</span>
                <p className="font-serif text-2xl font-semibold text-gold">{project.priceNote}</p>
              </div>
            ) : null}
            <a href={projectWhatsappLink(project)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <Icon name="whatsapp" size={18} /> Consultar por WhatsApp
            </a>
            <a href="#masterplan" className="btn-ghost border-white/25 bg-white/10 text-white hover:bg-white/20">
              {project.hasInteractiveMasterplan ? "Seleccione su vivienda" : "Ver viviendas"}
            </a>
          </div>
        </div>
      </section>

      {/* Descripción + highlights */}
      <section className="container-cpi grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="kicker">El proyecto</span>
          <h2 className="mt-3 text-3xl font-medium text-navy">Sobre {project.name}</h2>
          <p className="mt-4 leading-relaxed text-navy/75">{project.description ?? project.shortDescription}</p>
          {project.maintenanceFee && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-navy/70 ring-1 ring-navy/8">
              <Icon name="shield" size={16} className="text-gold-deep" />
              Mantenimiento: {formatCurrency(project.maintenanceFee.amount, project.maintenanceFee.currency)} / {project.maintenanceFee.period}
            </p>
          )}
        </div>
        {project.highlights && (
          <ul className="space-y-3 rounded-xl2 border border-navy/8 bg-white p-6">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-navy/75">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold-deep" /> {h}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Ficha técnica */}
      {project.technicalSpecs && project.technicalSpecs.length > 0 && (
        <section className="bg-white py-14">
          <div className="container-cpi">
            <span className="kicker">Detalles técnicos</span>
            <h2 className="mt-3 text-3xl font-medium text-navy">Diseño de la bodega</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.technicalSpecs.map((s) => (
                <div key={s} className="flex items-start gap-3 rounded-xl border border-navy/8 bg-cream p-4">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold-deep" />
                  <span className="text-sm text-navy/75">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Masterplan / Seleccione su vivienda */}
      <section id="masterplan" className="scroll-mt-20 bg-cream py-14">
        <div className="container-cpi">
          <span className="kicker">{project.hasInteractiveMasterplan ? "Masterplan interactivo" : "Viviendas"}</span>
          <h2 className="mt-3 text-3xl font-medium text-navy sm:text-4xl">
            {project.hasInteractiveMasterplan
              ? project.category === "industrial"
                ? "Seleccione su bodega"
                : "Seleccione su vivienda"
              : "Modelos disponibles"}
          </h2>
          <p className="mt-3 max-w-2xl text-navy/60">
            {project.hasInteractiveMasterplan
              ? "Explore la distribución real del complejo sobre el plano oficial, identifique las unidades disponibles y consulte cada ficha."
              : "Consulte las características de cada vivienda, su plano de distribución y solicite información sin salir de la página."}
          </p>

          <div className="mt-8">
            {project.hasInteractiveMasterplan ? (
              <MasterplanExplorer project={project} />
            ) : (
              <div className="space-y-8">
                <MasterplanComingSoon />
                <UnitCatalog project={project} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Amenidades */}
      {project.amenities && project.amenities.length > 0 && (
        <section className="container-cpi py-14">
          <span className="kicker">Sobre el condominio</span>
          <h2 className="mt-3 text-3xl font-medium text-navy">Amenidades</h2>
          <div className="mt-6">
            <Amenities amenities={project.amenities} />
          </div>
        </section>
      )}

      {/* Galería */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="bg-white py-14">
          <div className="container-cpi">
            <span className="kicker">Galería</span>
            <h2 className="mt-3 text-3xl font-medium text-navy">Renders y fotografías</h2>
            <div className="mt-6">
              <Gallery images={project.gallery} title={project.name} />
            </div>
          </div>
        </section>
      )}

      {/* Ubicación */}
      {project.coordinates && (
        <section className="container-cpi py-14">
          <span className="kicker">Ubicación</span>
          <h2 className="mt-3 text-3xl font-medium text-navy">Dónde está</h2>
          <p className="mt-2 flex items-center gap-2 text-navy/65">
            <Icon name="pin" size={18} className="text-gold" /> {project.location}
            {project.coordinates.approximate && <span className="text-xs text-navy/45">(ubicación aproximada)</span>}
          </p>
          <div className="mt-6 h-[380px] overflow-hidden rounded-xl2 border border-navy/10">
            <ProjectsMapLazy projects={[project]} className="h-full w-full" />
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="container-cpi pb-20">
        <div className="flex flex-col items-center gap-4 rounded-xl2 bg-navy px-6 py-12 text-center text-white">
          <h2 className="max-w-xl font-serif text-3xl font-medium">¿Interesado en {project.name}?</h2>
          <p className="max-w-md text-white/70">Agenda una visita o solicita más información. Respondemos con gusto.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={projectWhatsappLink(project)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <Icon name="whatsapp" size={18} /> WhatsApp
            </a>
            <Link href="/contacto" className="btn-gold">Formulario de contacto</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
