# Ton Cars Automotores — sitio web

Sitio multipágina para **Ton Cars Automotores**, agencia multimarca en Ingeniero
Maschwitz (Colectora Este 215, Ramal Escobar). HTML, CSS y JavaScript puros: no
usa frameworks, no necesita build para funcionar y se sube a cualquier hosting
estático (Vercel, Netlify, Hostinger, cPanel).

Objetivo del sitio: **generar consultas por WhatsApp**. No hay carrito ni checkout.

---

## 1. Lo primero que hay que hacer

Este sitio está listo para publicar, pero hay tres cosas que dependen del cliente:

| # | Pendiente | Dónde se resuelve |
|---|---|---|
| 1 | **Cargar el stock real** (modelos, años, km, precios) | `js/vehiculos.js` |
| 2 | **Subir las fotos reales** de cada unidad | `img/vehiculos/` |
| 3 | **Confirmar el dominio final** | ver punto 6 |

> **Importante sobre el catálogo actual.** El Instagram de Ton Cars no permite
> leer la ficha de cada unidad sin iniciar sesión, así que sólo se pudieron
> obtener dos fotos reales: el **Toyota Yaris** y la **Honda CB 125F**. Las otras
> seis unidades del catálogo son **ejemplos de carga**, con datos plausibles para
> una agencia multimarca del oeste/norte del GBA, y se muestran con una placa de
> marca que dice *"Fotos en preparación"* en lugar de una foto inventada.
> Antes de publicar hay que reemplazarlas por el stock real.

---

## 2. Estructura

```
Ton Car Automotores/
├── index.html                  Portada
├── catalogo/index.html         Catálogo con buscador y filtros
├── nosotros/index.html         Historia, cómo trabajamos, proceso de compra
├── servicios/index.html        Venta, compra, permuta, consignación, detailing
├── financiacion/index.html     Formas de pago y preguntas frecuentes
├── contacto/index.html         Formulario, datos, horarios y mapa
├── vehiculos/                  Una página por unidad (generadas)
│
├── css/styles.css              Sistema de diseño completo
├── js/
│   ├── vehiculos.js            ← BASE DE DATOS DEL CATÁLOGO
│   ├── main.js                 Header, menú, animaciones, tarjetas, formulario
│   ├── catalogo.js             Buscador, filtros y orden
│   └── detalle.js              Galería y vehículos relacionados
│
├── img/
│   ├── marca/                  Logo, foto del local, imagen para redes
│   ├── vehiculos/              Fotos de las unidades
│   └── placeholders/           Placas de marca para unidades sin foto
│
├── favicon/                    Íconos del navegador
├── fonts/                      Nota sobre la tipografía
├── seo/                        Documentación de SEO
├── tools/                      Scripts de generación (ver punto 4)
├── _originales/                Archivos crudos que entregó el cliente
│
├── robots.txt                  (generado)
├── sitemap.xml                 (generado)
├── site.webmanifest            (generado)
└── vercel.json                 Caché de estáticos y URLs limpias en Vercel
```

### Sobre los enlaces internos

Los links apuntan al archivo (`catalogo/index.html`), no a la carpeta
(`catalogo/`). Así el sitio se puede **abrir con doble clic en `index.html`**
y navegar entero sin levantar un servidor. Las etiquetas `canonical` siguen
declarando la URL limpia (`/catalogo/`), y `vercel.json` redirige
`/catalogo/index.html` → `/catalogo/` en producción, así que lo que se indexa
es la versión corta.

---

## 3. Cómo cargar o sacar un vehículo

**Todo el catálogo vive en un solo archivo: `js/vehiculos.js`.**

### Agregar una unidad

1. Copiá las fotos a `img/vehiculos/` (ver punto 5 para optimizarlas).
2. Abrí `js/vehiculos.js` y agregá un bloque al array `VEHICULOS`:

```js
{
  id: 'ford-ranger-xlt-2021',      // slug único, se usa como nombre de archivo
  marca: 'Ford',
  modelo: 'Ranger 3.2 XLT 4x4 AT',
  anio: 2021,
  km: 87000,                        // 0 si es 0 km
  combustible: 'Diésel',            // Nafta | Diésel | GNC | Híbrido | Eléctrico
  transmision: 'Automática',        // Manual | Automática | CVT
  tipo: 'pickup',                   // hatchback | sedan | suv | pickup | moto
  precio: 38500000,                 // null para mostrar "Consultar precio"
  moneda: 'ARS',                    // ARS | USD
  estado: 'usado',                  // usado | 0km
  destacado: true,                  // true = aparece en la portada
  disponible: true,                 // false = la saca del sitio sin borrar el dato
  etiquetas: ['4x4', 'Único dueño'],
  fotos: [
    'img/vehiculos/ford-ranger-01.webp',
    'img/vehiculos/ford-ranger-02.webp',
  ],
  descripcion: 'Dos o tres oraciones. También se usa como meta description.',
  equipamiento: ['Climatizador bizona', 'Cámara de retroceso'],
  fichaExtra: { Motor: '3.2 TDCi', Tracción: '4x4', Puertas: '4' },
},
```

3. Regenerá las páginas:

```bash
node tools/generar-vehiculos.mjs
```

Eso crea `vehiculos/ford-ranger-xlt-2021.html`, actualiza el `sitemap.xml` y
borra las páginas de las unidades que ya no estén en el array.

### Sacar una unidad vendida

Poné `disponible: false` (conserva el registro) o borrá el bloque entero.
Después corré `node tools/generar-vehiculos.mjs`.

### Notas

- Si `fotos` queda vacío, la unidad se muestra con la placa de marca y el
  cartel *"Fotos en preparación"*. Es intencional: nunca se muestra la foto de
  otro vehículo como si fuera esa unidad.
- `precio: null` muestra "Consultar precio". Las unidades sin precio no
  aparecen cuando el visitante filtra por rango de precio.
- El botón de WhatsApp de cada unidad abre el chat con el modelo ya escrito.

---

## 4. Scripts

Necesitan **Node.js 18 o superior** y se corren desde la raíz del proyecto.
El sitio publicado **no** los necesita: sólo generan archivos.

```bash
node tools/generar-vehiculos.mjs    # páginas de vehículos + sitemap + robots
node tools/construir.mjs            # páginas fijas + manifest
node tools/generar-placeholders.mjs # placas de "fotos en preparación"
python tools/preparar-imagenes.py   # logo, favicons y compresión de fotos
```

- **`tools/plantilla.mjs`** guarda el encabezado, el pie, los íconos y las metas
  compartidas. Si hay que cambiar un ítem del menú o un dato de contacto, se
  cambia acá y se corren `construir.mjs` y `generar-vehiculos.mjs`.
- **`tools/construir.mjs`** guarda además el texto de las páginas fijas.
  Los `.html` de esas páginas son generados: si los editás a mano, el próximo
  build pisa los cambios.
- **`tools/preparar-imagenes.py`** necesita `pip install pillow`.

---

## 5. Fotos de vehículos

Para que el sitio siga cargando rápido:

- **Formato:** WebP (con `.jpg` de respaldo si el hosting es viejo).
- **Ancho:** 1400 px. Más que eso no aporta y pesa de más.
- **Peso:** menos de 300 KB por foto.
- **Nombre:** `marca-modelo-01.webp`, en minúsculas y con guiones.
- **Orden:** la primera foto del array es la que se ve en el catálogo. Conviene
  que sea un 3/4 delantero del vehículo entero.

La forma más rápida de convertirlas es agregar la unidad a
`tools/preparar-imagenes.py` (función `foto()`) y correr el script.

---

## 6. Publicación

El sitio es estático: se sube la carpeta entera y funciona.

**Antes de publicar, reemplazar el dominio provisorio.** Todo el sitio usa
`https://toncars.com.ar` en las URLs canónicas, Open Graph, schema.org y
sitemap. Está definido en **un solo lugar**: la constante `SITIO` en
`tools/plantilla.mjs`. Cambiala y volvé a correr:

```bash
node tools/construir.mjs && node tools/generar-vehiculos.mjs
```

**Vercel:** arrastrar la carpeta, o conectar el repositorio. No hace falta
comando de build ni carpeta de salida: es un sitio estático plano.

No hace falta subir `_originales/` ni `tools/` — el `robots.txt` ya los excluye
de los buscadores, pero se pueden borrar del deploy sin romper nada.

---

## 7. SEO

Ya está resuelto:

- `<title>` y meta description propios en cada página, incluidas las de vehículos.
- Open Graph y Twitter Card con imagen 1200×630 (`img/marca/og.jpg`).
- Datos estructurados **schema.org**: `AutoDealer` con dirección y horarios en
  todas las páginas, `Car` / `Motorcycle` con precio, kilometraje y
  disponibilidad en cada unidad, y `BreadcrumbList` en las internas.
- `sitemap.xml` y `robots.txt` generados automáticamente.
- Favicons, `apple-touch-icon` y `site.webmanifest`.
- URLs limpias con carpetas (`/catalogo/`, `/nosotros/`).
- Un solo `<h1>` por página, imágenes con `alt` descriptivo y `loading="lazy"`.

**Pendiente del lado del cliente:**

1. Verificar el dominio en **Google Search Console** y enviar el sitemap.
2. Crear o reclamar la ficha de **Google Business Profile** y poner ahí la web.
3. Si se quiere medir tráfico, agregar Google Analytics 4 en `tools/plantilla.mjs`
   (dentro de `cabezaHtml`) y reconstruir.

---

## 8. Diseño

- **Tipografía:** Sora para títulos, Manrope para texto. Se cargan desde Google
  Fonts con `preconnect` y `display=swap`. Si en algún momento se quiere
  autoalojarlas, la carpeta `fonts/` está preparada.
- **Colores:** rojo `#dc0b08` (acción) y azul `#1342a4` (acento) sobre base
  oscura `#080b12`, tomados del logo.
- **Mobile first:** todo el CSS arranca en celular y escala hacia escritorio.
- Las animaciones respetan `prefers-reduced-motion`, y si el JavaScript no
  carga el contenido se ve igual (nada queda oculto esperando un observador).

---

## 9. Datos del negocio

| | |
|---|---|
| Nombre | Ton Cars Automotores |
| Rubro | Agencia multimarca — autos, utilitarios y motos |
| Dirección | Colectora Este 215, Ramal Escobar, Ingeniero Maschwitz, Escobar |
| WhatsApp | 11 3425-3399 |
| Instagram | [@toncarsdetails](https://www.instagram.com/toncarsdetails) |
| Horarios | Lunes a viernes 9 a 18 h · Sábados 10 a 14 h |
| Servicios | Venta, compra, permuta, consignación, financiación, detailing |

---

Desarrollado por **Tu Negocio En Las Redes**.
