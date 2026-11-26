// App Android (Capacitor): le cose che il browser fa da solo e la WebView no.
// Nel sito non fa niente: lavora solo dentro l'APK.
const CAP = window.Capacitor;
export const nativa = !!(CAP && CAP.isNativePlatform && CAP.isNativePlatform());
const P = nativa ? CAP.Plugins : {};
const RILASCI = 'https://github.com/Cekku/MATRIX-APP/releases/latest';

// Tasto Indietro di Android: chiude Oracolo, cassetto o dettaglio (come il tasto Esc); se non c'è niente da chiudere, app in secondo piano.
export function attivaTastoIndietro() {
  if (!nativa || !P.App) return;
  P.App.addListener('backButton', () => {
    // prima la plancia (chiude il foglio, torna a Oggi, esce dal 3D); se non serve, come prima
    if (!document.dispatchEvent(new CustomEvent('matrix-indietro', { cancelable: true }))) return;
    const aperto = ['#oracolo', '#cassetto'].some(s => { const el = document.querySelector(s); return el && !el.hidden; })
      || !document.querySelector('#indietro')?.hidden;
    if (aperto) document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    else P.App.minimizeApp();
  });
}

const piuNuova = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };

/** Controlla su GitHub se è uscito un APK più nuovo di quello installato e propone di scaricarlo. */
export async function controllaAggiornamento(versione) {
  if (!nativa || !navigator.onLine) return;
  try {
    const r = await fetch('https://api.github.com/repos/Cekku/MATRIX-APP/releases/latest', { cache: 'no-store' });
    if (!r.ok) return;
    const nuova = String((await r.json()).tag_name || '').replace(/^v/, '');
    if (!nuova || !piuNuova(nuova, versione)) return;
    const a = document.createElement('div'); a.id = 'nuova';
    a.innerHTML = `C'è la Matrix nuova (${nuova}) <button type="button">Scarica</button>`;
    a.querySelector('button').onclick = () => { window.open(RILASCI, '_blank'); a.remove(); };
    document.body.appendChild(a); setTimeout(() => a.remove(), 15000);
  } catch (_) { }
}
