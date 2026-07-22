import type { SVGProps } from "react";

// Set de íconos de línea consistente (stroke), sin dependencias externas.
export type IconName =
  | "bed"
  | "bath"
  | "car"
  | "ruler"
  | "layers"
  | "pin"
  | "shield"
  | "pool"
  | "road"
  | "tree"
  | "water"
  | "bolt"
  | "truck"
  | "building"
  | "heart"
  | "scale"
  | "search"
  | "arrow-right"
  | "chevron-right"
  | "chevron-down"
  | "close"
  | "phone"
  | "mail"
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "check"
  | "menu"
  | "map"
  | "grid"
  | "filter"
  | "star"
  | "quality"
  | "workflow"
  | "handshake";

const paths: Record<IconName, JSX.Element> = {
  bed: <><path d="M3 8v10M3 12h18v6M21 18v-4a2 2 0 0 0-2-2H8V8a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2" /></>,
  bath: <><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M6 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2" /><path d="M9 6h.01M4 19l-1 2M20 19l1 2" /></>,
  car: <><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M4 13h16v4H4zM7 17v2M17 17v2M6.5 15h.01M17.5 15h.01" /></>,
  ruler: <><path d="M3 15 15 3l6 6L9 21z" /><path d="M7 11l2 2M11 7l2 2M9 13l1 1M13 9l1 1" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></>,
  pin: <><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  shield: <><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="m9.5 11.5 1.8 1.8 3.2-3.6" /></>,
  pool: <><path d="M4 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M4 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0" /><path d="M8 14V6a2 2 0 0 1 4 0M16 14V6a2 2 0 0 0-4 0" /></>,
  road: <><path d="M6 21 8 3M18 21 16 3M12 5v3M12 11v3M12 17v2" /></>,
  tree: <><path d="M12 22v-6" /><path d="M12 16a5 5 0 0 0 5-5 4 4 0 0 0-1.2-2.9A4 4 0 0 0 12 3a4 4 0 0 0-3.8 5.1A4 4 0 0 0 7 11a5 5 0 0 0 5 5z" /></>,
  water: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></>,
  bolt: <><path d="M13 3 5 13h6l-1 8 8-10h-6z" /></>,
  truck: <><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></>,
  building: <><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M15 21v-9h3a2 2 0 0 1 2 2v7" /><path d="M8 7h3M8 11h3M8 15h3M3 21h18" /></>,
  heart: <><path d="M12 20s-7-4.6-7-9.5A3.7 3.7 0 0 1 12 7a3.7 3.7 0 0 1 7 3.5C19 15.4 12 20 12 20z" /></>,
  scale: <><path d="M12 3v18M7 21h10M6 7l-3 6h6zM18 7l-3 6h6zM6 7l6-2 6 2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  "arrow-right": <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  "chevron-right": <><path d="m9 6 6 6-6 6" /></>,
  "chevron-down": <><path d="m6 9 6 6 6-6" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  phone: <><path d="M4 5c0 8.3 6.7 15 15 15l1.5-3.5-4-1.5-1.8 1.8a12 12 0 0 1-5-5l1.8-1.8L9 6 5.5 4.5z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  facebook: <><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H7v3h2v9h3v-9h2.5l.5-3H12V6.5a1 1 0 0 1 1-1h2z" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17 6.5h.01" /></>,
  whatsapp: <><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" /><path d="M9 9c0 4 2 6 6 6l1-2-2.2-1-1 1c-1.2-.4-1.9-1-2.3-2.2l1-1L10.6 8z" /></>,
  check: <><path d="m5 12 4.5 4.5L19 7" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  map: <><path d="m9 4 6 2 5.4-1.8a.6.6 0 0 1 .8.6v13.4l-6 2-6-2-5.4 1.8a.6.6 0 0 1-.8-.6V5.8z" /><path d="M9 4v14M15 6v14" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
  filter: <><path d="M4 5h16l-6 8v5l-4 2v-7z" /></>,
  star: <><path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.2l1-5.9L3.5 9.2l5.9-.8z" /></>,
  quality: <><circle cx="12" cy="10" r="6" /><path d="m8 15-1.5 6L12 18l5.5 3L16 15" /><path d="m9.5 10 1.7 1.7L15 8" /></>,
  workflow: <><rect x="3" y="4" width="6" height="5" rx="1" /><rect x="15" y="15" width="6" height="5" rx="1" /><path d="M6 9v4a3 3 0 0 0 3 3h6" /></>,
  handshake: <><path d="m11 17 2 2a1.5 1.5 0 0 0 2.1-2.1M13 15l2 2M6 12l3-3 3 2 3-3 3 2" /><path d="M3 9v5l3 3M21 9v5l-3 3" /></>,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
