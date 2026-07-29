/* ==========================================================================
   TON CARS — Página de detalle de vehículo
   Galería (miniaturas, flechas, teclado, swipe) y vehículos relacionados.
   El id de la unidad viaja en <body data-vehiculo="...">.
   ========================================================================== */
(function () {
  'use strict';

  const id = document.body.dataset.vehiculo;
  if (!id || typeof VEHICULOS === 'undefined') return;

  const RAIZ = document.body.dataset.raiz ?? '';
  const vehiculo = VEHICULOS.find((v) => v.id === id);
  if (!vehiculo) return;

  /* ------------------------------------------------------------- Galería */
  const principal = document.getElementById('galeria-principal');
  const tiras = document.getElementById('galeria-tiras');
  const contador = document.getElementById('galeria-contador');
  const fotos = fotosVehiculo(vehiculo);
  const nombre = nombreVehiculo(vehiculo);
  let indice = 0;

  if (principal) {
    function mostrar(n) {
      indice = (n + fotos.length) % fotos.length;
      principal.src = RAIZ + fotos[indice];
      principal.alt = `${nombre} — foto ${indice + 1} de ${fotos.length}`;
      if (contador) contador.textContent = `${indice + 1} / ${fotos.length}`;
      if (tiras) {
        tiras.querySelectorAll('.tira').forEach((t, i) =>
          t.setAttribute('aria-current', String(i === indice))
        );
      }
    }

    document
      .querySelector('.galeria__nav--prev')
      ?.addEventListener('click', () => mostrar(indice - 1));
    document
      .querySelector('.galeria__nav--next')
      ?.addEventListener('click', () => mostrar(indice + 1));

    tiras?.querySelectorAll('.tira').forEach((t, i) => {
      t.addEventListener('click', () => mostrar(i));
    });

    /* Flechas del teclado cuando la galería tiene el foco dentro */
    const marco = principal.closest('.galeria');
    marco?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') mostrar(indice - 1);
      if (e.key === 'ArrowRight') mostrar(indice + 1);
    });

    /* Swipe en móvil */
    let inicioX = null;
    principal.parentElement.addEventListener(
      'touchstart',
      (e) => {
        inicioX = e.touches[0].clientX;
      },
      { passive: true }
    );
    principal.parentElement.addEventListener(
      'touchend',
      (e) => {
        if (inicioX === null) return;
        const delta = e.changedTouches[0].clientX - inicioX;
        if (Math.abs(delta) > 45) mostrar(indice + (delta < 0 ? 1 : -1));
        inicioX = null;
      },
      { passive: true }
    );

    mostrar(0);
  }

  /* -------------------------------------------------------- Relacionados */
  const caja = document.getElementById('relacionados');
  if (caja && typeof window.tarjetaVehiculo === 'function') {
    const otros = vehiculosPublicados().filter((v) => v.id !== vehiculo.id);

    /* Puntaje simple: mismo tipo pesa más que misma marca, y luego cercanía de año. */
    const puntaje = (v) =>
      (v.tipo === vehiculo.tipo ? 4 : 0) +
      (v.marca === vehiculo.marca ? 3 : 0) +
      (v.combustible === vehiculo.combustible ? 1 : 0) +
      Math.max(0, 3 - Math.abs(v.anio - vehiculo.anio));

    const relacionados = otros
      .sort((a, b) => puntaje(b) - puntaje(a) || b.anio - a.anio)
      .slice(0, 3);

    if (relacionados.length) {
      caja.innerHTML = relacionados.map(window.tarjetaVehiculo).join('');
      window.revelar?.(caja);
    } else {
      caja.closest('section')?.classList.add('oculto');
    }
  }
})();
