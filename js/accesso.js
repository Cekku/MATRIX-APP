// Accesso: senza login non si vede nulla. Dopo il login si carica il Costrutto.
import { SUPABASE_URL, SUPABASE_CHIAVE_PUBBLICA, INDIRIZZO_APP } from './config.js';
import { VERSIONE } from './versione.js';
import { nativa, attivaTastoIndietro, controllaAggiornamento } from './nativo.js';
import { caricaDati, preparaModello, dimenticaDati } from './dati.js';

const $ = s => document.querySelector(s);
// arrivo dal collegamento della mail "nuova password": lo leggo prima che Supabase pulisca l'indirizzo
const dallaMail = new URLSearchParams(location.hash.slice(1));
const recupero = dallaMail.get('type') === 'recovery';
const erroreMail = dallaMail.get('error_code');
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
  preparaModello(db);
  await Promise.all([
    script('vendor/three/three.min.js').catch(() => { /* il Costrutto mostra "3D non caricato" */ }),
    caricaDati(db),
  ]);
  await script('js/costrutto.js');
  attivaTastoIndietro();
}

// nell'APK: all'apertura guarda se su GitHub c'è una versione più nuova
controllaAggiornamento(VERSIONE);

function mostraModulo(messaggio = '') {
  $('#attesa').hidden = true; $('#nuova-pw').hidden = true; $('#entra').hidden = false;
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

// "Password dimenticata?": Supabase manda una mail con un collegamento che riporta qui
$('#dimenticata').addEventListener('click', async () => {
  const email = $('#email').value.trim(); $('#errore').textContent = ''; $('#info').textContent = '';
  if (!email) { $('#errore').textContent = 'Scrivi prima la tua email qui sopra.'; return $('#email').focus(); }
  const btn = $('#dimenticata'); btn.disabled = true;
  const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: INDIRIZZO_APP });
  btn.disabled = false;
  if (error && /rate|limit|seconds/i.test(error.message || '')) $('#errore').textContent = 'Troppe mail in poco tempo: riprova fra un’ora.';
  else if (error && /fetch|network/i.test(error.message || '')) $('#errore').textContent = 'Non riesco a raggiungere il server. Controlla la connessione.';
  // stessa risposta che l'email esista o no: così nessuno può scoprire quali email sono iscritte
  else $('#info').textContent = 'Se l’email è giusta, ti arriva una mail con il collegamento. Aprilo da questo dispositivo o dal PC.';
});

// schermata "Nuova password": si apre solo arrivando dal collegamento della mail
function mostraNuovaPassword() {
  $('#attesa').hidden = true; $('#entra').hidden = true; $('#nuova-pw').hidden = false; $('#pw1').focus();
}
$('#nuova-pw').addEventListener('submit', async e => {
  e.preventDefault();
  const a = $('#pw1').value, b = $('#pw2').value; $('#errore2').textContent = '';
  if (a !== b) { $('#errore2').textContent = 'Le due password non sono uguali.'; return; }
  const btn = $('#nuova-btn'); btn.disabled = true;
  const { data, error } = await db.auth.updateUser({ password: a });
  btn.disabled = false; $('#pw1').value = ''; $('#pw2').value = '';
  if (error) { $('#errore2').textContent = /weak|short|characters/i.test(error.message || '') ? 'Password troppo debole: usane una più lunga.' : 'Non riesco a salvarla. Richiedi una mail nuova e riprova.'; return; }
  history.replaceState(null, '', location.pathname);
  apri(data.user);
});

// "Esci": chiude la sessione e ricarica la pagina (così del Costrutto non resta niente in memoria)
document.addEventListener('click', async e => {
  if (!e.target.closest('#esci')) return;
  await dimenticaDati();
  await db.auth.signOut();
  location.reload();
});

db.auth.onAuthStateChange(evento => {
  if (evento === 'SIGNED_OUT' && aperto) dimenticaDati().finally(() => location.reload());
  if (evento === 'PASSWORD_RECOVERY' && !aperto) mostraNuovaPassword();
});
db.auth.getSession().then(({ data }) => {
  if (recupero && data.session) return mostraNuovaPassword();
  if (erroreMail) { history.replaceState(null, '', location.pathname);
    return mostraModulo(erroreMail === 'otp_expired' ? 'Il collegamento della mail è scaduto o già usato: chiedine uno nuovo.' : 'Il collegamento della mail non funziona: chiedine uno nuovo.'); }
  if (data.session) return apri(data.session.user);
  dimenticaDati(); mostraModulo(); // senza login sul dispositivo non resta niente
}).catch(() => { dimenticaDati(); mostraModulo(); });

// app installabile: il service worker tiene una copia per aprirsi senza rete e prende da solo le versioni nuove
// (non nell'APK: lì i file sono già nel telefono e gli aggiornamenti arrivano come APK nuovo)
if ('serviceWorker' in navigator && location.protocol !== 'file:' && !nativa) {
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
