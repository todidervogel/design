import { useEffect, useMemo, useState } from 'react'
import { Camera, Info, Moon, Search, Sun, UtensilsCrossed } from 'lucide-react'
import {
  Accordion, Avatar, Badge, Button, Card, Checkbox, Chip, Dropzone, EmptyState, Field,
  IconButton, Input, LoadingBlock, Menu, MenuItem, Modal, ModalActions, Notice, PasswordInput,
  PlaceRow, Radio, RadioCard, RatingCompact, RatingFull, ReviewCard, ReviewCardSkeleton,
  Select, ServingPicker, ServingRow, Skeleton, SkeletonRow, SkeletonTile, Spinner, StarInput,
  Stars, Stepper, StrengthMeter, Switch, Tabs, Textarea, Thumb, ToastProvider, VerifiedMark,
  VideoTile, charCount, useToast,
} from '../src/ui'
import { ALLERGEN_KEYS, DIET_KEYS, SERVING_KEYS } from '../src/vocabulary'
import { APP_NAME } from '../src/config'
import { t } from '../src/i18n'

/**
 * Die Galerie zeigt jeden Baustein einmal — in hell und dunkel, mit den
 * Zuständen, die im Entwurf vorkommen. Sie gehört nicht zum Produkt; sie ist
 * dafür da, das Design-System anzusehen, ohne die ganze Anwendung zu starten.
 */

/* Ein erfundener Betrieb, nur zum Anschauen. Die echten Daten kommen vom Server. */
const BEISPIEL_BETRIEB = {
  id: 'p1', slug: 'trattoria-bella', name: 'Trattoria Bella', verified: true,
  cuisine: 'Italienisch', price: '€€', distance: '1,2 km', videoCount: 3, open: true,
  serving: ['fleisch', 'fisch', 'vegetarisch', 'suess'],
  rating: { food: 4.3, service: 4.0, price: 3.8 },
}

const BEISPIEL_BEWERTUNG = {
  id: 'r1', createdAt: '3. Sep 2026', verifiedOnSite: true, likes: 12, videoId: 'v1',
  author: { username: 'lisa_k' },
  rating: { food: 4, service: 5, price: 3 },
  groupSize: 2, foodHot: true,
  dishes: [{ name: 'Pizza Margherita', rating: 5 }, { name: 'Tiramisu', rating: 4 }],
  text: 'Wir saßen draußen, es war voll, trotzdem hat alles keine 20 Minuten gedauert.',
  answer: null,
}

const ABSCHNITTE = [
  ['farben', 'Farben'],
  ['schrift', 'Schrift'],
  ['buttons', 'Buttons'],
  ['felder', 'Eingabefelder'],
  ['anzeigen', 'Anzeigen'],
  ['sterne', 'Sterne'],
  ['angebot', 'Angebot'],
  ['listen', 'Listen und Karten'],
  ['laden', 'Laden und Leere'],
  ['overlays', 'Dialog, Menü, Toast'],
]

const FARBEN = [
  ['--bg-light', 'Grundfläche'], ['--bg-light-alt', 'Zweite Fläche'],
  ['--text-primary', 'Text'], ['--text-secondary', 'Text zweitrangig'],
  ['--text-tertiary', 'Text drittrangig'],
  ['--accent', 'Akzent'], ['--accent-hover', 'Akzent aktiv'], ['--accent-soft', 'Akzent zart'],
  ['--border', 'Rahmen'], ['--border-strong', 'Rahmen kräftig'],
  ['--success', 'Erfolg'], ['--warning', 'Warnung'], ['--danger', 'Gefahr'],
  ['--star-filled', 'Stern'], ['--bg-dark', 'Feed-Grund'],
]

function Abschnitt({ id, titel, hinweis, children }) {
  return (
    <section className="gal-section" id={id}>
      <h2 className="t-h2">{titel}</h2>
      {hinweis && <p className="gal-note">{hinweis}</p>}
      {children}
    </section>
  )
}

const Item = ({ titel, children }) => (
  <div className="gal-item">
    <h3>{titel}</h3>
    {children}
  </div>
)

export default function Gallery() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <ToastProvider>
      <header className="gal-top">
        <strong className="t-h3">{APP_NAME} — Design-System</strong>
        <span className="spacer" style={{ flex: 1 }} />
        <Button variant="secondary" size="sm" icon={dark ? Sun : Moon} onClick={() => setDark((d) => !d)}>
          {dark ? 'Hell' : 'Dunkel'}
        </Button>
      </header>

      <nav className="gal-nav">
        {ABSCHNITTE.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="chip" style={{ textDecoration: 'none' }}>{label}</a>
        ))}
      </nav>

      <main className="gal">
        <Farben />
        <Schrift />
        <Buttons />
        <Felder />
        <Anzeigen />
        <Sterne />
        <Angebot />
        <Listen />
        <Laden />
        <Overlays />
      </main>
    </ToastProvider>
  )
}

function Farben() {
  return (
    <Abschnitt
      id="farben"
      titel="Farben"
      hinweis="Alle Werte stehen in src/styles/tokens.css. In Komponenten wird nur über Variablen zugegriffen, nie über feste Werte — sonst zieht der Dunkelmodus nicht mit."
    >
      <div className="gal-swatches">
        {FARBEN.map(([token, label]) => (
          <span className="gal-swatch" key={token}>
            <span className="gal-chip" style={{ background: `var(${token})` }} />
            <span>
              <strong style={{ display: 'block' }}>{label}</strong>
              <code className="t-tiny c-tertiary">{token}</code>
            </span>
          </span>
        ))}
      </div>
    </Abschnitt>
  )
}

function Schrift() {
  return (
    <Abschnitt id="schrift" titel="Schrift" hinweis="Eine neutrale Schrift, klare Größenhierarchie. Nichts wird von außen nachgeladen.">
      <div className="gal-item">
        <p className="t-display">Display — Überschrift der Startseite</p>
        <p className="t-h1">H1 — Seitentitel</p>
        <p className="t-h2">H2 — Abschnitt</p>
        <p className="t-h3">H3 — Karte, Zeile</p>
        <p className="t-body">Fließtext — Beschreibungen, Bewertungen, Hinweise.</p>
        <p className="t-body-bold">Fließtext betont</p>
        <p className="t-small c-secondary">Klein und zweitrangig — Metazeilen, Hilfetexte.</p>
        <p className="t-tiny c-tertiary">Winzig — Beschriftungen unter Symbolen.</p>
      </div>
    </Abschnitt>
  )
}

function Buttons() {
  const toast = useToast()
  return (
    <Abschnitt id="buttons" titel="Buttons" hinweis="Vier Varianten, drei Zustände. Höhe 44 px, damit man sie mit dem Daumen trifft.">
      <div className="gal-grid">
        <Item titel="Varianten">
          <div className="row-wrap">
            <Button variant="primary">Primär</Button>
            <Button variant="secondary">Sekundär</Button>
            <Button variant="quiet">Leise</Button>
            <Button variant="danger">Gefahr</Button>
          </div>
        </Item>
        <Item titel="Zustände">
          <div className="row-wrap">
            <Button variant="primary" disabled>Gesperrt</Button>
            <Button variant="primary" loading>Lädt</Button>
            <Button variant="secondary" size="sm">Klein</Button>
          </div>
        </Item>
        <Item titel="Mit Symbol">
          <div className="row-wrap">
            <Button variant="secondary" icon={Search}>Suchen</Button>
            <IconButton icon={Camera} label="Aufnehmen" />
            <Button variant="primary" full onClick={() => toast('Gespeichert')}>Volle Breite</Button>
          </div>
        </Item>
      </div>
    </Abschnitt>
  )
}

function Felder() {
  const [text, setText] = useState('')
  const [an, setAn] = useState(true)
  const [zahl, setZahl] = useState(2)
  const [wahl, setWahl] = useState('a')

  return (
    <Abschnitt id="felder" titel="Eingabefelder" hinweis="Beschriftung immer über dem Feld, Pflichtfeld mit Stern, Fehler darunter in Rot.">
      <div className="gal-grid">
        <Item titel="Textfeld">
          <Field label="Name" required hint="So steht es später auf der Seite.">
            {(id) => <Input id={id} placeholder="Trattoria Bella" />}
          </Field>
          <Field label="Mit Fehler" required error="Bitte ausfüllen.">
            {(id) => <Input id={id} />}
          </Field>
        </Item>

        <Item titel="Mehrzeilig">
          <Field label="Beschreibung" count={charCount(text, 300)}>
            {(id) => <Textarea id={id} rows={3} maxLength={300} value={text} onChange={(e) => setText(e.target.value)} />}
          </Field>
        </Item>

        <Item titel="Passwort">
          <Field label="Passwort" required>
            {(id) => (
              <>
                <PasswordInput id={id} defaultValue="Passwort123" />
                <StrengthMeter level={2} />
              </>
            )}
          </Field>
        </Item>

        <Item titel="Auswahl">
          <Field label="Kategorie">
            {(id) => <Select id={id} options={['Restaurant', 'Café', 'Bar']} />}
          </Field>
          <Checkbox label="Außenplätze" checked={an} onChange={(e) => setAn(e.target.checked)} />
          <Radio name="gal" label="Erste Möglichkeit" checked={wahl === 'a'} onChange={() => setWahl('a')} />
          <Radio name="gal" label="Zweite Möglichkeit" checked={wahl === 'b'} onChange={() => setWahl('b')} />
        </Item>

        <Item titel="Karte zum Auswählen">
          <RadioCard
            name="galcard" label="Öffentlich" description="Alle können es sehen."
            checked={wahl === 'a'} onChange={() => setWahl('a')}
          />
          <RadioCard
            name="galcard" label="Nur Freunde" description="Nur bestätigte Follower."
            checked={wahl === 'b'} onChange={() => setWahl('b')}
          />
        </Item>

        <Item titel="Schalter und Zähler">
          <div className="row-between"><span className="t-body">Privates Profil</span>
            <Switch checked={an} onChange={setAn} label="Privates Profil" />
          </div>
          <Stepper value={zahl} onChange={setZahl} />
          <Dropzone small text="Bild hierher ziehen oder" hint="JPG oder PNG" />
        </Item>
      </div>
    </Abschnitt>
  )
}

function Anzeigen() {
  return (
    <Abschnitt id="anzeigen" titel="Anzeigen" hinweis="Badges, Hinweisbänder, Chips, Avatare und Reiter.">
      <div className="gal-grid">
        <Item titel="Badges">
          <div className="row-wrap">
            <Badge>Standard</Badge>
            <Badge tone="accent">Akzent</Badge>
            <Badge tone="success">Erfolg</Badge>
            <Badge tone="warning">Warnung</Badge>
            <Badge tone="danger">Gefahr</Badge>
            <VerifiedMark withLabel />
          </div>
        </Item>

        <Item titel="Hinweisbänder">
          <Notice icon={Info}>Automatisch erstellt, noch nicht bestätigt.</Notice>
          <Notice tone="success">Gespeichert.</Notice>
          <Notice tone="danger">Das Passwort stimmt nicht.</Notice>
        </Item>

        <Item titel="Chips">
          <div className="row-wrap">
            <Chip>Nicht gewählt</Chip>
            <Chip active>Gewählt</Chip>
            <Chip icon={UtensilsCrossed}>Mit Symbol</Chip>
          </div>
        </Item>

        <Item titel="Avatar und Vorschau">
          <div className="row-wrap" style={{ alignItems: 'center' }}>
            <Avatar name="maxmuster" size={32} />
            <Avatar name="lisa_k" size={48} />
            <Thumb size={56} icon={UtensilsCrossed} />
          </div>
        </Item>

        <Item titel="Reiter">
          <GalTabs />
        </Item>

        <Item titel="Aufklappen">
          <Accordion items={[
            { q: 'Wie lade ich ein Video hoch?', a: 'Über das Plus in der unteren Leiste — nur in der App.' },
            { q: 'Was kostet das?', a: 'Nichts.' },
          ]} />
        </Item>
      </div>
    </Abschnitt>
  )
}

function GalTabs() {
  const [tab, setTab] = useState('videos')
  return (
    <Tabs
      items={[{ id: 'videos', label: 'Videos' }, { id: 'karte', label: 'Speisekarte' }, { id: 'info', label: 'Infos' }]}
      value={tab}
      onChange={setTab}
    />
  )
}

function Sterne() {
  const [wert, setWert] = useState(4)
  return (
    <Abschnitt
      id="sterne"
      titel="Sterne"
      hinweis="Essen, Service und Preis stehen immer getrennt und werden nie zu einer Zahl zusammengefasst — das ist der Unterschied zu Google. Mittelwerte mit einer Nachkommastelle, Einzelbewertungen als ganze Zahl."
    >
      <div className="gal-grid">
        <Item titel="Nur Sterne">
          <Stars value={4.3} />
          <Stars value={2} />
        </Item>
        <Item titel="Kompakt">
          <RatingCompact rating={{ food: 4.3, service: 4.0, price: 3.8 }} average />
        </Item>
        <Item titel="Vollständig">
          <RatingFull rating={{ food: 4.3, service: 4.0, price: 3.8 }} count={24} />
        </Item>
        <Item titel="Eingabe">
          <StarInput value={wert} onChange={setWert} label="Essen" />
          <StarInput compact value={wert} onChange={setWert} label="Essen kompakt" />
        </Item>
      </div>
    </Abschnitt>
  )
}

function Angebot() {
  const [gewaehlt, setGewaehlt] = useState(['vegan', 'fisch'])
  return (
    <Abschnitt
      id="angebot"
      titel="Angebot"
      hinweis="Was gibt es hier zu essen und zu trinken? Als Symbolzeile, nicht als Fließtext — damit man es sieht, bevor man liest. Ein Betrieb mit ausschließlich Getränken bekommt ein eigenes, deutliches Etikett."
    >
      <div className="gal-grid">
        <Item titel="Klein — Trefferliste">
          <ServingRow serving={['fleisch', 'fisch', 'vegetarisch', 'suess']} size="sm" />
        </Item>
        <Item titel="Groß — Gastro-Seite">
          <ServingRow serving={['vegan', 'vegetarisch', 'glutenfrei', 'fruehstueck']} size="md" />
        </Item>
        <Item titel="Nur Getränke">
          <ServingRow serving={['getraenke']} size="md" />
        </Item>
        <Item titel="Zum Auswählen">
          <ServingPicker value={gewaehlt} onChange={setGewaehlt} keys={SERVING_KEYS} />
        </Item>
        <Item titel="Kennzeichnung Gericht">
          <div className="row-wrap">
            {DIET_KEYS.map((key) => <Badge key={key} tone="success">{t(`diet.${key}`)}</Badge>)}
          </div>
        </Item>
        <Item titel="Allergene">
          <p className="t-small c-secondary">
            {ALLERGEN_KEYS.map((key, i) => `${i + 1} ${t(`allergens.${key}`)}`).join(' · ')}
          </p>
        </Item>
      </div>
    </Abschnitt>
  )
}

function Listen() {
  const [gespeichert, setGespeichert] = useState(false)
  return (
    <Abschnitt
      id="listen"
      titel="Listen und Karten"
      hinweis="Diese Bausteine kennen keine Daten. Ob etwas gespeichert ist und was beim Tippen passiert, gibt die Anwendung mit."
    >
      <div className="stack-4">
        <Card pad={0}>
          <PlaceRow
            place={BEISPIEL_BETRIEB}
            openText="Jetzt geöffnet · bis 22:00"
            saved={gespeichert}
            onToggleSave={() => setGespeichert((s) => !s)}
          />
        </Card>

        <div className="video-grid" style={{ maxWidth: 420 }}>
          <VideoTile to="#" views="12.400" />
          <VideoTile to="#" views="940" locked />
          <VideoTile to="#" views="88" pending />
        </div>

        <ReviewCard review={BEISPIEL_BEWERTUNG} onLike={() => {}} />
        <ReviewCard review={BEISPIEL_BEWERTUNG} variant="gastro" onReply={async () => {}} />
      </div>
    </Abschnitt>
  )
}

function Laden() {
  return (
    <Abschnitt
      id="laden"
      titel="Laden und Leere"
      hinweis="Skelettflächen zuerst — sie zeigen, wie die Seite gleich aussieht. Der Kreisel bleibt den Fällen vorbehalten, in denen es nichts zu skizzieren gibt."
    >
      <div className="gal-grid">
        <Item titel="Skelett">
          <Skeleton w="60%" h={20} />
          <Skeleton w="90%" h={12} />
          <Skeleton w="40%" h={12} />
        </Item>
        <Item titel="Als Zeile">
          <SkeletonRow />
        </Item>
        <Item titel="Als Kachel">
          <div style={{ maxWidth: 120 }}><SkeletonTile /></div>
        </Item>
        <Item titel="Als Bewertung">
          <ReviewCardSkeleton />
        </Item>
        <Item titel="Kreisel">
          <Spinner label="Wird geladen …" />
          <LoadingBlock minHeight={80} />
        </Item>
        <Item titel="Leerer Zustand">
          <EmptyState
            icon={Camera}
            title="Noch keine Videos"
            text="Sei die erste Person, die hier ein Video hochlädt."
            action={<Button variant="primary">Video hochladen</Button>}
          />
        </Item>
      </div>
    </Abschnitt>
  )
}

function Overlays() {
  const [offen, setOffen] = useState(false)
  const toast = useToast()

  return (
    <Abschnitt id="overlays" titel="Dialog, Menü, Toast" hinweis="Ein Dialog verlangt eine Entscheidung, ein Toast bestätigt nur.">
      <div className="gal-grid">
        <Item titel="Dialog">
          <Button variant="secondary" onClick={() => setOffen(true)}>Dialog öffnen</Button>
          <Modal
            open={offen}
            onClose={() => setOffen(false)}
            title="Dafür brauchst du ein Konto"
            description="Melde dich an, um zu liken, zu folgen und Inhalte zu speichern."
            actions={
              <ModalActions onCancel={() => setOffen(false)}>
                <Button variant="primary" onClick={() => setOffen(false)}>Anmelden</Button>
              </ModalActions>
            }
          />
        </Item>

        <Item titel="Menü">
          <Menu trigger={({ toggle }) => <Button variant="secondary" onClick={toggle}>Menü öffnen</Button>}>
            {({ close }) => (
              <>
                <MenuItem onClick={close}>Ansehen</MenuItem>
                <MenuItem onClick={close}>Bearbeiten</MenuItem>
                <MenuItem danger onClick={close}>Löschen</MenuItem>
              </>
            )}
          </Menu>
        </Item>

        <Item titel="Toast">
          <div className="row-wrap">
            <Button variant="secondary" size="sm" onClick={() => toast('Gespeichert')}>Erfolg</Button>
            <Button variant="secondary" size="sm" onClick={() => toast('Etwas ist schiefgelaufen.', 'error')}>Fehler</Button>
            <Button variant="secondary" size="sm" onClick={() => toast('Nur ein Hinweis.', 'info')}>Hinweis</Button>
          </div>
        </Item>
      </div>
    </Abschnitt>
  )
}
