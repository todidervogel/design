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

**Auf dem Handy ansehen oder als APK bauen:** siehe [docs/HANDY.md](docs/HANDY.md).

## Design-Panel

Unten rechts (auf Mobil unten links) sitzt ein kleines Werkzeug — **kein Bestandteil
des Produkts**. Damit lässt sich jeder Screen umschalten:

| Schalter | Wirkung |
|---|---|
| **Ziel** | `Website` · `App` — siehe Unterschiede unten |
| **Sitzung** | `Gast` · `Angemeldet` — Kopfleiste B.1 bzw. B.2 |
| **Darstellung** | `Hell` · `Dunkel` — der Dunkelmodus gilt nur für die App |
| **Zustand** | `Gefüllt` · `Leer` · `Ladend` — die drei Varianten aus TEIL K.4 |
| **Aufbau-Banner** | Band aus B.5 ein-/ausblenden |
| **Cookie-Banner** | Banner aus TEIL H ein-/ausblenden |
| **Alle Screens** | Übersicht aller Routen unter `/uebersicht` |

Die Auswahl bleibt über ein Neuladen hinweg erhalten, damit auch direkt
geöffnete Links im gewählten Zustand erscheinen.

Das **Gerät** (Handy oder Rechner) steht nicht zur Auswahl, sondern folgt der
Fensterbreite — zum Prüfen einfach das Fenster schmaler ziehen oder die Seite
auf dem Handy öffnen.

## Website und App

Derselbe Code, zwei Ziele. Was sich unterscheidet:

| | Website | App |
|---|---|---|
| Untere Leiste (mobil) | Feed · Karte · Suche · Profil | zusätzlich **Aufnehmen** mittig |
| Untere Leiste (Rechner) | keine, die Kopfleiste führt | — |
| Gastmodus | ja, zum Umsehen | **nein** — ohne Anmeldung erscheint die Anmeldeseite |
| Fußzeile (B.4) | ja | nein, Rechtstexte stehen in den Einstellungen |
| Dunkelmodus | nein | ja, `Automatisch / Hell / Dunkel` in den Einstellungen |

Videos aufnehmen gehört zur App, deshalb fehlt das **+** in der Leiste der
Website.

### Was der Gastmodus darf

Als Gast auf der Website kann man sich alles ansehen, aber nichts beitragen.
Liken, Folgen, Speichern und Blockieren öffnen den Hinweis „Dafür brauchst du
ein Konto"; `/upload` und `/profil` führen zur Anmeldung beziehungsweise zeigen
„Noch nicht angemeldet".

Die Regeln stehen an einer Stelle: [`src/lib/auth.jsx`](src/lib/auth.jsx).

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
    tokens.css           TEIL A.1/A.3 — Farben, Abstände, Radien + Dunkelmodus
    base.css             TEIL A.2 — Typografie, Layout-Grundlagen
    components.css       TEIL A.4–A.6, B.6–B.9 — Bausteine
    layout.css           TEIL B, C.2, C.6 — Kopf-/Fußleiste, Karte, Feed, Konsolen
  components/
    ui/                  die elf Bausteine aus TEIL K.7
    layout/              Kopfleiste, Fußzeile, untere Navigation, Banner, Seitenrahmen
  lib/
    design-state.jsx     Ziel, Gerät, Sitzung, Darstellung, Screen-Variante
    auth.jsx             Anmelde-Schranke: App ohne Gastmodus, Gast ohne Beiträge
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
