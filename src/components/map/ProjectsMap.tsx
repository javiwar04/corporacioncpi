"use client";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/types";
import { projectCounters, categoryLabels, projectStatusLabels } from "@/data";
import { site } from "@/data/site";

// Iconos de categoría como path SVG (para el marcador personalizado).
const CATEGORY_GLYPH: Record<Project["category"], string> = {
  residencial: "M4 21V9l8-6 8 6v12h-6v-6h-4v6z",
  comercial: "M4 9h16l-1 4H5zM5 13v7h14v-7M9 20v-4h6v4",
  industrial: "M3 21V10l5 3V10l5 3V6l8 4v11z",
  hotel: "M4 21V5h9a4 4 0 0 1 4 4v3h3v9M8 9h4",
};

function tileConfig() {
  const provider = site.map.provider;
  if (site.map.tileUrl) {
    return { url: site.map.tileUrl, attribution: "© Corporación CPI" };
  }
  if (provider === "mapbox" && site.map.tileKey) {
    return {
      url: `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${site.map.tileKey}`,
      attribution: "© Mapbox © OpenStreetMap",
    };
  }
  if (provider === "maptiler" && site.map.tileKey) {
    return {
      url: `https://api.maptiler.com/maps/dataviz-light/{z}/{x}/{y}.png?key=${site.map.tileKey}`,
      attribution: "© MapTiler © OpenStreetMap",
    };
  }
  // Default gratuito: CARTO Positron (limpio, sin API key)
  return {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap © CARTO",
  };
}

export default function ProjectsMap({
  projects,
  activeSlug,
  onSelect,
  className,
}: {
  projects: Project[];
  activeSlug?: string;
  onSelect?: (slug: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
      if (cancelled || !ref.current || mapRef.current) return;

      const pts = projects
        .filter((p) => p.coordinates)
        .map((p) => [p.coordinates!.latitude, p.coordinates!.longitude]) as [number, number][];

      const map = L.map(ref.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      const { url, attribution } = tileConfig();
      L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(map);

      const cluster = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 48,
        iconCreateFunction: (c: any) =>
          L.divIcon({
            html: `<div class="cpi-marker-cluster" style="width:42px;height:42px;font-size:15px">${c.getChildCount()}</div>`,
            className: "",
            iconSize: L.point(42, 42),
          }),
      });

      projects.forEach((p) => {
        if (!p.coordinates) return;
        const counters = projectCounters(p);
        const glyph = CATEGORY_GLYPH[p.category];
        const marker = L.marker([p.coordinates.latitude, p.coordinates.longitude], {
          icon: L.divIcon({
            className: "",
            iconSize: L.point(46, 56),
            iconAnchor: L.point(23, 54),
            popupAnchor: L.point(0, -50),
            html: `
              <div class="cpi-pin" style="position:relative;width:46px;height:56px;filter:drop-shadow(0 6px 10px rgba(8,5,62,.35))">
                <svg width="46" height="56" viewBox="0 0 46 56"><path d="M23 55C23 55 43 33 43 21A20 20 0 1 0 3 21C3 33 23 55 23 55Z" fill="#08053E" stroke="#C8A961" stroke-width="2.5"/></svg>
                <svg width="22" height="22" viewBox="0 0 24 24" style="position:absolute;top:9px;left:12px" fill="none" stroke="#C8A961" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${glyph}"/></svg>
              </div>`,
          }),
        });

        const availLine =
          counters.total > 1
            ? `<div style="display:flex;align-items:center;gap:6px;margin-top:6px"><span style="width:8px;height:8px;border-radius:9px;background:#2F9E6E"></span><span style="font-size:12px;color:#2F9E6E;font-weight:600">${counters.available} de ${counters.total} disponibles</span></div>`
            : "";
        const approx = p.coordinates.approximate
          ? `<div style="font-size:10px;color:#8A8F98;margin-top:4px">Ubicación aproximada</div>`
          : "";

        marker.bindPopup(
          `<div style="font-family:var(--font-sans),sans-serif">
             <div style="height:120px;background:#08053E url('${p.coverImage}') center/cover"></div>
             <div style="padding:12px 14px 14px">
               <div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#9A7C3C;font-weight:600">${categoryLabels[p.category]} · ${projectStatusLabels[p.status]}</div>
               <div style="font-family:var(--font-serif),serif;font-size:18px;color:#08053E;margin-top:2px">${p.name}</div>
               <div style="font-size:12px;color:#6b6b7a;margin-top:2px">${p.location}</div>
               <div style="font-size:12.5px;color:#3a3a48;margin-top:8px;line-height:1.45">${p.shortDescription}</div>
               ${availLine}${approx}
               <a href="/proyectos/${p.slug}" style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;background:#08053E;color:#fff;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:500;text-decoration:none">Ver proyecto →</a>
             </div>
           </div>`,
          { closeButton: true, minWidth: 260 }
        );

        marker.on("click", () => onSelect?.(p.slug));
        markersRef.current[p.slug] = marker;
        cluster.addLayer(marker);
      });

      map.addLayer(cluster);

      if (pts.length === 1) map.setView(pts[0], 13);
      else if (pts.length > 1) map.fitBounds(L.latLngBounds(pts).pad(0.25));
      else map.setView([15.5, -90.4], 7);

      // Activar zoom con rueda al hacer clic dentro del mapa
      map.on("click", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  // Sincronización: abrir/centrar el marcador activo
  useEffect(() => {
    if (!activeSlug || !mapRef.current) return;
    const marker = markersRef.current[activeSlug];
    if (marker) {
      mapRef.current.setView(marker.getLatLng(), Math.max(mapRef.current.getZoom(), 14), {
        animate: true,
      });
      marker.openPopup();
    }
  }, [activeSlug]);

  return (
    <div
      ref={ref}
      className={className}
      role="application"
      aria-label="Mapa de ubicación de los proyectos de Corporación CPI"
    />
  );
}
