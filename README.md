# Design-Prototyp

Statische Umsetzung der Design-Spezifikation: **alle Screens, Felder und Texte**.

> **Keine Server-Anbindung, keine Logik, keine Validierung.**
> Buttons sind klickbar und navigieren zwischen Seiten, führen aber keine Aktionen aus.
> Aktionen zeigen höchstens einen Toast (z. B. „Gespeichert“).

## Starten

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # statischer Export nach dist/
npm run preview  # dist/ lokal ansehen
```

## Design-Panel

Unten rechts (auf Mobil unten links) sitzt ein kleines Werkzeug — **kein Bestandteil
des Produkts**. Damit lässt sich jeder Screen umschalten:

| Schalter | Wirkung |
|---|---|
| **Zustand** | `Gefüllt` · `Leer` · `Ladend` — die drei Varianten aus TEIL K.4 |
| **Sitzung** | `Gast` · `Angemeldet` — Kopfleiste B.1 bzw. B.2 |
| **Aufbau-Banner** | Band aus B.5 ein-/ausblenden |
| **Cookie-Banner** | Banner aus TEIL H ein-/ausblenden |
| **Alle Screens** | Übersicht aller Routen unter `/uebersicht` |

Die Registrierung (`/registrieren`) hat zusätzlich einen Schalter, der alle
Fehlertexte der Felder gleichzeitig sichtbar macht — gebaut als Variante,
nicht als Validierung.

## Aufbau

```
src/
  config.js              APP_NAME, MVP-Stufe, Umkreis- und Preisstufen
  i18n/
    de.json              ALLE Texte — nichts steht fest in den Komponenten
    index.jsx            t(), tNodes(), groupSizeLabel()
  mock/
    places.js            Betriebe, Öffnungszeiten, Marker
    content.js           Videos, Bewertungen, Gerichte, Nutzer, Admin-Daten
  styles/
    tokens.css           TEIL A.1/A.3 — Farben, Abstände, Radien
    base.css             TEIL A.2 — Typografie, Layout-Grundlagen
    components.css       TEIL A.4–A.6, B.6–B.9 — Bausteine
    layout.css           TEIL B, C.2, C.6 — Kopf-/Fußleiste, Karte, Feed, Konsolen
  components/
    ui/                  die elf Bausteine aus TEIL K.7
    layout/              Kopfleiste, Fußzeile, untere Navigation, Banner, Seitenrahmen
  lib/design-state.jsx   Umschalter für die drei Screen-Varianten
  routes/
    index.js             TEIL J — Routentabelle (auch Grundlage für /uebersicht)
    public/ konto/ nutzer/ gastro/ admin/ recht/ fehler/ dialogs/
```

### Produktname

`APP_NAME` steht ausschließlich in `src/config.js`. In Texten wird er über den
Platzhalter `{{app}}` eingesetzt. Zum Umbenennen genügt eine Änderung an dieser
einen Stelle. Aktuell steht dort der Arbeitstitel **Tellerrand**.

### Texte ändern

Alle sichtbaren Texte stehen in `src/i18n/de.json`. Für eine englische Fassung
später genügt eine zweite Datei `en.json` mit derselben Struktur. Fehlt ein
Schlüssel, zeigt die Oberfläche den Schlüsselnamen an und meldet ihn in der
Konsole — Lücken fallen so sofort auf.

### Platzhalterdaten ersetzen

`src/mock/` enthält die einzigen Daten. Die Komponenten lesen ausschließlich von
dort, damit später nur diese Dateien gegen echte Abfragen getauscht werden müssen.

## Die elf Bausteine (TEIL K.7)

`Button` · `Field`/`Input` · `Card` · `ReviewCard` · `Stars`/`RatingCompact`/`RatingFull` ·
`VideoTile` · `PlaceRow` · `EmptyState` · `Modal` · `Toast` · `Chip` · `Badge`

Dazu kommen `Menu`, `Tabs`, `Accordion`, `Switch`, `Stepper`, `Dropzone`,
`StarInput` und `Skeleton`.

## Was noch fehlt

- Echte Bilder und Videos — überall stehen Platzhalterflächen mit Symbol.
- Die Karte ist ein gezeichnetes Raster, keine echte Kartenbibliothek.
- Rechtstexte (`/impressum`, `/datenschutz`, `/agb`, …) sind Blindtext und
  müssen vor dem Start juristisch geprüft und ersetzt werden.
- Ziehen und Sortieren (Speisekarte) ist visuell angelegt, aber nicht bedienbar.
