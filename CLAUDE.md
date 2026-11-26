# MATRIX-APP — regole sempre valide

Interfaccia della Matrix (il Costrutto) come app installabile. Il resto del progetto sta nel repository privato `MATRIX`.
Lingua: **italiano semplice**, niente gergo.

## Questo repository è PUBBLICO
- Solo codice dell'interfaccia. **Nessun dato vero**: niente campi, nomi, numeri dell'azienda, della casa o del trading.
- **Nessuna chiave**, tranne la chiave pubblica (anon/publishable) di Supabase MATRIX, che è fatta per stare nell'app.
- Niente indirizzi email, percorsi del PC o nomi di persone nel codice o nei commit.
- Prima di ogni push si chiama l'Agente Smith (definito nel repository `MATRIX`).

## Come è fatta
- Stessa tecnica del gestionale dell'azienda: HTML + JS (moduli), niente framework.
- Installabile: manifest + service worker. Il service worker controlla se c'è una versione nuova e la carica da solo.
- **Senza login non mostra nulla.** Login con Supabase MATRIX (iscrizioni chiuse, utenti creati dal proprietario).
- Legge solo da Supabase MATRIX. Non parla mai direttamente con il gestionale dell'azienda.
- Librerie esterne copiate in `vendor/`, non da CDN.
- Pubblicata su GitHub Pages.
- Dopo il login si apre la **plancia** (`js/plancia.js`, `css/plancia.css`): schermata leggera con i riassunti che il PC
  scrive su Supabase MATRIX (`js/dati.js` li legge tutti in `window.MATRIX_DATI`). Il Costrutto 3D (`index.html` e
  `js/costrutto.js`, generati da `porta_v6.py` del repository privato) si carica solo quando lo si apre.
- Nomi delle classi della plancia con `pl-`: il CSS del Costrutto usa nomi generici (`header`, `.testa`, `.riga`, `.sotto`...).

## App Android (APK)
- Capacitor 8.5.3 in `app-android/` (solo plugin App). L'APK contiene una copia dei file del sito (`copia-web.mjs`, niente `sw.js`).
- Versione in `js/versione.js` (l'APK la legge da lì: 0.2.0 diventa 200). Per un rilascio alzare anche `VERSIONE` in `sw.js`.
- Compilare: doppio clic su `app-android/crea-apk.bat` → `Desktop\Matrix.apk`. Java 21 e chiave di firma stanno in
  `Desktop\MATRIX-CHIAVE-ANDROID` (**mai nel repository**: senza la stessa chiave i telefoni rifiutano gli aggiornamenti).
- Rilascio: dopo il push, `gh release create v<versione> "..\Matrix.apk#Matrix.apk"`. All'apertura l'app legge
  `releases/latest` e, se c'è una versione più nuova, propone "Scarica".
- Da una sessione di Claude: lanciare `.\gradlew.bat assembleRelease` da `app-android\android` con `JAVA_HOME` preso da `java.txt`.
  Se c'è più di un dispositivo collegato, usare sempre `adb -s <nome>`: c'è anche il telefono vero in rete.

## Controllo prima di ogni commit
`strumenti/controllo-segreti.py` ferma il commit se trova chiavi. Si attiva con
`git config core.hooksPath strumenti/git-hooks` (da rifare su ogni PC nuovo).

## Chi decide
Il proprietario. Ogni pubblicazione e ogni cambio importante lo approva lui.
