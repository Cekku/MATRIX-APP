// Il Costrutto (dalla v6). Si carica solo dopo l'accesso, da js/accesso.js. Dati finti.
'use strict';
// =====================================================================
// DATI FINTI (ripresi dalla v5)
// =====================================================================
// [id, nome, secondario]
const MONDI = [['costrutto','Costrutto'],['azienda','Azienda'],['campi','Campi'],['trading','Trading'],['vita','Vita'],
  ['scuola','Scuola',1],['lab','Lab',1]];
const ACCENTI = {costrutto:'#cfd8e3', azienda:'#93d67f', campi:'#5fd0b0', trading:'#6cb4ff', vita:'#b9a2ff', scuola:'#7fd6ee', lab:'#d79cf0'};
const NOTA_MONDO = {
  azienda:'modello disegnato a mano: poi il progetto 3D vero',
  campi:'forme finte: poi arriveranno dal gestionale',
  trading:'il bot guarda, non compra',
  costrutto:'tocca un mondo per entrarci',
  scuola:'cresce a ogni studio',
};
const AG = [['Oracolo','on','pronto'],['Architetto','on','v6 disegnata'],['Operatore','lav','costruisce v6'],
  ['Fabbro delle Chiavi','on','porte in sola lettura'],['Agente Smith','on','tutto ok'],['Merovingio','on','memoria aggiornata'],
  ['Seraph','lav','2 in coda'],['Morpheus','on','3 materiali da studiare']];
// cose da guardare: [mondo, oggetto, etichetta, testo, fonte, livello]
const DA_GUARDARE = [
  ['azienda','stalla','Azienda','Vacca 214: i sensori segnalano calo di ruminazione','Gestionale · sensori','at'],
  ['campi','nord','Campi','Trattamento campo Nord: finestra asciutta mar 10','Campagna + meteo','at'],
  ['azienda','silos','Azienda','Silo 2 al 18%: ordinare','sonde silos (finto)','at'],
  ['trading','diario','Trading','3 operazioni senza nota di uscita','diario','no'],
  ['vita','auto','Vita','Bollo auto: scade il 15','scadenze','at'],
  ['trading','bot','Trading','Bot segnali: 2 segnali da rivedere','bot Telegram',''],
  ['azienda','fv','Azienda','Fotovoltaico: 41 kWh oggi, regolare','inverter',''],
  ['scuola','scuola','Scuola','3 materiali da studiare','scuola/da-studiare','at'],
  ['scuola','strategia','Scuola','Nessuna regola scritta: parti dalla gestione del rischio','strategia.md',''],
  ['lab','prova6','Lab','Costrutto v6: da guardare insieme','laboratorio',''],
];
// incroci tra mondi trovati dall'Oracolo: [titolo, testo, livello, mondo, oggetto]
const ANALISI = [
  ['Martedì il T2 serve due volte','Trattamento del campo Nord e revisione del trattore T2 cadono lo stesso giorno. Spostare la revisione?','at','campi','nord'],
  ['Weekend libero a fine mese','In azienda la settimana è tranquilla e il bollo sarà pagato: buon momento per il viaggio.','','vita','viaggio'],
];
// dettaglio: [titolo, sottotitolo, righe [etichetta, valore, stato], nota]
const DETT = {
  stalla:['Stalla','sensori · 86 capi',[['Capi in lattazione','70'],['In allerta','1 (vacca 214)','at'],['Calori rilevati oggi','3'],['Ruminazione media','normale','ok']],'Dal gestionale: la Matrix legge, non modifica.'],
  sala:['Sala mungitura','2 mungiture al giorno',[['Latte ieri','2.000 L'],['Media a capo','28,6 L','ok'],['Ultimo lavaggio','oggi 06:40','ok']]],
  silos:['Silos','3 silos',[['Silo 1 · mais','64%','ok'],['Silo 2 · nucleo','18% · ordinare','at'],['Silo 3 · fieno','71%','ok']],'Le sonde dei silos sono un esempio: da collegare nel gestionale se ci sono.'],
  fv:['Fotovoltaico','impianto sul tetto della stalla',[['Produzione oggi','41 kWh','ok'],['Potenza adesso','6,8 kW'],['Autoconsumo','78%'],['Allarmi inverter','nessuno','ok']]],
  rimessa:['Rimessa mezzi','5 mezzi',[['Trattore T1','in ordine','ok'],['Trattore T2','revisione fra 3 giorni','at'],['Carro miscelatore','tagliando a 120 ore']]],
  ufficio:['Gestionali','ufficio',[['Fatture da registrare','4','at'],['Ultima sincronizzazione','oggi 07:12','ok'],['Conti','riservati al titolare']]],
  bot:['Bot segnali Telegram','analizza un canale in automatico',[['Stato','acceso','ok'],['Segnali ultime 24 ore','2'],['Ultimo errore','nessuno','ok'],['Dove gira','sul PC']],'Sola lettura: la Matrix mostra, non accende né spegne il bot.'],
  scuola:['La Scuola','Morpheus',[['Da studiare','3 materiali','at'],['Concetti nella mappa','11'],['Strategia','non ancora scritta']],'Carica il materiale in mondi/trading/scuola/da-studiare.'],
  strategia:['La mia strategia','versione 0',[['Regole scritte','0'],['Provata sui dati passati','no','no'],['Provata in demo','no','no']],'Prima demo e dati passati, poi soldi veri.'],
  diario:['Diario','ultimi 30 giorni',[['Operazioni registrate','12'],['Con piano scritto','9 su 12','at'],['Senza nota di uscita','3','no']]],
  revisione:['Revisione auto','macchina',[['Scadenza','marzo','ok']]],
  visita:['Visita medica','salute',[['Da prenotare','entro fine mese','at']]],
  viaggio:['Weekend','idea',[['Quando','fine mese'],['Settimana in azienda','tranquilla secondo l\'agenda','ok']]],
  nord:['Campo Nord','mais · 6,2 ha · trattamento',[['Cosa','trattamento fungicida (finto)'],['Quando','mar 10, 08–14','at'],['Mezzo','trattore T2: revisione lo stesso giorno','no']]],
  mais1:['Mais 1','6,8 ha',[['Raccolta','fatta','ok'],['Resa','da scrivere','at']]],
  prato:['Prato stabile','4,1 ha',[['Ultimo sfalcio','settembre'],['Prossimo lavoro','nessuno','ok']]],
  soia:['Soia','5,2 ha',[['Raccolta','fatta','ok']]],
  orzo:['Orzo','3,9 ha',[['Semina','fatta il 20/10','ok']]],
  medica:['Erba medica','2,7 ha',[['Sfalci quest\'anno','4','ok']]],
  canale:['Canale Telegram','da dove arrivano i segnali',[['Messaggi oggi','14'],['Segnali riconosciuti','2'],['Lettura','solo lettura','ok']]],
  borsa:['Mercato','solo da guardare',[['Ordini dalla Matrix','mai','ok'],['Prezzi','in tempo reale (finto)']],'La Matrix non manda ordini e non sposta soldi.'],
  casa:['Casa','abitazione',[['Bollette','nessuna in scadenza','ok'],['Manutenzione caldaia','a marzo']]],
  auto:['Macchina','scadenze',[['Bollo','il 15','at'],['Revisione','marzo','ok'],['Tagliando','fra 4.000 km']]],
  prova6:['Costrutto v6','prova in corso',[['Cosa','3D a tutto schermo e vetri sopra'],['Stato','bozza da guardare','at']]],
  trascr:['Trascrizione video','per la Scuola, sul PC',[['Stato','in pausa']]],
};
// rami (schede con i numeri) per alcuni nodi
const RAMI = {
  nord:[['1','trattamento da fare','at','nord'],['3','lavori registrati'],['2','analisi del terreno'],['mar','finestra asciutta']],
  rischio:[['2','materiali studiati'],['3','sotto-concetti collegati'],['0','regole nella strategia','at','strategia'],['1','domanda di Morpheus per te']],
};
DETT.rischio = ['Gestione del rischio','concetto · Scuola',[],'Morpheus ti chiederà: quanto rischi al massimo su una operazione?'];
let APPR = [
  {id:1,chi:'Oracolo → Link',cosa:'Mandare il riepilogo del mattino su Telegram?',ann:'si può annullare'},
  {id:2,chi:'Morpheus',cosa:'Spostare i 3 materiali studiati in scuola/studiati?',ann:'si può annullare'}];
const RISP = [
  [/settimana|fare|scad/i,'Questa settimana: vacca 214 da controllare (sensori), silo 2 da ordinare, trattamento campo Nord martedì, bollo auto entro il 15.','Azienda · Campi · Vita'],
  [/latte/i,'Ieri 2.000 litri, 28,6 a capo. In linea con la settimana.','Azienda · sala mungitura (finto)'],
  [/fotovolt|sole|kwh/i,'Oggi 41 kWh, nessun allarme dall\'inverter. Autoconsumo al 78%.','Azienda · fotovoltaico (finto)'],
  [/bot|segnal/i,'Il bot è acceso: 2 segnali stanotte, nessun errore. Li puoi rivedere nel mondo Trading.','Trading · bot Telegram'],
  [/compr|vend|entr|convien|investi/i,'Su cosa comprare o vendere non do consigli. Posso mostrarti cosa dice il bot, oppure ripassare con Morpheus le tue regole.','Matrix'],
  [/studi|scuola|morpheus/i,'Ci sono 3 materiali da studiare. Dimmi "Morpheus, studia" e li digerisce.','Trading · Scuola']];
const SUGG = ['Cosa c\'è da fare questa settimana?','Come va il fotovoltaico?','Il bot è acceso?','Cosa compro oggi?'];
// striscia in basso: [titolo, [[etichetta, valore, percentuale, stato]]]
const STRISCIA = {
  azienda:['Azienda oggi',[['Capi in lattazione','70',85],['Latte ieri','2.000 L',78],['Silo 2','18%',18,'at'],['Fotovoltaico','41 kWh',64],['Mezzi pronti','4 su 5',80,'at']]],
  stalla:['Stalla',[['In lattazione','70',85],['In allerta','1',8,'at'],['Calori oggi','3',30],['Ruminazione','normale',90]]],
  sala:['Sala mungitura',[['Latte ieri','2.000 L',78],['Media a capo','28,6 L',72],['Lavaggio','fatto',100]]],
  silos:['Silos',[['Silo 1 · mais','64%',64],['Silo 2 · nucleo','18%',18,'at'],['Silo 3 · fieno','71%',71]]],
  fv:['Fotovoltaico',[['Oggi','41 kWh',64],['Adesso','6,8 kW',57],['Autoconsumo','78%',78],['Allarmi','0',100]]],
  rimessa:['Rimessa mezzi',[['Trattore T1','ok',100],['Trattore T2','revisione',30,'at'],['Carro','120 ore',60]]],
  ufficio:['Gestionali',[['Fatture da registrare','4',40,'at'],['Sincronizzato','07:12',100]]],
  campi:['Campi',[['Superficie','30 ha',100],['Lavori aperti','1',20,'at'],['Pioggia 7 gg','12 mm',30],['Finestra asciutta','mar 10',70]]],
  nord:['Campo Nord',[['Superficie','6,2 ha',62],['Trattamento','da fare',25,'at'],['Umidità suolo','34%',34],['Vento martedì','8 km/h',80]]],
  mais1:['Mais 1',[['Superficie','6,8 ha',68],['Resa','da scrivere',0,'at']]],
  trading:['Trading oggi',[['Bot','acceso',100],['Segnali 24 ore','2',40],['Diario completo','9 su 12',75,'at'],['Ordini dalla Matrix','mai',100]]],
  bot:['Bot segnali',[['Acceso da','6 giorni',100],['Segnali 24 ore','2',40],['Errori','0',100],['Dove gira','sul PC',50]]],
  canale:['Canale Telegram',[['Messaggi oggi','14',70],['Segnali riconosciuti','2',14]]],
  diario:['Diario',[['Operazioni','12',60],['Con piano','9 su 12',75,'at'],['Senza uscita','3',25,'no']]],
  borsa:['Mercato (finto)',[['Variazione 24 ore','+1,8%',59],['Volume','medio',50]]],
  vita:['Vita',[['Scadenze 30 gg','2',40,'at'],['Casa','in ordine',100],['Prossimo viaggio','fine mese',60]]],
  casa:['Casa',[['Bollette','ok',100],['Caldaia','marzo',70]]],
  auto:['Macchina',[['Bollo','il 15',20,'at'],['Revisione','marzo',70],['Tagliando','4.000 km',55]]],
  scuola:['La Scuola',[['Concetti','11',45],['Da studiare','3',20,'at'],['Regole scritte','0',2,'no'],['Materiali studiati','2',30]]],
  lab:['Laboratorio',[['Prove aperte','2',40],['Costrutto','v6',100]]],
};
// mappa a nodi (coordinate della v4): [id, x, y, raggio, nome, sotto, livello, azione {m}|{d}|{r}]
const GRAFO_VITA = {
  nodi:[
    ['io',400,220,34,window.MATRIX_NOME || 'Tu','tu',''],
    ['azienda',230,120,22,'Azienda','2 da guardare','at',{m:'azienda'}],
    ['campi',560,105,20,'Campi','1 da fare','at',{m:'campi'}],
    ['trading',600,320,20,'Trading','bot acceso','',{m:'trading'}],
    ['vita',220,330,17,'Vita','1 scadenza','at',{m:'vita'}],
    ['scuola',720,250,14,'Scuola','3 da studiare','',{m:'scuola'}],
    ['stalla',100,70,9,'Stalla','vacca 214','at',{d:'stalla'}],
    ['silos',150,190,7,'Silos','18%','at',{d:'silos'}],
    ['fv',300,40,7,'Fotovoltaico','41 kWh','',{d:'fv'}],
    ['t2',395,85,8,'Trattore T2','revisione','at',{d:'rimessa'}],
    ['nord',660,40,9,'Campo Nord','trattamento','at',{r:'nord'}],
    ['mais',700,150,6,'Mais 1','resa','',{d:'mais1'}],
    ['bot',520,410,8,'Bot segnali','2 nuovi','',{d:'bot'}],
    ['diario',690,380,7,'Diario','3 incompleti','no',{d:'diario'}],
    ['bollo',90,300,7,'Bollo','il 15','at',{d:'auto'}],
    ['visita',110,400,6,'Visita','da prenotare','',{d:'visita'}],
    ['viaggio',300,420,6,'Weekend','fine mese','',{d:'viaggio'}],
  ],
  archi:[['io','azienda',1],['io','campi',1],['io','trading',1],['io','vita',1],['trading','scuola',1],
    ['azienda','stalla'],['azienda','silos'],['azienda','fv'],['azienda','t2'],['campi','nord'],['campi','mais'],
    ['trading','bot'],['trading','diario'],['vita','bollo'],['vita','visita'],['vita','viaggio'],
    ['t2','nord','x'],['viaggio','azienda','x'],['diario','scuola']]
};
const GRAFO_SCUOLA = {
  nodi:[
    ['strategia',400,220,30,'La mia strategia','v0','',{d:'strategia'}],
    ['rischio',250,120,18,'Gestione del rischio','2 materiali','',{r:'rischio'}],
    ['diario2',560,120,16,'Diario','12 operazioni','no',{d:'diario'}],
    ['cvd',580,320,14,'CVD','1 materiale',''],
    ['volume',420,390,12,'Volume','1 materiale',''],
    ['psico',220,330,14,'Psicologia','da studiare','at'],
    ['stop',110,70,8,'Stop loss','',''],['size',120,180,8,'Dimensione posizione','',''],
    ['rr',300,30,7,'Rischio/rendimento','',''],['ordflow',720,260,8,'Order flow','da studiare','at'],
    ['nuovo',700,420,6,'+ prossimo concetto','',''],
  ],
  archi:[['strategia','rischio',1],['strategia','diario2',1],['strategia','cvd',1],['strategia','psico',1],['cvd','volume'],
    ['rischio','stop'],['rischio','size'],['rischio','rr'],['cvd','ordflow'],['volume','ordflow'],['psico','diario2','x'],['ordflow','nuovo']]
};

// Campi finti nello STESSO formato del gestionale: geom = GeoJSON (Polygon o MultiPolygon), coordinate [lon, lat].
// Le coordinate sono inventate (attorno a 0°N 0°E, in mezzo al mare), non sono i campi veri.
const CAMPI_FINTI = (() => {
  const geo = pts => ({type:'Polygon', coordinates:[pts.concat([pts[0]]).map(([x,z])=>[+(x*0.00006).toFixed(6), +(-z*0.00006).toFixed(6)])]});
  return [
    {id:'nord', nome:'Campo Nord', coltura:'mais', ettari:6.2, stato:'at', geom:geo([[-30,-22],[-8,-26],[-4,-10],[-26,-6]])},
    {id:'mais1', nome:'Mais 1', coltura:'mais', ettari:6.8, geom:geo([[-2,-24],[20,-20],[18,-6],[0,-8]])},
    {id:'prato', nome:'Prato stabile', coltura:'prato', ettari:4.1, geom:geo([[22,-18],[34,-10],[30,4],[20,-2]])},
    {id:'soia', nome:'Soia', coltura:'soia', ettari:5.2, geom:geo([[-28,-2],[-6,-4],[-8,14],[-30,12]])},
    {id:'orzo', nome:'Orzo', coltura:'orzo', ettari:3.9, geom:geo([[-2,-4],[16,-2],[14,16],[-4,14]])},
    {id:'medica', nome:'Erba medica', coltura:'medica', ettari:2.7, geom:geo([[18,2],[30,8],[26,22],[16,18]])},
  ];
})();

// =====================================================================
// FONTI: qui si attaccheranno i dati veri (per ora vuote → si usano i finti)
// =====================================================================
const FONTI = {
  // campi veri: mai nel file pubblicato
  campi: window.CAMPI_VERI || null,  // righe dei campi del gestionale [{id, nome, coltura, ettari, stato, geom}] oppure una FeatureCollection
  modelloAzienda: window.MODELLO_AZIENDA || null,  // indirizzo (o promessa di indirizzo) di un .glb con il progetto 3D: sostituisce il modello disegnato
};
// nomi delle parti nel GLB → oggetto toccabile (basta che il nome della parte contenga la parola)
const NOMI_GLB = [['stalla',/stalla|barn|cow/i],['silos',/silo/i],['fv',/fotovolt|pannell|solar|pv/i],
  ['sala',/mungit|milk|sala/i],['rimessa',/rimessa|shed|garage|tettoia/i],['ufficio',/ufficio|office/i]];
// zone della stalla vera: dal nome del gruppo nel modello (CONCIMAIA, CUCCETTE_..., ESISTENTE...) al nome da mostrare.
// L'ordine conta: "esistente_muri" è un muro, "ESISTENTE" è la stalla. Terreno, strade, ghiaia e fondazioni non si toccano.
const ZONE_GLB = [[/terreno|strad|ghiaia|fondazion/i, null], [/concimai/i,'concimaia','Concimaia','dove si raccoglie il letame'],
  [/cuccett/i,'cuccette','Cuccette','dove le vacche si sdraiano a riposare'], [/portoni/i,'portoni','Portoni interni','portoni e cancelli dentro la stalla'],
  [/vasch/i,'vasche','Vasche nuove','vasche del progetto nuovo'], [/carpenteria/i,'carpenteria','Carpenteria nuova','struttura in acciaio del progetto nuovo'],
  [/vetro|tetto|omega/i,'tetto','Tetto','copertura, con le parti in vetro'], [/muri|muro/i,'muri','Muri','muri della stalla esistente'],
  [/recint|rencint/i,'recinto','Recinto','recinzione intorno'], [/esistente/i,'stalla','Stalla','la stalla di oggi']];
const ZONE_DENTRO = new Set(['stalla','cuccette','portoni','vasche','muri']); // per guardarle si toglie il tetto
// colori e altezze per coltura (i colori sono spenti: è un dato, non decorazione)
const COLTURE = {mais:{col:0x5c5634,alto:.8}, prato:{col:0x2f4a35,alto:1.2}, soia:{col:0x4a4a2e,alto:.6},
  orzo:{col:0x40503a,alto:.9}, frumento:{col:0x5a5333,alto:.9}, medica:{col:0x2f5443,alto:1.6}, altro:{col:0x454c55,alto:.6}};
// dal nome della coltura scritto nel gestionale ("Mais trinciato", "Erba medica"...) alla famiglia per il colore
function chiaveColtura(s){ s = String(s || '').toLowerCase();
  return /mais/.test(s) ? 'mais' : /medica/.test(s) ? 'medica' : /prato|erba|loiess|foragg/.test(s) ? 'prato' : /soia/.test(s) ? 'soia'
    : /orzo/.test(s) ? 'orzo' : /frument|grano/.test(s) ? 'frumento' : 'altro'; }
const numIt = (n, dec = 1) => Number(n).toLocaleString('it-IT', {minimumFractionDigits:dec, maximumFractionDigits:dec});
// colori vivi per la mappa dei campi veri (si vedono sopra la foto satellitare); nessun giallo o rosso: sono riservati agli avvisi
const COLORI_MAPPA = {mais:'#f0a77c', medica:'#5fd0a0', prato:'#9ad86a', soia:'#b893ee', orzo:'#7fb6ff', frumento:'#ff9ecf', altro:'#c3ccd6'};
const NOMI_FAMIGLIA = {mais:'Mais', medica:'Erba medica', prato:'Prati ed erbai', soia:'Soia', orzo:'Orzo', frumento:'Frumento', altro:'Altre colture'};
const MAPPA = window.MAPPA_VERA || null;
const nordFisso = m => m === 'campi' && !!MAPPA;
// i campi in coordinate di scena (veri o finti), calcolati una volta: servono al 3D, al dettaglio e all'Oracolo
const GEO_CAMPI = geoInScena(FONTI.campi || CAMPI_FINTI, FONTI.campi ? 50 : 36);
const distTesto = m => m < 1000 ? Math.round(m / 10) * 10 + ' m' : numIt(m / 1000) + ' km';
/** "a 1,2 km a nord-est del centro dei campi" */
function doveCampo(c){
  const n = c.punti.length, x = c.punti.reduce((a, q) => a + q[0], 0) / n, z = c.punti.reduce((a, q) => a + q[1], 0) / n;
  const d = Math.hypot(x, z) * GEO_CAMPI.metriPerUnita; if (d < 150) return 'in mezzo agli altri campi';
  const ang = (Math.atan2(x, -z) * 180 / Math.PI + 360) % 360;
  return 'a ' + distTesto(d) + ' a ' + ['nord', 'nord-est', 'est', 'sud-est', 'sud', 'sud-ovest', 'ovest', 'nord-ovest'][Math.round(ang / 45) % 8] + ' del centro dei campi';
}
// con i campi veri: niente avvisi finti sui campi, striscia = legenda delle colture
if (FONTI.campi){
  const righe = Array.isArray(FONTI.campi) ? FONTI.campi : [];
  const tot = righe.reduce((a, r) => a + (+r.ettari || 0), 0), perFam = {};
  righe.forEach(r => { const f = chiaveColtura(r.coltura); perFam[f] = (perFam[f] || 0) + (+r.ettari || 0); });
  for (let i = DA_GUARDARE.length - 1; i >= 0; i--) if (DA_GUARDARE[i][0] === 'campi') DA_GUARDARE.splice(i, 1);
  STRISCIA.campi = ['Campi veri · ' + numIt(tot) + ' ha in ' + righe.length + ' campi',
    Object.entries(perFam).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([f, ha]) => [NOMI_FAMIGLIA[f], numIt(ha) + ' ha', tot ? ha / tot * 100 : 0, '', MAPPA ? COLORI_MAPPA[f] : ''])];
  NOTA_MONDO.campi = 'campi veri dal gestionale' + (MAPPA ? ' · nord in alto' : '');
  GEO_CAMPI.forEach(c => { if (c.parte) return;
    DETT[c.id] = [c.nome, c.coltura || 'campo', [['Coltura', c.coltura || 'non indicata'], ['Superficie', c.ettari ? numIt(c.ettari, 2) + ' ha' : '—'], ['Dove', doveCampo(c)]],
      'Dal gestionale, in sola lettura.']; });
}
// con i numeri veri della stalla (solo conteggi e medie, li scrive il PC): via la vacca finta, dentro i numeri
if (window.STALLA_VERA){ (function(){
  const S = window.STALLA_VERA, L = S.latte || {}, C = S.capi || {}, K = S.controllo, n = k => +C[k] || 0;
  const gm = d => d ? d.slice(8, 10) + '/' + d.slice(5, 7) : '—', litri = v => v == null ? '—' : numIt(v, 0) + ' L';
  const vacche = n('lattazione') + n('asciutta'), aCapo = L.litri && n('lattazione') ? L.litri / n('lattazione') : null;
  const vecchio = L.ultimo_giorno ? Math.round((Date.now() - new Date(L.ultimo_giorno)) / 864e5) : 0;
  const pct = (a, b) => a && b ? Math.max(5, Math.min(100, a / b * 100)) : 50;
  for (let i = DA_GUARDARE.length - 1; i >= 0; i--) if (/vacca 214/i.test(DA_GUARDARE[i][3])) DA_GUARDARE.splice(i, 1);
  if (n('da_fecondare')) DA_GUARDARE.unshift(['azienda','stalla','Azienda', n('da_fecondare') + ' vacche da fecondare (oltre 50 giorni dal parto)','Gestionale · stalla','at']);
  if (n('parti_30gg')) DA_GUARDARE.push(['azienda','stalla','Azienda', n('parti_30gg') + ' parti previsti nei prossimi 30 giorni','Gestionale · stalla','']);
  if (vecchio > 2) DA_GUARDARE.unshift(['azienda','sala','Azienda','Latte registrato fino al ' + gm(L.ultimo_giorno) + ': da aggiornare','Gestionale · latte','at']);
  STRISCIA.azienda[1][0] = ['Capi in lattazione', numIt(n('lattazione'), 0), pct(n('lattazione'), vacche)];
  STRISCIA.azienda[1][1] = ['Latte ' + gm(L.ultimo_giorno), litri(L.litri), pct(L.litri, L.media30 * 1.15), vecchio > 2 ? 'at' : ''];
  STRISCIA.stalla = ['Stalla', [['In lattazione', numIt(n('lattazione'), 0), pct(n('lattazione'), vacche)], ['In asciutta', numIt(n('asciutta'), 0), pct(n('asciutta'), vacche)],
    ['Gravide', numIt(n('gravide'), 0), pct(n('gravide'), vacche)], ['Da fecondare', numIt(n('da_fecondare'), 0), pct(n('da_fecondare'), vacche), n('da_fecondare') ? 'at' : '']]];
  STRISCIA.sala = ['Latte', [['Latte ' + gm(L.ultimo_giorno), litri(L.litri), pct(L.litri, L.media30 * 1.15)], ['Media a capo', aCapo ? numIt(aCapo) + ' L' : '—', pct(aCapo, 45)],
    ['Media 30 giorni', litri(L.media30), pct(L.media30, L.media30 * 1.15)]]];
  DETT.stalla = ['Stalla', vacche + ' vacche · dati al ' + gm(L.ultimo_giorno), [['In lattazione', numIt(n('lattazione'), 0)], ['In asciutta', numIt(n('asciutta'), 0)],
    ['Gravide', numIt(n('gravide'), 0), 'ok'], ['Da fecondare', numIt(n('da_fecondare'), 0), n('da_fecondare') ? 'at' : 'ok'], ['Parti nei prossimi 30 giorni', numIt(n('parti_30gg'), 0)],
    ...(K ? [['Ultimo controllo (' + gm(K.data) + ')', numIt(K.kg) + ' kg a capo'], ['Grasso · proteine', numIt(K.grasso, 2) + '% · ' + numIt(K.proteine, 2) + '%'], ['Cellule (media)', numIt(K.cellule, 0) + ' mila']] : [])],
    'Dal gestionale, in sola lettura: solo numeri, nessuna vacca per nome.'];
  DETT.sala = ['Latte', 'registrato fino al ' + gm(L.ultimo_giorno), [['Ultimo giorno', litri(L.litri)], ['Conferiti', litri(L.conferiti)], ['Media a capo', aCapo ? numIt(aCapo) + ' L' : '—'],
    ['Media 7 giorni', litri(L.media7)], ['Media 30 giorni', litri(L.media30)], ['Stesso mese un anno fa', litri(L.media30_anno_prima), L.media30 >= L.media30_anno_prima ? 'ok' : 'at']],
    'Dal gestionale, in sola lettura.'];
  const r = RISP.find(x => x[0].test('latte')); if (r){ r[1] = 'Il ' + gm(L.ultimo_giorno) + ' ' + litri(L.litri) + (aCapo ? ', ' + numIt(aCapo) + ' a capo' : '') + '. Media degli ultimi 30 giorni ' + litri(L.media30) + '.'; r[2] = 'Gestionale · latte'; }
  const nodo = GRAFO_VITA.nodi.find(x => x[0] === 'stalla'); if (nodo){ nodo[5] = numIt(n('lattazione'), 0) + ' in lattazione'; nodo[6] = n('da_fecondare') ? 'at' : ''; }
})(); }
// con i riassunti veri (nell'app, dopo il login): l'Oracolo risponde con quelli invece delle frasi finte
if (window.MATRIX_DATI){ (function(){
  const V = k => ((window.MATRIX_DATI[k] || {}).dati) || null, n0 = x => numIt(x || 0, 0);
  const gm = d => d ? d.slice(8, 10) + '/' + d.slice(5, 7) : '—';
  const st = V('azienda/riepilogo/stalla'), mg = V('azienda/riepilogo/magazzino'), lv = V('campi/riepilogo/lavori'),
    me = V('azienda/riepilogo/mercati'), no = V('costrutto/riepilogo/notizie'), auto = V('vita/riepilogo/auto');
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const nuove = [];
  const generale = [/settimana|da fare|guardar|novit|urgent|com'?è la situazione/i, () => {
    const c = [];
    if (st && st.latte && st.latte.ultimo_giorno){ const g = Math.round((Date.now() - new Date(st.latte.ultimo_giorno)) / 864e5); if (g > 2) c.push('il latte è registrato solo fino al ' + gm(st.latte.ultimo_giorno)); }
    if (st && st.capi && st.capi.da_fecondare) c.push(n0(st.capi.da_fecondare) + ' vacche da fecondare');
    if (st && st.capi && st.capi.parti_30gg) c.push(n0(st.capi.parti_30gg) + ' parti nei prossimi 30 giorni');
    if (mg && mg.avvisi && mg.avvisi.length) c.push(mg.avvisi.length + ' prodotti del magazzino da controllare');
    if (lv && lv.in_ritardo) c.push(lv.in_ritardo + ' lavori in ritardo');
    if (auto && auto.scadenze) auto.scadenze.filter(s => s.data && (new Date(s.data) - Date.now()) / 864e5 <= 30).forEach(s => c.push(s.titolo.toLowerCase() + ' dell’auto entro il ' + gm(s.data)));
    return c.length ? 'Da guardare: ' + c.join('; ') + '.' : 'Niente di urgente: è tutto a posto.'; }, 'riassunti del PC'];
  if (st) nuove.push([/vacch|capi|mandria|gravid|lattaz|ascius/i, () => { const C = st.capi || {};
    return n0(C.lattazione) + ' vacche in lattazione e ' + n0(C.asciutta) + ' in asciutta; ' + n0(C.gravide) + ' gravide, ' + n0(C.da_fecondare) + ' da fecondare.'; }, 'Gestionale · stalla']);
  if (mg) nuove.push([/gasolio|adblue|magazzin|scort|giacenz|c'?è ancora|rimast/i, q => {
    const qn = norm(q), hit = (mg.prodotti || []).filter(p => norm(p.nome).split(/[^a-z0-9]+/).some(w => w.length >= 4 && qn.includes(w)));
    if (hit.length) return hit.slice(0, 4).map(p => p.nome + ': ' + numIt(p.g, p.g % 1 ? 1 : 0) + ' ' + p.u).join('; ') + '.';
    const g = mg.gasolio || []; return (g.length ? g.map(p => p.nome + ': ' + n0(p.g) + ' ' + p.u).join('; ') + '. ' : '') + (mg.avvisi && mg.avvisi.length ? mg.avvisi.length + ' prodotti da controllare in magazzino.' : 'Nessun prodotto da controllare.'); }, 'Gestionale · magazzino']);
  if (me) nuove.push([/prezz|mercat|quotaz|vale|spot|urea|soia|fieno|orzo/i, q => {
    const qn = norm(q), l = (me.prezzi || []).filter(p => p.ultimo), hit = l.filter(p => norm(p.nome).split(/[^a-z0-9]+/).some(w => w.length >= 4 && qn.includes(w)));
    return (hit.length ? hit : l.filter(p => p.gruppo === 'latte')).slice(0, 4).map(p => p.nome + ' ' + numIt(p.ultimo[1], p.ultimo[1] < 10 ? 3 : 2) + ' ' + p.u).join('; ') + '.'; }, 'Gestionale · mercati']);
  if (lv) nuove.push([/lavor|semin|raccol|trattament|mezz|trattor/i, q => /mezz|trattor/i.test(q)
    ? 'Mezzi: ' + (lv.mezzi || []).map(m => m.nome).join(', ') + '.'
    : 'Ultimi lavori: ' + (lv.ultimi || []).slice(0, 4).map(o => o.tipo + (o.campo ? ' ' + o.campo : '') + ' il ' + gm(o.data)).join('; ') + '.' + (lv.in_ritardo ? ' In ritardo: ' + lv.in_ritardo + '.' : ''), 'Gestionale · lavori']);
  if (no && no.articoli && no.articoli.length) nuove.push([/notizi|giornal|news/i, () => 'Notizie del ' + gm(no.giorno) + ': ' + no.articoli.slice(0, 3).map(a => a.titolo).join(' · ') + '.', 'rassegna del gestionale']);
  if (auto) nuove.unshift([/auto|macchin|bollo|revision|tagliand|assicuraz/i, () => (auto.scadenze || []).slice(0, 4).map(s => s.titolo + (s.data ? ' il ' + gm(s.data) : '') + (s.km ? ' a ' + n0(s.km) + ' km' : '')).join('; ') + '.', 'Libretto dell’auto']);
  // le risposte finte che parlano di cose ormai vere escono
  for (let i = RISP.length - 1; i >= 0; i--) if (/vacca 214|silo 2/i.test(typeof RISP[i][1] === 'string' ? RISP[i][1] : '')) RISP.splice(i, 1);
  RISP.unshift(...nuove, generale);
  // la regola del mondo trading viene prima di tutto: su comprare e vendere nessun consiglio (Agente Smith 26/11)
  const iNo = RISP.findIndex(x => x[0].test('compr')); if (iNo > 0) RISP.unshift(...RISP.splice(iNo, 1));
  // striscia Azienda: i mezzi veri; silos e fotovoltaico restano esempi e lo dicono
  const voci = STRISCIA.azienda[1];
  voci.forEach((v, i) => { if (/^Mezzi/.test(v[0]) && lv && lv.mezzi) voci[i] = ['Mezzi', lv.mezzi.length + (lv.mezzi.length === 1 ? ' trattore' : ' trattori'), 100];
    else if (/^Silo|^Fotovolt/.test(v[0])) { v[0] += ' (esempio)'; v[3] = ''; } });
  for (let i = DA_GUARDARE.length - 1; i >= 0; i--) if (/silos|fv/.test(DA_GUARDARE[i][1]) && DA_GUARDARE[i][0] === 'azienda') DA_GUARDARE.splice(i, 1);
  SUGG.splice(0, SUGG.length, 'Cosa c\'è da guardare?', 'Quanto gasolio c\'è?', 'Prezzo del latte?', 'Ultimi lavori?');
})(); }
/** Un campo citato nella domanda ("dov'è il Campo Nord?") */
function trovaCampo(q){
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const d = ' ' + norm(q) + ' ', nomi = GEO_CAMPI.filter(c => !c.parte && norm(c.nome).length >= 3);
  let hit = nomi.filter(c => d.includes(' ' + norm(c.nome) + ' ')).sort((a, b) => b.nome.length - a.nome.length)[0];
  if (!hit && /dov|trova|mostra|campo/.test(d)){
    const resto = norm(d.replace(/\b(dov e|dove|dov|e|il|lo|la|i|gli|le|campo|campi|trova|trovami|mostra|mostrami|si|trova)\b/g, ' '));
    if (resto.length >= 3) hit = nomi.find(c => norm(c.nome).includes(resto)); }
  return hit || null;
}

/** Trasforma i campi (geom GeoJSON in lon/lat) in poligoni della scena, centrati e scalati per stare nel disco. */
function geoInScena(sorgente, raggio = 36){
  const righe = sorgente && sorgente.type === 'FeatureCollection'
    ? sorgente.features.map(f => Object.assign({}, f.properties, {geom: f.geometry})) : (sorgente || []);
  const anelli = [];
  righe.forEach(r => { const g = r.geom; if (!g) return;
    const poli = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    poli.forEach((p, k) => p && p[0] && anelli.push([r, p[0], k])); });   // solo il bordo esterno
  if (!anelli.length) return [];
  let lon0 = 0, lat0 = 0, n = 0;
  anelli.forEach(([, a]) => a.forEach(([x, y]) => { lon0 += x; lat0 += y; n++; })); lon0 /= n; lat0 /= n;
  const kx = 111320 * Math.cos(lat0 * Math.PI / 180), ky = 110540; let max = 1;
  const metri = anelli.map(([r, a, k]) => { const pts = a.map(([lon, lat]) => { const x = (lon - lon0) * kx, z = -(lat - lat0) * ky;
      max = Math.max(max, Math.abs(x), Math.abs(z)); return [x, z]; });
    const u = pts[pts.length-1], p = pts[0]; if (pts.length > 3 && u[0] === p[0] && u[1] === p[1]) pts.pop();
    return [r, pts, k]; });
  const s = raggio / max;
  const out = metri.map(([r, pts, k]) => ({id: String(r.id), parte: k, nome: r.nome || 'Campo', coltura: r.coltura || '',
    ettari: r.ettari, stato: r.stato || '', punti: pts.map(([x, z]) => [x * s, z * s])}));
  out.metriPerUnita = 1 / s;                                                  // per la scala in metri
  out.aScena = (lon, lat) => [(lon - lon0) * kx * s, -(lat - lat0) * ky * s]; // per mettere la foto satellitare
  return out;
}
const tessLon = (x, z) => x / 2 ** z * 360 - 180;
const tessLat = (y, z) => Math.atan(Math.sinh(Math.PI * (1 - 2 * y / 2 ** z))) * 180 / Math.PI;
function caricaScript(src){ return new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok;
  s.onerror = () => ko(new Error('script non caricato: ' + src)); document.head.append(s); }); }

// =====================================================================
// UTILITÀ
// =====================================================================
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const aspetta = ms => new Promise(r => setTimeout(r, ms));
const limita = (v, a, b) => Math.max(a, Math.min(b, v));
const riduci = matchMedia('(prefers-reduced-motion: reduce)').matches;
const telefono = () => innerWidth <= 900;
const nomeMondo = m => (MONDI.find(x => x[0] === m) || [m, m])[1];
const nDaGuardare = m => DA_GUARDARE.filter(x => (m === 'costrutto' || x[0] === m) && x[5]).length;
let mondo = 'costrutto';
const parametri = new URLSearchParams(location.search);
// sfondo dei mondi: da provare (paesaggio, pioggia di codice dietro, oppure pulito). Si ricorda in questo browser.
const NOMI_SFONDO = {paesaggio:'paesaggio', pioggia:'pioggia di codice', pulito:'pulito'};
let SFONDO = 'paesaggio';
try { const s = localStorage.getItem('matrix-sfondo'); if (NOMI_SFONDO[s]) SFONDO = s; } catch (_) {}

// =====================================================================
// INTERFACCIA: schede, saluto, striscia, dettaglio, Oracolo, cassetto
// =====================================================================
function disegnaSchede(){
  let html = '', sep = false;
  MONDI.forEach(([m, nome, extra]) => { if (extra && !sep){ html += '<span class="sep"></span>'; sep = true; }
    const n = m === 'costrutto' ? 0 : nDaGuardare(m);
    html += `<button class="scheda ${m === mondo ? 'on' : ''} ${extra ? 'extra' : ''}" data-m="${m}" style="--c:${ACCENTI[m]}" ${m === mondo ? 'aria-current="page"' : ''}>
      <i></i>${esc(nome)}${n ? `<span class="n" aria-label="${n} da guardare">${n}</span>` : ''}</button>`; });
  $('#schede').innerHTML = html;
}
function disegnaSotto(){
  const d = new Date().toLocaleDateString('it-IT', {weekday:'short', day:'numeric', month:'short'});
  $('#sotto').innerHTML = `<span class="lungo">${esc(d)} · </span><b>${nDaGuardare('costrutto')} da guardare</b> · ${APPR.length} da approvare`;
  $('#badge').textContent = APPR.length || '';
}
const spark = n => { let v = 50, p = []; for (let k = 0; k < 16; k++){ v = limita(v + Math.sin(n*7 + k*1.7)*14, 5, 95); p.push(`${k*4.4},${20 - v*.18}`); } return p.join(' '); };
function datiStriscia(id){
  if (id && STRISCIA[id]) return STRISCIA[id];
  if (id && DETT[id]) { const [t, , righe] = DETT[id];
    return [t, righe.slice(0, 4).map(([l, v, c]) => [l, v, c === 'ok' ? 100 : c === 'at' ? 30 : c === 'no' ? 15 : 60, c === 'ok' ? '' : c])]; }
  if (mondo === 'costrutto') return ['Il Costrutto', [['Da guardare', String(nDaGuardare('costrutto')), 45, 'at'],
    ['Da approvare', String(APPR.length), APPR.length*20], ['Mondi attivi', '4 su 4', 100], ['Agenti accesi', '8 su 8', 100]]];
  return STRISCIA[mondo] || [nomeMondo(mondo), []];
}
function striscia(id){
  const [tit, voci] = datiStriscia(id); const C = 2 * Math.PI * 20;
  const nota = id && id !== mondo ? 'tocca il vuoto o “Vista intera” per tornare' : (NOTA_MONDO[mondo] || 'tocca un oggetto');
  $('#striscia').innerHTML = `<div class="stit"><span class="occhiello">Stai guardando</span><b>${esc(tit)}</b><span class="nota">${esc(nota)}</span>
    <span class="dx"><span id="tempo"></span> · <button class="sfondo-btn" data-azione="sfondo" title="Cambia lo sfondo">sfondo: ${esc(NOMI_SFONDO[SFONDO])}</button> · v6 · ${FONTI.campi ? 'campi veri dal gestionale, il resto finto' : 'dati finti'}</span></div>
    <div class="indic">${voci.map(([l, v, p, c, col], k) => `<div class="ind ${c || ''}" ${col ? `style="--acc:${col}"` : ''}>
      <svg class="anello" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true"><circle class="fondo" cx="26" cy="26" r="20"/>
        <circle class="arco" cx="26" cy="26" r="20" transform="rotate(-90 26 26)" stroke-dasharray="${(C*limita(p,0,100)/100).toFixed(1)} ${C.toFixed(1)}"/></svg>
      <div class="testo"><div class="val">${esc(v)}</div><div class="lab">${esc(l)}</div>
        <svg class="spark" width="70" height="20" aria-hidden="true"><polyline points="${spark(k + l.length)}"/></svg></div></div>`).join('')}</div>`;
  scriviTempo(); aggiornaSpazi();
}
function apriDett(id){
  const d = DETT[id]; const rami = RAMI[id]; if (!d && !rami) return chiudiDett();
  const [t, s, righe = [], nota] = d || [id, ''];
  $('#dett').innerHTML = `<div class="maniglia"></div><div class="dtesta"><span class="occhiello">${esc(nomeMondo(mondo))} · dettaglio</span>
      <button class="chiudi" data-azione="indietro" aria-label="Chiudi e torna alla vista intera">✕</button></div>
    <h3>${esc(t)}</h3><p class="sub">${esc(s)}</p>
    ${rami ? `<div class="rami${E.zone && E.zone[id] ? ' zone' : ''}">${rami.map(([n, l, c, dd]) => dd && dd !== id
        ? `<button class="ramo ${c || ''}" data-d="${dd}"><span class="num">${esc(n)}</span><span>${esc(l)}</span></button>`
        : `<div class="ramo ${c || ''}"><span class="num">${esc(n)}</span><span>${esc(l)}</span></div>`).join('')}</div>` : ''}
    ${righe.map(([a, b, c]) => `<div class="riga"><span>${esc(a)}</span><b class="${c || ''}">${esc(b)}</b></div>`).join('')}
    ${nota ? `<div class="nota-d">${esc(nota)}</div>` : ''}
    ${E.zone && E.zone.tetto && E.zone[id] && id !== 'tetto' ? `<button class="tetto-btn" id="tetto-btn" data-azione="tetto">${tettoVia() ? 'Rimetti il tetto' : 'Togli il tetto'}</button>` : ''}`;
  const el = $('#dett'); el.classList.add('aperto'); el.inert = false; el.scrollTop = 0; aggiornaSpazi();
}
function chiudiDett(){ const el = $('#dett'); el.classList.remove('aperto'); el.inert = true; aggiornaSpazi(); }

// ---------- Oracolo ----------
function apriOracolo(){ $('#cassetto').hidden = true; $('#oracolo').hidden = false; riepilogo(); setTimeout(() => $('#q').focus(), 20); }
function chiudiOracolo(){ $('#oracolo').hidden = true; }
function riepilogo(){
  const voci = DA_GUARDARE.filter(x => mondo === 'costrutto' || x[0] === mondo);
  const voce = (m, d, t, sotto, lv, dove) => `<button class="voce ${lv || ''}" data-vai="${m}|${d || ''}"><span class="pt"></span>
    <span><b>${esc(t)}</b><small>${esc(sotto)}</small></span>${dove ? `<span class="dove">${esc(dove)}</span>` : ''}</button>`;
  $('#riepilogo').innerHTML = `<div class="blocco"><h4>${mondo === 'costrutto' ? 'Riepilogo del mattino' : 'Da guardare · ' + esc(nomeMondo(mondo))}</h4>
      ${voci.map(([m, d, , t, f, lv]) => voce(m, d, t, 'fonte: ' + f, lv, nomeMondo(m))).join('') || '<p class="vuoto-c">Niente da guardare qui.</p>'}</div>
    <div class="blocco"><h4>Incroci tra mondi</h4>${ANALISI.map(([t, s, lv, m, d]) => voce(m, d, t, s, lv, nomeMondo(m))).join('')}</div>`;
}
function msg(t, chi, fonte){ const d = document.createElement('div'); d.className = 'm ' + chi;
  d.innerHTML = esc(t) + (fonte ? `<span class="fonte">fonte: ${esc(fonte)}</span>` : ''); $('#msgs').append(d); d.scrollIntoView({block:'nearest'}); }
function chiedi(q){ if (!q.trim()) return; msg(q, 'u');
  const c = trovaCampo(q);
  if (c){ setTimeout(() => { msg(`${c.nome}: ${c.ettari ? numIt(c.ettari, 2) + ' ha' : 'superficie non indicata'}${c.coltura ? ', ' + c.coltura : ''}. È ${doveCampo(c)}. Te lo mostro.`, 'o', FONTI.campi ? 'Gestionale · campi' : 'campi finti');
    setTimeout(() => vai('campi', c.id), 900); }, 300); return; }
  const z = FONTI.modelloAzienda && ZONE_GLB.find(([re, d]) => d && d !== 'stalla' && d !== 'muri' && re.test(q));
  if (z){ setTimeout(() => { msg(`${z[2]}: ${z[3]}. Te la mostro nel progetto 3D della stalla.`, 'o', 'progetto 3D della stalla');
    setTimeout(() => vai('azienda', z[1]), 900); }, 300); return; }
  const r = RISP.find(([re]) => re.test(q)) || [0, 'Questo dato non ce l\'ho ancora. Quando il Fabbro avrà aperto la porta giusta, saprò risponderti.', 'nessuna'];
  setTimeout(() => msg(typeof r[1] === 'function' ? r[1](q) : r[1], 'o', r[2]), 380); }
$('#f').addEventListener('submit', e => { e.preventDefault(); chiedi($('#q').value); $('#q').value = ''; });
$('#sugg').innerHTML = SUGG.map(s => `<button type="button">${esc(s)}</button>`).join('');

// ---------- cassetto ----------
function disegnaCassetto(){
  $('#scelte-sfondo').innerHTML = Object.entries(NOMI_SFONDO).map(([k, n]) => `<button class="${k === SFONDO ? 'on' : ''}" data-sfondo="${k}">${esc(n[0].toUpperCase() + n.slice(1))}</button>`).join('');
  $('#approvazioni').innerHTML = APPR.length ? APPR.map(a => `<div class="appr" data-id="${a.id}"><div class="chi">${esc(a.chi)} · ${esc(a.ann)}</div><p>${esc(a.cosa)}</p>
    <div class="pillole"><button class="pill r" data-ok="1">Pillola rossa · sì</button><button class="pill b" data-ok="0">Pillola blu · no</button></div></div>`).join('')
    : '<p class="vuoto-c">Nessuna richiesta: Seraph non ha niente in coda.</p>';
  $('#agenti').innerHTML = AG.map(([n, s, t]) => `<div class="agente"><i class="led ${s}"></i>${esc(n)}<small>${esc(t)}</small></div>`).join('');
}

// ---------- saluto e ora ----------
function oraVera(){ const p = parametri.get('ora'); const d = new Date(); return p !== null && p !== '' && !isNaN(+p) ? limita(+p, 0, 23.99) : d.getHours() + d.getMinutes()/60; }
function scriviTempo(){ const el = $('#tempo'); if (!el) return; const t = document.body.dataset.tempo;
  el.textContent = (t === 'notte' ? '☾ notte' : t === 'sera' ? '◐ ' + (oraVera() < 12 ? 'alba' : 'tramonto') : '☀ giorno') + ' · ' + new Date().toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'}); }
(function saluta(){ const h = oraVera();
  const testo = (h < 5 ? 'Buonanotte' : h < 13 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera') + (window.MATRIX_NOME ? ', ' + window.MATRIX_NOME : '') + '.';
  if (riduci) { $('#saluto').textContent = testo; return; }
  let i = 0; (function scrivi(){ $('#saluto').textContent = testo.slice(0, ++i); if (i < testo.length) setTimeout(scrivi, 45); })(); })();

// ---------- spazi occupati dai vetri (per centrare la scena nello spazio libero) ----------
function aggiornaSpazi(){
  const S = $('#striscia').getBoundingClientRect(), H = $('header .saluto').getBoundingClientRect();
  const basso = S.height ? innerHeight - S.top : 0;
  document.documentElement.style.setProperty('--sotto', Math.round(basso + 12) + 'px');
  document.documentElement.style.setProperty('--sopra', Math.round(H.bottom - (parseFloat(getComputedStyle(document.documentElement).paddingTop) || 0)) + 'px');
  if (!E.R) return;
  const dett = $('#dett'), aperto = dett.classList.contains('aperto');
  let x = 0, y = (basso - H.bottom) / 2;
  if (aperto){ if (telefono()) y = (dett.offsetHeight - H.bottom) / 2; else x = (dett.offsetWidth + 16) / 2; }
  E.ofsMeta.x = x; E.ofsMeta.y = y;
}

// =====================================================================
// MOTORE 3D: un solo disegnatore, una scena, la telecamera che vola
// =====================================================================
const E = {R:null, ofs:{x:0, y:0}, ofsMeta:{x:0, y:0}, bordi:[], anima:[], etich:[], punti:{}, luciNotte:[], sel:null, auto:true};
const VISTE = {costrutto:{dist:96, el:.62, ty:4}, azienda:{dist:104, el:.5, ty:4}, campi:{dist:100, el:.68, ty:2}, trading:{dist:104, el:.4, ty:9},
  vita:{dist:96, el:.5, ty:5}, scuola:{dist:92, el:.64, ty:4}, lab:{dist:70, el:.42, ty:5}};
function vista(m){ const v = Object.assign({}, VISTE[m] || VISTE.costrutto); const a = innerWidth / innerHeight;
  if (nordFisso(m)) Object.assign(v, {dist:118, el:1.05, ty:0});
  if (a < 1) v.dist *= 1.15 + (1 - a) * 1.2; return v; }
let texAlone = null;
function creaTexAlone(){ const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.22, 'rgba(255,255,255,.5)');
  g.addColorStop(.55, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c); }

function init3D(){
  if (!window.THREE){ $('#no3d').hidden = false; return false; }
  const cv = $('#scena3d');
  E.leggero = telefono() || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) || parametri.has('leggero');
  try { E.R = new THREE.WebGLRenderer({canvas:cv, antialias:!E.leggero, alpha:true, powerPreference:'high-performance'}); }
  catch (err) { console.warn('WebGL non disponibile:', err.message); $('#no3d').hidden = false; return false; }
  E.R.setPixelRatio(Math.min(devicePixelRatio, E.leggero ? 1.5 : 2));
  if (!E.leggero){ E.R.shadowMap.enabled = true; E.R.shadowMap.type = THREE.PCFSoftShadowMap; }
  E.scena = new THREE.Scene(); E.scena.fog = new THREE.Fog(0x3a424d, 170, 470);
  E.cam = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, .5, 900);
  E.emi = new THREE.HemisphereLight(0xc9d6e6, 0x15171a, .5); E.scena.add(E.emi);
  E.sole = new THREE.DirectionalLight(0xffffff, .8); E.sole.position.set(60, 80, 50);
  if (!E.leggero){ E.sole.castShadow = true; const s = E.sole.shadow; s.mapSize.set(2048, 2048); s.bias = -.0006; s.normalBias = .03;
    Object.assign(s.camera, {left:-64, right:64, top:64, bottom:-64, near:1, far:320}); s.camera.updateProjectionMatrix(); }
  E.scena.add(E.sole, E.sole.target);
  texAlone = creaTexAlone();
  if (!E.leggero){ // stelle (si vedono solo di notte)
    const p = []; for (let k = 0; k < 700; k++){ const a = Math.random()*Math.PI*2, b = Math.random()*Math.PI*.45 + .08, r = 420;
      p.push(Math.cos(a)*Math.cos(b)*r, Math.sin(b)*r, Math.sin(a)*Math.cos(b)*r); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    E.stelle = new THREE.Points(g, new THREE.PointsMaterial({color:0xb8c4d8, size:1.6, sizeAttenuation:false, transparent:true, opacity:.75, fog:false}));
    E.scena.add(E.stelle); }
  const v = vista(mondo);
  E.cur = {az:-.55, el:1.25, dist:v.dist*2.2, t:new THREE.Vector3(0, v.ty, 0)};
  E.meta = {az:-.45, el:v.el, dist:v.dist, t:new THREE.Vector3(0, v.ty, 0)};
  E.ray = new THREE.Raycaster(); E.ndc = new THREE.Vector2(); E.tmp = new THREE.Vector3();
  controlli(cv); addEventListener('resize', ridimensiona); ridimensiona();
  luceDelGiorno(); setInterval(luceDelGiorno, 60000);
  E.t0 = E.ultimo = performance.now(); requestAnimationFrame(giro);
  return true;
}
function ridimensiona(){
  if (!E.R) return aggiornaSpazi();
  const w = innerWidth, h = innerHeight; E.R.setSize(w, h, false);
  E.cam.aspect = w / h; E.cam.fov = w / h < 1 ? 50 : 38; E.cam.updateProjectionMatrix();
  aggiornaSpazi();
}
/** Giorno e notte secondo l'ora vera (o ?ora=22 nell'indirizzo per provare). */
function luceDelGiorno(){
  const h = oraVera(), g = Math.max(0, Math.sin((h - 6) / 12 * Math.PI));
  document.body.dataset.tempo = g > .32 ? 'giorno' : g > 0 ? 'sera' : 'notte'; scriviTempo();
  if (!E.R) return;
  const caldo = new THREE.Color(0xffbf86), bianco = new THREE.Color(0xfff6ea);
  if (g > 0){ E.sole.color.copy(caldo.lerp(bianco, Math.min(1, g * 1.7))); E.sole.intensity = .55 + .6 * g;
    const a = (h - 6) / 12 * Math.PI; E.sole.position.set(Math.cos(a) * 95, 18 + Math.sin(a) * 85, 55); }
  else { E.sole.color.set(0x9fb4e6); E.sole.intensity = .45; E.sole.position.set(-50, 90, -40); }
  E.emi.intensity = (E.leggero ? .7 : .55) + .35 * g; E.emi.color.set(g > 0 ? 0xdde6f0 : 0x7586aa); E.emi.groundColor.set(g > 0 ? 0x3a3f46 : 0x22262e);
  const neb = getComputedStyle(document.body).getPropertyValue('--nebbia').trim() || '#15181d';
  E.scena.fog.color.set(neb);
  E.notte = g < .12;
  if (E.stelle) E.stelle.visible = g < .15;
  E.luciNotte.forEach(s => s.visible = E.notte);
}
function controlli(cv){
  // un dito / mouse: ruota · due dita: ingrandisci e sposta · tasto destro o Maiusc + trascina: sposta · rotella: ingrandisci
  let giu = false, px = 0, py = 0, mosso = 0, ultimoHover = 0, sposta = false;
  const dita = new Map(); let pinza = null, ultimoTocco = null;
  // doppio tocco (o doppio clic): si avvicina al punto toccato
  function avvicina(x, y){
    if (!E.G) return; E.ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); E.ray.setFromCamera(E.ndc, E.cam);
    const h = E.ray.intersectObjects(E.G.children, true)[0], p = h ? h.point.clone() : E.ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3());
    if (!p) return; const r = Math.hypot(p.x, p.z); if (r > 80){ p.x *= 80 / r; p.z *= 80 / r; }
    E.meta.t.copy(p); zoom(.5); nascondiGuida(); }
  cv.addEventListener('dblclick', e => { e.preventDefault(); avvicina(e.clientX, e.clientY); });
  const minDist = () => nordFisso(mondo) ? 3 : 3.5, maxDist = 190;
  const zoom = f => { E.meta.dist = limita(E.meta.dist * f, minDist(), maxDist); E.auto = false; $('#indietro').hidden = false; };
  function trasla(dx, dy){ // muove il punto guardato come una mappa sotto il dito
    const k = E.meta.dist * .0016, s = Math.sin(E.meta.az), c = Math.cos(E.meta.az);
    E.meta.t.x += -c * dx * k - s * dy * k; E.meta.t.z += s * dx * k - c * dy * k;
    const r = Math.hypot(E.meta.t.x, E.meta.t.z); if (r > 80){ E.meta.t.x *= 80 / r; E.meta.t.z *= 80 / r; }
    E.cur.t.copy(E.meta.t); E.auto = false; $('#indietro').hidden = false; }
  const mezzo = () => { const [a, b] = [...dita.values()]; return {x:(a.x + b.x) / 2, y:(a.y + b.y) / 2, d:Math.hypot(a.x - b.x, a.y - b.y) || 1}; };
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('pointerdown', e => {
    dita.set(e.pointerId, {x:e.clientX, y:e.clientY});
    try { cv.setPointerCapture(e.pointerId); } catch (_) {} nascondiGuida();
    if (dita.size === 2){ pinza = mezzo(); giu = false; mosso = 99; return; }
    if (dita.size > 2) return;
    giu = true; E.trascina = true; px = e.clientX; py = e.clientY; mosso = 0; sposta = e.button === 2 || e.shiftKey; });
  cv.addEventListener('pointermove', e => {
    if (dita.has(e.pointerId)) dita.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if (pinza && dita.size === 2){ const m = mezzo();
      zoom(pinza.d / m.d); trasla(m.x - pinza.x, m.y - pinza.y); pinza = m; return; }
    if (!giu){ if (e.pointerType === 'mouse' && e.timeStamp - ultimoHover > 90){ ultimoHover = e.timeStamp; cv.style.cursor = prendi(e.clientX, e.clientY) ? 'pointer' : ''; } return; }
    const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; mosso += Math.abs(dx) + Math.abs(dy);
    if (mosso < 6) return;
    if (sposta) return trasla(dx, dy);
    E.meta.az -= dx * .0062; E.meta.el = limita(E.meta.el + dy * .004, .16, 1.38); E.cur.az = E.meta.az; E.cur.el = E.meta.el; });
  const su = e => { dita.delete(e.pointerId);
    if (pinza){ if (dita.size < 2) pinza = null;
      if (dita.size === 1){ const [d] = [...dita.values()]; px = d.x; py = d.y; giu = true; sposta = false; } // resta un dito: riprende a ruotare senza salti
      else { giu = false; E.trascina = false; } return; }
    if (!giu) return; giu = false; E.trascina = false;
    if (mosso < 6 && e.type === 'pointerup'){
      const ora = e.timeStamp, doppio = ultimoTocco && ora - ultimoTocco.t < 330 && Math.hypot(e.clientX - ultimoTocco.x, e.clientY - ultimoTocco.y) < 40;
      ultimoTocco = doppio ? null : {t:ora, x:e.clientX, y:e.clientY};
      if (doppio) avvicina(e.clientX, e.clientY); else tocca(e.clientX, e.clientY); } };
  cv.addEventListener('pointerup', su); cv.addEventListener('pointercancel', su);
  cv.addEventListener('wheel', e => { e.preventDefault(); zoom(1 + Math.sign(e.deltaY) * .12); nascondiGuida(); }, {passive:false});
}
function prendi(x, y){
  if (!E.G) return null;
  E.ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); E.ray.setFromCamera(E.ndc, E.cam);
  for (const h of E.ray.intersectObjects(E.G.children, true)){ let o = h.object;
    while (o && o !== E.G && !o.userData.d && !o.userData.m) o = o.parent;
    if (o && o !== E.G) return o.userData; }
  return null;
}
function tocca(x, y){ const u = prendi(x, y);
  if (!u){ if (E.sel) indietro(); return; }
  if (u.m) return vaiMondo(u.m);
  seleziona(u.d); }

/** Tocca un oggetto: la telecamera si avvicina, si apre il dettaglio, cambia la striscia. */
function seleziona(d){
  E.sel = d; const p = E.punti[d];
  if (p && E.R){ E.meta.t.copy(p.c); E.meta.dist = p.r; E.meta.el = limita(E.meta.el, .42, .72); E.auto = false; }
  $('#indietro').hidden = false;
  E.etich.forEach(x => { x.el.classList.toggle('sel', x.d === d); x.el.classList.toggle('fioco', x.d !== d); });
  apriDett(d); striscia(d); aggiornaZone();
}
function indietro(){
  E.sel = null; E.tettoVia = null; chiudiDett(); vistaIntera(); striscia(null); $('#indietro').hidden = true;
  E.etich.forEach(x => x.el.classList.remove('sel', 'fioco')); aggiornaZone();
}
function vistaIntera(){ if (!E.R) return; const v = vista(mondo); E.meta.t.set(0, v.ty, 0); E.meta.dist = v.dist; E.meta.el = v.el;
  E.auto = !nordFisso(mondo); if (!E.auto) E.meta.az = Math.round(E.cur.az / (Math.PI * 2)) * Math.PI * 2; }

let inVolo = false;
/** Cambio mondo: breve volo con la pioggia di codice solo durante il passaggio. */
async function vaiMondo(m, poi){
  if (inVolo || !MONDI.some(x => x[0] === m)) return;
  if (m === mondo){ if (poi) poi(); else indietro(); return; }
  inVolo = true; chiudiOracolo(); $('#cassetto').hidden = true;
  E.sel = null; chiudiDett(); $('#indietro').hidden = true;
  const volo = !!E.R && !riduci;
  if (volo){ pioggia(true); E.auto = false; E.meta.dist = E.cur.dist * 1.9; E.meta.el = 1.3; E.meta.az = E.cur.az + .45;
    E.etich.forEach(x => x.el.style.opacity = 0); await aspetta(560); }
  mondo = m; document.body.dataset.mondo = m; document.body.style.setProperty('--acc', ACCENTI[m]); $('#bussola').hidden = !nordFisso(m);
  disegnaSchede(); striscia(null);
  if (E.R){ await costruisci(m); const v = vista(m);
    if (volo){ E.cur.dist = v.dist * 2.3; E.cur.el = 1.32; E.cur.t.set(0, v.ty, 0); E.meta.az = E.cur.az + .7; }
    vistaIntera();
    if (!volo){ E.cur.dist = E.meta.dist; E.cur.el = E.meta.el; E.cur.t.copy(E.meta.t); } }
  if (volo){ await aspetta(380); pioggia(false); }
  inVolo = false;
  if (poi) setTimeout(poi, volo ? 450 : 0);
}
function vai(m, d){ chiudiOracolo(); if (m !== mondo) vaiMondo(m, () => d && seleziona(d)); else if (d) seleziona(d); }

async function costruisci(m){
  if (E.G){ E.scena.remove(E.G); libera(E.G); }
  E.G = new THREE.Group(); E.scena.add(E.G);
  E.bordi = []; E.anima = []; E.punti = {}; E.luciNotte = []; E.etich = []; E.zone = null; E.tettoVia = null; $('#etich').innerHTML = '';
  const k = creaKit();
  basamento(k, m);
  try { await MODELLI[m](k); } catch (err) { console.warn('Modello non costruito:', err.message); }
  calcolaPunti(); luceDelGiorno();
}
function libera(g){ g.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(x => x.dispose()); }); }
/** Per ogni oggetto toccabile: centro e distanza giusta per avvicinarsi. */
function calcolaPunti(){
  E.G.updateMatrixWorld(true); const per = {}, b = new THREE.Box3();
  E.G.traverse(o => { const d = o.userData.d; if (!d || o.userData.fuori || !(o.isMesh || o.isGroup)) return;
    b.setFromObject(o); if (b.isEmpty()) return; (per[d] = per[d] || new THREE.Box3()).union(b); });
  for (const d in per){ const c = per[d].getCenter(new THREE.Vector3()), s = per[d].getSize(new THREE.Vector3()).length();
    E.punti[d] = {c, r:nordFisso(mondo) ? limita(s * 3 + 5, 7, 60) : limita(s * 1.7 + 20, 30, 80)}; }
  E.bordi.forEach(x => { let o = x.l; while (o && o !== E.G && !o.userData.d) o = o.parent; x.d = o && o.userData.d; });
}

function giro(now){
  requestAnimationFrame(giro);
  if (window.MATRIX_PAUSA) return; // nell'app: 3D nascosto dietro la plancia, non si disegna
  if (E.leggero && now - E.ultimo < 30) return; // telefono: circa 30 fotogrammi al secondo, scalda e consuma meno
  const dt = Math.min(.05, (now - E.ultimo) / 1000); E.ultimo = now; const t = (now - E.t0) / 1000;
  if (E.auto && !E.trascina && !riduci) E.meta.az += dt * .035;
  const k = 1 - Math.exp(-dt * 3.1), c = E.cur, m = E.meta;
  c.az += (m.az - c.az) * k; c.el += (m.el - c.el) * k; c.dist += (m.dist - c.dist) * k; c.t.lerp(m.t, k);
  const ce = Math.cos(c.el);
  E.cam.position.set(c.t.x + Math.sin(c.az) * ce * c.dist, c.t.y + Math.sin(c.el) * c.dist, c.t.z + Math.cos(c.az) * ce * c.dist);
  E.cam.lookAt(c.t);
  // sposta il centro della scena nello spazio libero tra i vetri
  E.ofs.x += (E.ofsMeta.x - E.ofs.x) * k; E.ofs.y += (E.ofsMeta.y - E.ofs.y) * k;
  E.cam.setViewOffset(innerWidth, innerHeight, E.ofs.x, E.ofs.y, innerWidth, innerHeight);
  // bordi: quelli da guardare pulsano, gli altri si spengono quando ne scegli uno
  const onda = (1 + Math.sin(t * 4)) / 2;
  for (const b of E.bordi){ let o = b.lv ? .5 + .5 * onda : b.base; if (E.sel) o = b.d === E.sel ? Math.max(o, .95) : o * .22; b.m.opacity = o; }
  for (const f of E.anima) f(t, dt);
  E.R.render(E.scena, E.cam);
  // etichette che seguono gli oggetti; se si sovrappongono resta quella che conta di più
  const W = innerWidth, H = innerHeight, visibili = [];
  for (const e of E.etich){
    const v = e.segui ? E.tmp.copy(e.segui.position).add(e.su) : E.tmp.copy(e.v);
    v.project(E.cam);
    const vis = v.z < 1 && Math.abs(v.x) < 1.15 && Math.abs(v.y) < 1.15;
    if (vis !== e.vis){ e.el.style.display = vis ? '' : 'none'; e.vis = vis; }
    if (!vis) continue;
    e.x = (v.x + 1) / 2 * W; e.y = (1 - v.y) / 2 * H; visibili.push(e);
    e.el.style.transform = `translate(${e.x.toFixed(1)}px,${e.y.toFixed(1)}px) translate(-50%,-100%)`;
  }
  visibili.sort((a, b) => ((E.sel && b.d === E.sel) - (E.sel && a.d === E.sel)) || b.peso - a.peso);
  const presi = [];
  for (const e of visibili){
    const w = e.w || (e.w = e.el.offsetWidth) || 90, h = e.h || (e.h = e.el.offsetHeight) || 30, r = [e.x - w / 2 - 3, e.y - h - 3, e.x + w / 2 + 3, e.y];
    const coperta = presi.some(q => r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1]);
    if (!coperta) presi.push(r);
    if (coperta !== e.coperta){ e.el.classList.toggle('coperta', coperta); e.coperta = coperta; }
  }
  if (nordFisso(mondo) && E.metriPerUnita && (E.giri = (E.giri || 0) + 1) % 6 === 0) bussola();
}
/** Bussola (dove punta il nord sullo schermo) e scala in metri, per il mondo Campi. */
function bussola(){
  const t = E.cur.t, a = t.clone().project(E.cam), n = t.clone().add(new THREE.Vector3(0, 0, -10)).project(E.cam);
  const ang = Math.atan2((n.x - a.x) * innerWidth, (n.y - a.y) * innerHeight);
  $('#bussola .ago').style.transform = `rotate(${ang.toFixed(3)}rad)`;
  const m100 = t.clone().add(new THREE.Vector3(100 / E.metriPerUnita, 0, 0)).project(E.cam);
  const pxPerM = Math.hypot((m100.x - a.x) * innerWidth / 2, (m100.y - a.y) * innerHeight / 2) / 100;
  const passo = [20, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000].filter(m => m * pxPerM <= 130).pop() || 20;
  $('#bussola .scala i').style.width = Math.max(20, passo * pxPerM).toFixed(0) + 'px';
  $('#bussola .scala span').textContent = passo >= 1000 ? passo / 1000 + ' km' : passo + ' m';
}

// ---------- attrezzi per costruire i modelli ----------
function creaKit(){
  const L = E.leggero, G = E.G, css = n => getComputedStyle(document.body).getPropertyValue(n).trim();
  const ACC = new THREE.Color(css('--acc') || '#cfd8e3'), WARN = new THREE.Color(css('--warn') || '#ffc53d'), RED = new THREE.Color(css('--red') || '#ff5a6a');
  const colLv = lv => lv === 'at' ? WARN : lv === 'no' ? RED : ACC;
  const argilla = (col = 0x4a515b) => L ? new THREE.MeshLambertMaterial({color:col}) : new THREE.MeshStandardMaterial({color:col, roughness:.88, metalness:.02});
  const ombra = m => { if (!L){ m.castShadow = true; m.receiveShadow = true; } return m; };
  function bordi(mesh, lv){ const l = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 25),
      new THREE.LineBasicMaterial({color:colLv(lv), transparent:true, opacity:.36}));
    mesh.add(l); E.bordi.push({l, m:l.material, lv:lv || '', base:.36}); return mesh; }
  function metti(geo, x, y, z, d, lv, col){ const m = ombra(new THREE.Mesh(geo, argilla(col))); m.position.set(x, y, z);
    if (d) m.userData.d = d; bordi(m, lv); G.add(m); return m; }
  /** Etichetta HTML sopra un punto (o che segue un oggetto che si muove). */
  function etichetta(testo, x, y, z, d, lv, ex = {}){
    const tocc = d || ex.m; const el = document.createElement(tocc ? 'button' : 'div');
    el.className = 'e3d ' + (lv || '') + (ex.m ? ' mondo' : ''); if (ex.m) el.style.setProperty('--c', ACCENTI[ex.m]);
    el.innerHTML = `<b>${esc(testo)}</b>${ex.sotto ? `<small>${esc(ex.sotto)}</small>` : ''}`;
    if (d) el.dataset.d = d; if (ex.m) el.dataset.m = ex.m;
    $('#etich').append(el);
    E.etich.push({el, v:new THREE.Vector3(x, y, z), d:d || ex.m, segui:ex.segui, su:new THREE.Vector3(0, ex.su || 0, 0), vis:true,
      peso:(ex.peso || 0) + (lv ? 1000 : 0) + (ex.m ? 2000 : 0)}); }
  /** Bagliore finto: sprite additivo. notte=true → si accende solo di notte. */
  function bagliore(x, y, z, col, size, op = .55, notte = false){
    const s = new THREE.Sprite(new THREE.SpriteMaterial({map:texAlone, color:col, transparent:true, opacity:op, blending:THREE.AdditiveBlending, depthWrite:false}));
    s.position.set(x, y, z); s.scale.set(size, size, 1); G.add(s); if (notte){ E.luciNotte.push(s); s.visible = !!E.notte; } return s; }
  /** Faro di allerta: cono di luce + onda alla base, solo sulle cose da guardare. */
  function faro(x, y, z, lv = 'at'){ const c = colLv(lv);
    const cono = new THREE.Mesh(new THREE.ConeGeometry(4, 16, 24, 1, true), new THREE.MeshBasicMaterial({color:c, transparent:true, opacity:.12, side:THREE.DoubleSide, depthWrite:false}));
    cono.position.set(x, y + 8, z); cono.rotation.x = Math.PI; G.add(cono);
    const onda = new THREE.Mesh(new THREE.RingGeometry(1, 1.4, 48), new THREE.MeshBasicMaterial({color:c, transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    onda.rotation.x = -Math.PI / 2; onda.position.set(x, y + .15, z); G.add(onda);
    const al = bagliore(x, y + 1, z, c, 9, .5);
    E.anima.push(t => { const f = (t * .6) % 1; onda.scale.setScalar(1 + f * 6); onda.material.opacity = 1 - f;
      cono.material.opacity = .07 + .09 * (1 + Math.sin(t * 3)) / 2; al.material.opacity = .3 + .3 * (1 + Math.sin(t * 3)) / 2; }); }
  function capanna(w, h, r, Lg){ const s = new THREE.Shape([[0,0],[w,0],[w,h],[w/2,h+r],[0,h]].map(([a, b]) => new THREE.Vector2(a - w/2, b)));
    const g = new THREE.ExtrudeGeometry(s, {depth:Lg, bevelEnabled:false}); g.translate(0, 0, -Lg / 2); return g; }
  return {G, L, ACC, WARN, RED, colLv, argilla, ombra, bordi, metti, etichetta, bagliore, faro, capanna, anima:f => E.anima.push(f)};
}
// ---------- fondale: terreno fino all'orizzonte e un paesaggio lontano per ogni mondo ----------
/** Trama del terreno disegnata su una tela: appezzamenti con fossi (campagna) o isolati con strade (città). */
const TRAME = {};
function trama(tipo){
  if (TRAME[tipo]) return TRAME[tipo];
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'), r = casuale(tipo);
  if (tipo === 'campagna'){
    const tinte = ['#4d5946', '#56603f', '#5b5a46', '#4a5641', '#606650', '#525d4a', '#5a5f45'];
    x.fillStyle = '#4b5444'; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 70; i++){ x.save(); x.translate(r() * 512, r() * 512); x.rotate((r() - .5) * .5);
      const w = 40 + r() * 110, h = 30 + r() * 80; x.fillStyle = tinte[(r() * tinte.length) | 0]; x.fillRect(-w / 2, -h / 2, w, h);
      x.strokeStyle = 'rgba(255,255,255,.035)'; for (let k = -w / 2; k < w / 2; k += 5){ x.beginPath(); x.moveTo(k, -h / 2); x.lineTo(k, h / 2); x.stroke(); }
      x.strokeStyle = '#3f473a'; x.lineWidth = 2; x.strokeRect(-w / 2, -h / 2, w, h); x.restore(); }
    x.strokeStyle = '#6a6c63'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 180); x.bezierCurveTo(160, 150, 330, 260, 512, 220); x.stroke();
  } else {
    x.fillStyle = '#3a414c'; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++){ x.fillStyle = r() < .25 ? '#46504a' : (r() < .5 ? '#434b57' : '#3f4752'); x.fillRect(i * 64 + 6, j * 64 + 6, 52, 52); }
    x.strokeStyle = 'rgba(255,255,255,.06)'; x.lineWidth = 1; for (let i = 0; i <= 8; i++){ x.beginPath(); x.moveTo(i * 64 + 3, 0); x.lineTo(i * 64 + 3, 512); x.moveTo(0, i * 64 + 3); x.lineTo(512, i * 64 + 3); x.stroke(); }
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(7, 7); t.anisotropy = 4;
  return (TRAME[tipo] = t);
}
function casuale(seme){ let s = 0; for (const ch of seme) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function fondale(k, m){
  const F = new THREE.Group(); k.G.add(F); E.fondale = F; const r = casuale(m), L = k.L;
  const neb = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--nebbia').trim() || '#3a424d');
  const tipo = m === 'trading' ? 'citta' : (m === 'costrutto' || m === 'scuola' || m === 'lab') ? '' : 'campagna';
  const terra = new THREE.Mesh(new THREE.CircleGeometry(900, 64), new THREE.MeshLambertMaterial(tipo
    ? {map:trama(tipo)} : {color:neb.clone().lerp(new THREE.Color(0x4a525c), .4)}));
  terra.rotation.x = -Math.PI / 2; terra.position.y = -1.5; if (!L) terra.receiveShadow = true; terra.userData.terra = true; F.add(terra);
  const lontano = new THREE.Group(); F.add(lontano); E.lontano = lontano;
  if (m === 'trading'){ // una città lontana: torri sottili, qualche finestra accesa di notte
    const mat = new THREE.MeshLambertMaterial({color:0x4a5361});
    for (let i = 0, n = L ? 26 : 60; i < n; i++){ const a = r() * Math.PI * 2, d = 170 + r() * 110, h = 14 + r() * r() * 70, w = 6 + r() * 9;
      const t = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mat); t.position.set(Math.cos(a) * d, h / 2 - 1.5, Math.sin(a) * d); t.rotation.y = r() * 3; lontano.add(t);
      if (r() < .5) lontano.add(k.bagliore(t.position.x, h * (.3 + r() * .6), t.position.z, 0xffd59a, 5, .6, true)); }
  } else if (m === 'costrutto' || m === 'scuola' || m === 'lab'){ // spazio della mente: griglia e polvere luminosa
    const gr = new THREE.GridHelper(900, 90, k.ACC, k.ACC); gr.position.y = -1.45;
    [].concat(gr.material).forEach(x => { x.transparent = true; x.opacity = .07; }); lontano.add(gr);
    const p = []; for (let i = 0, n = L ? 160 : 420; i < n; i++){ const a = r() * Math.PI * 2, d = 90 + r() * 260; p.push(Math.cos(a) * d, 8 + r() * 110, Math.sin(a) * d); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    lontano.add(new THREE.Points(g, new THREE.PointsMaterial({color:k.ACC, size:L ? 2 : 1.6, sizeAttenuation:false, transparent:true, opacity:.55})));
  } else if (nordFisso(m)){ // campi veri: c'è già la foto satellitare, niente paesaggio inventato
  } else { // campagna: colline basse e filari di alberi
    const verde = m === 'vita' ? [0x4a5548, 0x56604f] : [0x46533f, 0x55624a];
    for (let i = 0, n = L ? 18 : 40; i < n; i++){ const a = (i / n) * Math.PI * 2 + r() * .2, d = 190 + r() * 120;
      const c = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8), new THREE.MeshLambertMaterial({color:new THREE.Color(verde[0]).lerp(new THREE.Color(verde[1]), r())}));
      c.scale.set(30 + r() * 50, 9 + r() * 22, 28 + r() * 40); c.position.set(Math.cos(a) * d, -3, Math.sin(a) * d); lontano.add(c); }
    const albero = new THREE.MeshLambertMaterial({color:0x3a4a3a}), cono = new THREE.ConeGeometry(2.6, 8, 7);
    for (let i = 0, n = L ? 14 : 46; i < n; i++){ const a = r() * Math.PI * 2, d = 66 + r() * 70;
      const t = new THREE.Mesh(cono, albero); t.position.set(Math.cos(a) * d, 2.5, Math.sin(a) * d); t.scale.setScalar(.7 + r() * .7); if (!L) t.castShadow = true; lontano.add(t); }
  }
  applicaSfondo();
}
function applicaSfondo(){
  if (E.fondale){ E.fondale.children.forEach(o => { o.visible = o.userData.terra ? SFONDO !== 'pioggia' : SFONDO === 'paesaggio'; }); }
  pioggiaFondo(SFONDO === 'pioggia');
}
function scegliSfondo(s){
  if (!NOMI_SFONDO[s]) return; SFONDO = s; try { localStorage.setItem('matrix-sfondo', s); } catch (_) {}
  applicaSfondo(); disegnaCassetto(); striscia(E.sel);
}
function basamento(k, m){
  fondale(k, m);
  if (nordFisso(m)) return;   // i campi veri stanno sulla foto satellitare, senza il disco
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(54, 55.5, 1.4, k.L ? 48 : 120), k.argilla(0x343b44));
  disco.position.y = -.7; if (!k.L) disco.receiveShadow = true; k.G.add(disco);
  [[54.4, .32, .3], [62, .12, .1]].forEach(([r, w, op]) => { const a = new THREE.Mesh(new THREE.RingGeometry(r, r + w, 160),
    new THREE.MeshBasicMaterial({color:k.ACC, transparent:true, opacity:op, side:THREE.DoubleSide, depthWrite:false}));
    a.rotation.x = -Math.PI / 2; a.position.y = .02; k.G.add(a); });
}

// ---------- mappa a nodi in 3D (Costrutto e Scuola) ----------
function grafo3D(k, {nodi, archi}){
  const s = .12, P = {}, BIANCO = new THREE.Color(0xe8ecf1);
  [16, 30, 44].forEach((r, i) => { const a = new THREE.Mesh(new THREE.RingGeometry(r, r + .12, 128), new THREE.MeshBasicMaterial({color:k.ACC, transparent:true, opacity:.16 - i * .03, side:THREE.DoubleSide, depthWrite:false}));
    a.rotation.x = -Math.PI / 2; a.position.y = .05; k.G.add(a); });
  nodi.forEach(([id, x, y, r, nome, sotto, lv, az = {}], i) => {
    const R = Math.max(.8, r * .11), pos = new THREE.Vector3((x - 400) * s, 3.2 + r * .16, (y - 220) * s); P[id] = pos;
    const col = az.m ? new THREE.Color(ACCENTI[az.m]) : i === 0 ? BIANCO : k.ACC;
    const g = new THREE.Group(); g.position.copy(pos);
    g.userData = az.m ? {m:az.m} : az.d ? {d:az.d} : az.r ? {d:az.r} : {};
    const mat = k.L ? new THREE.MeshLambertMaterial({color:0x1c2026, emissive:col, emissiveIntensity:.5})
      : new THREE.MeshStandardMaterial({color:0x1c2026, emissive:col, emissiveIntensity:.5, roughness:.35, metalness:.1});
    const sfera = k.ombra(new THREE.Mesh(new THREE.SphereGeometry(R, k.L ? 16 : 32, k.L ? 12 : 24), mat)); g.add(sfera);
    const al = new THREE.Sprite(new THREE.SpriteMaterial({map:texAlone, color:col, transparent:true, opacity:.5, blending:THREE.AdditiveBlending, depthWrite:false}));
    al.scale.set(R * 5.5, R * 5.5, 1); g.add(al);
    if (lv){ const anello = new THREE.Mesh(new THREE.TorusGeometry(R * 1.55, .09, 6, 48), new THREE.MeshBasicMaterial({color:k.colLv(lv), transparent:true}));
      g.add(anello); k.anima(t => { anello.rotation.x = Math.PI / 2 + Math.sin(t * .7 + i) * .4; anello.rotation.y = t * .5; anello.material.opacity = .5 + .5 * (1 + Math.sin(t * 4)) / 2; }); }
    // stelo fino a terra, come uno spillo sulla mappa
    const stelo = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -pos.y, 0), new THREE.Vector3(0, -R, 0)]),
      new THREE.LineBasicMaterial({color:col, transparent:true, opacity:.25})); g.add(stelo);
    const pz = new THREE.Mesh(new THREE.RingGeometry(R * .5, R * .62, 32), new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:.35, side:THREE.DoubleSide, depthWrite:false}));
    pz.rotation.x = -Math.PI / 2; pz.position.y = -pos.y + .06; g.add(pz);
    k.G.add(g);
    k.anima(t => { g.position.y = pos.y + Math.sin(t * .8 + i * .9) * .35; });
    k.etichetta(nome, 0, 0, 0, g.userData.d, lv, {m:az.m, sotto, segui:g, su:R + 1.2});
  });
  archi.forEach(([a, b, tipo], i) => {
    const A = P[a], B = P[b], mid = A.clone().add(B).multiplyScalar(.5); mid.y += A.distanceTo(B) * .18;
    const curva = new THREE.QuadraticBezierCurve3(A, mid, B), geo = new THREE.BufferGeometry().setFromPoints(curva.getPoints(36));
    const mat = tipo === 'x' ? new THREE.LineDashedMaterial({color:k.WARN, dashSize:.9, gapSize:.6, transparent:true, opacity:.85})
      : new THREE.LineBasicMaterial({color:k.ACC, transparent:true, opacity:tipo === 1 ? .5 : .2});
    const linea = new THREE.Line(geo, mat); if (tipo === 'x') linea.computeLineDistances(); k.G.add(linea);
    if (tipo === 1 && !k.L){ const imp = new THREE.Sprite(new THREE.SpriteMaterial({map:texAlone, color:k.ACC, transparent:true, opacity:.9, blending:THREE.AdditiveBlending, depthWrite:false}));
      imp.scale.set(1.6, 1.6, 1); k.G.add(imp); k.anima(t => imp.position.copy(curva.getPoint(((t * .22) + i * .37) % 1))); }
  });
}

// =====================================================================
// I MODELLI DEI MONDI (dati finti)
// =====================================================================
function aziendaDisegnata(k){
  const {metti, etichetta, faro, capanna, argilla, bordi, ombra, bagliore, G, ACC, WARN, L} = k;
  // stalla lunga con il fotovoltaico sul tetto
  metti(capanna(14, 6, 4, 32), -6, 0, 0, 'stalla'); etichetta('Stalla', -6, 13, 0, 'stalla', 'at', {sotto:'vacca 214 · ruminazione'}); faro(-2, 0, 6, 'at');
  bagliore(-6, 3.2, 16.4, 0xffd59a, 6, .7, true); bagliore(-6, 3.2, -16.4, 0xffd59a, 6, .7, true);
  const fv = new THREE.Group(); fv.userData.d = 'fv';
  const matFv = L ? new THREE.MeshLambertMaterial({color:0x1b2a40}) : new THREE.MeshStandardMaterial({color:0x1b2a40, roughness:.35, metalness:.35});
  for (let i = 0; i < 6; i++){ const p = bordi(ombra(new THREE.Mesh(new THREE.BoxGeometry(6.2, .25, 4.2), matFv))); p.position.set(-9.4, 8.1, -12.5 + i * 5); p.rotation.z = .52; fv.add(p); }
  G.add(fv); bagliore(-9.4, 9, 0, ACC, 22, .12);
  etichetta('Fotovoltaico', -13, 12.5, -14, 'fv', '', {sotto:'41 kWh oggi'});
  metti(new THREE.BoxGeometry(9, 5, 9), 8, 2.5, -12, 'sala'); etichetta('Sala mungitura', 8, 7.5, -12, 'sala', '', {sotto:'2.000 L ieri'});
  bagliore(8, 2.5, -7.4, 0xffd59a, 5, .7, true);
  // silos: guscio trasparente con il livello dentro
  [[18, 4, 64], [23, 4, 18], [28, 4, 71]].forEach(([x, z, liv], i) => { const lv = liv < 25 ? 'at' : '', h = 14;
    const g = new THREE.Group(); g.position.set(x, 0, z); g.userData.d = 'silos';
    const gus = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, h, 28, 1, true), new THREE.MeshBasicMaterial({color:lv ? WARN : ACC, transparent:true, opacity:.07, side:THREE.DoubleSide, depthWrite:false}));
    gus.position.y = h / 2; bordi(gus, lv); g.add(gus);
    const pieno = ombra(new THREE.Mesh(new THREE.CylinderGeometry(2, 2, h * liv / 100, 28), argilla((lv ? WARN : ACC).clone().multiplyScalar(.42))));
    pieno.position.y = h * liv / 200; g.add(pieno);
    const cap = bordi(ombra(new THREE.Mesh(new THREE.ConeGeometry(2.4, 2, 28), argilla())), lv); cap.position.y = h + 1; g.add(cap);
    G.add(g); etichetta(`Silo ${i + 1}`, x, h + 4.2, z, 'silos', lv, {sotto:liv + '%'}); if (lv) faro(x, 0, z, 'at'); });
  // rimessa aperta con due trattori
  metti(new THREE.BoxGeometry(16, .6, 9), 12, 6, 16, 'rimessa');
  [[-7.5, -4], [7.5, -4], [-7.5, 4], [7.5, 4]].forEach(([a, b]) => metti(new THREE.CylinderGeometry(.3, .3, 6, 8), 12 + a, 3, 16 + b, 'rimessa'));
  [[7, ''], [16, 'at']].forEach(([x, lv]) => { metti(new THREE.BoxGeometry(4, 2.4, 2.6), x, 2.2, 16, 'rimessa', lv, 0x343a41);
    [[-1.3, 1.5], [1.4, 1.5], [-1.3, -1.5], [1.4, -1.5]].forEach(([a, b], i) => { const rr = i % 2 ? .9 : 1.3;
      const w = metti(new THREE.CylinderGeometry(rr, rr, .6, 16), x + a, rr, 16 + b, 'rimessa', '', 0x1a1d21); w.rotation.x = Math.PI / 2; }); });
  etichetta('Rimessa', 12, 10, 16, 'rimessa', 'at', {sotto:'T2 · revisione fra 3 giorni'});
  metti(capanna(7, 4, 2.5, 7), -24, 0, 18, 'ufficio'); etichetta('Ufficio', -24, 9, 18, 'ufficio', '', {sotto:'4 fatture'});
  bagliore(-24, 2.2, 21.6, 0xffd59a, 5, .7, true);
  // vacche nel recinto (si muovono piano); la 214 è quella da guardare
  const n = L ? 10 : 22, vac = [];
  for (let i = 0; i < n; i++){ const v = ombra(new THREE.Mesh(new THREE.BoxGeometry(1.4, .9, .7), argilla(i === 5 ? 0x6b5a22 : 0x3a4048)));
    v.userData.d = 'stalla'; v.userData.fuori = true; G.add(v); vac.push([v, Math.random() * 6.28, 4 + Math.random() * 7]); }
  const al214 = bagliore(0, 0, 0, WARN, 4, .6);
  k.anima(t => vac.forEach(([v, a, r], i) => { const b = a + t * .03 * (i % 2 ? 1 : -1);
    v.position.set(-28 + Math.cos(b) * r * .6, .45, -14 + Math.sin(b) * r); v.rotation.y = -b; if (i === 5) al214.position.set(v.position.x, 2, v.position.z); }));
}
async function caricaGLB(url, k){
  if (!THREE.GLTFLoader) await caricaScript('vendor/three/GLTFLoader.js');
  const gltf = await new Promise((ok, ko) => new THREE.GLTFLoader().load(url, ok, undefined, ko));
  const m = gltf.scene, box = new THREE.Box3().setFromObject(m), sz = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const s = 84 / Math.max(sz.x, sz.z, 1); m.scale.setScalar(s); m.position.set(-c.x * s, -box.min.y * s, -c.z * s);
  const nomiZone = {}; E.zone = {};
  m.traverse(o => { if (!o.isMesh) return; k.ombra(o);
    // la zona: il primo antenato con un nome che conosciamo (i pezzi senza nome prendono quello del loro gruppo)
    let z; for (let a = o; a && a !== m && !z; a = a.parent) if (a.name) z = ZONE_GLB.find(([re]) => re.test(a.name));
    if (z){ if (!z[1]) return; o.userData.d = z[1]; nomiZone[z[1]] = z;
      o.material = Array.isArray(o.material) ? o.material.map(x => x.clone()) : o.material.clone(); // per illuminare solo la zona scelta
      (E.zone[z[1]] = E.zone[z[1]] || []).push(o); return; }
    const nome = o.name + ' ' + (o.parent ? o.parent.name : ''); const hit = NOMI_GLB.find(([, re]) => re.test(nome)); if (hit) o.userData.d = hit[0]; });
  if (!Object.keys(E.zone).length) E.zone = null;
  k.G.add(m); m.updateMatrixWorld(true);
  const per = {}; m.traverse(o => { if (o.isMesh && o.userData.d) (per[o.userData.d] = per[o.userData.d] || new THREE.Box3()).union(new THREE.Box3().setFromObject(o)); });
  if (E.zone) zoneStalla(per, nomiZone);
  for (const d in per){ const cc = per[d].getCenter(new THREE.Vector3()); const lv = DA_GUARDARE.some(x => x[1] === d && x[5]) ? 'at' : '';
    k.etichetta(DETT[d] ? DETT[d][0] : d, cc.x, per[d].max.y + 2, cc.z, d, lv, {peso: d === 'stalla' ? 50 : d === 'tetto' ? -10 : 0});
    if (lv) k.faro(cc.x, 0, cc.z, lv); }
}
/** Stalla vera: per ogni zona del modello una scheda (cos'è, quanti pezzi) e i bottoni per passare alle altre.
 *  Niente misure: le zone hanno pezzi sparsi e la scala del modello non è certa, sarebbero numeri sbagliati. */
function zoneStalla(per, nomi){
  const ordine = Object.keys(per).filter(d => nomi[d]);
  ordine.sort((a, b) => (b === 'stalla') - (a === 'stalla') || nomi[a][2].localeCompare(nomi[b][2]));
  ordine.forEach(d => {
    if (d !== 'stalla' || !DETT.stalla) DETT[d] = [nomi[d][2], nomi[d][3], [['Pezzi nel modello', numIt(E.zone[d].length, 0)]],
      'Dal progetto 3D della stalla.' + (ZONE_DENTRO.has(d) ? ' Il tetto si toglie da solo per guardare dentro.' : '')];
    RAMI[d] = ordine.filter(x => x !== d).map(x => ['›', nomi[x][2], '', x]); });
}
/** Stalla vera: la zona scelta resta piena e illuminata, le altre diventano trasparenti; il tetto si toglie per guardare dentro. */
function aggiornaZone(){
  if (!E.zone) return; const acc = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--acc').trim() || '#cfd8e3');
  const scelta = E.sel && E.zone[E.sel];
  for (const d in E.zone){ const su = d === E.sel, ombra = scelta && !su;
    E.zone[d].forEach(o => [].concat(o.material).forEach(x => {
      if (x.userData.op === undefined) x.userData.op = [x.transparent, x.opacity, x.depthWrite];
      if (x.emissive) su ? x.emissive.copy(acc).multiplyScalar(.35) : x.emissive.setRGB(0, 0, 0);
      const [t, op, dw] = x.userData.op; x.transparent = ombra || t; x.opacity = ombra ? .18 : op; x.depthWrite = ombra ? false : dw; x.needsUpdate = true; })); }
  const via = tettoVia();
  (E.zone.tetto || []).forEach(o => { o.visible = !via || E.sel === 'tetto'; });
  const b = $('#tetto-btn'); if (b) b.textContent = via ? 'Rimetti il tetto' : 'Togli il tetto';
}
const tettoVia = () => E.tettoVia !== null && E.tettoVia !== undefined ? E.tettoVia : !!(E.sel && ZONE_DENTRO.has(E.sel));
/** Foto satellitare sotto i campi veri (solo se ci sono le tessere), con i nomi dei paesi sopra. */
function fotoSatellitare(k, campi){
  const z = MAPPA.z, carica = new THREE.TextureLoader(), aniso = Math.min(8, E.R.capabilities.getMaxAnisotropy());
  MAPPA.tessere.forEach(t => {
    const [x0, z0] = campi.aScena(tessLon(t.x, z), tessLat(t.y, z)), [x1, z1] = campi.aScena(tessLon(t.x + 1, z), tessLat(t.y + 1, z));
    const w = x1 - x0, h = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    [[t.foto, -.95, false], [t.nomi, -.9, true]].forEach(([src, y, sopra]) => { if (!src) return;
      const tex = carica.load(src); tex.anisotropy = aniso;
      const g = new THREE.PlaneGeometry(w * 1.002, h * 1.002); g.rotateX(-Math.PI / 2);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({map:tex, transparent:sopra, depthWrite:!sopra}));
      m.position.set(cx, y, cz); m.renderOrder = sopra ? 1 : 0; k.G.add(m); });
  });
  $('#fonte-mappa').textContent = MAPPA.fonte || '';
}
const MODELLI = {
  costrutto(k){ grafo3D(k, GRAFO_VITA); },
  scuola(k){ grafo3D(k, GRAFO_SCUOLA); },
  async azienda(k){
    if (FONTI.modelloAzienda){ try { await caricaGLB(await FONTI.modelloAzienda, k);
        NOTA_MONDO.azienda = 'progetto 3D vero della stalla · ' + (window.STALLA_VERA ? 'stalla e latte veri, il resto finto' : 'numeri ancora finti'); try { striscia(); } catch (_) {} return; }
      catch (err) { console.warn('Modello GLB non caricato, uso quello disegnato:', err.message || err); } }
    aziendaDisegnata(k);
  },
  campi(k){
    const {metti, etichetta, faro, G, ACC, L} = k;
    const campi = GEO_CAMPI, veri = !!FONTI.campi;
    E.metriPerUnita = campi.metriPerUnita;
    if (MAPPA) fotoSatellitare(k, campi);
    campi.forEach(c => { const fam = chiaveColtura(c.coltura), cc = COLTURE[fam], lv = c.stato, alto = MAPPA ? cc.alto * .6 + .3 : cc.alto;
      if (!DETT[c.id]) DETT[c.id] = [c.nome, c.coltura || 'campo', [['Coltura', c.coltura || 'non indicata'], ['Superficie', c.ettari ? numIt(c.ettari, 2) + ' ha' : '—']]];
      const s = new THREE.Shape(c.punti.map(([x, z]) => new THREE.Vector2(x, -z)));
      const g = new THREE.ExtrudeGeometry(s, {depth:alto, bevelEnabled:false}); g.rotateX(-Math.PI / 2);
      const m = metti(g, 0, 0, 0, c.id, lv, MAPPA ? new THREE.Color(COLORI_MAPPA[fam]) : cc.col);
      if (MAPPA){ m.material.transparent = true; m.material.opacity = .62; const b = E.bordi[E.bordi.length - 1]; b.base = .85;
        b.m.color.set(COLORI_MAPPA[fam]).lerp(new THREE.Color(0xffffff), .45); }
      if (c.parte) return;  // etichetta solo sul primo pezzo di un campo fatto di più particelle
      const cx = c.punti.reduce((a, q) => a + q[0], 0) / c.punti.length, cz = c.punti.reduce((a, q) => a + q[1], 0) / c.punti.length;
      etichetta(c.nome, cx, alto + 2.2, cz, c.id, lv, {sotto:[c.ettari ? numIt(c.ettari) + ' ha' : '', c.coltura].filter(Boolean).join(' · '), peso:c.ettari || 0});
      if (lv) faro(cx, alto, cz, lv);
      // file della coltura (solo campi a quattro lati, solo su PC, solo se sono pochi)
      if (!L && c.punti.length === 4 && campi.length < 30){ const [a, c2, e, b] = c.punti;
        for (let i = 1; i < 6; i++){ const f = i / 6;
          const p1 = new THREE.Vector3(a[0] + (b[0] - a[0]) * f, alto + .05, a[1] + (b[1] - a[1]) * f), p2 = new THREE.Vector3(c2[0] + (e[0] - c2[0]) * f, alto + .05, c2[1] + (e[1] - c2[1]) * f);
          G.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1, p2]), new THREE.LineBasicMaterial({color:ACC, transparent:true, opacity:.22}))); } }
    });
    if (!veri){ metti(new THREE.BoxGeometry(12, 4, 6), -4, 2, 26, 'stalla'); etichetta('Stalla', -4, 7, 26, 'stalla');
      // nuvola della pioggia prevista che passa (meteo finto)
      const nube = new THREE.Mesh(new THREE.SphereGeometry(6, 14, 10), new THREE.MeshBasicMaterial({color:0x9fb6d8, transparent:true, opacity:.1, depthWrite:false}));
      nube.scale.set(1.6, .5, 1); G.add(nube); k.anima(t => nube.position.set(Math.sin(t * .15) * 40, 22, Math.cos(t * .15) * 12));
      etichetta('Pioggia prevista', 0, 0, 0, null, '', {sotto:'12 mm in 7 giorni', segui:nube, su:4}); }
  },
  trading(k){
    const {metti, etichetta, bagliore, G, ACC, L} = k;
    // il bot: un'antenna al centro che riceve dal canale e scrive nel diario
    metti(new THREE.CylinderGeometry(3, 4, 2, 6), 0, 1, 0, 'bot'); metti(new THREE.CylinderGeometry(.5, .9, 22, 8), 0, 12, 0, 'bot');
    [8, 14, 20].forEach((y, i) => { const a = metti(new THREE.TorusGeometry(2.6 - i * .6, .15, 6, 32), 0, y, 0, 'bot'); a.rotation.x = Math.PI / 2; k.anima(t => a.rotation.z = t * (i % 2 ? -.8 : .8)); });
    const testa = metti(new THREE.SphereGeometry(1.2, 18, 14), 0, 23.5, 0, 'bot', '', ACC.clone().multiplyScalar(.6));
    const al = bagliore(0, 23.5, 0, ACC, 9, .6);
    k.anima(t => { const f = 1 + .15 * Math.sin(t * 5); testa.scale.setScalar(f); al.material.opacity = .4 + .25 * (1 + Math.sin(t * 5)) / 2; });
    etichetta('Bot segnali', 0, 27, 0, 'bot', '', {sotto:'acceso · 2 segnali'});
    // candele intorno (prezzi finti): colore del mondo se sale, grigio se scende. Niente rosso: non è un allarme.
    let p = 20; const N = L ? 28 : 48, su = new THREE.MeshLambertMaterial({color:ACC.clone().multiplyScalar(.75)}), giu = new THREE.MeshLambertMaterial({color:0x4a515a});
    for (let i = 0; i < N; i++){ const a = i / N * Math.PI * 2, r = 36, o = p; p = Math.max(8, p + Math.sin(i * 1.3) * 2.2 + Math.cos(i * .4) * 1.4); const sale = p >= o;
      const h = Math.max(.6, Math.abs(p - o)), c = k.ombra(new THREE.Mesh(new THREE.BoxGeometry(1.4, h, 1.4), sale ? su : giu));
      c.position.set(Math.cos(a) * r, Math.min(p, o) + h / 2 - 6, Math.sin(a) * r); c.userData.d = 'borsa'; G.add(c);
      const st = new THREE.Mesh(new THREE.BoxGeometry(.16, h + 2, .16), sale ? su : giu); st.position.copy(c.position); G.add(st); }
    etichetta('Mercato', 0, 27, -38, 'borsa', '', {sotto:'solo da guardare'});
    metti(new THREE.BoxGeometry(7, 7, 7), -24, 3.5, 10, 'canale'); etichetta('Canale Telegram', -24, 10, 10, 'canale', '', {sotto:'14 messaggi oggi'});
    metti(new THREE.BoxGeometry(8, 2.5, 6), 22, 1.25, 12, 'diario', 'no'); metti(new THREE.BoxGeometry(7.4, .6, 5.4), 22, 2.8, 12, 'diario');
    etichetta('Diario', 22, 7, 12, 'diario', 'no', {sotto:'3 senza nota di uscita'});
    // impulsi: segnale dal canale al bot, poi dal bot al diario
    const curva = (a, b, h) => new THREE.QuadraticBezierCurve3(a, new THREE.Vector3((a.x + b.x) / 2, h, (a.z + b.z) / 2), b);
    [curva(new THREE.Vector3(-24, 7, 10), new THREE.Vector3(0, 22, 0), 26), curva(new THREE.Vector3(0, 22, 0), new THREE.Vector3(22, 3, 12), 24)].forEach((c, i) => {
      G.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(40)), new THREE.LineBasicMaterial({color:ACC, transparent:true, opacity:.45})));
      const imp = bagliore(0, 0, 0, ACC, 2.6, .95); k.anima(t => imp.position.copy(c.getPoint(((t * .35) + i * .5) % 1))); });
    // ventaglio tenue verso il mercato: il bot GUARDA, non tocca
    const fan = new THREE.Mesh(new THREE.ConeGeometry(14, 30, 32, 1, true, 0, Math.PI / 3), new THREE.MeshBasicMaterial({color:0xdfe6ee, transparent:true, opacity:.05, side:THREE.DoubleSide, depthWrite:false}));
    fan.rotation.z = Math.PI / 2; fan.position.set(0, 20, -15); G.add(fan); k.anima(t => fan.material.opacity = .03 + .03 * (1 + Math.sin(t * 2)));
  },
  vita(k){
    const {metti, etichetta, faro, capanna, bagliore, G} = k;
    metti(capanna(14, 7, 5, 12), -6, 0, -2, 'casa'); etichetta('Casa', -6, 15, -2, 'casa', '', {sotto:'nessuna bolletta in scadenza'});
    metti(new THREE.BoxGeometry(2, 2, 2), -2, 13, -4, 'casa');
    [[-9, 3.2, 4.05], [-3, 3.2, 4.05], [-6, 8.5, 4.05]].forEach(([x, y, z]) => bagliore(x, y, z, 0xffd08a, 4.5, .85, true));
    // la macchina con il bollo in scadenza
    metti(new THREE.BoxGeometry(7, 1.8, 3.4), 14, 1.3, 8, 'auto', 'at', 0x353b43); metti(new THREE.BoxGeometry(4, 1.4, 3.2), 13.5, 2.9, 8, 'auto', 'at', 0x353b43);
    [[-2.4, 1.7], [2.4, 1.7], [-2.4, -1.7], [2.4, -1.7]].forEach(([a, b]) => { const w = metti(new THREE.CylinderGeometry(.8, .8, .5, 16), 14 + a, .8, 8 + b, 'auto', '', 0x1a1d21); w.rotation.x = Math.PI / 2; });
    etichetta('Macchina', 14, 7, 8, 'auto', 'at', {sotto:'bollo entro il 15'}); faro(14, 0, 8, 'at');
    [[-24, 14], [-20, 20], [24, -16], [-28, -14], [30, 18]].forEach(([x, z]) => { metti(new THREE.CylinderGeometry(.4, .5, 3, 6), x, 1.5, z, null, '', 0x3a3026); metti(new THREE.ConeGeometry(2.4, 6, 8), x, 6, z, null, '', 0x26382d); });
    // l'aereo del weekend di fine mese
    const aereo = metti(new THREE.ConeGeometry(.9, 5, 10), 0, 26, 0, 'viaggio'); aereo.rotation.z = -Math.PI / 2; aereo.userData.fuori = true;
    etichetta('Weekend', 0, 0, 0, 'viaggio', '', {sotto:'fine mese', segui:aereo, su:3});
    k.anima(t => { const a = t * .25; aereo.position.set(Math.cos(a) * 30, 24, Math.sin(a) * 30); aereo.rotation.y = -a; });
    // la visita medica come un segnaposto vicino a casa
    metti(new THREE.CylinderGeometry(1.2, 1.2, .6, 24), -22, .3, -4, 'visita'); etichetta('Visita medica', -22, 3, -4, 'visita', '', {sotto:'da prenotare'});
  },
  lab(k){
    const {metti, etichetta, bagliore, ombra, argilla, bordi, G, ACC} = k;
    [['prova6', 'Costrutto v6', -9, 72, 'bozza da guardare'], ['trascr', 'Trascrizione video', 9, 30, 'in pausa']].forEach(([d, n, x, liv, sotto]) => {
      metti(new THREE.CylinderGeometry(4.6, 5, 1.6, 32), x, .8, 0, d);
      const h = 15, gus = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, h, 32, 1, true), new THREE.MeshBasicMaterial({color:ACC, transparent:true, opacity:.08, side:THREE.DoubleSide, depthWrite:false}));
      gus.position.set(x, 1.6 + h / 2, 0); gus.userData.d = d; bordi(gus); G.add(gus);
      const liq = ombra(new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.7, h * liv / 100, 32), argilla(ACC.clone().multiplyScalar(.45))));
      liq.position.set(x, 1.6 + h * liv / 200, 0); liq.userData.d = d; G.add(liq);
      const al = bagliore(x, 1.6 + h * liv / 100, 0, ACC, 8, .45); k.anima(t => al.material.opacity = .3 + .2 * Math.sin(t * 2 + x));
      etichetta(n, x, h + 5, 0, d, '', {sotto});
    });
    const vuoto = new THREE.Mesh(new THREE.RingGeometry(4.2, 4.5, 48), new THREE.MeshBasicMaterial({color:ACC, transparent:true, opacity:.35, side:THREE.DoubleSide}));
    vuoto.rotation.x = -Math.PI / 2; vuoto.position.set(0, .05, -16); G.add(vuoto); etichetta('+ nuova prova', 0, 2, -16, null);
  },
};

// =====================================================================
// PIOGGIA DI CODICE (solo durante il passaggio tra mondi)
// =====================================================================
const PG = {cv:$('#pioggia'), on:false, raf:0, gocce:[], ult:0, ctx:null};
const CAR = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789MATRIX';
function pioggia(on){
  if (riduci) return; const cv = PG.cv;
  if (on){ if (!PG.on){ cv.width = innerWidth; cv.height = innerHeight; PG.ctx = cv.getContext('2d');
      PG.gocce = Array(Math.ceil(cv.width / 18)).fill(0).map(() => Math.random() * cv.height / 18); PG.on = true; PG.raf = requestAnimationFrame(cade); }
    cv.classList.add('on'); }
  else { cv.classList.remove('on');
    setTimeout(() => { if (!cv.classList.contains('on')){ PG.on = false; cancelAnimationFrame(PG.raf); if (PG.ctx) PG.ctx.clearRect(0, 0, cv.width, cv.height); } }, 650); }
}
// pioggia di sfondo (se scelta): lenta e tenue, dietro la scena
const PF = {cv:$('#fondo-pioggia'), on:false, raf:0, gocce:[], ult:0, ctx:null};
function pioggiaFondo(on){
  const cv = PF.cv; if (riduci) on = false;
  if (on && !PF.on){ cv.width = innerWidth; cv.height = innerHeight; PF.ctx = cv.getContext('2d');
    PF.gocce = Array(Math.ceil(cv.width / 20)).fill(0).map(() => Math.random() * cv.height / 20); PF.on = true; PF.raf = requestAnimationFrame(cadeFondo); }
  if (!on && PF.on){ PF.on = false; cancelAnimationFrame(PF.raf); if (PF.ctx) PF.ctx.clearRect(0, 0, cv.width, cv.height); }
  cv.classList.toggle('on', on);
}
function cadeFondo(now){
  if (!PF.on) return; PF.raf = requestAnimationFrame(cadeFondo); if (window.MATRIX_PAUSA || now - PF.ult < 80) return; PF.ult = now;
  const c = PF.ctx, cv = PF.cv;
  if (cv.width !== innerWidth || cv.height !== innerHeight){ cv.width = innerWidth; cv.height = innerHeight; }
  c.globalCompositeOperation = 'destination-out'; c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, 0, cv.width, cv.height);
  c.globalCompositeOperation = 'source-over';
  c.fillStyle = getComputedStyle(document.body).getPropertyValue('--acc').trim() || '#cfd8e3'; c.font = '16px ui-monospace,Consolas,monospace';
  PF.gocce.forEach((y, i) => { c.fillText(CAR[Math.random() * CAR.length | 0], i * 20, y * 20); PF.gocce[i] = (y * 20 > cv.height && Math.random() > .95) ? 0 : y + 1; });
}
function cade(now){
  if (!PG.on) return; PG.raf = requestAnimationFrame(cade); if (window.MATRIX_PAUSA || now - PG.ult < 40) return; PG.ult = now;
  const c = PG.ctx, cv = PG.cv;
  c.globalCompositeOperation = 'destination-out'; c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(0, 0, cv.width, cv.height);
  c.globalCompositeOperation = 'source-over';
  c.fillStyle = getComputedStyle(document.body).getPropertyValue('--acc').trim() || '#cfd8e3'; c.font = '15px ui-monospace,Consolas,monospace';
  PG.gocce.forEach((y, i) => { c.fillText(CAR[Math.random() * CAR.length | 0], i * 18, y * 18); PG.gocce[i] = (y * 18 > cv.height && Math.random() > .9) ? 0 : y + 1; });
}

// =====================================================================
// TASTI E TOCCHI
// =====================================================================
function nascondiGuida(){ $('#guida').classList.add('via'); }
if (matchMedia('(pointer:coarse)').matches) $('#guida').textContent = 'Un dito gira · due dita ingrandiscono e spostano · doppio tocco avvicina · tocca un oggetto';
else $('#guida').textContent += ' · doppio clic per avvicinarti';
// la striscia in basso si chiude e si riapre toccando il titolo (resta come l'hai lasciata)
try { if (localStorage.getItem('matrix-striscia') === 'chiusa'){ $('#striscia').classList.add('chiusa'); document.body.classList.add('striscia-chiusa'); } } catch (_) {}
$('#striscia').addEventListener('click', e => { if (!e.target.closest('.stit') || e.target.closest('button')) return;
  const c = $('#striscia').classList.toggle('chiusa'); document.body.classList.toggle('striscia-chiusa', c); try { localStorage.setItem('matrix-striscia', c ? 'chiusa' : 'aperta'); } catch (_) {} });
setTimeout(nascondiGuida, 9000);
document.addEventListener('click', e => {
  const t = e.target;
  if (t === $('#oracolo')) return chiudiOracolo();
  const s = t.closest('.sugg button'); if (s) return chiedi(s.textContent);
  const v = t.closest('[data-vai]'); if (v){ const [m, d] = v.dataset.vai.split('|'); return vai(m, d); }
  const p = t.closest('.pill');
  if (p){ const box = p.closest('.appr'), ok = p.dataset.ok === '1';
    box.querySelector('.pillole').outerHTML = `<div class="esito" style="color:${ok ? 'var(--red)' : 'var(--blu)'}">${ok ? 'Pillola rossa: fatto (finto).' : 'Pillola blu: lasciato com\'è.'}</div>`;
    setTimeout(() => { APPR = APPR.filter(a => a.id != box.dataset.id); disegnaCassetto(); disegnaSotto(); if (mondo === 'costrutto' && !E.sel) striscia(null); }, 1200); return; }
  const a = t.closest('[data-azione]');
  if (a){ const az = a.dataset.azione;
    if (az === 'oracolo') return $('#oracolo').hidden ? apriOracolo() : chiudiOracolo();
    if (az === 'cassetto'){ const c = $('#cassetto'); c.hidden = !c.hidden; if (!c.hidden) disegnaCassetto(); return; }
    if (az === 'indietro') return indietro();
    if (az === 'tetto'){ E.tettoVia = !tettoVia(); return aggiornaZone(); }
    if (az === 'sfondo'){ const k = Object.keys(NOMI_SFONDO); return scegliSfondo(k[(k.indexOf(SFONDO) + 1) % k.length]); } }
  const sf = t.closest('[data-sfondo]'); if (sf) return scegliSfondo(sf.dataset.sfondo);
  const m = t.closest('[data-m]'); if (m) return vaiMondo(m.dataset.m);
  const d = t.closest('[data-d]'); if (d) return seleziona(d.dataset.d);
  // un tocco fuori dal cassetto lo chiude
  if (!$('#cassetto').hidden && !t.closest('#cassetto')) $('#cassetto').hidden = true;
});
addEventListener('keydown', e => {
  const tasto = e['key'];
  const scrive = /^(INPUT|TEXTAREA)$/.test(document.activeElement && document.activeElement.tagName);
  if ((tasto === 'k' || tasto === 'K') && (e.ctrlKey || e.metaKey)){ e.preventDefault(); return $('#oracolo').hidden ? apriOracolo() : chiudiOracolo(); }
  if (tasto === '/' && !scrive){ e.preventDefault(); return apriOracolo(); }
  if (tasto === 'Escape'){
    if (!$('#oracolo').hidden) return chiudiOracolo();
    if (!$('#cassetto').hidden) return void ($('#cassetto').hidden = true);
    if (E.sel) return indietro(); }
});
setInterval(scriviTempo, 30000);

// =====================================================================
// AVVIO
// =====================================================================
document.body.style.setProperty('--acc', ACCENTI[mondo]);
disegnaSchede(); disegnaSotto(); disegnaCassetto(); striscia(null);
if (init3D()) costruisci(mondo); else applicaSfondo();
