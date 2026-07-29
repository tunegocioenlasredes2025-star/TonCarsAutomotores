# SEO — Ton Cars Automotores

Resumen de lo que ya está implementado y de lo que queda por hacer una vez que
el dominio esté activo.

## Palabras clave trabajadas

**Principales**

- automotora Ingeniero Maschwitz
- automotores Escobar
- autos usados Escobar
- autos seminuevos zona norte
- compra y venta de autos Maschwitz
- vehículos usados Ramal Escobar
- Ton Cars Automotores

**Secundarias (páginas internas)**

- financiación autos usados Escobar → `/financiacion/`
- permuta de autos zona norte → `/servicios/`
- consignación de vehículos Maschwitz → `/servicios/`
- motos usadas Escobar → `/catalogo/?tipo=moto`
- detailing autos Maschwitz → `/servicios/`

**De cola larga (una por unidad)**

Cada página de vehículo apunta a `marca + modelo + año + km`, por ejemplo
"Toyota Yaris XLS CVT 2019 usado Escobar". Es el tráfico más fácil de captar y
el que llega con más intención de compra.

## Implementado

| Elemento | Estado | Dónde |
|---|---|---|
| `<title>` único por página | Listo | `tools/plantilla.mjs` → `cabezaHtml` |
| Meta description única | Listo | idem |
| Canonical | Listo | idem |
| Open Graph + Twitter Card | Listo | idem |
| Imagen para redes 1200×630 | Listo | `img/marca/og.jpg` |
| schema.org `AutoDealer` | Listo | todas las páginas |
| schema.org `Car` / `Motorcycle` | Listo | páginas de vehículos |
| schema.org `BreadcrumbList` | Listo | páginas internas |
| schema.org `WebSite` + SearchAction | Listo | portada |
| `sitemap.xml` | Generado | `tools/generar-vehiculos.mjs` |
| `robots.txt` | Generado | idem |
| Favicons + webmanifest | Listo | `favicon/`, `site.webmanifest` |
| URLs limpias | Listo | estructura de carpetas |
| Un `<h1>` por página | Verificado | — |
| `alt` en todas las imágenes | Verificado | — |
| `loading="lazy"` bajo el pliegue | Listo | — |
| `geo.region` / `geo.placename` | Listo | `cabezaHtml` |

## Pendiente (requiere el dominio en producción)

1. **Cambiar el dominio.** La constante `SITIO` en `tools/plantilla.mjs` tiene
   `https://toncars.com.ar` como provisorio. Actualizarla y reconstruir:
   `node tools/construir.mjs && node tools/generar-vehiculos.mjs`
2. **Google Search Console:** verificar la propiedad y enviar
   `https://<dominio>/sitemap.xml`.
3. **Google Business Profile:** reclamar la ficha del local, cargar fotos reales
   del salón, los horarios y el enlace al sitio. Para un negocio local es la
   fuente de tráfico más importante después de Instagram.
4. **Google Analytics 4** (opcional): agregar el script en `cabezaHtml` dentro
   de `tools/plantilla.mjs` y reconstruir.
5. **Coordenadas exactas:** el mapa de `/contacto/` usa la dirección como
   búsqueda. Cuando esté la ficha de Google Business conviene reemplazar el
   `iframe` por el embed oficial del local, y agregar `geo` con latitud y
   longitud reales al schema `AutoDealer`.

## Mantenimiento

Cada vez que se carga o se saca una unidad de `js/vehiculos.js` hay que correr
`node tools/generar-vehiculos.mjs`. El script actualiza el sitemap con la fecha
del día y elimina las páginas de las unidades vendidas, así no quedan URLs
huérfanas indexadas.
