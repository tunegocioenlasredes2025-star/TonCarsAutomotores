/* ==========================================================================
   TON CARS — Comportamiento global
   Header pegajoso, menú móvil, animaciones de entrada, año del pie,
   render de destacados en la home y formulario de contacto por WhatsApp.
   ========================================================================== */

/* Iconos SVG inline — sin librerías externas, sin peticiones extra.
   Se declaran antes del IIFE porque las plantillas los usan al renderizar. */
const iconos = {
  calendario:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  ruta:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 12l4-3M7.5 15.5h9"/></svg>',
  combustible:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h12"/><path d="M14 9h3a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V9l-3-3"/><path d="M7 8h4"/></svg>',
  caja:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 4v16M12 4v16M18 4v10M4 7h16"/><circle cx="6" cy="20" r="1.4"/></svg>',
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.82 2.41 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.21.89 2.39 1.01 2.55.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z"/></svg>',
  chequeo:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12.5 5 5L20 6.5"/></svg>',
};

(function () {
  'use strict';

  /* Prefijo para armar rutas absolutas desde subcarpetas.
     Cada página declara data-raiz="" o data-raiz="../" en <body>. */
  const RAIZ = document.body.dataset.raiz ?? '';
  const url = (ruta) => RAIZ + ruta;

  const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------- Cortina de carga */
  /* Se muestra sólo la primera visita de la sesión y como mucho ~2 s. El CSS
     tiene además una animación de salida automática, así que aunque este
     bloque falle la cortina nunca deja la página tapada. */
  const cortina = document.getElementById('cortina');
  if (cortina) {
    const yaEntro = sessionStorage.getItem('tc-visto') === '1';

    if (yaEntro || menosMovimiento) {
      cortina.remove();
    } else {
      document.documentElement.classList.add('cargando');
      sessionStorage.setItem('tc-visto', '1');

      const cerrar = () => {
        if (!cortina.isConnected) return;
        cortina.classList.add('saliendo');
        document.documentElement.classList.remove('cargando');
        setTimeout(() => cortina.remove(), 800);
      };

      // Lo que ocurra primero: la carga completa (con un mínimo para que se
      // llegue a ver) o el tope de seguridad.
      const tope = setTimeout(cerrar, 2000);
      window.addEventListener('load', () => {
        setTimeout(() => {
          clearTimeout(tope);
          cerrar();
        }, 550);
      });
    }
  }

  /* ------------------------------- WhatsApp flotante diferido en la portada */
  const waFlotante = document.querySelector('.wa-flotante');
  const heroPortada = document.querySelector('.hero--portada');

  if (waFlotante && heroPortada) {
    waFlotante.classList.add('wa-flotante--diferido');

    const alternar = () => {
      const pasoElHero = window.scrollY > heroPortada.offsetHeight * 0.72;
      waFlotante.classList.toggle('visible', pasoElHero);
    };

    alternar();
    window.addEventListener('scroll', alternar, { passive: true });
  }

  /* ------------------------------------------------- Hero: video y parallax */
  const heroMedia = document.querySelector('.hero__media');
  if (heroMedia) {
    /* El video sólo se descarga en escritorio. En celular ni se pide: manda
       la foto y no gastamos datos del visitante.

       Se reproduce aunque el visitante tenga activado "reducir movimiento":
       es un plano de paisaje suave, con velo encima, y es contenido de marca
       (no un efecto decorativo). Las animaciones que sí pueden marear —zoom,
       grano y parallax— se siguen desactivando en ese caso, más abajo y en el
       CSS. Sin esto, quien tenga la preferencia activada (Windows la enciende
       sola con el ahorro de batería) vería sólo la foto fija. */
    const video = heroMedia.querySelector('.hero__video');
    const esEscritorio = window.matchMedia('(min-width: 900px)');

    if (video && esEscritorio.matches) {
      video.preload = 'auto';
      video.addEventListener('canplay', () => {
        video.play().then(
          () => video.classList.add('cargado'),
          () => {} // si el navegador bloquea el autoplay, queda la foto
        );
      });
      video.addEventListener('error', () => video.remove());
      video.load();
    }

    /* Parallax suave: la media se mueve a menos velocidad que el scroll. */
    if (!menosMovimiento) {
      const hero = heroMedia.closest('.hero');
      let pendiente = false;

      const mover = () => {
        pendiente = false;
        const y = window.scrollY;
        if (y > hero.offsetHeight) return; // fuera de pantalla, no calculamos
        heroMedia.style.transform = `translate3d(0, ${y * 0.32}px, 0)`;
      };

      window.addEventListener(
        'scroll',
        () => {
          if (pendiente) return;
          pendiente = true;
          requestAnimationFrame(mover);
        },
        { passive: true }
      );
      mover();
    }
  }

  /* ---------------------------------------------------------------- Header */
  const encabezado = document.querySelector('.encabezado');
  if (encabezado) {
    const alFijar = () => {
      encabezado.classList.toggle('encabezado--fijo', window.scrollY > 12);
    };
    alFijar();
    window.addEventListener('scroll', alFijar, { passive: true });
  }

  /* ----------------------------------------------------------- Menú móvil */
  const boton = document.querySelector('.hamburguesa');
  const menu = document.getElementById('menu-movil');

  if (boton && menu) {
    const cerrar = () => {
      boton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('abierto');
      document.body.classList.remove('sin-scroll');
    };

    boton.addEventListener('click', () => {
      const abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      menu.classList.toggle('abierto', !abierto);
      document.body.classList.toggle('sin-scroll', !abierto);
    });

    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', cerrar));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrar();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) cerrar();
    });
  }

  /* --------------------------------------------- Destacados en la portada */
  /* Se renderizan antes de montar el observador para que las tarjetas
     inyectadas también queden observadas. */
  const contenedorDestacados = document.getElementById('destacados');
  if (contenedorDestacados && typeof VEHICULOS !== 'undefined') {
    const destacados = vehiculosPublicados()
      .filter((v) => v.destacado)
      .slice(0, 3);
    contenedorDestacados.innerHTML = destacados.map(tarjetaVehiculo).join('');
  }

  /* -------------------------------------------------- Animaciones al hacer scroll */
  /* Se expone en window.revelar() para que catalogo.js y detalle.js puedan
     registrar las tarjetas que inyectan después. */
  const soportado = 'IntersectionObserver' in window;
  const observador = soportado
    ? new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              entrada.target.classList.add('visible');
              observador.unobserve(entrada.target);
            }
          });
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
      )
    : null;

  window.revelar = function (raiz = document) {
    raiz.querySelectorAll('.revelar:not(.visible)').forEach((el) => {
      if (observador) observador.observe(el);
      else el.classList.add('visible');
    });
  };

  window.revelar();

  /* ------------------------------------------------------- Año en el pie */
  document.querySelectorAll('[data-anio]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------- Enlaces genéricos de WhatsApp */
  document.querySelectorAll('[data-wa]').forEach((el) => {
    const contexto = el.dataset.wa;
    el.setAttribute('href', enlaceWhatsapp(null, contexto || undefined));
  });

  /* ------------------------------------ Formulario de contacto → WhatsApp */
  const form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const partes = [
        `Hola Ton Cars, soy ${(d.get('nombre') || '').toString().trim()}.`,
        d.get('interes') ? `Estoy buscando: ${d.get('interes')}.` : '',
        d.get('mensaje') ? `${(d.get('mensaje') || '').toString().trim()}` : '',
        d.get('telefono') ? `Mi teléfono: ${d.get('telefono')}.` : '',
        d.get('email') ? `Mi email: ${d.get('email')}.` : '',
      ].filter(Boolean);

      window.open(
        `https://wa.me/${TC.telefono}?text=${encodeURIComponent(partes.join('\n'))}`,
        '_blank',
        'noopener'
      );
    });
  }

  /* ------------------------------------------------------------ Plantilla */
  /* Expuesta en window para que la use también catalogo.js */
  function tarjetaVehiculo(v) {
    const precio = formatearPrecio(v);
    const foto = url(fotoPrincipal(v));
    const nombre = nombreVehiculo(v);
    const esPlaceholder = !(v.fotos && v.fotos.length);

    const etiquetas = [
      v.estado === '0km' ? '<span class="etiqueta etiqueta--azul">0 km</span>' : '',
      ...(v.etiquetas || []).map(
        (t, i) => `<span class="etiqueta${i === 0 ? ' etiqueta--rojo' : ''}">${t}</span>`
      ),
    ]
      .filter(Boolean)
      .join('');

    /* Aviso honesto: la placa de marca no es una foto de la unidad. */
    const avisoFotos = esPlaceholder
      ? '<p class="aviso-fotos">Fotos en preparación · pedilas por WhatsApp</p>'
      : '';

    return `
      <article class="vehiculo revelar">
        <div class="vehiculo__foto">
          ${etiquetas ? `<div class="etiquetas">${etiquetas}</div>` : ''}
          <img src="${foto}" alt="${esPlaceholder ? `${nombre} — fotos en preparación` : nombre}"
               loading="lazy" decoding="async" width="1000" height="688">
          ${avisoFotos}
        </div>
        <div class="vehiculo__cuerpo">
          <div class="vehiculo__titulo">
            <p class="vehiculo__marca">${v.marca}</p>
            <h3 class="vehiculo__modelo">
              <a class="cubrir" href="${url('vehiculos/' + v.id + '.html')}">${v.modelo}</a>
            </h3>
          </div>

          <dl class="vehiculo__ficha">
            ${dato(iconos.calendario, v.anio)}
            ${dato(iconos.ruta, formatearKm(v.km))}
            ${dato(iconos.combustible, v.combustible)}
            ${dato(iconos.caja, v.transmision)}
          </dl>

          <div class="vehiculo__pie">
            <div class="precio${precio ? '' : ' precio--consultar'}">
              <span class="precio__valor">${precio || 'Consultar precio'}</span>
              <span class="precio__nota">${precio ? (v.moneda === 'USD' ? 'Dólares' : 'Pesos') : 'Por WhatsApp'}</span>
            </div>
            <div class="vehiculo__acciones">
              <a class="btn btn--wa btn--chico" href="${enlaceWhatsapp(v)}"
                 target="_blank" rel="noopener" aria-label="Consultar el ${nombre} por WhatsApp">
                ${iconos.whatsapp} Consultar
              </a>
            </div>
          </div>
        </div>
      </article>`;
  }

  function dato(icono, valor) {
    return `<div class="dato">${icono}<span>${valor}</span></div>`;
  }

  window.tarjetaVehiculo = tarjetaVehiculo;
})();
