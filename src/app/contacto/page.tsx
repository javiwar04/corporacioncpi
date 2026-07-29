import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ContactForm } from "@/components/contact/ContactForm";
import { generalWhatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "¿Quiénes somos?",
  description:
    "Corporación CPI: desarrollo inmobiliario de alta calidad en Guatemala. Innovación en el diseño, ejecución meticulosa y compromiso con la excelencia. Conoce nuestra misión y visión, y contáctanos.",
};

const pillars: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "star",
    title: "Innovación en el Diseño",
    desc: "Nos esforzamos por ofrecer diseños innovadores que marcan la pauta en la industria inmobiliaria.",
  },
  {
    icon: "building",
    title: "Experiencia en Desarrollos Inmobiliarios",
    desc: "Ofrecemos una experiencia única que redefine la calidad en la forma en que vive y trabaja.",
  },
  {
    icon: "shield",
    title: "Compromiso con la Excelencia",
    desc: "Nuestro compromiso inquebrantable nos impulsa a alcanzar la excelencia en cada proyecto que emprendemos.",
  },
  {
    icon: "quality",
    title: "Ejecución Meticulosa",
    desc: "Realizamos cada proyecto con atención al detalle y precisión para garantizar resultados sobresalientes.",
  },
];

export default function QuienesSomosPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative bg-navy text-white">
        <div className="absolute inset-0">
          <Image src="/projects/portal-de-antigua/patio-central.webp" alt="" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/60" />
        </div>
        <div className="container-cpi relative z-10 py-20">
          <span className="kicker text-gold-soft">¿Quiénes somos?</span>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-normal leading-tight sm:text-6xl">
            Desarrollo inmobiliario de <span className="italic text-gold">alta calidad</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Desde el diseño conceptual hasta la entrega final, nos esforzamos por superar las
            expectativas. Destacamos en el diseño y desarrollo de proyectos inmobiliarios de primera
            calidad.
          </p>
          <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/12 bg-white/10 backdrop-blur">
            {[
              { n: site.stats.years, l: "Años de experiencia" },
              { n: site.stats.projects, l: "Proyectos ejecutados" },
              { n: site.stats.collaborators, l: "Colaboradores" },
            ].map((s) => (
              <div key={s.l} className="bg-navy/40 px-5 py-4">
                <dd className="font-serif text-3xl font-medium text-gold">{s.n}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wide text-white/55">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Pilares */}
      <section className="container-cpi py-16">
        <span className="kicker">Lo que nos define</span>
        <h2 className="mt-3 text-3xl font-medium text-navy sm:text-4xl">Construcciones conscientes</h2>
        <p className="mt-3 max-w-2xl text-navy/65">
          En Corporación CPI cada proyecto nace desde el corazón de sus integrantes, con el propósito
          de hacer feliz a las personas en sus nuevos espacios, ya sea para vivienda o uso comercial.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-gold">
                <Icon name={p.icon} size={24} />
              </span>
              <h3 className="mt-5 text-lg font-medium text-navy">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calidad que transforma */}
      <section className="bg-navy py-16 text-white">
        <div className="container-cpi text-center">
          <span className="kicker justify-center text-gold-soft">Nuestra esencia</span>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl font-normal leading-tight sm:text-5xl">
            Calidad que <span className="italic text-gold">transforma</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Nuestra búsqueda constante de la calidad transforma espacios y mejora la vida de las
            personas.
          </p>
        </div>
      </section>

      {/* Misión / Visión */}
      <section className="container-cpi py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl2 border border-navy/10 bg-white p-8">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-cream text-gold-deep">
              <Icon name="star" size={24} />
            </span>
            <h3 className="mt-5 font-serif text-2xl font-medium text-navy">Misión</h3>
            <p className="mt-3 leading-relaxed text-navy/70">
              En el corazón de Guatemala, crear conceptos inmobiliarios que transforman no solo
              espacios, sino también vidas.
            </p>
          </div>
          <div className="rounded-xl2 border border-navy/10 bg-white p-8">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-cream text-gold-deep">
              <Icon name="map" size={24} />
            </span>
            <h3 className="mt-5 font-serif text-2xl font-medium text-navy">Visión</h3>
            <p className="mt-3 leading-relaxed text-navy/70">
              Ir más allá de la construcción, dejando una huella positiva en la comunidad. Con cada
              proyecto contribuimos al desarrollo sostenible y a la mejora continua de Guatemala,
              construyendo un futuro vibrante y lleno de posibilidades.
            </p>
          </div>
        </div>

        {/* Principios / valores compactos */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {site.values.map((v) => (
            <div key={v.title} className="flex items-center gap-3 rounded-xl border border-navy/8 bg-white p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cream text-navy">
                <Icon name={v.icon as IconName} size={20} />
              </span>
              <p className="text-sm font-medium text-navy">{v.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="scroll-mt-20 bg-white py-16">
        <div className="container-cpi grid gap-10 lg:grid-cols-2">
          <div>
            <span className="kicker">Contacto</span>
            <h2 className="mt-3 text-3xl font-medium text-navy">Hablemos de tu próximo espacio</h2>
            <p className="mt-2 text-navy/60">Déjanos tus datos y te contactamos con gusto.</p>
            <div className="mt-5 card p-6">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-medium text-navy">Datos de contacto</h2>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-4 rounded-xl border border-navy/8 bg-cream p-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-gold-deep"><Icon name="phone" size={22} /></span>
                <div>
                  <p className="text-sm font-semibold text-navy">Teléfono / WhatsApp</p>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-sm text-navy/65 hover:text-gold">{site.phone}</a>
                </div>
              </li>
              {site.email && (
                <li className="flex items-start gap-4 rounded-xl border border-navy/8 bg-cream p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-gold-deep"><Icon name="mail" size={22} /></span>
                  <div>
                    <p className="text-sm font-semibold text-navy">Correo</p>
                    <a href={`mailto:${site.email}`} className="text-sm text-navy/65 hover:text-gold">{site.email}</a>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-4 rounded-xl border border-navy/8 bg-cream p-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-gold-deep"><Icon name="pin" size={22} /></span>
                <div>
                  <p className="text-sm font-semibold text-navy">Oficinas</p>
                  <p className="text-sm text-navy/65">{site.address}</p>
                </div>
              </li>
            </ul>

            <div className="mt-5 flex gap-3">
              <a href={generalWhatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1 justify-center">
                <Icon name="whatsapp" size={18} /> WhatsApp
              </a>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 justify-center">
                <Icon name="instagram" size={18} /> Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
