// Accesso: senza login non si vede nulla. Dopo il login si carica il Costrutto.
import { SUPABASE_URL, SUPABASE_CHIAVE_PUBBLICA } from './config.js';

const $ = s => document.querySelector(s);
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_CHIAVE_PUBBLICA, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'matrix-accesso' },
});

function nomeDa(utente) {
  const m = utente.user_metadata || {};
  if (m.nome) return String(m.nome);
  const parte = (utente.email || '').split('@')[0].split(/[+._-]/)[0];
  return parte ? parte[0].toUpperCase() + parte.slice(1) : '';
}

function script(src) {
  return new Promise((ok, ko) => {
    const s = document.createElement('script'); s.src = src; s.onload = ok;
    s.onerror = () => ko(new Error('non caricato: ' + src)); document.body.appendChild(s);
  });
}

let aperto = false;
async function apri(utente) {
  if (aperto) return; aperto = true;
  window.MATRIX_NOME = nomeDa(utente);
  document.body.classList.remove('chiuso');
  try { await script('vendor/three/three.min.js'); } catch (_) { /* il Costrutto mostra "3D non caricato" */ }
  await script('js/costrutto.js');
}

function mostraModulo(messaggio = '') {
  $('#attesa').hidden = true; $('#entra').hidden = false;
  $('#errore').textContent = messaggio; $('#email').focus();
}

$('#entra').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('#entra-btn'); btn.disabled = true; $('#errore').textContent = '';
  const { data, error } = await db.auth.signInWithPassword({ email: $('#email').value.trim(), password: $('#password').value });
  btn.disabled = false; $('#password').value = '';
  if (error) {
    const rete = /fetch|network/i.test(error.message || '');
    return mostraModulo(rete ? 'Non riesco a raggiungere il server. Controlla la connessione.' : 'Email o password non giuste.');
  }
  apri(data.user);
});

// "Esci": chiude la sessione e ricarica la pagina (così del Costrutto non resta niente in memoria)
document.addEventListener('click', async e => {
  if (!e.target.closest('#esci')) return;
  await db.auth.signOut();
  location.reload();
});

db.auth.onAuthStateChange(evento => { if (evento === 'SIGNED_OUT' && aperto) location.reload(); });
db.auth.getSession().then(({ data }) => data.session ? apri(data.session.user) : mostraModulo())
  .catch(() => mostraModulo());

// app installabile: il service worker tiene una copia per aprirsi senza rete e prende da solo le versioni nuove
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  const giàControllata = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
    // controlla se c'è una versione nuova ogni volta che si torna sull'app
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update(); });
  }).catch(() => { });
  // quando arriva una versione nuova: ricarica una volta sola, con un avviso
  let ricaricata = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!giàControllata || ricaricata) return; ricaricata = true;
    const a = document.createElement('div'); a.id = 'nuova'; a.textContent = 'Versione nuova, la carico…';
    document.body.appendChild(a); setTimeout(() => location.reload(), 600);
  });
}
