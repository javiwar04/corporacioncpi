import { site } from "@/data/site";

// ─────────────────────────────────────────────────────────────
// Capa de tiles del mapa — única fuente de verdad para TODOS los mapas.
//
// CARTO (basemaps.cartocdn.com) dejó de servir tiles gratis sin credencial:
// ahora devuelve la imagen con la marca de agua «API KEY REQUIRED». Por eso el
// default pasó a OpenStreetMap, que no pide llave.
//
// Para recuperar el estilo claro tipo Positron basta con definir en el entorno:
//   NEXT_PUBLIC_MAP_PROVIDER=carto|maptiler|mapbox
//   NEXT_PUBLIC_MAP_TILE_KEY=<llave>
// ─────────────────────────────────────────────────────────────

export interface TileLayerConfig {
  url: string;
  attribution: string;
}

export function mapTileLayer(): TileLayerConfig {
  const { provider, tileUrl, tileKey } = site.map;

  // URL propia (p. ej. un proxy de tiles de CPI): manda sobre todo lo demás.
  if (tileUrl) {
    return { url: tileUrl, attribution: "© Corporación CPI" };
  }

  if (provider === "mapbox" && tileKey) {
    return {
      url: `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${tileKey}`,
      attribution: "© Mapbox © OpenStreetMap",
    };
  }

  if (provider === "maptiler" && tileKey) {
    return {
      url: `https://api.maptiler.com/maps/dataviz-light/{z}/{x}/{y}.png?key=${tileKey}`,
      attribution: "© MapTiler © OpenStreetMap",
    };
  }

  if (provider === "carto" && tileKey) {
    return {
      url: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?api_key=${tileKey}`,
      attribution: "© OpenStreetMap © CARTO",
    };
  }

  // Default sin API key.
  return {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap",
  };
}
