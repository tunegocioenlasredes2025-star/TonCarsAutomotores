/* ==========================================================================
   TON CARS — Piezas compartidas de las páginas (cabecera, pie, iconos, SEO).
   Lo usan tanto tools/construir.mjs como tools/generar-vehiculos.mjs.

   El resultado son archivos .html estáticos y autónomos: el sitio no necesita
   Node para funcionar, sólo para regenerarse cuando cambia el contenido.
   ========================================================================== */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..');

export const SITIO = 'https://toncars.com.ar';

/* ------------------------------------------------------- Versionado de assets
   Le pegamos a cada CSS/JS un ?v= con el hash de su contenido.

   Sin esto, al publicar una corrección el navegador (y el CDN) siguen sirviendo
   el archivo viejo hasta que vence la caché, y los cambios "no aparecen" aunque
   el deploy haya salido bien. Con el hash, cualquier cambio genera una URL
   nueva y se ve al instante; si no cambió nada, la URL es la misma y se
   aprovecha la caché igual.
   -------------------------------------------------------------------------- */
const versiones = new Map();

export function v(ruta) {
  if (!versiones.has(ruta)) {
    try {
      const hash = createHash('sha1')
        .update(readFileSync(join(DIR, ruta)))
        .digest('hex')
        .slice(0, 8);
      versiones.set(ruta, `?v=${hash}`);
    } catch {
      versiones.set(ruta, ''); // si el archivo no está todavía, seguimos igual
    }
  }
  return versiones.get(ruta);
}

/* --------------------------------------------------------------- Hero
   Media de la portada.

   `imagen`  se ve siempre; en celular es lo único que se muestra.
   `video`   se superpone SÓLO en escritorio (>=900px) y aparece con un fundido
             cuando termina de cargar. Poné null mientras no exista el archivo:
             así no se emite la etiqueta y no se pide un recurso que no está.

   Para activar el video: dejá el archivo en img/marca/ y escribí acá el nombre,
   por ejemplo  video: 'img/marca/hero.mp4'.  Después: node tools/construir.mjs
   -------------------------------------------------------------------- */
export const HERO = {
  imagen: 'img/marca/hero.jpg',
  imagenWebp: 'img/marca/hero.webp',
  video: 'img/marca/hero.mp4',
  alt: 'Camino de montaña saliendo de un túnel, con el lago y la cordillera de fondo',
};

export const NEGOCIO = {
  nombre: 'Ton Cars Automotores',
  slogan: 'Confianza que te mueve',
  telefono: '5491134253399',
  telefonoVisible: '11 3425-3399',
  instagram: 'https://www.instagram.com/toncarsdetails',
  instagramUsuario: '@toncarsdetails',
  calle: 'Colectora Este 215, Ramal Escobar',
  localidad: 'Ingeniero Maschwitz',
  partido: 'Escobar',
  provincia: 'Buenos Aires',
};

/* ------------------------------------------------------------------ Iconos */
export const ICO = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.82 2.41 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.21.89 2.39 1.01 2.55.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-7 7 7-7 7"/></svg>',
  tilde: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12.5 5 5L20 6.5"/></svg>',
  lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>',
  cruz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>',
  tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z"/></svg>',
  escudo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6.2v5.4c0 4.7 3.3 8.5 8 9.4 4.7-.9 8-4.7 8-9.4V6.2Z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>',
  billetera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M12 12v4M10 14h4"/></svg>',
  personas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 20h-2a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z"/><circle cx="9" cy="8" r="4"/><path d="M3 20a6 6 0 0 1 8-5.7"/></svg>',
  auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 17 4 13.5V9l2-4h12l2 4v4.5L17.5 17"/><circle cx="7.5" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/><path d="M4 10h16"/></svg>',
  llave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="4.5"/><path d="m11.5 11.5 8 8M17 17l2-2M14.5 14.5l2-2"/></svg>',
  papeles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  cambio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
  brillo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.1 5.4L19.5 10l-5.4 2.1L12 17.5l-2.1-5.4L4.5 10l5.4-1.6Z"/><path d="M18.5 16.5 19.5 19l2.5 1-2.5 1-1 2.5-1-2.5L15 20l2.5-1Z"/></svg>',
  calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>',
};

/* ---------------------------------------------------------------- Utilidad */

/**
 * Arma un enlace interno apuntando al archivo, no a la carpeta.
 *
 * `href="catalogo/"` sólo funciona detrás de un servidor web, que resuelve el
 * índice del directorio. Si alguien abre el sitio con doble clic (file://) la
 * navegación se rompe entera. Apuntando a `catalogo/index.html` funciona en los
 * dos casos, y la etiqueta canónica sigue declarando la URL limpia.
 *
 * @param {string} raiz  "" en la home, "../" en subcarpetas
 * @param {string} ruta  "" para la home, "catalogo/" para una sección
 */
export const L = (raiz, ruta = '') => `${raiz}${ruta}index.html`;

export const escapar = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ----------------------------------------------------------------- <head> */
/**
 * @param {object} o
 * @param {string} o.titulo        <title> y og:title
 * @param {string} o.descripcion   meta description
 * @param {string} o.ruta          ruta canónica desde la raíz, ej. "catalogo/"
 * @param {string} o.raiz          "" en la home, "../" en subcarpetas
 * @param {string[]} [o.schema]    bloques JSON-LD ya serializados
 * @param {string} [o.imagen]      ruta de la imagen OG desde la raíz
 * @param {string[]} [o.preload]   rutas a precargar como imagen
 */
export function cabezaHtml(o) {
  const r = o.raiz;
  const canonica = `${SITIO}/${o.ruta}`;
  const imagen = `${SITIO}/${o.imagen || 'img/marca/og.jpg'}`;

  const preloads = (o.preload || [])
    .map((p) => `<link rel="preload" as="image" href="${r}${p}${v(p)}" fetchpriority="high">`)
    .join('\n');

  const schema = (o.schema || []).map((s) => `<script type="application/ld+json">\n${s}\n</script>`).join('\n');

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(o.titulo)}</title>
<meta name="description" content="${escapar(o.descripcion)}">
<link rel="canonical" href="${canonica}">
<meta name="theme-color" content="#080b12">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="${NEGOCIO.nombre}">
<meta name="geo.region" content="AR-B">
<meta name="geo.placename" content="${NEGOCIO.localidad}, ${NEGOCIO.partido}, ${NEGOCIO.provincia}">

<meta property="og:type" content="${o.tipoOg || 'website'}">
<meta property="og:site_name" content="${NEGOCIO.nombre}">
<meta property="og:locale" content="es_AR">
<meta property="og:url" content="${canonica}">
<meta property="og:title" content="${escapar(o.titulo)}">
<meta property="og:description" content="${escapar(o.descripcion)}">
<meta property="og:image" content="${imagen}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapar(o.titulo)}">
<meta name="twitter:description" content="${escapar(o.descripcion)}">
<meta name="twitter:image" content="${imagen}">

<link rel="icon" href="${r}favicon/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="${r}favicon/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="${r}favicon/apple-touch-icon.png">
<link rel="manifest" href="${r}site.webmanifest">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${preloads}
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}css/styles.css${v('css/styles.css')}">
<script>document.documentElement.classList.add('js')</script>
${schema}`;
}

/* ------------------------------------------------------------- Navegación */
const ENLACES = [
  ['', 'Inicio'],
  ['catalogo/', 'Catálogo'],
  ['nosotros/', 'Nosotros'],
  ['servicios/', 'Servicios'],
  ['financiacion/', 'Financiación'],
  ['contacto/', 'Contacto'],
];

/** @param {string} raiz @param {string} activa ruta de la página actual */
export function encabezadoHtml(raiz, activa) {
  const nav = ENLACES.map(
    ([ruta, texto]) =>
      `      <a class="nav__enlace" href="${L(raiz, ruta)}"${ruta === activa ? ' aria-current="page"' : ''}>${texto}</a>`
  ).join('\n');

  const navMovil = ENLACES.map(
    ([ruta, texto]) => `  <a href="${L(raiz, ruta)}">${texto}</a>`
  ).join('\n');

  return `<a class="saltar" href="#principal">Saltar al contenido</a>

<header class="encabezado">
  <div class="encabezado__interno">
    <a class="marca" href="${L(raiz)}" aria-label="${NEGOCIO.nombre}, inicio">
      <img src="${raiz}img/marca/logo-nav.webp" alt="${NEGOCIO.nombre}" width="360" height="269">
    </a>

    <nav class="nav" aria-label="Navegación principal">
${nav}
    </nav>

    <div class="encabezado__acciones">
      <a class="btn btn--rojo btn--chico" data-wa href="#" target="_blank" rel="noopener">
        ${ICO.wa} Escribinos
      </a>
      <button class="hamburguesa" type="button" aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<div class="menu-movil" id="menu-movil">
${navMovil}
  <div class="menu-movil__acciones">
    <a class="btn btn--rojo btn--bloque" href="${L(raiz, 'catalogo/')}">Ver vehículos</a>
    <a class="btn btn--wa btn--bloque" data-wa href="#" target="_blank" rel="noopener">Consultar por WhatsApp</a>
  </div>
</div>`;
}

/* -------------------------------------------------------------------- Pie */
export function pieHtml(raiz) {
  return `<footer class="pie">
  <div class="contenedor">
    <div class="pie__grilla">
      <div class="pie__marca">
        <img src="${raiz}img/marca/logo-nav.webp" alt="${NEGOCIO.nombre}" width="360" height="269" loading="lazy">
        <p>
          Agencia multimarca atendida por sus dueños en ${NEGOCIO.localidad}.
          Compra, venta, permuta y consignación de autos y motos.
        </p>
        <div class="redes">
          <a class="red" href="${NEGOCIO.instagram}" target="_blank" rel="noopener" aria-label="Instagram de Ton Cars">${ICO.ig}</a>
          <a class="red" data-wa href="#" target="_blank" rel="noopener" aria-label="WhatsApp de Ton Cars">${ICO.wa}</a>
        </div>
      </div>

      <div>
        <h4>Navegación</h4>
        <nav class="pie__lista" aria-label="Enlaces del pie">
${ENLACES.map(([r, t]) => `          <a href="${L(raiz, r)}">${t}</a>`).join('\n')}
        </nav>
      </div>

      <div>
        <h4>Servicios</h4>
        <div class="pie__lista">
          <a href="${L(raiz, 'servicios/')}">Venta de usados</a>
          <a href="${L(raiz, 'servicios/')}">Compra de tu vehículo</a>
          <a href="${L(raiz, 'servicios/')}">Permutas</a>
          <a href="${L(raiz, 'servicios/')}">Consignación</a>
          <a href="${L(raiz, 'financiacion/')}">Financiación</a>
        </div>
      </div>

      <div>
        <h4>Contacto</h4>
        <div class="pie__lista">
          <a data-wa href="#" target="_blank" rel="noopener">WhatsApp ${NEGOCIO.telefonoVisible}</a>
          <a href="${NEGOCIO.instagram}" target="_blank" rel="noopener">${NEGOCIO.instagramUsuario}</a>
          <span>${NEGOCIO.calle}</span>
          <span>${NEGOCIO.localidad}, ${NEGOCIO.partido}</span>
          <span>Lunes a viernes de 9 a 18 h</span>
          <span>Sábados de 10 a 14 h</span>
        </div>
      </div>
    </div>

    <div class="pie__base">
      <p>© <span data-anio>2026</span> ${NEGOCIO.nombre}. Todos los derechos reservados.</p>
      <p>Sitio desarrollado por <a href="https://www.instagram.com/tunegocioenlasredes" target="_blank" rel="noopener">Tu Negocio En Las Redes</a></p>
    </div>
  </div>
</footer>

<a class="wa-flotante" data-wa href="#" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp">
  ${ICO.wa}
  <span>Consultar</span>
</a>`;
}

/* ------------------------------------------------------------ Página completa */
/**
 * @param {object} o  opciones de cabezaHtml, más:
 * @param {string} o.contenido   HTML del <main>
 * @param {string[]} [o.scripts] scripts extra además de vehiculos.js y main.js
 * @param {string} [o.bodyAttrs] atributos extra para <body>
 */
export function paginaHtml(o) {
  const r = o.raiz;
  const extra = (o.scripts || [])
    .map((s) => `<script src="${r}js/${s}${v('js/' + s)}"></script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
${cabezaHtml(o)}
</head>

<body data-raiz="${r}"${o.bodyAttrs || ''}>
${o.cortina ? cortinaHtml(r) + '\n' : ''}${encabezadoHtml(r, o.ruta)}

<main id="principal">
${o.contenido}
</main>

${pieHtml(r)}

<script src="${r}js/vehiculos.js${v('js/vehiculos.js')}"></script>
<script src="${r}js/main.js${v('js/main.js')}"></script>
${extra}
</body>
</html>
`;
}

/* ------------------------------------------- Bloques reutilizables de contenido */
export function franjaCta({
  eyebrow = 'Personas reales, entregas reales',
  titulo = 'Contanos qué estás buscando',
  texto = 'Cada entrega empieza con una conversación clara. Escribinos y te respondemos con las unidades que entran en lo que necesitás.',
  raiz = '',
} = {}) {
  return `<section class="seccion seccion--compacta">
  <div class="contenedor">
    <div class="franja revelar">
      <p class="eyebrow eyebrow--centro">${eyebrow}</p>
      <h2>${titulo}</h2>
      <p class="plomo">${texto}</p>
      <div class="acciones acciones--apilada mt-s">
        <a class="btn btn--wa btn--grande" data-wa href="#" target="_blank" rel="noopener">
          ${ICO.wa} Escribinos por WhatsApp
        </a>
        <a class="btn btn--fantasma btn--grande" href="${L(raiz, 'catalogo/')}">Ver vehículos</a>
      </div>
    </div>
  </div>
</section>`;
}

/**
 * Capa de media del hero de portada.
 * Devuelve '' si no hay imagen configurada, así el hero cae al degradado.
 */
export function heroMediaHtml() {
  if (!HERO.imagen) return '';

  const fuentes = HERO.imagenWebp
    ? `<source srcset="${HERO.imagenWebp}${v(HERO.imagenWebp)}" type="image/webp">`
    : '';

  const video = HERO.video
    ? `
    <video class="hero__video" src="${HERO.video}${v(HERO.video)}" muted loop playsinline preload="none"
           aria-hidden="true" tabindex="-1"></video>`
    : '';

  return `<div class="hero__media" aria-hidden="true">
    <picture>
      ${fuentes}
      <img class="hero__imagen" src="${HERO.imagen}${v(HERO.imagen)}" alt="" width="1600" height="1000"
           fetchpriority="high" decoding="async">
    </picture>${video}
  </div>
  <div class="hero__velo" aria-hidden="true"></div>
  <div class="hero__grano" aria-hidden="true"></div>`;
}

/** Cortina de carga. El JS la activa; el CSS garantiza que se vaya igual. */
export function cortinaHtml(raiz) {
  return `<div class="cortina" id="cortina" aria-hidden="true">
  <img class="cortina__logo" src="${raiz}img/marca/logo.webp" alt="" width="900" height="672">
  <div class="cortina__barra"></div>
</div>`;
}

/** Encabezado corto para las páginas internas. */
export function heroInterno({ eyebrow, titulo, texto, migas = '' }) {
  return `<section class="hero">
  <div class="hero__fondo" aria-hidden="true"></div>
  <div class="hero__rejilla" aria-hidden="true"></div>
  <div class="contenedor">
    ${migas}
    <div class="cabecera-seccion revelar" style="margin-bottom:0">
      <p class="eyebrow">${eyebrow}</p>
      <h1>${titulo}</h1>
      <p class="plomo">${texto}</p>
    </div>
  </div>
</section>`;
}
