/* ==========================================================================
   TON CARS — Base de datos del catálogo
   --------------------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE TOCAR PARA CARGAR O SACAR UNIDADES.

   Después de editarlo, correr:   node tools/generar-vehiculos.mjs
   (regenera las páginas de /vehiculos/ y el sitemap.xml)

   Campos:
     id            slug único, se usa como nombre de archivo. minúsculas y guiones.
     marca         "Toyota", "Volkswagen", ...
     modelo        "Yaris 1.5 XLS CVT"
     anio          número
     km            número (0 para 0 km)
     combustible   "Nafta" | "Diésel" | "GNC" | "Híbrido" | "Eléctrico"
     transmision   "Manual" | "Automática" | "CVT"
     tipo          "hatchback" | "sedan" | "suv" | "pickup" | "moto"
     precio        número en pesos, o null para mostrar "Consultar"
     moneda        "ARS" | "USD"
     estado        "usado" | "0km"
     destacado     true para que aparezca en la home
     disponible    false lo saca del catálogo sin borrar el registro
     verificado    true/false → ficha: "Verificado por mecánico". Sí por defecto.
     financiable   true/false → ficha: "Financiable". Sí por defecto.
     etiquetas     textos cortos que se muestran sobre la foto
     fotos         rutas relativas a la raíz del sitio. Si está vacío se usa
                   el placeholder de marca según "tipo".
     descripcion   2-4 oraciones, se usa también en la meta description
     equipamiento  lista de textos cortos
     fichaExtra    pares clave/valor opcionales para la ficha técnica
   ========================================================================== */

const VEHICULOS = [
  {
    id: 'toyota-etios-xls',
    marca: 'Toyota',
    modelo: 'Etios XLS 1.5 5 puertas',
    anio: null,
    km: null,
    combustible: 'Nafta',
    transmision: null,
    tipo: 'hatchback',
    precio: null,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Recién ingresado'],
    fotos: [
      'img/vehiculos/toyota-etios-xls-1.webp',
      'img/vehiculos/toyota-etios-xls-2.webp',
      'img/vehiculos/toyota-etios-xls-3.webp',
      'img/vehiculos/toyota-etios-xls-4.webp',
    ],
    descripcion:
      'Toyota Etios XLS 1.5 5 puertas, color rojo. Hatchback económico y confiable, con la respaldo de Toyota. Escribinos por WhatsApp y te pasamos año, kilometraje, precio y estado detallado de la unidad.',
    equipamiento: [],
    fichaExtra: { Color: 'Rojo' },
  },
  {
    id: 'fiat-fiorino-2018',
    marca: 'Fiat',
    modelo: 'Nuevo Fiorino 1.4 8V',
    anio: 2018,
    km: 110000,
    combustible: 'Nafta',
    transmision: 'Manual',
    tipo: 'utilitario',
    precio: 16500000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: false,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Utilitario', 'Consignación'],
    fotos: [
      'img/vehiculos/fiat-fiorino-2018-3.webp',
      'img/vehiculos/fiat-fiorino-2018-1.webp',
      'img/vehiculos/fiat-fiorino-2018-2.webp',
      'img/vehiculos/fiat-fiorino-2018-4.webp',
    ],
    descripcion:
      'Fiat Fiorino 1.4 modelo 2018, utilitario liviano ideal para reparto y trabajo diario. Gran espacio de carga, bajo consumo y costo de mantenimiento accesible. Unidad en consignación, con 110.000 km.',
    equipamiento: [],
    fichaExtra: { Motor: '1.4 8V', Color: 'Blanco' },
  },
  {
    id: 'fiat-fiorino-2018-b',
    marca: 'Fiat',
    modelo: 'Nuevo Fiorino 1.4 8V',
    anio: 2018,
    km: 103500,
    combustible: 'Nafta',
    transmision: 'Manual',
    tipo: 'utilitario',
    precio: 16500000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: false,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Utilitario', 'Consignación'],
    fotos: [
      'img/vehiculos/fiat-fiorino-2018-3.webp',
      'img/vehiculos/fiat-fiorino-2018-1.webp',
      'img/vehiculos/fiat-fiorino-2018-2.webp',
      'img/vehiculos/fiat-fiorino-2018-4.webp',
    ],
    descripcion:
      'Segunda unidad del Fiat Fiorino 1.4 modelo 2018, con 103.500 km. Utilitario práctico para reparto y oficios, con espacio de carga amplio y mecánica sencilla. Fotos de referencia del modelo.',
    equipamiento: [],
    fichaExtra: { Motor: '1.4 8V', Color: 'Blanco' },
  },
  {
    id: 'honda-glh-150-2026',
    marca: 'Honda',
    modelo: 'GLH 150',
    anio: 2026,
    km: 980,
    combustible: 'Nafta',
    transmision: 'Manual',
    tipo: 'moto',
    precio: 4500000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Como nueva', '980 km'],
    fotos: [
      'img/vehiculos/honda-glh-150-2026-1.webp',
      'img/vehiculos/honda-glh-150-2026-2.webp',
      'img/vehiculos/honda-glh-150-2026-3.webp',
      'img/vehiculos/honda-glh-150-2026-4.webp',
    ],
    descripcion:
      'Honda GLH 150 modelo 2026 con apenas 980 km: prácticamente 0 km. Moto ideal para ciudad y trabajo diario, con bajo consumo, arranque eléctrico y la respaldo de la red oficial Honda.',
    equipamiento: [],
    fichaExtra: { Cilindrada: '150 cc', Color: 'Negra y roja' },
  },
  {
    id: 'peugeot-308-allure-2018',
    marca: 'Peugeot',
    modelo: '308 Allure Pack THP Tiptronic',
    anio: 2018,
    km: 111000,
    combustible: 'Nafta',
    transmision: 'Automática',
    tipo: 'hatchback',
    precio: 19500000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: false,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Full', 'Automático'],
    fotos: [
      'img/vehiculos/peugeot-308-allure-2018-1.webp',
      'img/vehiculos/peugeot-308-allure-2018-2.webp',
      'img/vehiculos/peugeot-308-allure-2018-3.webp',
    ],
    descripcion:
      'Peugeot 308 Allure Pack THP con caja automática Tiptronic, modelo 2018. Hatchback premium del segmento con motor turbo nafta y equipamiento alto. 111.000 km, unidad en consignación.',
    equipamiento: [],
    fichaExtra: { Motor: '1.6 THP Turbo', Color: 'Gris' },
  },
  {
    id: 'peugeot-308-sport-2014',
    marca: 'Peugeot',
    modelo: '308 Sport THP',
    anio: 2014,
    km: 126433,
    combustible: 'Nafta',
    transmision: 'Automática',
    tipo: 'hatchback',
    precio: 14200000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: false,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['THP Turbo', 'Automático'],
    fotos: [
      'img/vehiculos/peugeot-308-sport-2014-1.webp',
      'img/vehiculos/peugeot-308-sport-2014-2.webp',
      'img/vehiculos/peugeot-308-sport-2014-3.webp',
      'img/vehiculos/peugeot-308-sport-2014-4.webp',
    ],
    descripcion:
      'Peugeot 308 Sport THP automático, modelo 2014. Motor turbo nafta, muy buen andar y una terminación deportiva. 126.433 km, unidad revisada y en consignación.',
    equipamiento: [],
    fichaExtra: { Motor: '1.6 THP Turbo', Color: 'Gris' },
  },
  {
    id: 'renault-fluence-luxe-2015',
    marca: 'Renault',
    modelo: 'Fluence PH2 2.0 Luxe Pack Cuero',
    anio: 2015,
    km: 81200,
    combustible: 'Nafta',
    transmision: 'Manual',
    tipo: 'sedan',
    precio: 16500000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Cuero', 'Luxe'],
    fotos: [
      'img/vehiculos/renault-fluence-luxe-2015-1.webp',
      'img/vehiculos/renault-fluence-luxe-2015-2.webp',
      'img/vehiculos/renault-fluence-luxe-2015-3.webp',
      'img/vehiculos/renault-fluence-luxe-2015-4.webp',
    ],
    descripcion:
      'Renault Fluence 2.0 Luxe Pack Cuero, modelo 2015. Sedán espacioso y confortable, con tapizado de cuero y uno de los equipamientos más completos de su gama. 81.200 km.',
    equipamiento: [],
    fichaExtra: { Motor: '2.0 16V', Color: 'Gris' },
  },
  {
    id: 'toyota-corolla-xli-2014',
    marca: 'Toyota',
    modelo: 'Corolla XLI',
    anio: 2014,
    km: 198450,
    combustible: 'Nafta',
    transmision: 'Automática',
    tipo: 'sedan',
    precio: 17800000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: false,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Automático', 'Toyota'],
    fotos: [
      'img/vehiculos/toyota-corolla-xli-2014-1.webp',
      'img/vehiculos/toyota-corolla-xli-2014-2.webp',
      'img/vehiculos/toyota-corolla-xli-2014-3.webp',
      'img/vehiculos/toyota-corolla-xli-2014-4.webp',
    ],
    descripcion:
      'Toyota Corolla XLI automático, modelo 2014. El sedán más confiable del segmento, con la reconocida durabilidad Toyota. 198.450 km, con historial de uso y en consignación.',
    equipamiento: [],
    fichaExtra: { Motor: '1.8 16V', Color: 'Gris' },
  },
  {
    id: 'toyota-yaris-s-2019',
    marca: 'Toyota',
    modelo: 'Yaris S 1.5 6MT',
    anio: 2019,
    km: 116591,
    combustible: 'Nafta',
    transmision: 'Manual',
    tipo: 'hatchback',
    precio: 23200000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Bajo consumo', 'Toyota'],
    fotos: [
      'img/vehiculos/toyota-yaris-s-2019-1.webp',
      'img/vehiculos/toyota-yaris-s-2019-2.webp',
      'img/vehiculos/toyota-yaris-s-2019-3.webp',
      'img/vehiculos/toyota-yaris-s-2019-4.webp',
    ],
    descripcion:
      'Toyota Yaris S 1.5 manual, modelo 2019. Hatchback moderno, económico y con la garantía de calidad Toyota. 116.591 km, ideal para uso diario en ciudad.',
    equipamiento: [],
    fichaExtra: { Motor: '1.5 16V', Color: 'Gris plata' },
  },
  {
    id: 'volkswagen-virtus-highline-2018',
    marca: 'Volkswagen',
    modelo: 'Virtus Highline 1.6',
    anio: 2018,
    km: 110873,
    combustible: 'Nafta',
    transmision: 'Automática',
    tipo: 'sedan',
    precio: 21500000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Highline', 'Full'],
    fotos: [
      'img/vehiculos/volkswagen-virtus-highline-2018-1.webp',
      'img/vehiculos/volkswagen-virtus-highline-2018-2.webp',
      'img/vehiculos/volkswagen-virtus-highline-2018-3.webp',
      'img/vehiculos/volkswagen-virtus-highline-2018-4.webp',
    ],
    descripcion:
      'Volkswagen Virtus Highline 1.6 automático, modelo 2018. Sedán full del segmento, uno de los más equipados y seguros de su categoría. 110.873 km, color negro.',
    equipamiento: [],
    fichaExtra: { Motor: '1.6 MSI', Color: 'Negro' },
  },
  {
    id: 'volkswagen-amarok-2016',
    marca: 'Volkswagen',
    modelo: 'Amarok 2.0 TDI 180 CV 4x2',
    anio: 2016,
    km: 209316,
    combustible: 'Diésel',
    transmision: 'Automática',
    tipo: 'pickup',
    precio: 25000000,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['4x2', 'Diésel'],
    fotos: [
      'img/vehiculos/volkswagen-amarok-2016-1.webp',
      'img/vehiculos/volkswagen-amarok-2016-2.webp',
      'img/vehiculos/volkswagen-amarok-2016-3.webp',
      'img/vehiculos/volkswagen-amarok-2016-4.webp',
    ],
    descripcion:
      'Volkswagen Amarok 2.0 TDI 180 CV 4x2 automática, modelo 2016. Pickup de trabajo y familia con motor diésel biturbo y gran capacidad de carga. 209.316 km.',
    equipamiento: [],
    fichaExtra: { Motor: '2.0 TDI Biturbo', Color: 'Gris plata' },
  },
  {
    id: 'renault-kardian-blanco-0km',
    marca: 'Renault',
    modelo: 'Kardian Evolution 200 EDC Pack ADAS',
    anio: null,
    km: 0,
    combustible: 'Nafta',
    transmision: 'Automática (EDC)',
    tipo: 'suv',
    precio: null,
    moneda: 'ARS',
    estado: '0km',
    destacado: true,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Blanco'],
    fotos: [
      'img/vehiculos/renault-kardian-blanco-0km-1.webp',
      'img/vehiculos/renault-kardian-blanco-0km-2.webp',
      'img/vehiculos/renault-kardian-blanco-0km-3.webp',
    ],
    descripcion:
      'Renault Kardian Evolution 200 EDC con Pack ADAS, 0 km. SUV compacto totalmente nuevo. Escribinos por WhatsApp para conocer precio, financiación y disponibilidad.',
    equipamiento: [],
    fichaExtra: { Color: 'Blanco' },
  },
  {
    id: 'renault-kardian-gris-cassiopee-0km',
    marca: 'Renault',
    modelo: 'Kardian Evolution 200 EDC Pack ADAS',
    anio: null,
    km: 0,
    combustible: 'Nafta',
    transmision: 'Automática (EDC)',
    tipo: 'suv',
    precio: null,
    moneda: 'ARS',
    estado: '0km',
    destacado: true,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Gris Cassiopée'],
    fotos: [
      'img/vehiculos/renault-kardian-gris-cassiopee-0km-1.webp',
      'img/vehiculos/renault-kardian-gris-cassiopee-0km-2.webp',
      'img/vehiculos/renault-kardian-gris-cassiopee-0km-3.webp',
    ],
    descripcion:
      'Renault Kardian Evolution 200 EDC con Pack ADAS, 0 km, color Gris Cassiopée. SUV compacto nuevo. Consultá precio y financiación por WhatsApp.',
    equipamiento: [],
    fichaExtra: { Color: 'Gris Cassiopée' },
  },
  {
    id: 'renault-kardian-gris-etoile-0km',
    marca: 'Renault',
    modelo: 'Kardian Evolution 200 EDC Pack ADAS',
    anio: null,
    km: 0,
    combustible: 'Nafta',
    transmision: 'Automática (EDC)',
    tipo: 'suv',
    precio: null,
    moneda: 'ARS',
    estado: '0km',
    destacado: false,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Gris Étoile'],
    fotos: [
      'img/vehiculos/renault-kardian-gris-etoile-0km-1.webp',
      'img/vehiculos/renault-kardian-gris-etoile-0km-2.webp',
      'img/vehiculos/renault-kardian-gris-etoile-0km-3.webp',
    ],
    descripcion:
      'Renault Kardian Evolution 200 EDC con Pack ADAS, 0 km, color Gris Étoile. SUV compacto nuevo. Consultá precio y financiación por WhatsApp.',
    equipamiento: [],
    fichaExtra: { Color: 'Gris Étoile' },
  },
  {
    id: 'renault-kwid-outsider-0km',
    marca: 'Renault',
    modelo: 'Kwid Iconic 1.0 Outsider',
    anio: null,
    km: 0,
    combustible: 'Nafta',
    transmision: null,
    tipo: 'hatchback',
    precio: null,
    moneda: 'ARS',
    estado: '0km',
    destacado: true,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Blanco Glaciar'],
    fotos: [
      'img/vehiculos/renault-kwid-outsider-0km-1.webp',
      'img/vehiculos/renault-kwid-outsider-0km-2.webp',
      'img/vehiculos/renault-kwid-outsider-0km-3.webp',
      'img/vehiculos/renault-kwid-outsider-0km-4.webp',
      'img/vehiculos/renault-kwid-outsider-0km-5.webp',
    ],
    descripcion:
      'Renault Kwid Iconic 1.0 Outsider, 0 km, color Blanco Glaciar. Hatchback nuevo, ideal para ciudad. Consultá precio y financiación por WhatsApp.',
    equipamiento: [],
    fichaExtra: { Color: 'Blanco Glaciar' },
  },
  {
    id: 'renault-kwid-bitono-0km',
    marca: 'Renault',
    modelo: 'Kwid Iconic 1.0 Bitono',
    anio: null,
    km: 0,
    combustible: 'Nafta',
    transmision: null,
    tipo: 'hatchback',
    precio: null,
    moneda: 'ARS',
    estado: '0km',
    destacado: false,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['Gris Cassiopée'],
    fotos: [
      'img/vehiculos/renault-kwid-bitono-0km-1.webp',
    ],
    descripcion:
      'Renault Kwid Iconic 1.0 Bitono, 0 km, color Gris Cassiopée. Hatchback nuevo. Consultá precio y financiación por WhatsApp.',
    equipamiento: [],
    fichaExtra: { Color: 'Gris Cassiopée' },
  },
  {
    id: 'ford-ecosport-xls',
    marca: 'Ford',
    modelo: 'EcoSport 1.6 4x2 XLS',
    anio: null,
    km: null,
    combustible: 'Nafta',
    transmision: null,
    tipo: 'suv',
    precio: null,
    moneda: 'ARS',
    estado: 'usado',
    destacado: false,
    disponible: true,
    verificado: true,
    financiable: true,
    etiquetas: ['SUV'],
    fotos: [
      'img/vehiculos/ford-ecosport-xls-1.webp',
      'img/vehiculos/ford-ecosport-xls-2.webp',
      'img/vehiculos/ford-ecosport-xls-3.webp',
      'img/vehiculos/ford-ecosport-xls-4.webp',
    ],
    descripcion:
      'Ford EcoSport 1.6 4x2 XLS. SUV compacto para ciudad y familia. Escribinos por WhatsApp y te pasamos año, kilometraje, precio y estado detallado de la unidad.',
    equipamiento: [],
    fichaExtra: {},
  },
];

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
