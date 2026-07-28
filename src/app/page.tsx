import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { projects, featuredProperties } from "@/data";
import { executedProjects, executedCount } from "@/data/executed";
import { hotels, hotelsCount } from "@/data/hotels";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PropertyCard } from "@/components/projects/PropertyCard";
import { QuickSearch } from "@/components/projects/QuickSearch";
import { MasterMap } from "@/components/map/MasterMap";
import { Icon, type IconName } from "@/components/ui/Icon";

export default function HomePage() {
  const featured = projects;
  const properties = featuredProperties(6);

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0">
          <Image
            src="/projects/refugio-de-la-condesa/cover.webp"
            alt=""
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/55" />
        </div>

        <div className="container-cpi relative z-10 flex min-h-[78vh] flex-col justify-center py-24">
          <span className="kicker text-gold-soft animate-fade-in">Desarrollo inmobiliario · Guatemala</span>
          <h1 className="mt-6 max-w-4xl font-serif text-4xl font-normal leading-[1.05] tracking-tight animate-slide-up sm:text-6xl lg:text-7xl">
            Diseñamos el futuro,
            <br />
            <span className="italic text-gold">lo construimos contigo.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 animate-slide-up">
            Viviendas de autor, espacios comerciales e industriales con más de una
            década construyendo con conciencia y calidad en Antigua Guatemala y el
            interior del país.
          </p>
          {/* Acceso directo a propiedades (buscador rápido) */}
          <div className="relative z-20 mt-8 flex justify-center animate-slide-up">
            <QuickSearch />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3 animate-slide-up">
            <a href="#propiedades" className="btn-gold">
              Ver propiedades disponibles <Icon name="arrow-right" size={18} />
            </a>
            <Link href="/contacto#contacto" className="btn-ghost border-white/25 bg-white/10 text-white hover:bg-white/20">
              Contáctanos
            </Link>
          </div>

          <dl className="mt-16 grid max-w-3xl mx-auto grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/12 bg-white/10 backdrop-blur sm:grid-cols-4">
            {[
              { n: site.stats.years, l: "Años de experiencia" },
              { n: `${executedCount}+`, l: "Proyectos ejecutados" },
              { n: `${hotelsCount}`, l: "Hoteles en Petén" },
              { n: site.stats.collaborators, l: "Colaboradores" },
            ].map((s) => (
              <div key={s.l} className="bg-navy/40 px-6 py-5">
                <dd className="font-serif text-3xl font-medium text-gold">{s.n}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wide text-white/55">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── PROPIEDADES DISPONIBLES (1 clic a la ficha) ─────── */}
      <section id="propiedades" className="scroll-mt-20 bg-cream py-20">
        <div className="container-cpi">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="kicker">Disponibles ahora</span>
              <h2 className="mt-3 text-3xl font-medium text-navy sm:text-4xl">
                Propiedades <span className="italic text-gold-deep">disponibles</span>
              </h2>
              <p className="mt-2 max-w-xl text-navy/60">
                Viviendas y bodegas listas para consultar. Entra directo a la ficha de cada una.
              </p>
            </div>
            <Link href="/proyectos" className="btn-ghost">
              Ver todas <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(({ project, unit }, i) => (
              <PropertyCard key={unit.id} project={project} unit={unit} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MAPA MAESTRO GLOBAL ────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container-cpi">
          <div className="mb-8 max-w-2xl">
            <span className="kicker">Presencia nacional</span>
            <h2 className="mt-3 text-3xl font-medium text-navy sm:text-4xl">
              Toda Corporación CPI en un <span className="italic text-gold-deep">mapa</span>
            </h2>
            <p className="mt-3 text-navy/60">
              Vivienda disponible y ejecutada en Antigua Guatemala, el complejo industrial IMANA y
              nuestros hoteles en Petén. Filtra por tipo y abre cada zona para ver todo lo que hay ahí.
            </p>
          </div>
          <MasterMap />
        </div>
      </section>

      {/* ── PROYECTOS DESTACADOS ───────────────────────────── */}
      <section className="bg-cream py-20">
        <div className="container-cpi">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="kicker">Portafolio</span>
              <h2 className="mt-3 text-3xl font-medium text-navy sm:text-4xl">Proyectos destacados</h2>
            </div>
            <Link href="/proyectos" className="btn-ghost">
              Ver todos <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <ProjectCard key={p.id} project={p} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROYECTOS EJECUTADOS (teaser) ──────────────────── */}
      <section className="container-cpi py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kicker">Trayectoria</span>
            <h2 className="mt-3 text-3xl font-medium text-navy sm:text-4xl">Proyectos ejecutados</h2>
            <p className="mt-2 max-w-xl text-navy/60">
              {executedCount}+ residencias construidas en Antigua Guatemala y sus alrededores.
            </p>
          </div>
          <Link href="/proyectos" className="btn-ghost">
            Ver galería completa <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {executedProjects.slice(0, 8).map((p) => (
            <Link
              key={p.name}
              href="/proyectos"
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-navy/5"
            >
              <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-sm font-medium text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                {p.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BANNER IMANA (proyecto insignia) ───────────────── */}
      <section className="container-cpi py-20">
        <div className="overflow-hidden rounded-xl2 border border-navy/10 bg-navy text-white">
          <div className="grid items-center gap-0 md:grid-cols-2">
            <div className="p-9 lg:p-12">
              <span className="kicker text-gold-soft">Proyecto insignia · Petén</span>
              <h2 className="mt-4">
                <Image
                  src="/brand/logoimana.jpg"
                  alt="IMANA"
                  width={120}
                  height={120}
                  className="h-20 w-20 rounded-2xl object-cover shadow-float ring-1 ring-white/15"
                />
              </h2>
              <p className="mt-3 text-lg text-gold-soft">Complejo de bodegas industriales</p>
              <p className="mt-4 max-w-md text-white/70">
                12 bodegas con oficinas integradas, pozo propio, energía industrial y seguridad
                perimetral en Santa Elena, Petén. Elige tu bodega desde el masterplan interactivo:
                disponibilidad en tiempo real, filtros y ficha de cada unidad.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-white/75">
                {["Masterplan interactivo", "Oficinas integradas", "Ingreso de camiones", "Energía industrial (IPPSA)"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Icon name="check" size={16} className="shrink-0 text-gold" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/proyectos/imana" className="btn-gold mt-8">
                Explorar IMANA <Icon name="arrow-right" size={18} />
              </Link>
            </div>
            <div className="relative min-h-[300px] md:h-full">
              <Image src="/imana/render-2.webp" alt="Complejo de bodegas IMANA" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy/70 to-transparent md:from-navy/40" />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOTELERÍA (teaser) ─────────────────────────────── */}
      <section className="container-cpi py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kicker">Hotelería</span>
            <h2 className="mt-3 text-3xl font-medium text-navy sm:text-4xl">Hoteles de Petén</h2>
            <p className="mt-2 max-w-xl text-navy/60">
              Nuestra cadena hotelera en Isla de Flores: {hotelsCount} hoteles y alojamientos frente al lago.
            </p>
          </div>
          <Link href="/hoteleria" className="btn-ghost">
            Conocer los hoteles <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {hotels.slice(0, 4).map((h) => (
            <Link key={h.slug} href="/hoteleria" className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-navy/5">
              <Image src={h.image} alt={h.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-medium text-white">{h.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LÍNEAS DE NEGOCIO ──────────────────────────────── */}
      <section className="container-cpi py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kicker">Qué hacemos</span>
            <h2 className="mt-3 text-3xl font-medium text-navy sm:text-4xl">Nuestras líneas de negocio</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {(
            [
              { icon: "building", title: "Vivienda", desc: "Casas y condominios de estilo antigüeño con acabados premium.", href: "/proyectos?tipo=residencial" },
              { icon: "grid", title: "Comercios e industria", desc: "Bodegas y espacios comerciales listos para operar.", href: "/proyectos?tipo=industrial" },
              { icon: "star", title: "Hotelería", desc: `Hoteles de Petén: ${hotelsCount} hoteles y alojamientos en Isla de Flores.`, href: "/hoteleria" },
            ] as { icon: IconName; title: string; desc: string; href: string }[]
          ).map((c) => (
            <Link key={c.title} href={c.href} className="card group p-7 transition-all hover:-translate-y-1 hover:shadow-float">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-gold">
                <Icon name={c.icon} size={24} />
              </span>
              <h3 className="mt-5 text-xl font-medium text-navy">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep">
                Ver más <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── VALORES / QUIÉNES SOMOS ────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container-cpi grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="kicker">Quiénes somos</span>
            <h2 className="mt-3 text-3xl font-medium text-navy sm:text-4xl">Construcciones conscientes</h2>
            <p className="mt-4 text-navy/70">
              En Corporación CPI cada proyecto nace desde el corazón de sus integrantes,
              con el propósito de hacer feliz a las personas en sus nuevos espacios. Nos
              enfocamos en la satisfacción de todos los involucrados: propietarios,
              constructores, proveedores y, por supuesto, nuestros clientes.
            </p>
            <div className="mt-8 space-y-4">
              {site.values.map((v) => (
                <div key={v.title} className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-navy">
                    <Icon name={v.icon as IconName} size={22} />
                  </span>
                  <p className="font-medium text-navy">{v.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 shadow-card">
            <Image src="/projects/antigua-gardens/obra-aerea.webp" alt="Obra de Corporación CPI" fill className="object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
