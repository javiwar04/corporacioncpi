/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactivado por la maqueta 3D (react-three-fiber): en dev, StrictMode monta el
  // Canvas dos veces y acumula contextos WebGL hasta agotar el límite del navegador
  // ("Error creating WebGL context"). Solo afecta a desarrollo. Ver Masterplan3D.
  reactStrictMode: false,
  // Permite builds de validación en una carpeta aparte (NEXT_DIST_DIR=.next-check)
  // para no interferir con el `.next` de un `next dev` en ejecución.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Los assets del proyecto son locales (public/). Formatos modernos primero.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
