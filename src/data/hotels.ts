// ─────────────────────────────────────────────────────────────
// HOTELERÍA — Hoteles de Petén (marca hotelera de Corporación CPI).
// Fuente: https://www.hotelesdepeten.com/hotels
// ─────────────────────────────────────────────────────────────

export const hotelBrand = {
  name: "Hoteles de Petén",
  tagline: "Hospitalidad, Aventura y Momentos Inolvidables",
  phone: "+502 4218 2300",
  whatsapp: "50242182300",
  email: "reservaciones@hotelesdepeten.com",
  location: "Isla de Flores, Petén, Guatemala",
  website: "https://www.hotelesdepeten.com",
  marketplace: "https://marketplace.hotelesdepeten.com",
  logo: "/brand/logo-hoteles-peten.webp",
};

export type HotelKind = "hotel" | "apartments" | "residence";

export interface Hotel {
  slug: string;
  name: string;
  location: string;
  kind: HotelKind;
  description: string;
  amenities: string[];
  rooms?: number;
  image: string;
}

export const hotels: Hotel[] = [
  {
    slug: "casona-del-lago",
    name: "Hotel Casona del Lago",
    location: "Frente al Lago, Flores",
    kind: "hotel",
    description: "Propiedad frente al lago con piscina, jacuzzi y Wi-Fi gratis.",
    amenities: ["Piscina", "Jacuzzi", "Restaurante", "Bar", "Salones de eventos"],
    image: "/hoteles/casona-del-lago.webp",
  },
  {
    slug: "hotel-peten",
    name: "Hotel Petén",
    location: "Isla de Flores",
    kind: "hotel",
    description: "Encantador hotel a orillas del lago con patio tropical.",
    amenities: ["Vistas al lago", "2 piscinas", "Piscina techada", "Jacuzzi", "Restaurante"],
    image: "/hoteles/hotel-peten.webp",
  },
  {
    slug: "hotel-peten-express",
    name: "Hotel Petén Express",
    location: "Flores, Petén",
    kind: "hotel",
    description: "Hostal acogedor y accesible con terraza.",
    amenities: ["Piscina techada", "Wi-Fi gratis", "Transporte al aeropuerto", "Bar", "Restaurante"],
    image: "/hoteles/hotel-peten-express.webp",
  },
  {
    slug: "casa-turquesa",
    name: "Hotel Casa Turquesa",
    location: "Flores, Petén",
    kind: "hotel",
    description: "Propiedad 3 estrellas con piscina al aire libre y habitaciones con A/C.",
    amenities: ["Piscina al aire libre", "Wi-Fi gratis", "Transporte al aeropuerto", "Recepción 24 h"],
    image: "/hoteles/casa-turquesa.webp",
  },
  {
    slug: "casona-de-la-isla",
    name: "Hotel Casona de la Isla",
    location: "Isla de Flores",
    kind: "hotel",
    description: "Hotel premium a orillas del lago con jacuzzi y servicio 24 horas.",
    amenities: ["Piscina al aire libre", "Restaurante Isla Bonita", "Bar", "Jacuzzi", "Wi-Fi gratis"],
    image: "/hoteles/casona-de-la-isla.webp",
  },
  {
    slug: "villa-del-lago",
    name: "Hotel Villa del Lago",
    location: "Isla de Flores",
    kind: "hotel",
    description: "Propiedad frente al lago con restaurante y área de café.",
    amenities: ["Wi-Fi", "Restaurante", "2 terrazas", "Desayuno incluido", "Transporte al aeropuerto"],
    image: "/hoteles/villa-del-lago.webp",
  },
  {
    slug: "casazul",
    name: "Hotel Casazul",
    location: "Isla de Flores",
    kind: "hotel",
    description: "Alojamiento frente al lago con terrazas compartidas.",
    amenities: ["Transporte al aeropuerto", "Wi-Fi", "Terraza", "Recepción 24 h", "Servicio a la habitación"],
    image: "/hoteles/casazul.webp",
  },
  {
    slug: "casa-calipso",
    name: "Casa Calipso",
    location: "Isla de Flores",
    kind: "apartments",
    description: "Apartamentos boutique con desayuno diario y acceso completo a las instalaciones.",
    amenities: ["Desayuno incluido", "Acceso a piscina", "Cocina completa"],
    image: "/hoteles/casa-calipso.webp",
  },
  {
    slug: "casa-morales",
    name: "Casa Morales",
    location: "Isla de Flores",
    kind: "apartments",
    description: "Apartamentos boutique junto a Casona de la Isla, con desayuno.",
    amenities: ["Desayuno incluido", "Acceso a piscina", "Kitchenette"],
    image: "/hoteles/casa-morales.webp",
  },
  {
    slug: "casa-esmeralda",
    name: "Casa Esmeralda",
    location: "Isla de Flores",
    kind: "residence",
    description: "Casa a orillas del lago que refleja la arquitectura vernácula de la isla.",
    amenities: ["Acceso al lago", "Wi-Fi"],
    rooms: 3,
    image: "/hoteles/casa-esmeralda.webp",
  },
  {
    slug: "casa-violeta",
    name: "Casa Violeta",
    location: "Isla de Flores",
    kind: "residence",
    description: "Encantadora casa isleña que combina diseño tradicional y moderno.",
    amenities: ["Cocina completa", "Wi-Fi"],
    rooms: 2,
    image: "/hoteles/casa-violeta.webp",
  },
];

export const hotelKindLabels: Record<HotelKind, string> = {
  hotel: "Hotel",
  apartments: "Apartamentos",
  residence: "Residencia",
};

export const hotelsCount = hotels.length;
