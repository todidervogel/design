# Prüfskripte

Kein Testframework — drei kleine Node-Skripte, die genau das prüfen, was bei
diesem Prototyp schiefgehen kann.

## Voraussetzung

```bash
npm install                 # einmalig, playwright ist als devDependency dabei
npx vite build
npx vite preview --port 4173 --strictPort
```

Der Browser wird über `PW_CHROME` gefunden; in dieser Umgebung liegt er unter
`/opt/pw-browsers/chromium`.

## Die Skripte

### `i18n-check.mjs` — Übersetzungslücken

```bash
node tools/pruefung/i18n-check.mjs
```

Liest jeden `t('…')`-Aufruf im Quelltext und prüft, ob es den Text in
`src/i18n/de.json` gibt. Braucht keinen Browser und läuft in einer Sekunde.
Findet dieselben Lücken wie ein Durchlauf durch alle Seiten, nur schneller.

### `routen-sweep.mjs` — jede Route in jeder Rolle

```bash
node tools/pruefung/routen-sweep.mjs
```

Ruft alle Routen aus `src/routes/index.js` in fünf Kombinationen auf
(Website·Gast·hell, Website·Nutzer·dunkel, App·Nutzer·dunkel,
App·Gastro·hell, Website·Admin·hell) und meldet JavaScript-Fehler,
Konsolenfehler, sichtbare `{{platzhalter}}` und leere Seiten.

### `verhalten.mjs` — die Abläufe

```bash
node tools/pruefung/verhalten.mjs
```

27 gezielte Tests: Anmeldung und Rollen, Registrierung mit Altersgrenze,
Dunkelmodus auf beiden Zielen, reine Kartenansicht, Angebotsfilter,
Speisekarte, Feed, Upload bis in die Freigabewarteschlange, Admin-Freigabe,
Meldungen, Profil.

**Tipp:** Die Ladezustände sind nur zu sehen, wenn die Fassade auch wartet.
Für diesen Durchlauf lohnt ein Build mit spürbarer Verzögerung:

```bash
VITE_LATENCY=400 npx vite build
```

Mit `PW_TIMEOUT` lässt sich die Wartezeit je Schritt anheben, falls der
Rechner ausgelastet ist.
