// La plancia: la schermata principale dopo il login. Leggera, fatta per il telefono, funziona anche sul PC.
// Mostra i riassunti che il PC scrive su Supabase MATRIX (window.MATRIX_DATI, vedi dati.js). Il 3D si apre a richiesta.

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nf = (n, d = 0) => n == null || isNaN(n) ? '—' : Number(n).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
const gm = d => d ? d.slice(8, 10) + '/' + d.slice(5, 7) : '—';
const gma = d => d ? d.slice(8, 10) + '/' + d.slice(5, 7) + '/' + d.slice(0, 4) : '—';
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const GIORNI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
const oggiISO = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const giorniDa = d => d ? Math.round((Date.parse(oggiISO()) - Date.parse(String(d).slice(0, 10))) / 864e5) : null;
const quando = iso => { if (!iso) return ''; const d = new Date(iso); if (isNaN(d)) return '';
  const ora = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const loc = new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10), g = giorniDa(loc);
  return g === 0 ? 'oggi ' + ora : g === 1 ? 'ieri ' + ora : d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }) + ' ' + ora; };

// icone (tratto semplice, 24x24)
const I = {
  oggi: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  stalla: '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',
  campi: '<path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/><path d="M9 4v13M15 7v13"/>',
  magazzino: '<path d="M3 8l9-5 9 5v12H3z"/><path d="M7 20v-7h10v7"/><path d="M7 16h10"/>',
  piu: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  mercati: '<path d="M3 17l5-5 4 3 8-8"/><path d="M15 7h5v5"/>',
  auto: '<path d="M5 16l1.5-5a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/><circle cx="7.5" cy="20" r="1.4"/><circle cx="16.5" cy="20" r="1.4"/>',
  notizie: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  cubo: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  giri: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
  esci: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h10"/>',
  ingranaggio: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  freccia: '<path d="M9 6l6 6-6 6"/>',
  cerca: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
};
const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;
const CIELO = c => c == null ? '·' : c === 0 ? '☀' : c <= 2 ? '⛅' : c === 3 ? '☁' : c <= 48 ? '🌫' : c <= 67 || (c >= 80 && c <= 82) ? '🌧' : c <= 77 || c === 85 || c === 86 ? '❄' : '⛈';

// colori delle colture (come la mappa del Costrutto): nessun giallo o rosso, sono per gli avvisi
const FAM = [['mais', /mais/i, '#f0a77c', 'Mais'], ['medica', /medica/i, '#5fd0a0', 'Erba medica'], ['prato', /prato|erba|loiess|foragg|polifita/i, '#9ad86a', 'Prati ed erbai'],
  ['soia', /soia/i, '#b893ee', 'Soia'], ['orzo', /orzo/i, '#7fb6ff', 'Orzo'], ['frumento', /frument|grano/i, '#ff9ecf', 'Frumento'], ['altro', /.*/, '#c3ccd6', 'Altre colture']];
const famiglia = col => FAM.find(f => f[1].test(String(col || ''))) || FAM[FAM.length - 1];

const SCHEDE = [['oggi', 'Oggi'], ['stalla', 'Stalla'], ['campi', 'Campi'], ['magazzino', 'Magazzino'], ['mercati', 'Mercati'], ['auto', 'Auto'], ['notizie', 'Notizie']];
const IN_BASSO = ['oggi', 'stalla', 'campi', 'magazzino'];

const stato = { scheda: 'oggi', filtroMag: '', catMag: '', cercaCampo: '', campoSel: null };
let opz = {};
const D = k => (window.MATRIX_DATI || {})[k] || null;      // {dati, aggiornato}
const dati = k => (D(k) || {}).dati || null;

/* ------------------------------------------------------------------ avvisi: tutto quello da guardare, in ordine */
const ultimoInvio = () => Object.values(window.MATRIX_DATI || {}).map(v => v.aggiornato).filter(Boolean).sort().pop() || null;
function avvisi() {
  const out = [], st = dati('azienda/riepilogo/stalla'), mg = dati('azienda/riepilogo/magazzino'), lv = dati('campi/riepilogo/lavori'),
    au = dati('azienda/riepilogo/automazioni'), car = dati('vita/riepilogo/auto'), me = dati('costrutto/riepilogo/meteo');
  const inv = ultimoInvio(), gi = inv ? (Date.now() - Date.parse(inv)) / 864e5 : null;
  if (gi != null && gi > 1.5) out.push({ lv: 'at', t: 'Dati fermi da ' + Math.floor(gi) + ' giorni', s: 'il PC non manda i riassunti dal ' + quando(inv) + ': va acceso, o lanciato manda_matrix.py' });
  if (st && st.latte && st.latte.ultimo_giorno) { const g = giorniDa(st.latte.ultimo_giorno);
    if (g > 2) out.push({ lv: 'at', t: 'Latte da registrare', s: 'l’ultimo giorno inserito è il ' + gma(st.latte.ultimo_giorno) + ' (' + g + ' giorni fa)', vai: 'stalla' }); }
  if (car && Array.isArray(car.scadenze)) car.scadenze.forEach(s => { const g = s.data ? -giorniDa(s.data) : null;
    if (g != null && g <= 30) out.push({ lv: g < 0 ? 'bad' : 'at', t: s.titolo, s: (g < 0 ? 'scaduta il ' : 'scade il ') + gma(s.data) + (g >= 0 ? ' · tra ' + g + ' giorni' : ''), vai: 'auto' }); });
  if (mg && mg.avvisi) mg.avvisi.filter(a => a.lv === 'bad').forEach(a => out.push({ lv: 'bad', t: a.t, s: a.s, vai: 'magazzino' }));
  if (st && st.capi && st.capi.da_fecondare) out.push({ lv: 'at', t: nf(st.capi.da_fecondare) + ' vacche da fecondare', s: 'oltre 50 giorni dal parto, senza fecondazione', vai: 'stalla' });
  if (lv && lv.in_ritardo) out.push({ lv: 'at', t: lv.in_ritardo + ' lavori in ritardo', s: 'pianificati e non ancora fatti', vai: 'campi' });
  if (mg && mg.avvisi) { const n = mg.avvisi.filter(a => a.lv === 'at').length; if (n) out.push({ lv: 'at', t: n === 1 ? '1 prodotto da controllare' : n + ' prodotti da controllare', s: 'scorte basse, scadenze o autorizzazioni in arrivo', vai: 'magazzino' }); }
  if (au && au.elenco) au.elenco.filter(a => a.errore).forEach(a => out.push({ lv: 'at', t: 'Automazione: ' + a.nome, s: 'ultimo giro con errore: ' + a.errore, vai: 'automazioni' }));
  if (st && st.capi && st.capi.parti_30gg) out.push({ lv: 'info', t: st.capi.parti_30gg + ' parti nei prossimi 30 giorni', s: 'secondo i dati AIA', vai: 'stalla' });
  if (me && me.giorni && me.giorni[1] && (me.giorni[1].pioggia || 0) >= 5) out.push({ lv: 'info', t: 'Domani pioggia', s: nf(me.giorni[1].pioggia, 1) + ' mm previsti', vai: 'oggi' });
  return out;
}

/* ------------------------------------------------------------------ grafici in SVG */
function lineaSvg(punti, { alto = 190, largo = 640, etichette = [], unita = '' } = {}) {
  const v = punti.map(p => p[1]).filter(x => typeof x === 'number');
  if (v.length < 2) return '<p class="pl-vuoto">Pochi dati per il grafico.</p>';
  const min = Math.min(...v), max = Math.max(...v), m = 8, s = 30, sx = (largo - s - m) / (punti.length - 1);
  const y = x => m + 24 + (alto - 2 * m - 54) * (1 - (max === min ? .5 : (x - min) / (max - min)));
  const pts = punti.map((p, i) => [s + i * sx, typeof p[1] === 'number' ? y(p[1]) : null]).filter(p => p[1] != null);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = d + ` L${pts[pts.length - 1][0].toFixed(1)} ${alto - 26} L${pts[0][0].toFixed(1)} ${alto - 26} Z`;
  const ult = pts[pts.length - 1];
  return `<svg class="pl-grafico" viewBox="0 0 ${largo} ${alto}" role="img" aria-label="grafico">
    <path d="${area}" fill="rgba(127,216,164,.12)"/><path d="${d}" fill="none" stroke="var(--ok)" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="${ult[0]}" cy="${ult[1]}" r="4" fill="var(--ok)"/>
    <text x="${largo - m}" y="${m + 16}" text-anchor="end">max ${nf(max)}${unita}</text>
    <text x="${s}" y="${m + 16}">min ${nf(min)}${unita}</text>
    ${etichette.map(([i, t]) => `<text x="${Math.min(largo - 30, Math.max(30, s + i * sx))}" y="${alto - 4}" text-anchor="middle">${esc(t)}</text>`).join('')}</svg>`;
}
function barreSvg(punti, { alto = 180, largo = 640 } = {}) {
  const v = punti.map(p => p[1] || 0); if (!v.length) return '';
  const max = Math.max(...v) || 1, min = Math.min(...v) * .9, w = largo / punti.length;
  return `<svg class="pl-grafico" viewBox="0 0 ${largo} ${alto}" role="img" aria-label="grafico a barre">
    ${punti.map((p, i) => { const h = (alto - 40) * ((p[1] - min) / (max - min || 1)) + 6, x = i * w + 4;
      return `<rect x="${x}" y="${alto - 28 - h}" width="${w - 8}" height="${h}" rx="4" fill="${i === punti.length - 1 ? 'var(--ok)' : 'rgba(255,255,255,.18)'}"><title>${esc(MESI[+p[0].slice(5, 7) - 1] + ' ' + p[0].slice(0, 4))}: ${nf(p[1])} L</title></rect>
      <text x="${x + (w - 8) / 2}" y="${alto - 4}" text-anchor="middle">${esc(MESI[+p[0].slice(5, 7) - 1] || '')}</text>`; }).join('')}</svg>`;
}
function spark(valori, largo = 110, alto = 32) {
  const v = valori.filter(x => typeof x === 'number'); if (v.length < 2) return '';
  const min = Math.min(...v), max = Math.max(...v), sx = largo / (v.length - 1);
  const d = v.map((x, i) => (i ? 'L' : 'M') + (i * sx).toFixed(1) + ' ' + (3 + (alto - 6) * (1 - (max === min ? .5 : (x - min) / (max - min)))).toFixed(1)).join(' ');
  return `<svg viewBox="0 0 ${largo} ${alto}" width="${largo}" height="${alto}" aria-hidden="true" style="flex:none"><path d="${d}" fill="none" stroke="var(--mut)" stroke-width="1.6"/></svg>`;
}

/* ------------------------------------------------------------------ pezzi comuni */
const carta = (titolo, corpo, chiave) => `<section class="pl-carta"><h2>${titolo}${chiave && D(chiave) ? `<span class="agg">${esc(quando(D(chiave).aggiornato))}</span>` : ''}</h2>${corpo}</section>`;
const LV = { bad: 1, at: 1, info: 1 }, lvOk = x => LV[x] ? x : '';
const riga = (a, conVai = true) => { const b = a.vai && conVai && /^[a-z]+$/.test(a.vai);
  return `<${b ? `button type="button" data-vai="${a.vai}"` : 'div'} class="pl-riga">${a.lv != null ? `<i class="pl-punto ${lvOk(a.lv)}"></i>` : ''}
  <span class="t"><b>${esc(a.t)}</b>${a.s ? `<span>${esc(a.s)}</span>` : ''}</span>${a.v != null ? `<span class="v">${a.v}</span>` : ''}${b ? ic('freccia') : ''}</${b ? 'button' : 'div'}>`; };
const kpi = (val, etichetta, vai, lv = '') => `<${vai ? `button type="button" data-vai="${vai}"` : 'div'} class="pl-k ${lvOk(lv)}"><b>${val}</b><span>${esc(etichetta)}</span></${vai ? 'button' : 'div'}>`;
const nienteDati = cosa => `<p class="pl-vuoto">Nessun dato ${esc(cosa)}: arrivano quando il PC manda i riassunti.</p>`;

/* ------------------------------------------------------------------ OGGI */
function pagOggi() {
  const st = dati('azienda/riepilogo/stalla'), me = dati('costrutto/riepilogo/meteo'), no = dati('costrutto/riepilogo/notizie'),
    mg = dati('azienda/riepilogo/magazzino'), campi = window.CAMPI_VERI || [];
  const av = avvisi(), L = st && st.latte, C = (st && st.capi) || {};
  const ha = campi.reduce((a, c) => a + (+c.ettari || 0), 0);
  const gas = mg && mg.gasolio && mg.gasolio[0];
  let h = '';
  h += carta('Meteo', me && me.ora ? `<div class="pl-meteo"><span class="ora">${nf(me.ora.temp, 0)}°</span>
      <span class="cielo">${CIELO(me.ora.codice)} ${esc(me.ora.cielo)}<span>umidità ${nf(me.ora.umidita)}% · vento ${nf(me.ora.vento)} km/h</span></span></div>
      <div class="pl-giorni">${(me.giorni || []).slice(0, 5).map((g, i) => { const d = new Date(g.data + 'T12:00');
        return `<div>${i ? GIORNI[d.getDay()] : 'oggi'}<span class="ic">${CIELO(g.codice)}</span><b>${nf(g.max, 0)}° ${nf(g.min, 0)}°</b>${g.pioggia ? nf(g.pioggia, 1) + ' mm' : '&nbsp;'}</div>`; }).join('')}</div>`
    : nienteDati('del meteo'), 'costrutto/riepilogo/meteo');
  h += `<div class="pl-kpi">${kpi(L ? nf(L.litri) + ' L' : '—', L ? 'latte del ' + gm(L.ultimo_giorno) : 'latte', 'stalla', L && giorniDa(L.ultimo_giorno) > 2 ? 'at' : '')}
    ${kpi(nf(C.lattazione), 'vacche in lattazione', 'stalla')}${kpi(nf(ha, 1) + ' ha', campi.length + ' campi', 'campi')}
    ${gas ? kpi(nf(gas.g) + ' ' + esc(gas.u), gas.nome.toLowerCase(), 'magazzino', gas.g < 0 ? 'bad' : '') : ''}</div>`;
  h += carta('Da guardare' + (av.length ? ` · ${av.length}` : ''), av.length ? `<div class="pl-elenco">${av.map(a => riga(a)).join('')}</div>` : '<p class="pl-vuoto">Niente da guardare. Tutto a posto.</p>');
  if (no && no.articoli && no.articoli.length) h += carta('Notizie del ' + esc(gm(no.giorno)), no.articoli.slice(0, 3).map(notizia).join('') +
    `<button type="button" class="pl-btn" data-vai="notizie" style="margin-top:8px">Tutte le notizie ${ic('freccia')}</button>`, 'costrutto/riepilogo/notizie');
  h += `<button type="button" class="pl-btn" data-azione="3d" style="justify-self:start">${ic('cubo')} Apri il Costrutto 3D</button>`;
  const inv = ultimoInvio();
  h += `<p class="pl-nota">${inv ? 'Dati mandati dal PC: ' + esc(quando(inv)) + '.' : 'Ancora nessun dato dal PC.'} Tocca ${ic('giri').replace('<svg', '<svg style="width:14px;height:14px;vertical-align:-2px"')} in alto per rileggerli.</p>`;
  return h;
}

/* ------------------------------------------------------------------ STALLA */
function pagStalla() {
  const st = dati('azienda/riepilogo/stalla'); if (!st) return carta('Stalla', nienteDati('della stalla'));
  const L = st.latte || {}, C = st.capi || {}, K = st.controllo, vacche = (C.lattazione || 0) + (C.asciutta || 0);
  const aCapo = L.litri && C.lattazione ? L.litri / C.lattazione : null, vecchio = giorniDa(L.ultimo_giorno) > 2;
  const serie = L.serie30 || [], et = serie.map((p, i) => [i, p[0]]).filter((_, i) => i % 7 === 0).map(([i, d]) => [i, gm(d)]);
  const diff = L.media30 && L.media30_anno_prima ? (L.media30 - L.media30_anno_prima) / L.media30_anno_prima * 100 : null;
  let h = `<div class="pl-kpi">${kpi(nf(L.litri) + ' L', 'latte del ' + gm(L.ultimo_giorno), '', vecchio ? 'at' : '')}${kpi(aCapo ? nf(aCapo, 1) + ' L' : '—', 'latte a capo')}
    ${kpi(nf(C.lattazione), 'in lattazione')}${kpi(nf(C.asciutta), 'in asciutta')}</div>`;
  if (vecchio) h += carta('Attenzione', `<div class="pl-elenco">${riga({ lv: 'at', t: 'Latte fermo al ' + gma(L.ultimo_giorno), s: 'registralo nel gestionale: qui si aggiorna dopo' }, false)}</div>`);
  h += `<div class="pl-griglia">` + carta('Latte · ultimi 30 giorni', lineaSvg(serie, { etichette: et, unita: ' L' }) +
      `<div class="pl-elenco">${riga({ t: 'Media 7 giorni', v: nf(L.media7) + ' L' }, false)}${riga({ t: 'Media 30 giorni', v: nf(L.media30) + ' L' }, false)}
      ${riga({ t: 'Un anno fa, stesso periodo', v: nf(L.media30_anno_prima) + ' L' + (diff != null ? `<small class="${diff >= 0 ? 'su' : 'giu'}">${diff >= 0 ? '+' : ''}${nf(diff, 1)}%</small>` : '') }, false)}</div>`, 'azienda/riepilogo/stalla')
    + (L.mesi && L.mesi.length > 2 ? carta('Latte al giorno · media per mese', barreSvg(L.mesi.slice(-13)) + '<p class="pl-nota">Litri al giorno, media del mese. In verde l’ultimo mese.</p>') : '')
    + carta('Mandria', `<div class="pl-elenco">${[
      { t: 'In lattazione', v: nf(C.lattazione) }, { t: 'In asciutta', v: nf(C.asciutta) },
      { t: 'Gravide', v: nf(C.gravide) }, { t: 'Da fecondare', s: 'oltre 50 giorni dal parto', v: nf(C.da_fecondare), lv: C.da_fecondare ? 'at' : '' },
      { t: 'Parti nei prossimi 30 giorni', v: nf(C.parti_30gg), lv: 'info' }].map(x => riga(x, false)).join('')}</div>
      <p class="pl-nota">${nf(vacche)} vacche. Solo numeri: nessuna vacca per nome esce dal PC.</p>`)
    + (K ? carta('Ultimo controllo funzionale · ' + esc(gma(K.data)), `<div class="pl-elenco">${[
      { t: 'Vacche controllate', v: nf(K.capi) }, { t: 'Latte a capo', v: nf(K.kg, 1) + ' kg' }, { t: 'Grasso', v: nf(K.grasso, 2) + '%' },
      { t: 'Proteine', v: nf(K.proteine, 2) + '%' }, { t: 'Cellule (media)', v: nf(K.cellule) + ' mila', lv: K.cellule > 300 ? 'at' : '' }].map(x => riga(x, false)).join('')}</div>`) : '')
    + `</div>`;
  return h;
}

/* ------------------------------------------------------------------ CAMPI: mappa, colture, lavori */
let MAPPA = null; // {vb:[x,y,w,h], base:[...], poli:[{c, d, box}]}
function preparaMappa(campi) {
  const pts = []; const giro = (c, f) => Array.isArray(c[0]) ? c.forEach(x => giro(x, f)) : f(c);
  campi.forEach(c => c.geom && giro(c.geom.coordinates, p => pts.push(p)));
  if (!pts.length) return null;
  const lat0 = pts.reduce((a, p) => a + p[1], 0) / pts.length, k = Math.cos(lat0 * Math.PI / 180);
  const X = p => p[0] * k * 1e4, Y = p => -p[1] * 1e4;
  const xs = pts.map(X), ys = pts.map(Y), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
  const poli = campi.filter(c => c.geom).map(c => { const g = c.geom, box = [Infinity, Infinity, -Infinity, -Infinity];
    const anello = r => r.map((p, i) => { const x = X(p) - x0, y = Y(p) - y0; box[0] = Math.min(box[0], x); box[1] = Math.min(box[1], y); box[2] = Math.max(box[2], x); box[3] = Math.max(box[3], y);
      return (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2); }).join(' ') + 'Z';
    const d = g.type === 'Polygon' ? g.coordinates.map(anello).join(' ') : g.type === 'MultiPolygon' ? g.coordinates.map(p => p.map(anello).join(' ')).join(' ') : '';
    return { c, d, box }; });
  const m = Math.max(w, h) * .04, base = [-m, -m, w + 2 * m, h + 2 * m];
  return { base, vb: base.slice(), poli };
}
function svgMappa() {
  if (!MAPPA) return '';
  const q = stato.cercaCampo.toLowerCase();
  return `<svg viewBox="${MAPPA.vb.join(' ')}" preserveAspectRatio="xMidYMid meet" id="mappa-svg" role="img" aria-label="mappa dei campi">
    ${MAPPA.poli.map((p, i) => { const f = famiglia(p.c.coltura), spento = q && !String(p.c.nome).toLowerCase().includes(q);
      return `<path d="${p.d}" data-i="${i}" fill="${f[2]}" fill-opacity="${spento ? .12 : .82}" fill-rule="evenodd" class="${stato.campoSel === i ? 'sel' : ''}"><title>${esc(p.c.nome)}</title></path>`; }).join('')}</svg>`;
}
function pagCampi() {
  const campi = window.CAMPI_VERI || [], lv = dati('campi/riepilogo/lavori');
  if (!campi.length) return carta('Campi', nienteDati('dei campi'));
  if (!MAPPA) MAPPA = preparaMappa(campi);
  const tot = campi.reduce((a, c) => a + (+c.ettari || 0), 0), per = {};
  campi.forEach(c => { const f = famiglia(c.coltura); per[f[0]] = per[f[0]] || { f, ha: 0, n: 0 }; per[f[0]].ha += +c.ettari || 0; per[f[0]].n++; });
  const fam = Object.values(per).sort((a, b) => b.ha - a.ha), maxHa = fam[0] ? fam[0].ha : 1;
  const sel = stato.campoSel != null && MAPPA && MAPPA.poli[stato.campoSel] ? MAPPA.poli[stato.campoSel].c : null;
  const fattiAnno = lv ? Object.values(lv.fatti_anno || {}).reduce((a, b) => a + b, 0) : 0;
  let h = `<div class="pl-kpi">${kpi(nf(tot, 1) + ' ha', campi.length + ' campi')}${lv ? kpi(nf(lv.in_ritardo), 'lavori in ritardo', '', lv.in_ritardo ? 'at' : '') : ''}
    ${lv ? kpi(nf(fattiAnno), 'lavori fatti quest’anno') : ''}</div>`;
  h += carta('Mappa', `<input class="pl-cerca" id="cerca-campo" type="search" placeholder="Cerca un campo per nome" value="${esc(stato.cercaCampo)}" autocomplete="off">
    <div class="pl-mappa" style="margin-top:10px">${svgMappa()}
      <div class="zoom"><button type="button" data-zoom="0.7" aria-label="Ingrandisci">+</button><button type="button" data-zoom="1.45" aria-label="Rimpicciolisci">−</button><button type="button" data-zoom="0" aria-label="Vista intera" style="font-size:14px">⤢</button></div>
      ${sel ? `<div class="info"><b>${esc(sel.nome)}</b><br><span style="color:var(--mut)">${esc(sel.coltura || 'coltura non indicata')} · ${nf(sel.ettari, 2)} ha</span></div>` : ''}</div>
    <div class="pl-legenda">${fam.map(x => `<span style="--c:${x.f[2]}">${esc(x.f[3])}</span>`).join('')}</div>
    <p class="pl-nota">Tocca un campo per il nome. Due dita o rotella per ingrandire, trascina per spostare. Nord in alto.</p>`, 'campi/campi/tutti');
  h += `<div class="pl-griglia">` + carta('Colture', `<div class="pl-barre">${fam.map(x => `<div class="pl-barra"><span>${esc(x.f[3])} <small style="color:var(--fioco)">${x.n}</small></span>
      <i style="--acc-c:${x.f[2]};width:${Math.max(3, x.ha / maxHa * 100)}%"></i><span class="v">${nf(x.ha, 1)} ha</span></div>`).join('')}</div>`);
  if (lv) h += carta('Lavori', (lv.da_fare && lv.da_fare.length ? `<div class="pl-elenco">${lv.da_fare.slice(0, 8).map(o => riga({ lv: o.data && o.data < oggiISO() ? 'at' : 'info',
      t: o.tipo + (o.campo ? ' · ' + o.campo : ''), s: 'da fare' + (o.data ? ' il ' + gma(o.data) : '') }, false)).join('')}</div>` : '<p class="pl-vuoto" style="margin-bottom:6px">Nessun lavoro pianificato.</p>')
    + `<h2 style="margin-top:12px">Ultimi fatti</h2><div class="pl-elenco">${(lv.ultimi || []).slice(0, 8).map(o => riga({ t: o.tipo + (o.campo ? ' · ' + o.campo : ''), s: [gma(o.data), o.mezzo].filter(Boolean).join(' · ') }, false)).join('')}</div>`, 'campi/riepilogo/lavori');
  const q = stato.cercaCampo.toLowerCase();
  h += carta('Tutti i campi', `<div class="pl-elenco">${campi.filter(c => !q || String(c.nome).toLowerCase().includes(q))
    .sort((a, b) => (+b.ettari || 0) - (+a.ettari || 0)).slice(0, 80).map(c => `<button type="button" class="pl-riga" data-campo="${esc(c.id)}"><i class="pl-punto" style="background:${famiglia(c.coltura)[2]}"></i>
      <span class="t"><b>${esc(c.nome)}</b><span>${esc(c.coltura || 'coltura non indicata')}</span></span><span class="v">${nf(c.ettari, 2)} ha</span></button>`).join('')}</div>`);
  if (lv && lv.mezzi && lv.mezzi.length) h += carta('Mezzi', `<div class="pl-elenco">${lv.mezzi.map(m => riga({ t: m.nome, s: [m.tipo, m.modello].filter(Boolean).join(' · ') }, false)).join('')}</div>`);
  return h + `</div>`;
}

/* ------------------------------------------------------------------ MAGAZZINO */
function pagMagazzino() {
  const mg = dati('azienda/riepilogo/magazzino'); if (!mg) return carta('Magazzino', nienteDati('del magazzino'));
  const cats = Object.keys(mg.per_categoria || {}).sort(), q = stato.filtroMag.toLowerCase();
  const righe = (mg.prodotti || []).filter(p => (!stato.catMag || p.cat === stato.catMag) && (!q || p.nome.toLowerCase().includes(q)));
  let h = '';
  if (mg.avvisi && mg.avvisi.length) h += carta('Da guardare · ' + mg.avvisi.length, `<div class="pl-elenco">${mg.avvisi.map(a => riga({ lv: a.lv, t: a.t, s: a.s }, false)).join('')}</div>`, 'azienda/riepilogo/magazzino');
  h += carta('Prodotti', `<input class="pl-cerca" id="cerca-mag" type="search" placeholder="Cerca un prodotto" value="${esc(stato.filtroMag)}" autocomplete="off">
    <div class="pl-chip-riga" style="margin-top:10px"><button type="button" class="pl-chip ${!stato.catMag ? 'on' : ''}" data-cat="">Tutti</button>${cats.map(c => `<button type="button" class="pl-chip ${stato.catMag === c ? 'on' : ''}" data-cat="${esc(c)}">${esc(c)} <small>${nf(mg.per_categoria[c])}</small></button>`).join('')}</div>
    <div class="pl-elenco" style="margin-top:6px">${righe.length ? righe.map(p => riga({ lv: p.g < 0 ? 'bad' : p.g === 0 ? 'info' : '', t: p.nome, s: p.cat + (p.ultimo ? ' · ultimo movimento ' + gma(p.ultimo) : ''),
      v: `<span class="${p.g < 0 ? 'bad-t' : ''}">${nf(p.g, p.g % 1 ? 1 : 0)} ${esc(p.u)}</span>` }, false)).join('') : '<p class="pl-vuoto">Nessun prodotto.</p>'}</div>
    <p class="pl-nota">Giacenze calcolate da carichi, scarichi e inventari del gestionale.</p>`, 'azienda/riepilogo/magazzino');
  return h;
}

/* ------------------------------------------------------------------ MERCATI */
function pagMercati() {
  const me = dati('azienda/riepilogo/mercati'); if (!me) return carta('Mercati', nienteDati('dei prezzi'));
  const gr = {};
  (me.prezzi || []).forEach(p => (gr[p.gruppo || 'altro'] = gr[p.gruppo || 'altro'] || []).push(p));
  const nomi = { latte: 'Latte', alimenti: 'Alimenti per la stalla', concimi: 'Concimi', energia: 'Energia' };
  const quandoP = d => !d ? '' : d.length > 7 ? gm(d) : MESI[+d.slice(5, 7) - 1] + ' ' + d.slice(2, 4);
  return `<div class="pl-griglia">` + Object.entries(gr).map(([g, l]) => carta(nomi[g] || esc(g), `<div class="pl-elenco">${l.map(p => {
    const u = p.ultimo ? p.ultimo[1] : null, pr = p.prima ? p.prima[1] : null, d = u != null && pr ? (u - pr) / pr * 100 : null;
    return `<div class="pl-riga"><span class="t"><b>${esc(p.nome)}</b><span>${esc(p.u)}${p.ultimo ? ' · ' + esc(quandoP(p.ultimo[0])) : ''}</span></span>
      ${spark((p.mesi || []).map(x => x[1]))}<span class="v">${nf(u, u < 10 ? 3 : u < 100 ? 2 : 0)}${d != null ? `<small class="${Math.abs(d) < .05 ? 'fermo' : d > 0 ? 'su' : 'giu'}">${Math.abs(d) < .05 ? '= uguale' : (d > 0 ? '▲ ' : '▼ ') + nf(Math.abs(d), 1) + '%'}</small>` : ''}</span></div>`; }).join('')}</div>`, 'azienda/riepilogo/mercati')).join('')
    + `</div><p class="pl-nota">Prezzi pubblici raccolti dal gestionale. La linea è l’andamento degli ultimi mesi; la freccia confronta con la rilevazione prima.</p>`;
}

/* ------------------------------------------------------------------ AUTO (libretto) */
function pagAuto() {
  const a = dati('vita/riepilogo/auto');
  if (!a) return carta('Auto', `<p class="pl-vuoto">Il libretto dell’auto non è ancora collegato: manca un passo sul PC.</p>`);
  const sc = (a.scadenze || []).map(s => ({ ...s, giorni: s.data ? -giorniDa(s.data) : null }));
  let h = `<div class="pl-kpi">${kpi(a.km ? nf(a.km) + ' km' : '—', a.km_data ? 'chilometri al ' + gma(a.km_data) : 'chilometri')}
    ${kpi(nf(sc.filter(s => s.giorni != null && s.giorni <= 30).length), 'scadenze entro 30 giorni', '', sc.some(s => s.giorni != null && s.giorni < 0) ? 'bad' : sc.some(s => s.giorni != null && s.giorni <= 30) ? 'at' : '')}</div>`;
  h += carta(esc(a.nome || 'Auto') + ' · scadenze', `<div class="pl-elenco">${sc.map(s => riga({ lv: s.giorni == null ? '' : s.giorni < 0 ? 'bad' : s.giorni <= 30 ? 'at' : '',
      t: s.titolo, s: (s.data ? (s.giorni < 0 ? 'scaduta il ' : 'scade il ') + gma(s.data) : '') + (s.km ? (s.data ? ' · ' : '') + 'a ' + nf(s.km) + ' km' : ''),
      v: s.giorni != null ? (s.giorni < 0 ? 'scaduta' : s.giorni === 0 ? 'oggi' : 'tra ' + s.giorni + ' gg') : '' }, false)).join('') || '<p class="pl-vuoto">Nessuna scadenza.</p>'}</div>`, 'vita/riepilogo/auto');
  if (a.lavori && a.lavori.length) h += carta('Ultimi lavori', `<div class="pl-elenco">${a.lavori.map(w => riga({ t: w.titolo, s: [gma(w.data), w.km ? nf(w.km) + ' km' : '', w.officina].filter(Boolean).join(' · ') }, false)).join('')}</div>`);
  if (a.link && /^https:\/\//.test(a.link)) h += `<a class="pl-btn pieno" href="${esc(a.link)}" target="_blank" rel="noopener" style="justify-self:start;text-decoration:none">${ic('auto')} Apri il libretto completo</a>`;
  return h;
}

/* ------------------------------------------------------------------ NOTIZIE e AUTOMAZIONI */
const notizia = a => `<a class="pl-notizia" ${a.link && /^https:\/\//.test(a.link) ? `href="${esc(a.link)}" target="_blank" rel="noopener noreferrer"` : ''}><b>${esc(a.titolo)}</b><span>${esc([a.fonte, a.argomento, a.data ? gm(a.data) : ''].filter(Boolean).join(' · '))}</span>${a.testo ? `<p>${esc(a.testo)}</p>` : ''}</a>`;
function pagNotizie() {
  const no = dati('costrutto/riepilogo/notizie'); if (!no) return carta('Notizie', nienteDati('delle notizie'));
  return carta('Notizie del ' + esc(gma(no.giorno)), (no.articoli || []).map(notizia).join(''), 'costrutto/riepilogo/notizie') + '<p class="pl-nota">Raccolte dal gestionale. Si aprono sul sito della fonte.</p>';
}
function pagAutomazioni() {
  const au = dati('azienda/riepilogo/automazioni'); if (!au) return carta('Automazioni', nienteDati('delle automazioni'));
  return carta('Automazioni del gestionale', `<div class="pl-elenco">${(au.elenco || []).map(a => riga({ lv: a.errore ? 'at' : '', t: a.nome, s: (a.quando ? 'ultimo giro ' + quando(a.quando + 'Z') : '') + (a.errore ? ' · errore: ' + a.errore : ''), v: a.salvati ? nf(a.salvati) + '<small>righe</small>' : '' }, false)).join('')}</div>`, 'azienda/riepilogo/automazioni')
    + '<p class="pl-nota">Quello che il gestionale fa da solo (latte dal caseificio, report AIA, gasolio, fitofarmaci). Qui si guarda soltanto.</p>';
}

/* ------------------------------------------------------------------ disegno e comandi */
const PAGINE = { oggi: pagOggi, stalla: pagStalla, campi: pagCampi, magazzino: pagMagazzino, mercati: pagMercati, auto: pagAuto, notizie: pagNotizie, automazioni: pagAutomazioni };
const TITOLI = { stalla: 'Stalla', campi: 'Campi', magazzino: 'Magazzino', mercati: 'Mercati', auto: 'Auto', notizie: 'Notizie', automazioni: 'Automazioni' };

function saluto() { const h = new Date().getHours(); return h < 6 ? 'Buonanotte' : h < 13 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera'; }
function disegnaTesta() {
  const d = new Date(), titolo = TITOLI[stato.scheda], data = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#pl-titolo').innerHTML = esc(titolo || saluto() + (window.MATRIX_NOME ? ', ' + window.MATRIX_NOME : '')) + `<small>${esc(data)}</small>`;
}
function disegnaNav() {
  const n = avvisi().filter(a => a.lv !== 'info').length;
  const larga = matchMedia('(min-width:900px)').matches, voci = larga ? [...SCHEDE.map(s => s[0]), 'automazioni'] : [...IN_BASSO, 'piu'];
  const nome = k => k === 'piu' ? 'Altro' : k === 'automazioni' ? 'Automazioni' : SCHEDE.find(s => s[0] === k)[1];
  const icona = k => k === 'automazioni' ? 'ingranaggio' : k;
  $('#pl-nav').innerHTML = voci.map(k => `<button type="button" data-vai="${k}" class="${stato.scheda === k || (k === 'piu' && !IN_BASSO.includes(stato.scheda)) ? 'on' : ''}"
    ${stato.scheda === k ? 'aria-current="page"' : ''}>${ic(icona(k))}<span>${nome(k)}</span>${k === 'oggi' && n ? `<span class="bollo">${n}</span>` : ''}</button>`).join('')
    + (larga ? `<button type="button" data-azione="3d" style="margin-top:auto">${ic('cubo')}<span>Costrutto 3D</span></button>
       <button type="button" data-esci>${ic('esci')}<span>Esci</span></button>` : '');
}
export function disegna() {
  if (!$('#plancia')) return;
  disegnaTesta(); disegnaNav();
  const corpo = $('#pl-corpo'), alto = stato.scheda === corpo.dataset.scheda ? corpo.scrollTop : 0;
  corpo.innerHTML = `<div class="pl-pagina">${(PAGINE[stato.scheda] || pagOggi)()}</div>`;
  corpo.dataset.scheda = stato.scheda; corpo.scrollTop = alto;
  if (stato.scheda === 'campi') collegaMappa();
}
function vai(scheda) {
  if (scheda === 'piu') return apriMenu();
  stato.scheda = scheda; chiudiFoglio(); disegna(); $('#pl-corpo').scrollTop = 0;
  try { history.replaceState(null, '', '#' + scheda); } catch (_) { }
}

/* foglio dal basso */
function apriFoglio(html) {
  chiudiFoglio();
  const v = document.createElement('div'); v.className = 'pl-velo'; v.id = 'pl-velo';
  v.innerHTML = `<div class="pl-foglio" role="dialog" aria-modal="true">${html}</div>`;
  v.addEventListener('click', e => { if (e.target === v || e.target.closest('[data-chiudi]')) chiudiFoglio(); });
  $('#plancia').appendChild(v);
}
function chiudiFoglio() { const v = $('#pl-velo'); if (v) { v.remove(); return true; } return false; }
function apriMenu() {
  const voce = (k, t, s, icona) => `<button type="button" class="pl-riga" data-vai="${k}">${ic(icona || k)}<span class="t"><b>${t}</b><span>${s}</span></span>${ic('freccia')}</button>`;
  apriFoglio(`<button type="button" class="pl-btn pl-chiudi" data-chiudi aria-label="Chiudi">${ic('x')}</button><h3>Altro</h3><p class="pl-sotto">Le altre parti della Matrix</p>
    <div class="pl-elenco">${voce('mercati', 'Mercati', 'prezzi di latte, mais, soia, concimi, gasolio')}${voce('auto', 'Auto', 'scadenze e lavori del libretto')}
    ${voce('notizie', 'Notizie', 'la rassegna del giorno')}${voce('automazioni', 'Automazioni', 'cosa fa da solo il gestionale', 'ingranaggio')}
    <button type="button" class="pl-riga" data-azione="3d">${ic('cubo')}<span class="t"><b>Costrutto 3D</b><span>la stalla e i campi in 3D</span></span>${ic('freccia')}</button>
    <button type="button" class="pl-riga" data-azione="aggiorna">${ic('giri')}<span class="t"><b>Aggiorna i dati</b><span>rilegge i riassunti dal server</span></span></button>
    <button type="button" class="pl-riga" data-esci>${ic('esci')}<span class="t"><b>Esci dalla Matrix</b><span>chiude l’accesso su questo dispositivo</span></span></button></div>`);
}
function apriCampo(id) {
  const c = (window.CAMPI_VERI || []).find(x => String(x.id) === String(id)); if (!c) return;
  if (MAPPA) { const i = MAPPA.poli.findIndex(p => p.c === c); if (i >= 0) { stato.campoSel = i; centra(MAPPA.poli[i]); } }
  disegna(); const m = $('.pl-mappa'); if (m) m.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ricerca unica: campi, prodotti, prezzi, notizie, sezioni */
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function esiti(q) {
  q = norm(q).trim(); if (q.length < 2) return '<p class="pl-vuoto">Scrivi almeno due lettere: campi, prodotti, prezzi, notizie.</p>';
  const out = [], mg = dati('azienda/riepilogo/magazzino'), me = dati('azienda/riepilogo/mercati'), no = dati('costrutto/riepilogo/notizie');
  SCHEDE.concat([['automazioni', 'Automazioni']]).filter(s => norm(s[1]).includes(q)).forEach(s => out.push(`<button type="button" class="pl-riga" data-vai="${s[0]}">${ic(s[0] === 'automazioni' ? 'ingranaggio' : s[0])}<span class="t"><b>${esc(s[1])}</b><span>sezione</span></span>${ic('freccia')}</button>`));
  (window.CAMPI_VERI || []).filter(c => norm(c.nome).includes(q) || norm(c.coltura).includes(q)).slice(0, 12).forEach(c => out.push(`<button type="button" class="pl-riga" data-campo="${esc(c.id)}"><i class="pl-punto" style="background:${famiglia(c.coltura)[2]}"></i><span class="t"><b>${esc(c.nome)}</b><span>campo · ${esc(c.coltura || 'coltura non indicata')} · ${nf(c.ettari, 2)} ha</span></span>${ic('freccia')}</button>`));
  ((mg && mg.prodotti) || []).filter(p => norm(p.nome).includes(q) || norm(p.cat).includes(q)).slice(0, 12).forEach(p => out.push(`<button type="button" class="pl-riga" data-prodotto="${esc(p.nome)}"><i class="pl-punto ${p.g < 0 ? 'bad' : ''}"></i><span class="t"><b>${esc(p.nome)}</b><span>magazzino · ${esc(p.cat)}</span></span><span class="v">${nf(p.g, p.g % 1 ? 1 : 0)} ${esc(p.u)}</span></button>`));
  ((me && me.prezzi) || []).filter(p => norm(p.nome).includes(q)).forEach(p => out.push(`<button type="button" class="pl-riga" data-vai="mercati"><span class="t"><b>${esc(p.nome)}</b><span>prezzo · ${esc(p.u)}</span></span><span class="v">${p.ultimo ? nf(p.ultimo[1], p.ultimo[1] < 10 ? 3 : 2) : '—'}</span></button>`));
  ((no && no.articoli) || []).filter(a => norm(a.titolo).includes(q) || norm(a.testo).includes(q)).slice(0, 6).forEach(a => out.push(notizia(a)));
  return out.length ? `<div class="pl-elenco">${out.join('')}</div>` : '<p class="pl-vuoto">Niente trovato.</p>';
}
function apriCerca() {
  apriFoglio(`<button type="button" class="pl-btn pl-chiudi" data-chiudi aria-label="Chiudi">${ic('x')}</button><h3>Cerca</h3><p class="pl-sotto">In campi, magazzino, prezzi e notizie</p>
    <input class="pl-cerca" id="cerca-tutto" type="search" placeholder="Es. mais, gasolio, latte…" autocomplete="off"><div id="esiti" style="margin-top:8px">${esiti('')}</div>`);
  setTimeout(() => { const i = $('#cerca-tutto'); if (i) i.focus(); }, 30);
}

/* mappa: zoom e spostamento con dita, rotella e pulsanti */
function centra(p) {
  const [x0, y0, x1, y1] = p.box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = Math.max(MAPPA.base[2] / 8, (x1 - x0) * 3, (y1 - y0) * 3);
  MAPPA.vb = [cx - w / 2, cy - w / 2, w, w];
}
function collegaMappa() {
  const svg = $('#mappa-svg'); if (!svg || !MAPPA) return;
  const applica = () => svg.setAttribute('viewBox', MAPPA.vb.join(' '));
  const scala = () => { const r = svg.getBoundingClientRect(); return Math.max(MAPPA.vb[2] / r.width, MAPPA.vb[3] / r.height); };
  const zoom = (f, cx, cy) => { const [x, y, w, h] = MAPPA.vb, nw = Math.min(MAPPA.base[2] * 1.5, Math.max(MAPPA.base[2] / 80, w * f)), k = nw / w;
    const r = svg.getBoundingClientRect(), px = cx == null ? .5 : (cx - r.left) / r.width, py = cy == null ? .5 : (cy - r.top) / r.height;
    MAPPA.vb = [x + (w - w * k) * px, y + (h - h * k) * py, w * k, h * k]; applica(); };
  const dita = new Map(); let pinza = null, mosso = 0;
  svg.addEventListener('pointerdown', e => { dita.set(e.pointerId, [e.clientX, e.clientY]); if (dita.size === 1) mosso = 0; try { svg.setPointerCapture(e.pointerId); } catch (_) { }
    if (dita.size === 2) { const [a, b] = [...dita.values()]; pinza = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
  svg.addEventListener('pointermove', e => { if (!dita.has(e.pointerId)) return; const [px, py] = dita.get(e.pointerId); dita.set(e.pointerId, [e.clientX, e.clientY]);
    if (dita.size === 2 && pinza) { const [a, b] = [...dita.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1; zoom(pinza / d, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); pinza = d; mosso += 10; return; }
    if (dita.size > 1) return;
    const dx = e.clientX - px, dy = e.clientY - py; mosso += Math.abs(dx) + Math.abs(dy); if (mosso < 5) return;
    const s = scala(); MAPPA.vb[0] -= dx * s; MAPPA.vb[1] -= dy * s; applica(); });
  const su = e => { const tocco = e.type === 'pointerup' && mosso < 5 && dita.size === 1; dita.delete(e.pointerId); if (dita.size < 2) pinza = null;
    if (tocco) { const t = document.elementFromPoint(e.clientX, e.clientY);
      const i = t && t.dataset && t.dataset.i != null ? +t.dataset.i : null; stato.campoSel = i === stato.campoSel ? null : i; disegna(); } };
  svg.addEventListener('pointerup', su); svg.addEventListener('pointercancel', su);
  svg.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY > 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY); }, { passive: false });
}

/* ------------------------------------------------------------------ avvio */
export function avviaPlancia(o) {
  opz = o; // {apri3d(), aggiorna()}
  const p = document.createElement('main'); p.id = 'plancia';
  p.innerHTML = `<div class="pl-testa" role="banner"><h1 id="pl-titolo"></h1>
      <button type="button" class="pl-btn" data-azione="cerca" title="Cerca" aria-label="Cerca in tutta la Matrix">${ic('cerca')}</button>
      <button type="button" class="pl-btn" data-azione="aggiorna" title="Aggiorna i dati" aria-label="Aggiorna i dati">${ic('giri')}</button>
      <button type="button" class="pl-btn" data-azione="3d" title="Costrutto 3D">${ic('cubo')}<span>3D</span></button></div>
    <nav class="pl-nav" id="pl-nav" aria-label="Sezioni"></nav><div class="pl-corpo" id="pl-corpo"></div>`;
  document.body.appendChild(p);
  const torna = document.createElement('button'); torna.id = 'torna-plancia'; torna.type = 'button'; torna.className = 'pl-btn';
  torna.style.background = 'var(--vetro-forte)'; torna.innerHTML = ic('oggi') + '<span>Plancia</span>'; torna.onclick = () => mostraPlancia();
  document.body.appendChild(torna);
  p.addEventListener('click', async e => {
    const a = e.target.closest('[data-azione]'), v = e.target.closest('[data-vai]'), c = e.target.closest('[data-cat]'), z = e.target.closest('[data-zoom]'), cm = e.target.closest('[data-campo]');
    if (a) { e.preventDefault(); chiudiFoglio();
      if (a.dataset.azione === '3d') opz.apri3d();
      if (a.dataset.azione === 'cerca') apriCerca();
      if (a.dataset.azione === 'aggiorna') { a.disabled = true; try { await opz.aggiorna(); MAPPA = null; disegna(); } finally { a.disabled = false; } }
      return; }
    if (v) return vai(v.dataset.vai);
    if (c) { stato.catMag = c.dataset.cat; return disegna(); }
    if (cm) { chiudiFoglio(); return vai('campi'), apriCampo(cm.dataset.campo); }
    const pr = e.target.closest('[data-prodotto]'); if (pr) { stato.filtroMag = pr.dataset.prodotto; stato.catMag = ''; return vai('magazzino'); }
    if (z && MAPPA) { const f = +z.dataset.zoom; const svg = $('#mappa-svg');
      if (!f) { MAPPA.vb = MAPPA.base.slice(); stato.campoSel = null; return disegna(); }
      const [x, y, w, h] = MAPPA.vb; MAPPA.vb = [x + (w - w * f) / 2, y + (h - h * f) / 2, w * f, h * f]; if (svg) svg.setAttribute('viewBox', MAPPA.vb.join(' ')); }
  });
  p.addEventListener('input', e => {
    if (e.target.id === 'cerca-tutto') { $('#esiti').innerHTML = esiti(e.target.value); return; }
    if (e.target.id === 'cerca-mag') { stato.filtroMag = e.target.value; ridisegnaTenendoFuoco('cerca-mag'); }
    if (e.target.id === 'cerca-campo') { stato.cercaCampo = e.target.value; stato.campoSel = null; ridisegnaTenendoFuoco('cerca-campo'); }
  });
  let t = 0; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(disegnaNav, 150); });
  // tasto Indietro (Android) ed Esc: chiude il foglio, poi torna a Oggi; dal 3D torna alla plancia
  document.addEventListener('matrix-indietro', e => {
    if (document.body.classList.contains('vista-3d')) {
      const aperto = ['#oracolo', '#cassetto'].some(s => { const el = $(s); return el && !el.hidden; }) || ($('#indietro') && !$('#indietro').hidden);
      if (!aperto) { e.preventDefault(); mostraPlancia(); }
      return; }
    if (chiudiFoglio()) return e.preventDefault();
    if (stato.scheda !== 'oggi') { e.preventDefault(); vai('oggi'); }
  });
  document.addEventListener('keydown', ({ key }) => { if (key === 'Escape' && !document.body.classList.contains('vista-3d')) chiudiFoglio(); });
  const h = location.hash.slice(1); if (PAGINE[h]) stato.scheda = h;
  disegna();
}
function ridisegnaTenendoFuoco(id) {
  const el = $('#' + id), pos = el ? el.selectionStart : null; disegna();
  const n = $('#' + id); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (_) { } }
}
export function mostraPlancia() {
  document.body.classList.remove('vista-3d'); window.MATRIX_PAUSA = true;
  try { localStorage.setItem('matrix-vista', 'plancia'); } catch (_) { }
  disegna();
}
export function mostra3d() {
  document.body.classList.add('vista-3d'); window.MATRIX_PAUSA = false;
  try { localStorage.setItem('matrix-vista', '3d'); } catch (_) { }
  dispatchEvent(new Event('resize'));
}
