/* Panel del catálogo — Ton Cars Automotores
   Se entra con contraseña. Las funciones de /api (Vercel) leen y publican el catálogo:
   cada publicación es un commit en GitHub y Vercel regenera y republica la web sola.
   El token de GitHub vive solo en Vercel; el navegador nunca lo ve. */
(() => {
  'use strict';

  const TIPOS = { hatchback: 'Hatchback', sedan: 'Sedán', suv: 'SUV', pickup: 'Pickup', utilitario: 'Utilitario', moto: 'Moto' };
  const IMG_DIR = 'img/vehiculos';
  const MAX_FOTOS = 15;
  const DRAFT_KEY = 'toncars-admin-borrador';
  const AGENCIA = 'Tu Negocio En Las Redes';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const nf = new Intl.NumberFormat('es-AR');
  const hoyISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'auto';
  const rand = () => Math.random().toString(36).slice(2, 8);

  const ICO = {
    izq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    der: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
    subir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    bajar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
    duplicar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
    borrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  };

  // Estado: lo publicado (remoto) y lo que se está editando (data). pend = fotos nuevas en base64.
  const st = { sha: null, remoto: null, data: null, pend: {}, prev: {}, cambios: 0, q: '', tipo: '' };

  /* ---------- Utilidades de interfaz ---------- */
  const ver = (nombre) => $$('[data-view]').forEach((v) => { v.hidden = v.dataset.view !== nombre; });
  let tt;
  const toast = (msg, tipo = 'ok') => {
    const t = $('[data-toast]');
    t.textContent = msg;
    t.className = `toast toast--${tipo} is-on`;
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove('is-on'), tipo === 'error' ? 8000 : 4500);
  };
  const ocupado = (btn, on) => { if (btn) { btn.classList.toggle('is-busy', on); btn.disabled = on; } };
  const errorLogin = (msg) => { const el = $('[data-login-error]'); el.textContent = msg; el.hidden = !msg; };
  const irAlLogin = (msg = '') => {
    $('[data-sesion]').hidden = true;
    ver('login');
    errorLogin(msg);
    const pw = $('[data-login] [name="password"]');
    if (pw) pw.focus();
  };

  /* ---------- API del panel ---------- */
  async function api(ruta, { method = 'GET', body } = {}) {
    const headers = { Accept: 'application/json', 'X-Panel': '1' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const res = await fetch(`/api${ruta}`, {
      method, headers, body: body !== undefined ? JSON.stringify(body) : undefined, credentials: 'same-origin', cache: 'no-store',
    });
    let data = null;
    try { data = await res.json(); } catch (_) { /* sin cuerpo */ }
    if (!res.ok) {
      const e = new Error((data && data.error) || res.statusText);
      e.status = res.status;
      e.code = (data && data.error) || (res.status === 413 ? 'grande' : '');
      e.detalle = data && data.mensaje;
      throw e;
    }
    return data;
  }

  const errorTexto = (e) => {
    switch (e && e.code) {
      case 'password': return 'Contraseña incorrecta.';
      case 'config': return `El panel todavía no está configurado en el servidor. Avisale a ${AGENCIA}.`;
      case 'token': return `Se venció la conexión del panel con la web. Avisale a ${AGENCIA} para que la renueve. Tus cambios quedan guardados.`;
      case 'permiso': return `El panel no tiene permiso para guardar. Avisale a ${AGENCIA}.`;
      case 'choque': return 'Se cruzó con otro cambio publicado al mismo tiempo. Probá publicar de nuevo.';
      case 'invalido': return e.detalle || 'Hay un dato que no se puede guardar.';
      case 'grande': return 'La foto es demasiado pesada. Probá con otra más liviana.';
      case 'sesion': return 'La sesión se cerró. Volvé a entrar.';
      default: break;
    }
    if (e && e.name === 'TypeError') return 'No hay conexión. Revisá internet y probá de nuevo.';
    return `Algo salió mal (${(e && (e.code || e.status)) || 'error'}). Probá de nuevo en un rato.`;
  };

  const blobB64 = (blob) => new Promise((ok, mal) => {
    const fr = new FileReader();
    fr.onload = () => ok(String(fr.result).split(',')[1]);
    fr.onerror = mal;
    fr.readAsDataURL(blob);
  });

  /* ---------- Datos ---------- */
  const idsUsados = () => new Set(st.data.map((v) => v.id));
  const idUnico = (base) => {
    const set = idsUsados();
    let id = slug(base);
    let i = 2;
    while (set.has(id)) id = `${slug(base)}-${i++}`;
    return id;
  };

  // Deja cada vehículo con todos los campos y tipos correctos (tolerante con datos viejos).
  const normVeh = (v) => {
    v = v && typeof v === 'object' ? v : {};
    const num = (n) => (n === 0 || (typeof n === 'number' && Number.isFinite(n)) ? n : (n == null || n === '' ? null : (Number.isFinite(Number(n)) ? Number(n) : null)));
    return {
      id: String(v.id || '').trim() || idUnicoDesde(`${v.marca || ''} ${v.modelo || ''}`),
      marca: String(v.marca || '').trim(),
      modelo: String(v.modelo || '').trim(),
      anio: num(v.anio),
      km: num(v.km),
      combustible: String(v.combustible || '').trim(),
      transmision: v.transmision == null || v.transmision === '' ? null : String(v.transmision).trim(),
      tipo: TIPOS[v.tipo] ? v.tipo : 'sedan',
      precio: num(v.precio),
      moneda: v.moneda === 'USD' ? 'USD' : 'ARS',
      estado: v.estado === '0km' ? '0km' : 'usado',
      destacado: !!v.destacado,
      disponible: v.disponible !== false,
      verificado: v.verificado !== false,
      financiable: v.financiable !== false,
      etiquetas: Array.isArray(v.etiquetas) ? v.etiquetas.map((e) => String(e).trim()).filter(Boolean) : [],
      fotos: Array.isArray(v.fotos) ? v.fotos.map((f) => String(f).trim()).filter(Boolean) : [],
      descripcion: String(v.descripcion || '').trim(),
      equipamiento: Array.isArray(v.equipamiento) ? v.equipamiento.map((e) => String(e).trim()).filter(Boolean) : [],
      fichaExtra: v.fichaExtra && typeof v.fichaExtra === 'object' && !Array.isArray(v.fichaExtra) ? { ...v.fichaExtra } : {},
    };
  };
  // Usado por normVeh cuando falta id, sin depender de st.data ya normalizado.
  let _tmpIds = null;
  const idUnicoDesde = (base) => {
    if (!_tmpIds) _tmpIds = new Set();
    let id = slug(base);
    let i = 2;
    while (_tmpIds.has(id)) id = `${slug(base)}-${i++}`;
    _tmpIds.add(id);
    return id;
  };
  const normalizar = (arr) => {
    _tmpIds = new Set((Array.isArray(arr) ? arr : []).map((v) => v && v.id).filter(Boolean));
    return (Array.isArray(arr) ? arr : []).filter((v) => v && (v.marca || v.modelo)).map(normVeh);
  };

  const src = (path) => st.prev[path] || `/${path}`;
  const fotosUsadas = () => { const s = new Set(); st.data.forEach((v) => v.fotos.forEach((f) => s.add(f))); return s; };
  const limpiarPendientes = () => {
    const usadas = fotosUsadas();
    Object.keys(st.pend).forEach((p) => { if (!usadas.has(p)) delete st.pend[p]; });
  };

  const fmtPrecio = (v) => {
    if (v.precio == null) return { txt: 'Consultar', consultar: true };
    const s = v.moneda === 'USD' ? 'US$' : '$';
    return { txt: `${s} ${nf.format(v.precio)}`, consultar: false };
  };
  const nombreVeh = (v) => `${v.marca} ${v.modelo}${v.anio ? ' ' + v.anio : ''}`.trim();

  /* ---------- Borrador local ---------- */
  const guardarBorrador = () => {
    const b = { baseSha: st.sha, data: st.data, pend: st.pend, cambios: st.cambios };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(b));
    } catch (_) {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...b, pend: {} }));
        toast('Las fotos nuevas no entran en el borrador del navegador: publicá pronto para no perderlas.', 'error');
      } catch (__) { /* sin almacenamiento */ }
    }
  };
  const leerBorrador = () => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (_) { return null; } };
  const borrarBorrador = () => { try { localStorage.removeItem(DRAFT_KEY); } catch (_) { /* nada */ } };

  const cambio = () => { st.cambios += 1; guardarBorrador(); pintar(); };

  /* ---------- Inicio ---------- */
  async function iniciar() {
    ver('cargando');
    let r;
    try {
      r = await api('/catalogo');
    } catch (e) {
      irAlLogin(e.code === 'sesion' ? '' : errorTexto(e));
      return;
    }
    $('[data-sesion]').hidden = false;
    st.sha = r.sha;
    st.remoto = normalizar(r.data);
    st.data = clone(st.remoto);
    st.pend = {};
    st.cambios = 0;

    const b = leerBorrador();
    if (b && b.cambios > 0) {
      const aviso = b.baseSha === st.sha
        ? `Tenés ${b.cambios} cambio${b.cambios === 1 ? '' : 's'} sin publicar de la última vez. ¿Los recuperás?`
        : 'Tenés cambios sin publicar de la última vez, pero el catálogo se modificó después desde otro dispositivo. Si los recuperás y publicás, reemplazás esa versión. ¿Recuperarlos igual?';
      if (confirm(aviso)) {
        st.data = normalizar(b.data);
        st.pend = b.pend || {};
        st.cambios = b.cambios;
        Object.entries(st.pend).forEach(([p, b64]) => { st.prev[p] = `data:image/webp;base64,${b64}`; });
      } else {
        borrarBorrador();
      }
    }
    poblarMarcas();
    pintar();
    ver('panel');
  }

  const poblarMarcas = () => {
    const dl = $('#marcas');
    if (!dl) return;
    const marcas = [...new Set(st.data.map((v) => v.marca).filter(Boolean))].sort();
    dl.innerHTML = marcas.map((m) => `<option value="${esc(m)}">`).join('');
  };

  /* ---------- Pintar ---------- */
  function pintar() {
    const n = st.data.length;
    const ocultos = st.data.filter((v) => !v.disponible).length;
    const dest = st.data.filter((v) => v.destacado).length;
    $('[data-resumen]').textContent = `${n} vehículo${n === 1 ? '' : 's'}${ocultos ? ` · ${ocultos} sin publicar` : ''} · ${dest} en la home`;
    const estado = $('[data-estado]');
    estado.textContent = st.cambios ? `${st.cambios} cambio${st.cambios === 1 ? '' : 's'} sin publicar` : 'Todo publicado';
    estado.classList.toggle('is-dirty', st.cambios > 0);
    $('[data-publicar]').disabled = st.cambios === 0;
    $('[data-descartar]').hidden = st.cambios === 0;
    pintarLista();
  }

  function pintarLista() {
    const ul = $('[data-lista]');
    const filtrando = !!(st.q || st.tipo);
    $('[data-nota-orden]').hidden = !filtrando;
    const total = st.data.length;
    const items = st.data
      .map((v, i) => ({ v, i }))
      .filter(({ v }) => (!st.tipo || v.tipo === st.tipo) && (!st.q || norm(`${v.marca} ${v.modelo} ${v.anio || ''}`).includes(st.q)));
    if (!items.length) {
      ul.innerHTML = `<li class="vacio">${total ? 'Ningún vehículo coincide con la búsqueda.' : 'Todavía no hay vehículos. Tocá “Nuevo vehículo” para cargar el primero.'}</li>`;
      return;
    }
    ul.innerHTML = items.map(({ v, i }) => {
      const foto = v.fotos[0];
      const img = foto
        ? `<img src="${esc(src(foto))}" alt="" loading="lazy" onerror="this.remove()">`
        : `<span class="sin-foto">Sin fotos</span>`;
      const p = fmtPrecio(v);
      return `<li class="veh${v.disponible ? '' : ' is-off'}" data-id="${esc(v.id)}">
        <div class="veh__img">${img}</div>
        <div class="veh__info">
          <strong>${esc(nombreVeh(v))}</strong>
          <div class="veh__tags">
            <span class="tag">${TIPOS[v.tipo]}</span>
            ${v.estado === '0km' ? '<span class="tag tag--0km">0 km</span>' : ''}
            ${v.destacado ? '<span class="tag tag--dest">Home</span>' : ''}
            <span class="veh__precio${p.consultar ? ' consultar' : ''}">${esc(p.txt)}</span>
          </div>
        </div>
        <label class="switch"><input type="checkbox" data-act="disponible" ${v.disponible ? 'checked' : ''}><span aria-hidden="true"></span><em>${v.disponible ? 'Publicado' : 'Oculto'}</em></label>
        <div class="veh__acts">
          <button class="btn btn--line btn--sm" type="button" data-act="editar">Editar</button>
          <button class="ico-btn" type="button" data-act="subir" aria-label="Subir" title="Subir" ${filtrando || i === 0 ? 'disabled' : ''}>${ICO.subir}</button>
          <button class="ico-btn" type="button" data-act="bajar" aria-label="Bajar" title="Bajar" ${filtrando || i === total - 1 ? 'disabled' : ''}>${ICO.bajar}</button>
          <button class="ico-btn" type="button" data-act="duplicar" aria-label="Duplicar" title="Duplicar">${ICO.duplicar}</button>
          <button class="ico-btn ico-btn--danger" type="button" data-act="borrar" aria-label="Dar de baja" title="Dar de baja">${ICO.borrar}</button>
        </div>
      </li>`;
    }).join('');
  }

  /* ---------- Acciones de la lista ---------- */
  const lista = $('[data-lista]');
  const buscarVeh = (el) => {
    const li = el.closest('[data-id]');
    const idx = li ? st.data.findIndex((v) => v.id === li.dataset.id) : -1;
    return { idx, v: st.data[idx] };
  };

  lista.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const { idx, v } = buscarVeh(b);
    if (!v) return;
    const arr = st.data;
    switch (b.dataset.act) {
      case 'editar': abrirEditor(v); break;
      case 'subir': if (idx > 0) { [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]; cambio(); } break;
      case 'bajar': if (idx < arr.length - 1) { [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]]; cambio(); } break;
      case 'duplicar':
        arr.splice(idx + 1, 0, { ...clone(v), id: idUnico(`${v.marca}-${v.modelo}`), destacado: false });
        cambio();
        toast('Vehículo duplicado. Editalo (sobre todo las fotos) y publicá.');
        break;
      case 'borrar':
        if (confirm(`¿Dar de baja “${nombreVeh(v)}”? Se va del catálogo cuando publiques.`)) {
          arr.splice(idx, 1);
          limpiarPendientes();
          cambio();
          toast('Vehículo dado de baja. Se va de la web cuando publiques.');
        }
        break;
      default: break;
    }
  });

  lista.addEventListener('change', (e) => {
    const i = e.target.closest('input[data-act="disponible"]');
    if (!i) return;
    const { v } = buscarVeh(i);
    if (!v) return;
    v.disponible = i.checked;
    cambio();
  });

  $('[data-buscar]').addEventListener('input', (e) => { st.q = norm(e.target.value.trim()); pintarLista(); });
  $('[data-filtro-tipo]').addEventListener('change', (e) => { st.tipo = e.target.value; pintarLista(); });
  $('[data-nuevo]').addEventListener('click', () => abrirEditor(null));

  /* ---------- Editor ---------- */
  const dlg = $('[data-editor]');
  const fe = $('[data-editor-form]');
  const campo = (n) => fe.elements[n];
  let edit = null; // { id, fotos: [{path,url,nuevo,b64}] }

  const errorEditor = (msg) => { const el = $('[data-editor-error]'); el.textContent = msg; el.hidden = !msg; };

  function pintarGaleria() {
    const cont = $('[data-galeria]');
    if (!edit.fotos.length) {
      cont.innerHTML = '<p class="galeria-vacia">Todavía no hay fotos. Tocá “Agregar fotos”.</p>';
    } else {
      cont.innerHTML = edit.fotos.map((f, i) => `
        <div class="foto-edit${i === 0 ? ' is-ppal' : ''}" data-i="${i}">
          <img src="${esc(f.url)}" alt="">
          ${i === 0 ? '<span class="foto-edit__badge">Principal</span>' : ''}
          <div class="foto-edit__acts">
            <button type="button" data-fa="izq" aria-label="Mover antes" ${i === 0 ? 'disabled' : ''}>${ICO.izq}</button>
            <button type="button" data-fa="der" aria-label="Mover después" ${i === edit.fotos.length - 1 ? 'disabled' : ''}>${ICO.der}</button>
            <button type="button" class="del" data-fa="del" aria-label="Quitar">${ICO.borrar}</button>
          </div>
        </div>`).join('');
    }
    $('[data-foto-txt]').textContent = edit.fotos.length ? `+ Agregar fotos (${edit.fotos.length}/${MAX_FOTOS})` : '+ Agregar fotos';
  }

  $('[data-galeria]').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-fa]');
    if (!b) return;
    const i = Number(b.closest('[data-i]').dataset.i);
    const arr = edit.fotos;
    if (b.dataset.fa === 'izq' && i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    else if (b.dataset.fa === 'der' && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
    else if (b.dataset.fa === 'del') arr.splice(i, 1);
    pintarGaleria();
  });

  function abrirEditor(v) {
    _tmpIds = null;
    edit = {
      id: v ? v.id : null,
      fotos: v ? v.fotos.map((p) => ({ path: p, url: src(p), nuevo: false })) : [],
    };
    $('[data-editor-titulo]').textContent = v ? 'Editar vehículo' : 'Nuevo vehículo';
    campo('marca').value = v ? v.marca : '';
    campo('modelo').value = v ? v.modelo : '';
    campo('tipo').value = v ? v.tipo : 'sedan';
    campo('estado').value = v ? v.estado : 'usado';
    campo('anio').value = v && v.anio != null ? v.anio : '';
    campo('km').value = v && v.km != null ? v.km : '';
    campo('combustible').value = v ? (v.combustible || '') : '';
    campo('transmision').value = v && v.transmision ? v.transmision : '';
    campo('precio').value = v && v.precio != null ? v.precio : '';
    campo('moneda').value = v ? v.moneda : 'ARS';
    campo('etiquetas').value = v ? v.etiquetas.join(', ') : '';
    campo('descripcion').value = v ? v.descripcion : '';
    campo('equipamiento').value = v ? v.equipamiento.join('\n') : '';
    campo('fichaExtra').value = v ? Object.entries(v.fichaExtra).map(([k, val]) => `${k}: ${val}`).join('\n') : '';
    campo('disponible').checked = v ? v.disponible : true;
    campo('destacado').checked = v ? v.destacado : false;
    campo('verificado').checked = v ? v.verificado : true;
    campo('financiable').checked = v ? v.financiable : true;
    errorEditor('');
    pintarGaleria();
    dlg.showModal();
    campo('marca').focus();
  }

  async function procesarFoto(file) {
    if (!file.type.startsWith('image/')) throw new Error('no es imagen');
    const bmp = await createImageBitmap(file);
    const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(bmp.width * s));
    c.height = Math.max(1, Math.round(bmp.height * s));
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    if (bmp.close) bmp.close();
    const blob = await new Promise((ok) => c.toBlob(ok, 'image/webp', 0.82));
    if (!blob || blob.type !== 'image/webp') throw new Error('sin webp');
    return { b64: await blobB64(blob), url: URL.createObjectURL(blob) };
  }

  campo('fotos').addEventListener('change', async () => {
    const files = [...campo('fotos').files];
    campo('fotos').value = '';
    if (!files.length) return;
    const libres = MAX_FOTOS - edit.fotos.length;
    if (libres <= 0) { errorEditor(`Máximo ${MAX_FOTOS} fotos por vehículo.`); return; }
    const aCargar = files.slice(0, libres);
    if (files.length > libres) toast(`Se agregan ${libres} fotos (máximo ${MAX_FOTOS}).`, 'error');
    $('[data-foto-txt]').textContent = 'Procesando…';
    errorEditor('');
    const base = slug(`${campo('marca').value} ${campo('modelo').value}`);
    let fallaron = 0;
    for (const file of aCargar) {
      try {
        const r = await procesarFoto(file);
        const path = `${IMG_DIR}/${base}-${rand()}.webp`;
        edit.fotos.push({ path, url: r.url, nuevo: true, b64: r.b64 });
      } catch (_) { fallaron += 1; }
    }
    if (fallaron) errorEditor(`No se pudieron procesar ${fallaron} foto(s). Probá con JPG o PNG desde Chrome.`);
    pintarGaleria();
  });

  const parseFichaExtra = (txt) => {
    const o = {};
    String(txt || '').split('\n').forEach((linea) => {
      const i = linea.indexOf(':');
      if (i < 1) return;
      const k = linea.slice(0, i).trim().slice(0, 30);
      const val = linea.slice(i + 1).trim().slice(0, 80);
      if (k && val) o[k] = val;
    });
    return o;
  };
  const numCampo = (n) => {
    const t = campo(n).value.trim();
    if (t === '') return null;
    const x = Math.round(Number(t));
    return Number.isFinite(x) && x >= 0 ? x : null;
  };

  fe.addEventListener('submit', (e) => {
    e.preventDefault();
    const marca = campo('marca').value.trim();
    const modelo = campo('modelo').value.trim();
    if (!marca) { errorEditor('Poné la marca.'); campo('marca').focus(); return; }
    if (!modelo) { errorEditor('Poné el modelo.'); campo('modelo').focus(); return; }
    if (campo('precio').value.trim() !== '' && numCampo('precio') == null) { errorEditor('El precio tiene que ser un número sin puntos ni signos. Ej: 15000000'); campo('precio').focus(); return; }

    // Registrar las fotos nuevas como pendientes de subida.
    edit.fotos.forEach((f) => { if (f.nuevo) { st.pend[f.path] = f.b64; st.prev[f.path] = f.url; } });

    const estado = campo('estado').value === '0km' ? '0km' : 'usado';
    let km = numCampo('km');
    if (estado === '0km' && km == null) km = 0;

    const datos = {
      marca, modelo,
      tipo: TIPOS[campo('tipo').value] ? campo('tipo').value : 'sedan',
      estado,
      anio: numCampo('anio'),
      km,
      combustible: campo('combustible').value.trim(),
      transmision: campo('transmision').value.trim() || null,
      precio: numCampo('precio'),
      moneda: campo('moneda').value === 'USD' ? 'USD' : 'ARS',
      destacado: campo('destacado').checked,
      disponible: campo('disponible').checked,
      verificado: campo('verificado').checked,
      financiable: campo('financiable').checked,
      etiquetas: campo('etiquetas').value.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6),
      fotos: edit.fotos.map((f) => f.path),
      descripcion: campo('descripcion').value.trim(),
      equipamiento: campo('equipamiento').value.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 40),
      fichaExtra: parseFichaExtra(campo('fichaExtra').value),
    };

    const eraNuevo = !edit.id;
    if (eraNuevo) st.data.unshift({ id: idUnico(`${marca}-${modelo}`), ...datos });
    else Object.assign(st.data.find((x) => x.id === edit.id), datos);
    limpiarPendientes();
    poblarMarcas();
    dlg.close();
    cambio();
    toast(eraNuevo ? 'Vehículo agregado. Tocá “Publicar cambios” para que salga en la web.' : 'Vehículo actualizado. Tocá “Publicar cambios” para que salga en la web.');
  });

  $$('[data-editor-cancelar]').forEach((b) => b.addEventListener('click', () => dlg.close()));

  /* ---------- Publicar ---------- */
  async function subirYPublicar(forzar) {
    limpiarPendientes();
    const usadas = fotosUsadas();
    const fotos = {};
    // Las fotos van de a una (límite de tamaño por pedido en Vercel); el commit se arma al final.
    for (const [path, b64] of Object.entries(st.pend)) {
      if (!usadas.has(path)) continue;
      const r = await api('/foto', { method: 'POST', body: { path, b64 } });
      fotos[path] = r.sha;
    }
    return api('/publicar', { method: 'POST', body: { baseSha: st.sha, data: st.data, fotos, cambios: st.cambios, forzar } });
  }

  async function publicar() {
    if (!st.cambios) return;
    const btn = $('[data-publicar]');
    ocupado(btn, true);
    try {
      let r;
      try {
        r = await subirYPublicar(false);
      } catch (e) {
        if (e.code !== 'conflicto') throw e;
        if (!confirm('El catálogo se modificó desde otro dispositivo después de que lo abriste. Si publicás, se reemplaza por tu versión. ¿Publicar igual?')) return;
        r = await subirYPublicar(true);
      }
      st.sha = r.sha;
      st.data = normalizar(r.data);
      st.remoto = clone(st.data);
      st.pend = {};
      st.cambios = 0;
      borrarBorrador();
      poblarMarcas();
      pintar();
      toast('¡Publicado! La web se actualiza sola en 1 o 2 minutos.');
    } catch (e) {
      if (e.code === 'sesion') irAlLogin('La sesión se cerró. Volvé a entrar: tus cambios quedan guardados en este navegador.');
      else toast(errorTexto(e), 'error');
    } finally {
      ocupado(btn, false);
      btn.disabled = st.cambios === 0;
    }
  }

  $('[data-publicar]').addEventListener('click', publicar);

  $('[data-descartar]').addEventListener('click', () => {
    if (!confirm('¿Descartar todos los cambios sin publicar? Vuelve a como está en la web.')) return;
    st.data = clone(st.remoto);
    st.pend = {};
    st.cambios = 0;
    borrarBorrador();
    poblarMarcas();
    pintar();
    toast('Cambios descartados.');
  });

  /* ---------- Menú ---------- */
  const menu = $('.menu');
  document.addEventListener('click', (e) => { if (menu.open && !menu.contains(e.target)) menu.open = false; });

  $('[data-copia]').addEventListener('click', () => {
    const blob = new Blob([`${JSON.stringify(st.data, null, 2)}\n`], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `catalogo-toncars-${hoyISO()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    menu.open = false;
  });

  $('[data-salir]').addEventListener('click', async () => {
    if (st.cambios && !confirm('Tenés cambios sin publicar. Quedan guardados en este navegador, pero no en la web. ¿Cerrar sesión igual?')) return;
    menu.open = false;
    try { await api('/logout', { method: 'POST', body: {} }); } catch (_) { /* igual se sale */ }
    irAlLogin();
  });

  window.addEventListener('beforeunload', (e) => {
    if (st.cambios) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- Ingreso ---------- */
  const fl = $('[data-login]');
  fl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = fl.elements.password.value;
    errorLogin('');
    if (!password) { errorLogin('Escribí la contraseña.'); return; }
    const btn = fl.querySelector('button[type="submit"]');
    ocupado(btn, true);
    try {
      await api('/login', { method: 'POST', body: { password } });
      fl.elements.password.value = '';
      await iniciar();
    } catch (ex) {
      errorLogin(errorTexto(ex));
      fl.elements.password.select();
    } finally {
      ocupado(btn, false);
    }
  });

  iniciar();
})();
