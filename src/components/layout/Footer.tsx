import Link from "next/link";
import { site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { generalWhatsappLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-24 bg-navy text-white/80">
      <div className="container-cpi grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            {site.tagline} Desarrollo inmobiliario con {site.stats.years} años de
            experiencia y {site.stats.projects} proyectos ejecutados en Guatemala.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:border-gold hover:text-gold">
              <Icon name="facebook" size={18} />
            </a>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:border-gold hover:text-gold">
              <Icon name="instagram" size={18} />
            </a>
            <a href={generalWhatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:border-gold hover:text-gold">
              <Icon name="whatsapp" size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Navegación</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-white/60 hover:text-gold">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/comparar" className="text-white/60 hover:text-gold">Comparar viviendas</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contacto</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <Icon name="phone" size={16} className="mt-0.5 shrink-0 text-gold" />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-gold">{site.phone}</a>
            </li>
            {site.email && (
              <li className="flex items-start gap-2.5">
                <Icon name="mail" size={16} className="mt-0.5 shrink-0 text-gold" />
                <a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a>
              </li>
            )}
            <li className="flex items-start gap-2.5">
              <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>{site.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-cpi flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. Todos los derechos reservados.</p>
          <p>Diseñamos el Futuro, Lo Construimos Contigo.</p>
        </div>
      </div>
    </footer>
  );
}
