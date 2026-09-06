import { useState } from 'react'
import { Image, Plus } from 'lucide-react'
import {
  Button, Card, Checkbox, Chip, Dropzone, Field, Input, Modal, ModalActions, Notice,
  Select, Switch, Textarea, charCount, useToast,
} from '../../components/ui'
import { GastroShell } from './GastroShell'
import { ConsoleHeader } from '../../components/layout'
import { HoursEditor } from './HoursEditor'
import { myPlace } from '../../mock/places'
import { PRICE_LEVELS } from '../../config'
import { t } from '../../i18n'

const CUISINES = ['Italienisch', 'Deutsch', 'Asiatisch', 'Vietnamesisch', 'Türkisch', 'Griechisch', 'Vegetarisch', 'Fusion']
const FEATURES = [
  'barrierefrei', 'aussenplaetze', 'vegetarisch', 'vegan', 'glutenfrei', 'hunde',
  'wlan', 'reservierung', 'kartenzahlung', 'parkplaetze', 'lieferung', 'abholung',
]

function Section({ title, children }) {
  const toast = useToast()
  return (
    <section>
      <div className="row-between" style={{ marginBottom: 'var(--sp-3)' }}>
        <h2 className="t-h2">{title}</h2>
        <Button variant="secondary" size="sm" onClick={() => toast(t('toast.saved'))}>{t('common.save')}</Button>
      </div>
      <Card className="stack-4">{children}</Card>
    </section>
  )
}

/** F.9 — Gastro-Profil */
export default function GastroProfile() {
  const [about, setAbout] = useState(myPlace.description)
  const [price, setPrice] = useState(myPlace.price)
  const [cuisines, setCuisines] = useState(['Italienisch'])
  const [specialOpen, setSpecialOpen] = useState(false)

  const toggleCuisine = (c) =>
    setCuisines((list) => (list.includes(c) ? list.filter((x) => x !== c) : [...list, c]))

  return (
    <GastroShell title={t('gastro.profile.title')}>
      <ConsoleHeader title={t('gastro.profile.title')} />

      <div className="stack-8" style={{ maxWidth: 760 }}>
        <Section title={t('gastro.profile.sectionBase')}>
          <Field label={t('gastro.profile.name')} required>
            {(id) => <Input id={id} defaultValue={myPlace.name} />}
          </Field>
          <Field label={t('gastro.profile.street')} required>
            {(id) => <Input id={id} defaultValue="Kastanienallee 42" />}
          </Field>
          <div className="row" style={{ gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
            <Field label={t('gastro.profile.zip')} required className="grow">
              {(id) => <Input id={id} defaultValue="10435" />}
            </Field>
            <Field label={t('gastro.profile.city')} required className="grow">
              {(id) => <Input id={id} defaultValue="Berlin" />}
            </Field>
          </div>
          <Field label={t('gastro.profile.country')} required>
            {(id) => <Select id={id} options={['Deutschland', 'Österreich', 'Schweiz']} />}
          </Field>
          <Field label={t('gastro.profile.phone')}>
            {(id) => <Input id={id} type="tel" defaultValue={myPlace.phone} />}
          </Field>
          <Field label={t('gastro.profile.email')}>
            {(id) => <Input id={id} type="email" placeholder={t('auth.register.emailPlaceholder')} />}
          </Field>
          <Field label={t('gastro.profile.website')}>
            {(id) => <Input id={id} defaultValue={myPlace.website} />}
          </Field>
          <Notice>{t('gastro.profile.baseNotice')}</Notice>
        </Section>

        <Section title={t('gastro.profile.sectionDescription')}>
          <Field label={t('gastro.profile.about')} count={charCount(about, 500)}>
            {(id) => <Textarea id={id} rows={6} maxLength={500} value={about} onChange={(e) => setAbout(e.target.value)} />}
          </Field>

          <Field label={t('gastro.profile.cuisine')}>
            <div className="row-wrap">
              {CUISINES.map((c) => (
                <Chip key={c} active={cuisines.includes(c)} onClick={() => toggleCuisine(c)}>{c}</Chip>
              ))}
            </div>
          </Field>

          <Field label={t('gastro.profile.priceRange')}>
            <div className="row" style={{ gap: 'var(--sp-2)' }}>
              {PRICE_LEVELS.map((p) => (
                <Button key={p} variant={price === p ? 'primary' : 'secondary'} onClick={() => setPrice(p)}>{p}</Button>
              ))}
            </div>
          </Field>
        </Section>

        <Section title={t('gastro.profile.sectionImages')}>
          <Field label={t('gastro.profile.cover')}>
            <div className="cover" style={{ borderRadius: 'var(--r-card)', height: 200 }}>
              <Image size={32} />
            </div>
            <div className="row" style={{ marginTop: 'var(--sp-2)' }}>
              <Button variant="secondary" size="sm">{t('gastro.profile.replace')}</Button>
              <Button variant="quiet" size="sm">{t('gastro.profile.remove')}</Button>
            </div>
          </Field>

          <Field label={t('gastro.profile.moreImages')} hint={t('gastro.profile.moreImagesHint')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 'var(--sp-2)' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="thumb-placeholder" style={{ aspectRatio: '1', width: '100%', height: 'auto' }}>
                  <Image size={20} />
                </span>
              ))}
              <button type="button" className="dropzone dropzone-sm" style={{ aspectRatio: '1' }}>
                <Plus size={20} />
              </button>
            </div>
          </Field>
        </Section>

        <Section title={t('gastro.profile.sectionHours')}>
          <HoursEditor />
          <Button variant="secondary" onClick={() => setSpecialOpen(true)}>{t('gastro.profile.addSpecialHours')}</Button>
        </Section>

        <Section title={t('gastro.profile.sectionFeatures')}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 var(--sp-4)' }}>
            {FEATURES.map((f) => (
              <Checkbox key={f} label={t(`features.${f}`)} defaultChecked={myPlace.features.includes(f)} />
            ))}
          </div>
        </Section>
      </div>

      <SpecialHoursDialog open={specialOpen} onClose={() => setSpecialOpen(false)} />
    </GastroShell>
  )
}

function SpecialHoursDialog({ open, onClose }) {
  const [closed, setClosed] = useState(true)
  const toast = useToast()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('gastro.profile.specialDialog.title')}
      actions={
        <ModalActions onCancel={onClose}>
          <Button variant="primary" onClick={() => { onClose(); toast(t('toast.saved')) }}>{t('common.save')}</Button>
        </ModalActions>
      }
    >
      <div className="stack-3">
        <Field label={t('gastro.profile.specialDialog.date')} required>
          {(id) => <Input id={id} type="date" />}
        </Field>
        <div className="row-between">
          <span className="t-body">{t('gastro.profile.specialDialog.closed')}</span>
          <Switch checked={closed} onChange={setClosed} label={t('gastro.profile.specialDialog.closed')} />
        </div>
        {!closed && (
          <div className="row" style={{ gap: 'var(--sp-2)' }}>
            <input className="input" type="time" defaultValue="12:00" aria-label={t('hours.from')} />
            <span className="c-secondary">–</span>
            <input className="input" type="time" defaultValue="18:00" aria-label={t('hours.to')} />
          </div>
        )}
        <Field label={t('gastro.profile.specialDialog.reason')}>
          {(id) => <Input id={id} placeholder="z. B. Heiligabend" />}
        </Field>
      </div>
    </Modal>
  )
}
