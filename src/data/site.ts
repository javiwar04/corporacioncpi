// Configuración global del sitio. Los valores sensibles vienen de variables de entorno.

export const site = {
  name: "Corporación CPI",
  legalName: "Corporación CPI",
  tagline: "Diseñamos el Futuro, Lo Construimos Contigo.",
  description:
    "Desarrollo inmobiliario premium en Guatemala. Viviendas, comercios y proyectos industriales con más de 10 años de experiencia y +30 proyectos ejecutados.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://corporacioncpi.com",

  phone: process.env.NEXT_PUBLIC_PHONE || "+502 2333 7054",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50223337054",
  // Correo PENDIENTE de confirmar — ver CONTENT_TODO.md
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",

  address: "5ta avenida 15-45 zona 10, Edificio Centro Empresarial of. 105 Torre I, Guatemala",

  social: {
    facebook: "https://facebook.com/cpicorporacion",
    instagram: "https://instagram.com/cpicorporacion",
  },

  stats: {
    years: "+10",
    collaborators: "+55",
    projects: "+30",
  },

  values: [
    { title: "Coordinación · Eficiencia", icon: "workflow" },
    { title: "Atención · Calidad", icon: "quality" },
    { title: "Honestidad · Transparencia", icon: "handshake" },
  ],

  nav: [
    { label: "Inicio", href: "/" },
    { label: "Proyectos", href: "/proyectos" },
    { label: "IMANA", href: "/proyectos/imana" },
    { label: "Hotelería", href: "/hoteleria" },
    { label: "Nosotros", href: "/contacto" },
  ],

  map: {
    provider: process.env.NEXT_PUBLIC_MAP_PROVIDER || "osm",
    tileUrl: process.env.NEXT_PUBLIC_MAP_TILE_URL || "",
    tileKey: process.env.NEXT_PUBLIC_MAP_TILE_KEY || "",
  },
} as const;

export type Site = typeof site;
