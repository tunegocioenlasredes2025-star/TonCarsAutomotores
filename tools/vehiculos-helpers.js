/* --------------------------------------------------------------------------
   Utilidades compartidas por catálogo, home y páginas de detalle
   -------------------------------------------------------------------------- */
const TC = {
  telefono: '5491134253399',
  telefonoVisible: '11 3425-3399',
  instagram: 'https://www.instagram.com/toncarsdetails',
  direccion: 'Colectora Este 215, Ramal Escobar — Ingeniero Maschwitz',
  sitio: 'https://toncars.com.ar',
};

const ETIQUETAS_TIPO = {
  hatchback: 'Hatchback',
  sedan: 'Sedán',
  suv: 'SUV',
  pickup: 'Pickup',
  utilitario: 'Utilitario',
  moto: 'Moto',
};

/** Vehículos publicados, ordenados: destacados primero, luego más nuevos. */
function vehiculosPublicados(lista = VEHICULOS) {
  return lista
    .filter((v) => v.disponible !== false)
    .slice()
    .sort((a, b) => Number(b.destacado) - Number(a.destacado) || (b.anio || 0) - (a.anio || 0));
}

/** "Toyota Yaris 1.5 XLS CVT 2019" */
function nombreVehiculo(v) {
  // El año se omite si todavía no se cargó (unidades nuevas sin ficha completa).
  return `${v.marca} ${v.modelo}${v.anio ? ' ' + v.anio : ''}`.trim();
}

/* Placeholder de texto para los datos que todavía no se cargaron. */
const A_CONFIRMAR = 'A confirmar';

/** Foto principal, o el placeholder de marca según el tipo de carrocería. */
function fotoPrincipal(v) {
  if (v.fotos && v.fotos.length) return v.fotos[0];
  return `img/placeholders/${v.tipo === 'moto' ? 'moto' : v.tipo}.svg`;
}

/** Todas las fotos utilizables para la galería. */
function fotosVehiculo(v) {
  return v.fotos && v.fotos.length ? v.fotos : [fotoPrincipal(v)];
}

function formatearKm(km) {
  if (km == null) return A_CONFIRMAR;
  if (km === 0) return '0 km';
  return `${new Intl.NumberFormat('es-AR').format(km)} km`;
}

/** Devuelve el valor o "A confirmar" si todavía no se cargó. */
function oConfirmar(valor) {
  return valor == null || valor === '' ? A_CONFIRMAR : valor;
}

function formatearPrecio(v) {
  if (v.precio == null) return null;
  const simbolo = v.moneda === 'USD' ? 'US$' : '$';
  return `${simbolo} ${new Intl.NumberFormat('es-AR').format(v.precio)}`;
}

/** Mensaje pre-escrito de WhatsApp para una unidad concreta. */
function enlaceWhatsapp(v, contexto = '') {
  const texto = v
    ? `Hola Ton Cars, vi en la web el ${nombreVehiculo(v)} y quería consultar disponibilidad, precio y forma de pago.`
    : contexto ||
      'Hola Ton Cars, estoy buscando un vehículo y quería que me asesoren.';
  return `https://wa.me/${TC.telefono}?text=${encodeURIComponent(texto)}`;
}

/* Export para el generador de páginas (Node). En el navegador no hace nada. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VEHICULOS,
    TC,
    ETIQUETAS_TIPO,
    vehiculosPublicados,
    nombreVehiculo,
    fotoPrincipal,
    fotosVehiculo,
    formatearKm,
    formatearPrecio,
    oConfirmar,
    enlaceWhatsapp,
  };
}
