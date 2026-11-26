// Dati veri, solo dopo il login: li legge da Supabase MATRIX (privato). Se mancano, il Costrutto usa quelli finti.
// - campi: una voce (mondo 'campi', tipo 'campi') con nome, coltura, superficie e confine
// - modello 3D: file privato nello spazio 'modelli', tenuto in una copia sul dispositivo finché non cambia

const SPAZIO = 'modelli', MODELLO = 'stalla.glb', COPIA = 'copia-modelli';

export async function caricaCampi(db) {
  try {
    const { data, error } = await db.from('voci').select('dati')
      .eq('mondo', 'campi').eq('tipo', 'campi').eq('id', 'tutti').maybeSingle();
    const campi = !error && data && data.dati && data.dati.campi;
    if (Array.isArray(campi) && campi.length) window.CAMPI_VERI = campi;
  } catch (_) { /* senza rete: campi finti */ }
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
