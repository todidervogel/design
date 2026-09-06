import { useState } from 'react'
import { Search, X } from 'lucide-react'
import {
  Button, Chip, Field, Modal, ModalActions, StarInput, Stars, Stepper, Textarea,
  charCount, ratingLabel,
} from '../../components/ui'
import { Page } from '../../components/layout'
import { useNavigate } from 'react-router-dom'
import { dishes } from '../../mock/content'
import { t } from '../../i18n'

const CATEGORIES = [
  { key: 'food', label: t('rating.food') },
  { key: 'service', label: t('rating.service') },
  { key: 'price', label: t('rating.priceValue') },
]

/** E.5 — Bewertung, Schritt 4 */
export default function UploadReview() {
  const [stars, setStars] = useState({ food: 4, service: 5, price: 3 })
  const [hot, setHot] = useState('yes')
  const [group, setGroup] = useState(2)
  const [picked, setPicked] = useState([{ name: 'Pizza Margherita', stars: 5 }])
  const [text, setText] = useState('')
  const [skipOpen, setSkipOpen] = useState(false)
  const navigate = useNavigate()

  const addDish = (name) =>
    setPicked((list) => (list.some((d) => d.name === name) ? list : [...list, { name, stars: 0 }]))

  return (
    <Page title={t('upload.review.title')} footer={false}>
      <div style={{ paddingBlock: 'var(--sp-6) 140px', maxWidth: 640 }} className="stack-8">
        <div>
          <h1 className="t-h1">{t('upload.review.title')}</h1>
          <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>{t('upload.review.subtitle')}</p>
        </div>

        {/* Block 1 — Sterne */}
        <section className="stack-4">
          {CATEGORIES.map(({ key, label }) => (
            <div key={key}>
              <div className="row-between">
                <span className="t-body-bold">{label}</span>
                <Button variant="quiet" size="sm" onClick={() => setStars((s) => ({ ...s, [key]: 0 }))}>
                  {t('common.skip')}
                </Button>
              </div>
              <StarInput value={stars[key]} onChange={(v) => setStars((s) => ({ ...s, [key]: v }))} label={label} />
              {stars[key] > 0 && <p className="t-small c-secondary">{ratingLabel(stars[key])}</p>}
            </div>
          ))}
        </section>

        {/* Block 2 — Details */}
        <section className="stack-4">
          <div>
            <p className="field-label">{t('upload.review.hotLabel')}</p>
            <div className="row" style={{ gap: 'var(--sp-2)' }}>
              {[['yes', t('common.yes')], ['no', t('common.no')], ['unknown', t('common.dontKnow')]].map(([v, label]) => (
                <Button key={v} variant={hot === v ? 'primary' : 'secondary'} onClick={() => setHot(v)}>{label}</Button>
              ))}
            </div>
          </div>

          <div>
            <p className="field-label">{t('upload.review.groupLabel')}</p>
            <Stepper value={group} onChange={setGroup} />
          </div>
        </section>

        {/* Block 3 — Bestellte Gerichte */}
        <section className="stack-3">
          <p className="field-label">{t('upload.review.dishesLabel')}</p>

          <div className="header-search" style={{ maxWidth: 'none' }}>
            <Search size={18} className="search-icon" />
            <input className="input" style={{ height: 44 }} placeholder={t('upload.review.dishesPlaceholder')} aria-label={t('upload.review.dishesLabel')} />
          </div>

          <div className="row-wrap">
            {dishes.slice(0, 4).map((d) => (
              <Chip key={d.id} onClick={() => addDish(d.name)}>+ {d.name}</Chip>
            ))}
          </div>

          <div className="stack-2">
            {picked.map((d, i) => (
              <div className="card row-between" key={d.name} style={{ flexWrap: 'wrap' }}>
                <span className="t-body-bold grow">{d.name}</span>
                <StarInput
                  compact
                  value={d.stars}
                  onChange={(v) => setPicked((list) => list.map((x, xi) => (xi === i ? { ...x, stars: v } : x)))}
                  label={d.name}
                />
                <button
                  type="button"
                  aria-label={t('upload.review.removeDish')}
                  onClick={() => setPicked((list) => list.filter((_, xi) => xi !== i))}
                  className="btn btn-icon"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <Button variant="quiet" style={{ marginLeft: -8 }}>{t('upload.review.addDish')}</Button>
          <p className="t-small c-secondary">{t('upload.review.dishHint')}</p>
        </section>

        {/* Block 4 — Text */}
        <section>
          <Field label={t('upload.review.textLabel')} count={charCount(text, 1000)}>
            {(id) => (
              <Textarea
                id={id}
                rows={5}
                maxLength={1000}
                placeholder={t('upload.review.textPlaceholder')}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            )}
          </Field>
        </section>
      </div>

      <div className="action-bar" style={{ position: 'fixed', bottom: 68, left: 0, right: 0, padding: 'var(--sp-3) var(--gutter)' }}>
        <Button variant="quiet" onClick={() => setSkipOpen(true)}>{t('common.skip')}</Button>
        <Button variant="primary" to="/upload/veroeffentlichen">{t('common.next')}</Button>
      </div>

      <Modal
        open={skipOpen}
        onClose={() => setSkipOpen(false)}
        title={t('upload.review.skipDialog.title')}
        description={t('upload.review.skipDialog.text')}
        actions={
          <ModalActions onCancel={() => setSkipOpen(false)} cancelLabel={t('upload.review.skipDialog.cancel')}>
            <Button variant="primary" onClick={() => navigate('/upload/veroeffentlichen')}>
              {t('upload.review.skipDialog.confirm')}
            </Button>
          </ModalActions>
        }
      />
    </Page>
  )
}
