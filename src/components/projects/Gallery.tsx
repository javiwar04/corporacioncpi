"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

// Galería con lightbox y carga progresiva (skeleton + fade).
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i == null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i == null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, images.length]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-navy/5"
            aria-label={`Ampliar imagen ${i + 1} de ${title}`}
          >
            <Image src={src} alt={`${title} — imagen ${i + 1}`} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>

      {open != null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/90 p-4 animate-fade-in" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label="Galería ampliada">
          <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setOpen(null)} aria-label="Cerrar">
            <Icon name="close" size={24} />
          </button>
          <button
            className="absolute left-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setOpen((i) => (i == null ? i : (i - 1 + images.length) % images.length)); }}
            aria-label="Anterior"
          >
            <Icon name="chevron-right" size={24} className="rotate-180" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[open]} alt={`${title} — imagen ${open + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            className="absolute right-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setOpen((i) => (i == null ? i : (i + 1) % images.length)); }}
            aria-label="Siguiente"
          >
            <Icon name="chevron-right" size={24} />
          </button>
          <span className="absolute bottom-5 rounded-full bg-white/10 px-3 py-1 text-sm text-white">{open + 1} / {images.length}</span>
        </div>
      )}
    </>
  );
}
