"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-[60] transition-all duration-300",
        scrolled
          ? "border-b border-navy/10 bg-cream/85 backdrop-blur-md"
          : "border-b border-transparent bg-cream/0"
      )}
    >
      <nav className="container-cpi flex h-16 items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-navy" : "text-navy/60 hover:text-navy"
                )}
              >
                {item.label}
                {active && <span className="mx-3.5 block h-px bg-gold" />}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/favoritos" className="text-navy/60 hover:text-navy" aria-label="Favoritos">
            <Icon name="heart" />
          </Link>
          <Link href="/contacto#contacto" className="btn-primary">
            Contáctanos
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-md text-navy md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy/10 bg-cream md:hidden">
          <div className="container-cpi flex flex-col py-3">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-3 text-base font-medium text-navy/80"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3">
              <Link href="/favoritos" className="btn-ghost flex-1">
                <Icon name="heart" size={18} /> Favoritos
              </Link>
              <Link href="/contacto#contacto" className="btn-primary flex-1">
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
