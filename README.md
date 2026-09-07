# Design-System

Farben, Schrift, Abstände, Bausteine und **alle Texte**. Kein Bildschirm, keine
Daten, keine Anmeldung — nur das, woraus die Oberfläche gebaut wird.

Die Website und die App spielen sich diesen Ordner ein (`npm run sync:design`
dort). Geändert wird hier, nicht dort.

## Ansehen

```bash
npm install
npm run dev        # http://localhost:5173 — die Galerie
```

Die Galerie zeigt jeden Baustein einmal, mit den Zuständen, die im Entwurf
vorkommen, und einem Schalter für hell und dunkel. Sie ist kein Bestandteil
des Produkts.

```bash
npm run pruefen:i18n   # findet fehlende Texte, ohne Browser
npm run build          # Galerie als statische Seite
```

## Was hier liegt

```
src/
  config.js        APP_NAME, MVP-Stufe, Umkreis- und Preisstufen
  vocabulary.js    Angebotsarten, Allergene, Kennzeichnung, Merkmale, Kategorien
  i18n/
    de.json        ALLE Texte — nichts steht fest in den Komponenten
    index.jsx      t(), tNodes(), groupSizeLabel()
  styles/
    tokens.css     Farben, Abstände, Radien — hell und dunkel
    base.css       Typografie und Layout-Grundlagen
    components.css die Bausteine
    layout.css     Kopfleiste, Karte, Feed, Speisekarte, Konsolen
  ui/              die Bausteine

gallery/           die Galerie (kein Produktbestandteil)
```

## Zwei Regeln

**1. Kein Baustein kennt Daten.**
Keine Anmeldung, kein Netz, kein Speicher. Was angezeigt wird, kommt als
Eigenschaft herein; was beim Tippen passiert, gibt die Anwendung mit:

```jsx
<PlaceRow
  place={betrieb}
  openText="Jetzt geöffnet · bis 22:00"
  saved={gespeichert}
  onToggleSave={() => …}
/>
```

Deshalb lässt sich hier alles ansehen, ohne einen Server zu starten.

**2. Keine festen Farbwerte in Komponenten.**
Immer über die Variablen aus `tokens.css`. Sonst zieht der Dunkelmodus nicht
mit — und der gilt für Website *und* App, mit „Automatisch" als Standard.

## Sterne

Essen, Service und Preis stehen immer getrennt und werden nie zu einer Zahl
zusammengefasst. Das ist ein bewusstes Unterscheidungsmerkmal gegenüber
Google, kein Versehen. Mittelwerte mit einer Nachkommastelle, Einzelbewertungen
als ganze Zahl, die Sternegrafik abgerundet (3,8 → drei volle Sterne).

## Angebot

Was gibt es hier zu essen und zu trinken — als Symbolzeile, nicht als
Fließtext. Zehn Werte von `getraenke` bis `glutenfrei` (siehe
`src/vocabulary.js`). Ein Betrieb mit ausschließlich Getränken bekommt ein
eigenes, deutliches Etikett: „Nur Getränke".

Wer einen Wert ergänzt, ändert drei Stellen: `src/vocabulary.js`, das Symbol in
`src/ui/Serving.jsx` und den Text in `src/i18n/de.json` — und dieselbe Liste im
Server-Repo.

## Laden

Skelettflächen zuerst — sie zeigen, wie die Seite gleich aussieht. Der Kreisel
(`Spinner`, `LoadingBlock`) bleibt den Fällen vorbehalten, in denen es nichts
zu skizzieren gibt: ein laufender Button, ein Nachladen unter bestehendem
Inhalt.

## Schrift

Nichts wird von außen nachgeladen. Inter wird verwendet, wenn es auf dem Gerät
vorhanden ist, sonst die Systemschrift. Grund: Google Fonts direkt einzubinden
überträgt die IP-Adresse der Besucherin an Google und ist ohne Einwilligung
nach dem Urteil des LG München I (20.01.2022, 3 O 17493/20) angreifbar —
außerdem blockiert es den Seitenaufbau und funktioniert in der App offline
nicht. Vor dem Start sollte Inter selbst ausgeliefert werden.

## Texte

Alles in `src/i18n/de.json`. Für eine englische Fassung genügt später eine
zweite Datei mit derselben Struktur. Fehlt ein Schlüssel, zeigt die Oberfläche
den Schlüsselnamen — und `npm run pruefen:i18n` findet ihn vorher.
