"""Agente Smith prima di ogni commit: ferma il commit se un file contiene qualcosa che sembra una chiave.
Controlla solo i file che stanno per entrare nel commit. Non stampa mai il valore trovato."""
import re
import subprocess
import sys

SOSPETTI = {
    "token di un bot Telegram": re.compile(r"\b\d{8,10}:[A-Za-z0-9_-]{35}\b"),
    "chiave Supabase o JWT": re.compile(r"\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,}"),
    "chiave segreta Supabase (formato nuovo)": re.compile(r"sb_secret_[A-Za-z0-9_-]{10,}"),
    "chiave privata": re.compile(r"-----BEGIN [A-Z ]*PRIVATE"),
    "chiave OpenAI o Groq": re.compile(r"\b(sk|gsk)_?-?[A-Za-z0-9]{24,}\b"),
    "password scritta": re.compile(r"(?i)\b(password|passwd|pwd)\s*[=:]\s*['\"]?[^\s'\"]{6,}"),
}

file_in_commit = subprocess.run(
    ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"],
    capture_output=True, text=True, check=True).stdout.split()

problemi = []
for nome in file_in_commit:
    contenuto = subprocess.run(["git", "show", f":{nome}"], capture_output=True).stdout
    testo = contenuto.decode("utf-8", errors="ignore")
    for cosa, regola in SOSPETTI.items():
        if regola.search(testo):
            problemi.append(f"  {nome}: sembra contenere un {cosa}")

if problemi:
    print("COMMIT FERMATO dall'Agente Smith:")
    print("\n".join(problemi))
    print("Togli il segreto dal file (va nel file dei segreti fuori dal progetto) e riprova.")
    sys.exit(1)
