// Copia i file del sito in www/, la cartella che Capacitor mette dentro l'APK.
// Resta fuori il service worker: nell'app i file sono già nel telefono.
import { cpSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const qui = dirname(fileURLToPath(import.meta.url));
const sito = join(qui, '..'), www = join(qui, 'www');
const DA_COPIARE = ['index.html', 'manifest.webmanifest', 'js', 'icons', 'vendor'];

rmSync(www, { recursive: true, force: true });
mkdirSync(www);
for (const f of DA_COPIARE) cpSync(join(sito, f), join(www, f), { recursive: true });
console.log('File del sito copiati in', www);
