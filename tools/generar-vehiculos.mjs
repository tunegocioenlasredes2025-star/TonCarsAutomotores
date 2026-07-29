/* ==========================================================================
   TON CARS — Generador de las subpáginas de cada vehículo + sitemap.

   Lee js/vehiculos.js y escribe un archivo HTML estático por unidad en
   /vehiculos/, con su propia meta description, Open Graph y schema.org Vehicle.

   Uso:  node tools/generar-vehiculos.mjs

   Correlo cada vez que edites js/vehiculos.js: borra las páginas de unidades
   que ya no existen y regenera el sitemap.
   ========================================================================== */
import { writeFileSync, mkdirSync, readdirSync, rmSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { SITIO, NEGOCIO, ICO, paginaHtml, franjaCta, escapar } from './plantilla.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/* js/vehiculos.js exporta con module.exports cuando corre en Node. */
const {
  VEHICULOS,
  ETIQUETAS_TIPO,
  vehiculosPublicados,
  nombreVehiculo,
  fotoPrincipal,
  fotosVehiculo,
  formatearKm,
  formatearPrecio,
  enlaceWhatsapp,
} = require(join(RAIZ, 'js', 'vehiculos.js'));

const CATALOGO = vehiculosPublicados(VEHICULOS);

/* ------------------------------------------------------------------ Migas */
function migasHtml(v) {
  return `<nav class="migas" aria-label="Miga de pan">
      <a href="../index.html">Inicio</a><span aria-hidden="true">/</span>
      <a href="../catalogo/index.html">Catálogo</a><span aria-hidden="true">/</span>
      <a href="../catalogo/index.html?marca=${encodeURIComponent(v.marca)}">${v.marca}</a><span aria-hidden="true">/</span>
      <span aria-current="page">${escapar(v.modelo)}</span>
    </nav>`;
}

/* ---------------------------------------------------------------- Galería */
function galeriaHtml(v) {
  const fotos = fotosVehiculo(v);
  const nombre = nombreVehiculo(v);
  const varias = fotos.length > 1;

  const tiras = varias
    ? `<div class="galeria__tiras" id="galeria-tiras" role="group" aria-label="Miniaturas">
        ${fotos
          .map(
            (f, i) => `<button class="tira" type="button" aria-current="${i === 0}"
                 aria-label="Ver foto ${i + 1}"><img src="../${f}" alt="" loading="lazy" decoding="async"></button>`
          )
          .join('\n        ')}
      </div>`
    : '';

  const flechas = varias
    ? `<button class="galeria__nav galeria__nav--prev" type="button" aria-label="Foto anterior">${ICO.prev}</button>
        <button class="galeria__nav galeria__nav--next" type="button" aria-label="Foto siguiente">${ICO.next}</button>
        <p class="galeria__contador" id="galeria-contador" aria-live="polite"></p>`
    : '';

  return `<div class="galeria">
      <div class="galeria__principal">
        ${flechas}
        <img id="galeria-principal" src="../${fotos[0]}"
             alt="${escapar(nombre)}" width="1200" height="900"
             fetchpriority="high" decoding="async">
      </div>
      ${tiras}
    </div>`;
}

/* ----------------------------------------------------------- Ficha técnica */
function fichaHtml(v) {
  const base = {
    Marca: v.marca,
    Modelo: v.modelo,
    Año: v.anio,
    Kilometraje: formatearKm(v.km),
    Combustible: v.combustible,
    Transmisión: v.transmision,
    Tipo: ETIQUETAS_TIPO[v.tipo],
    Estado: v.estado === '0km' ? '0 km' : 'Usado',
    ...(v.fichaExtra || {}),
  };

  return `<dl class="ficha">
        ${Object.entries(base)
          .map(
            ([k, val]) => `<div class="ficha__item">
          <dt class="ficha__clave">${k}</dt>
          <dd class="ficha__valor">${escapar(val)}</dd>
        </div>`
          )
          .join('\n        ')}
      </dl>`;
}

/* ------------------------------------------------------------ Panel lateral */
function panelHtml(v) {
  const precio = formatearPrecio(v);
  const nombre = nombreVehiculo(v);

  return `<aside>
      <div class="panel-compra">
        <div class="panel-compra__precio precio${precio ? '' : ' precio--consultar'}">
          <span class="precio__valor">${precio || 'Precio a consultar'}</span>
          <span class="precio__nota">${
            precio ? (v.moneda === 'USD' ? 'Dólares estadounidenses' : 'Pesos argentinos') : 'Te lo pasamos por WhatsApp'
          }</span>
        </div>

        <a class="btn btn--wa btn--bloque btn--grande" href="${enlaceWhatsapp(v)}" target="_blank" rel="noopener">
          ${ICO.wa} Consultar este vehículo
        </a>

        <ul class="panel-compra__lista">
          <li>${ICO.tilde}<span>Aceptamos tu usado como parte de pago</span></li>
          <li>${ICO.tilde}<span>Financiación con anticipo, sujeta a evaluación</span></li>
          <li>${ICO.tilde}<span>Podés revisarla con tu mecánico antes de decidir</span></li>
          <li>${ICO.tilde}<span>Se entrega con detailing completo</span></li>
        </ul>

        <dl class="horarios">
          <div><dt>Lunes a viernes</dt><dd>9:00 a 18:00</dd></div>
          <div><dt>Sábados</dt><dd>10:00 a 14:00</dd></div>
        </dl>

        <p class="nota-form">
          ${NEGOCIO.calle}, ${NEGOCIO.localidad}. Coordinamos el horario de visita
          por WhatsApp para tener la unidad preparada cuando llegues.
        </p>
      </div>
    </aside>`;
}

/* ------------------------------------------------------------------ Schema */
function schemaVehiculo(v) {
  const nombre = nombreVehiculo(v);
  const datos = {
    '@context': 'https://schema.org',
    '@type': v.tipo === 'moto' ? 'Motorcycle' : 'Car',
    name: nombre,
    description: v.descripcion,
    brand: { '@type': 'Brand', name: v.marca },
    model: v.modelo,
    vehicleModelDate: String(v.anio),
    productionDate: String(v.anio),
    url: `${SITIO}/vehiculos/${v.id}.html`,
    image: `${SITIO}/${fotoPrincipal(v)}`,
    itemCondition:
      v.estado === '0km'
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
    fuelType: v.combustible,
    vehicleTransmission: v.transmision,
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.km, unitCode: 'KMT' },
    offers: {
      '@type': 'Offer',
      url: `${SITIO}/vehiculos/${v.id}.html`,
      availability: 'https://schema.org/InStock',
      priceCurrency: v.moneda,
      seller: { '@id': `${SITIO}/#negocio` },
      ...(v.precio != null ? { price: v.precio } : {}),
    },
  };

  return JSON.stringify(datos, null, 2);
}

function schemaMigasVehiculo(v) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        ['Inicio', ''],
        ['Catálogo', 'catalogo/'],
        [nombreVehiculo(v), `vehiculos/${v.id}.html`],
      ].map(([name, ruta], i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name,
        item: `${SITIO}/${ruta}`,
      })),
    },
    null,
    2
  );
}

/* ---------------------------------------------------------------- Página */
function paginaVehiculo(v) {
  const nombre = nombreVehiculo(v);
  const precio = formatearPrecio(v);
  const sinFotos = !(v.fotos && v.fotos.length);

  const contenido = `
<section class="seccion" style="padding-top:calc(var(--header-h) + 30px);padding-bottom:0">
  <div class="contenedor">
    ${migasHtml(v)}

    <div class="cabecera-seccion" style="max-width:none;margin-bottom:28px">
      <p class="eyebrow">${v.marca} · ${ETIQUETAS_TIPO[v.tipo]} · ${v.anio}</p>
      <h1 style="font-size:clamp(1.9rem,6vw,3.2rem)">${escapar(v.modelo)}</h1>
      <div class="etiquetas" style="position:static;margin-top:4px">
        ${v.estado === '0km' ? '<span class="etiqueta etiqueta--azul">0 km</span>' : ''}
        ${(v.etiquetas || [])
          .map((t, i) => `<span class="etiqueta${i === 0 ? ' etiqueta--rojo' : ''}">${escapar(t)}</span>`)
          .join('\n        ')}
        ${sinFotos ? '<span class="etiqueta">Fotos en preparación</span>' : ''}
      </div>
    </div>

    <div class="detalle">
      <div>
        ${galeriaHtml(v)}

        <div class="bloque-detalle mt-l">
          <h2 style="font-size:clamp(1.4rem,4vw,1.9rem)">Descripción</h2>
          <p class="plomo">${escapar(v.descripcion)}</p>
          ${
            sinFotos
              ? `<p class="nota-form">Las fotos de esta unidad todavía están en preparación.
                 Escribinos por WhatsApp y te las mandamos en el momento.</p>`
              : ''
          }
        </div>

        <div class="bloque-detalle">
          <h2 style="font-size:clamp(1.4rem,4vw,1.9rem)">Ficha técnica</h2>
          ${fichaHtml(v)}
        </div>

        <div class="bloque-detalle">
          <h2 style="font-size:clamp(1.4rem,4vw,1.9rem)">Equipamiento</h2>
          <ul class="equipamiento">
            ${(v.equipamiento || [])
              .map((e) => `<li>${ICO.tilde}<span>${escapar(e)}</span></li>`)
              .join('\n            ')}
          </ul>
        </div>
      </div>

      ${panelHtml(v)}
    </div>
  </div>
</section>

<section class="seccion seccion--alt mt-l" aria-labelledby="t-relacionados">
  <div class="contenedor">
    <div class="cabecera-seccion">
      <p class="eyebrow">También te puede interesar</p>
      <h2 id="t-relacionados">Vehículos relacionados</h2>
    </div>
    <div class="grilla-vehiculos" id="relacionados"></div>
    <div class="acciones mt-l">
      <a class="btn btn--fantasma btn--grande" href="../catalogo/index.html">Ver el catálogo completo ${ICO.flecha}</a>
    </div>
  </div>
</section>

${franjaCta({
  raiz: '../',
  eyebrow: 'Consulta directa',
  titulo: `¿Te interesa el ${escapar(v.marca)} ${escapar(v.modelo)}?`,
  texto:
    'Escribinos y te contamos disponibilidad, precio final, alternativas de financiación y qué tomamos en permuta.',
})}
`;

  const descripcion = `${nombre} en venta en Ton Cars, Ingeniero Maschwitz. ${formatearKm(
    v.km
  )}, ${v.combustible}, ${v.transmision}.${precio ? ` ${precio}.` : ''} Consultá por WhatsApp.`;

  return paginaHtml({
    raiz: '../',
    ruta: `vehiculos/${v.id}.html`,
    tipoOg: 'product',
    titulo: `${nombre} · ${formatearKm(v.km)} | Ton Cars Automotores`,
    descripcion: descripcion.slice(0, 300),
    imagen: fotoPrincipal(v).endsWith('.svg') ? 'img/marca/og.jpg' : fotoPrincipal(v),
    preload: [fotoPrincipal(v)],
    schema: [schemaVehiculo(v), schemaMigasVehiculo(v)],
    scripts: ['detalle.js'],
    bodyAttrs: ` data-vehiculo="${v.id}"`,
    contenido,
  });
}

/* ========================================================================= */
console.log('Generando subpáginas de vehículos:');

const destino = join(RAIZ, 'vehiculos');
mkdirSync(destino, { recursive: true });

/* Limpiamos las páginas de unidades que ya no están en el catálogo. */
const vigentes = new Set(CATALOGO.map((v) => `${v.id}.html`));
for (const archivo of readdirSync(destino)) {
  if (archivo.endsWith('.html') && !vigentes.has(archivo)) {
    rmSync(join(destino, archivo));
    console.log(`  - ${archivo} (dada de baja)`);
  }
}

for (const v of CATALOGO) {
  writeFileSync(join(destino, `${v.id}.html`), paginaVehiculo(v), 'utf8');
  console.log(`  vehiculos/${v.id}.html`);
}

/* ------------------------------------------------------------- Sitemap */
const HOY = new Date().toISOString().slice(0, 10);
const URLS = [
  ['', '1.0', 'weekly'],
  ['catalogo/', '0.9', 'daily'],
  ['nosotros/', '0.6', 'monthly'],
  ['servicios/', '0.7', 'monthly'],
  ['financiacion/', '0.7', 'monthly'],
  ['contacto/', '0.6', 'monthly'],
  ...CATALOGO.map((v) => [`vehiculos/${v.id}.html`, '0.8', 'weekly']),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${URLS.map(
  ([ruta, prioridad, frecuencia]) => `  <url>
    <loc>${SITIO}/${ruta}</loc>
    <lastmod>${HOY}</lastmod>
    <changefreq>${frecuencia}</changefreq>
    <priority>${prioridad}</priority>
  </url>`
).join('\n')}
</urlset>
`;

writeFileSync(join(RAIZ, 'sitemap.xml'), sitemap, 'utf8');
console.log('  sitemap.xml');

/* -------------------------------------------------------------- robots.txt */
writeFileSync(
  join(RAIZ, 'robots.txt'),
  `# Ton Cars Automotores
User-agent: *
Allow: /

Disallow: /tools/
Disallow: /_originales/

Sitemap: ${SITIO}/sitemap.xml
`,
  'utf8'
);
console.log('  robots.txt');

console.log(`Listo — ${CATALOGO.length} unidades publicadas.`);
