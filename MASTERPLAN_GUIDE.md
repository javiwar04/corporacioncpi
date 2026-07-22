# MASTERPLAN_GUIDE.md — Guía del masterplan interactivo

Guía paso a paso para preparar un plano, convertirlo en un masterplan interactivo y mantener la
disponibilidad de sus unidades. Aplica al **Nivel 2** (masterplan por proyecto).

El sistema soporta dos técnicas, combinables:
- **Polígonos SVG sobre un fondo esquemático** (como IMANA hoy).
- **Polígonos transparentes sobre una imagen aérea/plano** (`aerialImage` + polígonos).

---

## 1. Preparar un plano

Fuentes válidas: plano de lotificación, masterplan del arquitecto o fotografía aérea nítida.

- Usa la mayor resolución disponible. **No uses capturas borrosas.**
- Recorta márgenes y textos innecesarios.
- Idealmente una vista **cenital** (desde arriba) para que los polígonos coincidan con la realidad.
- Conserva una referencia al documento original (anótalo en `sourceDocuments` del proyecto).

## 2. Convertirlo en imagen optimizada (WebP)

Coloca el archivo en `public/projects/<slug>/`. Optimiza a WebP (ejemplo con `sharp`):

```bash
# instalar sharp de forma puntual
npm i -D sharp
node -e "require('sharp')('plano.png').resize({width:1800,withoutEnlargement:true}).webp({quality:85}).toFile('public/projects/<slug>/masterplan.webp')"
```

Referencia la imagen en el proyecto:

```ts
aerialImage: "/projects/<slug>/masterplan.webp",
```

> Para PDFs: primero rasteriza la página del plano a PNG (p. ej. con `pdf-to-img`) y luego a WebP.
> Ver el script usado en este repo en el historial (`scratchpad/render.mjs`).

## 3. Definir las dimensiones (viewBox)

Elige un sistema de coordenadas para el SVG. Recomendado: usar el **ancho/alto en píxeles del plano**
o una proporción equivalente.

```ts
masterplanWidth: 1000,   // ancho del viewBox
masterplanHeight: 640,   // alto del viewBox
hasInteractiveMasterplan: true,
```

Todos los `polygonPoints` y `position` de las unidades se expresan en **estas** coordenadas
(`0,0` = esquina superior izquierda).

## 4. Dibujar las zonas interactivas

Usa la herramienta interna **`/dev/masterplan-editor`**:

1. Pega la URL del plano (ej. `/projects/<slug>/masterplan.webp`).
2. Ajusta `viewBox ancho/alto` a los mismos valores que pusiste en el proyecto.
3. Escribe el **código oficial** de la unidad (ej. `Casa 01`, `Lote 15`, `Bodega 4`).
4. Elige el estado para previsualizar el color.
5. Haz clic sobre el plano siguiendo el contorno del lote (mínimo 3 puntos; sigue el borde real).
6. "Guardar unidad" y repite con la siguiente.
7. "Copiar snippet completo" y pégalo en `data/units.ts` (o en el array `units` del proyecto).

Cada unidad generada se ve así:

```ts
{
  code: "Casa 01",
  status: "available",
  polygonPoints: "120,60 240,60 240,270 120,270",
  position: { x: 180, y: 165 },
},
```

> **No alteres la geometría del plano ni inventes lotes** que no existan en el documento.
> Usa siempre la nomenclatura oficial de los códigos.

### Alternativa manual
También puedes escribir `polygonPoints` a mano (`"x1,y1 x2,y2 x3,y3 …"`) o usar `svgPath`
(atributo `d` de un `<path>`) para formas curvas. `position` es el centro donde va la etiqueta.

## 5. Relacionar un polígono con una vivienda

Completa el resto de campos de la unidad (`PropertyUnit`) para que la ficha muestre toda la
información: `lotArea`, `constructionArea`, `bedrooms`, `bathrooms`, `price`, `coverImage`,
`floorPlans`, etc. Deja vacío lo que no esté confirmado.

Asegúrate de que:
- `projectId` coincide con el proyecto correcto (no mezclar unidades de proyectos distintos).
- `code` es **único** dentro del proyecto.

## 6. Probar los estados

Cambia `status` y verifica en `/proyectos/<slug>` que:
- El color y el patrón cambian en el masterplan.
- La leyenda sigue siendo clara.
- Los contadores se actualizan solos (total, disponibles, %).
- Los filtros ("Ver solo disponibles", estado, área, precio) responden.
- El hover (desktop) y el tap (móvil) abren la ficha.

Estados disponibles: `available`, `reserved`, `sold`, `coming-soon`, `unavailable`.

## 7. Actualizar la disponibilidad

Cuando una unidad se reserve o venda, solo cambia su `status` en `data/`. El cambio se propaga
automáticamente a: masterplan, listado, contadores, filtros, página individual y metadatos.

## 8. Agregar un nuevo proyecto con masterplan

1. Crea el `Project` en `data/projects.ts` con `hasInteractiveMasterplan: true` y el `viewBox`.
2. Prepara y optimiza el plano (pasos 1–3).
3. Dibuja las unidades con el editor (paso 4) y pégalas en `data/`.
4. Completa los datos de cada unidad y sus imágenes.
5. Añade `coordinates` para que aparezca también en el mapa geográfico.
6. Prueba estados, filtros y búsqueda (paso 6).

---

## Consejos de calidad (para que se sienta premium)

- Mantén los polígonos ajustados al borde real del lote; evita solapes.
- Usa la misma escala para todas las unidades de un proyecto.
- Si el plano es una foto aérea, verifica que los polígonos coincidan con la posición real.
- Superpón `masterplanFeatures` (calles, áreas verdes, accesos) para dar contexto.
- Optimiza siempre a WebP/AVIF; conserva el original si necesitas re-escalar.

## Checklist de validación

- [ ] Cada unidad tiene un `code` único y su `projectId` correcto.
- [ ] Los estados se ven correctamente y con leyenda.
- [ ] Contadores automáticos correctos.
- [ ] Filtros y búsqueda por código funcionan.
- [ ] Listado y masterplan están sincronizados.
- [ ] El botón de WhatsApp incluye el código de la unidad correcta.
- [ ] El plano se ve nítido y sin desplazamiento horizontal en móvil.
- [ ] Navegación por teclado operativa.
- [ ] Sin precios inventados ni unidades ficticias.

---

## Maqueta 3D (vista opcional)

Cuando un proyecto define `masterplanImage` (p. ej. IMANA con su plano oficial), el masterplan
muestra un botón **Plano 2D / Maqueta 3D**. La maqueta 3D:

- Usa `three.js` + `@react-three/fiber` (carga diferida, solo en cliente).
- **Reutiliza los mismos polígonos** de las unidades: cada bodega/lote se extruye como un volumen 3D
  sobre el plano (que actúa de terreno), coloreado por su estado.
- Es interactiva: rotar (arrastrar), zoom (rueda) y **clic en una unidad abre su ficha**, igual que en 2D.

Para habilitarla en otro proyecto: define `masterplanImage`, `masterplanWidth`, `masterplanHeight` y
los `polygonPoints` de cada unidad (como en el 2D). La altura del volumen se deriva de
`constructionArea`. No requiere modelos 3D externos: la geometría se genera de los polígonos.
