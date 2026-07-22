# Corporación CPI — Sitio web

Sitio web premium de **Corporación CPI** construido con **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.
Incluye un **mapa geográfico de proyectos** (Nivel 1) y un **masterplan inmobiliario interactivo** (Nivel 2)
para seleccionar viviendas/unidades, con disponibilidad en tiempo real, filtros, búsqueda, favoritos y comparación.

> El contenido proviene de los documentos oficiales en `source-documents/`.
> La auditoría de esos documentos está en [`DOCUMENT_AUDIT.md`](./DOCUMENT_AUDIT.md) y los pendientes en
> [`CONTENT_TODO.md`](./CONTENT_TODO.md). **No se inventan datos**: lo no confirmado queda vacío o marcado.

---

## Requisitos

- Node.js 18.18+ (probado con Node 24)
- npm

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev                  # http://localhost:3000
```

Scripts:

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build |
| `npm run typecheck` | Verificación de tipos TypeScript |
| `npm run lint` | ESLint (Next) |

## Variables de entorno

Ver [`.env.example`](./.env.example). Claves principales:

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — número de WhatsApp (sin `+`).
- `NEXT_PUBLIC_CONTACT_EMAIL` — correo (⚠️ pendiente de confirmar).
- `NEXT_PUBLIC_MAP_PROVIDER` — `osm` (por defecto, **sin API key**), `mapbox` o `maptiler`.
- `NEXT_PUBLIC_MAP_TILE_URL` / `NEXT_PUBLIC_MAP_TILE_KEY` — solo si usas un proveedor con clave.
- `NEXT_PUBLIC_LEADS_ENDPOINT` — endpoint opcional para el formulario (si se omite, el formulario abre WhatsApp).

El mapa por defecto usa tiles gratuitos de **CARTO/OpenStreetMap** (sin clave, costo cero).

---

## Estructura del proyecto

```
src/
  app/                         Rutas (App Router)
    page.tsx                   Home
    proyectos/                 Listado + mapa geográfico (Nivel 1)
    proyectos/[slug]/          Página de proyecto + masterplan (Nivel 2)
    proyectos/[slug]/viviendas/[unit]/   Página individual de vivienda
    favoritos/ comparar/       Favoritos y comparación (localStorage)
    contacto/ nosotros/        Institucionales
    dev/masterplan-editor/     Herramienta interna (no pública) para dibujar polígonos
  components/
    layout/  map/  masterplan/  projects/  contact/  favorites/  ui/
  data/
    types.ts                   Modelos Project / PropertyUnit
    site.ts                    Config global (contacto, marca, mapa)
    projects.ts                Definición de proyectos  ← EDITAR AQUÍ
    units.ts                   Unidades de IMANA (geometría del masterplan)
    index.ts                   Selectores + contadores automáticos
  lib/
    status.ts                  Estados de disponibilidad (colores, etiquetas)
    format.ts                  Formato de moneda/área (respeta priceConfirmed)
    whatsapp.ts                Generación de enlaces de WhatsApp
public/
  projects/<slug>/             Renders, fotos y planos (WebP)
  imana/                       Fotos de IMANA (WebP)
  brand/                       Logo
source-documents/              PDFs e imágenes originales (fuente de contenido)
```

---

## Guía de administración de contenido

Toda la data vive en `src/data/`. Los **contadores, filtros y disponibilidad** se calculan
automáticamente a partir de las unidades: **nunca se escriben a mano**.

### Cómo agregar un proyecto

Edita `src/data/projects.ts` y añade un objeto `Project`:

```ts
{
  id: "mi-proyecto",
  slug: "mi-proyecto",
  name: "Mi Proyecto",
  location: "Antigua Guatemala",
  coordinates: { latitude: 14.55, longitude: -90.73, approximate: true },
  status: "en-venta",
  category: "residencial",
  shortDescription: "…",
  coverImage: "/projects/mi-proyecto/cover.webp",
  hasInteractiveMasterplan: false, // true para usar el masterplan SVG
  units: [ /* … */ ],
}
```

Copia las imágenes a `public/projects/mi-proyecto/`. El proyecto aparece automáticamente en la
home, el listado y el mapa (si tiene `coordinates`).

### Cómo agregar una vivienda / unidad

Añade un objeto `PropertyUnit` al array `units` del proyecto (en `projects.ts`, o en `units.ts`
si es un complejo tipo IMANA):

```ts
{
  id: "unico",
  projectId: "mi-proyecto",
  code: "Casa 01",          // ← usa SIEMPRE la nomenclatura oficial del documento
  status: "available",
  lotArea: 120, constructionArea: 180, bedrooms: 3, bathrooms: 3,
  price: 250000, currency: "USD", priceConfirmed: true,
  coverImage: "/projects/mi-proyecto/casa-01.webp",
  polygonPoints: "…",       // para el masterplan (ver MASTERPLAN_GUIDE.md)
}
```

### Cómo cambiar el estado de una unidad (disponible → reservada → vendida)

Cambia el campo `status` de la unidad:

```ts
status: "reserved" // "available" | "reserved" | "sold" | "coming-soon" | "unavailable"
```

El cambio se refleja **automáticamente** en el masterplan, el listado, los contadores, los filtros
y la página individual. **No hay que editar nada más.**

### Cómo actualizar precios

Cambia `price` (y `currency`). Si el precio **no está confirmado**, pon `priceConfirmed: false`:
no se mostrará como definitivo. Si no hay precio, deja `price` sin definir → se muestra
"Precio a consultar".

### Cómo asociar una vivienda con un polígono SVG

Define `polygonPoints` (o `svgPath`) y `position`. Usa la **herramienta interna** para generarlos:
`/dev/masterplan-editor` (ver más abajo y `MASTERPLAN_GUIDE.md`).

### Cómo agregar un masterplan / imagen aérea

En el proyecto:

```ts
hasInteractiveMasterplan: true,
masterplanWidth: 1000, masterplanHeight: 640,   // dimensiones del viewBox SVG
aerialImage: "/projects/mi-proyecto/aerea.webp", // opcional
masterplanFeatures: [ /* calles, áreas verdes, accesos */ ],
```

### Cómo configurar el mapa geográfico

Añade `coordinates` a cada proyecto. Marca `approximate: true` mientras no tengas la coordenada
exacta (se muestra "ubicación aproximada"). Cambia el proveedor de tiles vía variables de entorno.

### Cómo agregar nuevas fases

Usa `phases: [{ id, name }]` en el proyecto y `phase` en cada unidad.

### Cómo conectar con una API futura

La lectura de datos está centralizada en `src/data/index.ts` (`projects`, `getProjectBySlug`,
`computeCounters`, …). Para migrar a base de datos/CMS/API, reemplaza el import estático por una
función `async` que consuma tu fuente, manteniendo los tipos de `types.ts`. Los componentes no
cambian. El formulario de contacto ya soporta `NEXT_PUBLIC_LEADS_ENDPOINT` para POST de leads.

---

## Editor de masterplan (herramienta de desarrollo)

Ruta: **`/dev/masterplan-editor`** — bloqueada en producción (solo se habilita si
`NEXT_PUBLIC_ENABLE_DEV_TOOLS=true`).

1. Carga el plano (URL de una imagen en `/public`) y ajusta el `viewBox` (ancho/alto).
2. Escribe el código de la unidad y elige un estado de previsualización.
3. Haz clic sobre el plano para dibujar el polígono (mínimo 3 puntos).
4. "Guardar unidad" para empezar otra; "Copiar snippet completo" para pegar en `data/units.ts`.

Detalle paso a paso en [`MASTERPLAN_GUIDE.md`](./MASTERPLAN_GUIDE.md).

---

## Accesibilidad y rendimiento

- Cada unidad del masterplan es enfocable por teclado (Tab) y activable con Enter/Espacio.
- El estado **no depende solo del color**: hay etiquetas de texto, patrones y una alternativa en listado.
- Imágenes en **WebP**, `next/image` con lazy loading y skeletons.
- El mapa se carga de forma diferida (solo cliente) y no bloquea la página.
- Se respeta `prefers-reduced-motion`.

## Notas de contenido

- IMANA se muestra con datos **preliminares** (provienen de un mockup, no de documento oficial).
- Las coordenadas marcadas `approximate` son a nivel de localidad.
- Revisa `CONTENT_TODO.md` antes de publicar precios o disponibilidad como definitivos.
