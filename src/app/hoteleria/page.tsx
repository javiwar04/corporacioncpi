import type { Metadata } from "next";
import Image from "next/image";
import { hotels, hotelBrand, hotelKindLabels, hotelsCount } from "@/data/hotels";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Hotelería · Hoteles de Petén",
  description:
    "Hoteles de Petén, la cadena hotelera de Corporación CPI en Isla de Flores, Petén: 11 hoteles y alojamientos frente al lago con piscina, restaurante y aventura.",
};


export default function HoteleriaPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative bg-navy text-white">
        <div className="absolute inset-0">
          <Image src="/hoteles/hero.webp" alt="" fill priority className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
        </div>
        <div className="container-cpi relative z-10 py-24">
          <span className="kicker text-gold-soft">Hotelería · Corporación CPI</span>
          <h1 className="mt-5">
            <Image
              src={hotelBrand.logo}
              alt="Hoteles de Petén"
              width={384}
              height={94}
              className="h-14 w-auto sm:h-16"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">{hotelBrand.tagline}.</p>
          <p className="mt-2 max-w-2xl text-white/60">
            {hotelsCount} hoteles y alojamientos en Isla de Flores, Petén — frente al lago, con piscina,
            restaurante y todo para una estadía inolvidable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={hotelBrand.marketplace} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <Icon name="check" size={18} /> Reserva directo
            </a>
            <a href={hotelBrand.website} target="_blank" rel="noopener noreferrer" className="btn-ghost border-white/25 bg-white/10 text-white hover:bg-white/20">
              Visitar hotelesdepeten.com <Icon name="arrow-right" size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Grid de hoteles */}
      <section className="container-cpi py-14">
        <span className="kicker">Nuestros alojamientos</span>
        <h2 className="mt-3 text-3xl font-medium text-navy">Hoteles y residencias</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((h) => (
            <article key={h.slug} className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
              <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
                <Image src={h.image} alt={h.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-navy backdrop-blur">
                  {hotelKindLabels[h.kind]}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-medium text-navy">{h.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-navy/55">
                  <Icon name="pin" size={15} className="text-gold" /> {h.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-navy/70">{h.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {h.rooms != null && (
                    <li className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-navy/70">{h.rooms} habitaciones</li>
                  )}
                  {h.amenities.slice(0, 4).map((a) => (
                    <li key={a} className="rounded-full bg-cream px-2.5 py-1 text-xs text-navy/65">{a}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contacto hotelería */}
      <section className="container-cpi pb-20">
        <div className="grid gap-6 rounded-xl2 bg-navy p-8 text-white sm:grid-cols-3 sm:items-center">
          <div className="sm:col-span-2">
            <h2 className="font-serif text-2xl font-medium">Reserva tu estadía en el corazón de Petén</h2>
            <p className="mt-2 text-white/70">Reserva en línea al instante o escríbenos para elegir el hotel ideal.</p>
            <a href={hotelBrand.marketplace} target="_blank" rel="noopener noreferrer" className="btn-gold mt-4">
              <Icon name="check" size={18} /> Reserva directo
            </a>
          </div>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2"><Icon name="phone" size={16} className="text-gold" /> {hotelBrand.phone}</li>
            <li className="flex items-center gap-2"><Icon name="mail" size={16} className="text-gold" /> {hotelBrand.email}</li>
            <li className="flex items-center gap-2"><Icon name="pin" size={16} className="text-gold" /> {hotelBrand.location}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
