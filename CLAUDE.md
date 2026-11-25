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

## Controllo prima di ogni commit
`strumenti/controllo-segreti.py` ferma il commit se trova chiavi. Si attiva con
`git config core.hooksPath strumenti/git-hooks` (da rifare su ogni PC nuovo).

## Chi decide
Il proprietario. Ogni pubblicazione e ogni cambio importante lo approva lui.
