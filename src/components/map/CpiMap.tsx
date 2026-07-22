"use client";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useEffect, useRef } from "react";
import { MAP_TYPE_META, type MasterPoint, type MapPointType } from "@/data/mapPoints";

function tile() {
  return {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap © CARTO",
  };
}

function pinHtml(color: string, glyph: string, badge?: number) {
  const badgeHtml =
    badge && badge > 1
      ? `<div style="position:absolute;top:-4px;right:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#08053E;color:#fff;font:600 11px/20px var(--font-sans),sans-serif;text-align:center;border:2px solid #fff">${badge}</div>`
      : "";
  return `
    <div style="position:relative;width:46px;height:56px;filter:drop-shadow(0 6px 10px rgba(8,5,62,.35))">
      <svg width="46" height="56" viewBox="0 0 46 56"><path d="M23 55C23 55 43 33 43 21A20 20 0 1 0 3 21C3 33 23 55 23 55Z" fill="#08053E" stroke="${color}" stroke-width="3"/></svg>
      <svg width="22" height="22" viewBox="0 0 24 24" style="position:absolute;top:9px;left:12px" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="${glyph}"/></svg>
      ${badgeHtml}
    </div>`;
}

function popupHtml(p: MasterPoint): string {
  const meta = MAP_TYPE_META[p.type];
  const approx = p.approximate
    ? `<div style="font-size:10px;color:#8A8F98;margin-top:6px">Ubicación aproximada</div>`
    : "";

  if (p.items.length === 1) {
    const it = p.items[0];
    return `<div style="font-family:var(--font-sans),sans-serif;width:250px">
      ${it.thumb ? `<div style="height:120px;background:#08053E url('${it.thumb}') center/cover"></div>` : ""}
      <div style="padding:12px 14px 14px">
        <div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${meta.color};font-weight:700">${meta.label}</div>
        <div style="font-family:var(--font-serif),serif;font-size:18px;color:#08053E;margin-top:2px">${p.title}</div>
        ${p.subtitle ? `<div style="font-size:12px;color:#6b6b7a;margin-top:2px">${p.subtitle}</div>` : ""}
        ${approx}
        ${p.href ? `<a href="${p.href}" style="display:inline-flex;margin-top:12px;background:#08053E;color:#fff;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:500;text-decoration:none">Ver más →</a>` : ""}
      </div>
    </div>`;
  }

  // Varios items → tarjeta con lista desplegable
  const rows = p.items
    .map(
      (it) => `
      <a href="${it.href ?? p.href ?? "#"}" style="display:flex;gap:10px;align-items:center;padding:8px 6px;border-radius:8px;text-decoration:none;border-bottom:1px solid #eee">
        ${it.thumb ? `<span style="width:44px;height:38px;border-radius:6px;background:#08053E url('${it.thumb}') center/cover;flex:none"></span>` : ""}
        <span style="min-width:0">
          <span style="display:block;font-size:13px;color:#08053E;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${it.name}</span>
          ${it.sub ? `<span style="display:block;font-size:11px;color:#8A8F98;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${it.sub}</span>` : ""}
        </span>
      </a>`
    )
    .join("");

  return `<div style="font-family:var(--font-sans),sans-serif;width:270px">
    <div style="padding:12px 14px 8px">
      <div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${meta.color};font-weight:700">${meta.plural} · ${p.items.length}</div>
      <div style="font-family:var(--font-serif),serif;font-size:18px;color:#08053E;margin-top:2px">${p.title}</div>
      ${p.subtitle ? `<div style="font-size:12px;color:#6b6b7a;margin-top:2px">${p.subtitle}</div>` : ""}
      ${approx}
    </div>
    <div style="max-height:230px;overflow-y:auto;padding:0 10px 10px">${rows}</div>
  </div>`;
}

export default function CpiMap({
  points,
  activeTypes,
  className,
}: {
  points: MasterPoint[];
  activeTypes?: MapPointType[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const clusterRef = useRef<any>(null);
  const Lref = useRef<any>(null);

  // Inicializa el mapa una sola vez
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
      if (cancelled || !ref.current || mapRef.current) return;
      Lref.current = L;

      const map = L.map(ref.current, { scrollWheelZoom: false, attributionControl: true });
      mapRef.current = map;
      const { url, attribution } = tile();
      L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(map);
      map.setView([15.9, -90.3], 7);
      map.on("click", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());

      renderMarkers();
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        clusterRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-renderiza marcadores al cambiar filtros/puntos
  useEffect(() => {
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTypes, points]);

  function renderMarkers() {
    const L = Lref.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }

    const visible = points.filter((p) => !activeTypes || activeTypes.includes(p.type));

    const cluster = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 44,
      iconCreateFunction: (c: any) =>
        L.divIcon({
          html: `<div class="cpi-marker-cluster" style="width:44px;height:44px;font-size:15px">${c.getChildCount()}</div>`,
          className: "",
          iconSize: L.point(44, 44),
        }),
    });

    const bounds: [number, number][] = [];
    for (const p of visible) {
      const meta = MAP_TYPE_META[p.type];
      const marker = L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: "",
          iconSize: L.point(46, 56),
          iconAnchor: L.point(23, 54),
          popupAnchor: L.point(0, -50),
          html: pinHtml(meta.color, meta.glyph, p.items.length),
        }),
      });
      marker.bindPopup(popupHtml(p), { closeButton: true, minWidth: 250, maxWidth: 290 });
      cluster.addLayer(marker);
      bounds.push([p.lat, p.lng]);
    }

    map.addLayer(cluster);
    clusterRef.current = cluster;
    if (bounds.length > 1) map.fitBounds(L.latLngBounds(bounds).pad(0.2));
    else if (bounds.length === 1) map.setView(bounds[0], 12);
  }

  return (
    <div
      ref={ref}
      className={className}
      role="application"
      aria-label="Mapa interactivo de Corporación CPI: proyectos, obra ejecutada y hoteles"
    />
  );
}
