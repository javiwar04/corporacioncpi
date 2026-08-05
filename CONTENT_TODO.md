# CONTENT_TODO.md — Información pendiente de verificar

> Registro de datos **incompletos, contradictorios o no confirmados** encontrados en los documentos.
> Regla: nada de esto se publica como dato afirmado. En el código se usa `undefined` / placeholder
> (`TODO:` en `data/`) hasta que Corporación CPI lo confirme.

Leyenda de severidad: 🔴 bloquea publicación fiable · 🟡 conviene aclarar · 🟢 menor.

---

## Corporación CPI (marca / global)
- 🟡 **Correo electrónico oficial.** No aparece en los documentos. Placeholder `TODO` en `data/site.ts`. Fuente: sitio actual no expone email en texto plano. → Confirmar dirección de correo.
- 🟢 **Colores corporativos exactos.** Derivados por muestreo del sitio actual (`#08053E`, `#007BFF`, `#FFA500`). → Confirmar códigos oficiales de marca (manual de identidad).
- 🟢 **Cifras institucionales.** «+10 años», «+55 colaboradores», «+30 proyectos» provienen de los brochures 2025/2026. → Confirmar vigencia.

## Antigua Gardens  · fuente: `antigua gardens - cpi 2026.pdf`
- 🔴 **Coordenadas GPS.** No especificadas. Se usa una coordenada **aproximada** sobre la R-14 cerca de Ciudad Vieja. → Confirmar ubicación exacta del condominio.
- 🟡 **Número real de habitaciones.** El PDF dice «3 habitaciones» pero describe además una «habitación de visitas / estudio». → ¿3 o 4 dormitorios? Se publica 3 (dato textual) con nota.
- 🟡 **Nomenclatura / cantidad de unidades.** El PDF describe «Antigua Gardens 2»; el inventario interno lista «AG 1 Antigua Gardens» y «Antigua Gardens 2». → Confirmar cuántas casas/modelos hay y sus códigos oficiales, precios y disponibilidad de cada una.
- 🟡 **Baños.** No se indica el número de baños del modelo. Campo dejado vacío.
- 🟢 **Estacionamientos.** No se menciona explícitamente. Campo vacío.

## Portal de Antigua  · fuente: `casa portal de antigua - presentacion CPI - Julio - Agosto 26.pdf`
> ⚠️ **La casa del brochure 2025 (`Portal de Antigua CPI 2025.pdf`, 4 hab / 5 baños / 250 m² / $500,000)
> ya se vendió.** La ficha publica ahora la **casa remodelada** de la presentación Julio–Agosto 2026
> (4 dormitorios / 3.5 baños / 220 m²). La casa vendida **no se eliminó**: pasó al portafolio de
> obra ejecutada como `casa-portal-de-antigua` (`data/executed.ts`), con sus fotos y planos en
> `public/ejecutados/casa-portal-de-antigua/`.

- 🔴 **Precio.** La presentación Julio–Agosto 2026 **no incluye precio**. La ficha muestra «Precio bajo consulta». → Enviar precio (y si incluye impuestos / vigencia).
- 🔴 **Coordenadas GPS.** No especificadas. Aproximada (Antigua Guatemala, acceso calle Chipilapa). → Confirmar.
- 🟡 **Código de unidad.** La presentación no trae código. Se usó `PA-02` para distinguirla de la casa vendida (`PA-01`). → Confirmar nomenclatura oficial.
- 🟡 **Área de terreno.** No se declara. El plano indica 7.50 m de frente; el fondo no se lee con certeza. Campo vacío. → Confirmar m² de terreno.
- 🟡 **Estacionamientos.** El plano muestra garaje, sin número de plazas declarado. Campo vacío.
- 🟡 **Distancia al casco.** La presentación dice «≈5 minutos del casco» (pág. 4) y «11 min en vehículo al parque central» (pág. 2). → Confirmar cuál usar.
- 🟡 **Disponibilidad / n.º de unidades.** El inventario lista «Portal de antigua» y «Portal de Antigua 2». → Confirmar cuántas casas hay y el estado de cada una (disponible/reservada/vendida).
- 🟡 **Foto exterior de la casa.** Las únicas tomas exteriores de la presentación son de la calle del condominio (747×520 px, baja resolución). → Enviar fotos de fachada de la casa en alta resolución.

## Refugio de la Condesa · fuente: `Casa Refugio de la Condesa ... 2026.pdf`
- 🔴 **Coordenadas GPS.** No especificadas. Aproximada (Antigua Guatemala, ingreso calle Tetuán). → Confirmar.
- 🟡 **Inconsistencia de áreas.** Primer nivel 145 m² + mezzanine 93 m² = 238 m², pero total declarado = 233 m². → Confirmar desglose correcto. Se publica el total 233 m² con nota.
- 🟢 **Vigencia del precio.** $575,000 con impuestos, vigencia declarada «Julio/Agosto 2026». → Actualizar tras ese periodo.
- 🟢 **Estacionamientos.** No se menciona. Campo vacío.

## IMANA — Complejo de bodegas · fuente: imana.gt (sitio oficial) ✅ ACTUALIZADO
- 🟢 **Datos reales.** Toda la información proviene ahora del sitio oficial **imana.gt**: bodegas de
  500 a 2,000 m² (módulos combinables), desde **$675/m²**, especificaciones técnicas reales,
  ubicación (5 min del Aeropuerto Mundo Maya, sobre CA-13) y amenidades del complejo. Se quitó la
  marca `preliminary`.
- 🟢 **Masterplan sobre plano oficial.** La capa interactiva de las 12 bodegas se dibuja sobre el
  **plano oficial** (`PLANO-IMANA_v2` → `public/imana/plano.webp`). Disponibilidad tomada del plano:
  **vendidas 1, 2, 10, 11, 12** · **disponibles 3–9**.
- 🟡 **Área por bodega (REFERENCIAL).** El plano no detalla m² legibles por bodega. Para habilitar el
  filtro de tamaño se asignaron **áreas referenciales** dentro del rango real (500–2,000 m²) en
  `data/units.ts` (`seeds[].area`): B1/B2 650, B3/B4/B5/B9/B10/B11/B12 1200, B6/B7 520, B8 980.
  → **Reemplazar por las medidas reales** de cada bodega cuando CPI las proporcione.
- 🟡 **«57% vendido».** imana.gt indica 57% vendido (probablemente por m²); el plano marca 5/12
  bodegas vendidas. Se usó el plano como fuente de estado por unidad. → Confirmar el % vigente.
- 🟡 **Precio por bodega / modalidad.** Desde julio 2026 se promociona por **renta a $5.50/m²**
  (antes se mostraba «Desde $675/m²» de venta). Falta confirmar si el período es mensual y si
  el precio de venta se sigue manejando bajo consulta. No hay precio cerrado por bodega
  ni si es venta/renta. Botón «Solicitar por WhatsApp». → Confirmar.
- 🔴 **Coordenadas GPS.** «Santa Elena, Petén» sin coordenada exacta. Aproximada. → Confirmar.
- 🟢 **Contacto IMANA.** Tel propio del proyecto: (+502) 4512-2900 (distinto del general de CPI).

## Inventario interno «Portales» · fuente: `Portales.jpeg`, `Portales2.jpeg`, `Portales3.jpeg`
- 🟢 **Resuelto.** Corresponde al portafolio de **proyectos ejecutados** (ver `ejecutados.php`). Ya integrado en `/proyectos-ejecutados` con nombre, ubicación y foto.

## Proyectos ejecutados · fuente: `corporacioncpi.com/ejecutados.php`
- 🟢 **Descripciones normalizadas.** El sitio original repite un mismo texto en varias casas del Casco del Cerro con números de casa erróneos (p. ej. la ficha de «No. 58» menciona «No. 62»). Se usó una descripción genérica fiel para evitar propagar el error. → Si CPI tiene la descripción correcta de cada casa, reemplazar en `data/executed.ts`.
- 🟡 **Fotos.** Se reutilizaron las imágenes del sitio actual (`assets/proyectos_ejecutados`, `assets/mas_proyectos`). Algunas son capturas de pantalla de baja resolución. → Si tienes fotos en mejor calidad, envíamelas y las reemplazo (mismo nombre de archivo en `public/ejecutados/`).
- 🟡 **«La Serenísima No. 17»** aparece dos veces (galería principal + «Más proyectos») tal como en el sitio original. Confirmar si es correcto o si una debería ser otra unidad.

---

## Planos interactivos (ambientes seleccionables)
- 🟢 **Los tres residenciales ya tienen plano interactivo en ambos niveles:** Portal de Antigua
  (Primer/Segundo nivel), Refugio de la Condesa (Planta baja/alta) y Antigua Gardens (Planta baja/alta).
  Cada ambiente (dormitorios, cocina, sala, comedor, baños, garaje, patio, pérgola…) se resalta al
  pasar el cursor y aparece en el listado lateral. Alineación verificada sobre cada plano.
- 🟡 **Polígonos trazados a ojo.** Las zonas se ubicaron visualmente sobre el plano; pueden requerir
  ajuste fino. Se refinan editando `interactiveFloorplan` en `data/projects.ts` (o con
  `/dev/masterplan-editor`).
- 🟡 **Áreas por ambiente.** No se leen con claridad en los planos (texto pequeño) → los ambientes
  no muestran m² individuales. Si CPI los tiene, se agregan al campo `area` de cada `FloorplanRoom`.

## Elementos de UI dependientes de datos por confirmar
- **Precios** solo se muestran cuando `price` está definido y `priceConfirmed !== false`. IMANA no muestra precio.
- **Contadores** (total/disponibles/…): se calculan automáticamente de las unidades; para IMANA se muestran con la etiqueta «preliminar».
- **Mapa geográfico:** las coordenadas marcadas `approximate: true` muestran una nota «ubicación aproximada» en el popup.
- **Botones de WhatsApp:** el mensaje incluye el código de unidad y el nombre del proyecto; no incluye precio.

## Mapa maestro (home) · coordenadas por condominio
- 🟡 **Coordenadas aproximadas por zona.** Los ejecutados se ubican en el mapa por condominio
  (Antigua Gardens, Casco del Cerro, Los Franciscanos, Paseo Antigua, La Serenísima, Refugio del
  Ángel, Hacienda del Comendador, Portales de Antigua) con coordenadas aproximadas en
  `data/mapPoints.ts` (`ZONE_COORDS`). Los hoteles se agrupan en Isla de Flores. → Confirmar
  coordenadas reales de cada condominio y del punto de hoteles si se desea mayor precisión.
