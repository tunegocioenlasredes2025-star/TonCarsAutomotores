# Tipografía

El sitio usa dos familias, ambas cargadas desde Google Fonts:

| Uso | Familia | Pesos |
|---|---|---|
| Títulos, botones, datos | **Sora** | 400, 600, 700, 800 |
| Texto corrido | **Manrope** | 400, 500, 600, 700 |

Se cargan en `tools/plantilla.mjs` (función `cabezaHtml`) con `preconnect` a
`fonts.googleapis.com` y `fonts.gstatic.com`, y `display=swap` para que el texto
sea visible mientras la fuente descarga.

## Si en algún momento hay que autoalojarlas

Esta carpeta está reservada para eso. Conviene hacerlo si el hosting queda
detrás de un firewall que bloquea Google, o si se quiere evitar la petición
externa por rendimiento o privacidad.

1. Descargar los `.woff2` de [Sora](https://fonts.google.com/specimen/Sora) y
   [Manrope](https://fonts.google.com/specimen/Manrope) y dejarlos en esta
   carpeta.
2. Crear `fonts/fuentes.css` con las reglas `@font-face` (una por peso, con
   `font-display: swap`).
3. En `tools/plantilla.mjs`, reemplazar el `<link>` de Google Fonts y los dos
   `preconnect` por:
   ```html
   <link rel="preload" as="font" type="font/woff2" href="${r}fonts/sora-700.woff2" crossorigin>
   <link rel="stylesheet" href="${r}fonts/fuentes.css">
   ```
4. Reconstruir: `node tools/construir.mjs && node tools/generar-vehiculos.mjs`

No hace falta tocar `css/styles.css`: los nombres de familia (`'Sora'`,
`'Manrope'`) son los mismos.
