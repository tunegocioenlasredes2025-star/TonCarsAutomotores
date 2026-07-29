/* ==========================================================================
   TON CARS — Catálogo: buscador, filtros y orden
   Todo del lado del cliente sobre el array de js/vehiculos.js.
   El estado se refleja en la URL para que los filtros se puedan compartir.
   ========================================================================== */
(function () {
  'use strict';

  const grilla = document.getElementById('grilla-catalogo');
  if (!grilla || typeof VEHICULOS === 'undefined') return;

  const $ = (id) => document.getElementById(id);
  const buscador = $('f-buscar');
  const selMarca = $('f-marca');
  const selModelo = $('f-modelo');
  const selAnio = $('f-anio');
  const selPrecio = $('f-precio');
  const selCombustible = $('f-combustible');
  const selOrden = $('f-orden');
  const chips = document.querySelectorAll('.chip[data-tipo]');
  const contador = $('contador');
  const vacio = $('sin-resultados');
  const btnLimpiar = $('limpiar');

  const CATALOGO = vehiculosPublicados();
  let tipoActivo = 'todos';

  /* --------------------------------------------------- Poblar los selects */
  function opciones(select, valores, etiquetaTodos) {
    const actual = select.value;
    select.innerHTML =
      `<option value="">${etiquetaTodos}</option>` +
      valores.map((v) => `<option value="${v}">${v}</option>`).join('');
    if (valores.includes(actual)) select.value = actual;
  }

  const unicos = (arr) => [...new Set(arr)];

  opciones(selMarca, unicos(CATALOGO.map((v) => v.marca)).sort(), 'Todas');
  opciones(
    selAnio,
    unicos(CATALOGO.map((v) => v.anio)).sort((a, b) => b - a),
    'Todos'
  );
  opciones(
    selCombustible,
    unicos(CATALOGO.map((v) => v.combustible)).sort(),
    'Todos'
  );

  /* El listado de modelos depende de la marca elegida. */
  function actualizarModelos() {
    const marca = selMarca.value;
    const modelos = unicos(
      CATALOGO.filter((v) => !marca || v.marca === marca).map((v) => v.modelo)
    ).sort();
    opciones(selModelo, modelos, 'Todos');
    selModelo.disabled = modelos.length === 0;
  }
  actualizarModelos();

  /* ------------------------------------------------------------- Filtrado */
  const RANGOS_PRECIO = {
    'hasta-15': (n) => n <= 15000000,
    '15-25': (n) => n > 15000000 && n <= 25000000,
    '25-40': (n) => n > 25000000 && n <= 40000000,
    'desde-40': (n) => n > 40000000,
  };

  function normalizar(texto) {
    return String(texto)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function filtrar() {
    const q = normalizar(buscador.value.trim());
    const terminos = q ? q.split(/\s+/) : [];

    return CATALOGO.filter((v) => {
      if (tipoActivo !== 'todos' && v.tipo !== tipoActivo) return false;
      if (selMarca.value && v.marca !== selMarca.value) return false;
      if (selModelo.value && v.modelo !== selModelo.value) return false;
      if (selAnio.value && String(v.anio) !== selAnio.value) return false;
      if (selCombustible.value && v.combustible !== selCombustible.value) return false;

      if (selPrecio.value) {
        // Las unidades "a consultar" sólo aparecen sin filtro de precio.
        if (v.precio == null) return false;
        const test = RANGOS_PRECIO[selPrecio.value];
        if (test && !test(v.precio)) return false;
      }

      if (terminos.length) {
        const indice = normalizar(
          [v.marca, v.modelo, v.anio, v.combustible, v.transmision, ETIQUETAS_TIPO[v.tipo], ...(v.etiquetas || [])].join(' ')
        );
        if (!terminos.every((t) => indice.includes(t))) return false;
      }

      return true;
    });
  }

  const ORDENES = {
    relevancia: (a, b) => Number(b.destacado) - Number(a.destacado) || b.anio - a.anio,
    'anio-desc': (a, b) => b.anio - a.anio,
    'anio-asc': (a, b) => a.anio - b.anio,
    'km-asc': (a, b) => a.km - b.km,
    'precio-asc': (a, b) => (a.precio ?? Infinity) - (b.precio ?? Infinity),
    'precio-desc': (a, b) => (b.precio ?? -Infinity) - (a.precio ?? -Infinity),
  };

  /* ------------------------------------------------------------- Pintado */
  let primerPintado = true;

  function pintar() {
    const resultados = filtrar().sort(ORDENES[selOrden.value] || ORDENES.relevancia);

    grilla.innerHTML = resultados.map(window.tarjetaVehiculo).join('');

    if (primerPintado) {
      // La primera carga entra con la animación de scroll del resto del sitio.
      window.revelar?.(grilla);
      primerPintado = false;
    } else {
      // Al filtrar mostramos el resultado de una, sin parpadeo entre teclas.
      grilla.querySelectorAll('.revelar').forEach((el) => el.classList.add('visible'));
    }

    contador.innerHTML =
      resultados.length === 1
        ? '<strong>1</strong> unidad disponible'
        : `<strong>${resultados.length}</strong> unidades disponibles`;

    vacio.classList.toggle('visible', resultados.length === 0);
    grilla.classList.toggle('oculto', resultados.length === 0);

    sincronizarUrl();
  }

  /* ------------------------------------------- Estado compartible por URL */
  function sincronizarUrl() {
    const p = new URLSearchParams();
    if (tipoActivo !== 'todos') p.set('tipo', tipoActivo);
    if (buscador.value.trim()) p.set('q', buscador.value.trim());
    if (selMarca.value) p.set('marca', selMarca.value);
    if (selModelo.value) p.set('modelo', selModelo.value);
    if (selAnio.value) p.set('anio', selAnio.value);
    if (selPrecio.value) p.set('precio', selPrecio.value);
    if (selCombustible.value) p.set('combustible', selCombustible.value);
    if (selOrden.value !== 'relevancia') p.set('orden', selOrden.value);

    const cadena = p.toString();
    history.replaceState(null, '', cadena ? `?${cadena}` : location.pathname);
  }

  function leerUrl() {
    const p = new URLSearchParams(location.search);
    if (p.get('tipo')) tipoActivo = p.get('tipo');
    if (p.get('q')) buscador.value = p.get('q');
    if (p.get('marca')) selMarca.value = p.get('marca');
    actualizarModelos();
    if (p.get('modelo')) selModelo.value = p.get('modelo');
    if (p.get('anio')) selAnio.value = p.get('anio');
    if (p.get('precio')) selPrecio.value = p.get('precio');
    if (p.get('combustible')) selCombustible.value = p.get('combustible');
    if (p.get('orden')) selOrden.value = p.get('orden');

    chips.forEach((c) =>
      c.setAttribute('aria-pressed', String(c.dataset.tipo === tipoActivo))
    );
  }

  /* -------------------------------------------------------------- Eventos */
  let temporizador;
  buscador.addEventListener('input', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(pintar, 180);
  });

  selMarca.addEventListener('change', () => {
    actualizarModelos();
    pintar();
  });

  [selModelo, selAnio, selPrecio, selCombustible, selOrden].forEach((s) =>
    s.addEventListener('change', pintar)
  );

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      tipoActivo = chip.dataset.tipo;
      chips.forEach((c) =>
        c.setAttribute('aria-pressed', String(c === chip))
      );
      pintar();
    });
  });

  btnLimpiar.addEventListener('click', () => {
    buscador.value = '';
    [selMarca, selModelo, selAnio, selPrecio, selCombustible].forEach((s) => (s.value = ''));
    selOrden.value = 'relevancia';
    tipoActivo = 'todos';
    chips.forEach((c) =>
      c.setAttribute('aria-pressed', String(c.dataset.tipo === 'todos'))
    );
    actualizarModelos();
    pintar();
  });

  /* ------------------------------------------- Plegado de filtros en celular */
  /* El <details> viene abierto en el HTML para que funcione sin JavaScript.
     En pantallas chicas lo cerramos, salvo que ya haya un filtro activo. */
  const plegable = $('filtros-mas');
  const anchoDesktop = window.matchMedia('(min-width: 900px)');

  function sincronizarPlegable() {
    if (anchoDesktop.matches) {
      plegable.open = true;
      return;
    }
    const hayFiltro = [selMarca, selModelo, selAnio, selPrecio, selCombustible].some(
      (s) => s.value
    );
    plegable.open = hayFiltro;
  }

  anchoDesktop.addEventListener('change', sincronizarPlegable);

  leerUrl();
  sincronizarPlegable();
  pintar();
})();
