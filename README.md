# Website und App

Eine Codebasis, zwei Ziele: die Website im Browser und dieselbe Anwendung als
Android-App (Capacitor). Seit dem MVP-Ausbau ist das kein statischer Entwurf
mehr — es gibt eine Datenhaltung, echte Anmeldung, Formularprüfung,
Ladezustände und Rechte.

> **Noch ohne Server.** Die Daten liegen im Browser, hinter einer Fassade, die
> sich wie ein Server verhält. Sie ist der Austauschpunkt für Supabase.
> Videos, Kartenkacheln, GPS, E-Mail und SMS fehlen weiterhin.

## Starten

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # statischer Export nach dist/
npm run preview  # dist/ lokal ansehen
```

**Auf dem Handy ansehen oder als APK bauen:** siehe [docs/HANDY.md](docs/HANDY.md).

## Anmelden

| Rolle | E-Mail | Passwort |
|---|---|---|
| Nutzer | `max@beispiel.de` | `Passwort123` |
| Gastro | `chef@trattoria-bella.de` | `Gastro123` |
| Gastro (erstes Login) | `hallo@morgenrot-cafe.de` | `Start1234` |
| Admin | `ana@intern` | `Admin1234` |

Alles erfunden, alles nur im Browser. Bestätigungscode bei der Registrierung:
`123456`. Schneller geht es über das Design-Panel — dort steht eine Zeile
**Rolle** zum direkten Umschalten.

## Design-Panel

Unten rechts sitzt ein kleines Werkzeug — **kein Bestandteil des Produkts**,
es fällt in Schritt 2 weg.

| Schalter | Wirkung |
|---|---|
| **Ziel** | `Website` · `App` |
| **Rolle** | `Gast` · `Nutzer` · `Gastro` · `Admin` |
| **Darstellung** | `Auto` · `Hell` · `Dunkel` |
| **Zustand** | `Gefüllt` · `Leer` · `Ladend` — die drei Varianten aus TEIL K.4 |
| **Nur Karte** | Vollbildkarte ohne Leisten |
| **Banner** | Aufbau- und Cookie-Banner |
| **Daten zurücksetzen** | alles auf den Auslieferungsstand |

Das **Gerät** folgt der Fensterbreite — zum Prüfen das Fenster schmaler ziehen.

## Website und App

| | Website | App |
|---|---|---|
| Untere Leiste (mobil) | Feed · Karte · Suche · Profil | zusätzlich **Aufnehmen** mittig |
| Untere Leiste (Rechner) | keine, die Kopfleiste führt | — |
| Gastmodus | ja, zum Umsehen | **nein** — ohne Anmeldung erscheint die Anmeldeseite |
| Fußzeile (B.4) | ja | nein, Rechtstexte stehen in den Einstellungen |
| Dunkelmodus | ja | ja |
| Nur-Karte-Ansicht | ja (mobil) | ja (mobil) |

Der Dunkelmodus steht auf **Automatisch** und folgt dem Gerät. Der Umschalter
sitzt in der Kopfleiste — auch auf der Anmeldeseite, sonst käme man in der App
gar nicht an ihn heran.

### Was der Gastmodus darf

Ansehen: alles. Beitragen: nichts. Liken, Folgen, Speichern, Melden und
Hochladen öffnen den Hinweis „Dafür brauchst du ein Konto". Die Regeln stehen
an einer Stelle: [`src/lib/auth.jsx`](src/lib/auth.jsx).

## Aufbau

```
src/
  config.js              APP_NAME, MVP-Stufe, Umkreis- und Preisstufen
  data/seed.js           Ausgangsdaten — Betriebe, Karten, Videos, Konten
  i18n/
    de.json              ALLE Texte — nichts steht fest in den Komponenten
    index.jsx            t(), tNodes(), groupSizeLabel()
  lib/
    store/
      api.js             ► die Fassade. Hier wird später Supabase eingesetzt.
      db.js              Datenhaltung im localStorage, versioniert
      geo.js             Entfernung, Kartenprojektion
      hours.js           Öffnungszeiten, „jetzt geöffnet"
      index.jsx          useQuery, useMutation
    session.jsx          Anmeldung, Rollen, Registrierung
    form.js              useForm mit Regelwerk und deutschen Fehlermeldungen
    upload.jsx           der Upload-Entwurf über fünf Schritte
    auth.jsx             Routenwächter und Anmelde-Schranke
    design-state.jsx     Ziel, Gerät, Darstellung, Umkreis, Position
  styles/                Tokens, Grundlagen, Bausteine, Layout (mit Dunkelmodus)
  components/
    ui/                  die Bausteine aus TEIL K.7 + Serving, Spinner
    layout/              Kopfleiste, Fußzeile, untere Navigation, Konsolenrahmen
  routes/
    index.js             TEIL J — Routentabelle (auch Grundlage für /uebersicht)
    public/ konto/ nutzer/ gastro/ admin/ recht/ fehler/ dialogs/

tools/pruefung/          Prüfskripte, siehe tools/pruefung/README.md
```

### Die Fassade

Kein Screen greift direkt auf Daten zu. Alles läuft über
[`src/lib/store/api.js`](src/lib/store/api.js):

```js
const { data, loading } = useQuery(
  () => api.places.list({ radiusKm, serving }),
  [radiusKm, serving],
  { initial: [] },
)
```

Die Fassade antwortet mit einer kleinen Verzögerung (`VITE_LATENCY`, Standard
220 ms) — sonst gäbe es keine Ladezustände zu sehen.

### Produktname

`APP_NAME` steht ausschließlich in `src/config.js`. In Texten wird er über
`{{app}}` eingesetzt. Aktuell der Arbeitstitel **Tellerrand**.

### Texte ändern

Alle sichtbaren Texte stehen in `src/i18n/de.json`. Für eine englische Fassung
genügt später eine zweite Datei mit derselben Struktur.
`npm run pruefen:i18n` findet Lücken.

## Prüfen

```bash
npm run pruefen:i18n         # Übersetzungslücken, ohne Browser
npm run build:test           # Build mit spürbarer Verzögerung
npx vite preview --port 4173 --strictPort
npm run pruefen:routen       # alle Routen × fünf Rollen
npm run pruefen:verhalten    # 27 Ablauftests
```

Einzelheiten: [tools/pruefung/README.md](tools/pruefung/README.md).

## Was noch fehlt

- **Videos**: Aufnahme, Zuschnitt und Wiedergabe sind angedeutet. Braucht
  Capacitor-Plugins und Cloudflare Stream.
- **Karte**: Die Marker stehen an den richtigen Stellen, aber unter ihnen
  liegen keine Kartenkacheln. MapLibre kommt mit dem Server.
- **GPS**: Die Position steht fest auf Prenzlauer Berg und lässt sich über die
  Ortssuche verschieben.
- **E-Mail und SMS**: Der Bestätigungscode lautet immer `123456`.
- **Bilder**: Titelbilder und Gerichtsfotos sind Platzhalterflächen.
- **Rechtstexte**: `/impressum`, `/datenschutz`, `/agb` sind Blindtext und
  müssen vor dem Start juristisch geprüft werden.
- **Schrift**: Inter wird nicht mehr von Google geladen (Datenschutz und
  Ladezeit). Vor dem Start sollte sie selbst ausgeliefert werden — siehe den
  Kommentar in `index.html`.

Der weitere Kontext — Konzept, Entscheidungen, Datenmodell, nächste Schritte —
liegt im Repository **Brain**.
