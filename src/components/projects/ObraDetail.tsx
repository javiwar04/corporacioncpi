import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Gallery } from "@/components/projects/Gallery";
import { whatsappLink, generalWhatsappLink } from "@/lib/whatsapp";

// Página de detalle para obra ejecutada / próximos proyectos.
export function ObraDetail({
  kind,
  name,
  location,
  description,
  details,
  cover,
  gallery,
  status,
}: {
  kind: "ejecutado" | "proximo";
  name: string;
  location: string;
  description?: string;
  details?: string[];
  cover: string;
  gallery: string[];
  status?: string;
}) {
  const backHref = "/proyectos";
  const backLabel = kind === "ejecutado" ? "Proyectos ejecutados" : "Próximos proyectos";
  const badge =
    kind === "ejecutado"
      ? { text: "Ejecutado", cls: "bg-status-available text-white" }
      : status === "Vendida"
      ? { text: "Vendida", cls: "bg-status-sold text-white" }
      : { text: "Próximamente", cls: "bg-status-soon text-white" };
  const wa = whatsappLink(`Hola, deseo información sobre ${name} de Corporación CPI.`);

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative bg-navy text-white">
        <div className="absolute inset-0">
          <Image src={cover} alt="" fill priority className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
        </div>
        <div className="container-cpi relative z-10 pb-12 pt-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="hover:text-gold">Inicio</Link>
            <Icon name="chevron-right" size={14} />
            <Link href={backHref} className="hover:text-gold">{backLabel}</Link>
            <Icon name="chevron-right" size={14} />
            <span className="text-white/90">{name}</span>
          </nav>

          <span className={`mt-8 inline-block rounded-full px-3 py-1 text-xs font-semibold ${badge.cls}`}>{badge.text}</span>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-normal leading-tight sm:text-5xl">{name}</h1>
          <p className="mt-3 flex items-center gap-2 text-white/70">
            <Icon name="pin" size={18} className="text-gold" /> {location}
          </p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-6">
            <Icon name="whatsapp" size={18} /> Consultar por WhatsApp
          </a>
        </div>
      </section>

      {/* Descripción + detalles */}
      <section className="container-cpi grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="kicker">La vivienda</span>
          <h2 className="mt-3 text-3xl font-medium text-navy">Sobre esta casa</h2>
          {description && <p className="mt-4 leading-relaxed text-navy/75">{description}</p>}
        </div>
        {details && details.length > 0 && (
          <div className="rounded-xl2 border border-navy/8 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-gold-deep">Características y áreas</p>
            <ul className="mt-4 space-y-3">
              {details.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-navy/75">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold-deep" /> {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Galería */}
      {gallery.length > 0 && (
        <section className="bg-white py-14">
          <div className="container-cpi">
            <span className="kicker">Galería</span>
            <h2 className="mt-3 text-3xl font-medium text-navy">Fotografías</h2>
            <div className="mt-6">
              <Gallery images={gallery} title={name} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-cpi py-16">
        <div className="flex flex-col items-center gap-4 rounded-xl2 bg-navy px-6 py-12 text-center text-white">
          <h2 className="max-w-xl font-serif text-3xl font-medium">
            {kind === "ejecutado" ? "¿Quieres una casa como esta?" : "¿Te interesa este proyecto?"}
          </h2>
          <p className="max-w-md text-white/70">Conoce nuestros proyectos disponibles o escríbenos para más información.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={generalWhatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <Icon name="whatsapp" size={18} /> WhatsApp
            </a>
            <Link href="/proyectos" className="btn-gold">Ver proyectos</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
