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
    id: 'toyota-yaris-xls-cvt-2019',
    marca: 'Toyota',
    modelo: 'Yaris 1.5 XLS CVT',
    anio: 2019,
    km: 78000,
    combustible: 'Nafta',
    transmision: 'CVT',
    tipo: 'hatchback',
    precio: null,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,

    verificado: true,

    financiable: true,
    etiquetas: ['Recién ingresado', 'Detailing hecho'],
    fotos: ['img/vehiculos/toyota-yaris-01.webp'],
    descripcion:
      'Yaris XLS con caja CVT, la versión más completa de la gama. Unidad revisada y entregada con detailing completo en nuestro taller. Ideal para uso diario en ciudad por su consumo y su costo de mantenimiento.',
    equipamiento: [
      'Climatizador automático',
      'Pantalla multimedia con Android Auto y Apple CarPlay',
      'Cámara de retroceso',
      'Sensores de estacionamiento',
      'Control de velocidad crucero',
      'Llantas de aleación',
      'Faros con luz diurna LED',
      'Siete airbags',
    ],
    fichaExtra: {
      Motor: '1.5 16V',
      Color: 'Gris claro',
    },
  },
  {
    id: 'honda-cb125f-twister-2021',
    marca: 'Honda',
    modelo: 'CB 125F Twister',
    anio: 2021,
    km: 21000,
    combustible: 'Nafta',
    transmision: 'Manual',
    tipo: 'moto',
    precio: null,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,

    verificado: true,

    financiable: true,
    etiquetas: ['Papeles al día'],
    fotos: ['img/vehiculos/honda-cb125-01.webp'],
    descripcion:
      'Honda CB 125F Twister con bajo kilometraje y service al día. Muy buena opción como primera moto o para trabajo diario: bajo consumo, repuestos accesibles y red oficial en todo el país.',
    equipamiento: [
      'Freno delantero a disco',
      'Tablero digital',
      'Arranque eléctrico y a pedal',
      'Parrilla trasera',
      'Casco incluido',
    ],
    fichaExtra: {
      Cilindrada: '125 cc',
      Refrigeración: 'Aire',
      Color: 'Negro',
    },
  },
  {
    id: 'volkswagen-amarok-highline-4x4-2018',
    marca: 'Volkswagen',
    modelo: 'Amarok 2.0 TDI Highline 4x4',
    anio: 2018,
    km: 142000,
    combustible: 'Diésel',
    transmision: 'Automática',
    tipo: 'pickup',
    precio: null,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,

    verificado: true,

    financiable: true,
    etiquetas: ['4x4'],
    fotos: [],
    descripcion:
      'Amarok Highline 4x4 con caja automática de ocho velocidades. Pickup de trabajo y familia, con servicios documentados y unidad revisada punto por punto antes de la publicación.',
    equipamiento: [
      'Tracción 4x4 conectable',
      'Climatizador bizona',
      'Tapizado de cuero',
      'Butaca del conductor eléctrica',
      'Cámara de retroceso',
      'Barra antivuelco',
      'Cobertor de caja',
    ],
    fichaExtra: {
      Motor: '2.0 TDI Biturbo',
      Tracción: '4x4',
    },
  },
  {
    id: 'fiat-cronos-drive-2021',
    marca: 'Fiat',
    modelo: 'Cronos 1.3 Drive',
    anio: 2021,
    km: 54000,
    combustible: 'Nafta',
    transmision: 'Manual',
    tipo: 'sedan',
    precio: null,
    moneda: 'ARS',
    estado: 'usado',
    destacado: true,
    disponible: true,

    verificado: true,

    financiable: true,
    etiquetas: ['Apto financiación'],
    fotos: [],
    descripcion:
      'Cronos Drive 1.3 Firefly, uno de los sedanes más buscados del segmento por espacio interior y baúl. Unidad de uso particular, con service realizado y toda la documentación en regla.',
    equipamiento: [
      'Aire acondicionado',
      'Dirección eléctrica',
      'Pantalla táctil de siete pulgadas',
      'Levantavidrios eléctricos',
      'Comandos al volante',
      'Doble airbag frontal',
      'ABS con distribución electrónica de frenado',
    ],
    fichaExtra: {
      Motor: '1.3 Firefly',
      Baúl: '525 litros',
    },
  },
  {
    id: 'toyota-hilux-srv-4x4-2020',
    marca: 'Toyota',
    modelo: 'Hilux 2.8 TDI SRV 4x4 AT',
    anio: 2020,
    km: 118000,
    combustible: 'Diésel',
    transmision: 'Automática',
    tipo: 'pickup',
    precio: null,
    moneda: 'USD',
    estado: 'usado',
    destacado: false,
    disponible: true,

    verificado: true,

    financiable: true,
    etiquetas: ['4x4', 'Service oficial'],
    fotos: [],
    descripcion:
      'Hilux SRV 4x4 automática con historial de service en concesionario oficial. La pickup de referencia del mercado argentino por reventa, disponibilidad de repuestos y valor de reventa.',
    equipamiento: [
      'Tracción 4x4 con reductora',
      'Control de descenso',
      'Climatizador automático',
      'Butacas de cuero',
      'Cámara de retroceso',
      'Llantas de aleación de 17 pulgadas',
      'Siete airbags',
    ],
    fichaExtra: {
      Motor: '2.8 TDI',
      Tracción: '4x4',
    },
  },
  {
    id: 'peugeot-3008-allure-2019',
    marca: 'Peugeot',
    modelo: '3008 1.6 THP Allure',
    anio: 2019,
    km: 96000,
    combustible: 'Nafta',
    transmision: 'Automática',
    tipo: 'suv',
    precio: null,
    moneda: 'ARS',
    estado: 'usado',
    destacado: false,
    disponible: true,

    verificado: true,

    financiable: true,
    etiquetas: ['Full'],
    fotos: [],
    descripcion:
      'SUV mediana con el interior i-Cockpit de Peugeot, uno de los más logrados del segmento. Caja automática de seis velocidades y equipamiento alto de serie.',
    equipamiento: [
      'Tablero digital configurable',
      'Climatizador bizona',
      'Techo panorámico',
      'Portón trasero eléctrico',
      'Sensores delanteros y traseros',
      'Cámara de retroceso',
      'Faros LED',
    ],
    fichaExtra: {
      Motor: '1.6 THP',
      Color: 'Gris',
    },
  },
  {
    id: 'volkswagen-polo-trendline-2022',
    marca: 'Volkswagen',
    modelo: 'Polo 1.6 MSI Trendline',
    anio: 2022,
    km: 39000,
    combustible: 'Nafta',
    transmision: 'Manual',
    tipo: 'hatchback',
    precio: null,
    moneda: 'ARS',
    estado: 'usado',
    destacado: false,
    disponible: true,

    verificado: true,

    financiable: true,
    etiquetas: ['Bajo kilometraje'],
    fotos: [],
    descripcion:
      'Polo Trendline con muy bajo kilometraje y único dueño. Plataforma MQB, excelente comportamiento en ruta y uno de los hatchbacks más seguros del segmento.',
    equipamiento: [
      'Aire acondicionado',
      'Pantalla multimedia con espejado de celular',
      'Control de estabilidad y tracción',
      'Cuatro airbags',
      'Levantavidrios eléctricos',
      'Alarma perimetral',
    ],
    fichaExtra: {
      Motor: '1.6 MSI',
      Color: 'Blanco',
    },
  },
  {
    id: 'renault-kangoo-furgon-2020',
    marca: 'Renault',
    modelo: 'Kangoo II Express Confort 1.6',
    anio: 2020,
    km: 108000,
    combustible: 'Nafta',
    transmision: 'Manual',
    tipo: 'suv',
    precio: null,
    moneda: 'ARS',
    estado: 'usado',
    destacado: false,
    disponible: true,

    verificado: true,

    financiable: true,
    etiquetas: ['Utilitario', 'Apta trabajo'],
    fotos: [],
    descripcion:
      'Kangoo Express Confort, utilitario liviano ideal para reparto y oficios. Unidad de flota con mantenimiento al día y espacio de carga en muy buen estado.',
    equipamiento: [
      'Aire acondicionado',
      'Dirección asistida',
      'Puerta lateral corrediza',
      'Portón trasero de doble hoja',
      'Airbag del conductor',
      'ABS',
    ],
    fichaExtra: {
      Motor: '1.6 16V',
      Carga: '800 kg',
    },
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
  moto: 'Moto',
};

/** Vehículos publicados, ordenados: destacados primero, luego más nuevos. */
function vehiculosPublicados(lista = VEHICULOS) {
  return lista
    .filter((v) => v.disponible !== false)
    .slice()
    .sort((a, b) => Number(b.destacado) - Number(a.destacado) || b.anio - a.anio);
}

/** "Toyota Yaris 1.5 XLS CVT 2019" */
function nombreVehiculo(v) {
  return `${v.marca} ${v.modelo} ${v.anio}`;
}

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
  if (km === 0) return '0 km';
  return `${new Intl.NumberFormat('es-AR').format(km)} km`;
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
    enlaceWhatsapp,
  };
}
