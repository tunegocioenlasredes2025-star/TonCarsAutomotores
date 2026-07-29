/* ==========================================================================
   TON CARS — Generador de las páginas fijas del sitio.

   Uso:  node tools/construir.mjs
   Escribe: index.html, catalogo/, nosotros/, servicios/, financiacion/,
            contacto/  y  site.webmanifest

   El contenido editorial de cada página vive acá abajo. Si hay que cambiar
   un texto, se cambia en este archivo y se vuelve a correr el script.
   ========================================================================== */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITIO,
  NEGOCIO,
  ICO,
  paginaHtml,
  franjaCta,
  heroInterno,
} from './plantilla.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

function escribir(ruta, html) {
  const destino = join(RAIZ, ruta);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, html, 'utf8');
  console.log(`  ${ruta}`);
}

/* ==========================================================================
   Schemas reutilizables
   ========================================================================== */
const SCHEMA_NEGOCIO = JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${SITIO}/#negocio`,
    name: NEGOCIO.nombre,
    alternateName: 'Ton Cars',
    slogan: NEGOCIO.slogan,
    description:
      'Agencia multimarca atendida por sus dueños. Compra, venta, permuta y consignación de autos usados, seminuevos y motos en Ingeniero Maschwitz, partido de Escobar.',
    url: `${SITIO}/`,
    logo: `${SITIO}/img/marca/logo.png`,
    image: `${SITIO}/img/marca/og.jpg`,
    telephone: '+54 9 11 3425-3399',
    priceRange: '$$',
    currenciesAccepted: 'ARS, USD',
    paymentAccepted: 'Efectivo, Transferencia, Financiación, Permuta',
    address: {
      '@type': 'PostalAddress',
      streetAddress: NEGOCIO.calle,
      addressLocality: NEGOCIO.localidad,
      addressRegion: NEGOCIO.provincia,
      addressCountry: 'AR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    sameAs: [NEGOCIO.instagram],
    areaServed: ['Ingeniero Maschwitz', 'Escobar', 'Garín', 'Pilar', 'Tigre', 'Belén de Escobar'].map(
      (name) => ({ '@type': 'City', name })
    ),
  },
  null,
  2
);

function schemaMigas(items) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map(([name, ruta], i) => ({
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

/* Migas visibles */
function migas(items) {
  const partes = items.map(([texto, href], i) =>
    i === items.length - 1
      ? `<span aria-current="page">${texto}</span>`
      : `<a href="${href}">${texto}</a>`
  );
  return `<nav class="migas" aria-label="Miga de pan">${partes.join(
    '<span aria-hidden="true">/</span>'
  )}</nav>`;
}

/* ==========================================================================
   HOME
   ========================================================================== */
const HOME = `
<section class="hero">
  <div class="hero__fondo" aria-hidden="true"></div>
  <div class="hero__rejilla" aria-hidden="true"></div>

  <div class="contenedor">
    <div class="hero__grilla">
      <div>
        <img class="hero__logo" src="img/marca/logo.webp" alt="${NEGOCIO.nombre}"
             width="900" height="672" fetchpriority="high" decoding="async">

        <h1>Tu próximo vehículo,<br><span class="destacado">con información clara.</span></h1>

        <p class="plomo hero__sub">
          Agencia multimarca en ${NEGOCIO.localidad}, atendida por sus dueños.
          Unidades seleccionadas, precios conversados de frente y una operación
          que entendés de principio a fin.
        </p>

        <div class="acciones acciones--apilada">
          <a class="btn btn--rojo btn--grande" href="catalogo/index.html">Ver vehículos ${ICO.flecha}</a>
          <a class="btn btn--fantasma btn--grande" data-wa href="#" target="_blank" rel="noopener">
            ${ICO.wa} Consultar por WhatsApp
          </a>
        </div>
      </div>

      <div class="hero__medios">
        <figure class="hero__foto">
          <img src="img/vehiculos/toyota-yaris-01.webp"
               alt="Toyota Yaris XLS gris exhibido en el salón de Ton Cars"
               width="1080" height="1350" fetchpriority="high" decoding="async">
          <figcaption class="hero__chapa">
            <strong>Toyota Yaris 1.5 XLS CVT</strong>
            <span>2019 · Detailing incluido</span>
          </figcaption>
        </figure>
      </div>
    </div>

    <dl class="indicadores revelar">
      <div class="indicador">
        <dd class="indicador__valor">100%</dd>
        <dt class="indicador__etiqueta">Financiación disponible, sujeta a evaluación</dt>
      </div>
      <div class="indicador">
        <dd class="indicador__valor">Multi</dd>
        <dt class="indicador__etiqueta">Agencia multimarca: autos, utilitarios y motos</dt>
      </div>
      <div class="indicador">
        <dd class="indicador__valor">Dueños</dd>
        <dt class="indicador__etiqueta">Atendido siempre por sus dueños</dt>
      </div>
      <div class="indicador">
        <dd class="indicador__valor">Maschwitz</dd>
        <dt class="indicador__etiqueta">${NEGOCIO.calle}</dt>
      </div>
    </dl>
  </div>
</section>

<section class="seccion seccion--alt" aria-labelledby="t-destacados">
  <div class="contenedor">
    <div class="cabecera-seccion revelar">
      <p class="eyebrow">Unidades disponibles</p>
      <h2 id="t-destacados">Seleccionadas una por una</h2>
      <p class="plomo">
        Cada unidad que publicamos pasó por revisión y detailing antes de entrar
        al salón. Si querés ver el listado completo, entrá al catálogo.
      </p>
    </div>

    <div class="grilla-vehiculos" id="destacados"></div>

    <div class="acciones mt-l revelar">
      <a class="btn btn--fantasma btn--grande" href="catalogo/index.html">Ver el catálogo completo ${ICO.flecha}</a>
    </div>
  </div>
</section>

<section class="seccion" aria-labelledby="t-porque">
  <div class="contenedor">
    <div class="cabecera-seccion revelar">
      <p class="eyebrow">${NEGOCIO.slogan}</p>
      <h2 id="t-porque">Por qué elegir Ton Cars</h2>
    </div>

    <div class="grilla grilla--3">
      ${[
        [
          ICO.escudo,
          'Unidades seleccionadas',
          'No publicamos todo lo que aparece. Revisamos cada vehículo antes de ofrecerlo y te contamos su historia real, sin sorpresas después de la entrega.',
        ],
        [
          ICO.billetera,
          'Financiación y permutas',
          'Trabajamos con financiación y anticipo según tu situación, y tomamos tu usado como parte de pago. Evaluamos alternativas antes de que vengas al salón.',
        ],
        [
          ICO.personas,
          'Atendido por sus dueños',
          'Hablás siempre con quien decide. Sin intermediarios, sin vendedores rotativos y sin que te pasen de mano en mano hasta que aparezca la letra chica.',
        ],
        [
          ICO.reloj,
          'Rapidez en la operación',
          'Documentación, transferencia y verificación resueltas con tiempos claros. Te decimos qué falta, quién lo hace y cuándo podés retirar la unidad.',
        ],
        [
          ICO.brillo,
          'Detailing antes de entregar',
          'Lavado técnico, limpieza de interiores y puesta a punto estética. La unidad que ves publicada es la misma que retirás el día de la entrega.',
        ],
        [
          ICO.pin,
          'Salón propio en Maschwitz',
          'Estamos sobre la colectora del Ramal Escobar. Vení a ver la unidad, probala y llevate la respuesta en el momento, no por teléfono.',
        ],
      ]
        .map(
          ([ico, titulo, texto], i) => `
      <article class="tarjeta revelar"${i % 3 ? ` data-retardo="${i % 3}"` : ''}>
        <div class="tarjeta__icono">${ico}</div>
        <h3>${titulo}</h3>
        <p>${texto}</p>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="seccion seccion--alt" aria-labelledby="t-proceso">
  <div class="contenedor">
    <div class="cabecera-seccion revelar">
      <p class="eyebrow">Cómo trabajamos</p>
      <h2 id="t-proceso">Comprar tu próximo auto puede ser más simple</h2>
      <p class="plomo">Cuatro pasos, sin vueltas. La mayoría de las consultas se resuelven el mismo día.</p>
    </div>

    <ol class="pasos">
      ${[
        ['Contanos qué buscás', 'Escribinos por WhatsApp con el tipo de vehículo, el uso que le vas a dar y el presupuesto con el que contás.'],
        ['Conocé las opciones', 'Te mandamos las unidades disponibles que entran en lo que buscás, con fotos, kilometraje y estado real.'],
        ['Evaluamos la forma de pago', 'Contado, financiación con anticipo o permuta de tu usado. Vemos juntos qué combinación te conviene.'],
        ['Coordinamos tu visita', 'Venís al salón, ves la unidad, la probás y cerramos la operación con todo por escrito.'],
      ]
        .map(
          ([titulo, texto], i) => `
      <li class="paso revelar"${i ? ` data-retardo="${i}"` : ''}>
        <h3>${titulo}</h3>
        <p>${texto}</p>
      </li>`
        )
        .join('')}
    </ol>
  </div>
</section>

<section class="seccion" aria-labelledby="t-servicios">
  <div class="contenedor">
    <div class="cabecera-seccion revelar">
      <p class="eyebrow">Qué hacemos</p>
      <h2 id="t-servicios">No sólo vendemos autos</h2>
    </div>

    <div class="grilla grilla--4">
      ${[
        ['Venta', 'Autos, utilitarios y motos usadas, seminuevas y 0 km de todas las marcas.'],
        ['Compra', 'Compramos tu vehículo en el día, con tasación honesta y pago inmediato.'],
        ['Permuta', 'Entregá tu usado como parte de pago y completá la diferencia como te sirva.'],
        ['Consignación', 'Dejás tu unidad en nuestro salón y nos ocupamos de exhibirla y venderla.'],
      ]
        .map(
          ([titulo, texto], i) => `
      <article class="tarjeta revelar"${i ? ` data-retardo="${i}"` : ''}>
        <p class="tarjeta__num">0${i + 1}</p>
        <h3>${titulo}</h3>
        <p>${texto}</p>
      </article>`
        )
        .join('')}
    </div>

    <div class="acciones mt-l revelar">
      <a class="enlace-flecha" href="servicios/index.html">Ver todos los servicios ${ICO.flecha}</a>
    </div>
  </div>
</section>

${franjaCta({ raiz: '' })}
`;

/* ==========================================================================
   CATÁLOGO
   ========================================================================== */
const CATALOGO = `
${heroInterno({
  migas: migas([['Inicio', '../index.html'], ['Catálogo', '']]),
  eyebrow: 'Unidades disponibles',
  titulo: 'Catálogo de vehículos',
  texto:
    'Autos, utilitarios y motos revisados unidad por unidad. Filtrá por marca, año, precio o combustible y consultá la que te interese directo por WhatsApp.',
})}

<section class="seccion" style="padding-top:34px">
  <div class="contenedor">

    <form class="panel-filtros" id="filtros" role="search" onsubmit="return false">
      <div class="buscador">
        ${ICO.lupa}
        <label class="solo-lectores" for="f-buscar">Buscar vehículo</label>
        <input class="campo" type="search" id="f-buscar" name="q"
               placeholder="Buscar por marca, modelo o año — por ejemplo: Hilux 4x4" autocomplete="off">
      </div>

      <div class="chips" role="group" aria-label="Filtrar por tipo de vehículo">
        <button class="chip" type="button" data-tipo="todos" aria-pressed="true">Todos</button>
        <button class="chip" type="button" data-tipo="hatchback" aria-pressed="false">Hatchback</button>
        <button class="chip" type="button" data-tipo="sedan" aria-pressed="false">Sedán</button>
        <button class="chip" type="button" data-tipo="suv" aria-pressed="false">SUV</button>
        <button class="chip" type="button" data-tipo="pickup" aria-pressed="false">Pickup</button>
        <button class="chip" type="button" data-tipo="moto" aria-pressed="false">Motos</button>
      </div>

      <details class="filtros-mas" id="filtros-mas" open>
      <summary>Más filtros<span class="solo-lectores"> (marca, modelo, año, precio y combustible)</span></summary>
      <div class="filtros__fila">
        <div class="campo-grupo">
          <label for="f-marca">Marca</label>
          <select class="campo" id="f-marca"></select>
        </div>
        <div class="campo-grupo">
          <label for="f-modelo">Modelo</label>
          <select class="campo" id="f-modelo"></select>
        </div>
        <div class="campo-grupo">
          <label for="f-anio">Año</label>
          <select class="campo" id="f-anio"></select>
        </div>
        <div class="campo-grupo">
          <label for="f-precio">Precio</label>
          <select class="campo" id="f-precio">
            <option value="">Cualquiera</option>
            <option value="hasta-15">Hasta $15.000.000</option>
            <option value="15-25">$15.000.000 a $25.000.000</option>
            <option value="25-40">$25.000.000 a $40.000.000</option>
            <option value="desde-40">Más de $40.000.000</option>
          </select>
        </div>
        <div class="campo-grupo">
          <label for="f-combustible">Combustible</label>
          <select class="campo" id="f-combustible"></select>
        </div>
      </div>
      </details>

      <div class="filtros__pie">
        <p class="contador" id="contador" aria-live="polite"></p>
        <div class="acciones">
          <div class="campo-grupo">
            <label class="solo-lectores" for="f-orden">Ordenar por</label>
            <select class="campo" id="f-orden" style="padding-block:9px">
              <option value="relevancia">Más relevantes</option>
              <option value="anio-desc">Año: más nuevos</option>
              <option value="anio-asc">Año: más antiguos</option>
              <option value="km-asc">Menos kilómetros</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
          <button class="limpiar" type="button" id="limpiar">${ICO.cruz} Limpiar filtros</button>
        </div>
      </div>
    </form>

    <div class="grilla-vehiculos" id="grilla-catalogo"></div>

    <div class="vacio" id="sin-resultados">
      ${ICO.lupa}
      <h3>No encontramos unidades con esos filtros</h3>
      <p class="plomo">Probá quitando algún filtro, o escribinos y buscamos la unidad que necesitás.</p>
      <a class="btn btn--wa" data-wa="Hola Ton Cars, no encontré en la web lo que busco. ¿Me pueden ayudar a conseguir una unidad?" href="#" target="_blank" rel="noopener">
        ${ICO.wa} Pedir una búsqueda
      </a>
    </div>

  </div>
</section>

${franjaCta({
  raiz: '../',
  eyebrow: '¿No encontrás la unidad?',
  titulo: 'Te la buscamos',
  texto:
    'Trabajamos con una red de proveedores en todo el país. Decinos qué modelo, año y presupuesto tenés en mente y te conseguimos opciones.',
})}
`;

/* ==========================================================================
   NOSOTROS
   ========================================================================== */
const NOSOTROS = `
${heroInterno({
  migas: migas([['Inicio', '../index.html'], ['Nosotros', '']]),
  eyebrow: 'Quiénes somos',
  titulo: 'El concesionario que buscás,<br><span class="destacado">atendido por sus dueños</span>',
  texto:
    'Somos una agencia multimarca en Ingeniero Maschwitz. Trabajamos de una sola manera: mostrando el vehículo como es, explicando la operación completa y respondiendo nosotros mismos cada consulta.',
})}

<section class="seccion" style="padding-top:44px">
  <div class="contenedor">
    <div class="detalle">
      <div>
        <div class="bloque-detalle revelar">
          <h2>Nuestra historia</h2>
          <p class="plomo">
            Ton Cars nació de algo simple: comprar un auto usado en Argentina suele
            ser una experiencia incómoda. Precios que cambian, kilometrajes que no
            cierran, gente que te atiende distinto antes y después de la seña.
          </p>
          <p class="plomo">
            Armamos la agencia para hacer exactamente lo contrario. Un salón propio
            sobre la colectora del Ramal Escobar, unidades que revisamos antes de
            publicarlas y una regla que no negociamos: el que te atiende es el dueño,
            de la primera consulta hasta la entrega de la llave.
          </p>
          <p class="plomo">
            Hoy trabajamos con autos, utilitarios y motos de todas las marcas, con
            financiación, permutas y consignación. Y seguimos entregando cada unidad
            con detailing hecho, porque la primera impresión al recibir el vehículo
            también es parte del trato.
          </p>
        </div>

        <div class="bloque-detalle revelar">
          <h2>Cómo trabajamos</h2>
          <ul class="equipamiento">
            ${[
              'Revisamos cada unidad antes de publicarla',
              'Te mostramos el estado real, sin maquillar',
              'Precio conversado de frente, sin sorpresas',
              'Financiación y anticipo según tu situación',
              'Tomamos tu usado como parte de pago',
              'Transferencia y documentación con plazos claros',
              'Detailing completo antes de la entrega',
              'Seguimiento después de que te llevás el vehículo',
            ]
              .map((t) => `<li>${ICO.tilde}<span>${t}</span></li>`)
              .join('\n            ')}
          </ul>
        </div>
      </div>

      <aside>
        <figure class="hero__foto revelar" style="aspect-ratio:4/5">
          <img src="../img/marca/local.webp" alt="Frente del salón de Ton Cars en Ingeniero Maschwitz"
               width="1000" height="1250" loading="lazy" decoding="async">
        </figure>
        <div class="panel-compra mt-m revelar" style="position:static">
          <div>
            <p class="eyebrow">Visitanos</p>
            <h3 class="mt-s">${NEGOCIO.calle}</h3>
            <p class="tenue" style="font-size:.92rem">${NEGOCIO.localidad}, ${NEGOCIO.partido}, ${NEGOCIO.provincia}</p>
          </div>
          <dl class="horarios">
            <div><dt>Lunes a viernes</dt><dd>9:00 a 18:00</dd></div>
            <div><dt>Sábados</dt><dd>10:00 a 14:00</dd></div>
            <div class="cerrado"><dt>Domingos</dt><dd>Cerrado</dd></div>
          </dl>
          <a class="btn btn--wa btn--bloque" data-wa href="#" target="_blank" rel="noopener">
            ${ICO.wa} Coordinar una visita
          </a>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="seccion seccion--alt" aria-labelledby="t-proceso-nos">
  <div class="contenedor">
    <div class="cabecera-seccion revelar">
      <p class="eyebrow">Proceso de compra</p>
      <h2 id="t-proceso-nos">De la consulta a la llave</h2>
      <p class="plomo">Así se ve una operación con nosotros, paso por paso.</p>
    </div>

    <ol class="pasos">
      ${[
        ['Primer contacto', 'Nos escribís por WhatsApp o venís al salón. Contanos qué buscás, para qué lo vas a usar y con qué presupuesto contás.'],
        ['Selección de unidades', 'Te mostramos lo que tenemos disponible que entra en tu búsqueda, con fotos reales, kilometraje y estado documentado.'],
        ['Prueba y revisión', 'Venís, ves la unidad, la probás y, si querés, la llevás a revisar con tu mecánico de confianza. Sin problema.'],
        ['Cierre y entrega', 'Definimos forma de pago, hacemos la documentación y te entregamos el vehículo con detailing completo.'],
      ]
        .map(
          ([titulo, texto], i) => `
      <li class="paso revelar"${i ? ` data-retardo="${i}"` : ''}>
        <h3>${titulo}</h3>
        <p>${texto}</p>
      </li>`
        )
        .join('')}
    </ol>
  </div>
</section>

${franjaCta({ raiz: '../' })}
`;

/* ==========================================================================
   SERVICIOS
   ========================================================================== */
const SERVICIOS_LISTA = [
  [
    ICO.auto,
    'Venta de vehículos',
    'Autos, utilitarios y motos usadas, seminuevas y 0 km. Agencia multimarca: si la unidad no está en el salón, la buscamos.',
    ['Usados y seminuevos revisados', 'Unidades 0 km de todas las marcas', 'Autos, utilitarios y motos', 'Entrega con detailing completo'],
  ],
  [
    ICO.llave,
    'Compramos tu vehículo',
    'Si querés vender, te tasamos la unidad y te hacemos una oferta concreta. Operación cerrada en el día y pago inmediato.',
    ['Tasación sin compromiso', 'Oferta en el momento', 'Pago inmediato', 'Nos ocupamos de toda la documentación'],
  ],
  [
    ICO.cambio,
    'Permutas',
    'Entregá tu usado como parte de pago del vehículo que te llevás. Ajustamos la diferencia con contado, financiación o una combinación.',
    ['Tomamos autos y motos', 'Tasación transparente', 'Diferencia financiable', 'Trámite unificado en una sola operación'],
  ],
  [
    ICO.papeles,
    'Consignación',
    'Dejás tu unidad en nuestro salón y nos ocupamos de exhibirla, fotografiarla, atender las consultas y cerrar la venta por vos.',
    ['Exhibición en el salón', 'Fotos y publicación profesional', 'Filtramos las consultas', 'Cobrás cuando se concreta'],
  ],
  [
    ICO.billetera,
    'Financiación',
    'Trabajamos con distintas alternativas de financiación con anticipo, sujetas a evaluación crediticia. Vemos qué plan entra en tu presupuesto.',
    ['Financiación con anticipo', 'Sujeto a evaluación crediticia', 'Distintos plazos disponibles', 'Te decimos el número final antes de firmar'],
  ],
  [
    ICO.brillo,
    'Detailing',
    'Lavado técnico, tratamiento de pintura y limpieza profunda de interiores. Todas nuestras unidades salen así, y también lo hacemos como servicio aparte.',
    ['Lavado técnico exterior', 'Pulido y tratamiento de pintura', 'Limpieza profunda de interiores', 'Preparación de la unidad para la venta'],
  ],
];

const SERVICIOS = `
${heroInterno({
  migas: migas([['Inicio', '../index.html'], ['Servicios', '']]),
  eyebrow: 'Qué hacemos',
  titulo: 'Servicios',
  texto:
    'No sólo vendemos autos. Compramos, tomamos permutas, recibimos unidades en consignación, gestionamos financiación y preparamos cada vehículo con detailing propio.',
})}

<section class="seccion" style="padding-top:44px">
  <div class="contenedor">
    <div class="grilla grilla--2">
      ${SERVICIOS_LISTA.map(
        ([ico, titulo, texto, puntos], i) => `
      <article class="tarjeta revelar"${i % 2 ? ' data-retardo="1"' : ''} style="padding:30px 26px">
        <div class="tarjeta__icono">${ico}</div>
        <h3>${titulo}</h3>
        <p>${texto}</p>
        <ul class="panel-compra__lista mt-s">
          ${puntos.map((p) => `<li>${ICO.tilde}<span>${p}</span></li>`).join('\n          ')}
        </ul>
      </article>`
      ).join('')}
    </div>
  </div>
</section>

<section class="seccion seccion--alt" aria-labelledby="t-faq-serv">
  <div class="contenedor">
    <div class="cabecera-seccion revelar">
      <p class="eyebrow">Dudas frecuentes</p>
      <h2 id="t-faq-serv">Preguntas que nos hacen seguido</h2>
    </div>

    <div class="faq revelar">
      ${[
        [
          '¿Puedo llevar el auto a revisar con mi mecánico?',
          'Sí, y nos parece bien que lo hagas. Coordinamos un horario y vas con la unidad a tu taller de confianza antes de decidir.',
        ],
        [
          '¿Toman mi auto usado como parte de pago?',
          'Sí. Tomamos autos y motos en permuta. Lo tasamos, te decimos cuánto vale para nosotros y la diferencia la arreglamos en contado, financiación o una combinación.',
        ],
        [
          '¿Trabajan con vehículos fuera del salón?',
          'Sí. Somos agencia multimarca y trabajamos con proveedores en todo el país. Si buscás un modelo puntual que no tenemos, decinos cuál y te conseguimos opciones.',
        ],
        [
          '¿Qué incluye la entrega?',
          'La unidad entregada con detailing completo, la documentación en regla y el trámite de transferencia iniciado. Te explicamos plazos antes de cerrar.',
        ],
        [
          '¿Puedo dejar mi vehículo en consignación?',
          'Sí. Lo exhibimos en el salón, lo publicamos con fotos profesionales y atendemos las consultas. Vos cobrás cuando la venta se concreta.',
        ],
      ]
        .map(
          ([p, r]) => `
      <details>
        <summary>${p}</summary>
        <p>${r}</p>
      </details>`
        )
        .join('')}
    </div>
  </div>
</section>

${franjaCta({
  raiz: '../',
  eyebrow: 'Hablemos',
  titulo: '¿Cuál de estos servicios necesitás?',
  texto: 'Escribinos contando tu caso y te respondemos con una propuesta concreta.',
})}
`;

/* ==========================================================================
   FINANCIACIÓN
   ========================================================================== */
const FINANCIACION = `
${heroInterno({
  migas: migas([['Inicio', '../index.html'], ['Financiación', '']]),
  eyebrow: 'Formas de pago',
  titulo: 'Tu anticipo puede acercarte<br><span class="destacado">a tu próximo auto</span>',
  texto:
    'Trabajamos con financiación con anticipo, sujeta a evaluación crediticia. Contanos tu situación y evaluamos juntos qué alternativa entra en tu presupuesto.',
})}

<section class="seccion" style="padding-top:44px">
  <div class="contenedor">
    <div class="grilla grilla--3">
      ${[
        [ICO.billetera, 'Contado', 'La operación más simple y con el mejor precio. Efectivo o transferencia, con la documentación cerrada en el momento.'],
        [ICO.calc, 'Financiación con anticipo', 'Entregás un anticipo y financiás el resto. El monto, el plazo y la cuota dependen de la evaluación crediticia.'],
        [ICO.cambio, 'Permuta', 'Tu usado entra como parte de pago. La diferencia la completás en contado, financiada, o combinando las dos.'],
      ]
        .map(
          ([ico, titulo, texto], i) => `
      <article class="tarjeta revelar"${i ? ` data-retardo="${i}"` : ''}>
        <div class="tarjeta__icono">${ico}</div>
        <h3>${titulo}</h3>
        <p>${texto}</p>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="seccion seccion--alt">
  <div class="contenedor">
    <div class="detalle">
      <div>
        <div class="bloque-detalle revelar">
          <p class="eyebrow">Cómo seguimos</p>
          <h2>Qué necesitamos para evaluarte</h2>
          <p class="plomo">
            No hace falta que vengas con todo resuelto. Con estos datos ya podemos
            decirte si la operación es viable y con qué números aproximados.
          </p>
          <ul class="equipamiento mt-s">
            ${[
              'Qué vehículo te interesa',
              'Con cuánto anticipo contás',
              'Si tenés un usado para entregar',
              'Tu situación laboral (relación de dependencia, monotributo, autónomo)',
              'Qué cuota mensual te resulta cómoda',
            ]
              .map((t) => `<li>${ICO.tilde}<span>${t}</span></li>`)
              .join('\n            ')}
          </ul>
        </div>

        <div class="bloque-detalle revelar">
          <h2>Preguntas frecuentes</h2>
          <div class="faq">
            ${[
              [
                '¿Cuánto anticipo necesito?',
                'Depende de la unidad y de la evaluación crediticia. En general, cuanto mayor sea el anticipo, mejores condiciones conseguís. Escribinos con el vehículo que te interesa y te damos un número concreto.',
              ],
              [
                '¿Puedo financiar si soy monotributista?',
                'Sí. Trabajamos con distintas alternativas según la situación de cada persona. La evaluación define el monto y el plazo disponibles.',
              ],
              [
                '¿La cuota es fija?',
                'Depende del plan que se apruebe. Antes de que firmes nada te mostramos el detalle completo: anticipo, cantidad de cuotas, valor y cómo se ajusta.',
              ],
              [
                '¿Puedo combinar permuta y financiación?',
                'Sí, es lo más habitual. Tu usado cubre parte del anticipo y el resto se financia. Lo armamos en una sola operación.',
              ],
            ]
              .map(([p, r]) => `<details><summary>${p}</summary><p>${r}</p></details>`)
              .join('\n            ')}
          </div>
        </div>
      </div>

      <aside>
        <div class="panel-compra revelar">
          <div>
            <p class="eyebrow">Consulta sin compromiso</p>
            <h3 class="mt-s">Pedí tu evaluación</h3>
            <p class="tenue" style="font-size:.93rem">
              Te respondemos con las alternativas concretas para el vehículo que te interesa.
            </p>
          </div>
          <a class="btn btn--wa btn--bloque btn--grande"
             data-wa="Hola Ton Cars, quiero consultar por financiación. Les cuento: el vehículo que me interesa es ___, cuento con un anticipo de ___ y mi situación laboral es ___."
             href="#" target="_blank" rel="noopener">
            ${ICO.wa} Consultar financiación
          </a>
          <ul class="panel-compra__lista">
            <li>${ICO.tilde}<span>Respuesta el mismo día hábil</span></li>
            <li>${ICO.tilde}<span>Sin costo ni compromiso</span></li>
            <li>${ICO.tilde}<span>Te mostramos el número final antes de firmar</span></li>
          </ul>
          <p class="nota-form">
            Toda financiación está sujeta a evaluación y aprobación crediticia. Las
            condiciones finales (anticipo, cantidad de cuotas y valor) se confirman
            al momento de la operación.
          </p>
        </div>
      </aside>
    </div>
  </div>
</section>

${franjaCta({
  raiz: '../',
  eyebrow: 'Financiación',
  titulo: 'Contanos con cuánto contás',
  texto: 'Con el anticipo y el vehículo que te interesa ya podemos darte una respuesta concreta.',
})}
`;

/* ==========================================================================
   CONTACTO
   ========================================================================== */
const MAPA =
  'https://www.google.com/maps?q=' +
  encodeURIComponent('Colectora Este 215, Ingeniero Maschwitz, Escobar, Buenos Aires') +
  '&output=embed';

const CONTACTO = `
${heroInterno({
  migas: migas([['Inicio', '../index.html'], ['Contacto', '']]),
  eyebrow: 'Estamos en Ingeniero Maschwitz',
  titulo: 'Contacto',
  texto:
    'Escribinos por WhatsApp, mandanos el formulario o vení directamente al salón. Te respondemos nosotros, no un contestador.',
})}

<section class="seccion" style="padding-top:44px">
  <div class="contenedor">
    <div class="contacto-grilla">

      <form class="formulario revelar" id="form-contacto" novalidate>
        <div>
          <p class="eyebrow">Dejanos tu consulta</p>
          <h2 class="mt-s" style="font-size:clamp(1.5rem,4.5vw,2rem)">Contanos qué estás buscando</h2>
        </div>

        <div class="formulario__fila formulario__fila--2">
          <div class="campo-grupo">
            <label for="nombre">Nombre y apellido *</label>
            <input class="campo" type="text" id="nombre" name="nombre" required autocomplete="name" placeholder="Tu nombre">
          </div>
          <div class="campo-grupo">
            <label for="telefono">Teléfono</label>
            <input class="campo" type="tel" id="telefono" name="telefono" autocomplete="tel" placeholder="11 5555-5555">
          </div>
        </div>

        <div class="campo-grupo">
          <label for="email">Email</label>
          <input class="campo" type="email" id="email" name="email" autocomplete="email" placeholder="tunombre@mail.com">
        </div>

        <div class="campo-grupo">
          <label for="interes">¿Qué te interesa?</label>
          <select class="campo" id="interes" name="interes">
            <option value="">Elegí una opción</option>
            <option>Comprar un vehículo</option>
            <option>Vender mi vehículo</option>
            <option>Permutar mi vehículo</option>
            <option>Dejar mi vehículo en consignación</option>
            <option>Consultar por financiación</option>
            <option>Servicio de detailing</option>
            <option>Otra consulta</option>
          </select>
        </div>

        <div class="campo-grupo">
          <label for="mensaje">Mensaje</label>
          <textarea class="campo" id="mensaje" name="mensaje"
                    placeholder="Contanos el modelo que buscás, el uso que le vas a dar y tu presupuesto aproximado."></textarea>
        </div>

        <button class="btn btn--wa btn--bloque btn--grande" type="submit">
          ${ICO.wa} Enviar por WhatsApp
        </button>

        <p class="nota-form">
          Al enviar se abre WhatsApp con tu consulta ya escrita para que la revises
          antes de mandarla. Usamos tus datos únicamente para responderte.
        </p>
      </form>

      <div>
        <dl class="datos-contacto revelar">
          <div class="dato-contacto">
            <div class="dato-contacto__icono">${ICO.wa}</div>
            <div>
              <dt>WhatsApp</dt>
              <dd><a data-wa href="#" target="_blank" rel="noopener">${NEGOCIO.telefonoVisible}</a></dd>
            </div>
          </div>
          <div class="dato-contacto">
            <div class="dato-contacto__icono">${ICO.tel}</div>
            <div>
              <dt>Teléfono</dt>
              <dd><a href="tel:+${NEGOCIO.telefono}">+54 9 ${NEGOCIO.telefonoVisible}</a></dd>
            </div>
          </div>
          <div class="dato-contacto">
            <div class="dato-contacto__icono">${ICO.ig}</div>
            <div>
              <dt>Instagram</dt>
              <dd><a href="${NEGOCIO.instagram}" target="_blank" rel="noopener">${NEGOCIO.instagramUsuario}</a></dd>
            </div>
          </div>
          <div class="dato-contacto">
            <div class="dato-contacto__icono">${ICO.pin}</div>
            <div>
              <dt>Dirección</dt>
              <dd>${NEGOCIO.calle}<br>${NEGOCIO.localidad}, ${NEGOCIO.partido}</dd>
            </div>
          </div>
        </dl>

        <div class="mt-m revelar">
          <h3 style="font-size:1rem;margin-bottom:12px">${ICO.reloj ? '' : ''}Horarios de atención</h3>
          <dl class="horarios">
            <div><dt>Lunes a viernes</dt><dd>9:00 a 18:00</dd></div>
            <div><dt>Sábados</dt><dd>10:00 a 14:00</dd></div>
            <div class="cerrado"><dt>Domingos y feriados</dt><dd>Cerrado</dd></div>
          </dl>
        </div>

        <div class="mapa mt-m revelar">
          <iframe src="${MAPA}" title="Ubicación de Ton Cars en Ingeniero Maschwitz"
                  loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        </div>
      </div>

    </div>
  </div>
</section>
`;

/* ==========================================================================
   Manifest
   ========================================================================== */
const MANIFEST = JSON.stringify(
  {
    name: NEGOCIO.nombre,
    short_name: 'Ton Cars',
    description: 'Agencia multimarca en Ingeniero Maschwitz. Autos, utilitarios y motos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080b12',
    theme_color: '#080b12',
    lang: 'es-AR',
    icons: [
      { src: '/favicon/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon/favicon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  null,
  2
);

/* ==========================================================================
   Escritura
   ========================================================================== */
console.log('Generando páginas fijas:');

escribir(
  'index.html',
  paginaHtml({
    raiz: '',
    ruta: '',
    titulo: 'Ton Cars Automotores | Agencia multimarca en Ingeniero Maschwitz',
    descripcion:
      'Agencia multimarca atendida por sus dueños en Ingeniero Maschwitz. Autos usados y seminuevos seleccionados, motos, financiación y permutas. Consultá por WhatsApp al 11 3425-3399.',
    preload: ['img/marca/logo.webp', 'img/vehiculos/toyota-yaris-01.webp'],
    schema: [
      SCHEMA_NEGOCIO,
      JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: NEGOCIO.nombre,
          url: `${SITIO}/`,
          inLanguage: 'es-AR',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITIO}/catalogo/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        null,
        2
      ),
    ],
    contenido: HOME,
  })
);

escribir(
  'catalogo/index.html',
  paginaHtml({
    raiz: '../',
    ruta: 'catalogo/',
    titulo: 'Catálogo de autos usados y motos | Ton Cars Automotores',
    descripcion:
      'Autos usados, seminuevos, utilitarios y motos disponibles en Ton Cars, Ingeniero Maschwitz. Filtrá por marca, modelo, año, precio y combustible. Consultá cada unidad por WhatsApp.',
    scripts: ['catalogo.js'],
    schema: [
      SCHEMA_NEGOCIO,
      schemaMigas([
        ['Inicio', ''],
        ['Catálogo', 'catalogo/'],
      ]),
    ],
    contenido: CATALOGO,
  })
);

escribir(
  'nosotros/index.html',
  paginaHtml({
    raiz: '../',
    ruta: 'nosotros/',
    titulo: 'Nosotros | Ton Cars Automotores, agencia multimarca en Maschwitz',
    descripcion:
      'Conocé Ton Cars: agencia multimarca en Ingeniero Maschwitz atendida por sus dueños. Nuestra historia, cómo trabajamos y el proceso de compra paso a paso.',
    schema: [
      SCHEMA_NEGOCIO,
      schemaMigas([
        ['Inicio', ''],
        ['Nosotros', 'nosotros/'],
      ]),
    ],
    contenido: NOSOTROS,
  })
);

escribir(
  'servicios/index.html',
  paginaHtml({
    raiz: '../',
    ruta: 'servicios/',
    titulo: 'Servicios | Venta, compra, permuta y consignación — Ton Cars',
    descripcion:
      'Venta y compra de vehículos, permutas, consignación, financiación y detailing en Ingeniero Maschwitz. Ton Cars, agencia multimarca atendida por sus dueños.',
    schema: [
      SCHEMA_NEGOCIO,
      schemaMigas([
        ['Inicio', ''],
        ['Servicios', 'servicios/'],
      ]),
    ],
    contenido: SERVICIOS,
  })
);

escribir(
  'financiacion/index.html',
  paginaHtml({
    raiz: '../',
    ruta: 'financiacion/',
    titulo: 'Financiación de autos usados | Ton Cars Automotores',
    descripcion:
      'Financiación con anticipo para autos usados y motos en Ingeniero Maschwitz, sujeta a evaluación crediticia. Contado, financiado o con permuta de tu usado.',
    schema: [
      SCHEMA_NEGOCIO,
      schemaMigas([
        ['Inicio', ''],
        ['Financiación', 'financiacion/'],
      ]),
    ],
    contenido: FINANCIACION,
  })
);

escribir(
  'contacto/index.html',
  paginaHtml({
    raiz: '../',
    ruta: 'contacto/',
    titulo: 'Contacto | Ton Cars Automotores — Colectora Este 215, Maschwitz',
    descripcion:
      'Contactate con Ton Cars: WhatsApp 11 3425-3399, Instagram @toncarsdetails o vení al salón en Colectora Este 215, Ramal Escobar, Ingeniero Maschwitz.',
    schema: [
      SCHEMA_NEGOCIO,
      schemaMigas([
        ['Inicio', ''],
        ['Contacto', 'contacto/'],
      ]),
    ],
    contenido: CONTACTO,
  })
);

escribir('site.webmanifest', MANIFEST + '\n');

console.log('Listo.');
