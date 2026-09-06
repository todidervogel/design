# Auf dem Handy ansehen und als App bauen

Zwei Dinge, die du komplett vom Handy aus erledigen kannst:
den Prototyp **im Browser ansehen** und daraus eine **APK** für dein S9 bauen.

---

## 1 — Prototyp auf dem Handy ansehen

### Weg A: als Website veröffentlichen (empfohlen)

Einmalig einzurichten, danach reicht ein Link.

1. Auf dem Handy `github.com/todidervogel/design` öffnen.
2. **Settings → Pages → Build and deployment → Source** auf **GitHub Actions** stellen.
3. **Actions → „Website veröffentlichen" → Run workflow** antippen.
4. Nach etwa zwei Minuten liegt der Prototyp unter:

   ```
   https://todidervogel.github.io/design/
   ```

Ab dann veröffentlicht sich jede Änderung an diesem Zweig von selbst.
Der Link lässt sich im Browser als Symbol auf den Startbildschirm legen —
dann öffnet er sich ohne Adressleiste, fast wie eine App.

> Der Workflow legt zusätzlich eine `404.html` an. Nur deshalb funktionieren
> Direktaufrufe wie `…/design/karte`; GitHub Pages kennt die Routen des
> Prototyps sonst nicht.

### Weg B: direkt auf dem Handy laufen lassen (Termux)

Ohne Server, dafür mit etwas Einrichtung. Auf einem S9 spürbar langsamer.

1. **Termux** aus [F-Droid](https://f-droid.org/packages/com.termux/) installieren
   (die Version aus dem Play Store ist veraltet).
2. In Termux eintippen:

   ```bash
   pkg update && pkg install nodejs git -y
   git clone -b claude/design-spec-screens-components-omyfb5 \
     https://github.com/todidervogel/design.git
   cd design
   npm install
   npm run dev
   ```

3. Im Browser `http://localhost:5173` öffnen.

`npm install` lädt einmalig etwa 200 MB und dauert ein paar Minuten.

### Weg C: Rechner im selben WLAN

Am Rechner `npm run dev` starten — Vite zeigt eine Adresse wie
`http://192.168.x.x:5173`. Die im Handy-Browser öffnen. Änderungen am Code
sind sofort auf dem Handy sichtbar.

---

## 2 — APK für das S9 bauen

Android 9 ist kein Problem: die App verlangt mindestens Android 5.1.

### Weg A: GitHub Actions (empfohlen, ohne Colab)

Der Build läuft auf GitHubs Rechnern, du tippst nur zweimal.

1. `github.com/todidervogel/design` → **Actions → „APK bauen" → Run workflow**.
2. Etwa fünf Minuten warten.
3. Unter **Releases → „APK (letzter Build)"** die Datei
   `tellerrand-debug.apk` antippen — sie lädt direkt herunter.
4. Datei öffnen. Android fragt einmal nach der Erlaubnis:
   **Einstellungen → Apps → Spezieller Zugriff → Unbekannte Apps installieren →**
   deinen Browser auswählen und erlauben.

Der Umweg über die Release-Seite lohnt sich: unter *Artifacts* liegt die APK
in einem ZIP, das du auf dem Handy erst entpacken müsstest.

### Weg B: Google Colab

Falls du es lieber selbst laufen sehen willst — das gewünschte Colab-Notizbuch
liegt im Repository:

**[`tools/apk-bauen.ipynb`](../tools/apk-bauen.ipynb)**

So öffnest du es in Colab:

1. [colab.research.google.com](https://colab.research.google.com) aufrufen.
2. **Datei → Notebook öffnen → GitHub**.
3. `todidervogel/design` eintragen, als Branch
   `claude/design-spec-screens-components-omyfb5` wählen.
4. `tools/apk-bauen.ipynb` antippen.

Dieser Umweg ist nötig, weil der Zweigname Schrägstriche enthält — ein
direkter Colab-Link darauf lässt sich nicht eindeutig auflösen. Sobald der
Zweig in `main` gelandet ist, funktioniert auch:

```
https://colab.research.google.com/github/todidervogel/design/blob/main/tools/apk-bauen.ipynb
```

Dann oben **Laufzeit → Alle ausführen**. Der erste Durchlauf dauert
**10–15 Minuten**, weil Colab das Android-SDK (rund 1 GB) laden muss.
Die letzte Zelle lädt die fertige APK in deinen Download-Ordner.

Zu beachten:

- Colab vergisst alles, sobald die Sitzung endet — der nächste Build lädt
  das SDK wieder komplett neu. Für einen einmaligen Build in Ordnung,
  für regelmäßige Builds ist Weg A deutlich angenehmer.
- Bleib während des Builds im Tab, sonst trennt Colab die Sitzung.

### Was in der APK steckt

Der Prototyp läuft in einer WebView, verpackt mit
[Capacitor](https://capacitorjs.com). Konkret heißt das:

- Die Weboberfläche wird mit relativen Pfaden gebaut (`VITE_BASE=./`)
  und in `android/app/src/main/assets/public/` abgelegt.
- Konfiguration: `capacitor.config.json` (App-Name, Paket-ID `de.tellerrand.design`).
- Das Android-Projekt liegt unter `android/` und ist eingecheckt —
  Änderungen an Symbol, Name oder Version machst du dort.

Lokal (am Rechner) baust du dasselbe mit:

```bash
npm run sync:android              # Weboberfläche bauen und übernehmen
cd android && ./gradlew assembleDebug
```

Die fertige Datei liegt dann unter
`android/app/build/outputs/apk/debug/app-debug.apk`.

### Grenzen auf dem S9

- Das Gerät braucht eine aktuelle **Android System WebView** aus dem Play Store.
  Android 9 wird davon noch bedient; ohne Aktualisierung fehlen einzelne
  neuere CSS-Eigenschaften. Für die wichtigsten davon (`dvh`, `aspect-ratio`)
  sind Rückfalllösungen eingebaut.
- Es bleibt ein **Debug-Build**: nicht für den Play Store signiert und
  spürbar langsamer beim Start als ein Release-Build. Zum Durchklicken
  und Herzeigen reicht das.
- Kamera, Standort und Bestellungen sind Attrappen — der Prototyp hat
  weiterhin keine Logik.

### Was in der App anders ist als auf der Website

Die App erkennt sich selbst (über Capacitor) und verhält sich entsprechend:
Sie zeigt **Aufnehmen** in der unteren Leiste, kennt **keinen Gastmodus**
(ohne Anmeldung erscheint die Anmeldeseite), hat **keine Fußzeile** und
bringt einen **Dunkelmodus** mit, der standardmäßig der Systemeinstellung
folgt und sich unter *Einstellungen → Darstellung* umstellen lässt.

Zum Vergleichen ohne APK: im Design-Panel unter *Ziel* auf **App** umschalten.
