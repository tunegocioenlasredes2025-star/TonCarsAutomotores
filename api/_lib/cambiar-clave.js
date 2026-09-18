#!/usr/bin/env node
'use strict';
/* Cambia la contraseña del panel /admin.

   Uso (desde la carpeta del proyecto):
     node api/_lib/cambiar-clave.js                  → inventa una contraseña nueva y la muestra
     node api/_lib/cambiar-clave.js "mi-clave-nueva" → usa esa

   Guarda en api/_lib/acceso.json solo el hash (scrypt con sal): la contraseña no queda escrita
   en ningún lado. Después hay que hacer commit + push; Vercel redeploya solo y se cierran todas
   las sesiones abiertas. */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PALABRAS = (
  'motor ruta auto camino llave rueda faro nafta turbo caja freno volante asiento espejo taller marcha '
  + 'pista garaje puente calle avenida cordoba escobar maschwitz norte sur este oeste rojo azul plata negro '
  + 'blanco gris toyota renault honda peugeot fiat pickup sedan hatch camioneta consigna permuta usado nuevo '
  + 'entrega patente cubierta chapa pintura service kilometro asfalto motorista chofer garantia financia anticipo '
  + 'contado cuota transferencia gestoria seguro tanque bujia aceite radiador correa embrague palanca tablero'
).split(' ');

const normalizar = (s) => String(s || '').trim().toLowerCase().normalize('NFC');
const inventar = () => {
  // 5 palabras + un número: el repo es público y el hash queda a la vista, así que tiene que ser larga.
  const p = Array.from({ length: 5 }, () => PALABRAS[crypto.randomInt(PALABRAS.length)]);
  return `${p.join('-')}-${crypto.randomInt(10, 100)}`;
};

const clave = process.argv[2] ? normalizar(process.argv[2]) : inventar();
if (clave.length < 12) {
  console.error('La contraseña tiene que tener al menos 12 caracteres.');
  process.exit(1);
}

const N = 2 ** 15;
const r = 8;
const p = 1;
const sal = crypto.randomBytes(16);
const hash = crypto.scryptSync(clave, sal, 32, { N, r, p, maxmem: 256 * N * r });
fs.writeFileSync(
  path.join(__dirname, 'acceso.json'),
  `${JSON.stringify({ N, r, p, salt: sal.toString('hex'), hash: hash.toString('hex') }, null, 2)}\n`,
);
console.log(clave);
