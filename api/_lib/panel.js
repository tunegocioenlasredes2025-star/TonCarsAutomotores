'use strict';
/* Lógica compartida de las funciones del panel (/api).
   Vercel no publica como ruta los archivos que empiezan con "_", así que esto no es accesible desde afuera.

   Variable de entorno (Vercel → Settings → Environment Variables):
     GITHUB_TOKEN    token fine-grained con "Contents: Read and write" SOLO sobre TonCarsAutomotores
   Contraseña del panel: hash scrypt en acceso.json (se cambia con `node api/_lib/cambiar-clave.js`).
   Opcional: PANEL_PASSWORD en Vercel pisa la de acceso.json.
   Cambiar la contraseña cierra todas las sesiones abiertas. */

const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);
let ACCESO = null;
try { ACCESO = require('./acceso.json'); } catch (_) { ACCESO = null; }
// Sin espacios de más ni mayúsculas (el celular pone la primera en mayúscula).
const normalizarClave = (s) => String(s || '').trim().toLowerCase().normalize('NFC');

const REPO = { owner: 'tunegocioenlasredes2025-star', repo: 'TonCarsAutomotores', branch: 'main' };
const DATA_PATH = 'data/vehiculos.json';
const IMG_DIR = 'img/vehiculos';
const GITHUB = process.env.GITHUB_API_URL || 'https://api.github.com';
const COOKIE = 'panel_sesion';
const DURACION = 30 * 24 * 3600; // segundos

/* -------- Dominio de vehículos -------- */
const TIPOS = ['hatchback', 'sedan', 'suv', 'pickup', 'utilitario', 'moto'];
const ESTADOS = ['usado', '0km'];
const MONEDAS = ['ARS', 'USD'];
// Foto nueva subida desde el panel (se escribe en assets managed). Solo webp.
const RUTA_FOTO_NUEVA = /^img\/vehiculos\/[a-z0-9-]+\.webp$/;
// Cualquier foto válida referenciable (incluye las .jpg históricas del import).
const RUTA_FOTO = /^img\/vehiculos\/[a-z0-9._-]+\.(webp|jpe?g|png)$/i;

const config = () => {
  const token = process.env.GITHUB_TOKEN;
  const pass = normalizarClave(process.env.PANEL_PASSWORD);
  const hash = ACCESO && ACCESO.hash;
  if (!token || (!pass && !hash)) return null;
  // "secreto" entra en la firma de la sesión: cambiar la contraseña invalida todas las cookies.
  return { token, pass, secreto: pass || hash };
};

const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));
const hoyAR = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());

function responder(res, status, obj, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
  res.end(JSON.stringify(obj));
}

const invalido = (mensaje) => Object.assign(new Error(mensaje), { status: 400, code: 'invalido' });

async function leerJSON(req, limite) {
  // En Vercel el cuerpo ya viene parseado en req.body; en un servidor Node común hay que leerlo.
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
    if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString('utf8') || '{}');
    return req.body;
  }
  const partes = [];
  let total = 0;
  for await (const p of req) {
    total += p.length;
    if (total > limite) throw Object.assign(new Error('Cuerpo demasiado grande'), { status: 413, code: 'grande' });
    partes.push(p);
  }
  const s = Buffer.concat(partes).toString('utf8');
  return s ? JSON.parse(s) : {};
}

/* ---------- Sesión: cookie firmada con HMAC ---------- */
const clave = (cfg) => crypto.createHash('sha256').update(`toncars-panel\n${cfg.token}\n${cfg.secreto}`).digest();
const firma = (cfg, payload) => crypto.createHmac('sha256', clave(cfg)).update(payload).digest('base64url');

function crearSesion(cfg) {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + DURACION })).toString('base64url');
  return `${COOKIE}=${payload}.${firma(cfg, payload)}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${DURACION}`;
}
const borrarSesion = () => `${COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

function sesionValida(cfg, req) {
  const par = (req.headers.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  if (!par) return false;
  const [payload, sig] = par.slice(COOKIE.length + 1).split('.');
  if (!payload || !sig) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(firma(cfg, payload));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof exp === 'number' && exp > Date.now() / 1000;
  } catch (_) {
    return false;
  }
}

async function passwordCorrecta(cfg, intento) {
  const txt = normalizarClave(intento);
  if (cfg.pass) {
    const a = crypto.createHash('sha256').update(txt).digest();
    const b = crypto.createHash('sha256').update(cfg.pass).digest();
    return crypto.timingSafeEqual(a, b);
  }
  const { N, r, p, salt, hash } = ACCESO;
  const calculado = await scrypt(txt, Buffer.from(salt, 'hex'), 32, { N, r, p, maxmem: 256 * N * r });
  const guardado = Buffer.from(hash, 'hex');
  return calculado.length === guardado.length && crypto.timingSafeEqual(calculado, guardado);
}

/* ---------- Guardas ---------- */
function exigirPost(req, res) {
  if (req.method !== 'POST') { responder(res, 405, { error: 'metodo' }); return false; }
  // Un formulario de otro sitio no puede mandar este encabezado: corta intentos de CSRF.
  if (req.headers['x-panel'] !== '1') { responder(res, 403, { error: 'origen' }); return false; }
  return true;
}

function exigirSesion(req, res) {
  const cfg = config();
  if (!cfg) { responder(res, 500, { error: 'config' }); return null; }
  if (!sesionValida(cfg, req)) { responder(res, 401, { error: 'sesion' }); return null; }
  return cfg;
}

/* ---------- GitHub ---------- */
async function gh(cfg, ruta, { method = 'GET', body } = {}) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    Authorization: `Bearer ${cfg.token}`,
    'User-Agent': 'toncars-panel',
  };
  if (body) headers['Content-Type'] = 'application/json';
  const r = await fetch(`${GITHUB}/repos/${REPO.owner}/${REPO.repo}${ruta}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) {
    let msg = '';
    try { msg = (await r.json()).message; } catch (_) { /* sin cuerpo */ }
    throw Object.assign(new Error(msg || `GitHub ${r.status}`), { status: r.status, github: true });
  }
  return r.status === 204 ? null : r.json();
}

// Traduce errores de GitHub y de validación a respuestas que el panel sabe mostrar.
function fallar(res, e) {
  if (e.code === 'invalido') return responder(res, 400, { error: 'invalido', mensaje: e.message });
  if (e.code === 'grande') return responder(res, 413, { error: 'grande' });
  if (e.code === 'conflicto') return responder(res, 409, { error: 'conflicto' });
  if (e instanceof SyntaxError) return responder(res, 400, { error: 'invalido', mensaje: 'Los datos llegaron mal.' });
  if (e.github && e.status === 401) return responder(res, 502, { error: 'token' });
  if (e.github && (e.status === 403 || e.status === 404)) return responder(res, 502, { error: 'permiso' });
  if (e.github && (e.status === 409 || e.status === 422)) return responder(res, 409, { error: 'choque' });
  console.error(e);
  return responder(res, 500, { error: 'servidor' });
}

/* ---------- Catálogo de vehículos ---------- */
const AHORA = new Date().getFullYear();

function textoLimpio(s, max) {
  return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, max);
}

function enteroOpc(n, min, max) {
  if (n === null || n === undefined || n === '') return null;
  const x = Math.round(Number(n));
  if (!Number.isFinite(x) || x < min || x > max) return null;
  return x;
}

function limpiarVehiculo(v, ids) {
  if (!v || typeof v !== 'object') throw invalido('Hay un vehículo con formato inválido.');

  const marca = textoLimpio(v.marca, 40);
  const modelo = textoLimpio(v.modelo, 90);
  if (!marca) throw invalido('Hay un vehículo sin marca.');
  if (!modelo) throw invalido(`Falta el modelo en "${marca}".`);

  let id = String(v.id || '').toLowerCase().trim();
  if (!/^[a-z0-9-]{1,60}$/.test(id) || ids.has(id)) {
    // Slug de respaldo si vino vacío, mal formado o repetido.
    const base = `${marca}-${modelo}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'vehiculo';
    id = base;
    let i = 2;
    while (ids.has(id)) { id = `${base}-${i++}`; }
  }
  ids.add(id);

  const fotos = (Array.isArray(v.fotos) ? v.fotos : [])
    .map((f) => String(f || '').trim())
    .filter(Boolean)
    .slice(0, 15);
  fotos.forEach((f) => {
    if (!RUTA_FOTO.test(f)) throw invalido(`La foto "${f}" de "${marca} ${modelo}" tiene una ruta inválida.`);
  });

  const etiquetas = (Array.isArray(v.etiquetas) ? v.etiquetas : [])
    .map((e) => textoLimpio(e, 30)).filter(Boolean).slice(0, 6);

  const equipamiento = (Array.isArray(v.equipamiento) ? v.equipamiento : [])
    .map((e) => textoLimpio(e, 80)).filter(Boolean).slice(0, 40);

  const fichaExtra = {};
  if (v.fichaExtra && typeof v.fichaExtra === 'object' && !Array.isArray(v.fichaExtra)) {
    Object.entries(v.fichaExtra).slice(0, 12).forEach(([k, val]) => {
      const clave = textoLimpio(k, 30);
      const valor = textoLimpio(val, 80);
      if (clave && valor) fichaExtra[clave] = valor;
    });
  }

  const estado = ESTADOS.includes(v.estado) ? v.estado : 'usado';

  return {
    id,
    marca,
    modelo,
    anio: enteroOpc(v.anio, 1950, AHORA + 2),
    km: estado === '0km' ? (enteroOpc(v.km, 0, 2000000) ?? 0) : enteroOpc(v.km, 0, 2000000),
    combustible: textoLimpio(v.combustible, 30),
    transmision: textoLimpio(v.transmision, 40) || null,
    tipo: TIPOS.includes(v.tipo) ? v.tipo : 'sedan',
    precio: enteroOpc(v.precio, 0, 9999999999),
    moneda: MONEDAS.includes(v.moneda) ? v.moneda : 'ARS',
    estado,
    destacado: !!v.destacado,
    disponible: v.disponible !== false,
    verificado: v.verificado !== false,
    financiable: v.financiable !== false,
    etiquetas,
    fotos,
    descripcion: textoLimpio(v.descripcion, 800),
    equipamiento,
    fichaExtra,
  };
}

function limpiarVehiculos(arr) {
  if (!Array.isArray(arr)) throw invalido('El catálogo no tiene el formato esperado.');
  if (arr.length > 300) throw invalido('Hay demasiados vehículos (máximo 300).');
  const ids = new Set();
  return arr.map((v) => limpiarVehiculo(v, ids));
}

async function leerCatalogo(cfg) {
  try {
    const f = await gh(cfg, `/contents/${DATA_PATH}?ref=${REPO.branch}`);
    return { sha: f.sha, data: JSON.parse(Buffer.from(f.content, 'base64').toString('utf8')) };
  } catch (e) {
    if (e.github && e.status === 404) return { sha: null, data: [] };
    throw e;
  }
}

module.exports = {
  REPO, DATA_PATH, IMG_DIR, RUTA_FOTO_NUEVA, RUTA_FOTO, TIPOS, ESTADOS, MONEDAS,
  config, esperar, hoyAR, responder, leerJSON, invalido,
  crearSesion, borrarSesion, passwordCorrecta, exigirPost, exigirSesion,
  gh, fallar, limpiarVehiculos, leerCatalogo,
};
