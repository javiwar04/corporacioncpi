"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Clave estable de una unidad: "<projectSlug>/<unitCode-normalizado>"
export type UnitKey = string;

export function unitKey(projectSlug: string, unitCode: string): UnitKey {
  return `${projectSlug}/${unitCode.toLowerCase().replace(/\s+/g, "-")}`;
}

const FAV_KEY = "cpi:favorites";
const CMP_KEY = "cpi:compare";
const MAX_COMPARE = 3;

interface Ctx {
  favorites: UnitKey[];
  compare: UnitKey[];
  ready: boolean;
  isFavorite: (k: UnitKey) => boolean;
  toggleFavorite: (k: UnitKey) => void;
  inCompare: (k: UnitKey) => boolean;
  toggleCompare: (k: UnitKey) => boolean; // devuelve false si está lleno
  clearCompare: () => void;
}

const FavoritesContext = createContext<Ctx | null>(null);

function read(key: string): UnitKey[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as UnitKey[]) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<UnitKey[]>([]);
  const [compare, setCompare] = useState<UnitKey[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(read(FAV_KEY));
    setCompare(read(CMP_KEY));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(CMP_KEY, JSON.stringify(compare));
  }, [compare, ready]);

  const toggleFavorite = useCallback((k: UnitKey) => {
    setFavorites((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }, []);

  const toggleCompare = useCallback((k: UnitKey) => {
    let ok = true;
    setCompare((prev) => {
      if (prev.includes(k)) return prev.filter((x) => x !== k);
      if (prev.length >= MAX_COMPARE) {
        ok = false;
        return prev;
      }
      return [...prev, k];
    });
    return ok;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      favorites,
      compare,
      ready,
      isFavorite: (k) => favorites.includes(k),
      toggleFavorite,
      inCompare: (k) => compare.includes(k),
      toggleCompare,
      clearCompare: () => setCompare([]),
    }),
    [favorites, compare, ready, toggleFavorite, toggleCompare]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): Ctx {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}
