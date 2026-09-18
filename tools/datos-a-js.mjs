/* ==========================================================================
   TON CARS — Compone js/vehiculos.js a partir de la base de datos.

   Fuente de datos:  data/vehiculos.json   (lo edita el panel /admin)
   Helpers:          tools/vehiculos-helpers.js
   Salida:           js/vehiculos.js        (lo carga el navegador; NO editar a mano)

   Uso:  node tools/datos-a-js.mjs
   Corre solo dentro de `npm run build`. En Vercel se regenera en cada deploy.
   ========================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const datos = JSON.parse(readFileSync(join(RAIZ, 'data', 'vehiculos.json'), 'utf8'));
if (!Array.isArray(datos)) throw new Error('data/vehiculos.json no es un array de vehículos.');

const helpers = readFileSync(join(RAIZ, 'tools', 'vehiculos-helpers.js'), 'utf8');

const cabecera = `/* ==========================================================================
   TON CARS — Base de datos del catálogo (ARCHIVO GENERADO — NO EDITAR A MANO)
   --------------------------------------------------------------------------
   Se arma automáticamente desde data/vehiculos.json con:
       node tools/datos-a-js.mjs   (parte de \`npm run build\`)

   Para cargar, editar o dar de baja unidades usá el panel /admin, o editá
   data/vehiculos.json y volvé a correr el build. Cualquier cambio hecho
   directo acá se pierde en el próximo deploy.
   ========================================================================== */
`;

const cuerpo = `${cabecera}
const VEHICULOS = ${JSON.stringify(datos, null, 2)};

${helpers}`;

writeFileSync(join(RAIZ, 'js', 'vehiculos.js'), cuerpo, 'utf8');
console.log(`  js/vehiculos.js  (${datos.length} unidades desde data/vehiculos.json)`);
