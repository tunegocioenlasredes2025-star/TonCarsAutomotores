/**
 * Ton Cars — placeholders de catálogo.
 *
 * Genera las placas que ocupan el lugar de la foto en las unidades que
 * todavía no tienen imágenes propias. No son fotos falsas ni dibujos del
 * vehículo: son placas de marca con un ícono de cámara, para que la grilla
 * se lea como un sistema y no como una tarjeta rota.
 *
 * El texto "Fotos en preparación" NO va acá: se muestra como etiqueta HTML
 * sobre la tarjeta, así usa la tipografía real del sitio.
 *
 * Uso:  node tools/generar-placeholders.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'img', 'placeholders');

/* Cada tipo usa el mismo ícono con el resplandor en otra posición, para que
   una grilla con varias unidades sin foto no se vea repetida. */
const VARIANTES = {
  hatchback: { gx: 0.28, gy: 0.3, angulo: 15 },
  sedan: { gx: 0.72, gy: 0.28, angulo: 200 },
  suv: { gx: 0.5, gy: 0.72, angulo: 105 },
  pickup: { gx: 0.2, gy: 0.7, angulo: 300 },
  utilitario: { gx: 0.62, gy: 0.68, angulo: 150 },
  moto: { gx: 0.8, gy: 0.62, angulo: 60 },
};

/* Ícono de cámara, centrado en un lienzo de 1000x560. */
const CAMARA = `
    <rect x="378" y="206" width="244" height="176" rx="26"/>
    <path d="M438 206l20-32h84l20 32"/>
    <circle cx="500" cy="294" r="54"/>
    <circle cx="500" cy="294" r="26"/>
    <circle cx="580" cy="240" r="7"/>`;

function svg(tipo) {
  const v = VARIANTES[tipo];
  const rad = (v.angulo * Math.PI) / 180;
  const x2 = (0.5 + Math.cos(rad) / 2).toFixed(3);
  const y2 = (0.5 + Math.sin(rad) / 2).toFixed(3);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 560" width="1000" height="560" role="img" aria-label="Ton Cars — fotos de la unidad en preparación">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#131a29"/>
      <stop offset=".55" stop-color="#0b0f18"/>
      <stop offset="1" stop-color="#070910"/>
    </linearGradient>
    <linearGradient id="marca" x1="${(1 - x2).toFixed(3)}" y1="${(1 - y2).toFixed(3)}" x2="${x2}" y2="${y2}">
      <stop offset="0" stop-color="#dc0b08"/>
      <stop offset="1" stop-color="#1342a4"/>
    </linearGradient>
    <radialGradient id="brillo" cx="${v.gx}" cy="${v.gy}" r=".7">
      <stop offset="0" stop-color="#1342a4" stop-opacity=".42"/>
      <stop offset=".55" stop-color="#dc0b08" stop-opacity=".12"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <pattern id="rejilla" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="#ffffff" stroke-opacity=".04" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1000" height="560" fill="url(#fondo)"/>
  <rect width="1000" height="560" fill="url(#rejilla)"/>
  <rect width="1000" height="560" fill="url(#brillo)"/>

  <g fill="none" stroke="url(#marca)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".9">${CAMARA}
  </g>

  <path d="M400 440h200" stroke="url(#marca)" stroke-width="4" stroke-linecap="round" opacity=".55"/>
</svg>
`;
}

mkdirSync(SALIDA, { recursive: true });
for (const tipo of Object.keys(VARIANTES)) {
  writeFileSync(join(SALIDA, `${tipo}.svg`), svg(tipo), 'utf8');
  console.log(`  img/placeholders/${tipo}.svg`);
}
