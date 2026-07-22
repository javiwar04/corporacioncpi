"use client";

import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";
import { useFavorites, unitKey } from "./FavoritesProvider";

export function FavoriteToggle({
  projectSlug,
  unitCode,
  className,
  labelled = false,
}: {
  projectSlug: string;
  unitCode: string;
  className?: string;
  labelled?: boolean;
}) {
  const { isFavorite, toggleFavorite, ready } = useFavorites();
  const k = unitKey(projectSlug, unitCode);
  const active = ready && isFavorite(k);
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(k)}
      aria-pressed={active}
      aria-label={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={clsx(
        "inline-flex items-center gap-2 rounded-md transition-colors",
        labelled ? "btn-ghost" : "grid h-9 w-9 place-items-center border border-navy/12 bg-white/80 hover:border-navy/30",
        active && "!text-red-500",
        className
      )}
    >
      <Icon name="heart" size={18} className={active ? "fill-red-500 text-red-500" : ""} />
      {labelled && (active ? "Guardado" : "Favorito")}
    </button>
  );
}

export function CompareToggle({
  projectSlug,
  unitCode,
  labelled = false,
  className,
}: {
  projectSlug: string;
  unitCode: string;
  labelled?: boolean;
  className?: string;
}) {
  const { inCompare, toggleCompare, ready } = useFavorites();
  const [full, setFull] = useState(false);
  const k = unitKey(projectSlug, unitCode);
  const active = ready && inCompare(k);
  return (
    <button
      type="button"
      onClick={() => {
        const ok = toggleCompare(k);
        if (!ok) {
          setFull(true);
          setTimeout(() => setFull(false), 2200);
        }
      }}
      aria-pressed={active}
      title={full ? "Máximo 3 viviendas para comparar" : undefined}
      className={clsx(
        "inline-flex items-center gap-2 rounded-md transition-colors",
        labelled ? "btn-ghost" : "grid h-9 w-9 place-items-center border border-navy/12 bg-white/80 hover:border-navy/30",
        active && "border-gold text-gold-deep",
        className
      )}
    >
      <Icon name="scale" size={18} />
      {labelled && (full ? "Máx. 3" : active ? "Comparando" : "Comparar")}
    </button>
  );
}

export function ShareButton({ url, labelled = false }: { url: string; labelled?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const full = typeof window !== "undefined" ? new URL(url, window.location.origin).href : url;
        try {
          if (navigator.share) await navigator.share({ url: full });
          else {
            await navigator.clipboard.writeText(full);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }
        } catch {
          /* usuario canceló */
        }
      }}
      className={clsx(
        "inline-flex items-center gap-2 rounded-md transition-colors",
        labelled ? "btn-ghost" : "grid h-9 w-9 place-items-center border border-navy/12 bg-white/80 hover:border-navy/30"
      )}
      aria-label="Compartir enlace"
    >
      <Icon name={copied ? "check" : "arrow-right"} size={18} />
      {labelled && (copied ? "¡Copiado!" : "Compartir")}
    </button>
  );
}
