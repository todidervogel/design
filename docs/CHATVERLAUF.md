# Chatverlauf: Design-Prototyp „Tellerrand“

Protokoll der Zusammenarbeit zwischen Nutzer und Claude Code in dieser Sitzung.
Chronologisch, mit den wichtigsten Aktionen und Ergebnissen je Runde.

---

## Runde 1 — Auftrag: Design-Spezifikation umsetzen

**Anfrage des Nutzers:** eine vollständige, sehr detaillierte deutsche
Design-Spezifikation („Designer mir das“) für eine App/Website namens
`APP_NAME` — ein Restaurant-Entdeckungsdienst mit Video-Feed, Bewertungen,
Gastro-Verwaltung und Admin-Bereich. Die Spezifikation umfasste:

- **TEIL A** — Design-Grundlagen: Farben, Typografie, Abstände, Buttons,
  Eingabefelder, Sterne-Anzeige
- **TEIL B** — Globale Komponenten: Kopfleiste, untere Navigation, Fußzeile,
  Aufbau-Banner, Toasts, Dialoge, leere Zustände, Ladezustände
- **TEIL C** — Öffentliche Screens: Startseite, Karte, Gastro-Seite,
  Suchergebnisse, Video-Feed, Videodetail
- **TEIL D** — Konto & Registrierung
- **TEIL E** — Nutzer-Screens: Video-Upload (5 Schritte), Profil,
  Einstellungen, Benachrichtigungen
- **TEIL F** — Gastro-Screens: Anmeldung, Einrichtungsassistent, Dashboard,
  Videos, Speisekarte, Bewertungen, Profil, QR-Codes
- **TEIL G** — Admin-Screens: Übersicht, Video-Freigabe, Meldungen,
  Betriebe, Einladungen, Nutzer, Vorschläge, Protokoll
- **TEIL H** — Rechtliche Seiten
- **TEIL I** — Fehlerseiten
- **TEIL J** — Übersicht aller Routen
- **TEIL K** — Hinweise zur Umsetzung (alles statisch, keine Validierung,
  Texte zentral, elf wiederverwendbare Bausteine)

**Vorgehen:**

1. Leeres Repository vorgefunden (`todidervogel/design`), Branch
   `claude/design-spec-screens-components-omyfb5`.
2. Vite + React + React Router als Grundgerüst aufgesetzt
   (`package.json`, `vite.config.js`, `index.html`).
3. Design-Tokens als CSS-Variablen geschrieben (`tokens.css`,
   `base.css`, `components.css`, `layout.css`) — Farben, Typografie,
   Abstände 1:1 aus der Spezifikation.
4. Zentrale Übersetzungsdatei `src/i18n/de.json` mit **allen** Texten der
   Spezifikation angelegt, dazu ein `t()`-Helfer (`src/i18n/index.jsx`) und
   `APP_NAME` als einzige Konstante in `src/config.js` (Arbeitstitel:
   *Tellerrand*).
5. Platzhalterdaten in `src/mock/` (Betriebe, Videos, Bewertungen, Nutzer,
   Admin-Daten).
6. Die **elf Bausteine** aus TEIL K.7 gebaut: `Button`, `Field`, `Card`,
   `ReviewCard`, `Stars`/`RatingCompact`/`RatingFull`, `VideoTile`,
   `PlaceRow`, `EmptyState`, `Modal`, `Toast`, `Chip`, `Badge` — dazu
   `Menu`, `Tabs`, `Accordion`, `Switch`, `Stepper`, `Dropzone`,
   `StarInput`, `Skeleton`.
7. Alle **55 Screens** aus der Routentabelle (TEIL J) als eigene
   React-Komponenten umgesetzt, organisiert nach `src/routes/{public,
   konto, nutzer, gastro, admin, recht, fehler, dialogs}/`.
8. Ein **Design-Panel** (kein Produktbestandteil) eingebaut, das jeden
   Screen zwischen den drei Varianten *gefüllt / leer / ladend* umschaltet,
   dazu Sitzung (Gast/angemeldet) und die beiden Banner
   (`src/lib/design-state.jsx`, `src/components/layout/DevPanel.jsx`).
9. Eine Übersichtsseite `/uebersicht` gebaut, die alle Routen mit ihrem
   Abschnitt in der Spezifikation auflistet.

**Prüfung:**

- Build mit `vite build` erfolgreich.
- Alle 55 Routen automatisiert mit Playwright/Chromium aufgerufen —
  keine JS- oder Konsolenfehler.
- Kein fehlender Übersetzungsschlüssel, keine sichtbaren
  `{{platzhalter}}`.
- Sichtprüfung per Screenshot (Start, Karte, Gastro-Seite, Feed,
  Gastro-Dashboard, Admin-Video-Freigabe) — dabei mehrere Korrekturen:
  - Doppelte Reiter auf der Gastro-Seite entfernt.
  - Kompakte Sternezeile: Trennpunkt hängt am vorangehenden Eintrag,
    damit sie sauber umbricht.
  - Sterne werden abgerundet dargestellt (3,8 → drei volle Sterne),
    Mittelwerte immer mit einer Nachkommastelle, Einzelbewertungen als
    ganze Zahl.
  - Restaurantleiste im Feed verdeckte sich mit der unteren Navigation —
    Innenabstand korrigiert.
  - Sternevorgabe in der Bewertung (E.5) brach auf schmalen Bildschirmen
    um — kompakte Variante für Gerichte-Karten ergänzt.
  - Autoren-Avatar auf Videokacheln zeigte die interne ID statt des
    Benutzernamens — behoben.

**Ergebnis:** ein vollständiger, statischer Design-Prototyp ohne Server,
Logik oder Validierung. Commit `7294c29`.

---

## Runde 2 — Frage: Handy und APK-Build per Colab

**Anfrage des Nutzers:**
1. Wie startet man den Prototyp auf dem Handy?
2. Wie baut man daraus per Google Colab eine APK für ein Galaxy S9 mit
   Android 9?

**Vorgehen:**

1. `vite.config.js` und `src/main.jsx` um einen konfigurierbaren
   Basis-Pfad erweitert (`VITE_BASE`), damit dieselbe Website unter `/`
   (lokal), `/design/` (GitHub Pages) oder `./` (App-Paket) läuft.
2. CSS-Rückfallebenen für ältere WebViews ergänzt: `vh` neben `dvh`,
   Ersatzlösung für `aspect-ratio` auf den Videokacheln.
3. **Capacitor** eingerichtet (`@capacitor/core`, `@capacitor/android`,
   `@capacitor/cli`), Android-Projekt unter `android/` generiert und
   eingecheckt (`minSdkVersion 22` — deckt Android 9 auf dem S9 klar ab).
4. Zwei **GitHub-Actions-Workflows** geschrieben:
   - `.github/workflows/pages.yml` — baut die Website und veröffentlicht
     sie auf GitHub Pages (inklusive `404.html`-Fallback für Unterseiten).
   - `.github/workflows/android.yml` — baut eine Debug-APK und hängt sie
     an eine Vorab-Version (Release) an, damit sie sich auf dem Handy
     direkt statt als ZIP herunterladen lässt.
5. Ein **Colab-Notizbuch** (`tools/apk-bauen.ipynb`) gebaut: installiert
   Java 17, Node 20 und das Android-SDK, klont das Repository, baut die
   Website und die APK, lädt sie am Ende automatisch herunter.
6. Anleitung `docs/HANDY.md` geschrieben mit drei Wegen, den Prototyp auf
   dem Handy anzusehen (GitHub Pages, Termux, WLAN-Rechner), und zwei
   Wegen, die APK zu bauen (GitHub Actions empfohlen, Colab als
   Alternative).

**Prüfung:**

- Build mit `VITE_BASE=/design/` und `VITE_BASE=./` — beide erzeugen
  korrekte Pfade.
- Alle 55 Routen erneut automatisiert geprüft — fehlerfrei.
- GitHub-Pages-Unterverzeichnis lokal nachgebildet (Python-Server mit
  404-Fallback) — Direktaufrufe wie `/design/karte` funktionieren.
- Capacitor-Asset-Paket lokal ausgeliefert und in einer S9-Bildschirmgröße
  (360×740, DPR 3) mit Playwright überprüft — Screenshot bestätigt
  korrektes Layout.
- Colab-Link über Schrägstriche im Branch-Namen korrigiert (direkter Link
  funktioniert nicht, stattdessen Weg über *Datei → Notebook öffnen →
  GitHub*).

**Ergebnis:** Website lässt sich mit zwei Taps auf GitHub Pages
veröffentlichen, APK lässt sich mit zwei Taps über GitHub Actions bauen
(Release-Seite), Colab-Weg als Alternative dokumentiert. Commits `87539b9`,
`2988534`.

---

## Runde 3 — Feinschliff: Web/App-Unterschiede, Gastmodus, Dunkelmodus

**Anfrage des Nutzers** (mehrere Punkte in einer Nachricht):
1. Unterschied machen zwischen Zugriff per Android/Desktop.
2. In der mittleren Leiste der Website das „+“ (Aufnehmen) weglassen —
   passt nicht zu einer Internetseite.
3. Icons und Animationen später noch verfeinern (vorerst offen gelassen).
4. In der **App** soll es **keinen Gastmodus** geben.
5. Im Gastmodus kann man **nichts posten**.
6. Auf der Kontoseite soll „Noch nicht angemeldet“ stehen (statt eines
   leeren/falschen Zustands).
7. Liken und Folgen sollen **erst nach Login** funktionieren.
8. Die App soll einen **Dunkelmodus** haben.

**Vorgehen:**

1. `src/lib/design-state.jsx` erweitert: erkennt jetzt automatisch
   `platform` (`web`/`app`, über `Capacitor.isNativePlatform()`) und
   `device` (`mobile`/`desktop`, über Fensterbreite + Touch), führt einen
   `theme`-Zustand (`auto`/`light`/`dark`) und berechnet `darkMode` — der
   **nur in der App** greift, die Website bleibt hell. Auswahl wird in
   `localStorage` gemerkt, damit sie ein Neuladen übersteht.
2. Vollständige **dunkle Farbpalette** in `tokens.css` ergänzt — zweiter
   Satz derselben Variablennamen aus TEIL A.1, aktiviert über
   `:root[data-theme='dark']`. Dabei fest verdrahtete Farben in
   Komponenten (Kartenfläche, getönte Badges, blaues Verifiziert-Häkchen)
   auf Token umgestellt, damit sie im Dunkelmodus mitziehen.
3. `src/components/layout/BottomNav.jsx` neu geschrieben: auf der
   **Website** vier Punkte (Feed · Karte · Suche · Profil), in der
   **App** zusätzlich „Aufnehmen“ mittig. Am **Rechner** entfällt die
   Leiste komplett (`isDesktop` → `null`).
4. Fußzeile (B.4) auf die Website beschränkt (`Shell.jsx`) — in der App
   stehen die Rechtstexte stattdessen in den Einstellungen.
5. Neues Modul `src/lib/auth.jsx` mit der zentralen Anmelde-Schranke:
   - `RouteGuard` — App ohne Anmeldung wird zur Anmeldeseite umgeleitet
     (offen bleiben Konto-, Rechts- und Fehlerseiten); Website als Gast
     wird nur bei `/upload` umgeleitet.
   - `useRequireLogin()` — kapselt eine Aktion so, dass sie als Gast einen
     Hinweisdialog statt der eigentlichen Aktion auslöst.
   - `LoginGate` — der Dialog „Dafür brauchst du ein Konto“ mit
     „Anmelden“ und „Konto erstellen“.
6. Die Schranke an alle Beitrags-Aktionen angeschlossen: Lesezeichen
   (`PlaceRow`), Daumen hoch (`ReviewCard`), Gefällt mir/Speichern/Folgen
   im Feed und in der Videodetailseite, Speichern auf der Gastro-Seite,
   Folgen in der Suche und im fremden Profil.
7. `src/routes/nutzer/Profile.jsx`: eigenes Profil zeigt im Gastmodus
   jetzt „Noch nicht angemeldet“ mit Buttons zu Anmeldung/Registrierung
   statt eines falschen oder leeren Zustands.
8. Darstellungs-Einstellung ergänzt (`Settings.jsx`): Abschnitt
   „Darstellung“ mit Automatisch/Hell/Dunkel, nur sichtbar in der App.
9. `DevPanel.jsx` komplett neu gebaut: Schalter für Ziel (Website/App),
   Sitzung (Gast/Angemeldet, in der App mit Hinweis auf den fehlenden
   Gastmodus), Darstellung (Hell/Dunkel, in der Website deaktiviert),
   Zustand (gefüllt/leer/ladend) sowie die beiden Banner. Das Gerät wird
   nicht mehr per Schalter gesetzt, sondern zeigt nur an, was aus der
   Fensterbreite folgt.
10. Nebenbei behoben: Aktionsleiste der Gastro-Seite (Route/Anrufen/
    Speichern/Teilen) lief auf schmalen Bildschirmen über den Rand —
    Symbol steht jetzt auf Schmalbildschirmen über der Beschriftung.
    `prefers-reduced-motion` ergänzt, damit Bewegung zurückgenommen wird,
    wenn das Betriebssystem das verlangt.

**Prüfung:**

- Build erfolgreich, alle 55 Routen erneut automatisiert über drei
  Kombinationen geprüft (Website·Gast·hell, Website·angemeldet·hell,
  App·angemeldet·dunkel) — 165 Seitenaufrufe, keine Fehler.
- Elf gezielte Verhaltenstests mit Playwright geschrieben und alle grün:
  - Website mobil: untere Leiste ohne „Aufnehmen“.
  - App mobil: „Aufnehmen“ vorhanden.
  - App: Hinweis auf den fehlenden Gastmodus im Panel.
  - App ohne Anmeldung → Weiterleitung zur Anmeldeseite.
  - Gast auf `/profil` → „Noch nicht angemeldet“.
  - Gast auf `/upload` → Weiterleitung zur Anmeldung.
  - Gast liket → Anmelde-Dialog erscheint.
  - Angemeldet liket → kein Dialog, nur der übliche Toast.
  - Fußzeile nur auf der Website.
  - Dunkelmodus in der App aktiv, Website bleibt hell.
- Screenshots im Dunkelmodus (Gastro-Seite, Einstellungen) und der
  Website-Navigation ohne „+“ zur Sichtprüfung angefertigt.
- Kein fehlender Übersetzungsschlüssel.
- README und `docs/HANDY.md` um die Web/App-Unterschiede ergänzt.

**Ergebnis:** Website und App unterscheiden sich sichtbar und funktional
in Navigation, Gastmodus, Fußzeile und Darstellung; alle Beitrags-Aktionen
sind hinter der Anmeldung; der Dunkelmodus ist vollständig und nur der
App vorbehalten. Commit `0f643ad`.

Offen gelassen wurde der Wunsch nach mehr Feinschliff an Icons und
Animationen — dazu wurde nach einer konkreteren Richtung gefragt, statt
ins Blaue zu ändern.

---

## Runde 4 — Dieser Chatverlauf

**Anfrage des Nutzers:** den gesamten bisherigen Chat mit allen Aktionen
in eine Markdown-Datei schreiben.

**Ergebnis:** diese Datei, `docs/CHATVERLAUF.md`.

---

## Stand des Repositories

| Commit | Inhalt |
|---|---|
| `7294c29` | Design-Prototyp: alle Screens, Felder und Texte statisch umgesetzt |
| `87539b9` | Wege zum Handy: Website veröffentlichen und APK bauen |
| `2988534` | Colab: Weg über den Notebook-Dialog beschreiben |
| `0f643ad` | Website und App trennen, Gastmodus regeln, Dunkelmodus für die App |

**Branch:** `claude/design-spec-screens-components-omyfb5`
**Repository:** `todidervogel/design`

### Wichtige Dateien

```
src/
  config.js                 APP_NAME, MVP-Stufe, Umkreis- und Preisstufen
  i18n/de.json               alle Texte der Oberfläche
  mock/                      Platzhalterdaten (Betriebe, Videos, Nutzer, …)
  lib/
    design-state.jsx         Ziel, Gerät, Sitzung, Darstellung, Screen-Variante
    auth.jsx                 Anmelde-Schranke (App ohne Gastmodus, Gast ohne Beiträge)
  styles/                    Tokens, Grundlagen, Bausteine, Layout (inkl. Dunkelmodus)
  components/
    ui/                      die elf Bausteine + Menü, Reiter, Skelett, LoginGate
    layout/                  Kopfleiste, Fußzeile, untere Navigation, Design-Panel
  routes/                    alle 55 Screens, gegliedert nach TEIL C–I

android/                      eingechecktes Capacitor-Android-Projekt
tools/apk-bauen.ipynb         Colab-Notizbuch für den APK-Build
docs/HANDY.md                 Anleitung: Handy ansehen + APK bauen
docs/CHATVERLAUF.md           diese Datei
.github/workflows/
  pages.yml                   Website auf GitHub Pages veröffentlichen
  android.yml                 APK bauen und als Release bereitstellen
```
