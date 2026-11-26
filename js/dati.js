// Dati veri, solo dopo il login: li legge da Supabase MATRIX (privato). Se mancano, il Costrutto usa quelli finti.
// - campi: una voce (mondo 'campi', tipo 'campi') con nome, coltura, superficie e confine
// - stalla: una voce (mondo 'azienda', tipo 'riepilogo', id 'stalla') con soli conteggi e medie
// - modello 3D: file privato nello spazio 'modelli', tenuto in una copia sul dispositivo finché non cambia

const SPAZIO = 'modelli', MODELLO = 'stalla.glb', COPIA = 'copia-modelli';

// Campi e numeri della stalla in una sola richiesta. Restano solo in memoria: niente sul dispositivo.
export async function caricaDati(db) {
  try {
    const { data, error } = await db.from('voci').select('mondo,tipo,id,dati')
      .or('and(mondo.eq.campi,tipo.eq.campi,id.eq.tutti),and(mondo.eq.azienda,tipo.eq.riepilogo,id.eq.stalla)');
    if (error || !data) return;
    const voce = (m, t) => (data.find(v => v.mondo === m && v.tipo === t) || {}).dati;
    const campi = (voce('campi', 'campi') || {}).campi;
    if (Array.isArray(campi) && campi.length) window.CAMPI_VERI = campi;
    const stalla = voce('azienda', 'riepilogo');
    if (stalla && stalla.latte && stalla.capi) window.STALLA_VERA = stalla;
  } catch (_) { /* senza rete: dati finti */ }
}

// Promessa dell'indirizzo del modello: il Costrutto la aspetta solo quando apre il mondo Azienda.
export function preparaModello(db) {
  window.MODELLO_AZIENDA = (async () => {
    const { data: lista, error } = await db.storage.from(SPAZIO).list('', { search: MODELLO });
    const info = !error && (lista || []).find(f => f.name === MODELLO);
    if (!info) throw new Error('nessun modello');
    const chiave = new Request(`./__modelli/${MODELLO}?v=${encodeURIComponent(info.updated_at || '')}`);
    let copia = null;
    try { copia = await caches.open(COPIA); } catch (_) { /* senza Cache Storage: si scarica ogni volta */ }
    let file = copia && await copia.match(chiave);
    let blob = file ? await file.blob() : null;
    if (!blob) {
      const { data, error: e2 } = await db.storage.from(SPAZIO).download(MODELLO);
      if (e2 || !data) throw new Error('modello non scaricato');
      blob = data;
      if (copia) {
        for (const vecchia of await copia.keys()) await copia.delete(vecchia);
        await copia.put(chiave, new Response(blob, { headers: { 'Content-Type': 'model/gltf-binary' } }));
      }
    }
    return URL.createObjectURL(blob);
  })();
  window.MODELLO_AZIENDA.catch(() => { }); // l'errore lo gestisce il Costrutto (torna alla stalla disegnata)
}

// All'uscita non resta niente sul dispositivo
export async function dimenticaDati() {
  try { await caches.delete(COPIA); } catch (_) { }
}
